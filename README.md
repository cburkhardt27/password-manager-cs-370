@ DOCUMENTATION PEOPLE ADD DOCUMENTATION FILES HERE TO THE README OR IN INDIVIDUAL FILES THAT YOU UPLOAD TO MAIN. THAT INCLUDES INSTALLATION INSTRUCTIONS AND FEATURE EXPLANATION / THE WRITEUP. ALSO PLEASE UPLOAD AND/OR EMBED THE VIDEO.

PLEASE DO THE TECHNICAL DOCUMENATATION FOR THE CODEBASE (CLEANING UP DEVELOPMENT/DEBUG COMMENTS AND DOCUMETNATING FUNCTIONS) IN THE CODEBASE FOR WINDOWS AND MAC.

YOU CAN DELETE THIS PART OF THE README WHEN DOCUMENTATION IS DONE.

# Password Manager (a CS 370 Project)
Presented by the Password People - a locally-hosted, containerized, sql-based password manager.

This main branch provides the download executable versions of our code, as well as documetnation and installation instructions. The downloads include:
1) a DMG file for MacOS
3) an executable for Windows OS

Please refer to the branches 'windows' and 'mac_download' for the most current working editions of our codebase. These codebases are nearly identical, but they rely on different Python environment variables due to OS differences and have different configuration settings in the front end in order to make the application run properly on each operating system. The differences and setup instructionsa are documented in each branch.

Other branches on this repo represent prior iterations of the codebase. Unless you're interested in history for posterity's sake, you should ignore them. If you're trying to track version history of this project, we started with main and eventually branched into `built-new`. Then we refactored our database into sqlite, prompting the `sqlite` branch and eventually `sqlite-new`. We added `another-one` during integration. When we decided to redo the front end, this got hosted on a spike in this [github repository ]([url](https://github.com/michi-okahata/toy-password-manager)) (https://github.com/michi-okahata/toy-password-manager). We integrated those changes back into this repo under `windows` and `mac_download`. In an attempt at cleaning up a now hopelessly out of date main page, we decided to make the main branch our documentation page. :).
