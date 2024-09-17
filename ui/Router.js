import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { NotFound } from './NotFound';
import { Access } from './Access';
import { RoutePaths } from './RoutePaths';
import { LoggedUserOnly } from './components/LoggedUserOnly';
import { AnonymousOnly } from './components/AnonymousOnly';

export const AppRoutes = () => (
  <Routes>
    <Route
      path={RoutePaths.HOME}
      element={
        <LoggedUserOnly>
          <Home />
        </LoggedUserOnly>
      }
    />
    <Route
      path={RoutePaths.ACCESS}
      element={
        <AnonymousOnly>
          <Access />
        </AnonymousOnly>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
