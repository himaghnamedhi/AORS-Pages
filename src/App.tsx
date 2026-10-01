import React, { useState } from 'react';

type PageView = 'landing' | 'privacy' | 'terms';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('landing');

  const renderContent = () => {
    switch (activePage) {
      case 'terms':
        return (
          <>
            <h1>Terms of Service</h1>
            <p className="text-secondary">Effective Date: October 1, 2026</p>
            <p>By using AORS, you agree to these terms. AORS is provided "as is".</p>
          </>
        );
      default:
        return (
          <>
            <h1>AORS</h1>
            <p className="text-secondary">Automated OTP Relay System. Secure, encrypted, ephemeral OTP relay.</p>
            <button className="btn-primary">Download for Android</button>
            <h2>Support</h2>
            <p>For account deletion or support: <a href="mailto:medhihimaghna1@gmail.com">medhihimaghna1@gmail.com</a></p>
          </>
        );
    }
  };

  return (
    <div className="container">
      <nav>
        <a href="#" onClick={() => setActivePage('landing')}>Overview</a>
        <a href="/privacy.html">Privacy</a>
        <a href="#" onClick={() => setActivePage('terms')}>Terms</a>
        <a href="/delete-account.html">Delete Account</a>
      </nav>
      <main>{renderContent()}</main>
    </div>
  );
}
