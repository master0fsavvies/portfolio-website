import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    emailjs.send(
      'service_8f2wphg',
      'template_3dportfolio',
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
        'gntzB17czFIwdq2cO'
      )
      .then(() => {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });

        // Reset status after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', {
    status: error?.status,
    text: error?.text,
    error,
  });

        // Reset error state after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      });
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen/50 px-4 py-20  flex items-center justify-center z-10"
    >
      <div className="relative z-0 w-full max-w-md rounded-2xl p-8 text-white shadow-lg border border-white/30 bg-white/2 backdrop-blur-xs">
        <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-xs pointer-events-none -z-10" />
        <h2 className="text-2xl font-bold mb-6 text-center">Contact</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none resize-none"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`py-3 px-5 rounded-lg font-semibold transition ${
              status === 'sent'
                ? 'bg-green-600'
                : status === 'error'
                ? 'bg-red-600'
                : 'bg-violet-300 hover:bg-violet-500'
            }`}
          >
            {status === 'sending'
              ? 'Sending...'
              : status === 'sent'
              ? 'Sent!'
              : status === 'error'
              ? 'Error – Try Again'
              : 'Send Message'}
          </button>
        </form>

        {/* Non-blocking status message */}
        {status === 'sent' && (
          <p className="mt-4 text-green-400 text-sm text-center">Your message has been sent!</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
};

export default Contact;