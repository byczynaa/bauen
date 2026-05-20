export default function Privacy() {
  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-5xl font-serif font-light mb-10 text-center tracking-tight">Privacy Policy</h1>
        <div className="space-y-8 text-lg leading-relaxed text-textSubtle">
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">1. Information We Collect</h2>
            <ul className="list-disc ml-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Shipping and billing address</li>
              <li>Order information</li>
              <li>Device and browser analytics</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">2. How We Use Information</h2>
            <p>
              We use your information to process orders, provide customer support, improve your website experience, and send updates or promotional communications.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">3. Payments</h2>
            <p>
              Payments are securely processed through Stripe. Bauen does not store full payment card information.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">4. Third-Party Services</h2>
            <p>
              We use trusted third-party services including Stripe, Supabase, and analytics tools to operate and improve our website.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">5. Cookies</h2>
            <p>
              Cookies and analytics technologies may be used to enhance website functionality and user experience.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">6. Data Protection</h2>
            <p>
              We use reasonable security measures to protect your information from unauthorized access or disclosure.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">7. User Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal information by contacting us at <a href="mailto:bauenlloret@gmail.com" className="text-accent underline hover:text-textMain">bauenlloret@gmail.com</a>.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">8. California Privacy Notice</h2>
            <p>
              California residents may have additional privacy rights under applicable California privacy laws.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-serif mb-2 text-textMain">9. Contact Information</h2>
            <p>
              Email: <a href="mailto:bauenlloret@gmail.com" className="text-accent underline hover:text-textMain">bauenlloret@gmail.com</a><br />
              Location: Orange County, California, USA
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
