import psycopg2

if __name__ == "__main__":
    try:
        conn = psycopg2.connect(
            host="aws-hackaton-2025-rds.cluster-c5cowc2koh4k.us-west-2.rds.amazonaws.com",
            dbname="aws-db",
            user="postgres",
            password="postgres1110",
            port=5432,
            options="-c client_encoding=UTF8"
        )
        print("Database connection successful")

        # Debugging: Check database encoding
        with conn.cursor() as cursor:
            cursor.execute("SHOW client_encoding;")
            encoding = cursor.fetchone()
            print(f"Client encoding: {encoding[0]}")

            # Fetch specific columns to isolate the issue
            cursor.execute("SELECT column_name FROM some_table LIMIT 1;")  # Replace 'column_name' and 'some_table'
            row = cursor.fetchone()
            if row:
                print("Raw row data:", row)
                for col in row:
                    if isinstance(col, bytes):
                        try:
                            print("Decoded column (UTF-8):", col.decode('utf-8'))
                        except UnicodeDecodeError as decode_error:
                            print(f"Decode error for column: {decode_error}")
                            print("Raw bytes:", col)
                            print("Attempting to decode with 'latin-1'...")
                            print("Decoded column (latin-1):", col.decode('latin-1'))

    except psycopg2.Error as db_error:
        print(f"Database error: {db_error}")
    except UnicodeDecodeError as decode_error:
        print(f"Unicode decode error: {decode_error}")
    except Exception as e:
        print(f"Unexpected error: {e}")
