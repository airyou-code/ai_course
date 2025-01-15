import React, { createContext, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import './main.css'

import AppRoutes from './app/AppRoutes';
import WithQueryClient from './app/WithQueryClient';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <WithQueryClient>
      <AppRoutes />
    </WithQueryClient>
  // </React.StrictMode>
);
