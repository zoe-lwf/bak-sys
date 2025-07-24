// src/router/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authToken'); // 假设使用 localStorage 存储 token

  if (!isAuthenticated) {
    // 如果未授权，重定向到登录页面，并传递当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果已授权，渲染子组件
  return children;
}

export default PrivateRoute;
