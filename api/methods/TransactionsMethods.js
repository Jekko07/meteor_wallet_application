import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {
  TransactionsCollection,
  ADD_TYPE,
  TRANSFER_TYPE,
} from '../collections/TransactionsCollection';
import SimpleSchema from 'simpl-schema';
import 'meteor/aldeed:collection2/static';
import { WalletRoles } from '../../infra/WalletRoles';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
  'transactions.insert'(args) {
    const { userId } = this;
    if (!userId) {
      throw Meteor.Error('Access denied');
    }
    const schema = new SimpleSchema({
      isTransferring: {
        type: Boolean,
      },
      sourceWalletId: {
        type: String,
      },
      destinationContactId: {
        type: String,
        optional: !args.isTransferring,
      },
      amount: {
        type: Number,
        min: 1,
      },
    });
    const cleanArgs = schema.clean(args);
    schema.validate(cleanArgs);
    const { isTransferring, sourceWalletId, destinationContactId, amount } =
      args;

    return TransactionsCollection.insert({
      type: isTransferring ? TRANSFER_TYPE : ADD_TYPE,
      sourceWalletId,
      destinationContactId: isTransferring ? destinationContactId : null,
      amount,
      createdAt: new Date(),
      userId,
    });
  },
  'transactions.remove'(transactionId) {
    const { userId } = this;
    if (!userId) {
      throw Meteor.Error('Access denied');
    }

    check(transactionId, String);

    //ensures the user cant remove transaction through the console
    if (!Roles.userIsInRole(userId, WalletRoles.ADMIN)) {
      throw new Error('Permission denied!');
    }

    return TransactionsCollection.remove(transactionId);
  },
});
