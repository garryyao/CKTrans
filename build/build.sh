#!/usr/bin/env bash
if [ ! -n "$ANT_HOME" ] ; then
	echo "ANT_HOME environment variable is not set";
elif [ ! -n "$JAVA_HOME" ] ; then
	echo "JAVA_HOME environment variable is not set";
else
	ant -buildfile build.xml
fi;
