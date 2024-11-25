# These are the database functions exactly as implemented in databasefunctions.py but using an SQLite database
# instead of the SQL database hosted in a container

import sqlite3
from Encryption.encryption_functions import encode_new_password, decode_vault_password
from Encryption.gen_master_password_profile_script import setup_user_master_pass

# Connection variable (only one is needed for sqlite)
DB_NAME = "pswdDB.sqlite"

"""
Function checks if a connection has already been established. If one hasn't been established, a new one is made.
Once the connection is made, a cursor is created from that connection.
"""
def connect_db(DB_NAME):
    try:
        # Connect to the SQLite database (or create it if it doesn't exist)
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()  # Create a cursor object
        print("Connection to the SQLite database established successfully.")  # DEBUGGING LINE
        return conn, cur
    except sqlite3.Error as e:
        print(f"Error connecting to the SQLite database: {e}")
        return None, None


# Function to initialize the passwords table
def create_passwords_table(conn):
    create_table_query = """
    CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        url TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        if 'cur' in locals():
            cur.close()


# Function to create a table to store the master password
def create_master_password_table(conn):
    master_query = """
    CREATE TABLE IF NOT EXISTS master_password (
        username TEXT NOT NULL,
        hashed_mp BLOB NOT NULL
    );
    """
    try:
        if conn is None:
            raise ValueError("Connection is not established.")
        cur = conn.cursor()  # Get the cursor from the connection
        cur.execute(master_query)
        conn.commit()  # Save the changes to the database
        print("Table 'master_password' created successfully.")


    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        if 'cur' in locals():
            cur.close()


# Establish the database connection to initialize the two tables
conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite


if conn is None or cur is None:
    print("Failed to connect to the database.")
    exit(1)


# Create the master_password table and passwords table in this order
create_master_password_table(conn)
create_passwords_table(conn)


# Close the connection
conn.close()




# populate table with the result from setup_user_master_pass() -- RETURNS ** return hashed_mp, username **
def add_master_password():
    hashed_mp, username = setup_user_master_pass()
    insert_query = """
    INSERT INTO master_password (username, hashed_mp)
    VALUES (?, ?);
    """
    conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(insert_query, (username, hashed_mp))
        conn.commit()
        print("Master password stored successfully.")
    except Exception as e:
        print(f"Error adding master password: {e}")
    finally:
        cur.close()
        conn.close()


add_master_password()  # call the script to prompt user first


def get_master_password():
    retrieve_query = """
    SELECT username, hashed_mp
    FROM master_password;
    """
   
    # Connect to the database
    conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return False
   
    try:
        # Execute the query to retrieve the hashed password and username
        cur.execute(retrieve_query)
        result = cur.fetchone()
        # print("result: ", result)  # DEBUG PRINT
        if result is None:
            print("MP Table is empty")
            return False


    finally:
        cur.close()
        conn.close()


    username, hashed_mp = result
    return username, hashed_mp


# Add a new password entry to the vault. Params: Username, URL, Password -- check whether there's a URL already existing
def add_password_entry(username, url, plaintext_password):
    username_master, hashed_mp = get_master_password()
   
    encrypted_password = encode_new_password(plaintext_password, username_master)
   
    check_query = """
    SELECT COUNT(*) FROM passwords WHERE url = ?;
    """
    insert_query = """
    INSERT INTO passwords (username, url, password)
    VALUES (?, ?, ?);
    """
   
    conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
   
    try:
        # Check if the URL already exists
        cur.execute(check_query, (url,))
        count = cur.fetchone()[0]
        if count > 0:
            print("A password entry for this URL already exists.")
            return
       
        # Insert the new password entry
        cur.execute(insert_query, (username, url, encrypted_password))
        conn.commit()
        print("Password entry added successfully.")
   
    except Exception as e:
        print(f"Error adding password entry: {e}")
   
    finally:
        cur.close()
        conn.close()


# Retrieve password from vault and decrypt it to plaintext. Params: URL
def get_password(url):
    query = """
    SELECT username, password FROM passwords
    WHERE url = ?;
    """
    conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return None
    try:
        cur.execute(query, (url,))
        result = cur.fetchone()
        if result:
            username, encrypted_pswd = result


            mp_username, hashed_mp = get_master_password()


            decrypted_pswd = decode_vault_password(encrypted_pswd, mp_username)


            return username, decrypted_pswd
        else:
            print("Error: URL provided does not exist!")
            return None
    except Exception as e:
        print(f"Error retrieving password entry: {e}")
        return None
    finally:
        cur.close()
        conn.close()

# Delete password entry. Params: Username, URL
def delete_password(username, url):
    query = """
    DELETE FROM passwords
    WHERE username = ? AND url = ?;
    """
    conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite
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


# Display all passwords
def display_all_passwords():
    query = """
    SELECT username, password FROM passwords;
    """
    conn, cur = connect_db(DB_NAME)  # Only DB_NAME is needed for SQLite
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return None
    try:
        cur.execute(query)
        results = cur.fetchall()
        if results:
            passwords = []
            mp_username, hashed_mp = get_master_password()
            for username, encrypted_pswd in results:
                decrypted_pswd = decode_vault_password(encrypted_pswd, mp_username)
                passwords.append((username, decrypted_pswd))
            return passwords
        else:
            print("No passwords found in the database.")
            return None
    except Exception as e:
        print(f"Error retrieving password entries: {e}")
        return None
    finally:
        cur.close()
        conn.close()


# returns repeated every passwords and its corresponding user
def get_repeated_passwords():
    try:
        allPasswords = display_all_passwords()
        password_counts = {}
        repeated_passwords = []
        for passwordTuple in allPasswords:
            if passwordTuple[1] in password_counts:
                password_counts[passwordTuple[1]] += 1
            return None
        else: 
            return repeated_passwords
    except Exception as e:
        print(f"Error getting the repeated passwords: {e}")
        return None
        
