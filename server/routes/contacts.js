const express = require('express'); // Require Express
const contactsRouter = express.Router(); // Create router

// Get all contacts
contactsRouter.get('/', (req, res) => {
  console.log("GETTING CONTACTS"); // Message on the server
    
  const query = "SELECT * FROM `contacts` ORDER BY last_name";
  
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send(err);
    }
    else{
      res.send({array: result});
    }
  });
});

// Get all information for a single contact with the provided id
contactsRouter.get('/:id', (req, res) => {
  console.log("GETTING CONTACT INFO"); // Message on the server
      
  const query = "SELECT * FROM `contacts` as c INNER JOIN `contact_info` as ci ON c.id = ci.id WHERE c.id = '" + req.params.id + "'";
    
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send(err);
    }
    else{
      res.send({array: result});
    }
  });
});

// Add a contact to the database
contactsRouter.post('/', (req, res) => {
  console.log("ADDING CONTACT TO DATABASE"); // Message on the server
  
  const data = JSON.parse(req.query.contact);
  const query = "INSERT INTO `contacts`(`first_name`, `last_name`) VALUES ('" + data.first_name + "', '" + data.last_name + "')";
  
  db.query(query, (err, result) => {
    if (err) {
      console.log('Error query 1: ' + err);
      res.status('400').send(err);
    }
    else{
      const query2 = "SELECT id FROM `contacts` WHERE id = LAST_INSERT_ID()";
      
      db.query(query2, (err, result) => {
        if (err) {
          console.log('Error query 2: ' + err);
          res.status(400).send(err);
        }
        else{
          const contact_id = result[0].id;
          const query3 = "INSERT INTO `contact_info`(`id`, `phone_number`, `address`, `email`) VALUES ('" + contact_id + "', '" + data.phone_number + "', '" + data.address +  "', '" + data.email + "')";
          
          db.query(query3, (err, result) => {
            if (err) {
              console.log('Error query 3: ' + err);
              res.status(400).send(err);
            }
            else{
              console.log("Contact and their information added to database!!");
              res.status(201).send();
            }
          });
        }
      });
    }
  });
});

// Update an existing contact using the given id
contactsRouter.put('/:id', (req, res) => {
  console.log("UPDATING A CONTACT");
  
  const data = JSON.parse(req.query.contact);
  const query = "UPDATE `contacts` as c INNER JOIN `contact_info` as ci ON (c.id = ci.id) SET c.first_name = '" + data.first_name + "', c.last_name = '" + data.last_name + "', ci.phone_number = '" + data.phone_number + "', ci.email = '" + data.email + "', ci.address = '" + data.address + "' WHERE c.id = '" + req.params.id + "' AND ci.id = '" + req.params.id + "'";
  
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send(err);
    }
    else{
      console.log("Contact has been updated.");
      res.status(200).send();
    }
  });
});

// Delete a contact based on the id provided
contactsRouter.delete('/:id', (req, res) => {
  console.log("DELETING CONTACT BY ID");
    
  const query = "DELETE c, ci FROM `contacts` as c JOIN `contact_info` as ci ON (c.id = ci.id) WHERE c.id = '" + req.params.id + "' AND ci.id = '" + req.params.id + "'";
          
  db.query(query, (err, result) => {
    if (err) {
      console.log('Error query: ' + err);
      res.status(404).send();
    }
    else{
      console.log("Contact deleted");
      res.status(204).send();
    }
  });
});

module.exports = contactsRouter; // Export the Router