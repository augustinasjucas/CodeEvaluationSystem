# SistemaAA

A sample statement is SAMPLE_STATEMENT.txt

To download all the node_modules:
`
npm install && cd client && npm install && npm run build
`.


To install database: 

`
sudo apt install postgresql postgresql-contrib
`
Go to `example_dbPool.js`, copy it and create a new file `dbPool.js`, then change the password (inside of this file) to the password of your PC.

Then connect to the database:
`
sudo -u postgres -i
`
Then type:
`
psql
`.

Then create the neccessary DB:
`
CREATE DATABASE codeevaluationdb;
`

After that, in order to connect to DB, type:
`
\c codeevaluationdb
`

Finally, locate the db_schemes.sql file in /server folder and type:
`
\i /home/USERNAME/SistemaAA/server/db_scheme.sql
`


In order to insert a user, type:
`
INSERT INTO users(username, password) VALUES('insertUsername', 'insertHashedPassword');
`

Open new terminal, type:
`
sudo -u postgres psql
ALTER USER postgres PASSWORD 'myPassword';
`


To start the server:
`
npm start
`.
To start the client:
`
cd client && npm start
`.

Then the client will be on `localhost:3000` and the server on `localhost:3001`

Also, when deploying this project, certain lines will have to be uncommented in order for the
client to be on the same domain as the server.

