const express = require('express'); // Require Express
const mysql = require('mysql'); // Require MySQL
const contactsRouter = require('./server/routes/contacts.js'); // Require the router for links with /contact

const app = express();
const port = process.env.PORT || 5000;

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'contact_list'
});

// Attempt database connection
db.connect((err) => {
  if (err) {
    throw(err);
  }
  else{
    console.log("connected to database");
  }
});

global.db = db; // Make the database connection global

app.use('/api/contacts', contactsRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));