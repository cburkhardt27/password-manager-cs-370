
import pyscopg2  

conn = None

def connect_db(dbname, dbuser, dbpass, dbhost) :
    global conn
    if conn is None or conn.closed:
        conn = pyscopg2.connect(name = dbname, user = dbuser, password = dbpass, host = dbhost)
    cur = conn.cursor()
    conn_tuple = (conn, cur)
    return conn_tuple
   

    
"""
Function checks if a connection has already been established, if one hasn't been established then a new one is made.
Once the connection is made, a cursor is made from that connection. The cursor allows the exectuion of statements. The 
using the cursor, various sql statements can be executed to modify the database. The connection object and cursor object 
are returned as a tuple. Once done using the connection, both the cursor and the connection have to be closed using the 
close method.
"""