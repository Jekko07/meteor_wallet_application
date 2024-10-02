import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { Loading } from './Loading';
import { RoutePaths } from '../RoutePaths';

// Component to restrict access to anonymous users onl
export const AnonymousOnly = ({ children }) => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const location = useLocation();

  if (isLoadingLoggedUser) {
    return <Loading />;
  }

  // If a user is logged in, redirect them to the home page, saving the current location for potential navigation back
  if (loggedUser) {
    return <Navigate to={RoutePaths.HOME} state={{ from: location }} replace />;
  }
  return children;
};
