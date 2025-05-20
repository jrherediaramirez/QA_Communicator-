import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SearchBatchesPage() {
  const { authUser, firestoreUser, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // Mock data for the example
  const mockBatches = [
    { id: 'B001', description: 'First test batch', date: '2025-05-15', status: 'Processing' },
    { id: 'B002', description: 'Second test batch', date: '2025-05-16', status: 'Completed' },
    { id: 'B003', description: 'Third test batch', date: '2025-05-17', status: 'Pending' }
  ];

  const filteredBatches = searchTerm
    ? mockBatches.filter(batch => 
        batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockBatches;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search Batches</h1>
      <p>Search for batch information in the system.</p>
      
      {/* Search form */}
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by Batch ID or Description" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '70%', padding: '8px', marginRight: '10px' }} 
        />
        <button 
          type="button"
          style={{ 
            backgroundColor: '#153450', 
            color: 'white', 
            padding: '8px 15px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}
        >
          Search
        </button>
      </div>
      
      {/* Results table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Batch ID</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBatches.map(batch => (
            <tr key={batch.id}>
              <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{batch.id}</td>
              <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{batch.description}</td>
              <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{batch.date}</td>
              <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{batch.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}