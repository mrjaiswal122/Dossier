import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-8 pb-8 pt-24 ">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms of Service</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Introduction</h2>
          <p className="text-gray-600">
            By accessing or using our service, you agree to comply with these Terms of Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">User Responsibilities</h2>
          <ul className="list-inside list-disc text-gray-600">
            <li>You must provide accurate and up-to-date information.</li>
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You must not engage in unlawful activities using our service.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Limitation of Liability</h2>
          <p className="text-gray-600">
            We are not liable for any damages arising from the use of our services, except as required by law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Termination</h2>
          <p className="text-gray-600">
            We may suspend or terminate your access to our services if you violate these Terms of Service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Changes to These Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify or update these Terms of Service at any time. Please review them regularly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
