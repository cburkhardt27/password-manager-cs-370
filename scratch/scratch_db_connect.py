import psycopg2 as pg

HOSTNAME = 'pass-db'
DATABASE = 'postgres'
USERNAME = 'postgres'
PASSWORD = 'postgres'
PORT = '5432'

conn = pg.connect(
    host = HOSTNAME,
    user = USERNAME,
    password = PASSWORD,
    dbname = DATABASE,
    port = PORT
)

# CREATE: Insert new data into the table
def insert_data(username, password):
    try:
        cursor = conn.cursor()
        insert_query = "INSERT INTO data(username, password) VALUES (%s, %s)"
        cursor.execute(insert_query, (username, password))
        
        conn.commit() 
        print(f"Data inserted successfully for {username}")
    
    except Exception as e:
        conn.rollback() 
        print(f"Error inserting data: {e}")
    
    finally:
        cursor.close() 

# READ: Fetch all data from the table
def read_data():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM data;")
        records = cursor.fetchall()
        
        for record in records:
            print(f"username: {record[0]}, password: {record[1]}") 
    
    except Exception as e:
        print(f"Error reading data: {e}")
    
    finally:
        cursor.close()

# UPDATE: Update an existing entry in the table by username
def update_data(username, new_password):
    try:
        cursor = conn.cursor()
        update_query = "UPDATE data SET password = %s WHERE username = %s"
        cursor.execute(update_query, (new_password, username))
        
        if cursor.rowcount > 0:
            conn.commit() 
            print(f"Password for {username} updated successfully.")
        else:
            print(f"No user found with username {username}")
    
    except Exception as e:
        conn.rollback() 
        print(f"Error updating data: {e}")
    
    finally:
        cursor.close()

# DELETE: Delete an entry from the table by username
def delete_data(username):
    try:
        cursor = conn.cursor()
        delete_query = "DELETE FROM data WHERE username = %s"
        cursor.execute(delete_query, (username,))
        
        if cursor.rowcount > 0:
            conn.commit()
            print(f"User {username} deleted successfully.")
        else:
            print(f"No user found with username {username}")
    
    except Exception as e:
        conn.rollback()
        print(f"Error deleting data: {e}")
    
    finally:
        cursor.close()



# insert_data('username', 'password')
update_data('username', 'new_password')
# read_data()