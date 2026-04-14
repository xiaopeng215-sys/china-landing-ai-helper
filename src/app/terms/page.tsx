import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | China AI Travel Helper',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#484848] mb-2">Terms of Service</h1>
        <p className="text-sm text-[#767676] mb-8">Last updated: January 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">1. Service Description</h2>
          <p className="text-[#767676]">
            China AI Travel Helper is an AI-powered travel assistant that provides travel information,
            itinerary suggestions, and practical tips for visiting China. The service is provided "as is"
            for informational purposes only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">2. Acceptance of Terms</h2>
          <p className="text-[#767676]">
            By using this service, you agree to these terms. If you do not agree, please do not use the service.
            We may update these terms at any time; continued use constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">3. Disclaimer of Liability</h2>
          <p className="text-[#767676] mb-3">
            AI-generated travel information may be inaccurate, outdated, or incomplete. We strongly recommend:
          </p>
          <ul className="list-disc list-inside text-[#767676] space-y-2">
            <li>Verifying all information (opening hours, prices, visa requirements) from official sources before travel</li>
            <li>Not relying solely on AI recommendations for safety-critical decisions</li>
            <li>Checking current travel advisories from your government</li>
          </ul>
          <p className="text-[#767676] mt-3">
            We are not liable for any loss, damage, or inconvenience arising from reliance on information
            provided by this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">4. User Conduct</h2>
          <p className="text-[#767676] mb-3">You agree not to:</p>
          <ul className="list-disc list-inside text-[#767676] space-y-2">
            <li>Use the service for any illegal purpose</li>
            <li>Attempt to reverse-engineer, scrape, or abuse the API</li>
            <li>Submit harmful, offensive, or misleading content</li>
            <li>Share your account credentials with others</li>
            <li>Use automated tools to generate excessive requests</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">5. Account Termination</h2>
          <p className="text-[#767676]">
            We reserve the right to suspend or terminate accounts that violate these terms, abuse the service,
            or engage in fraudulent activity. You may delete your account at any time from the Profile settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">6. Intellectual Property</h2>
          <p className="text-[#767676]">
            The service, including its design, code, and content, is owned by China AI Travel Helper.
            AI-generated responses are provided for your personal use only and may not be republished
            commercially without permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">7. Governing Law</h2>
          <p className="text-[#767676]">
            These terms are governed by applicable law. Disputes shall be resolved through good-faith
            negotiation before any legal proceedings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#484848] mb-3">8. Contact</h2>
          <p className="text-[#767676]">
            Questions about these terms:{' '}
            <a href="mailto:legal@chinaaihelper.com" className="text-[#ff5a5f] hover:underline">
              legal@chinaaihelper.com
            </a>
          </p>
        </section>

        <div className="pt-6 border-t border-gray-100 flex gap-4 text-sm text-[#767676]">
          <Link href="/privacy" className="hover:text-[#ff5a5f]">Privacy Policy</Link>
          <Link href="/" className="hover:text-[#ff5a5f]">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
