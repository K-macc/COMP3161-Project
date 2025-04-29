import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

try:
    conn = mysql.connector.connect(
        host = "localhost",
        user = "vle_admin",
        password = "admin123",
        database = "ourvle"
    )
    cursor = conn.cursor()

    
    with open("project-files/insert_sql_queries.sql","r") as f:
        sql_statements = f.readlines()
        sql_statements = [line for line in sql_statements if line.strip()]

        total_records = len(sql_statements)  # Count total statements
        
        for line_num, statement in enumerate(sql_statements, start = 1):
            statement = statement.strip()
            
            if statement and not statement.startswith("--"):
                try:
                    cursor.execute(statement)
                    print(f"Inserted record {line_num}/{total_records} into the database.")  # Print each insert
                except mysql.connector.Error as e:
                    print(f"Error on line {line_num}: {e}")
                    exit(1)
                
        conn.commit()
        print("INSERT statements for insert_sql_queries.sql have been executed successfully✅.")
        

        
except mysql.connector.Error as e:
    print(f"Error: {e}")
    
finally:
    cursor.close()
    conn.close()

