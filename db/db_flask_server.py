import sqlite3
import os
from flask import Flask, request, json, jsonify

from encryption_functions import encode_new_password, decode_vault_password, validate_master_password
from gen_master_password_profile_script import setup_user_master_pass

import logging
logging.basicConfig(filename="full_errors.log", level=logging.ERROR, format="%(message)s")

app = Flask(__name__)

DB_NAME = "pswdDB.sqlite" # Ask about connection issues? Here.

# Helper function to connect to the SQLite database
def connect_db():
    
    '''
    Establishes a connection to the SQLite database and returns the connection object and cursor.

    Returns:
        tuple:
            - conn (sqlite3.Connection): A connection object to interact with the SQLite database.
            - cur (sqlite3.Cursor): A cursor object to execute SQL commands.
            - (None, None): Returned if an error occurs while connecting to the database.

    Raises:
        sqlite3.Error: If an error occurs during the connection attempt, such as an invalid database file or access issues.
    '''
    
    try:
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        return conn, cur
    except sqlite3.Error as e:
        return None, None

# Helper function to create passwords table
def create_passwords_table(conn):
    
    '''
    Creates a `passwords` table in the database if it does not already exist.

    The table includes the following columns:
        - id (INTEGER): Primary key, auto-incremented.
        - username (TEXT): The username associated with the password. Cannot be null.
        - url (TEXT): The URL or domain associated with the password. Cannot be null.
        - password (TEXT): The stored password. Cannot be null.
        - created_at (DATETIME): Timestamp of when the record was created. Defaults to the current timestamp.
        - updated_at (DATETIME): Timestamp of when the record was last updated. Defaults to the current timestamp.

    Args:
        conn (sqlite3.Connection): The database connection object to execute the query.
        
     Raises:
        sqlite3.Error: If an error occurs while executing the SQL query, such as a syntax issue or database corruption.
        AttributeError: If the provided `conn` object does not support the required operations.
    '''
    
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
        cur = conn.cursor()
        cur.execute(create_table_query)
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cur.close()


# Helper function to create master password table
def create_master_password_table(conn):
    
    '''
    Creates a `master_password` table in the database if it does not already exist.

    The table includes the following columns:
        - username (TEXT): The username associated with the master password. Cannot be null.
        - hashed_mp (TEXT): The hashed version of the master password. Cannot be null.

    Args:
        conn (sqlite3.Connection): The database connection object to execute the query.
        
    Raises:
        sqlite3.Error: If an error occurs while executing the SQL query, such as syntax errors or database corruption.
        AttributeError: If the provided `conn` object does not support the required operations.
    '''
    
    master_query = """
    CREATE TABLE IF NOT EXISTS master_password (
        username TEXT NOT NULL,
        hashed_mp TEXT NOT NULL
    );
    """
    try:
        cur = conn.cursor()
        cur.execute(master_query)
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cur.close()

# Test
@app.route('/api/test', methods=['GET'])
def test_get():
  '''
  A test function that returns a sample JSON response.

    Returns:
        flask.Response: A JSON response with the following structure:
            {
                "username": "name",
                "password": "pass"
            }
  '''
  
  return jsonify({"username": "name", "password": "pass"})

# Initialize tables API
@app.route('/init_db', methods=['POST'])
def init_db():
    '''
    Initializes the database by creating required tables.

    Returns:
        flask.Response: A JSON response with:
            - A success message and HTTP 200 status code if tables are created successfully.
            - An error message and HTTP 500 status code if the database connection fails or table initialization encounters an error.
            
    Raises:
        sqlite3.Error: If there are issues executing the SQL commands for table creation.
        AttributeError: If the `conn` object is improperly configured or does not support the required operations.
    '''
    
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        create_master_password_table(conn)
        create_passwords_table(conn)
        return jsonify({"message": "Tables initialized successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error initializing tables: {e}"}), 500
    finally:
        conn.close()
        
