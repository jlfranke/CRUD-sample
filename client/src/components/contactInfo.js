import React, { Component } from 'react'; // Import React and Component from react library
import '../views/contactInfo.css' // Import contact info styling

class ContactInfo extends Component{
  // Render the contact's information
  render(){
    // Create the formFooter bassed on the status
    const formFooter = this.props.status === "edit" ?
      <div className="formFooter">
        <div className="updateContactError">{this.props.errorMessage}</div>
        <button type="button" className="btn btn-success" onClick={this.props.onUpdateContactClick}>Update Contact</button>
      </div>
    :
      <div className="formFooter">
        <button type="button" className="btn btn-danger" onClick={this.props.onDeleteContactClick.bind('this', this.props.contact.id)}>Delete Contact</button>
        <button type="button" className="btn btn-primary" onClick={this.props.onEditContactClick}>Edit Contact</button>
      </div>
    return(
      <div id="info">
        <h3>Contact's Information</h3>
        <div className="input-group mb-3">          
          <input type="text" id="contact_first_name" className="form-control addSpace" placeholder="First Name" disabled="disabled" onBlur={this.props.onInputChange.bind(this, "first_name")} />
          <input type="text" id="contact_last_name" className="form-control" placeholder="Last Name" disabled="disabled" onBlur={this.props.onInputChange.bind(this, "last_name")} />
        </div>
        <div className="input-group mb-3">          
          <input type="text" id="contact_phone_number" className="form-control addSpace" placeholder="Phone Number" disabled="disabled" onBlur={this.props.onInputChange.bind(this, "phone_number")} />
          <input type="text" id="contact_email" className="form-control" placeholder="Email" disabled="disabled" onBlur={this.props.onInputChange.bind(this, "email")} />
        </div>
        <div className="input-group mb-3">          
          <input type="text" id="contact_address" className="form-control" placeholder="Address" disabled="disabled" onBlur={this.props.onInputChange.bind(this, "address")} />
        </div>
        
        { formFooter }
      </div>
    );
  }
}

export default ContactInfo