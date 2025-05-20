import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function BatchEntryPage() {
  const { authUser, firestoreUser, loading: authContextLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authContextLoading) {
      if (!authUser) {
        router.push('/signin');
      } else if (firestoreUser && firestoreUser.role === 'pending_approval') {
        router.push('/dashboard'); // Redirect pending users
      } else if (authUser && !firestoreUser) {
        // Handle case where authUser exists but firestoreUser is null after loading
        console.warn("BatchEntryPage: Firestore user details not found. Redirecting to dashboard.");
        router.push('/dashboard');
      }
    }
  }, [authUser, firestoreUser, authContextLoading, router]);

  // If authContextLoading is true, _app.jsx shows GlobalLoader.
  // If redirecting, the component might unmount or show a brief message.
  if (authContextLoading) {
    return null; // Or a minimal page-specific loader if preferred over _app.jsx's only
  }

  if (!authUser) {
    return <p>Redirecting to sign in...</p>;
  }

  if (!firestoreUser) {
    return <p>User details not found. Access to this page is restricted.</p>;
  }

  if (firestoreUser.role === 'pending_approval') {
    // This message is shown if redirection is not immediate or if user navigates here directly.
    return <p>Your account is pending approval. Access to this page is restricted.</p>;
  }

  // Page content for authorized and approved users
  return (
    <div style={{ padding: '20px' }}>
      <h1>Batch Entry</h1>
      <p>This is where users can enter new batch information.</p>
      
      <form style={{ marginTop: '20px' }}>
        {/* ... form elements ... */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="batchId" style={{ display: 'block', marginBottom: '5px' }}>
            Batch ID:
          </label>
          <input 
            type="text" 
            id="batchId" 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
            Description:
          </label>
          <textarea 
            id="description" 
            rows="4" 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>
            Date:
          </label>
          <input 
            type="date" 
            id="date" 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <button 
          type="button" 
          style={{ 
            backgroundColor: '#153450', 
            color: 'white', 
            padding: '10px 15px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}
        >
          Submit Batch
        </button>
      </form>
    </div>
  );
}