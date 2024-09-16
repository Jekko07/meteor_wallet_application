import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ContactsCollection } from '../collections/ContactsCollection';

Meteor.methods({
  'contacts.insert'({ name, email, imageUrl, walletId }) {
    const { userId } = this;
    if (!userId) {
      throw Meteor.Error('Access Denied');
    }
    check(name, String);
    check(email, String);
    check(imageUrl, String);
    check(walletId, String);
    return ContactsCollection.insert({
      name,
      email,
      imageUrl,
      walletId,
      createdAt: new Date(),
      userId,
    });
  },
  'contacts.remove'({ contactId }) {
    check(contactId, String);
    ContactsCollection.remove(contactId);
  },
  'contacts.archive'({ contactId }) {
    check(contactId, String);
    ContactsCollection.update({ _id: contactId }, { $set: { archived: true } });
  },
});
