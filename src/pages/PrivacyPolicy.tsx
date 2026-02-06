import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={() => {}} activeTripType="tours" />
      <main className="container py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>

        <h1 className="font-display text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Touring Places South Africa ("we", "us", or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, and share your information when you use our website and services in compliance with the Protection of Personal Information Act (POPIA) of South Africa and the General Data Protection Regulation (GDPR) where applicable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">2. Information We Collect</h2>
            <h3 className="font-display text-lg font-semibold mb-2 mt-4">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground">
              <li>Full name, email address, phone number</li>
              <li>Country of residence and nationality</li>
              <li>Travel dates, preferences, and booking history</li>
              <li>Payment information (processed securely via third-party payment providers)</li>
              <li>Account credentials (encrypted and hashed)</li>
            </ul>

            <h3 className="font-display text-lg font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground">
              <li>IP address (anonymized/hashed)</li>
              <li>Browser type and version</li>
              <li>Pages visited and duration of visits</li>
              <li>Referral source and device information</li>
              <li>Session identifiers (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground">
              <li>To process and manage your bookings and transactions</li>
              <li>To send booking confirmations, receipts, and travel updates</li>
              <li>To provide customer support and respond to enquiries</li>
              <li>To improve our website, services, and user experience</li>
              <li>To send marketing communications (only with your consent)</li>
              <li>To comply with legal obligations and prevent fraud</li>
              <li>To maintain site analytics and performance monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">4. Data Sharing</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground mt-3">
              <li><strong>Service Providers:</strong> Tour operators, accommodation providers, and shuttle services to fulfil your bookings.</li>
              <li><strong>Payment Processors:</strong> Secure third-party payment gateways to process transactions.</li>
              <li><strong>Legal Authorities:</strong> When required by law, regulation, or court order.</li>
              <li><strong>Business Partners:</strong> Only with your explicit consent and for the purposes disclosed at the time.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">5. Data Security</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground mt-3">
              <li>End-to-end encryption for data in transit (TLS/SSL)</li>
              <li>Encrypted database storage with row-level security</li>
              <li>Two-factor authentication (2FA) for administrative access</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Password hashing using industry-standard algorithms</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">6. Data Retention</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Booking records are retained for a minimum of 5 years for tax and regulatory purposes. You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">7. Your Rights (POPIA & GDPR)</h2>
            <p className="font-body text-muted-foreground leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground mt-3">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
              <li><strong>Restriction:</strong> Request limitation of processing of your data.</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to processing of your data for direct marketing purposes.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time without affecting prior processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">8. Cookies</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Our website uses essential cookies to maintain session state and preferences (such as currency selection). We use anonymized analytics to improve our services. We do not use third-party tracking cookies or advertising cookies without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">9. Children's Privacy</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Our services are not directed to children under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a revised "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">11. Contact Us</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              For questions, requests, or complaints about this Privacy Policy or our data practices:
            </p>
            <div className="bg-muted p-4 rounded-xl mt-3">
              <p className="font-body text-foreground font-medium">Information Officer</p>
              <p className="font-body text-muted-foreground">Touring Places South Africa</p>
              <p className="font-body text-muted-foreground">Email: privacy@touringplaces.co.za</p>
              <p className="font-body text-muted-foreground">Phone: +27-73-237-3200</p>
              <p className="font-body text-muted-foreground">Address: 10 Elephant Lane, Century City, Cape Town, 7441</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
