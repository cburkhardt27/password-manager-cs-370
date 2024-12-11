# Password Manager - Build Instructions for macOS

---

## Instructions

### Clone the Repository
Clone this GitHub repository and checkout the proper branch:  
```bash
git clone https://github.com/cburkhardt27/password-manager-cs-370.git
git checkout mac_download
```
Setup your MacOS Python Environment
```bash
python3 -m venv mac_venv
source mac_venv/bin/activate
pip3 install -r requirements.txt
```
*Note: You may need to use python/pip instead of python3/pip3 depending on your PATH variables.*  

Install Front-End Dependencies
```bash
npm install
```
_Note: you will need to download node.js if you have not already done so. Start here: https://nodejs.org/en_  

Package the Application Pages and Main Process
```bash
npm run pack:r
npm run pack:m
```
Start the Application
```bash
npm run start:e
```

If the application does not launch correctly, there is likely a mis-synchronization of the inter-process commmunication between Flask and Electron We have provided another main file: `alternative_main.js` in the /main folder. To start debugging debug, consider copy-pasting `alternative_main.js` into `main.js`, repack your application  `npm run pack:m` `npm run pack:r` and relaunching the program.

Build the DMG File
```bash
npm run make
```
_**Note: this final build step is not fully debugged.** The .dmg file may contain errors. Refer to our 'Future Work' section of project documentation for more information._

# Advanced Instructions / Installation

## Build and Setup Scripts

Scripts are managed through package.json, which uses Electron Forge for building the desktop application.  
To view other build/setup scripts:  
`npm run`  

These include:  
`build:dev` & `start:dev`: Development environment for React/Electron renderer. Not recommended for pages interacting with backend.  
`start:e`: Starts Electron.  
`pack:m`: Webpack for main.js and preload.js. Outputs to the pack folder.  
`pack:r`: Webpack for React/renderer pages. Outputs to the pack folder.  
`package`: Creates an Electron executable.  
`make`: Builds the installer.  
