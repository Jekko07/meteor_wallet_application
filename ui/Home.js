import React from 'react';
import { Wallet } from './Wallet.js';
import { ContactForm } from './ContactForm.js';
import { ContactList } from './ContactList.js';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { Loading } from './components/Loading.js';
import { RoutePaths } from './RoutePaths.js';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const navigate = useNavigate();

  if (isLoadingLoggedUser) {
    return <Loading />;
  }

  if (!loggedUser) {
    return (
      <div className="flex flex-col items-center p-12">
        <div>Welcome!</div>
        <div>
          Please <a className="text-indigo-800 cursor-pointer" onClick={() => navigate(RoutePaths.ACCESS)}>sign-up</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Wallet />
      <ContactForm />
      <ContactList />
    </>
  );
};
