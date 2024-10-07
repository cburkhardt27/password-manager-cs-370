# This file includes all encryption functionality apart from setup script

import bcrypt

#Validate a user’s submitted master password against the stored salted hash
def query_master_password(submitted_username, submitted_password):
    file = open('user_info.txt','r')
    data = file.readlines()
    if data[0] == submitted_username: # if usernames match, check passwords
        if bcrypt.checkpw(submitted_password, data[1]):
            print("Login successful.\n")
            return True
    file.close()
    print("User and password combination not recognized. Please try again \n")
    return False










def main():

    return


if __name__=="__main__":
    main()