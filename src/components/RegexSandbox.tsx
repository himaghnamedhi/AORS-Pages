import React, { useState } from 'react';

interface SmsSample {
  id: string;
  title: string;
  sender: string;
  message: string;
  isOtp: boolean;
  extractedCode: string | null;
  matchedRule: string;
}

const SAMPLES: SmsSample[] = [
  {
    id: 'otp-stripe',
    title: 'Stripe 2FA SMS',
    sender: '+1 (888) 901-4492',
    message: 'Your Stripe verification code is: 739184. Never share this code with anyone.',
    isOtp: true,
    extractedCode: '739184',
    matchedRule: '(?:code|OTP|verification)[^0-9]{0,16}([0-9]{6,8})',
  },
  {
    id: 'personal-chat',
    title: 'Personal SMS (Blocked Locally)',
    sender: '+1 (415) 890-2311',
    message: 'Hey! Are we still meeting at 7:30 PM at the downtown cafe for dinner?',
    isOtp: false,
    extractedCode: null,
    matchedRule: 'NO_MATCH · Dropped by On-Device Filter',
  },
  {
    id: 'otp-cloudflare',
    title: 'Cloudflare Auth',
    sender: 'CF-SEC',
    message: 'Cloudflare security token 402918 expires in 2 minutes.',
    isOtp: true,
    extractedCode: '402918',
    matchedRule: '(?:token|passcode)[^0-9]{0,16}([0-9]{6})',
  },
];

export const RegexSandbox: React.FC = () => {
  const [activeSample, setActiveSample] = useState<SmsSample>(SAMPLES[0]);
  const [customText, setCustomText] = useState<string>(SAMPLES[0].message);

  // Evaluate regex in real time
  const otpRegex = /(?:code|otp|token|verification|passcode|pin)[^0-9]{0,20}\b([0-9]{4,8})\b/i;
  const fallbackSixDigit = /\b([0-9]{6})\b/;

  const matchPrimary = customText.match(otpRegex);
  const matchFallback =
    /(?:code|otp|token|verify|authentication|security|login)/i.test(customText) &&
    customText.match(fallbackSixDigit);

  const extractedOtp = matchPrimary
    ? matchPrimary[1]
    : matchFallback
    ? matchFallback[1]
    : null;

  const handleSelectSample = (sample: SmsSample) => {
    setActiveSample(sample);
    setCustomText(sample.message);
  };

  return (
    <div className="mt-5 pt-5 border-t border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-slate-300">
          Interactive On-Device SMS Filter Sandbox
        </span>
        <div
          className="flex items-center gap-1 p-1 rounded-lg bg-[#06070E] border border-white/10"
          role="group"
          aria-label="Test SMS messages"
        >
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSample.id === sample.id && customText === sample.message
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        <div className="lg:col-span-7">
          <label htmlFor="sms-sandbox-input" className="sr-only">
            Test Incoming SMS Body
          </label>
          <input
            id="sms-sandbox-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="aors-input font-mono-tabular text-xs"
            placeholder="Type or paste any sample SMS message to test local OTP extraction..."
          />
        </div>

        <div className="lg:col-span-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#06070E]/90 border border-white/10 text-xs">
          {extractedOtp ? (
            <>
              <div>
                <span className="text-slate-400 block">Action: Encrypt &amp; Relay</span>
                <span className="text-emerald-400 font-mono-tabular font-medium">
                  MATCHED_OTP · {extractedOtp}
                </span>
              </div>
              <span className="font-mono-tabular text-sm font-semibold text-[#00FFFF]">
                AES({extractedOtp})
              </span>
            </>
          ) : (
            <>
              <div>
                <span className="text-slate-400 block">Action: Local Discard</span>
                <span className="text-amber-400 font-mono-tabular font-medium">
                  BLOCKED_ON_DEVICE
                </span>
              </div>
              <span className="font-mono-tabular text-xs text-slate-400">
                0 Bytes Sent
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
