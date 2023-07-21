#!/bin/env bash

# CONSTANTS DEF
# TODAYDATE: date to identify files
# DOWN_PATH: download path
# JSON_FILE: download json file
# DOWN_FILE: download image file
# REGEX_URL: regex to extract image url for download
TODAYDATE=$(date +%Y%m%d)
DOWN_PATH=$HOME/Pictures/bing
JSON_FILE=${DOWN_PATH}/json/${TODAYDATE}.json
DOWN_FILE=${DOWN_PATH}/past/${TODAYDATE}.jpg
REGEX_URL=",\"url\":\"([^\"]+)\",\"urlbase\":"
REEGXDATE="\"startdate\":\"${TODAYDATE}\""

# If these file are here, we are good
if [[ -s $JSON_FILE && -s $DOWN_FILE ]]; then
    echo "work done!"
    exit 1
fi

echo "Downloading Json data"
# Get The Json File
wget -O $JSON_FILE "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&nc=1612409408851&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160"
echo "Downloaded Json data"

if [[ ! -s $JSON_FILE ]]; then
    echo "json file corrupted"
    exit 1;
fi

# echo $JSON_FILE
JSON_TEXT=`cat $JSON_FILE`
if [[ ! $JSON_TEXT =~ $REEGXDATE ]] || [[ ! $JSON_TEXT =~ $REGEX_URL ]]; then
    echo "json file corrupted"
    exit 1
fi

# Get The Image File
wget -O $DOWN_FILE "https://cn.bing.com${BASH_REMATCH[1]}"
if [[ ! -s $DOWN_FILE ]]; then
    echo "image file corrupted"
    exit 1;
fi

### move it to your wallpapaer directory
cp $DOWN_FILE $DOWN_PATH/bing.jpg

### restart your wallpaper engine
pkill hyprpaper && nohup hyprpaper &