# THESE ENDPOINTS ARE WHAT THE FRONTEND ELECTRON JS IS GOING TO CALL

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

DB_NAME = "pswdDB"
app = Flask(__name__)

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

# Endpoint to add master password
@app.route('/add_master_password', methods=['POST'])
def add_master_password_endpoint():
    hashed_mp, username = setup_user_master_pass()
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to add the master password
        add_master_password(conn, username, hashed_mp)
        return jsonify({"message": "Master password stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Endpoint to get master password
@app.route('/get_master_password', methods=['GET'])
def get_master_password_endpoint():
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to get the master password
        username, hashed_mp = get_master_password(conn)
        if username and hashed_mp:
            return jsonify({"username": username, "hashed_mp": hashed_mp}), 200
        else:
            return jsonify({"error": "Master password not found"}), 404
    finally:
        cur.close()
        conn.close()

# Endpoint to get password
@app.route('/add_password', methods=['POST'])
def add_password_endpoint():
    data = request.json
    username = data['username']
    url = data['url']
    plaintext_password = data['password']

    # Call the add_password_entry function
    add_password_entry(username, url, plaintext_password)

    return jsonify({"message": "Password entry added successfully"}), 200

# Endpoint to get a password entry by URL
@app.route('/get_password', methods=['GET'])
def get_password_endpoint():
    url = request.args.get('url')
    conn, cur = connect_db()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use the function from sqlite_db_functions to get the password entry
        result = get_password(conn, url)
        if result:
            username, encrypted_pswd = result
            mp_username, _ = get_master_password(conn)
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
        results = display_all_passwords(conn)
        if results:
            passwords = []
            mp_username, _ = get_master_password(conn)
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
        results = get_repeated_passwords(conn)
        if results:
            repeated_passwords = []
            mp_username, _ = get_master_password(conn)
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
