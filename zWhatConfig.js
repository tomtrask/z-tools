function log(s) {WScript.Echo(s)}
var gFSO = new ActiveXObject('scripting.filesystemobject')

var configFileName = 'standalone.xml'
if (WScript.Arguments.length > 0) {
  configFileName = WScript.Arguments.item(0)
}
var baseStandalone = /^standalone\.xml$/i

log('Looking for files similar to '+configFileName)
if (gFSO.FileExists(configFileName)) {

  var baseName = configFileName.substring(0,configFileName.indexOf('.'))
  var ext = configFileName.substring(configFileName.indexOf('.')+1)
  var reExt = new RegExp('\.'+ext+'$', 'i')

  var configFile = gFSO.getFile(configFileName)
  var configFileSize = configFile.size
  var match = reExt.test(configFileName)
  var folder = gFSO.getFolder('.')
  for (var filesEnum = new Enumerator(folder.files) ;
       !filesEnum.atEnd() ;
       filesEnum.moveNext()) {
    var file = filesEnum.item()
    var reStr = '^.*'+baseName+'.*\.'+ext+'$'
    var reStandalone = new RegExp(reStr, 'i')
    if (reStandalone.test(file.name) && !baseStandalone.test(file.name)
        && configFileSize == file.size) {
      log('    possible match: '+file.name+' file size is '+file.size)
    }
  }
  log('we are done')
} else {
  log('we didn\'t even find the one "'+configFileName+'".  You sure you spelled that right?')
}
