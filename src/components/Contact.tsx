'use client';

import Script from 'next/script';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageSquare, MapPin } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        action: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!showForm || !turnstileSiteKey || !turnstileReady || !turnstileContainerRef.current || !window.turnstile) return;

    const widgetId = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      action: 'contact',
      callback: setTurnstileToken,
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
    });
    turnstileWidgetIdRef.current = widgetId;

    return () => {
      window.turnstile?.remove(widgetId);
      turnstileWidgetIdRef.current = null;
    };
  }, [showForm, turnstileReady, turnstileSiteKey]);

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (turnstileWidgetIdRef.current) window.turnstile?.reset(turnstileWidgetIdRef.current);
  };

  const closeForm = () => {
    setShowForm(false);
    setStatus('idle');
    setError('');
    resetTurnstile();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setError('');

    if (!turnstileToken) {
      setStatus('error');
      setError('Please complete the security check.');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, turnstileToken }),
      });
      const data = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok || !data.ok) throw new Error(data.error || 'Message delivery failed.');

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTurnstileToken('');
    } catch (submitError) {
      setStatus('error');
      setError(submitError instanceof Error ? submitError.message : 'Message delivery failed.');
    } finally {
      resetTurnstile();
    }
  };

  return (
    <div className="relative w-full py-2">
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onReady={() => setTurnstileReady(true)}
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="group relative overflow-hidden rounded-md border border-[var(--foreground)] p-3 transition-all duration-300">
          <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[#FF9933] via-white to-[#138808] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
          <p className="flex items-center text-[var(--primary)] font-bold mb-1 text-sm">
            <MapPin size={14} className="min-w-[14px] mr-1" />
            <span>LOCATION.TXT</span>
          </p>
          <p className="text-xl">India</p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowForm(true);
            }
          }}
          className="group relative overflow-hidden cursor-pointer rounded-md border border-[var(--foreground)] hover:border-[var(--primary)] p-3 transition-all duration-300 hover:border-[var(--foreground)]"
          onClick={() => setShowForm(true)}
        >
          <p className="flex items-center text-[var(--primary)] font-bold mb-1 text-sm">
            <MessageSquare size={14} className="min-w-[14px] mr-1" />
            <span>MESSAGE.EXE</span>
          </p>
          <p className="text-xl">Say &quot;Hello&quot; !</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onMouseDown={closeForm}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            className="absolute top-1/2 left-1/2 z-50 h-auto w-[500px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 bg-[var(--background)] p-4 text-[var(--foreground)] shadow-lg pixelated"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="contact-form-title" className="text-lg font-bold">CONTACT_FORM.EXE</h2>
              <button type="button" onClick={closeForm} aria-label="Close contact form" className="flex h-10 w-10 items-center justify-center text-[30px] font-bold text-red-500 transition-all hover:text-red-400">×</button>
            </div>

            {!turnstileSiteKey ? (
              <p className="text-sm text-red-500">The contact form is not configured yet. Please use email, phone, or LinkedIn.</p>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input value={name} onChange={(event) => setName(event.target.value)} type="text" name="name" autoComplete="name" minLength={2} maxLength={80} required placeholder="Name" className="rounded border border-[var(--foreground)] bg-[var(--background)] p-2 text-[var(--foreground)]" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" name="email" autoComplete="email" required placeholder="Email" className="rounded border border-[var(--foreground)] bg-[var(--background)] p-2 text-[var(--foreground)]" />
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} name="message" rows={4} minLength={10} maxLength={4000} required placeholder="Your message..." className="resize-none rounded border border-[var(--foreground)] bg-[var(--background)] p-2 text-[var(--foreground)]" />
                <div ref={turnstileContainerRef} />
                {status === 'success' && <p className="text-sm text-green-600" role="status">Message sent. I&apos;ll get back to you soon.</p>}
                {status === 'error' && <p className="text-sm text-red-500" role="alert">{error}</p>}
                <button type="submit" disabled={status === 'sending' || !turnstileToken} className="rounded-lg border-b-4 border-[#6d4a32] bg-[var(--foreground)] px-4 py-2 font-bold text-[var(--background)] transition-all hover:border-b-2 hover:translate-y-0.5 active:border-b-0 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60">
                  {status === 'sending' ? 'SENDING...' : 'SEND'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
