# This file is run during the user setup. It is only run once.
# It takes a user's username and master password, then hashes the password.
# The user will have to provide this master password whenever they wish to access the vault.

'''
TO DO:

Create a check to see if a user profile exists, and warn user against ovewriting profile.
for security reasons, user shouldn't  be able to overwrite if they don't know the master password
Clean up/define where user profile gets stored

'''
import bcrypt
import os
from pathlib import Path


def digit_in_string(string_check): # return true if string includes digit
    return any(i.isdigit() for i in string_check)

def setup_user_master_pass():
    alphanumer_set = ['@','!','#','$','%','^','&','*','(',')','_','-','?']

    while True:
        try:
            username = input("Enter your username: \n")
        except ValueError:
            print("Sorry. Please use only standard keyboard input.\n")
            continue
        if ' ' in username:
            print("Sorry. Please input a username without spaces.\n")
            continue
        else:
            break

    while True:
        try:
            master_pass = input("Enter your master password.\nThis should be larger than 8 characters, include a number, and a special character: \n")
        # check if this meets password requirements
        except ValueError:
            print("Sorry. Please use only standard keyboard input.\n")
            continue
        if ' ' in username:
            print("Sorry. Please input a username without spaces\n")
        if len(master_pass) <= 8: 
            print("Sorry. Please enter a password length larger than 8.\n")
            continue
        if not digit_in_string(master_pass):
            print("Please include a number in your password.\n")
            continue
        if not any(char in alphanumer_set for char in master_pass):
            print("Please include an expected special character in your passsword.\n")
        else:
            break
    
    # hash master password securely, with salt, using bcrypt
    master_pass = master_pass.encode()
    pass_salt = bcrypt.gensalt()
    hashed_mp = bcrypt.hashpw(master_pass,pass_salt)
    print(username + " " + str(hashed_mp))
    # return these things to be saved in the database upon setup
    return hashed_mp, username


    # save username and master password (hashed!) combination
#    Path('/programFiles/').mkdir(parents=True, exist_ok=True)
# the above line was creating a directory, but had permission errors
#    file = open('user_info.txt','w+')
#    file.write(username + '\n' + str(hashed_mp))
#    file.close()

if __name__=="__main__":
    setup_user_master_pass()