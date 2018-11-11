import React, { Component } from 'react'; // Import React and Component from react library
import Contacts from './components/contacts.js'; // Import the Contacts component
import ContactInfo from './components/contactInfo.js'; // Import the ContactInfo component
import AddContact from './components/addContact.js'; // Import the AddContact component
import './App.css'; // Import App (main) styling

const $ = window.$;

class App extends Component {
  constructor(props){
    super(props);
    
    // Initialize variables
    this.state = {
      contactList: [],
      contactInfo: [],
      newContact: {},
      newContactError: '',
      infoStatus: "select",
      viewContactStatus: "view"
    }
    
    // Bind this keyword to necessary functions
    this.getContacts = this.getContacts.bind(this);
    this.viewContact = this.viewContact.bind(this);
    this.viewAddContactForm = this.viewAddContactForm.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.addContact = this.addContact.bind(this);
    this.editContact = this.editContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }
  
  // Function called when component has mounted
  // On page load get all contacts
  componentDidMount(){
    this.getContacts();
  }
  
  // Function to call the API function to get all the contacts
  // Called in the componentDidMount function and the deleteContact function
  getContacts(){
    // Call the API function to get the contacts
    this.apiGetContacts()
      .then(res => this.setState({ contactList: res })) // Set the results to the contactList variable
      .catch(err => console.log(err)); // Print out the error if failed
  }
  
  // Function to call the API function to get the information of a selected contact
  // Called in the Contacts Component when a contact's name is clicked
  viewContact(id){
    // Call the API function to get the info of the selected contact
    this.apiGetContactInfo(id)
      .then(res => {
        this.setState({ contactInfo: res }); // Set the results to the contactInfo variable
        this.setState({ newContactError: '' }); // Reset any errors
        this.setState({ viewContactStatus: "view" }); // Reset the contact info status to 'view'
        this.setState({ infoStatus: 'view' }); // Change the info section status to 'view'
        
        $("div#info input").attr("disabled", "disabled"); // Reset the input to all be disabled
        
        // set the value for all the inputs
        for(const key in res){
          $("div#info input#contact_" + key).val(res[key]);
        }
      })
      .catch(err => console.log(err)); // Print out the error if failed
  }
  
  // Function to update the status to display the add contact form
  // Called in the Contacts Component when the plus sign in clicked
  viewAddContactForm(){
    this.setState({ infoStatus: 'add' }); // Change the info section status to 'add'
  }
  
  // Function to handle changes made to inputs
  // Called in the AddContact and ContactInfo Components when an input is left
  handleFormChange(name, event){
    let newContactArray = this.state.newContact; // Assign the current state of the add form information
    
    if(name === "phone_number"){ // If the input is for the phone number
      const phone = this.formatPhone(event.target.value, event.target); // Format the phone
      newContactArray[name] = phone; // Add the formatted phone to the array
    }
    else{ // All other inputs
      newContactArray[name] = event.target.value; // Add the new information to the array
    }
    
    this.setState({ newContact: newContactArray }); // Set the state using the adjusted array
  }
  
  // Function to verify all fields are filled
  // Also calls the API function to add the contact to the database
  addContact(){    
    // Validate the information and continue only if all is valid      
    if(this.validateInformation() === 1){
      // Call the API function to get the contacts
      this.apiAddContact(this.state.newContact)
        .then(res => {            
          this.getContacts(); // Get the update list of contacts
          this.setState({ infoStatus: 'select' }); // Reset contact section status to default
          this.setState({ newContact: {} }); // Reset new contact state
          $(".contactInfo").append("<span class='successMessage'>Contact Added</span>");
          setTimeout( () => {
            $(".successMessage").remove();
          }, 3000);
        }) // Set the results to the contactList variable
        .catch(err => console.log(err)); // Print out the error if failed
    }
  }
  
  // Function to reformat phone number to (xxx) xxx-xxxx
  // Called in the handleFormChange function
  formatPhone(phone, input) {
    const plainPhone = phone.replace(/\D/g,''); // Remove all non digit characters;
    
    if (plainPhone.length === 10){
      // Reformat phone number
      const formattedPhone = '(' + plainPhone[0] + plainPhone[1] + plainPhone[2] + ') ' + plainPhone[3] + plainPhone[4] + plainPhone[5] + '-' + plainPhone[6] + plainPhone[7] + plainPhone[8] + plainPhone[9];
      
      input.value = formattedPhone; // Change the inputs displayed phone number to the formatted version
      
      return formattedPhone; // Return the formatted phone number
    }
    
    // Else return the orginal phone number
    return phone;
  }
  
  // Function to validate the contact's information
  // Called in the addContact function
  validateInformation(){
    const info = this.state.newContact;
    let errorMessage = '';
    
    // Check that all inputs have been filled
    if (Object.keys(this.state.newContact).length < 5 || this.checkObjectValues(info) === -1) { // If not all the fields are filled
      errorMessage += "All fields required"; // Add error message
    }
    else{
      // Check that name only contains letters
      if(!/^[a-zA-Z]+$/.test(info['first_name']) || !/^[a-zA-Z]+$/.test(info['last_name'])){
        errorMessage += "Name can only have letters. "; // Add error message
      }
      
      // Check that the phone has 10 digits only
      if(info['phone_number'].replace(/\D/g,'').length !== 10){
        errorMessage += "Phone must have 10 digits. "; // Add error message
      }  
    }    
    
    this.setState({ newContactError: errorMessage }); // Set the error message state
    
    return errorMessage === '' ? 1 : -1; // Return positive if no errors, negative if errors
  }
  
