:: Created by npm, please don't edit manually.
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\semver\bin\semver" %*
) ELSE (
  node  "%~dp0\..\semver\bin\semver" %*
)