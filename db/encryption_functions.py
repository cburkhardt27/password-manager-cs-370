# This file includes all encryption functionality apart from setup script

import bcrypt
from hashlib import pbkdf2_hmac
from Crypto.Cipher import AES
from base64 import b64encode, b64decode
import secrets
import string

act_mp = '$2b$12$IMsVOeyLqLNAfZ86JJoVeOCFF0/5CW6Qod9ACKk3W.AxsEdhnX9qy'
act_username = 'caburkh'

import bcrypt

def validate_master_password(submitted_username, submitted_password, act_username, act_mp):
    """
    Validates a user's submitted master password against the stored salted hash.

    Args:
        submitted_username (str): The username provided by the user during login.
        submitted_password (str): The master password provided by the user during login.
        act_username (str): The stored username for validation.
        act_mp (str | bytes): The stored salted hash of the actual master password. It can be a string or bytes.

    Returns:
        bool: True if the submitted username and password match the stored values, False otherwise.
    """

    # Ensure act_mp is in bytes format
    if isinstance(act_mp, str):
        act_mp = act_mp.encode()

    # Check if the username matches
    if act_username != submitted_username:
        print("Username not recognized.")
        return False

    # Encode the submitted password to bytes
    submitted_password_bytes = submitted_password.encode()

    # Check if the password matches the stored hash
    if bcrypt.checkpw(submitted_password_bytes, act_mp):
        print("Login successful.")
        return True

    # If username matches but password does not
    print("Incorrect password.")
    return False

def encode_new_password(plaintext, act_username, act_mp):
    """
    Encodes a plaintext password for storage using AES encryption.

    Args:
        plaintext (str): The password to encrypt.
        act_username (str): The username associated with the password.
        act_mp (str or bytes): The hashed master password used for encryption.

    Returns:
        str: Base64-encoded ciphertext including the nonce.
    """
    try:
        # Validate inputs
        if not plaintext or not act_username or not act_mp:
            raise ValueError("Invalid input: plaintext, act_username, and act_mp must be non-empty.")

        # Ensure act_mp is in bytes format
        b_user = act_username.encode('utf-8')
        b_hashed_mp = act_mp.encode('utf-8') if isinstance(act_mp, str) else act_mp
        if not isinstance(b_hashed_mp, bytes):
            raise TypeError("act_mp must be a string or bytes.")

        # Derive encryption key using PBKDF2
        salt = b_user * 3  # Salt is the username repeated 3 times
        iterations = 100000
        pass_key = pbkdf2_hmac('sha256', b_hashed_mp, salt, iterations)

        # Convert plaintext to bytes
        b_plaintext = plaintext.encode('utf-8')

        # Initialize AES cipher in EAX mode
        cipher_obj = AES.new(pass_key, AES.MODE_EAX)
        nonce = cipher_obj.nonce

        # Encrypt plaintext and generate authentication tag
        ciphertext, tag = cipher_obj.encrypt_and_digest(b_plaintext)

        # Combine ciphertext and nonce
        cipher_nonce = ciphertext + nonce

        # Encode the result in Base64 for storage
        db_ciphertext = b64encode(cipher_nonce).decode('utf-8')
        return db_ciphertext

    except Exception as e:
        # Log and raise error for debugging
        print(f"Error in encode_new_password: {e}")
        raise ValueError("Failed to encode password.") from e

# debug and manage error handling
def decode_vault_password(db_ciphertext, act_username, act_mp):
    """
    Decodes a password stored in the database by decrypting the Base64-encoded ciphertext.

    Args:
        db_ciphertext (str): The Base64-encoded encrypted password (including nonce).
        act_username (str): The username used as part of the key derivation process.
        act_mp (str or bytes): The hashed master password used for decryption.

    Returns:
        str: The decrypted password in plaintext if successful.
        None: If decryption fails due to invalid inputs, corruption, or errors.

    Raises:
        ValueError: For invalid inputs or malformed ciphertext.
        KeyError: For encryption key-related errors.
    """
    try:
        # Validate inputs
        if not db_ciphertext or not act_username or not act_mp:
            raise ValueError("Invalid input: db_ciphertext, act_username, and act_mp must be non-empty")

        # Decode base64-encoded ciphertext
        ciphertext = b64decode(db_ciphertext)

        # Extract nonce (last 16 bytes of ciphertext)
        if len(ciphertext) < 16:
            raise ValueError("Invalid ciphertext: Too short to contain nonce")
        nonce = ciphertext[-16:]
        encrypted_data = ciphertext[:-16]

        # Derive decryption key
        b_user = act_username.encode('utf-8')
        b_hashed_mp = act_mp.encode('utf-8') if isinstance(act_mp, str) else act_mp
        pass_key = pbkdf2_hmac('sha256', b_hashed_mp, b_user * 3, 100000)

        # Initialize AES cipher and decrypt
        cipher_obj = AES.new(pass_key, AES.MODE_EAX, nonce=nonce)
        plaintext = cipher_obj.decrypt(encrypted_data)

        # Decode plaintext from bytes to string
        return plaintext.decode('utf-8')

    except (ValueError, KeyError, b64decode.binascii.Error) as e:
        # Catch known errors and provide feedback
        print(f"Decryption failed: {e}")
        return None

    except Exception as e:
        # Catch any unexpected errors
        print(f"An unexpected error occurred: {e}")
        return None


def generate_random_password(length=12):
    # Define the characters to choose from
    alphabet = string.ascii_letters + string.digits + string.punctuation
    # Generate random password
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password    

def main():
# debug generate_random_pass
    validate_master_password("caburkh", "Password1!", act_username, act_mp)

    random_pass = generate_random_password()
    print(random_pass)
# debugging encode / decode sub passwords
    cipher_pass = encode_new_password("password!", act_username,act_mp)
    print(cipher_pass)

    revert_pass = decode_vault_password(cipher_pass, act_username, act_mp)
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