/// <reference path="compiler.ts" />
var Tests = (function () {
    function Tests(element) {
        this.element = element;
    }
    Tests.prototype.start = function () {
        var e = Expression.add(Expression.constant(1), Expression.constant(2));
        var l = Expression.lambda(e);
        var c = l.compileToFunction();
        var f = l.compile();
        var b = l.toBonsai();
        var x = f();
        this.element.innerHTML = "Eval(" + l + ") = Eval(" + c + ") = Eval(" + JSON.stringify(b) + ") = " + x;
    };
    return Tests;
})();
window.onload = function () {
    var el = document.getElementById('content');
    var tests = new Tests(el);
    tests.start();
};
/*
var resources =
  {
    "my://xs": [1, 2, 3, 4, 5],
    "my://ss": ["bar", "foo", "qux"],
    "rx://operators/filter": function (xs: any[], f: (any) => boolean) { return xs.filter(f); },
    "rx://operators/map": function (xs: any[], f: (any) => any) { return xs.map(f); },
  };

var x = Expression.Parameter("x");
var f1 =
  Expression.Invoke(
    Expression.Parameter("rx://operators/map"),
    Expression.Invoke(
      Expression.Parameter("rx://operators/filter"),
      Expression.Parameter("my://xs"),
      Expression.Lambda<(number) => boolean>(
        Expression.Equal(
          Expression.Modulo(
            x,
            Expression.Constant(2)
            ),
          Expression.Constant(0)
          ),
        x
        )
      ),
    Expression.Lambda<(number) => boolean>(
      Expression.Multiply(
        x,
        x
        ),
      x
      )
    );

var f2 =
  Expression.Invoke(
    Expression.Parameter("rx://operators/map"),
    Expression.Parameter("my://ss"),
    Expression.Lambda<(string) => string>(
      Expression.Call(
        x,
        "substring",
        Expression.Constant(1)
        ),
      x
      )
    );

var binder = new Binder(resources);

var b1 = Expression.Lambda<() => number[]>(binder.Visit(f1));
var c1 = b1.Compile();
var r1 = c1();
alert(r1.join(", "));

var b2 = Expression.Lambda<() => string[]>(binder.Visit(f2));
var c2 = b2.Compile();
var r2 = c2();
alert(r2.join(", "));
*/ 
//# sourceMappingURL=app.js.map