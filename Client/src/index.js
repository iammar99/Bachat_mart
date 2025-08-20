import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from 'Context/AuthContext';
import DetailContextProvider from 'Context/DetailContext';
import CartContextProvider from 'Context/CartContext';
import CheckOutContextProvider from 'Context/CheckOutContext';
import ProfileImageContextProvider from 'Context/ProfileImageContext';
import ProfileContextProvider from 'Context/ProfileContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <DetailContextProvider>
          <CartContextProvider>
            <CheckOutContextProvider>
              <ProfileImageContextProvider>
                <ProfileContextProvider>
                  <App />
                </ProfileContextProvider>
              </ProfileImageContextProvider>
            </CheckOutContextProvider>
          </CartContextProvider>
        </DetailContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
