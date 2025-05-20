import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function DashboardPage() {
  // Use the combined user object or specific ones as needed
  const { authUser, firestoreUser, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/signin');
    }
  }, [authUser, loading, router]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (!authUser) {
    // This state might be brief if redirection is happening
    return <p>Redirecting to sign in...</p>;
  }

  // If authUser exists but firestoreUser is still loading or not found (edge case)
  if (!firestoreUser) {
    // This could happen if Firestore data is still fetching or if there was an error
    // Or if the user was created in Auth but not (yet) in Firestore.
    // The AuthContext's onSnapshot should eventually populate it.
    // For now, we can show a generic loading or a message.
    // If firestoreUser is critical for dashboard, show loading or error.
    // If the AuthContext sets firestoreUser to null on error/not found, handle that here.
    console.log("Dashboard: authUser present, but firestoreUser is not (yet). This might be a transient state or an issue.");
    return <p>Verifying your details...</p>; // Or a more specific message
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
    // For approved users (processor, QA, supervisor, admin)
    dashboardContent = (
      <div>
        <h2>Dashboard</h2>
        <p>Welcome, {firestoreUser.firstName || authUser.email} ({firestoreUser.role})!</p>
        <p>This is your main dashboard. More features coming soon based on your role.</p>
        {/* Add role-specific components or data here later */}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {dashboardContent}
      <button
        onClick={async () => {
          await logout();
          // router.push('/signin'); // onAuthStateChanged in AuthContext will handle redirect via useEffect in pages
        }}
        style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default DashboardPage;