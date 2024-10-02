import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { RoutePaths } from './RoutePaths';

// NotFound component: displays a 404 error message for unmatched routes
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="flex h-96 flex-col items-center justify-center text-center">
      <FaExclamationTriangle className="mb-4 text-6xl text-yellow-400" />
      <h1 className="mb-4 text-6xl font-bold">404 Not Found</h1>
      <p className="mb-5 text-xl">This page does not exist</p>
      {/* Button to navigate back to the homepage */}
      <button
        onClick={() => navigate(RoutePaths.HOME)} // Redirects to home when the button is clicked
        type="button"
        className="mt-4 rounded-md bg-indigo-700 px-3 py-2 text-white hover:bg-indigo-900"
      >
        Go Back
      </button>
    </section>
  );
};