# Store the master password. Fixed. Works once.
@app.route('/add_master_password', methods=['POST'])
def add_master_password():
    '''
    Adds a new master password to the database.

    Returns:
        flask.Response: A JSON response with:
            - A success message and HTTP 200 status code if the master password is added successfully.
            - An error message and HTTP 500 status code if database connection fails or insertion encounters an error.
            
    Raises:
        KeyError: If the expected `master_pass` or `username` keys are missing from the JSON payload.
        sqlite3.Error: If an error occurs while executing the SQL insert query.
        AttributeError: If the `conn` object is improperly configured or does not support the required operations.
    '''
    
    data = request.get_json()
    master_pass = data.get("master_pass")
    user = data.get("username")
    hashed_mp, username = setup_user_master_pass(master_pass, user)
    insert_query = """
    INSERT INTO master_password (username, hashed_mp)
    VALUES (?, ?);
    """

    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(insert_query, (username, hashed_mp))
        conn.commit()
        # return get_master_password()
        return jsonify({"message": "Master password stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error adding master password: {e}"}), 500
    finally:
        cur.close()
        conn.close()

# Validate login
@app.route('/validate_login', methods=['POST'])
def validate_login():
    '''
    Validates a user's login credentials by comparing the input username and master password with the stored values.

    This function performs the following steps:
        1. Retrieves the JSON payload from the incoming request.
        2. Extracts the `master_pass` and `username` fields from the payload.
        3. Fetches the stored `hashed_mp` and `username` using `get_master_password_`.
        4. Validates the input credentials by calling `validate_master_password`.

    Returns:
        flask.Response: A JSON response containing:
            - `{"login": True}` if the credentials are valid.
            - `{"login": False}` if the credentials are invalid.
    '''
    
    input_data = request.get_json()
    input_master_pass = input_data.get("master_pass")
    input_username = input_data.get("username")
    valid_data = get_master_password_()
    valid_master_pass = valid_data.get("hashed_mp")
    valid_username = valid_data.get("username")

    valid = validate_master_password(input_username, input_master_pass, valid_username, valid_master_pass)
    # valid = validate_master_password('testUserFront', 'password123A!Front', 'testUserFront', '$2b$12$LJSfoIUM8/0FiuujxPeYyeEUPhlrgqI0D0v2JUjkPjH7jsKkdKcMi')

    return jsonify({"login": valid})

# Retrieve the master password.
@app.route('/get_master_password', methods=['GET'])
def get_master_password():
    retrieve_query = """
    SELECT username, hashed_mp
    FROM master_password;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(retrieve_query)
        result = cur.fetchone()
        if result:
            '''
            print("RESULT DEBUG\n")
            username, password = result
            print(username)
            print(type(username))
            print(password)
            print(type(password))

            print("leaving original function")
            '''
            username, hashed_mp = result # username == bytestream // hashed_mp == 200
            return jsonify({"username": username, "hashed_mp": hashed_mp}), 200
            # return username, hashed_mp
        else:
            return jsonify({"error": "no profile"})
    except Exception as e:
        # print(f"Error retrieving master password: {e}")
        return jsonify({"error": "no profile"})
    finally:
        cur.close()
        conn.close()

def get_master_password_():
    '''
    Retrieves the stored master password and associated username from the database.

    Returns:
        dict:
            - On Success:
                A dictionary containing the master password details:
                {
                    "username": <username>,
                    "hashed_mp": <hashed_master_password>
                }
            - On Failure or if no profile exists:
                None, None.
    '''
    
    retrieve_query = """
    SELECT username, hashed_mp
    FROM master_password;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(retrieve_query)
        result = cur.fetchone()
        if result:
            username, hashed_mp = result # username == bytestream // hashed_mp == 200
            return {"username": username, "hashed_mp": hashed_mp}
            # return username, hashed_mp
        else:
            return None, None
    except Exception as e:
        # print(f"Error retrieving master password: {e}")
        return None, None
    finally:
        cur.close()
        conn.close()


