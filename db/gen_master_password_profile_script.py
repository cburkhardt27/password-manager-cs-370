import bcrypt

def digit_in_string(string_check): 
    """
Checks if a given string contains at least one digit.

Args:
    string_check (str): The string to be checked for the presence of digits.

Returns:
    bool:
        - True: If the string contains at least one digit.
        - False: If the string does not contain any digits.
    """
    return any(i.isdigit() for i in string_check)


def setup_user_master_pass(master_pass, username):
    """
    Username and master password setup should be done in react.js
    """
    """
    Sets up the user master password by:
    - Prompting for a username and password.
    - Validating the password against defined rules.
    - Hashing the password securely using bcrypt.

    Returns:
        tuple: A tuple containing the hashed master password as a string and the username.
    """

    """
    alphanumer_set = ['@', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '?']

    # Input and validate username
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

    # Input and validate master password
    while True:
        try:
            master_pass = input(
                "Enter your master password.\nThis should be larger than 8 characters, include a number, and a special character: \n"
            )
        except ValueError:
            print("Sorry. Please use only standard keyboard input.\n")
            continue
        if ' ' in master_pass:
            print("Sorry. Please input a password without spaces.\n")
        if len(master_pass) <= 8:
            print("Sorry. Please enter a password longer than 8 characters.\n")
            continue
        if not digit_in_string(master_pass):
            print("Please include a number in your password.\n")
            continue
        if not any(char in alphanumer_set for char in master_pass):
            print("Please include an expected special character in your password.\n")
            continue
        else:
            break
    """
    
    # Hash master password securely with salt using bcrypt
    master_pass = master_pass.encode()
    pass_salt = bcrypt.gensalt()
    hashed_mp = bcrypt.hashpw(master_pass, pass_salt).decode('utf-8')  # Decode bytes to string
    # print(f"Username: {username}, Hashed Password: {hashed_mp}")
    # print(type(username))
    # print(type(hashed_mp))
    
    # Return hashed password as a string and the username
    return hashed_mp, username

if __name__ == "__main__":
    setup_user_master_pass("test_pass", "test_user")