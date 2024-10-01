import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { ErrorAlert } from './components/ErrorAlert.js';
import { SuccessAlert } from './components/SuccessAlert.js';

// ContactForm component to add or update a contact
export const ContactForm = ({ selectedContact, resetSelectedContact }) => {
  const [name, setName] = React.useState(''); // Formik
  const [email, setEmail] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [walletId, setWalletId] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // useEffect to populate the form with selected contact's data for editing
  useEffect(() => {
    if (selectedContact) {
      // If a contact is selected, pre-fill the form with its data
      setName(selectedContact.name || '');
      setEmail(selectedContact.email || '');
      setImageUrl(selectedContact.imageUrl || '');
      setWalletId(selectedContact.walletId || '');
    } else {
      // Reset form if not editing
      setName('');
      setEmail('');
      setImageUrl('');
      setWalletId('');
    }
  }, [selectedContact]);

  // Function to display error messages temporarily
  const showError = ({ message }) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Function to display success message temporarily
  const showSuccess = ({ message }) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  const saveContact = () => {
    // client side validation
    if (!name) {
      showError({ message: 'Name is required.' });
      return;
    }

    if (!email) {
      showError({ message: 'Email is required.' });
      return;
    }

    if (!imageUrl) {
      showError({ message: 'Image URL is required.' });
      return;
    }

    if (!walletId) {
      showError({ message: 'Wallet ID is required.' });
      return;
    }

    // Check if we're updating or inserting
    const method = selectedContact ? 'contacts.update' : 'contacts.insert';
    const params = selectedContact
      ? { contactId: selectedContact._id, name, email, imageUrl, walletId }
      : { name, email, imageUrl, walletId };

    // If all fields are valid, proceed with the Meteor call
    Meteor.call(method, params, (errorResponse) => {
      if (errorResponse) {
        showError({ message: errorResponse.error });
      } else {
        setName('');
        setEmail('');
        setImageUrl('');
        setWalletId('');
        showSuccess({
          message: selectedContact ? 'Contact updated.' : 'Contact saved.',
        });

        // Reset form to default state for adding a new contact
        if (selectedContact) {
          resetSelectedContact(); // Calls the reset function to switch back to "Save Contact"
        }
      }
    });
  };

  return (
    <form className="mt-6">
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 sm:col-span-6 lg:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            autoComplete="off"
          />
        </div>

        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            autoComplete="off"
          />
        </div>

        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-6">
          <label
            htmlFor="walletId"
            className="block text-sm font-medium text-gray-700"
          >
            Wallet ID
          </label>
          <input
            type="text"
            id="walletId"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="px-2 py-3 text-right">
        {/* Cancel button if the user wants to cancel editing */}
        {selectedContact && (
          <button
            type="button"
            onClick={resetSelectedContact} // Resets the form to switch back to "Save Contact"
            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={saveContact}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          {selectedContact ? 'Update Contact' : 'Save Contact'}
        </button>
      </div>
    </form>
  );
};
