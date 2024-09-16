import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { WalletsCollection } from '../api/collections/WalletsCollection';

Accounts.onCreateUser((options, user) => {
  const customizedUser = { ...user };

  console.log(`options`, options);
  console.log(`user`, user);

  WalletsCollection.insert({ userId: user._id, createdAt: new Date() });

  customizedUser.email = user.emails[0].address;
  return customizedUser;
});

Accounts.setDefaultPublishFields({
  ...Accounts._defaultPublishFields.projection,
  email: 1,
});
