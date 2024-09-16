import { ContactsCollection } from '../collections/ContactsCollection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('myContacts', function publishContacts() {
  const { userId } = this;
  if (!userId) {
    throw Meteor.Error('Access denied');
  }
  return ContactsCollection.find({userId});
});
