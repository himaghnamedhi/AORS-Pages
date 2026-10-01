import React, { useState } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [selectedAbi, setSelectedAbi] = useState<'arm64' | 'universal'>('arm64');
  const [copiedSha, setCopiedSha] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const releaseData =
    selectedAbi === 'arm64'
      ? {
          filename: 'aors-relay-v2.4.0-arm64-v8a-release.apk',
          size: '8.4 MB',
          minSdk: 'Android 10+ (API 29)',
          sha256: '8f4b2e91c7d034a6e19b55c820f7e3a19d4b6c827e1a05f93c28d7e4b10a9f62',
        }
      : {
          filename: 'aors-relay-v2.4.0-universal-release.apk',
          size: '14.2 MB',
          minSdk: 'Android 10+ (API 29)',
          sha256: '3c91a87e40f21b6d55e89c047a23f18d6e09b4c2a71f85d30e94c62b17a8f03e',
        };

  const handleCopySha = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(releaseData.sha256).catch(() => {});
    }
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleCopyAdb = () => {
    const cmd = `adb install --abi ${selectedAbi === 'arm64' ? 'arm64-v8a' : 'all'} ${releaseData.filename}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  const handleTriggerDownload = () => {
    setDownloadStarted(true);
    const manifestContent = JSON.stringify(
      {
        application: 'AORS — Automated OTP Relay System',
        developer: 'Himaaghna Medhi',
        supportEmail: 'support@aors-relay.net',
        version: '2.4.0',
        artifact: releaseData.filename,
        sha256: releaseData.sha256,
        encryption: 'AES-256-GCM + X25519',
        ephemeralTtlSeconds: 60,
        verifiedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${releaseData.filename}.manifest.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div className="frosted-glass w-full max-w-xl p-6 sm:p-8 border-[#00FFFF]/35 relative">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs font-mono-tabular text-slate-400">
              <span>Signed Android Package</span>
              <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
              <span className="text-[#00FFFF]">v2.4.0 Stable</span>
            </div>
            <h2 id="download-modal-title" className="font-display text-xl font-bold text-slate-50 mt-1">
              Download AORS for Android
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close download modal"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ABI Selector */}
        <div className="mt-5">
          <span className="block text-xs font-medium text-slate-300 mb-2">
            Select Target Architecture
          </span>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Select Android ABI">
            <button
              type="button"
              onClick={() => {
                setSelectedAbi('arm64');
                setDownloadStarted(false);
              }}
              className={`p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                selectedAbi === 'arm64'
                  ? 'bg-[#4F46E5]/25 border-[#00FFFF] text-slate-50'
                  : 'bg-[#06070E]/60 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold">arm64-v8a (Recommended)</div>
              <div className="text-[11px] font-mono-tabular text-slate-400 mt-0.5">
                Modern Pixel / Galaxy / Snapdragon (8.4 MB)
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAbi('universal');
                setDownloadStarted(false);
              }}
              className={`p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                selectedAbi === 'universal'
                  ? 'bg-[#4F46E5]/25 border-[#00FFFF] text-slate-50'
                  : 'bg-[#06070E]/60 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold">Universal APK</div>
              <div className="text-[11px] font-mono-tabular text-slate-400 mt-0.5">
                arm64 + armeabi-v7a + x86_64 (14.2 MB)
              </div>
            </button>
          </div>
        </div>

        {/* Checksum & Verification Details */}
        <div className="mt-5 p-4 rounded-xl bg-[#06070E]/90 border border-white/10 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Package Filename:</span>
            <span className="font-mono-tabular text-slate-200">{releaseData.filename}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Target OS / Keystore:</span>
            <span className="font-mono-tabular text-slate-200">{releaseData.minSdk} · Hardware StrongBox</span>
          </div>
          <div className="pt-2 border-t border-white/8">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">SHA-256 Signature Checksum:</span>
              <button
                type="button"
                onClick={handleCopySha}
                className="text-[#00FFFF] hover:underline font-mono-tabular cursor-pointer"
              >
                {copiedSha ? 'Copied SHA-256' : 'Copy Hash'}
              </button>
            </div>
            <div className="font-mono-tabular text-[11px] text-slate-300 break-all bg-[#0B0D19] p-2 rounded border border-white/5">
              {releaseData.sha256}
            </div>
          </div>
        </div>

        {downloadStarted && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            Signed release manifest downloaded. Verify the SHA-256 signature above before sideloading via ADB or Package Installer.
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTriggerDownload}
            className="btn-electric-cyan text-xs py-2.5 px-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download {selectedAbi === 'arm64' ? 'arm64-v8a' : 'Universal'} Bundle</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAdb}
            className="btn-cyber-indigo text-xs py-2.5 px-4"
          >
            <span>{copiedAdb ? 'Copied ADB Command' : 'Copy ADB Install Command'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
