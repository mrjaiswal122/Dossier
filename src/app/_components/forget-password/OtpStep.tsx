"use client";
import React, { useState, useRef, useEffect } from 'react';
import { KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

interface OtpStepProps {
  email: string;
  onSubmit: (otp: string) => void;
  onBack: () => void;
}

export default function OtpStep({ email, onSubmit, onBack }: OtpStepProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all digits');
      return;
    }

    onSubmit(otpString);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-grays text-sm">
          {'We\'ve sent a verification code to'}
        </p>
        <p className="text-whites font-medium mt-1">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-grays mb-3">
            Enter Verification Code
          </label>
          <div className="flex gap-2 justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center bg-black-bg2 text-whites rounded-lg
                  border border-black-icon focus:border-theme focus:ring-1 
                  focus:ring-theme outline-none text-xl font-semibold"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-reds">{error}</p>}
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
            Verify
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}