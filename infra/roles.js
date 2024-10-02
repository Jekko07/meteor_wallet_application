import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { WalletRoles } from './WalletRoles';

// Create ADMIN role if it doesn't already exist
Roles.createRole(WalletRoles.ADMIN, { unlessExists: true });

Meteor.startup(() => {
  // Find the user by searching in the 'emails' array for the specific email
  const user = Meteor.users.findOne({
    'emails.address': 'jranara.webdev@gmail.com',
  });

  // Check if the user exists and is not already an admin
  if (user && !Roles.userIsInRole(user._id, WalletRoles.ADMIN)) {
    // Add the user to the ADMIN role
    Roles.addUsersToRoles(user._id, WalletRoles.ADMIN);
    console.log(`Added user ${user._id} to admin role`);
  } else {
    console.log('User not found or already an admin');
  }
});
