:: copy all source to shadow (folder on a shared drive)
@echo off

:: set dir.shadow={someplace}
if .%dir.shadow%==. goto usage

if not .%1==. goto default

call %~f0 .
goto end

:default
echo some args: %~n1

setlocal
SET SD=%dir.shadow%\%~n1
robocopy . %SD% /S /XD dist node_modules components /XF *.swp
:: robocopy /S src\css %SD%\src\css 
endlocal
goto end

:usage
echo Usage:
echo   set dir.shadow={place to put shadow}
echo   %~n0 [folder]
goto end

:end
echo done
