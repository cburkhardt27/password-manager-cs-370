Notes for documentation.

Scripts (package.json): npm run 'name'
build:dev & start:dev: Development environment for React/Electron renderer. Not recommended for pages that work with the back end.
start:e: Starts electron.
pack:m: Webpack for main.js and preload.js. Outputs to the pack folder.
pack:r: Webpack for React/renderer pages. Outputs to the pack folder.
package: Electron exe.
make: Installer.


# Password Manager - Build Instructions for Windows


## Instructions

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

