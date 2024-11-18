# This file includes all encryption functionality apart from setup script

import bcrypt
from hashlib import pbkdf2_hmac
from Crypto.Cipher import AES
from base64 import b64encode, b64decode
import secrets
import string

act_mp = b'$2b$12$23RLATJ2RFO27LdH2mD6wu9u2mwbnzsvjRFd/oZ5OBfAxkKWQwFWu'
act_username = 'caburkh'

#Validate a user’s submitted master password against the stored salted hash
def validate_master_password(submitted_username, submitted_password, act_mp, act_username):
  #  with open('user_info.txt','r') as file:
  #      act_username = file.readline().strip()
    #    data = file.read().splitlines()
    #    act_mp = file.readline()
    #    print("Submitted user " + submitted_username + " actual user " + act_username)
    if act_username == submitted_username: # if usernames match, check passwords
    #    print("Username OK\n")
        submitted_password_bytes = submitted_password.encode()
        if bcrypt.checkpw(submitted_password_bytes, act_mp):
    #        print("Login successful.\n")
            return True
#    file.close()
#    print("User and password combination not recognized. Please try again \n")
    return False

def encode_new_password(plaintext, act_username):
#    file = open('user_info.txt','r')
#    data = file.readlines()
#    b_user = data[0]
#    b_hashed_mp = data[1].enocde()
#    file.close()    
    b_user = act_username.encode()
    b_hashed_mp = act_mp
    # derive a key that will be used to encrypt/decrypt newpassword
    # b_user * 3 is the salt; it is multiplied by 3 to meet length expectation (16 bytes)
    iter = 10000 # standard
    pass_key = pbkdf2_hmac('sha256', b_hashed_mp, b_user * 3, 100000)
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
def decode_vault_password(db_ciphertext,act_username):
#    file = open('user_info.txt','r')
#    data = file.readlines()
#    b_user = data[0]
#    b_hashed_mp = data[1].enocde()
#    file.close()    

    b_user = act_username.encode()
    b_hashed_mp = act_mp

    ciphertext = b64decode(db_ciphertext)
    # re-derive key for decryption
    nonce = ciphertext[-16:] # the last 16 bytes of the ciphertext
    # obtain the stored nonce

    pass_key = pbkdf2_hmac('sha256', b_hashed_mp, b_user * 3, 100000)
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
#    print("decoding password!")
#    print(type(plaintext))
    str_plaintext = str(plaintext)
#    print(type(str_plaintext))
    str_plaintext= str_plaintext[2:] # cut out b'
    str_plaintext= str_plaintext[:-1] # cut out the last '
 #   print(str_plaintext)
    return str_plaintext

def generate_random_password(length=12):
    # Define the characters to choose from
    alphabet = string.ascii_letters + string.digits + string.punctuation
    # Generate random password
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password    


def main():
# debug generate_random_pass
    random_pass = generate_random_password()
    print(random_pass)
# debugging encode / decode sub passwords
    cipher_pass = encode_new_password("password!", act_username)
    print(cipher_pass)

    revert_pass = decode_vault_password(cipher_pass, act_username)
    print(revert_pass)
# debugging validate_mp
#    user_un = input("Enter your existing username: \n")
#    user_mp = input("Enter your existing master password: \n")
#    if (validate_master_password(user_un,user_mp)):
#        print("You're in!\n")
#    else:
#        print("No match!")
#    return

if __name__=="__main__":
    main()