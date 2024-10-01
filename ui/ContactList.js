import { Meteor } from 'meteor/meteor';
import React, { memo, useState } from 'react';
import { ContactsCollection } from '../api/collections/ContactsCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { ErrorAlert } from './components/ErrorAlert';
import { Loading } from './components/Loading';
import { ContactForm } from './ContactForm';

// Move ContactItem outside the ContactList component
// Memoized ContactItem component to prevent unnecessary re-renders
const ContactItem = memo(({ contact, onRemove, onUpdate }) => (
  <li className="flex items-center justify-between space-x-3 py-4">
    <div className="flex min-w-0 flex-1 items-center space-x-3">
      {contact.imageUrl && (
        // Display contact's image if available
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src={contact.imageUrl}
            alt=""
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {/* Display contact's name, email, and wallet ID */}
        <p className="truncate text-sm font-medium text-gray-900">
          {contact.name}
        </p>
        <p className="truncate text-sm font-medium text-gray-500">
          {contact.email}
        </p>
        <p className="truncate text-sm font-medium text-gray-500">
          {contact.walletId}
        </p>
      </div>
      <div>
        {/* Edit button triggers the updateContact function */}
        <button
          onClick={(event) => onUpdate(event, contact)}
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Edit
        </button>
        {/* Delete button triggers the removeContact function */}
        <button
          onClick={(event) => onRemove(event, contact._id)}
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </div>
  </li>
));

export const ContactList = () => {
  // Subscribe to 'myContacts' publication to get contact data
  const isLoading = useSubscribe('myContacts');

  // Fetch contacts from ContactsCollection that are not marked as removed, sorted by creation date
  const contacts = useFind(() =>
    ContactsCollection.find(
      { removed: { $ne: true } },
      { sort: { createdAt: -1 } }
    )
  );

  const [success, setSuccess] = useState('');
  // State to store the selected contact for editing
  const [selectedContact, setSelectedContact] = useState(null); //state for selected contact

  // Function to show success messages temporarily
  const showSuccess = ({ message }) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  // Function to remove a contact using Meteor.call and show success message
  const removeContact = (event, _id) => {
    event.preventDefault();
    Meteor.call('contacts.remove', { contactId: _id }, (error) => {
      if (error) {
        console.error('Error removing contact:', error);
      } else {
        showSuccess({ message: 'Contact Removed' });
      }
    });
  };

  // Function to select a contact for updating and display the ContactForm in edit mode
  const updateContact = (event, contact) => {
    event.preventDefault();
    console.log('Editing contact:', contact);
    setSelectedContact(contact); // Set the contact to be updated
  };

  // Function that will reset the form and the button back to "Save Contact"
  const resetSelectedContact = () => {
    setSelectedContact(null);
  };

  // Display loading indicator while contacts are being fetched
  if (isLoading()) {
    return <Loading />;
  }

  return (
    <div>
      {/* Display success alert if a success message is available */}
      {success && <ErrorAlert message={success} />}

      {/* Pass the resetSelectedContact function to the ContactForm */}
      <ContactForm
        selectedContact={selectedContact}
        resetSelectedContact={resetSelectedContact}
      />

      <div className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Contact List
        </h3>
        <ul className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
          {contacts.map((contact) => (
            // Map over contacts and render a ContactItem for each
            <ContactItem
              key={contact._id}
              contact={contact}
              onRemove={removeContact}
              onUpdate={updateContact}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
