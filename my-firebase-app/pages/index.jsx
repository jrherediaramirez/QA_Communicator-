import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { authUser, firestoreUser, loading, logout } = useAuth(); // Use specific user objects or combined user

  if (loading && !authUser) { // Show loading only on initial load when no authUser is present yet.
                              // If authUser is present but firestoreUser is loading, dashboard will handle specific message.
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to My Firebase App</h1>
      {authUser ? (
        <div>
          <p>
            You are signed in as {firestoreUser?.firstName || authUser.email}
            {firestoreUser?.role && ` (${firestoreUser.role})`}
          </p>
          <button onClick={logout} style={{ marginRight: '10px' }}>Sign Out</button>
          <Link href="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <Link href="/signin" style={{ marginRight: '10px' }}>
            <button>Sign In</button>
          </Link>
          <Link href="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
}