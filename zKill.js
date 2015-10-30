function log(m){WScript.Echo(m);}
function done(m){if(m)log(m);WScript.Quit(0);}

var gSVC = GetObject( "winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2");

for (var i = 0 ; i < WScript.Arguments.length ; ++i ) {
  var arg = WScript.Arguments(i);
  log("looking for names like:  '"+arg+"%'");
  var processesColl = gSVC.ExecQuery("Select * from Win32_Process where name like '"+arg+"%'");

  for ( var processes=new Enumerator(processesColl) ; !processes.atEnd() ; processes.moveNext() ) {
    var process = processes.item();
    var name = process.name;
    log( "  "+process.name+":  "+process.executablePath );
    process.terminate();
  }
}


done('done');
