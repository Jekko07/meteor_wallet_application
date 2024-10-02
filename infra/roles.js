import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { WalletRoles } from './WalletRoles';

// Create ADMIN role if it doesn't already exist
Roles.createRole(WalletRoles.ADMIN, { unlessExists: true });

Meteor.startup(() => {
  // Find the user with the specific email 'jranara.webdev@gmail.com'
  const user = Meteor.users.findOne({ email: 'jranara.webdev@gmail.com' });

  // If the user doesn't exist or the user is already an admin, exit the function
  if (!user || Roles.userIsInRole(user._id, WalletRoles.ADMIN)) {
    return; // Stop further execution if the user is already in the ADMIN role
  }

  // Add the user to the ADMIN role
  Roles.addUsersToRoles(user._id, WalletRoles.ADMIN);
});
