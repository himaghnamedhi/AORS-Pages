export interface LegalSection {
  id: string;
  number: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets?: string[];
}

export const PRIVACY_POLICY_META = {
  title: 'Privacy Policy',
  subtitle: 'Zero-Knowledge Ephemeral Architecture & Android Permission Disclosure',
  effectiveDate: 'September 30, 2026',
  lastReviewed: 'September 30, 2026',
  documentVersion: '2.4.0',
  developer: 'Himaaghna Medhi',
  contactEmail: 'support@aors-relay.net',
};

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'privacy-overview',
    number: '01',
    title: 'Scope & Privacy-First Architecture',
    summary: 'AORS is engineered so that plaintext SMS contents and one-time passcodes are never readable by the relay infrastructure.',
    paragraphs: [
      'AORS (Automated OTP Relay System), developed and maintained by Himaaghna Medhi ("Developer", "we", "us", or "our"), provides an encrypted, ephemeral bridge for forwarding one-time authentication codes from an authorized Android device to your paired secondary devices or workstations.',
      'This Privacy Policy details exactly what data is processed on your Android device, how encrypted payloads traverse our ephemeral relay memory, why specific Android OS permissions are required, and how you can exercise complete control over your account and cryptographic identity—including immediate account deletion.',
    ],
    bullets: [
      'Zero Plaintext Visibility: All OTP payloads are encrypted on-device using AES-256-GCM prior to network transmission.',
      'No Persistent Message Database: Relay nodes hold encrypted ciphertext strictly in volatile system memory (RAM) until delivered or expired.',
      'Strict Local Filtering: Non-OTP personal messages are discarded locally on your Android handset and never transmitted over the network.',
    ],
  },
  {
    id: 'android-permissions',
    number: '02',
    title: 'Android OS Permissions & Local Processing',
    summary: 'Explicit justification for sensitive Android runtime permissions required for automated SMS OTP interception.',
    paragraphs: [
      'To automate OTP extraction without manual copy-pasting, the AORS Android client requests a minimal set of runtime permissions. Every permission serves a strictly bounded technical function:',
    ],
    bullets: [
      'android.permission.RECEIVE_SMS: Required solely to listen for incoming SMS broadcast intents in real time. Incoming messages are evaluated in-memory against local regular expression (RegEx) patterns and sender allowlists.',
      'android.permission.FOREGROUND_SERVICE & FOREGROUND_SERVICE_DATA_SYNC: Ensures the Android operating system does not terminate the local cryptographic listener while you are awaiting a time-sensitive authentication code.',
      'android.permission.POST_NOTIFICATIONS: Displays a transparent, persistent foreground status indicator showing when the AORS relay tunnel is active, paused, or transmitting an encrypted token.',
      'android.permission.INTERNET & ACCESS_NETWORK_STATE: Used exclusively to establish a pinned TLS 1.3 connection between your handset and the AORS ephemeral relay endpoint.',
    ],
  },
  {
    id: 'information-collected',
    number: '03',
    title: 'Information We Collect & Store',
    summary: 'Minimal account routing identifiers required to pair your devices without collecting personal message histories.',
    paragraphs: [
      'AORS separates ephemeral relay traffic from minimal account routing metadata. We only collect the technical records necessary to authenticate your paired devices and route encrypted packets to the right destination:',
    ],
    bullets: [
      'Account Identifier: Your registered email address or anonymous relay account handle used to authenticate your primary Android device and manage paired target clients.',
      'Public Cryptographic Keys: Your X25519 public key and Ed25519 verification signature generated inside the Android Hardware Keystore. Private keys never leave your physical hardware.',
      'Device Routing Metadata: Randomly generated Device Relay UUID, Firebase Cloud Messaging (FCM) or WebSocket wake token, and client platform type (e.g., Android 14, Linux Workstation).',
      'What We Never Collect: We never collect your phone number, contact list, call logs, location coordinates, full SMS inbox history, or decrypted OTP codes.',
    ],
  },
  {
    id: 'ephemeral-retention',
    number: '04',
    title: 'Ephemeral Data Retention & Automatic TTL Purge',
    summary: 'In-flight encrypted OTP packets self-destruct immediately upon read confirmation or after 60 seconds.',
    paragraphs: [
      'Unlike cloud SMS synchronization platforms that archive your messages in persistent SQL or NoSQL tables, AORS operates as a stateless, ephemeral packet switch:',
      'When your Android device detects a matching OTP SMS, it encrypts the extracted token with your target workstation’s public key and dispatches the ciphertext to the AORS edge relay. The relay stores this packet in an isolated volatile memory buffer with a hard Time-To-Live (TTL) ceiling of 60 seconds.',
    ],
    bullets: [
      'Burn-on-Read Erasure: The millisecond your receiving client acknowledges receipt of the ciphertext packet, the memory slot on the relay node is zeroed out and deallocated.',
      'Unacknowledged Expiry: If your workstation is offline, any undelivered ciphertext packet is permanently purged after 60 seconds.',
      'Zero Disk Swap: AORS relay processes run with memory locking enabled (mlock) so encrypted buffers are never written to disk swap partitions.',
    ],
  },
  {
    id: 'encryption-security',
    number: '05',
    title: 'End-to-End Encryption & Security Controls',
    summary: 'Authenticated encryption with associated data (AEAD) and forward-secret key exchange.',
    paragraphs: [
      'Every OTP relay event is protected by two independent cryptographic layers: transport-level TLS 1.3 encryption and payload-level End-to-End Encryption (E2EE).',
      'During initial device pairing (via local QR code verification), your Android handset and receiving client perform an X25519 Elliptic Curve Diffie-Hellman key exchange. Each individual OTP relay packet uses a fresh 96-bit cryptographic nonce and AES-256-GCM authenticated encryption, preventing replay attacks or tampering in transit.',
    ],
  },
  {
    id: 'account-deletion',
    number: '06',
    title: 'Account Deletion & Data Erasure Rights',
    summary: 'Clear, frictionless procedure to permanently delete your AORS account, paired device keys, and routing records.',
    paragraphs: [
      'You retain absolute ownership and control over your AORS registration. You may initiate complete account deletion and cryptographic key revocation at any time either directly within the AORS Android app ("Settings -> Security & Identity -> Delete Account & Purge Keys") or via our web deletion channel.',
      'To request account deletion outside the mobile application, send an email to support@aors-relay.net with the subject line "AORS Account Deletion Request" and include the email address or Device Relay UUID associated with your account, or use the interactive Account Deletion Request utility on our main page.',
    ],
    bullets: [
      'Immediate Key Revocation: Active WebSocket tunnels and device public keys are invalidated immediately upon verification of your request.',
      'Complete Registry Erasure: Your account email, Device Relay UUIDs, and public key records are permanently purged from our primary registry within 24 hours (and from encrypted disaster-recovery snapshots within 7 days).',
      'Written Confirmation: Once erasure is complete, a final cryptographic deletion receipt is sent to your requesting email address, after which the email address itself is purged.',
    ],
  },
  {
    id: 'third-party-sharing',
    number: '07',
    title: 'Third-Party Infrastructure & No-Sale Guarantee',
    summary: 'Zero advertising SDKs, zero behavioral analytics trackers, and zero monetization of user data.',
    paragraphs: [
      'AORS does not sell, rent, trade, or monetize user information or telemetry under any circumstances. The Android application contains zero third-party advertising networks, zero cross-app tracking identifiers, and zero behavioral profiling scripts.',
      'Infrastructure sub-processors are strictly limited to hardened cloud compute providers hosting our stateless RAM relay nodes and push notification transport channels required to wake sleeping client connections.',
    ],
  },
  {
    id: 'developer-contact',
    number: '08',
    title: 'Policy Updates & Developer Contact',
    summary: 'Direct communication channel with the developer for privacy inquiries and security audits.',
    paragraphs: [
      'If we make material updates to this Privacy Policy, we will increment the document version number, update the Effective Date at the top of this page, and notify active users via an in-app notice prior to the change taking effect.',
      'For privacy questions, Google Play Data Safety inquiries, security disclosures, or account deletion assistance, please contact the developer directly:',
    ],
    bullets: [
      'Developer: Himaaghna Medhi',
      'Application: AORS — Automated OTP Relay System',
      'Dedicated Support & Deletion Email: support@aors-relay.net',
    ],
  },
];

