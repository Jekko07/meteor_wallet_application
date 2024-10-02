import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { WalletRoles } from '../../infra/WalletRoles';

Meteor.methods({
  'roles.isAdmin'() {
    const { userId } = this;
    // Check if there is a logged-in user
    if (!userId) {
      throw new Meteor.Error(
        'not-authorized',
        'Access denied. User is not logged in.'
      );
    }

    // Check if the user has the ADMIN role
    const isAdmin = Roles.userIsInRole(userId, WalletRoles.ADMIN);
    // console.warn(`User ${userId} is not an admin`);
    return isAdmin; // Return true or false
  },
});
