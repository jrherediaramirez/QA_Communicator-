import { AuthProvider } from '../context/AuthContext';
// You can import global styles here if you had any, e.g., import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;