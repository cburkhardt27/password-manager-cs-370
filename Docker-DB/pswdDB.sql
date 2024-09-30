-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- not sure we need to store this data piece*
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the password_entries table
CREATE TABLE password_entries (
    entry_id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL, --foreign key from users table
    url VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Optional table we might consider
CREATE TABLE password_history (
    -- id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, --foreign key from users table
    password_entry_id INT NOT NULL,
    old_password TEXT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- CONSTRAINT fk_password_entry FOREIGN KEY (password_entry_id) REFERENCES password_entries(entry_id)
);

-- Indexes for performance -- WILL WORK ON THIS LATER
-- CREATE INDEX idx_password_url ON password_entries(url);
-- CREATE INDEX idx_password_username ON password_entries(username);
