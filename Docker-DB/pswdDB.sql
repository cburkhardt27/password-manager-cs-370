-- Defines the schema for the password database 
CREATE TABLE passwords(
    user_id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL, -- does the username for each url have to be unique??
    password TEXT NOT NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ipdated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Will we have a functionality where user can view previous passwords?
-- If not, we don't need the last two fields