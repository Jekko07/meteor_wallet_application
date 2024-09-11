import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { App } from '../ui/App.js';
import '../api/methods/ContactsMethods.js'; // Import for Meteor's optimistic UI
import '../api/methods/TransactionsMethods.js';

Meteor.startup(() => {
  // Create a root using createRoot
  const root = createRoot( document.getElementById('react-target'));
  // Render the App component
  root.render(<App />);
});
