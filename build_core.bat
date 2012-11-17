@echo off

echo Core build
echo ==========
echo.

for %%a in (%1) do set __OutDir=%%~a
for %%a in (%2) do set __BuildNumber=%%~a

echo Output directory:  "%__OutDir%"
echo Build number:      "%__BuildNumber%"
echo.

echo Executing grunt...
start /B /WAIT grunt.cmd
echo.
