import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { NotFound } from './NotFound';
import { Access } from './Access';
import { RoutePaths } from './RoutePaths';
import { ForgotPassword } from './ForgotPassword';

export const AppRoutes = () => (
  <Routes>
    <Route path={RoutePaths.HOME} element={<Home />} />
    <Route path={RoutePaths.ACCESS} element={<Access />} />
    <Route path={RoutePaths.FORGOT_PASSWORD} element={<ForgotPassword />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
