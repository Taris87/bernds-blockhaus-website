import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './app/router';
import './styles/index.css';

// Restore the path encoded by public/404.html on GitHub Pages.
const redirect = sessionStorage.getItem('gh-pages-redirect');
if (redirect) {
  sessionStorage.removeItem('gh-pages-redirect');
  const target = new URL(redirect, window.location.origin);
  window.history.replaceState(null, '', target.pathname + target.search + target.hash);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>,
);
