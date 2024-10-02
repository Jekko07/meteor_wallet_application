import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';
import { useLoggedUser } from 'meteor/quave:logged-user-react';

// Header component displays the navigation bar and controls sign-up and logout functionality
export const Header = () => {
  const navigate = useNavigate(); // Hook to navigate between different route
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser(); // Fetching logged-in user
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the logged-in user is an admin
  useEffect(() => {
    if (loggedUser) {
      Meteor.call('roles.isAdmin', (error, isAdminResult) => {
        if (!error) {
          setIsAdmin(isAdminResult); // Set state based on admin check
        }
      });
    }
  }, [loggedUser]);

  return (
    <header className="bg-indigo-600">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        {/* Main container for navigation items */}
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex grow items-center justify-between">
            {/* Logo and home navigation */}
            <a
              className="cursor-pointer"
              onClick={() => navigate(RoutePaths.HOME)} // Navigate to home when logo is clicked
            >
              <span className="sr-only">Meteor Wallet</span>
              <img className="h-10 w-auto" src="/images/logo.png" alt="" />
            </a>
            <div>
              {/* Display 'Sign Up' button if the user is not logged in */}
              {!isLoadingLoggedUser && !loggedUser && (
                <button
                  className="font-bold text-white"
                  onClick={() => navigate(RoutePaths.ACCESS)} // Navigate to sign-up page
                >
                  Sign Up
                </button>
              )}
              {/* Display 'Log Out' button if the user is logged in */}
              {!isLoadingLoggedUser && loggedUser && (
                <>
                  {/* Admin Remove Transaction button */}
                  {isAdmin && (
                    <button
                      className="mr-4 rounded-md bg-indigo-600 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-indigo-700"
                      onClick={() => navigate(RoutePaths.REMOVE_TRANSACTION)}
                    >
                      Remove Transaction
                    </button>
                  )}
                  <button
                    className="rounded-md bg-red-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-600"
                    onClick={() => Meteor.logout(navigate(RoutePaths.ACCESS))} // Logout the user and navigate back to access page
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
