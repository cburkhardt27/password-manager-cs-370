## Installation From Downloadable Windows Installer
Download version 4 of our password-manager release on the github: https://github.com/cburkhardt27/password-manager-cs-370/releases  
1. Follow the installer’s setup installation steps.  
_(You may need to instruct your computer to “Trust This File” prior to installation. This is not necessarily due to security design problems in the executable, but rather because we have not signed our code with a recognized code certificate that Windows might be expecting.)_  
2. Launch the program from Desktop.  
3. Run the file as an administrator. The password manager should launch!  

If the program window does not launch, this may be due to the file permissions configuration of your individual Windows computer. Our program launches an API server (Flask) that connects the UI to the SQLite database. Depending on the individual Windows version your computer runs on, Windows may or may not give the user permissions automatically to simultaneously launch the server alongside the front end.  

There are a variety of fixes:  
1. Make sure you are running the password-manager program as administrator. This should ensure all components have the correct permissions to launch.	  
2. Manually launch the Flask Server executable stored in App Data.  
Navigate to
`:C:Users/<YourUserAccount>/AppData/Roaming/password-manager/db_flask_server.exe`
Double click on the db_flask_server.exe file. While this server is running, re-launch the password-manager desktop application. The password manager should launch!  _Please refer to our Documentation.pdf for reference photos._    

3. If your password manager still does not launch out, please reach out to our friendly and accessible support team! You can reach us at claire.burkhardt@emory.edu and michi.okahata@emory.edu. We provide speedy customer service responses and real-time debugging :)  



## Build and Terminal-Based Launch Instructions

### Clone the Repository
#### Option 1: Clone this GitHub repository and checkout the proper branch:  
```bash
git clone https://github.com/cburkhardt27/password-manager-cs-370.git
git checkout windows
```

#### Option 2: Download as a zip file
Download this repo as a zip file and extract to desired location

### Setup your Windows Python Environment
```bash
python -m venv win_venv
win_venv\Scripts\activate
pip install -r requirements.txt
```

### Install Front-End Dependencies
```bash
npm install
```
_If necessary, install Node.js on your computer. Refer to: https://nodejs.org/en_  
### Package the Application Pages and Main Process
```bash
npm run pack:r
npm run pack:m
```
### Start the Application
```bash
npm run start:e
```
### Build the Application for Desktop
```bash
npm run make
```
### Additional Information

Once completing the last step, the terminal should print a message of the directory of where the excutable 
file can be found. To open the app through the executable, go to this directory in your files and and open
the file. The exectuable file should be named 'sprint-final-1.0.0 Setup'. You might have to go through a 
squirrel.windows folder and then a x64 folder to get to this file.

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


