'use strict';

function IndexedItem(id, value) {
  this.id = id;
  this.value = value;
}

IndexedItem.prototype.compareTo = function (other) {
  var c = this.value.compareTo(other.value);
  c === 0 && (c = this.id - other.id);
  return c;
};

function PriorityQueue (capacity) {
  this.items = new Array(capacity);
  this.length = 0;
}

PriorityQueue.prototype.isHigherPriority = function (left, right) {
  return this.items[left].compareTo(this.items[right]) < 0;
};

PriorityQueue.prototype.percolate = function (index) {
  if (index >= this.length || index < 0) { return; }
  var parent = index - 1 >> 1;
  if (parent < 0 || parent === index) { return; }
  if (this.isHigherPriority(index, parent)) {
    var temp = this.items[index];
    this.items[index] = this.items[parent];
    this.items[parent] = temp;
    this.percolate(parent);
  }
};

PriorityQueue.prototype.heapify = function (index) {
  +index || (index = 0);
  if (index >= this.length || index < 0) { return; }
  var left = 2 * index + 1,
      right = 2 * index + 2,
      first = index;
  if (left < this.length && this.isHigherPriority(left, first)) {
    first = left;
  }
  if (right < this.length && this.isHigherPriority(right, first)) {
    first = right;
  }
  if (first !== index) {
    var temp = this.items[index];
    this.items[index] = this.items[first];
    this.items[first] = temp;
    this.heapify(first);
  }
};

PriorityQueue.prototype.peek = function () { return this.items[0].value; };

PriorityQueue.prototype.removeAt = function (index) {
  this.items[index] = this.items[--this.length];
  this.items[this.length] = undefined;
  this.heapify();
};

PriorityQueue.prototype.dequeue = function () {
  var result = this.peek();
  this.removeAt(0);
  return result;
};

PriorityQueue.prototype.enqueue = function (item) {
  var index = this.length++;
  this.items[index] = new IndexedItem(PriorityQueue.count++, item);
  this.percolate(index);
};

PriorityQueue.prototype.remove = function (item) {
  for (var i = 0; i < this.length; i++) {
    if (this.items[i].value === item) {
      this.removeAt(i);
      return true;
    }
  }
  return false;
};

PriorityQueue.count = 0;

module.exports = PriorityQueue;
