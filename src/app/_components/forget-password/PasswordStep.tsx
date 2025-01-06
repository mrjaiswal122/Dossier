'use client';
import React, { useState } from 'react';
import { KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface PasswordStepProps {
  onSubmit: (password: string) => void;
  onBack: () => void;
}

export default function PasswordStep({ onSubmit, onBack }: PasswordStepProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-grays mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-3 bg-black-bg2 text-whites rounded-lg pl-12
                border border-black-icon focus:border-theme focus:ring-1 
                focus:ring-theme outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-black-icon w-5 h-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black-icon hover:text-whites"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-grays mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-4 py-3 bg-black-bg2 text-whites rounded-lg pl-12
                border border-black-icon focus:border-theme focus:ring-1 
                focus:ring-theme outline-none transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-black-icon w-5 h-5" />
          </div>
        </div>

        {error && <p className="text-sm text-reds">{error}</p>}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-black-bg2 hover:bg-black-bg text-whites 
            font-medium py-3 px-4 rounded-lg transition-colors duration-200 
            flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <button
          type="submit"
          className="flex-1 bg-theme hover:bg-theme-dark text-whites 
            font-medium py-3 px-4 rounded-lg transition-colors duration-200 
            flex items-center justify-center gap-2"
        >
          Reset Password
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}