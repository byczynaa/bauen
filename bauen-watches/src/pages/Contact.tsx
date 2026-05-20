import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", order: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, connect to backend/email service
  };

  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-16">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-serif font-light mb-2 tracking-tight">Contact Bauen</h1>
          <p className="text-lg text-textSubtle mb-2">Questions about your order, shipping, or frames? We’re here to help.</p>
        </div>

        {/* Contact Information */}
        <div className="bg-surface rounded-lg shadow-sm p-8 flex flex-col gap-4 text-center border border-border">
          <div className="text-lg text-textMain font-serif">bauenlloret@gmail.com</div>
          <div className="text-textSubtle">Orange County, California, USA</div>
          <div className="text-textSubtle text-sm">Typically within 24–48 business hours</div>
        </div>

        {/* Contact Form */}
        <form
          className="bg-white rounded-lg shadow-sm p-8 flex flex-col gap-6 border border-border"
          style={{ background: "rgba(255,255,255,0.95)" }}
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-serif mb-2 text-textMain">Send a Message</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-border rounded px-4 py-3 bg-surface text-textMain focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-border rounded px-4 py-3 bg-surface text-textMain focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              name="order"
              placeholder="Order Number (optional)"
              value={form.order}
              onChange={handleChange}
              className="border border-border rounded px-4 py-3 bg-surface text-textMain focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="border border-border rounded px-4 py-3 bg-surface text-textMain focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-base font-serif px-8 py-3 rounded uppercase tracking-widest hover:bg-textMain hover:text-accent transition disabled:opacity-60"
            disabled={submitted}
          >
            {submitted ? "Message Sent" : "Send Message"}
          </button>
          {submitted && (
            <div className="text-green-600 text-center mt-2">Thank you for contacting Bauen. We will respond soon.</div>
          )}
        </form>
      </div>
    </section>
  );
}
