import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from './Loading';
import { RoutePaths } from '../RoutePaths';

// Component to restrict access to admin users only
export const AdminOnly = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null); // State to store whether the user is an admin or not
  const location = useLocation(); // Hook to access the current route location, used for redirecting
  
  useEffect(() => {
    // Calling Meteor Method to check if the current user is an admin
    Meteor.call('roles.isAdmin', (error, isAdminReturn) => {
      if (error) {
        setIsAdmin(false); // If there's an error, assume the user is not an admin
        return;
      }
      setIsAdmin(isAdminReturn);
    });
  }, []);

  // Shows the loading screen while admin status is still being checked
  if (isAdmin == null) {
    return <Loading />;
  }

  // If the user in not an admin, redirect them to the home page, saving the current location for potential navigation back
  if (!isAdmin) {
    return <Navigate to={RoutePaths.HOME} state={{ from: location }} replace />;
  }

  // If the user is an admin, render the child components (the content of the protected route)
  return children;
};
