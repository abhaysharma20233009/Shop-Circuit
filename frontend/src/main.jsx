import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserDataProvider } from './store/userDataStore.jsx'
import { ProductsDataProvider } from './store/productDataStore.jsx'
import { ThemeProvider } from "./store/themeProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <ProductsDataProvider>
   
    <App />
    
    </ProductsDataProvider>
    </ThemeProvider>
    
  
  </StrictMode>,
)
