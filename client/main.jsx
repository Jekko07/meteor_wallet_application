import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import "../imports/api/ContactsMethods"; //import so that meteor will support optimistic ui

Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
});
