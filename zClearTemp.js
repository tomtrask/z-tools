function log(m){WScript.Echo(m);}
function done(m){if(m)log(m);WScript.Quit(0);}

function Summer() {
  this.files = 0;
  this.size = 0;
}

Summer.prototype.add = function(files, size) {
    this.files += files;
    this.size += size;
}

Summer.prototype.addSum = function(sum) {
    this.files += sum.files;
    this.size += sum.size;
}

function clearFolderAsk( folder ) {
    var r = gShell.Popup( "Would you like to clear this folder:\n\n'"+folder.path+"'", 10, "Confirm", 3 );
    if ( r == 6 ) {
        var result = clearFolder( folder );
        log("From '"+folder.name+"' we deleted "+result.files+" files with a total size of "+result.size);
        return result;
    } else {
        log( "meh, skip it." );
    }
    return new Summer();
}


function clearFolderDontAsk(folder) {
    var result = clearFolder( folder );
    log("From '"+folder.name+"' we deleted "+result.files+" files with a total size of "+result.size);
    return result;
}


function clearFolder( folder ) {
    var total = new Summer();
    for ( var en = new Enumerator(folder.SubFolders) ; !en.atEnd() ; en.moveNext() ) {
        var f2 = en.item();
        //  log( f2.path );
        total.addSum(clearFolder(f2));
        try {
            f2.Delete();
        } catch ( e ) {
            log( "    could not delete folder:  "+f2.path );
        }
    }

    for ( var en = new Enumerator(folder.files) ; !en.atEnd() ; en.moveNext() ) {
        var file = en.item();
        var size = file.size;
        try {
            file.Delete(true);
            total.add(1,size);
        } catch ( e ) {
            log( "    could not delete file:  "+file.path );
        }
    }
    return total;
}


var gFSO = new ActiveXObject( "scripting.filesystemobject" );
var gShell = WScript.CreateObject("WScript.Shell");
var args = WScript.Arguments;
var userVars = gShell.Environment("user");


var stdLocations = {
    "jboss":"C:/Production/jboss-6.0.0.Final/server/default/tmp",
    "deferredjs":"c:/Production/jboss_totalview/totalviewWeb/war/app/deferredjs",
    "tmp" : gFSO.getFolder(userVars("TEMP"))
};



if ( args.length > 0 ) {
    doList = [];
    for (i = 0; i < args.length; i++) {
        var arg = args(i);
        if (stdLocations[arg]) {
            var rawArg = arg;
            arg = stdLocations[arg];
            if (gFSO.folderExists(arg))
                log(rawArg+" maps to "+arg);
        }
        if (gFSO.folderExists(arg)) {
            var folder = gFSO.getFolder(arg);
            var r = gShell.Popup( "Would you like to clear this folder:\n\n'"+folder.path+"'", 10, "Confirm", 3 );
            if ( r == 6 )
                doList[doList.length] = folder;
            //  clearFolderAsk(gFSO.getFolder(arg));
        } else {
            done("Unknown folder:  "+arg);
        }
    }
    
    for (i = 0 ; i < doList.length; ++i) {
        clearFolderDontAsk(doList[i]);
    }
} else {
    var userVars = gShell.Environment("user");
    clearFolderAsk( gFSO.getFolder(userVars("TEMP")) );
}