  // Function to loop through all the values in the newContact object to check if they are not empty
  // Called in the validateInformation function
  checkObjectValues(object){    
    // Loop through all values in the object
    for(const key in object){
      if (object[key] === "" || object[key] == null) { // If the value is empty or null
        return -1; // Return negative to signal for an error
      }
    }
    
    return 1; // If all values are filled return positive for no errors
  }
  
  // Function to change the view contact form to an editable version
  // Called in the ContactInfo Component
  editContact(){
    this.setState({ newContact: this.state.contactInfo }); // Set the new contact object to the contact's info
    this.setState({ viewContactStatus: "edit" }); // Change the view contact status to edit
    $("div#info input").removeAttr("disabled"); // Re-activate the inputs
  }
  
  // Function to call the API function to update the contact in the database
  // Called in the ContactInfo Component
  updateContact(){
    // Validate the information and continue only if all is valid      
    if(this.validateInformation() === 1){
      // Call the API function to get the contacts
      this.apiUpdateContact(this.state.newContact)
        .then(res => {            
          this.getContacts(); // Get the update list of contacts
          this.setState({ infoStatus: 'select' }); // Reset contact section status to default
          this.setState({ newContact: {} }); // Reset new contact state
          $(".contactInfo").append("<span class='successMessage'>Contact Updated</span>");
          setTimeout( () => {
            $(".successMessage").remove();
          }, 3000);
        }) // Set the results to the contactList variable
        .catch(err => console.log(err)); // Print out the error if failed
    }
  }
  
  // Function to call the API function to delete a contact by id
  // Called in the Contacts Component when the trash can icon is clicked
  deleteContact(id){
    // Call the API function to get the info of the selected contact
    this.apiDeleteContact(id)
      .then(res => {
        this.getContacts(); // Get the update list of contacts
        this.setState({ infoStatus: 'select' }); // Change the info section status to 'view'
        
        $(".contactInfo").append("<span class='deletionMessage'>Contact Deleted</span>");
        setTimeout( () => {
          $(".deletionMessage").remove();
        }, 3000);
      })
      .catch(err => console.log(err)); // Print out the error if failed
  }
  
  // Function that makes a HTTP Get request to get all contacts
  // Called in the componentDidMount function
  apiGetContacts = async () => {
    // Make request
    const response = await fetch('/api/contacts', {
      method: "get"
    });
    
    const body = await response.json(); // Parse the return data
     
    if (response.status !== 200) throw Error(body.message); // If the status is not OK throw error using the message returned
    
    return body.array; // Return the array of contacts
  }
  
  // Function that makes a HTTP Get request to get information of a single contacts based on id
  // Called in the viewContact function
  apiGetContactInfo = async (id) => {
    // Make request
    const response = await fetch('/api/contacts/' + id, {
      method: "get"
    });
        
    const body = await response.json(); // Parse the return data
     
    if (response.status !== 200) throw Error(body.message); // If the status is not OK throw error using the message returned
            
    return body.array[0]; // Return the array of contact information
  }
  
  // Function that makes a HTTP Post request to add a contact to the database
  // Called in the addContact function
  apiAddContact = async (contact) => {
    const url = '/api/contacts?contact=' + JSON.stringify(contact);
    
    const response = await fetch(url, {
      method: "post"
    });
     
    if (response.status !== 201) throw Error(response.statusText); // If the status is not OK throw error using the message returned
    
    return;
  }
  
  // Function that makes a HTTP Put request to update an existing contact
  // Called in the updateContact function
  apiUpdateContact = async (contact) => {
    const url = '/api/contacts/' + contact.id + '?contact=' + JSON.stringify(contact);
    
    const response = await fetch(url, {
      method: "put"
    });
     
    if (response.status !== 200) throw Error(response.statusText); // If the status is not OK throw error using the message returned
    
    return;
  }
  
  // Function that makes a HTTP Delete request to delete a contact from the database
  // Called in the deleteContact function
  apiDeleteContact = async (id) => {
    const response = await fetch('/api/contacts/' + id, {
      method: "delete"
    });
    
    if (response.status !== 204) throw Error(response.statusText);
    
    return;
  }
  
  // Render various components
  render() {
    let info;
    if (this.state.infoStatus === "view") { info = <ContactInfo contact={this.state.contactInfo} status={this.state.viewContactStatus} errorMessage={this.state.newContactError} onInputChange={this.handleFormChange} onDeleteContactClick={this.deleteContact} onEditContactClick={this.editContact} onUpdateContactClick={this.updateContact} /> }
    else if(this.state.infoStatus === "add"){ info = <AddContact onInputChange={this.handleFormChange} onPhoneLeave={this.formatPhone} onAddContactClick={this.addContact} errorMessage={this.state.newContactError} /> }
    else{ info = <p>Select a contact to view their information or click "Add contact" to add a new contact.</p> }
    return (
      <div className="App container">
        <header>
          <h1>Contact List</h1>
        </header>
        
        <div className="content">
          <div className="contactList">
            <Contacts contacts={this.state.contactList} onContactClick={this.viewContact} onAddContactClick={this.viewAddContactForm} onDeleteContactClick={this.deleteContact} />
          </div>
          <div className="contactInfo">
            { info }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
