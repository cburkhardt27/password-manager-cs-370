import psycopg2
from Encryption.encryption_functions import encode_new_password, decode_vault_password

# Connection variables
DB_NAME = "pswdDB"
DB_USER = "myuser"
DB_PASSWORD = "mypassword"
DB_HOST = "pgcontainer"  # "db" if connecting inside container / "localhost" if connecting from outside Docker

"""
Function checks if a connection has already been established. If one hasn't been established, a new one is made.
Once the connection is made, a cursor is created from that connection.
"""
def connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST):
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST
        )
        cur = conn.cursor()  # Create a cursor object
        print("Connection to the database established successfully.")  # DEBUGGING LINE
        return conn, cur
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None, None


# Function to initialize the passwords table
def create_passwords_table(conn):
    create_table_query = """
    CREATE TABLE IF NOT EXISTS passwords (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    try:
        if conn is None:
            raise ValueError("Connection is not established.")
        cur = conn.cursor()  # Get the cursor from the connection
        cur.execute(create_table_query)
        conn.commit()  # Save the changes to the database
        print("Table 'passwords' created successfully.")
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        if cur:
            cur.close()


# Establish the database connection
conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)
if conn is None or cur is None:
    print("Failed to connect to the database.")
    exit(1)

# Create the passwords table
create_passwords_table(conn)

# Close the connection
conn.close()


'''
CRUD Operations for SPRINT #3 & #4 will be implemented here
'''


# Add a new password entry to the vault. Params: Username, URL, Password
def add_password_entry(username, url, plaintext_password):
    encrypted_password = encode_new_password(plaintext_password)
    query = """
    INSERT INTO passwords (username, url, password)
    VALUES (%s, %s, %s);
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(query, (username, url, encrypted_password))
        conn.commit()
        print("Password entry added successfully.")
    except Exception as e:
        print(f"Error adding password entry: {e}")
    finally:
        cur.close()
        conn.close()


# Retrieve password from vault and decrypt it to plaintext. Params: Username, URL
def get_password(username, url):
    query = """
    SELECT password FROM passwords
    WHERE username = %s AND url = %s; 
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(query, (username, url))
        result = cur.fetchone()
        if result:
            encrypted_pswd = result[0]
            decrypted_pswd = decode_vault_password(encrypted_pswd)
            return decrypted_pswd
        else:
            print("No password found for the given username and URL!")
            return None
    except Exception as e:
        print(f"Error retrieving password entry: {e}")
    finally:
        cur.close()
        conn.close()


# Delete password entry. Params: Username, URL
def delete_password(username, url):
    query = """
    DELETE FROM passwords
    WHERE username = %s AND url = %s;
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(query, (username, url))
        conn.commit()
        print("Password entry deleted successfully.")
    except Exception as e:
        print(f"Error deleting password entry: {e}")
    finally:
        cur.close()
        conn.close()


# Update old password with a new one. Params: Username, URL, New Password 
def update_password_entry(username, url, new_plaintext_password):
    new_encrypted_password = encode_new_password(new_plaintext_password)
    query = """
    UPDATE passwords
    SET password = %s, updated_at = CURRENT_TIMESTAMP
    WHERE username = %s AND url = %s;
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(query, (new_encrypted_password, username, url))
        conn.commit()
        print("Password entry updated successfully.")
    except Exception as e:
        print(f"Error updating password entry: {e}")
    finally:
        cur.close()
        conn.close()


# Update username associated with a password. Params: Current Username, New Username, URL
def update_username(current_username, new_username, url):
    query = """
    SELECT password FROM passwords
    WHERE username = %s AND url = %s;
    """
    update_query = """
    UPDATE passwords
    SET username = %s, updated_at = CURRENT_TIMESTAMP
    WHERE username = %s AND url = %s;
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(query, (current_username, url))
        result = cur.fetchone()
        
        if result:
            cur.execute(update_query, (new_username, current_username, url))
            conn.commit()
            print("Username updated successfully.")
        else:
            print("No matching entry found for the current username and URL.")
    except Exception as e:
        print(f"Error updating username: {e}")
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        exit(1)

# Further initialization or function calls can be done here if necessary.

'''
QUESTIONS:
- Do we need to verify password for CRUD operations or is the master password 
used for a one-time verification?
- Re-evaluate the security of the design of DB functions...

- Stroning the infor in the user_info gtext file to store it in a new table-- independent table

- There is some error with user_info.txt from encode_new_passowrd function. Causes errors with update_password_entry, get_password, add_password_entry,
  and delete_password. Everething else is working. 

'''
