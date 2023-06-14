#!/usr/bin/env bash

echo Cleaning started

#rm -rf ios/Pods
rm -rf node_modules
rm -rf ios/build
rm -rf android/app/build
watchman watch-del-all
rm -rf /tmp/metro-cache
npm cache clean --force

echo Cleanup finished
