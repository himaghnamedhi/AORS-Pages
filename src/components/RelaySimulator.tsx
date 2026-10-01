import React, { useState, useEffect } from 'react';

interface RelayPreset {
  id: string;
  label: string;
  sender: string;
  otpCode: string;
  rawSms: string;
  cipherPreview: string;
  nonce: string;
}

const PRESETS: RelayPreset[] = [
  {
    id: 'github',
    label: 'GitHub 2FA',
    sender: 'GH-AUTH',
    otpCode: '849204',
    rawSms: '[GitHub] Your authentication code is 849204. Valid for 5 minutes.',
    cipherPreview: '0x9F4A...E82C11B04D7F',
    nonce: 'b7e29a04c118f3d2',
  },
  {
    id: 'aws',
    label: 'AWS Console',
    sender: 'AWS-IAM',
    otpCode: '391057',
    rawSms: 'AWS Verification: 391057 is your root console verification code.',
    cipherPreview: '0x4C18...73AF9012B6E4',
    nonce: 'f03c81d49a227e19',
  },
  {
    id: 'bank',
    label: 'Treasury Auth',
    sender: 'FED-WIRE',
    otpCode: '620419',
    rawSms: 'Security code 620419 for outbound transfer authorization. Do not share.',
    cipherPreview: '0xD27B...09C4A638E115',
    nonce: 'a9145e78c03b2210',
  },
];

type RelayStage = 'idle' | 'encrypting' | 'buffered' | 'delivered' | 'purged';

