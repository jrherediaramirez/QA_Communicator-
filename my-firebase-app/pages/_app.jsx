// my-firebase-app/pages/_app.jsx
import { AuthProvider, useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
// import '../styles/globals.css'; // Ensure your global styles (if any, not Tailwind) are imported

// Global loading component (can be styled further)
function GlobalLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading application...</p>
    </div>
  );
}

function AppContent({ Component, pageProps }) {
  const { authUser, firestoreUser, loading } = useAuth();

  // If initial auth check is loading, show a global loader for the whole page.
  if (loading) {
    return <GlobalLoader />;
  }

  // Determine if the TopBar should be shown *after* loading is complete.
  const showTopBar = authUser && firestoreUser && firestoreUser.role !== 'pending_approval';

  return (
    <>
      {showTopBar && <TopBar />}
      <Component {...pageProps} />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;