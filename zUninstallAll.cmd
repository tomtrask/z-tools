@echo off
for /D %%m in (node_modules\*) do if not '%%~nm'=='' npm uninstall %%~nm
