# Password Manager (a CS 370 Project)
Presented by the Password People - a locally-hosted, containerized, sql-based password manager.  

# Overview 
This password manager uses a SQLite database to store securely-encrypted passwords. The database is accessed by a Flask API that links the backend database and custom-created cryptography module with an Electron/Node.js front end that the user can access given that they provide a secure Master Password. This stack is packaged by Forge into a Windows executable that allows the user to launch the application and manage their passwords from a convenient desktop executable.  

Please download the Windows installer file from our most recent release (v4) — under the Releases section of our repository. Follow the installation instructions in the `windows-release` branch of the repository, where there is a setup and FAQ.  

**The Windows executable and overall stack is the most stable version of this project.** Use this for running and evaluating the project. The Mac password manager — packaged in a DMG file — is a work in progress. The Mac project works well in some instances but crashes in others, largely depending on the individual machine it is run on. This has to do with whether or not the machine settings allow the Flask API to properly connect with the database and whether the machine launches the DB in sync with the front-end packaging. The Mac version currently builds and generates a DMG, but the DMG does not always (reliably) launch properly. Refinement of the Mac branch - among other development items - is a part of future development goals. You can run the Mac version from the terminal. Se the `mac_download` branch for setup instructions, debugging, and FAQ.  

# Version Control & History
Refer to this `main` branch for our demonstration video and a PDF of our documentation. Installation instructions are listed in the PDF and in the branches for both Windows and Mac. 

# Version Control & History
Other branches on this repo represent prior iterations of the codebase. Unless you're interested in history for posterity's sake, you should ignore them. If you're trying to track version history of this project, we started with main and eventually branched into `built-new`. Then we refactored our database into sqlite, prompting the `sqlite` branch and eventually `sqlite-new`. We added `another-one` during integration. When we decided to redo the front end, this got hosted on a spike in this [github repository ]([url](https://github.com/michi-okahata/toy-password-manager)) (https://github.com/michi-okahata/toy-password-manager). We integrated those changes back into this repo under `windows` and `mac_download`. In an attempt at cleaning up a now hopelessly out of date main page, we decided to make the main branch our documentation page. :).
