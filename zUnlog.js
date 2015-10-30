function log(m) {WScript.echo(m);}
function done(m) {if(m)log(m); WScript.quit(0);}

var gFSO = new ActiveXObject( "scripting.filesystemobject" );


var DOMAIN_NAME = "lmWorkshop";
var SERVER_NAME = "lmServer";

var wlLogPatterns = [
  /^access\.log$/,
  /^EmbeddedLDAP(Access)?\.log$/,
  /^rdbmsEG\.log$/,
  /^workshop(_debug|_errors)?\.log$/,
  /^wl-domain\.log\d{5}$/,
  /^netui\.log$/,
  /^wl-domain\.log$/,
  /^pointbase\.log$/,
  /^pointbaseShutdown\.log$/,
  /^jrockit\.\d{4}\.(du|md)mp$/,
  /^debuggerShutdown\.log$/,
  new RegExp("^"+SERVER_NAME+"\\.log(\\d{5})?$"),
  new RegExp("^"+SERVER_NAME+"\\.(heur\.)?\\d{4}\\.tlog$")
];

var jbossLogPatterns = [
  /^RRC_application/,
  /^RRC_daily_application/,
  /^RRC_file_application/,
  /^server\.log\.[\-0-9]{10}$/,
  /^boot\.log$/,
  /^server\.log$/,
  /^gc\.log.*$/
];

function clearLogs(folder, logPatterns) {
    for ( var en = new Enumerator(folder.files) ; !en.atEnd() ; en.moveNext() ) {
      var file = en.item();
      var name = file.name;
      for (var i in logPatterns) {
        var pattern = logPatterns[i];
        if (name.match(pattern)) {
          log("    deleting ["+i+"]:  '"+file.path+"'");
          try {
            //  log("    deleting file'"+file.path+"'");
            file.Delete(0);
          } catch (e) {
            log("Delete failed for "+file.name);
          }
          break;
        }
      }
    }

    for ( var en = new Enumerator(folder.SubFolders) ; !en.atEnd() ; en.moveNext() ) {
      var folder2 = en.item();
      clearLogs(folder2, logPatterns);
    }
}

function clear(rootFolderName, logPatterns) {
  var rootFolder = gFSO.getFolder(rootFolderName);
  log("Starting to clear logs in '"+rootFolder.path+"'");
  clearLogs(rootFolder, logPatterns);
}

var WL_ROOT = "c:/bea/user_projects/domains/"+DOMAIN_NAME;
var JBOSS_ROOT = "c:/Production/jboss-eap-6.0";
var JBOSS5_ROOT = "c:/Production/jboss-5.1.0.GA";
var JBOSS64_ROOT = "c:/Production/eap-6.4.0/";

clear(WL_ROOT, wlLogPatterns);
clear(JBOSS_ROOT+"/bin/logs", jbossLogPatterns);
clear(JBOSS_ROOT+"/standalone/log", jbossLogPatterns);
clear(JBOSS64_ROOT+"/standalone/log", jbossLogPatterns);
clear(JBOSS5_ROOT+"/server/default/log", jbossLogPatterns);

var junk = "c:/Production/jboss_reporting/reportsWeb/war/WEB-INF/lib/gwt-servlet.jar"
if (gFSO.fileExists(junk)) {
  gFSO.DeleteFile(junk)
  log('WE NEED TO DELETE THAT FILE')
}


done('done');
