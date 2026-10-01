import React, { useState } from 'react';
import { LegalSection } from '../data/legalData';

interface LegalDocumentMeta {
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastReviewed: string;
  documentVersion: string;
  developer: string;
  contactEmail: string;
}

interface LegalDocumentViewProps {
  meta: LegalDocumentMeta;
  sections: LegalSection[];
  docType: 'privacy' | 'terms';
  onNavigate: (page: 'landing' | 'privacy' | 'terms', hash?: string) => void;
}

export const LegalDocumentView: React.FC<LegalDocumentViewProps> = ({
  meta,
  sections,
  docType,
  onNavigate,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (sec) =>
          sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.paragraphs.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (sec.bullets && sec.bullets.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : sections;

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCitation = () => {
    const text = `${meta.title} — AORS (Automated OTP Relay System)\nDeveloper: ${meta.developer}\nEffective Date: ${meta.effectiveDate}\nContact: ${meta.contactEmail}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Document Header Banner */}
        <div className="frosted-glass p-6 sm:p-10 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="text-xs font-mono-tabular text-slate-400">
              <span>AORS Official Legal Document</span>
              <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
              <span>Version {meta.documentVersion}</span>
              <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
              <span className="text-[#00FFFF]">Effective {meta.effectiveDate}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyCitation}
                className="btn-cyber-indigo text-xs py-2 px-3.5"
              >
                <span>{copiedSummary ? 'Copied Document Metadata' : 'Copy Citation'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-cyber-indigo text-xs py-2 px-3.5"
              >
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          <div className="mt-6 max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 text-balance">
              {meta.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-2 leading-relaxed">
              {meta.subtitle}
            </p>
            <div className="mt-4 text-xs text-slate-400 flex flex-wrap items-center gap-y-1">
              <span>Developer: <strong className="text-slate-200">{meta.developer}</strong></span>
              <span className="mx-2.5 text-slate-600" aria-hidden="true">·</span>
              <span>Application: <strong className="text-slate-200">AORS (Automated OTP Relay System)</strong></span>
              <span className="mx-2.5 text-slate-600" aria-hidden="true">·</span>
              <span>
                Support &amp; Deletion:{' '}
                <a
                  href={`mailto:${meta.contactEmail}`}
                  className="text-[#00FFFF] font-mono-tabular hover:underline"
                >
                  {meta.contactEmail}
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Sticky 2-Column Legal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="frosted-glass p-5">
              <div className="mb-4">
                <label htmlFor="legal-filter-input" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Filter Clauses &amp; Keywords
                </label>
                <input
                  id="legal-filter-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search e.g. RECEIVE_SMS, TTL, deletion..."
                  className="aors-input text-xs py-2 px-3"
                />
              </div>

              <div className="text-xs font-mono-tabular text-slate-400 mb-2.5">
                Document Sections ({filteredSections.length}/{sections.length})
              </div>

              <nav aria-label="Document Table of Contents" className="space-y-1">
                {sections.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#4F46E5]/25 text-[#00FFFF] border border-[#00FFFF]/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="font-mono-tabular text-[11px] opacity-80 shrink-0">
                        {sec.number}.
                      </span>
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Cross-link between Privacy, Terms, and Account Deletion */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                <div className="text-xs text-slate-400">Related Compliance Pages</div>
                <div className="flex flex-col gap-2">
                  {docType === 'privacy' ? (
                    <a
                      href="terms.html"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('terms');
                      }}
                      className="text-xs text-[#00FFFF] hover:underline flex items-center justify-between"
                    >
                      <span>Read Terms &amp; Conditions</span>
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  ) : (
                    <a
                      href="privacy.html"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('privacy');
                      }}
                      className="text-xs text-[#00FFFF] hover:underline flex items-center justify-between"
                    >
                      <span>Read Privacy Policy</span>
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                  <a
                    href="index.html#deletion"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('landing', 'deletion');
                    }}
                    className="text-xs text-slate-300 hover:text-[#00FFFF] transition-colors flex items-center justify-between"
                  >
                    <span>Interactive Account Deletion Tool</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Legal Document Reader (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {filteredSections.length === 0 ? (
              <div className="frosted-glass p-8 text-center">
                <p className="text-slate-300 text-sm mb-3">
                  No sections matched &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-cyber-indigo text-xs py-2 px-4"
                >
                  Reset Search Filter
                </button>
              </div>
            ) : (
              filteredSections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  onMouseEnter={() => setActiveSectionId(section.id)}
                  className="frosted-glass p-6 sm:p-8 scroll-mt-24 legal-prose"
                >
                  <div className="text-xs font-mono-tabular text-[#00FFFF] mb-1">
                    Section {section.number} · {section.summary}
                  </div>
                  <h2 className="mt-1!">{section.number}. {section.title}</h2>

                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2 mt-4">
                      {section.bullets.map((bullet, bIdx) => {
                        const colonIndex = bullet.indexOf(':');
                        if (colonIndex > 0 && colonIndex < 55) {
                          const lead = bullet.slice(0, colonIndex);
                          const rest = bullet.slice(colonIndex + 1);
                          return (
                            <li key={bIdx}>
                              <strong>{lead}:</strong>
                              {rest}
                            </li>
                          );
                        }
                        return <li key={bIdx}>{bullet}</li>;
                      })}
                    </ul>
                  )}
                </article>
              ))
            )}

            {/* Bottom Legal Attestation & Direct Support Card */}
            <div className="frosted-glass p-6 sm:p-8 border-[#4F46E5]/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-100">
                    Need Account Erasure or Legal Clarification?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Contact Developer <strong className="text-slate-200">Himaaghna Medhi</strong> directly or use the
                    automated deletion request utility.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href="mailto:support@aors-relay.net?subject=AORS%20Legal%20or%20Deletion%20Inquiry"
                    className="btn-electric-cyan text-xs py-2.5 px-4"
                  >
                    <span>Email support@aors-relay.net</span>
                  </a>
                  <a
                    href="index.html#deletion"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('landing', 'deletion');
                    }}
                    className="btn-cyber-indigo text-xs py-2.5 px-4"
                  >
                    <span>Open Deletion Form</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
