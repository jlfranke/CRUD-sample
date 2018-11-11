import React, { Component } from 'react'; // Import React and Component from react library
import '../views/addContact.css' // Import the addContact styling

class AddContact extends Component{
  // Render the Add New Contact form
  render(){
    return(
      <div className="addContact">
        <h3>Add New Contact</h3>
        <div className="input-group mb-3">          
          <input type="text" className="form-control addSpace" placeholder="First Name" onBlur={this.props.onInputChange.bind(this, "first_name")} />
          <input type="text" className="form-control" placeholder="Last Name" onBlur={this.props.onInputChange.bind(this, "last_name")} />
        </div>
        <div className="input-group mb-3">          
          <input type="text" id="addPhoneNumber" className="form-control addSpace" placeholder="Phone Number" onBlur={this.props.onInputChange.bind(this, "phone_number")} />
          <input type="text" className="form-control" placeholder="Email" onBlur={this.props.onInputChange.bind(this, "email")} />
        </div>
        <div className="input-group mb-3">          
          <input type="text" className="form-control" placeholder="Address" onBlur={this.props.onInputChange.bind(this, "address")} />
        </div>
        
        <div className="formFooter">
          <div className="addNewContactError">{this.props.errorMessage}</div>
          <button type="button" className="btn btn-success" onClick={this.props.onAddContactClick}>Add Contact</button>
        </div>
      </div>
    );
  }
}

export default AddContact;