export const RelaySimulator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<RelayPreset>(PRESETS[0]);
  const [stage, setStage] = useState<RelayStage>('buffered');
  const [ttlRemaining, setTtlRemaining] = useState<number>(54.2);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(38);

  // Live countdown when stage is 'buffered'
  useEffect(() => {
    if (stage !== 'buffered') return;
    const interval = setInterval(() => {
      setTtlRemaining((prev) => {
        if (prev <= 0.2) {
          setStage('purged');
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [stage]);

  const triggerRelaySimulation = (preset: RelayPreset = selectedPreset) => {
    setSelectedPreset(preset);
    setCopiedCode(false);
    setStage('encrypting');
    setLatencyMs(Math.floor(31 + Math.random() * 14));
    setTimeout(() => {
      setTtlRemaining(60.0);
      setStage('buffered');
    }, 420);
  };

  const handleConsumeAndBurn = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(selectedPreset.otpCode).catch(() => {});
    }
    setCopiedCode(true);
    setStage('delivered');
    setTimeout(() => {
      setTtlRemaining(0);
      setStage('purged');
    }, 900);
  };

  return (
    <div className="frosted-glass p-6 sm:p-7 relative overflow-hidden">
      {/* Top Bar: Unboxed technical metadata + interactive scenario selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div>
          <div className="text-xs font-mono-tabular text-slate-400">
            <span>AES-256-GCM</span>
            <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
            <span>X25519 ECDH</span>
            <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
            <span className="text-[#00FFFF]">{latencyMs}ms Edge Hop</span>
          </div>
          <h2 className="text-base font-semibold text-slate-100 mt-1">
            Interactive Ephemeral Relay Schematic
          </h2>
        </div>

        {/* Interactive Filter Controls for Test Payload */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg bg-[#06070E]/90 border border-white/10"
          role="group"
          aria-label="Select OTP simulation scenario"
        >
          {PRESETS.map((preset) => {
            const active = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => triggerRelaySimulation(preset)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#4F46E5] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom SVG 3-Node Security & Connectivity Topology */}
      <div className="my-6 bg-[#06070E]/80 border border-white/8 rounded-xl p-4">
        <svg
          viewBox="0 0 540 136"
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="AORS 3-node encrypted OTP relay diagram from Android handset through ephemeral RAM relay to workstation"
        >
          <defs>
            <linearGradient id="aorsCyanIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connection Track 1: Android -> Ephemeral Relay */}
          <line
            x1="118"
            y1="58"
            x2="222"
            y2="58"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="2"
          />
          {(stage === 'encrypting' || stage === 'buffered') && (
            <line
              x1="118"
              y1="58"
              x2="222"
              y2="58"
              stroke="#00FFFF"
              strokeWidth="2.5"
              className="animate-packet-line"
            />
          )}

          {/* Connection Track 2: Ephemeral Relay -> Workstation */}
          <line
            x1="318"
            y1="58"
            x2="422"
            y2="58"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="2"
          />
          {(stage === 'buffered' || stage === 'delivered') && (
            <line
              x1="318"
              y1="58"
              x2="422"
              y2="58"
              stroke="url(#aorsCyanIndigo)"
              strokeWidth="2.5"
              className="animate-packet-line"
            />
          )}

          {/* Node 1: Android Source Device */}
          <g transform="translate(26, 16)">
            <rect
              x="0"
              y="0"
              width="90"
              height="84"
              rx="12"
              fill="#0B0D19"
              stroke={stage === 'encrypting' ? '#00FFFF' : '#4F46E5'}
              strokeWidth="1.5"
            />
            {/* Smartphone SVG Icon */}
            <rect
              x="33"
              y="14"
              width="24"
              height="38"
              rx="4"
              fill="none"
              stroke="#00FFFF"
              strokeWidth="1.75"
            />
            <line x1="41" y1="47" x2="49" y2="47" stroke="#00FFFF" strokeWidth="1.75" strokeLinecap="round" />
            <text x="45" y="68" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="600">
              Android Host
            </text>
            <text x="45" y="79" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              SMS_RECEIVER
            </text>
          </g>

          {/* Lock / Cipher Badge on Wire 1 */}
          <g transform="translate(156, 44)">
            <rect x="0" y="0" width="28" height="28" rx="6" fill="#0B0D19" stroke="rgba(0,255,255,0.4)" strokeWidth="1" />
            <path
              d="M9 13V10a5 5 0 0 1 10 0v3M8 13h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"
              fill="none"
              stroke="#00FFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Node 2: Ephemeral RAM Relay Edge */}
          <g transform="translate(225, 12)">
            <rect
              x="0"
              y="0"
              width="90"
              height="92"
              rx="12"
              fill="#0B0D19"
              stroke={
                stage === 'purged'
                  ? 'rgba(148,163,184,0.35)'
                  : stage === 'buffered'
                  ? '#00FFFF'
                  : '#10B981'
              }
              strokeWidth="1.75"
              filter={stage === 'buffered' ? 'url(#cyanGlow)' : undefined}
            />
            {/* Shield / Ephemeral Memory SVG Icon */}
            <path
              d="M45 15L31 21v10c0 9.5 6 18.2 14 21 8-2.8 14-11.5 14-21V21L45 15z"
              fill="rgba(79, 70, 229, 0.2)"
              stroke={stage === 'purged' ? '#64748B' : '#00FFFF'}
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <text x="45" y="68" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="600">
              AORS RAM Node
            </text>
            <text
              x="45"
              y="81"
              textAnchor="middle"
              fill={stage === 'purged' ? '#F43F5E' : '#00FFFF'}
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {stage === 'purged' ? 'TTL: PURGED' : `TTL: ${ttlRemaining.toFixed(1)}s`}
            </text>
          </g>

          {/* Connectivity Pulse Icon on Wire 2 */}
          <g transform="translate(356, 44)">
            <rect x="0" y="0" width="28" height="28" rx="6" fill="#0B0D19" stroke="rgba(79,70,229,0.5)" strokeWidth="1" />
            <path
              d="M6 14h4l2.5-6 3 12 2.5-6H22"
              fill="none"
              stroke="#00FFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Node 3: Paired Workstation Receiver */}
          <g transform="translate(424, 16)">
            <rect
              x="0"
              y="0"
              width="90"
              height="84"
              rx="12"
              fill="#0B0D19"
              stroke={stage === 'delivered' ? '#10B981' : '#4F46E5'}
              strokeWidth="1.5"
            />
            {/* Workstation / Terminal SVG Icon */}
            <rect
              x="27"
              y="16"
              width="36"
              height="25"
              rx="3"
              fill="none"
              stroke={stage === 'delivered' ? '#10B981' : '#F8FAFC'}
              strokeWidth="1.75"
            />
            <line x1="21" y1="46" x2="69" y2="46" stroke="#94A3B8" strokeWidth="1.75" strokeLinecap="round" />
            <text x="45" y="68" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="600">
              Workstation
            </text>
            <text x="45" y="79" textAnchor="middle" fill="#94A3B8" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              AEAD_DECRYPT
            </text>
          </g>

          {/* Bottom Caption Line */}
          <text x="270" y="125" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
            {stage === 'purged'
              ? 'ZERO-PERSISTENCE VERIFIED · RAM BUFFER ZEROED (0 BYTES RETAINED)'
              : `NONCE: ${selectedPreset.nonce} · CIPHER: ${selectedPreset.cipherPreview}`}
          </text>
        </svg>
      </div>

      {/* Live Telemetry Details & Action Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#06070E]/75 border border-white/8">
            <div className="text-slate-400 mb-1 flex items-center justify-between">
              <span>Intercepted SMS ({selectedPreset.sender})</span>
              <span className="font-mono-tabular text-slate-500">On-Device Only</span>
            </div>
            <p className="text-slate-200 font-mono-tabular text-xs leading-relaxed m-0 line-clamp-2">
              {selectedPreset.rawSms}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#06070E]/75 border border-white/8 flex flex-col justify-between">
            <div className="text-slate-400 mb-1 flex items-center justify-between">
              <span>Decrypted Workstation Output</span>
              <span className="font-mono-tabular text-[#00FFFF]">
                {stage === 'purged' ? 'Burned' : `${ttlRemaining.toFixed(1)}s TTL`}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span
                className={`font-mono-tabular text-lg font-semibold tracking-wider ${
                  stage === 'purged' ? 'text-slate-600 line-through' : 'text-[#00FFFF]'
                }`}
              >
                {selectedPreset.otpCode}
              </span>
              {stage === 'purged' ? (
                <button
                  type="button"
                  onClick={() => triggerRelaySimulation(selectedPreset)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Relay New OTP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConsumeAndBurn}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00FFFF] text-[#06070E] hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  {copiedCode ? 'Copied · Purging RAM' : 'Copy & Burn OTP'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Bar Footer inside simulator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-400">
          <div>
            <span>Relay State: </span>
            <strong className="text-slate-200 font-mono-tabular">
              {stage === 'encrypting' && 'Encrypting on Android Hardware Keystore'}
              {stage === 'buffered' && 'Active in Ephemeral RAM (Awaiting Workstation Read)'}
              {stage === 'delivered' && 'Delivered to Workstation · Zeroing Memory Slot'}
              {stage === 'purged' && 'Purged from Edge Memory (Zero Bytes Retained)'}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => triggerRelaySimulation(selectedPreset)}
            className="text-[#00FFFF] hover:underline font-medium whitespace-nowrap cursor-pointer"
          >
            Re-run Packet Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
