import psycopg2
import bcrypt
from Encryption.encryption_functions import encode_new_password, decode_vault_password
from Encryption.gen_master_password_profile_script import setup_user_master_pass


# Connection variables
DB_NAME = "pswdDB"
DB_USER = "myuser"
DB_PASSWORD = "mypassword"
DB_HOST = "pgcontainer"  # "pgcontainer" when connecting inside container / "localhost" if connecting from outside Docker

# Note: "pgcontainer" is the name I have given to the container I created to host postgresql in my docker application, 
# make sure to give the container this exact name or you'll have to change this to the name you've assigned the container you created


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


# Function to create a table to store the masterpassword 
def create_master_password_table(conn):
    master_query = """
    CREATE TABLE IF NOT EXISTS master_password (
        username VARCHAR(255) NOT NULL,
        hashed_mp BYTEA NOT NULL
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
        if cur:
            cur.close()

# Establish the database connection to initialize the two tables
conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)
if conn is None or cur is None:
    print("Failed to connect to the database.")
    exit(1)

# Create the master_password table and passwords table in this order
create_master_password_table(conn)
create_passwords_table(conn)
# Close the connection
conn.close()

# populate table with the result from setup_user_master_pass() -- RETURNS  ** return hashed_mp, username **
def add_master_password():
    hashed_mp, username = setup_user_master_pass()
    insert_query = """
    INSERT INTO master_password (username, hashed_mp)
    VALUES (%s, %s);
    """ 
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return
    try:
        cur.execute(insert_query, (username,hashed_mp)) 
        # parameters will be the result from setup_user_master_pass() -- RETURNS  ** return hashed_mp, username **
        
        conn.commit()
        print("Master password stored successfully.")
    except Exception as e:
        print(f"Error adding master password: {e}")
    finally:
        cur.close()
        conn.close()

add_master_password() # call the script to prompt user first

def get_master_password():
    # add_master_password("user1",b'$2b$12$Dh3yrEZHnKPrnRGdz0FcAOmTDpQV9FE3wfnCtDhr4Uw0wNUDgfO.i')
    # this is just a hardcode test 
    # substitute this with the result from setup_user_master_pass() -- RETURNS  ** return hashed_mp, username **

    retrieve_query = """
    SELECT username, hashed_mp
    FROM master_password;
    """
    
    # Connect to the database
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return False
    
    try:
        # Execute the query to retrieve the hashed password and username
        cur.execute(retrieve_query)
        result = cur.fetchone()
        print("result: ", result) # DEBUG PRINT
        if result is None:
            print("MP Table is empty")
            return False

    finally:
        cur.close()
        conn.close()

    username, hashed_mp = result
    
    return username, hashed_mp
    # return result

# Add a new password entry to the vault. Params: Username, URL, Password -- check whether there's a url already existing
def add_password_entry(username, url, plaintext_password):
    username_master, hashed_mp = get_master_password()
    
    encrypted_password = encode_new_password(plaintext_password, username_master)
    
    check_query = """
    SELECT COUNT(*) FROM passwords WHERE url = %s;
    """
    insert_query = """
    INSERT INTO passwords (username, url, password)
    VALUES (%s, %s, %s);
    """
    
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return

    try:
        # Check if the URL already exists in the database
        cur.execute(check_query, (url,))
        count = cur.fetchone()[0]
        
        if count > 0:
            print("Error: A password entry already exists for the given URL.")
            return

        # Insert new password entry if it doesn't exist
        cur.execute(insert_query, (username, url, encrypted_password))
        conn.commit()
        print("Password entry added successfully.")
        
    except Exception as e:
        print(f"Error adding password entry: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


# Retrieve password from vault and decrypt it to plaintext. Params: URL
def get_password(url):
    query = """
    SELECT username, password FROM passwords
    WHERE url = %s; 
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return None
    try:
        cur.execute(query, (url,))
        result = cur.fetchone()
        if result:
            username, encrypted_pswd = result

            mp_username, hashed_mp = get_master_password()
           
            decrypted_pswd = decode_vault_password(encrypted_pswd,mp_username) 

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

# display all passwords
def display_all_passwords():
    query = """
    SELECT username, password FROM passwords; 
    """
    conn, cur = connect_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)  # Ensure we get conn and cur
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

# Update old password with a new one. Params: Username, URL, New Password 
def update_password_entry(username, url, new_plaintext_password):
    
    mp_username, hashed_mp  = get_master_password()

    new_encrypted_password = encode_new_password(new_plaintext_password,mp_username)

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

