# **App Name**: EduChain

## Core Features:

- Role-Based Access Control (RBAC): Secure access with Admin, Principal, Student, and Employer roles, each with distinct dashboards and permissions, enforced using JWT authentication.
- Certificate Issuance: Principals can issue certificates that include a unique ID, student details, timestamp, and a blockchain hash, ensuring each certificate's uniqueness and integrity.
- Certificate Verification: Employers can verify certificates using the certificate ID or QR code, comparing the stored hash with a recalculated hash to confirm authenticity, reporting 'Valid', 'Tampered', or 'Not Found'.
- Blockchain Hashing: Each certificate's data hash is stored on a simulated blockchain or Ethereum testnet, providing an immutable record of the certificate's authenticity over time.
- AI-Powered Career Guidance: AI tool integrated into the Student Dashboard suggests relevant job openings or learning paths based on the student's certificate, enhancing their career prospects.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and authority.
- Background color: Light gray (#F5F5F5), providing a neutral and clean backdrop.
- Accent color: Soft green (#8BC34A) for CTAs, conveying growth and success.
- Body font: 'PT Sans', a humanist sans-serif font known for its modern look and warmth.
- Headline font: 'Space Grotesk', a proportional sans-serif giving a contemporary, almost technical look.
- Note: currently only Google Fonts are supported.
- Use modern, flat icons to represent different aspects of education, security, and roles within the platform.
- A clean, modular layout with clear sections for each role's dashboard, ensuring ease of navigation and accessibility.
- Subtle transitions and loading animations to enhance user experience without being distracting.