// import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { WalletsCollection } from '../api/collections/WalletsCollection';
import { Roles } from 'meteor/alanning:roles';
import { WalletRoles } from './WalletRoles';

// Function is triggered whenever a new user is created
Accounts.onCreateUser((options, user) => {
  // Create a copy of the user object for customization
  const customizedUser = { ...user };

  console.log(`options`, options);
  console.log(`user`, user);

  // Insert a new wallet into the WalletsCollection for the newly created user
  WalletsCollection.insert({ userId: user._id, createdAt: new Date() });

  // Assign the ADMIN role if the email matches
  if (customizedUser.emails[0].address === 'admin@gmail.com') {
    Roles.addUsersToRoles(customizedUser._id, WalletRoles.ADMIN);
    console.log(`Assigned ADMIN role to user ${customizedUser._id}`);
  }

  // Customize the user object by adding the user's email to it
  customizedUser.email = user.emails[0].address;

  // Return the customized user object to complete the user creation process
  return customizedUser;
});

// Define which fields are published by default when user data is sent to the client
Accounts.setDefaultPublishFields({
  ...Accounts._defaultPublishFields.projection,
  email: 1,
});
