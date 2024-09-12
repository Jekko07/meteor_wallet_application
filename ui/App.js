import React from 'react';
import { Header } from './Header.js';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './Router.js';
import { AlertProvider, Alert } from 'meteor/quave:alert-react-tailwind';

export const App = () => (
  <BrowserRouter>
    <AlertProvider>
      <div>
        <Header />
        <Alert />
        <div className="min-h-full">
          <div className="mx-auto max-w-4xl p-2">
            <AppRoutes />
          </div>
        </div>
      </div>
    </AlertProvider>
  </BrowserRouter>
);
