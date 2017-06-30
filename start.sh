#!/bin/bash
browserify . -o ./build/main.min.js
cleancss -o ./build/main.min.css ./css/main.css
node server.js
