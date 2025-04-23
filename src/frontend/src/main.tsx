import React, { createContext, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import './main.css'

import AppRoutes from './app/AppRoutes';
import WithQueryClient from './app/WithQueryClient';
import WithInitialData from './app/WithInitialData';
import WithProviders from './app/WithProviders';
import { ThemeProvider } from './app/WithThemeProvider';
import { ErrorProvider } from './app/WithErrorProvider';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <WithQueryClient>
      <ErrorProvider>
        <WithProviders>
          <WithInitialData>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <AppRoutes />
            </ThemeProvider>
          </WithInitialData>
        </WithProviders>
      </ErrorProvider>
    </WithQueryClient>
  // </React.StrictMode>
);
