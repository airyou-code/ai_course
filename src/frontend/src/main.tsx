import React, { createContext, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import './main.css'

import AppRoutes from './app/AppRoutes';
import WithQueryClient from './app/WithQueryClient';
import WithInitialData from './app/WithInitialData';
import WithProviders from './app/WithProviders';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <WithQueryClient>
      <WithProviders>
        <WithInitialData>
          <AppRoutes />
        </WithInitialData>
      </WithProviders>
    </WithQueryClient>
  // </React.StrictMode>
);
