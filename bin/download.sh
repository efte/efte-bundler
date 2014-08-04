#!/usr/bin/sh

zipPath=$1
localPath=$2

cd "$localPath"
wget "$zipPath"
unzip *.zip
rm *.zip
