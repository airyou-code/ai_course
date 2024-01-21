import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import './main.css'

import AppRoutes from './app/AppRoutes';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <Router>
      <AppRoutes />
    </Router>
  </React.StrictMode>,
);
