import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | China AI Travel Helper',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#484848] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#767676] mb-8">Last updated: January 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">1. Information We Collect</h2>
          <p className="text-[#767676] mb-3">We collect the following information when you use China AI Travel Helper:</p>
          <ul className="list-disc list-inside text-[#767676] space-y-2">
            <li><strong>Account data:</strong> Email address and name when you register</li>
            <li><strong>Chat messages:</strong> Your travel questions and AI responses, stored to provide conversation history</li>
            <li><strong>Usage data:</strong> Pages visited, features used, and session duration for service improvement</li>
            <li><strong>Device data:</strong> Browser type, operating system, and IP address for security and analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside text-[#767676] space-y-2">
            <li>Provide and improve the AI travel assistant service</li>
            <li>Maintain your conversation history and saved itineraries</li>
            <li>Send service-related notifications (with your consent)</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">3. Data Storage</h2>
          <p className="text-[#767676] mb-3">
            Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit.
            Servers are located in the United States. We retain your data for as long as your account is active,
            or up to 2 years after your last login.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">4. Data Sharing</h2>
          <p className="text-[#767676] mb-3">We do not sell your personal data. We share data only with:</p>
          <ul className="list-disc list-inside text-[#767676] space-y-2">
            <li><strong>AI providers</strong> (MiniMax, Qwen): Your chat messages are sent to generate responses</li>
            <li><strong>Analytics services</strong> (Sentry): Anonymized error and performance data</li>
            <li><strong>Legal authorities</strong>: When required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">5. Your Rights (GDPR)</h2>
          <p className="text-[#767676] mb-3">If you are in the EU/EEA, you have the right to:</p>
          <ul className="list-disc list-inside text-[#767676] space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Erasure:</strong> Delete your account and associated data</li>
            <li><strong>Portability:</strong> Export your data in JSON format (available in Profile settings)</li>
            <li><strong>Objection:</strong> Opt out of non-essential data processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">6. Cookies</h2>
          <p className="text-[#767676]">
            We use essential cookies for authentication (NextAuth session) and local storage for user preferences.
            No third-party advertising cookies are used.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">7. Contact</h2>
          <p className="text-[#767676]">
            For privacy requests or questions, contact us at:{' '}
            <a href="mailto:privacy@chinaaihelper.com" className="text-[#ff5a5f] hover:underline">
              privacy@chinaaihelper.com
            </a>
          </p>
        </section>

        <div className="pt-6 border-t border-gray-100 flex gap-4 text-sm text-[#767676]">
          <Link href="/terms" className="hover:text-[#ff5a5f]">Terms of Service</Link>
          <Link href="/" className="hover:text-[#ff5a5f]">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
