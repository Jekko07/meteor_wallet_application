import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { Modal } from './components/Modal.js';
import { SelectContact } from './components/SelectContact.js';
import { ContactsCollection } from '../api/collections/ContactsCollection.js';
import { WalletsCollection } from '../api/collections/WalletsCollection.js';
import { Loading } from './components/Loading.js';

export const Wallet = () => {
  const { loggedUser } = useLoggedUser(); // Fetching the logged-in user's data
  const isLoadingContacts = useSubscribe('myContacts'); // Subscribing to contacts data
  const isLoadingWallets = useSubscribe('myWallet'); // Subscribing to wallets data

  // Fetching contacts from the ContactsCollection where they are not archived
  const contacts = useFind(() =>
    ContactsCollection.find(
      { archived: { $ne: true } },
      { sort: { createdAt: -1 } }
    )
  );

  // Fetching the first wallet found in the WalletsCollection
  const [wallet] = useFind(() => WalletsCollection.find());

  const [open, setOpen] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [destinationContact, setDestinationContact] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState('');

  // Function to handle adding a transaction
  const addTransaction = () => {
    if (!wallet) {
      setErrorMessage('Wallet not initialized.');
      return;
    }

    // Calling the 'transactions.insert' Meteor method to add a new transaction
    Meteor.call(
      'transactions.insert',
      {
        isTransferring,
        sourceWalletId: wallet._id,
        destinationContactId: destinationContact?._id || '',
        amount: Number(amount),
      },
      (errorResponse) => {
        if (errorResponse) {
          if (errorResponse.error) {
            setErrorMessage(errorResponse.error);
          } else {
            // Properly handle and log each error message
            const errorMessages =
              errorResponse.details?.map((error) => error.message) || [];
            setErrorMessage(errorMessages.join('. ')); // Combine messages into a single string
          }
        } else {
          // Resetting the modal and form state upon successful transaction
          setOpen(false);
          setDestinationContact({});
          setAmount(0);
          setErrorMessage('');
        }
      }
    );
  };

  // Display loading screen if contacts or wallets data is still being fetched
  if (isLoadingContacts() || isLoadingWallets()) {
    return <Loading />;
  }

  return (
    <div>
      <div className="my-10 flex font-sans shadow-md">
        <form className="flex-auto p-6">
          <div className="flex flex-wrap">
            <div className="mt-2 w-full flex-none text-sm font-medium text-gray-500">
              Email:
            </div>
            <h1 className="flex-auto text-lg font-semibold text-gray-700">
              {loggedUser?.email}
            </h1>
            <div className="mt-2 w-full flex-none text-sm font-medium text-gray-500">
              Wallet ID:
            </div>
            <h1 className="flex-auto text-lg font-semibold text-gray-700">
              {wallet._id}
            </h1>
            <div className="text-2xl font-bold text-gray-500">{`${wallet.balance} ${wallet.currency}`}</div>
          </div>
          <div className="flex space-x-4 text-sm font-medium">
            <div className="mt-4 flex flex-auto space-x-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                onClick={() => {
                  setIsTransferring(false);
                  setErrorMessage('');
                  setOpen(true);
                }}
              >
                Add Money
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                onClick={() => {
                  setIsTransferring(true);
                  setErrorMessage('');
                  setOpen(true);
                }}
              >
                Transfer Money
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal component for adding or transferring money */}
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          isTransferring
            ? 'Transfer money to other wallet'
            : 'Add money to your wallet' // Modal title changes based on transaction type
        }
        body={
          <>
            {/* Contact selector for transferring money */}
            {isTransferring && (
              <div>
                <SelectContact
                  title="Destination contact"
                  contacts={contacts}
                  selectedContact={destinationContact}
                  setContact={setDestinationContact}
                />
              </div>
            )}

            {/* Input field for transaction amount */}
            <div className="mt-2">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                min={0}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </>
        }
        footer={
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            onClick={addTransaction}
          >
            {isTransferring ? 'Transfer' : 'Add'}{' '}
            {/* Button text changes based on transaction type */}
          </button>
        }
        errorMessage={errorMessage}
      />
    </div>
  );
};
