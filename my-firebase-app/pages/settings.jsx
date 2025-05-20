import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { authUser, firestoreUser, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
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
      <h1>Settings</h1>
      <p>Manage your application preferences.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>User Profile</h2>
        <div style={{ marginBottom: '15px' }}>
          <p><strong>Name:</strong> {firestoreUser.firstName} {firestoreUser.lastName}</p>
          <p><strong>Email:</strong> {authUser.email}</p>
          <p><strong>Work ID:</strong> {firestoreUser.workId}</p>
          <p><strong>Role:</strong> {firestoreUser.role}</p>
        </div>
        
        <h2>Preferences</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)}
              style={{ marginRight: '10px' }}
            />
            Enable notifications
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)}
              style={{ marginRight: '10px' }}
            />
            Dark mode
          </label>
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
          Save Preferences
        </button>
      </div>
    </div>
  );
}