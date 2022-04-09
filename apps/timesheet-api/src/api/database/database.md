# Database
Database files contain all the database access logic that is used in the controllers. 

## Database Layout
The logic for each database function is contained within a try/catch block. At the beggining of each function, in the try block, the database connection pool is acquired. Then all the different database access logic is performed. If an error is caught with the try block it is passed to `handleDatabaseError()`. If no error occurs, the result is passed to `handleDatabaseResult()`

```js

    try {
        let pool = await getPool()

        // Database access
        
        return handleDatabaseResult(/* Result */)
    } catch (err) {
        return handleDatabaseError(err)
    }

```