export const TERMS_META = {
  title: 'Terms & Conditions',
  subtitle: 'End-User License Agreement (EULA) & Ephemeral Relay Service Terms',
  effectiveDate: 'September 30, 2026',
  lastReviewed: 'September 30, 2026',
  documentVersion: '2.4.0',
  developer: 'Himaaghna Medhi',
  contactEmail: 'support@aors-relay.net',
};

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'terms-acceptance',
    number: '01',
    title: 'Acceptance of Terms & Agreement Binding',
    summary: 'Conditions governing your installation and use of the AORS Android client and relay endpoints.',
    paragraphs: [
      'These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User" or "you") and Himaaghna Medhi ("Developer", "we", or "us") governing your download, installation, configuration, and use of the AORS (Automated OTP Relay System) Android application, desktop companion utilities, and associated ephemeral relay services (collectively, the "Service").',
      'By installing the AORS application, generating a device keypair, or transmitting encrypted payloads through AORS relay endpoints, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy.',
    ],
  },
  {
    id: 'service-description',
    number: '02',
    title: 'Description of Ephemeral Relay Service',
    summary: 'How AORS operates as an encrypted, user-controlled bridge for personal authentication codes.',
    paragraphs: [
      'AORS provides a personal cryptographic automation tool designed to detect incoming SMS one-time passcodes (OTPs) on an Android handset that you own or lawfully control, encrypt the extracted passcode locally on the handset, and forward the ciphertext over an ephemeral transport channel to your authorized secondary devices.',
      'Because AORS operates on a zero-knowledge, zero-persistence model, the Service does not store message histories, cannot recover lost passcodes once their 60-second Time-To-Live (TTL) expires, and cannot decrypt payloads on behalf of any user.',
    ],
  },
  {
    id: 'permitted-use',
    number: '03',
    title: 'License Grant & Acceptable Use Restrictions',
    summary: 'Personal, non-transferable license and strict prohibition against unauthorized interception or bulk commercial relay.',
    paragraphs: [
      'Subject to your continuous compliance with these Terms, the Developer grants you a personal, revocable, non-exclusive, non-transferable license to install and use the AORS software on devices that you personally own or are explicitly authorized by your organization to administer.',
      'You agree not to misuse the Service or engage in any prohibited conduct, including:',
    ],
    bullets: [
      'Unauthorized Device Deployment: Installing AORS on any mobile handset without the explicit knowledge and lawful consent of the device owner and primary SIM subscriber.',
      'SIM Farm or Bulk Commercial Resale: Using AORS to operate automated SIM banks, bulk account creation farms, or unauthorized third-party verification marketplaces.',
      'Protocol Abuse & Denial of Service: Flooding AORS ephemeral relay nodes with synthetic traffic, malformed cryptographic frames, or automated vulnerability scans without prior written authorization.',
      'Circumvention of Financial Controls: Using the Service to bypass multi-factor authentication controls in violation of applicable banking, telecommunications, or cybersecurity laws.',
    ],
  },
  {
    id: 'key-custody',
    number: '04',
    title: 'User Responsibilities & Cryptographic Key Custody',
    summary: 'You are solely responsible for securing paired workstations and verifying QR key fingerprints.',
    paragraphs: [
      'Security in an end-to-end encrypted system depends on endpoint integrity. You are solely responsible for verifying the X25519 safety fingerprint when pairing a new workstation or browser receiver with your Android handset.',
      'If a paired laptop, desktop, or secondary device is lost, stolen, or compromised, you must immediately revoke its public key via the AORS Android application ("Paired Devices -> Revoke Access") or submit an emergency revocation request to support@aors-relay.net.',
    ],
  },
  {
    id: 'carrier-os',
    number: '05',
    title: 'Mobile Carrier Rates & Android OS Compatibility',
    summary: 'Standard carrier SMS/data terms apply; background execution depends on OEM battery optimization settings.',
    paragraphs: [
      'AORS processes standard SMS messages delivered to your device by your mobile network operator. We are not a telecommunications carrier and cannot guarantee the timeliness or delivery of upstream carrier SMS messages. Standard data rates from your mobile carrier or Wi-Fi provider may apply when AORS transmits encrypted relay packets.',
      'Furthermore, certain Android Original Equipment Manufacturers (OEMs) implement aggressive background task killers. To ensure uninterrupted automated OTP relay, you are responsible for configuring AORS as an exempted foreground service in your handset’s battery management settings.',
    ],
  },
  {
    id: 'account-termination',
    number: '06',
    title: 'Account Termination & Deletion Procedures',
    summary: 'Right to terminate service at any time and permanent erasure of account routing records.',
    paragraphs: [
      'You may terminate your agreement with AORS and discontinue use of the Service at any time by uninstalling the Android application and requesting account deletion.',
      'As detailed in our Privacy Policy, you can trigger full account and public key registry deletion either from within the Android application or by emailing support@aors-relay.net. The Developer reserves the right to suspend or revoke relay routing identifiers that exhibit automated abuse patterns or violate Section 03 of these Terms.',
    ],
  },
  {
    id: 'warranty-disclaimer',
    number: '07',
    title: 'Disclaimer of Warranties & Limitation of Liability',
    summary: 'Service is provided "AS IS" without warranty of uninterrupted carrier delivery or third-party service compatibility.',
    paragraphs: [
      'THE AORS SOFTWARE AND EPHEMERAL RELAY INFRASTRUCTURE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.',
      'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HIMAAGHNA MEDHI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF ACCESS, LOCKED ACCOUNTS, OR DELAYED AUTHENTICATION CODES RESULTING FROM UPSTREAM CARRIER DELAYS, ANDROID OS BACKGROUND RESTRICTIONS, OR NETWORK OUTAGES.',
    ],
  },
  {
    id: 'governing-law',
    number: '08',
    title: 'Governing Law & Developer Attribution',
    summary: 'Official contact and attribution details for AORS.',
    paragraphs: [
      'These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.',
      'All official inquiries regarding licensing, compliance, or these Terms should be directed to:',
    ],
    bullets: [
      'Developer: Himaaghna Medhi',
      'System Name: AORS (Automated OTP Relay System)',
      'Official Support & Legal Contact: support@aors-relay.net',
    ],
  },
];
