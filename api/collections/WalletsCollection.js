import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import 'meteor/aldeed:collection2/static';

export const WalletsCollection = new Mongo.Collection('wallets');

const WalletsSchema = new SimpleSchema({
  balance: {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
  currency: {
    type: String,
    allowedValues: ['PHP', 'USD'],
    defaultValue: 'PHP',
  },
  createdAt: {
    type: Date,
  },
});

WalletsCollection.attachSchema(WalletsSchema);
