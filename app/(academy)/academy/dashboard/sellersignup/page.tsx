"use client"

import { useState } from 'react';

export default function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/stripe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

    if (response.ok) {
      setMessage('Stripe Express account created successfully.');
    } else {
      setMessage('Failed to create Stripe Express account.');
    }
  };

  return (
    <div>
      <h1>Create Stripe Express Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}