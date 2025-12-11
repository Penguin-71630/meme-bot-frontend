// src/pages/Login.tsx
import { useEffect, useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage('No token provided in URL');
      return;
    }

    // Call backend login endpoint
    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANT: This allows cookies to be set
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus('success');
          // Remove token from URL for security
          window.history.replaceState({}, document.title, '/');
          // Wait a moment then notify parent
          setTimeout(() => {
            onLoginSuccess();
          }, 1000);
        } else {
          const error = await res.text();
          setStatus('error');
          setErrorMessage(error || 'Login failed');
        }
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message);
      });
  }, [onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Logging in...</h1>
              <p className="text-gray-600">Please wait while we authenticate you.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Login Successful!</h1>
              <p className="text-gray-600">Redirecting to the app...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 text-5xl mb-4">✗</div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Login Failed</h1>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}