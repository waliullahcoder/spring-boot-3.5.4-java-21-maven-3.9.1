import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store/configureStore';
import AppRoutes from './routes/AppRoutes';
import { MaterialTailwindControllerProvider } from "./context/index"; 
const App = () => (
  <Provider store={store}>
     <BrowserRouter>
    <MaterialTailwindControllerProvider>
      <AppRoutes />
    </MaterialTailwindControllerProvider>
  </BrowserRouter>,
  </Provider>
);

export default App;
