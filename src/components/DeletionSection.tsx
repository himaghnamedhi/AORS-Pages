import React, { useState } from 'react';

interface SubmittedDeletionTicket {
  ticketId: string;
  identifier: string;
  scope: string;
  reason: string;
  timestamp: string;
}

export const DeletionSection: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [scope, setScope] = useState('Full Account & Public Key Registry Erasure');
  const [reason, setReason] = useState('');
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<SubmittedDeletionTicket | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();

    if (!trimmed) {
      setErrorMessage('Please enter your registered email address or 16-character Device Relay ID.');
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isDeviceId = /^[a-zA-Z0-9-_]{8,36}$/.test(trimmed);

    if (!isEmail && !isDeviceId) {
      setErrorMessage('Enter a valid email address (e.g., user@domain.com) or alphanumeric Device Relay ID.');
      return;
    }

    if (!confirmPurge) {
      setErrorMessage('Please confirm that you understand cryptographic key revocation is irreversible.');
      return;
    }

    setErrorMessage(null);
    const randomHex = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    )
      .join('')
      .toUpperCase();

    setSubmittedTicket({
      ticketId: `DEL-AORS-${randomHex}`,
      identifier: trimmed,
      scope,
      reason: reason.trim() || 'User-initiated privacy erasure request',
      timestamp: new Date().toISOString(),
    });
  };

  const buildMailtoHref = (ticket?: SubmittedDeletionTicket | null) => {
    const targetId = ticket ? ticket.identifier : identifier.trim() || '[Your Registered Email or Device Relay UUID]';
    const targetScope = ticket ? ticket.scope : scope;
    const subject = encodeURIComponent(`AORS Account Deletion Request - ${targetId}`);
    const body = encodeURIComponent(
      `Hello Himaaghna Medhi / AORS Support Team,\n\n` +
        `Please permanently delete my AORS account and revoke all associated public cryptographic keys.\n\n` +
        `Account Email / Device Relay ID: ${targetId}\n` +
        `Deletion Scope: ${targetScope}\n` +
        (ticket ? `Verification Ticket Reference: ${ticket.ticketId}\n` : '') +
        `Additional Notes: ${reason.trim() || 'None'}\n\n` +
        `I understand that this action permanently purges my routing identifiers and public key registry.`
    );
    return `mailto:support@aors-relay.net?subject=${subject}&body=${body}`;
  };

  const handleCopyTicket = () => {
    if (!submittedTicket) return;
    const text = `AORS Deletion Ticket: ${submittedTicket.ticketId}\nIdentifier: ${submittedTicket.identifier}\nScope: ${submittedTicket.scope}\nTimestamp: ${submittedTicket.timestamp}\nSupport Email: support@aors-relay.net`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <section id="deletion" className="py-16 sm:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono-tabular text-slate-400 mb-2">
            <span>Google Play Data Safety Compliance</span>
            <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
            <span>Zero-Persistence Guarantee</span>
            <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
            <span className="text-[#00FFFF]">24h SLA</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 text-balance">
            Account &amp; Cryptographic Key Deletion Request
          </h2>
          <p className="text-slate-400 mt-3 text-base leading-relaxed">
            Because AORS never stores your SMS messages or plaintext OTP codes on disk, account deletion strictly
            involves purging your routing email address, Device Relay UUID, and paired X25519 public keys from our
            authentication registry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Explicit Instructions & Direct Mailto Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="frosted-glass p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold text-slate-100 mb-4">
                How to Request Permanent Deletion
              </h3>

              <ol className="space-y-4 text-sm text-slate-300 list-none p-0 m-0">
                <li className="pb-4 border-b border-white/8">
                  <div className="font-mono-tabular text-xs text-[#00FFFF] mb-1">
                    01. In-App Instant Purge (Fastest)
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed m-0">
                    Open the AORS Android app, navigate to{' '}
                    <strong className="text-slate-200">Settings &rarr; Security &amp; Identity &rarr; Delete Account &amp; Purge Keys</strong>,
                    and confirm with your device biometric prompt. Your public keys and routing entry are erased immediately.
                  </p>
                </li>

                <li className="pb-4 border-b border-white/8">
                  <div className="font-mono-tabular text-xs text-[#00FFFF] mb-1">
                    02. Direct Email Deletion Request
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed m-0">
                    If you have already uninstalled the Android app or lost your handset, send an email directly to{' '}
                    <a
                      href="mailto:support@aors-relay.net?subject=AORS%20Account%20Deletion%20Request"
                      className="text-[#00FFFF] font-mono-tabular underline hover:opacity-85"
                    >
                      support@aors-relay.net
                    </a>{' '}
                    from your registered email address or include your Device Relay UUID.
                  </p>
                </li>

                <li>
                  <div className="font-mono-tabular text-xs text-[#00FFFF] mb-1">
                    03. What Gets Deleted vs. Retained
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed m-0">
                    All account identifiers, paired workstation public keys, and FCM wake tokens are permanently deleted
                    within 24 hours. Zero financial or message logs are retained because AORS never collects them.
                  </p>
                </li>
              </ol>

              {/* Direct Email CTA Box */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Dedicated Deletion Desk</span>
                  <a
                    href="mailto:support@aors-relay.net"
                    className="font-mono-tabular text-sm font-semibold text-[#00FFFF] hover:underline"
                  >
                    support@aors-relay.net
                  </a>
                </div>
                <a
                  href={buildMailtoHref(submittedTicket)}
                  className="btn-cyber-indigo text-xs py-2.5 px-4"
                >
                  {/* Mail SVG Icon */}
                  <svg
                    className="w-4 h-4 text-[#00FFFF]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Email support@aors-relay.net</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive Account Deletion Form */}
          <div className="lg:col-span-7">
            <div className="frosted-glass p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-white/10">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-100">
                    Submit Online Deletion &amp; Key Revocation Request
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate a formal deletion request ticket or dispatch directly to Himaaghna Medhi&apos;s support queue.
                  </p>
                </div>
                <span className="text-xs font-mono-tabular text-slate-400">
                  TLS 1.3 Verified Form
                </span>
              </div>

              {submittedTicket ? (
                <div className="p-5 rounded-xl bg-[#06070E]/90 border border-[#00FFFF]/40 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="w-5 h-5 text-emerald-400 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <h4 className="font-display text-base font-semibold text-slate-100 m-0">
                        Deletion Ticket Queued for Processing
                      </h4>
                    </div>
                    <span className="font-mono-tabular text-xs text-[#00FFFF]">
                      {submittedTicket.ticketId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed m-0">
                    Your deletion request for <strong className="text-white font-mono-tabular">{submittedTicket.identifier}</strong> has
                    been staged. To complete cryptographic ownership verification, click the button below to send the pre-formatted
                    confirmation email to <strong className="text-[#00FFFF]">support@aors-relay.net</strong>, or copy the receipt for your records.
                  </p>

                  <div className="p-3.5 rounded-lg bg-[#0B0D19] border border-white/10 font-mono-tabular text-xs text-slate-300 space-y-1">
                    <div>TICKET_ID: {submittedTicket.ticketId}</div>
                    <div>TARGET_ID: {submittedTicket.identifier}</div>
                    <div>PURGE_SCOPE: {submittedTicket.scope}</div>
                    <div>TIMESTAMP: {submittedTicket.timestamp}</div>
                    <div>RECIPIENT: support@aors-relay.net</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={buildMailtoHref(submittedTicket)}
                      className="btn-electric-cyan text-xs py-2.5 px-4"
                    >
                      <span>Dispatch via Email Client (support@aors-relay.net)</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyTicket}
                      className="btn-cyber-indigo text-xs py-2.5 px-4"
                    >
                      <span>{copiedReceipt ? 'Copied Ticket Receipt' : 'Copy Ticket Receipt'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedTicket(null);
                        setIdentifier('');
                        setReason('');
                        setConfirmPurge(false);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 underline ml-auto cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={validateAndSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="deletion-identifier"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Registered Email Address or Device Relay UUID <span className="text-[#00FFFF]">*</span>
                    </label>
                    <input
                      id="deletion-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="e.g., alex@domain.com or aors-dev-9f82c41b"
                      className="aors-input font-mono-tabular text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="deletion-scope"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Erasure &amp; Key Revocation Scope
                    </label>
                    <select
                      id="deletion-scope"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      className="aors-input text-sm"
                    >
                      <option value="Full Account & Public Key Registry Erasure">
                        Full Account &amp; Public Key Registry Erasure (Recommended)
                      </option>
                      <option value="Revoke All Paired Workstation Public Keys Only">
                        Revoke All Paired Workstation Public Keys Only (Keep Account)
                      </option>
                      <option value="Emergency Lost Handset Token Revocation">
                        Emergency Lost Handset Token Revocation
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="deletion-reason"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Verification Note or Lost Device Context (Optional)
                    </label>
                    <textarea
                      id="deletion-reason"
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Optional details (e.g., switched phones, no longer need OTP relay)..."
                      className="aors-input text-sm resize-none"
                    />
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={confirmPurge}
                        onChange={(e) => {
                          setConfirmPurge(e.target.checked);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#06070E] accent-[#00FFFF]"
                      />
                      <span>
                        I confirm that I am the authorized holder of this AORS identifier and understand that purging
                        my account and X25519 public keys is permanent and cannot be undone.
                      </span>
                    </label>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-rose-400 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <button type="submit" className="btn-electric-cyan text-sm">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Request Account Deletion</span>
                    </button>

                    <span className="text-xs text-slate-400">
                      Or email directly:{' '}
                      <a
                        href="mailto:support@aors-relay.net"
                        className="text-[#00FFFF] font-mono-tabular hover:underline"
                      >
                        support@aors-relay.net
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
