print("Starting the Password Manager...")

import sys
import os
from Encryption.encryption_functions import encode_new_password, decode_vault_password
from DockerDB.databasefunctions import connect_db, create_passwords_table, add_password_entry, get_password, update_password_entry, delete_password,update_username


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://myuser:mypassword@pgcontainer:5432/pswdDB")

def main():
    # Establish database connection and create the passwords table -- CHNAGE THIS HOST IF RUNNING OUTSIDE CONTAINER
    print("This is a test!!")
    conn, cur = connect_db("pswdDB", "myuser", "mypassword", "pgcontainer")
    if conn is None or cur is None:
        print("Failed to connect to the database.")
        return

    create_passwords_table(conn)  # Ensure the table is created

    # Main command loop
    while True:
        print("\nSelect the action: ")
        print("1. Add Password")
        print("2. Get Password")
        print("3. Update Password")
        print("4. Delete Password")
        print("5. Update Username")
        print("6. Exit")
        choice = input("Choose an option: ")

        if choice == '1':
            username = input("Enter username: ")
            url = input("Enter URL: ")
            plaintext_password = input("Enter password: ")
            add_password_entry(username, url, plaintext_password)

        elif choice == '2':
            # username = input("Enter username: ")
            url = input("Enter URL: ")
            username, password = get_password(url)
            if password:
                print(f"Password for {username} at {url}: {password}")

        elif choice == '3':
            username = input("Enter username: ")
            url = input("Enter URL: ")
            new_password = input("Enter new password: ")
            update_password_entry(username, url, new_password)

        elif choice == '4':
            username = input("Enter username: ")
            url = input("Enter URL: ")
            delete_password(username, url)

        elif choice == '5':
            current_username = input("Enter current username: ")
            new_username = input("Enter new username: ")
            url = input("Enter URL: ")
            update_username(current_username, new_username, url)

        elif choice == '6':
            print("Exiting...")
            break

        else:
            print("Invalid option. Please try again.")

    # Close the cursor and connection before exiting
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
