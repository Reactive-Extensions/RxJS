function include(jsFile) {
  var fso = new ActiveXObject("Scripting.FileSystemObject"),
    f = fso.OpenTextFile(jsFile, 1),
    s = f.ReadAll();
  f.Close();
  return s;
}

eval(include("..\\..\\dist\\rx.all.js"));

function next(x) {
  WScript.Echo(x);
}

Rx.Observable.timer(500).subscribe(next);
