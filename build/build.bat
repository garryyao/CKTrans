@echo off

if "%ANT_HOME%"=="" goto noAntHome
if "%JAVA_HOME%"=="" goto noJavaHome
ant -buildfile build.xml
goto end

:noAntHome
echo ANT_HOME environment variable is not set
goto end

:noJavaHome
echo JAVA_HOME environment variable is not set

:end
