const express = require("express");
const app = express();
const mysql = require("mysql");

// Middleware to parse JSON bodies  , allow data from client side to json bodies
app.use(express.json());
app.use(express.urlencoded({extends: false}))

// server.js (update)
const cors = require('cors');
app.use(cors()); // Add this line to enable CORS


// create databse connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_mysql_db'
});

// Listen to client request (http method)
app.get('/', (req , res) => {
    res.send("Hello World!");
});

// select all customers
app.get('/api/customers', (req , res) => {
    db.query('SELECT * FROM `customers`', (err , result) => {
        if(err){
            res.json({
                error: true,
                message: err
            })
        }
        else{
            res.json({
                list : result
            })
        }
    })
});

// select one customer by id
app.get('/api/customer/:id', (req , res) => {
    db.query('SELECT * FROM `customers` WHERE `customer_id` = ?' , [req.params.id] , (err , result) => {
        if(err){
            res.json({
                error : true,
                message: err
            })
        }
        else{
            res.json({
                list : result
            })
        }
    })
});

// create or insert new customer
app.post('/api/customer/', (req , res) => {
    var sqlInsert = "INSERT INTO `customers` (`firstname` , `lastname` , `gender` , `tel` , `email`) VALUES (? , ? , ? , ? , ?)";
    var body = req.body; // get parameters from body json
    db.query(sqlInsert , [body.firstname , body.lastname , body.gender , body.tel , body.email] , (err , result) =>{
        if(err){
            res.json({
                error : true,
                message: err
            })
        }
        else{
            res.json({
                message : "Customer created successfully.",
                data : result
            })
        }
    })
});

// update customer by id
app.put('/api/customer/', (req , res) => {
    var body = req.body;
    sqlUpdate = "UPDATE `customers` SET `firstname` = ? , `lastname` = ? , `gender` = ? , `tel` = ? , `email` = ? WHERE `customer_id` = ?";
    db.query(sqlUpdate, [body.firstname, body.lastname, body.gender , body.tel , body.email , body.customer_id] , (err , result) => {
        if(err){
            res.json({
                error : true,
                message : err
            })
        }
        else{
            res.json({
                message : "Customer updated successfully.",
            })
        }
    })
});


// delete customer by id
app.delete('/api/customer/:id', (req , res) => {
    db.query("DELETE FROM `customers` WHERE `customer_id` = ?" , [req.params.id] , (err , result) => {
        if(err){
            res.json({
                error : true,
                message : err
            })
        }
        else{
            res.json({
                message : "Customer deleted successfully.",
            })
        }
    })
});

app.get('/api/searchCustomers', (req, res) => {
    // Retrieve the search term from the query parameters
    const searchTerm = req.query.search || ''; // Default to empty string if not provided

    // Construct the search pattern
    const reqSearch = `%${searchTerm}%`;

    // SQL query with placeholder
    const sqlSearch = 'SELECT * FROM `customers` WHERE `firstname` LIKE ?';

    // Execute the query
    db.query(sqlSearch, [reqSearch], (err, result) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: err.message
            });
        } else {
            res.json({
                list: result
            });
        }
    });
});

// listen to run to server
app.listen(8080, () => {
    console.log("Server running at http://localhost:8080");
});
