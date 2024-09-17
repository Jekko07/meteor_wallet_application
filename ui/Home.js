import React from 'react';
import { Wallet } from './Wallet.js';
import { ContactForm } from './ContactForm.js';
import { ContactList } from './ContactList.js';

export const Home = () => {
  return (
    <>
      <Wallet />
      <ContactForm />
      <ContactList />
    </>
  );
};
