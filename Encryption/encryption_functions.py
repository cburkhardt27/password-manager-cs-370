# This file includes all encryption functionality apart from setup script

import bcrypt
from hashlib import pbkdf2_hmac
from Crypto.Cipher import AES
from base64 import b64encode, b64decode

#Validate a user’s submitted master password against the stored salted hash
def validate_master_password(submitted_username, submitted_password):
    file = open('user_info.txt','r')
    data = file.readlines()
    if data[0] == submitted_username: # if usernames match, check passwords
        if bcrypt.checkpw(submitted_password, data[1]):
    #        print("Login successful.\n")
            return True
    file.close()
#    print("User and password combination not recognized. Please try again \n")
    return False

def encode_new_password(plaintext): # this function not debugged
    file = open('user_info.txt','r')
    data = file.readlines()
    b_user = data[0]
    b_hashed_mp = data[1].enocde()
    file.close()    
    # derive a key that will be used to encrypt/decrypt newpassword
    # b_user * 3 is the salt; it is multiplied by 3 to meet length expectation (16 bytes)
    iter = 10000 # standard
    pass_key = pbkdf2_hmac('sha256', b_hashed_mp, b_user * 3, 10000)
    b_plaintext = str.encode(plaintext)

    cipher_obj = AES.new(pass_key, AES.MODE_EAX)
    nonce = cipher_obj.nonce
    # load data into the cipher
    ciphertext, tag = cipher_obj.encrypt_and_digest(b_plaintext)

    # store the nonce with the ciphertext
    cipher_nonce = ciphertext + nonce
    db_ciphertext = b64encode(cipher_nonce).decode()

    return db_ciphertext

# debug and manage error handling
def decode_vault_password(db_ciphertext):
    file = open('user_info.txt','r')
    data = file.readlines()
    b_user = data[0]
    b_hashed_mp = data[1].enocde()
    file.close()    

    ciphertext = b64decode(db_ciphertext)
    # re-derive key for decryption
    nonce = ciphertext[-16:] # the last 16 bytes of the ciphertext
    # obtain the stored nonce

    pass_key = pbkdf2_hmac('sha256', b_hashed_mp, b_user * 3, 10000)
    # re-derive the cipher
    cipher_obj = AES.new(pass_key, AES.MODE_EAX, nonce=nonce)
    # load data into the cipher
    plaintext = cipher_obj.decrypt(ciphertext[:-16]) # decrypt all but last 16 bytes (the nonce)
#    try:
#        cipher_obj.verify(tag)
#        return plaintext
#    except ValueError:
#        print("Data corrupted or internal error\n")
#        return -1
    return plaintext



def main():
    return


if __name__=="__main__":
    main()