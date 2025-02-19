var express = require('express');
var cors = require('cors');
const mysql = require('mysql2');

const connection = mysql.createConnection({  // Changed 'connect' to 'connection'
    host: 'localhost',
    user: 'root',
    database: 'mydb'
});

connection.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

var app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, function () {
    console.log('CORS-enabled web server listening on port 5000');
});

app.get('/users', function (req, res, next) {
    connection.query('SELECT * FROM users', function (err, results, fields) {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/users/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query('SELECT * FROM users WHERE id= ?',[id], function (err, results, fields) {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.status(200).json(results);
    });
});

app.post('/users/create', function (req, res, next) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const password = req.body.password;
    const avartar = req.body.avartar;
    connection.query('INSERT INTO users(fname,lname,username,password,avartar) VALUES(?,?,?,?,?) ',[fname,lname,username,password,avartar] ,function (err, results, fields) { 
        res.status(200).json(results);
    });
});

app.put('/users/update', function (req, res, next) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const password = req.body.password;
    const avartar = req.body.avartar;
    const id = req.body.id;
    connection.query('UPDATE users SET fname=?,lname=?,username=?,password=?,avartar=? WHERE id =?  ',[fname,lname,username,password,avartar,id] ,function (err, results, fields) { 
        res.status(200).json(results);
    });
});

app.delete('/users/delete', function (req, res, next) {
    const id = req.body.id;
    connection.query('DELETE FROM users WHERE id =?',[id], function (err, results, fields) {
        res.status(200).json(results);
    });
});