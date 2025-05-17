import mysql.connector
import re
from dotenv import load_dotenv

load_dotenv()  

BATCH_SIZE = 1000

def chunked(data, size):
    """Yield successive chunks of data of specified size."""
    for i in range(0, len(data), size):
        yield data[i:i + size]

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="vle_admin",
        password="admin123",
        database="ourvle"
    )
    cursor = conn.cursor()

    with open("insert_sql_queries.sql", "r") as f:
        sql_lines = f.readlines()
        sql_lines = [line.strip() for line in sql_lines if line.strip() and not line.startswith("--")]

    statement_batches = {}  

    insert_pattern = re.compile(r"INSERT INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\);", re.IGNORECASE)

    for line_num, statement in enumerate(sql_lines, start=1):
        match = insert_pattern.match(statement)
        if not match:
            print(f"Skipping invalid statement at line {line_num}")
            continue

        table, columns, values = match.groups()
        columns = columns.strip()
        values = values.strip()

        
        param_template = f"INSERT INTO {table} ({columns}) VALUES ({', '.join(['%s'] * len(values.split(',')))})"
       
        value_tuple = tuple(eval(v.strip()) if v.strip().lower() != "null" else None for v in values.split(','))

        if param_template not in statement_batches:
            statement_batches[param_template] = []

        statement_batches[param_template].append(value_tuple)

    total_inserted = 0

    for template, value_list in statement_batches.items():
        for batch in chunked(value_list, BATCH_SIZE):
            try:
                cursor.executemany(template, batch)
                total_inserted += len(batch)
                print(f"Inserted {len(batch)} records into: {template.split('(')[0]}")
            except mysql.connector.Error as e:
                print(f"Error during batch insert: {e}")
                exit(1)

    conn.commit()
    print(f"✅ Successfully inserted {total_inserted} total records in batches of {BATCH_SIZE}.")

except mysql.connector.Error as e:
    print(f"❌ Database error: {e}")

finally:
    cursor.close()
    conn.close()
