// my-firebase-app/pages/_app.jsx
import { AuthProvider, useAuth } from '../context/AuthContext'; // Import useAuth
import TopBar from '../components/TopBar';
// import '../styles/globals.css'; // Ensure your global styles (if any, not Tailwind) are imported

// Inner component to access auth context for TopBar visibility
function AppContent({ Component, pageProps }) {
  const { authUser, firestoreUser, loading } = useAuth();

  // Determine if the TopBar should be shown
  // Show if:
  // 1. Not loading authentication state
  // 2. User is authenticated (authUser exists)
  // 3. Firestore user data is loaded (firestoreUser exists)
  // 4. User role is not 'pending_approval'
  const showTopBar = !loading && authUser && firestoreUser && firestoreUser.role !== 'pending_approval';

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