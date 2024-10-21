import psycopg2
from Encryption.encryption_functions import encode_new_password, decode_vault_password

conn = None

"""
Function checks if a connection has already been established, if one hasn't been established then a new one is made.
Once the connection is made, a cursor is made from that connection. The cursor allows the exectuion of statements. The 
using the cursor, various sql statements can be executed to modify the database. The connection object and cursor object 
are returned as a tuple. Once done using the connection, both the cursor and the connection have to be closed using the 
close method.
"""
# EDIT by Beauttah -- We need error handling for this function
def connect_db(dbname, user, password, host) :
    global conn
    if conn is None or conn.closed:
        conn = psycopg2.connect(
            dbname = dbname, 
            user = user, 
            password = password, 
            host = host)
    cur = conn.cursor()
    conn_tuple = (conn, cur)
    return conn_tuple


# Modified by Beauttah to add a function that initializes the schema 
conn_tuple = connect_db("pswdDB", "myuser","mypassword","localhost")
conn,cur  = conn_tuple

def create_passwords_table():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS passwords (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    """
    
    #use the global variables from the connect_db function return values
    cur.execute(create_table_query)
    conn.commit()  # Save the changes to the database
    print("Table 'passwords' created successfully.")    

create_passwords_table()

# Close the cursor object and connection
cur.close()
conn.close()


'''
CRUD Operations for SPRINT #3 & #4 will be implemented here
'''

# Add a new password entry to the vault. Params: Username, URL, Password
def add_password_entry(username, url, plaintext_password):
    encrypted_password = encode_new_password(plaintext_password)

    query ="""
    INSERT INTO passwords (username, url, password)
    VALUES (%s, %s, %s);
    """

    try:
        conn, cur = connect_db("pswdDB", "myuser", "mypassword", "localhost")
        cur.execute(query, (username, url, encrypted_password))
        conn.commit()
        print("Password entry added successfully.")
    except Exception as e:
        print(f"Error adding password entry: {e}")
    finally:
        cur.close()
        conn.close()


# Retrieve password from vault and decrypting it to plaintext. Params: Username, URL
def get_password(username, url):
    query = """
    SELECT password FROM passwords
    WHERE username = %s AND url = %s; 
    """
    try:
        conn, cur = connect_db("pswdDB", "myuser", "mypassword", "localhost")
        cur.execute(query, (username, url))
        result = cur.fetchone()
        if result:
            encrypted_pswd = result[0]
            decrypted_pswd = decode_vault_password(encrypted_pswd)
            return decrypted_pswd
        else:
            print("No password found for the given username and url!")
    except Exception as e:
        print(f"Error retrieving password entry: {e}")
    finally:
        cur.close()
        conn.close()
    
# Delete password entry. Params: Username, URL
# TODO -- Veryfying that the deletion is being done by actual user!!
def delete_password(username, url):
    query ="""
    DELETE FROM passwords
    WHERE username = %s AND url = %s;
    """
    try:
        conn, cur = connect_db("pswdDB", "myuser", "mypassword", "localhost")
        cur.execute(query, (username, url))
        conn.commit()
        # delete this after tests
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

    try:
        conn, cur = connect_db("pswdDB", "myuser", "mypassword", "localhost")
        cur.execute(query, (new_encrypted_password, username, url))
        conn.commit()
        print("Password entry updated successfully.")
    except Exception as e:
        print(f"Error updating password entry: {e}")
    finally:
        cur.close()
        conn.close()

# Uodate username associated with a password. Params: Current Username, New Username, URL
def update_username(current_username, new_username, url):
    # First, validate that the password entry exists for the current username and URL
    query = """
    SELECT password FROM passwords
    WHERE username = %s AND url = %s;
    """
    update_query = """
    UPDATE passwords
    SET username = %s, updated_at = CURRENT_TIMESTAMP
    WHERE username = %s AND url = %s;
    """

    try:
        conn, cur = connect_db("pswdDB", "myuser", "mypassword", "localhost")
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


'''
QUESTIONS:
- Do we need to verify password for CRUD operations or is the masterpassword 
used for a one-time-is-enough verification??
- Re-evaluate security of the design of DB functions...
'''