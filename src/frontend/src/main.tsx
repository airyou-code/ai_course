import React, { createContext, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import './main.css'

import AppRoutes from './app/AppRoutes';
import WithQueryClient from './app/WithQueryClient';
import WithInitialData from './app/WithInitialData';
import WithProviders from './app/WithProviders';
import { ThemeProvider } from './app/WithThemeProvider';
// Импорт вашего файла конфигурации i18n
import i18n from './i18n';
// Провайдер из react-i18next
import { I18nextProvider } from 'react-i18next';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <WithQueryClient>
      <I18nextProvider i18n={i18n}>
        <WithProviders>
          <WithInitialData>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <AppRoutes />
            </ThemeProvider>
          </WithInitialData>
        </WithProviders>
      </I18nextProvider>
    </WithQueryClient>
  // </React.StrictMode>
);
