function log(m) {WScript.Echo(m);}
function done(m) {log(m);WScript.Quit(1);}

function canCopyTo( folderName )
{
    return !gFSO.folderExists( folderName ) && !gFSO.fileExists( folderName );
}

function backup( folder, backupToName )
{
    var destFolder = gFSO.createFolder( backupToName );
    var copyCount = 0;

    var enumFiles = new Enumerator( folder.files );
    while ( !enumFiles.atEnd() )
    {
        var file = enumFiles.item();
        var newName = backupToName + "\\" + file.name;
        try {
          file.copy( newName );
        } catch ( e ) {
          log("Something went wrong copying '"+file.name+"' to '"+newName+"'");
        }
        ++copyCount;
        enumFiles.moveNext();
    }

    var enumFolders = new Enumerator( folder.subFolders );
    while ( !enumFolders.atEnd() )
    {
        var subFolder = enumFolders.item();
        var newName = backupToName + "\\" + subFolder.name;
        copyCount += backup( subFolder, newName );
        enumFolders.moveNext();
    }
    
    return copyCount;
}


var gFSO = new ActiveXObject( "scripting.filesystemobject" );

var args = WScript.Arguments;

for (i = 0; i < args.length; i++)
{
    var arg = args(i);
    log( arg );
    var d = new Date();
    var m = d.getMonth()+1;
    var dom = d.getDate();
    var mins = d.getMinutes();
    var hours = d.getHours();
    
    if ( !gFSO.folderExists( arg ) )
        done( arg+" is not a folder." );

    var srcFolder = gFSO.getFolder(arg);
    var completeBase = srcFolder.parentFolder.path;
    var lastPart = srcFolder.name;

    var destBaseName = completeBase + "\\" + lastPart;
    var extension = "-"+d.getYear()+"-"+(m<10?"0":"")+m+"-"+(dom<10?"0":"")+dom;
    if ( !canCopyTo( destBaseName + extension ) )
    {
        extension += "-"+hours+(mins<10?"0":"")+mins;
        if ( !canCopyTo( destBaseName + extension ) )
        {
            var secs = d.getSeconds();
            extension += (secs<10?"0":"")+secs;
            if ( !canCopyTo( destBaseName + extension ) )
                done( "folder already exists:  "+destBaseName + extension );
        }
    }
    var destFolderName = destBaseName + extension;

    var shell = WScript.CreateObject("WScript.Shell");
    //  var r = shell.Popup( "Will copy:  "+srcFolder.path+"\nto:  "+destFolderName, 30, "random message", 1 );
    var r = shell.Popup( "Will copy:  "+srcFolder.path+"\nto:  "+destFolderName, 30, "random message", 1 );
    if ( r == 1 )
    {
        var did = backup( srcFolder, destFolderName );
        log( "Copied "+did+" files." );
    }
    else
        log( "Dodged a bullet" );
}
