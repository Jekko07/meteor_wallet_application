import { ContactsCollection } from '../collections/ContactsCollection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('allContacts', () => ContactsCollection.find());

Meteor.publish('contacts', () =>
  ContactsCollection.find({ archived: { $ne: true } })
);
