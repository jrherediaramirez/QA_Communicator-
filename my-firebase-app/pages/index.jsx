// my-firebase-app/pages/index.jsx
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { authUser, firestoreUser, loading, logout } = useAuth();

  // `loading` here is from AuthContext. If true, _app.jsx's GlobalLoader is shown.
  // So, when this component's content renders, `loading` should be false.
  // The check `if (loading && !authUser)` is likely redundant.

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