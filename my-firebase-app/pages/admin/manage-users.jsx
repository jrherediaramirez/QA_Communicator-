// pages/admin/manage-users.jsx
import { useAuth } from '../../context/AuthContext'; // Adjust path
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase'; // Adjust path
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

export default function ManageUsersPage() {
  const { firestoreUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!firestoreUser || firestoreUser.role !== 'admin')) {
      router.push('/dashboard'); // Redirect non-admins
    } else if (!authLoading && firestoreUser && firestoreUser.role === 'admin') {
      // Fetch users for admin
      const fetchUsers = async () => {
        setPageLoading(true);
        try {
          const q = query(collection(db, "users"), where("role", "==", "pending_approval")); // Example: fetch pending users
          // Or fetch all users: const q = collection(db, "users");
          const querySnapshot = await getDocs(q);
          const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
        setPageLoading(false);
      };
      fetchUsers();
    }
  }, [firestoreUser, authLoading, router]);

  const handleRoleChange = async (userId, newRole) => {
    if (!newRole) {
      alert("Please select a role.");
      return;
    }
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { role: newRole });
      // Update local state to reflect change
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`User ${userId} role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    }
  };

  if (authLoading || pageLoading) return <p>Loading...</p>;
  if (!firestoreUser || firestoreUser.role !== 'admin') return <p>Access Denied. Redirecting...</p>;

  return (
    <div>
      <h2>Manage User Roles</h2>
      {/* Basic table or list of users */}
      {users.map(user => (
        <div key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p>Email: {user.email}</p>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Current Role: {user.role}</p>
          <select onChange={(e) => user.selectedRole = e.target.value} defaultValue={user.role}>
            <option value="pending_approval">Pending Approval</option>
            <option value="processor">Processor</option>
            <option value="QA">QA</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => handleRoleChange(user.id, user.selectedRole || user.role)}>Update Role</button>
        </div>
      ))}
    </div>
  );
}