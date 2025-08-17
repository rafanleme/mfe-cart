import React from 'react';
import { createRoot } from 'react-dom/client';
import CartApp from './CartApp';
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <CartApp />
  </BrowserRouter>
);
