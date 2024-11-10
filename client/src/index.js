import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Util } from 'reactstrap';


import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import DataContextProvider from './context/dataProvider';

Util.setGlobalCssModule({
  "form-select": 'form-select shadow-none',
  "form-control": 'form-control shadow-none',
});

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
    <React.StrictMode>
        <BrowserRouter>
            <DataContextProvider>
                <App />
            </DataContextProvider>
        </BrowserRouter>

    </React.StrictMode>
);