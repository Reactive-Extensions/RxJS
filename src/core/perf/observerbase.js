	function ObserverBase(o) {
		this.o = o;
		this.isStopped = false;
	}  
	
	ObserverBase.prototype.onError = function (err) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.o.onError(err);
    }
  };
  ObserverBase.prototype.onCompleted = function () {
    if (!this.isStopped) {
      this.isStopped = true;
      this.o.onCompleted();
    }
  };
  ObserverBase.prototype.dispose = function () { this.isStopped = true; };
  ObserverBase.prototype.fail = function (e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.o.onError(e);
      return true;
    }
    return false;
  };