import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import SignIn from './routes/SignIn';
import Dashboard from './routes/Dashboard';
import CardEdit from './routes/CardEdit';
import PublicCard from './routes/PublicCard';
import Settings from './routes/Settings';
import Connections from './routes/Connections';

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/card/edit", element: <CardEdit /> },
    { path: "/c/:handle", element: <PublicCard /> },
    { path: "/connections", element: <Connections /> },
    { path: "/settings", element: <Settings /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
);