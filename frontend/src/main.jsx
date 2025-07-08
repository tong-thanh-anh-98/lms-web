// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.scss';
// react-core
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './components/context/Auth.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
)
