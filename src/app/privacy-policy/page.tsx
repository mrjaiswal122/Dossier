import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-8 pb-8 pt-24 ">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Introduction</h2>
          <p className="text-gray-600">
            This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Data We Collect</h2>
          <ul className="list-inside list-disc text-gray-600">
            <li>Your name and email address</li>
            <li>Profile information from Google Authentication</li>
            <li>Any other information you voluntarily provide us</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">How We Use Your Data</h2>
          <p className="text-gray-600">
            We use your data to personalize your experience, provide customer support, and improve our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Data Security</h2>
          <p className="text-gray-600">
            We use industry-standard security measures to protect your personal data. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Your Rights</h2>
          <p className="text-gray-600">
            You have the right to access, correct, or delete your personal data at any time by contacting us.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
