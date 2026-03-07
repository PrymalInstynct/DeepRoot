import sqlite3
import os

# Connect to the local sqlite database (assuming it's in the same dir as models.py or specified in env)
# In Docker, it's usually at /app/sql_app.db or similar.
# Let's check the database.py to be sure of the path if possible, but I'll try to execute it as a script.

def migrate():
    import database
    from sqlalchemy import text
    
    engine = database.engine
    with engine.connect() as conn:
        print("Adding missing columns to global_settings...")
        try:
            conn.execute(text("ALTER TABLE global_settings ADD COLUMN withdrawal_retirement INTEGER DEFAULT 65"))
            conn.commit()
            print("Added withdrawal_retirement")
        except Exception as e:
            print(f"Error adding withdrawal_retirement: {e}")
            
        try:
            conn.execute(text("ALTER TABLE global_settings ADD COLUMN roth_withdrawal_retirement INTEGER DEFAULT 65"))
            conn.commit()
            print("Added roth_withdrawal_retirement")
        except Exception as e:
            print(f"Error adding roth_withdrawal_retirement: {e}")
            
        try:
            conn.execute(text("ALTER TABLE global_settings ADD COLUMN withdrawal_rate FLOAT DEFAULT 0.04"))
            conn.commit()
            print("Added withdrawal_rate")
        except Exception as e:
            print(f"Error adding withdrawal_rate: {e}")
            
        try:
            conn.execute(text("ALTER TABLE global_settings ADD COLUMN roth_withdrawal_rate FLOAT DEFAULT 0.04"))
            conn.commit()
            print("Added roth_withdrawal_rate")
        except Exception as e:
            print(f"Error adding roth_withdrawal_rate: {e}")

if __name__ == "__main__":
    migrate()
