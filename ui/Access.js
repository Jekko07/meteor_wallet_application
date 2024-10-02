import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Route, useNavigate, useLocation } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';
import { ErrorAlert } from './components/ErrorAlert';

// Access component for handling user authentication (Sign Up / Sign In)
export const Access = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the location object
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up

  // Check if state exists from navigation and set isSignUp accordingly
  useEffect(() => {
    if (location.state && location.state.isSignUp !== undefined) {
      setIsSignUp(location.state.isSignUp);
    }
  }, [location.state]);

  // Helper function to display error messages and auto-hide them after 3 second
  const showError = ({ message }) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  // Sign Up function that calls Meteor's Accounts.createUser
  const signUp = (e) => {
    e.preventDefault();
    Accounts.createUser({ email, password }, (err) => {
      if (err) {
        showError({ message: err.reason });
        return;
      }
      setEmail('');
      setPassword('');
      console.log('Success');
      navigate(RoutePaths.HOME);
    });
  };

  // Sign In function that calls Meteor.loginWithPassword
  const signIn = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        showError({ message: err.reason });
        return;
      }
      navigate(RoutePaths.HOME);
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Title dynamically changes between Sign Up and Sign In */}
      <h3 className="px-3 py-2 text-base text-lg font-medium">
        {isSignUp ? 'Sign Up' : 'Sign In to your Account'}
      </h3>
      {/* Error alert displayed if there's an error */}
      {error && <ErrorAlert message={error} />}

      {/* Form for email and password */}
      <form className="mt-6 flex flex-col">
        <div className="flex flex-col space-y-4">
          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              autoComplete="off"
            />
          </div>

          <div className="">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex justify-center py-3">
          {/* Back to Home button */}
          <button
            onClick={() => navigate(RoutePaths.HOME)}
            className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          >
            Back to Home
          </button>

          {/* Sign Up or Sign In button based on isSignUp state */}
          {isSignUp && (
            <button
              onClick={signUp}
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Sign Up
            </button>
          )}
          {!isSignUp && (
            <button
              onClick={signIn}
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Toggle between Sign Up and Sign In */}
        <div className="py-3">
          <a
            className="cursor-pointer text-indigo-800"
            onClick={() => setIsSignUp(!isSignUp)} // Toggle between Sign Up and Sign In
          >
            {isSignUp
              ? 'If you already have an account, click here'
              : `If you don't have an account, click here`}
          </a>
        </div>
      </form>
    </div>
  );
};
