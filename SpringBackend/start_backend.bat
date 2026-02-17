@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME is %JAVA_HOME% > startup_debug.log
java -version >> startup_debug.log 2>&1

echo EXECUTING BUILD... >> startup_debug.log
call "C:\tools\apache-maven-3.9.6\bin\mvn.cmd" clean install -DskipTests >> startup_debug.log 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo BUILD FAILED >> startup_debug.log
    exit /b %ERRORLEVEL%
)

echo STARTING RUN... >> startup_debug.log
call "C:\tools\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run >> startup_debug.log 2>&1
