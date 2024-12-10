# Password Manager (a CS 370 Project)
Presented by the Password People - a locally-hosted, containerized, sql-based password manager.  

# Overview 
This password manager uses a SQLite database to store securely-encrypted passwords. The database is accessed by a Flask API that links the backend database and custom-created cryptography module with an Electron/Node.js front end that the user can access given that they provide a secure Master Password. This stack is packaged by Forge into a Windows executable that allows the user to launch the application and manage their passwords from a convenient desktop executable.  

Please download the Windows installer file from our most recent release (v4) — under the Releases section of our repository. Follow the installation instructions in the `windows-release` branch of the repository, where there is a setup and FAQ.  

**The Windows executable and overall stack is the most stable version of this project.** Use this for running and evaluating the project. The Mac password manager — packaged in a DMG file — is a work in progress. The Mac project works well in some instances but crashes in others, largely depending on the individual machine it is run on. This has to do with whether or not the machine settings allow the Flask API to properly connect with the database and whether the machine launches the DB in sync with the front-end packaging. The Mac version currently builds and generates a DMG, but the DMG does not always (reliably) launch properly. Refinement of the Mac branch - among other development items - is a part of future development goals. You can run the Mac version from the terminal. Se the `mac_download` branch for setup instructions, debugging, and FAQ.  

# Installation Instructions (Windows)
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
Double click on the db_flask_server.exe file. While this server is running, re-launch the password-manager desktop application. The password manager should launch!  
_Refer to our Documentation.pdf for reference photos._    

3. If your password manager still does not launch out, please reach out to our friendly and accessible support team! You can reach us at claire.burkhardt@emory.edu and @michi.okahata@emory.edu. We provide speedy customer service responses and real-time debugging :)  


# Documentation
Refer to this `main` branch for our demonstration video and a PDF of our documentation. Installation instructions are listed in the PDF and in the branches for both Windows and Mac. 

# Version Control & History
Other branches on this repo represent prior iterations of the codebase. Unless you're interested in history for posterity's sake, you should ignore them. If you're trying to track version history of this project, we started with main and eventually branched into `built-new`. Then we refactored our database into sqlite, prompting the `sqlite` branch and eventually `sqlite-new`. We added `another-one` during integration. When we decided to redo the front end, this got hosted on a spike in this [github repository ]([url](https://github.com/michi-okahata/toy-password-manager)) (https://github.com/michi-okahata/toy-password-manager). We integrated those changes back into this repo under `windows` and `mac_download`. In an attempt at cleaning up a now hopelessly out of date main page, we decided to make the main branch our documentation page. :).
