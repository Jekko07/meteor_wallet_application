import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Modal } from './components/Modal.js';
import { SelectContact } from './components/SelectContact.js';
import { ContactsCollection } from '../api/collections/ContactsCollection.js';
import { WalletsCollection } from '../api/collections/WalletsCollection.js';
import { Loading } from './components/Loading.js';

export const Wallet = () => {
  const isLoadingContacts = useSubscribe('contacts');
  const isLoadingWallets = useSubscribe('wallets');
  const contacts = useFind(() =>
    ContactsCollection.find(
      { archived: { $ne: true } },
      { sort: { createdAt: -1 } }
    )
  );

  // Fetch the wallet or initialize one if it doesn't exist
  const [wallet, walletLoading] = useFind(() => WalletsCollection.find());

  React.useEffect(() => {
    if (!walletLoading && !wallet) {
      Meteor.call('wallets.insert', (error) => {
        if (error) {
          console.error('Error creating wallet:', error);
        }
      });
    }
  }, [walletLoading, wallet]);

  const [open, setOpen] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [destinationWallet, setDestinationWallet] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState('');

  const addTransaction = () => {
    if (!wallet) {
      setErrorMessage('Wallet not initialized.');
      return;
    }

    Meteor.call(
      'transactions.insert',
      {
        isTransferring,
        sourceWalletId: wallet._id,
        destinationWalletId: destinationWallet?.walletId || '',
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
          setOpen(false);
          setDestinationWallet({});
          setAmount(0);
          setErrorMessage('');
        }
      }
    );
  };

  if (isLoadingContacts() || isLoadingWallets() || walletLoading) {
    return <Loading />;
  }

  if (!wallet) {
    return <Loading />;
  }

  return (
    <div>
      <div className="my-10 flex font-sans shadow-md">
        <form className="flex-auto p-6">
          <div className="flex flex-wrap">
            <div className="w-full flex-none text-sm font-medium text-gray-500">
              Main Account
            </div>
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

      <Modal
        open={open}
        setOpen={setOpen}
        title={
          isTransferring
            ? 'Transfer money to other wallet'
            : 'Add money to your wallet'
        }
        body={
          <>
            {isTransferring && (
              <div>
                <SelectContact
                  title="Destination contact"
                  contacts={contacts}
                  selectedContact={destinationWallet}
                  setContact={setDestinationWallet}
                />
              </div>
            )}

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
            {isTransferring ? 'Transfer' : 'Add'}
          </button>
        }
        errorMessage={errorMessage}
      />
    </div>
  );
};
