export default function Privacy() {
  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-serif">Privacy Policy</h1>
        <p className="text-textSubtle leading-relaxed">
          Bauen processes only the data needed to complete orders, prevent fraud, and provide customer support.
          Payment card details are processed by Stripe and are never stored directly on this website.
        </p>
        <p className="text-textSubtle leading-relaxed">
          Session cookies are used for secure admin authentication and cart continuity. Analytics or marketing cookies
          should only be enabled with explicit consent in jurisdictions that require it.
        </p>
        <p className="text-textSubtle leading-relaxed">
          Customers may request access, correction, or deletion of personal information by contacting
          support@bauen-eyewear.com.
        </p>
      </div>
    </section>
  )
}
