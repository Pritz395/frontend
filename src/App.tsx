import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
            <div className="App">
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-text)',
                    border: '1px solid var(--toast-border)',
                  },
                }}
              />
            </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;