import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function DeleteAccount() {
  const [email, setEmail] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'deletionRequests'), {
        email,
        deviceId,
        reason,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setEmail('');
      setDeviceId('');
      setReason('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'deletionRequests');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-md">
      <h1>Account Deletion Request</h1>
      <p className="text-secondary mb-4">Submit a request to permanently delete your AORS account and data.</p>
      
      {status === 'success' && (
        <div className="p-4 mb-4 text-green-500 bg-green-50 rounded">
          Request submitted successfully. Our support team will process it within 48 hours.
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded">
          An error occurred. Please try again or email support directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Account Email</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Device ID (Settings tab in AORS)</label>
          <input 
            type="text" 
            required 
            value={deviceId} 
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full p-2 border border-border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Reason for Deletion (Optional)</label>
          <textarea 
            rows={3} 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-border rounded"
          />
        </div>
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          style={{ backgroundColor: '#4f46e5' }}
          className="text-white p-2 rounded hover:opacity-90 transition"
        >
          {status === 'submitting' ? 'Submitting...' : 'Request Account Deletion'}
        </button>
      </form>
    </div>
  );
}
