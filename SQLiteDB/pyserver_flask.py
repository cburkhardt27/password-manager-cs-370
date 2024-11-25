# THESE ENDPOINTS ARE WHAT THE FRONTEND ELECTRON JS IS GOING TO CALL
import sys
import os
import base64
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import bcrypt
from Encryption.encryption_functions import validate_master_password

import sqlite3
from flask import Flask, request, jsonify
from sqlite_db_functions import (
    create_passwords_table,
    create_master_password_table,
    add_master_password,
    get_master_password,
    add_password_entry,
    get_password,
    delete_password,
    display_all_passwords,
    get_repeated_passwords 
)
from Encryption.encryption_functions import decode_vault_password
from Encryption.gen_master_password_profile_script import setup_user_master_pass

from flask_cors import CORS

app = Flask(__name__)
# CORS(app)  # This will allow all origins to access the Flask server
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Restrict to frontend's origin


DB_NAME = "pswdDB.sqlite"

# Function to establish database connection
def connect_db():
    try:
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        return conn, cur
    except sqlite3.Error as e:
        return None, None

# Endpoint to create tables
@app.route('/init_db', methods=['POST'])
def initialize_tables():
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        create_master_password_table(conn)
        create_passwords_table(conn)
        return jsonify({"message": "Tables initialized successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# ADDED THIS FOR DEBUGGING
@app.route('/login', methods=['POST'])
def login():
    # Parse the incoming request data
    data = request.json
    submitted_username = data.get('username')
    submitted_password = data.get('password')

    if not submitted_username or not submitted_password:
        return jsonify({"message": "Username and password are required"}), 400

    # Connect to the SQLite database
    conn = sqlite3.connect('password_manager.db')  # Replace with your actual database file
    cursor = conn.cursor()

    # Query the database for the stored hash and username
    cursor.execute("SELECT username, master_password FROM master_password WHERE username = ?", (submitted_username,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"message": "Invalid username or password"}), 401

    # Extract the stored username and hashed password
    act_username, act_mp = row
    act_mp = act_mp.encode()  # Ensure the stored hash is in bytes

    # Validate the credentials
    if validate_master_password(submitted_username, submitted_password, act_mp, act_username):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)

# Endpoint to add master password
@app.route('/add_master_password', methods=['POST'])
def add_master_password_endpoint():
    # hashed_mp, username = setup_user_master_pass()
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to add the master password
        add_master_password()
        return jsonify({"message": "Master password stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/get_master_password', methods=['GET'])
def get_master_password_endpoint():
    print("Endpoint '/get_master_password' called")  # Debug line
    conn, cur = connect_db()
    if conn is None:
        print("Failed to connect to the database")  # Debug line
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        username, hashed_mp = get_master_password()
        hashed_mp_base64 = base64.b64encode(hashed_mp).decode('utf-8') # added this because the api return value 
        #could not convert byte to json object

        # username, hashed_mp = get_master_password()
        if username and hashed_mp_base64:
            print(f"Retrieved master password for {username}")  # Debug line
            return jsonify({"username": username, "hashed_mp": hashed_mp_base64}), 200
        else:
            print("Master password not found")  # Debug line
            return jsonify({"error": "Master password not found"}), 404
    except Exception as e:
        print(f"Error: {e}")  # Debug line
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
        
# Endpoint to get password
@app.route('/add_password', methods=['POST'])
def add_password_endpoint():
    
    data = request.json # THIS WILL BE INOUT FROM FRONTEND 
    username = data['username']
    url = data['url']
    plaintext_password = data['password']
    '''

    # Manually define the username, url, and password FOR TESTING ONLY!!
    username = "beauttahuser"
    url = "http://anothertesturl.com"
    plaintext_password = "another123"
    '''

    # Call the add_password_entry function
    add_password_entry(username, url, plaintext_password)

    return jsonify({"message": "Password entry added successfully"}), 200

# Endpoint to get a password entry by URL
@app.route('/get_password', methods=['GET'])
def get_password_endpoint():
    url = request.args.get('url')  # COMMENTED OUT BUT THIS GET'S DIRECTLY FROM FRONTEND
    # url = "http://testurl.com"  # HARD CODED FOR TESTING API ENDPOINTS WORK PURPOSES ONLY
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to get the password entry
        result = get_password(url)
        if result:
            username, encrypted_pswd = result
            mp_username, _ = get_master_password()
            decrypted_pswd = decode_vault_password(encrypted_pswd, mp_username)
            return jsonify({"username": username, "password": decrypted_pswd}), 200
        else:
            return jsonify({"error": "Password not found for the given URL"}), 404
    finally:
        cur.close()
        conn.close()

# Endpoint to delete a password entry
@app.route('/delete_password', methods=['DELETE'])
def delete_password_endpoint():
    
    data = request.json
    username = data['username']
    url = data['url']
    '''
    username = "wanja"
    url = "http://testurl.com"
    '''
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to delete the password entry
        delete_password(conn, username, url)
        return jsonify({"message": "Password entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Endpoint to display all passwords
@app.route('/display_all_passwords', methods=['GET'])
def display_all_passwords_endpoint():
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to display all passwords
        results = display_all_passwords()
        if results:
            passwords = []
            mp_username, _ = get_master_password()
            for username, encrypted_pswd in results:
                decrypted_pswd = decode_vault_password(encrypted_pswd, mp_username)
                passwords.append({"username": username, "password": decrypted_pswd})
            return jsonify(passwords), 200
        else:
            return jsonify({"error": "No passwords found"}), 404
    finally:
        cur.close()
        conn.close()

#Endpoint to get repeated passwords
@app.route('/get_repeated_passwords', methods=['GET'])
def get_repeated_passwords_endpoint():
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500
    
    try: 
        #Uses sqlite db function to get all repeated passwords
        results = get_repeated_passwords()
        if results:
            repeated_passwords = []
            mp_username, _ = get_master_password()
            for username, encrypted_pswd in results:
                decrypted_pswd = decode_vault_password(encrypted_pswd, mp_username)
                repeated_passwords.append({"username": username, "password": decrypted_pswd})
            return jsonify(repeated_passwords), 200
        else:
            return jsonify({"message": "No repeated passwords"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
                                        
if __name__ == '__main__':
    app.run(port=5000)
