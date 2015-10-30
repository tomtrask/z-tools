# z-tools
Command line tools for windows.

Consider doing 'cscript /h:cscript' before running anything with a .js extension, otherwise you'll have to run everything as 'cscript {appname including the .js}'.  It's not fun and that's kind of the opposite of a tool.

tool | usage
---- | ---------------------
zBackup.js | zBackup {folder to back up} (copies all files in folder to someplace (read the code) with an extension reflecting the date of the backup)
zClearTemp.js | zCleartemp (removes all files from %temp)
zKill.js | zKill {partial executable name} (kills all process with names that match the partial name - no regex)
zUninstallAll.cmd | zUninstallAll (run from folder with node_modules and package.json to uninstall all installed packages --- this gets around path limits in windows command line)
zUnlog.js | zUnlog (um...probably kind of specific to development.  Deletes common log files from common locations)
zWhatConfig.js | zWhatConfig (which file like standalone.xml matches standalone.xml?  this is another developer tool)

All the apps that delete files do a pre-order tree traversal and delete files individually so they don't crap out if one specific file can't be removed for some reason.

