import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function DashboardPage() {
  const { authUser, firestoreUser, loading: authContextLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect runs after _app.jsx has determined that authContextLoading is false.
    if (!authContextLoading) {
      if (!authUser) {
        router.push('/signin');
      } else if (authUser && !firestoreUser) {
        // This means authUser exists, but firestoreUser data is not available after loading.
        // This could be due to Firestore doc not found or an error during fetch.
        // AuthContext sets firestoreUser to null in such cases.
        console.warn("Dashboard: Firestore user details not found for authenticated user.");
        // You might want to keep them on a page that explains this, or a limited dashboard.
        // For now, keeping existing behavior, but a dedicated "profile error" page might be better.
      }
    }
  }, [authUser, firestoreUser, authContextLoading, router]);

  // If authContextLoading is true, _app.jsx shows "Loading application..."
  // So, we don't need a primary loading check here for authContextLoading.

  if (!authUser) {
    // This state should be brief as the useEffect above will redirect.
    return <p>Redirecting to sign in...</p>;
  }

  // Handle cases where firestoreUser might be null after loading (e.g., document not found)
  if (!firestoreUser) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Welcome, {authUser.email}!</h2>
        <p>We encountered an issue loading your complete user profile (e.g., role). </p>
        <p>This might be due to an incomplete registration or a temporary system error.</p>
        <p>You may have limited access. Please contact support if this persists.</p>
        <button
          onClick={logout}
          style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Display content based on role
  let dashboardContent;
  if (firestoreUser.role === 'pending_approval') {
    dashboardContent = (
      <div>
        <h2>Welcome, {firestoreUser.firstName || authUser.email}!</h2>
        <p style={{ fontWeight: 'bold', color: 'orange' }}>
          Hang tight until we approve you :)
        </p>
        <p>Your account is currently awaiting approval from an administrator. You have limited access until then.</p>
      </div>
    );
  } else {
    dashboardContent = (
      <div>
        <h2>Dashboard</h2>
        <p>Welcome, {firestoreUser.firstName || authUser.email} ({firestoreUser.role})!</p>
        <p>This is your main dashboard. More features coming soon based on your role.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {dashboardContent}
      <button
        onClick={logout}
        style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default DashboardPage;