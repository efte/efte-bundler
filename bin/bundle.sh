#!/usr/bin/sh

localPath=$1
destPath=$2

cd "$localPath"
zip -r localpackages.zip * 

cp localpackages.zip "$destPath"