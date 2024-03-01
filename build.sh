#!/bin/bash

npm i
rm -rf dist/
mkdir dist/
mkdir dist/style
mkdir dist/js
node_modules/.bin/tsc -p scripts/
node_modules/.bin/sass --style=compressed style/style.scss > dist/style/style.css

cp -R assets dist/assets/
cp js/build.js dist/js/build.js
cp index.html dist/index.html