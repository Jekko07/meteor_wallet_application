import { Meteor } from 'meteor/meteor';
import { WalletsCollection } from '../collections/WalletsCollection';
import 'meteor/aldeed:collection2/static';

Meteor.methods({
  'wallets.insert'() {
    // Check if a wallet already exists for the user
    const existingWallet = WalletsCollection.findOne();

    if (existingWallet) {
      // Return the existing wallet's ID if it already exists
      return existingWallet._id;
    }

    // Create a new wallet if none exists
    const walletId = WalletsCollection.insert({
      balance: 0,
      currency: 'PHP',
      createdAt: new Date(),
    });

    return walletId;
  },
});
