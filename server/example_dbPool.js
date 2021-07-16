// this file is just an example. 
// there should be a file, named 'dbPool.js', whose structure is identical to this one

const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'your-password',
    host: 'localhost',
    port: 5432,
    database: 'codeevaluationdb'
});

module.exports = pool;