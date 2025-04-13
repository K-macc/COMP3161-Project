import mysql.connector

try:

    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "@cademicElephant28",
        database = "ourvle"
    )
    cursor = conn.cursor()
    
    with open("insert_sql_queries.sql","r") as f:
        sql_statements = f.readlines()

        total_records = len(sql_statements)  # Count total statements
        print(f"Total records to insert: {total_records}")
        
        for line_num, statement in enumerate(sql_statements, start = 1):
            statement = statement.strip()
            
            if statement and not statement.startswith("--"):
                try:
                    cursor.execute(statement)
                    print(f"Inserted record {line_num}/{total_records}")  # Print each insert
                except mysql.connector.Error as e:
                    print(f"Error on line {line_num}: {e}")
                    exit(1)
                
        conn.commit()
        print("✅ All data inserted successfully.")
        print("INSERT statements for insert_sql_queries.sql have been executed successfully.")
        

        
except mysql.connector.Error as e:
    print(f"Error: {e}")
    
finally:
    cursor.close()
    conn.close()

