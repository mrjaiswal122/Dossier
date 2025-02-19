'use client';
import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface EmailStepProps {
  onSubmit: (email: string) => void;
}

export default function EmailStep({ onSubmit }: EmailStepProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label htmlFor="email" className="block text-sm font-medium text-grays mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            className={`w-full px-4 py-3 bg-black text-whites rounded-lg pl-12 
              border ${error ? 'border-reds' : 'border-black-icon'} 
              focus:border-theme focus:ring-1 focus:ring-theme outline-none
              transition-colors`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black-icon w-5 h-5" />
        </div>
        {error && <p className="mt-2 text-sm text-reds">{error}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-theme hover:bg-theme-dark text-whites font-medium 
          py-3 px-4 rounded-lg transition-colors duration-200 flex items-center 
          justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}