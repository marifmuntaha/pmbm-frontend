import React from "react";
import {createRoot} from 'react-dom/client';
import App from "./App";

import "./assets/scss/dashlite.scss";

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
    <React.Fragment>
        <App />
    </React.Fragment>
);
