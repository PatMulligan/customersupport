# migrations.py is for building your database

# async def m001_initial(db):
#    await db.execute(
#        f"""
#        CREATE TABLE customersupport.customersupport (
#            id TEXT PRIMARY KEY,
#            wallet TEXT NOT NULL,
#            time TIMESTAMP NOT NULL DEFAULT {db.timestamp_now}
#        );
#    """
#    )
