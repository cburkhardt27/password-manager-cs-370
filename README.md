Rather than downloading our convenienty-packaged DMG, you can build this project on your on MacOS.
You can launch or program from terminal, or package it into a desktop application.

Instructions:
Clone this github repository into your own repo and checkout the proper branch
    git clone https://github.com/cburkhardt27/password-manager-cs-370.git
    git checkout mac_download
Setup your mac-based python environment:
    python3 -m venv mac_venv
    source mac_venv/bin/activate
    pip3 install -r requirements.txt
  (*debugging notes: you may wish to use python/pip instead of python3/pip3, depending on your PATH variables.*)
Install front end dependencies:
    npm install
Package the application pages and main:
    npm run pack:m
    npm run pack:r
Start the application:
    npm run start:e

If you wish to create a desktop application:
    npm run make
    (*Files will be found in /out; there will be both .app and .dmg output. Click through the folders until you find the .dmg file. Install this file*)


Advanced Instructions/Installation:

Scripts are sourced through package.json, which calls electron forge when building the desktop application.
To view other build/setup scripts: 
    npm run
These other scripts include:
    build:dev & start:dev: Development environment for React/Electron renderer. Not recommended for pages that work with the back end.
    start:e: Starts electron.
    pack:m: Webpack for main.js and preload.js. Outputs to the pack folder.
    pack:r: Webpack for React/renderer pages. Outputs to the pack folder.
    package: Electron exe.
    make: Installer.
