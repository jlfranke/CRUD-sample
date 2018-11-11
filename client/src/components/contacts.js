import React, { Component } from 'react'; // Import React and Component from react library
import '../views/contacts.css' // Import contacts styling

class Contacts extends Component{
  // Render the contact list
  render(){
    // Turn contacts array into paragraph "rows"
    const contacts = this.props.contacts.map( contact => 
      <p key={ contact.id }>
        <span onClick={this.props.onContactClick.bind('this', contact.id)}>{ contact.first_name } { contact.last_name }</span>
        <span className="deleteContactText" onClick={this.props.onDeleteContactClick.bind('this', contact.id)}>Delete Contact</span>
      </p>
    );
    return(
      <div className="contacts">
        <h3>Contacts <br/>
          <span className="addContactText" onClick={this.props.onAddContactClick}>Add contact</span>
        </h3>
        
        { contacts }
      </div>
    );
  }
}

export default Contacts