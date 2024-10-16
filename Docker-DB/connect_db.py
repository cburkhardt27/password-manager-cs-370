'''
This is to check whether my db is crashing or the code was wrong
'''
import psycopg2

def connect_to_db():
    try:
        # Connect to the PostgreSQL database
        connection = psycopg2.connect(
            host="127.0.0.1", # could be localhost
            port="5432",
            database="anotherr",
            user="beauttah",
            password="nyagu" ## so does this even matter???
            

        )
        print("Connection to the database was successful.")
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

def insert_user_info(connection, username, url, password):
    try:
        cursor = connection.cursor()
        insert_query = """
        INSERT INTO user_info (username, url, password)
        VALUES (%s, %s, %s);
        """
        cursor.execute(insert_query, (username, url, password))
        connection.commit()
        print("User information successfully inserted into the database.")
    except Exception as e:
        print(f"Error inserting user information: {e}")
    finally:
        cursor.close()

def main():
    connection = connect_to_db()
    if connection:
        try:
            username = input("Enter username: ")
            url = input("Enter URL: ")
            password = input("Enter password: ")
            insert_user_info(connection, username, url, password)
        finally:
            connection.close()
            print("Database connection closed.")

if __name__ == "__main__":
    main()

