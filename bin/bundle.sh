#!/usr/bin/sh

localPath=$1
destPath=$2

cd "$localPath"
zip -r localpackage.zip * 

cp localpackage.zip "$destPath"