# Add a new password entry
@app.route('/add_password', methods=['POST'])
def add_password_entry():
    '''
    Adds a new password entry to the database, encrypting the plaintext password before storage.

    Returns:
        flask.Response:
            - On Success:
                A JSON response with HTTP 200 status:
                {
                    "message": "Password entry added successfully"
                }
            - If the URL already exists:
                {
                    "error": "A password entry for this URL already exists."
                } with HTTP 400 status.
            - On Error:
                {
                    "error": "Error adding password entry: <error details>"
                } with HTTP 500 status.
    '''
    
    data = request.get_json()
    username = data.get('username')
    url = data.get('url')
    plaintext_password = data.get('password')

    response, status = get_master_password()
    
    response_data = response.get_json()  # Get JSON data
    username_master = response_data.get('username')
    hashed_mp = response_data.get('hashed_mp')

    encrypted_password = encode_new_password(plaintext_password, username_master, hashed_mp)

    check_query = """
    SELECT COUNT(*) FROM passwords WHERE url = ?;
    """
    insert_query = """
    INSERT INTO passwords (username, url, password)
    VALUES (?, ?, ?);
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Check if the URL already exists
        cur.execute(check_query, (url,))
        count = cur.fetchone()[0]
        if count > 0:
            return jsonify({"error": "A password entry for this URL already exists."}), 400

        # Insert the new password entry
        cur.execute(insert_query, (username, url, encrypted_password))
        conn.commit()
        return jsonify({"message": "Password entry added successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error adding password entry: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Retrieve a password by URL
@app.route('/get_password', methods=['GET'])
def get_password():
    '''
    Retrieves and decrypts the password associated with a given URL.

    Returns:
        flask.Response:
            - On Success:
                A JSON response with HTTP 200 status containing the username and decrypted password:
                {
                    "username": <username>,
                    "password": <decrypted_password>
                }
            - If the URL does not exist in the database:
                {
                    "error": "Password not found for the given URL"
                } with HTTP 404 status.
            - On Error:
                {
                    "error": "Error retrieving password: <error details>"
                } with HTTP 500 status.
    '''
    
    url = request.args.get('url')
    query = """
    SELECT username, password FROM passwords
    WHERE url = ?;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(query, (url,))
        result = cur.fetchone()
        if result:
            username, encrypted_pswd = result
            
            response, status = get_master_password()

            response_data = response.get_json()  # Get JSON data
            username_master = response_data.get('username')
            hashed_mp = response_data.get('hashed_mp')

            decrypted_pswd = decode_vault_password(encrypted_pswd, username_master, hashed_mp)
            return jsonify({"username": username, "password": decrypted_pswd}), 200
        else:
            return jsonify({"error": "Password not found for the given URL"}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving password: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Delete a password entry by username and URL
@app.route('/delete_password', methods=['DELETE'])
def delete_password():
    '''
    Deletes a password entry from the database based on the provided username and URL.

    Returns:
        flask.Response:
            - On Success:
                A JSON response with HTTP 200 status:
                {
                    "message": "Password entry deleted successfully"
                }
            - On Error:
                A JSON response with HTTP 500 status containing an error message:
                {
                    "error": "Error deleting password entry: <error details>"
                }
    '''
    
    data = request.get_json()
    username = data.get('username')
    url = data.get('url')

    query = """
    DELETE FROM passwords
    WHERE username = ? AND url = ?;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(query, (username, url))
        conn.commit()
        return jsonify({"message": "Password entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error deleting password entry: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Display all passwords
@app.route('/display_all_passwords', methods=['GET'])
def display_all_passwords():
    '''
    Retrieves and decrypts all stored passwords from the database.

    Returns:
        flask.Response:
            - On Success:
                A JSON response with HTTP 200 status containing a list of all stored passwords in the format:
                [
                    {
                        "username": <username>,
                        "url": <url>,
                        "password": <decrypted_password>
                    },
                    ...
                ]
            - If no passwords are found:
                {
                    "message": "No passwords found in the database."
                } with HTTP 404 status.
            - On Error:
                {
                    "error": "Error retrieving passwords: <error details>"
                } with HTTP 500 status.
    '''
    
    query = """
    SELECT username, password, url FROM passwords;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(query)
        results = cur.fetchall()
        if results:
            passwords = []
            response, status = get_master_password()

            response_data = response.get_json()  # Get JSON data
            username_master = response_data.get('username')
            hashed_mp = response_data.get('hashed_mp')

            '''
            for username, encrypted_pswd in results:
                decrypted_pswd = decode_vault_password(encrypted_pswd, username_master, hashed_mp)
                passwords.append((username, decrypted_pswd))
            return jsonify({"passwords": passwords}), 200
            '''
            for username, encrypted_pswd, url in results:  # Assuming each result also contains a `url`
                decrypted_pswd = decode_vault_password(encrypted_pswd, username_master, hashed_mp)
                passwords.append({
                    "username": username,
                    "url": url,
                    "password": decrypted_pswd
                })
            return jsonify(passwords), 200
        else:
            return jsonify({"message": "No passwords found in the database."}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving passwords: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Find and return repeated passwords
# this works now
@app.route('/get_repeated_passwords', methods=['GET'])
def get_repeated_passwords():
    '''
    Identifies and returns a list of passwords that are repeated across stored user accounts.

    Returns:
        flask.Response:
            - A JSON response containing:
                {
                    "repeated_passwords": [<password1>, <password2>, ...]
                } with HTTP 200 status if successful.
            - A JSON response containing:
                {
                    "error": "Error finding repeated passwords: <error details>"
                } with HTTP 500 status if an error occurs.
    '''
    
    query = """
    SELECT username, password, url FROM passwords;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Fetch data from the database
        cur.execute(query)
        results = cur.fetchall()
        
        if not results:
            return jsonify({"repeated_passwords": [], "message": "No passwords found in the database."}), 404

        # Retrieve master password for decryption
        response, status = get_master_password()
        if not response or not response.is_json:
            raise ValueError("Failed to fetch master password for decryption")
        
        response_data = response.get_json()
        username_master = response_data.get('username')
        hashed_mp = response_data.get('hashed_mp')
        
        if not username_master or not hashed_mp:
            raise ValueError("Invalid master password response")

        # Process and decrypt the passwords
        password_details = []  # To store decrypted passwords with details
        for username, encrypted_pswd, url in results:
            decrypted_pswd = decode_vault_password(encrypted_pswd, username_master, hashed_mp)
            password_details.append({
                "username": username,
                "password": decrypted_pswd,
                "url": url
            })

        # Count occurrences of each password
        password_counts = {}
        for detail in password_details:
            password = detail["password"]
            if password in password_counts:
                password_counts[password].append(detail)
            else:
                password_counts[password] = [detail]

        # Filter repeated passwords and include associated details
        repeated_passwords = [
            {
                "password": password,
                "details": password_counts[password]
            }
            for password, details in password_counts.items() if len(details) > 1
        ]

        # Return repeated passwords with details
        return jsonify({"repeated_passwords": repeated_passwords}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # Log stack trace for debugging
        return jsonify({"error": f"Error finding repeated passwords: {str(e)}"}), 500

    finally:
        cur.close()
        conn.close()

# Delete database
@app.route('/delete_database', methods=['DELETE'])
def delete_database():
    """
Deletes the SQLite database file if it exists.

Returns:
    tuple:
        - (flask.Response, int): A JSON response indicating the result of the operation and the corresponding HTTP status code.
        - If the database is successfully deleted, returns:
            {
                "message": "Database deleted successfully"
            }, 200
        - If the database file does not exist, returns:
            {
                "error": "Database not found"
            }, 404
        - If an unexpected error occurs, returns:
            {
                "error": "An error occurred: <error_message>"
            }, 500

Raises:
    Exception: If an unexpected error occurs while attempting to delete the database file.
    """
    
    try:
        if os.path.exists(DB_NAME):
            os.remove(DB_NAME)
            return jsonify({"message": "Database deleted successfully"}), 200
        else:
            return jsonify({"error": "Database not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500

# Confirm server is running
@app.route('/ping', methods=['GET'])
def ping():
    """
Checks the status of the application and returns a response indicating that the service is running.

Returns:
    tuple:
        - (flask.Response, int): A JSON response with the service status and the corresponding HTTP status code.
          - If successful, returns:
            {
                "status": "ok"
            }, 200
    """
    
    return jsonify({"status": "ok"}), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    """
Runs the Flask application.
    """
#    app.run(debug=True)
    app.run(host="127.0.0.1",port=5000,debug=True)