import mysql.connector
"""
This script connects to a MySQL database and executes a series of SQL INSERT statements 
from a specified `.sql` file. It reads the file line by line, ignoring comments and empty lines, 
and executes each valid SQL statement.
Modules:
    mysql.connector: Provides the MySQL database connection and cursor functionality.
Functionality:
    - Establishes a connection to a MySQL database using the provided credentials.
    - Reads SQL statements from a file (`insert_sql_queries.sql`) located at a specified path.
    - Executes each valid SQL INSERT statement in the file.
    - Logs the success or failure of each statement execution, including the line number.
    - Commits all changes to the database after successful execution of all statements.
    - Handles and reports database connection and execution errors.
File Requirements:
    - The SQL file (`insert_sql_queries.sql`) should contain valid SQL statements, 
      with each statement on a new line.
    - Lines starting with `--` are treated as comments and ignored.
Error Handling:
    - If a database connection error occurs, it is caught and reported.
    - If an error occurs while executing a specific SQL statement, the error is logged 
      along with the line number, and the script exits.
Note:
    - Ensure the database credentials and file paths are correctly configured before running the script.
    - The script uses hardcoded file paths and credentials, which should be updated as needed.
    - There are more than 1,599,794 insert statements in the sql script. Based on the type of machine that you possess, it may take 
      between 15 to 20 minutes for all of the statements to be inserted. Allocate the necessary time for that.
"""

# Import os for environment variable access
# Import dotenv to load environment variables from a .env file
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

