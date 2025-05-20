import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function BatchEntryPage() {
  const { authUser, firestoreUser, loading } = useAuth();
  const router = useRouter();

  // Protect the page with authentication
  useEffect(() => {
    if (!loading && (!authUser || !firestoreUser)) {
      router.push('/signin');
    } else if (!loading && firestoreUser && firestoreUser.role === 'pending_approval') {
      router.push('/dashboard');
    }
  }, [authUser, firestoreUser, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!authUser || !firestoreUser) return <p>Please sign in to access this page</p>;
  if (firestoreUser.role === 'pending_approval') return <p>Your account is pending approval</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Batch Entry</h1>
      <p>This is where users can enter new batch information.</p>
      
      {/* Simple form placeholder */}
      <form style={{ marginTop: '20px' }}>
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