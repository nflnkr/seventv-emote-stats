import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { theme } from "./theme";
import { NextUIProvider } from '@nextui-org/react';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <NextUIProvider theme={theme}>
            <App />
        </NextUIProvider>
    </React.StrictMode>
);