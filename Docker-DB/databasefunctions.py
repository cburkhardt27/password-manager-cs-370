import psycopg2
from encryption_functions import encode_new_password, decode_vault_password

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
CRUD Operations for SPRINT #3 will be implemented here
'''
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