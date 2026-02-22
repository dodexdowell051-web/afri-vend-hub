import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageWrapper from "@/components/layout/PageWrapper";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <PageWrapper>
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 22, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p>Afrivend ("we", "our", or "us") operates an online fashion marketplace based in Owerri, Imo State, Nigeria. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at afrivend.com and related services.</p>
              <p>By accessing or using Afrivend, you agree to this Privacy Policy. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <h3 className="text-lg font-medium text-foreground mt-4">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Delivery address</li>
                <li>Payment information (bank details for sellers)</li>
              </ul>
              <h3 className="text-lg font-medium text-foreground mt-4">Transaction Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Purchase history and order details</li>
                <li>Escrow and payout records</li>
                <li>Commission and fee records</li>
              </ul>
              <h3 className="text-lg font-medium text-foreground mt-4">Device & Usage Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address and browser type</li>
                <li>Device identifiers</li>
                <li>Pages visited and interaction patterns</li>
                <li>Referral sources</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To create and manage your account</li>
                <li>To process transactions and hold payments in escrow</li>
                <li>To facilitate communication between buyers and sellers</li>
                <li>To prevent fraud and ensure platform security</li>
                <li>To send order updates, receipts, and notifications</li>
                <li>To improve our platform and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Payment Processing & Escrow</h2>
              <p>Afrivend uses a secure escrow system. When a buyer makes a payment, funds are held by the platform and only released to the seller after the buyer confirms delivery. Payment processing is handled through trusted third-party payment gateways (such as Paystack). We do not store your full card details on our servers.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Data Protection</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Role-based access controls for internal systems</li>
                <li>Regular security audits and monitoring</li>
              </ul>
              <p className="mt-2">While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Cookies</h2>
              <p>We use cookies and similar technologies to maintain your session, remember preferences, and analyse platform usage. You can control cookie settings through your browser, but disabling cookies may affect platform functionality.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Third-Party Services</h2>
              <p>We may share limited data with trusted third parties including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Payment gateways</strong> (e.g., Paystack) for processing transactions</li>
                <li><strong>Logistics partners</strong> for delivery coordination</li>
                <li><strong>Analytics providers</strong> to improve our services</li>
              </ul>
              <p className="mt-2">These parties are bound by their own privacy policies and are only given access to information necessary to perform their services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access</strong> the personal data we hold about you</li>
                <li><strong>Correct</strong> inaccurate or incomplete information</li>
                <li><strong>Delete</strong> your account and associated data (subject to legal retention requirements)</li>
                <li><strong>Withdraw consent</strong> for optional data processing</li>
                <li><strong>Request data portability</strong> of your information</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:privacy@afrivend.com" className="text-primary hover:underline">privacy@afrivend.com</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Data Retention</h2>
              <p>We retain your personal data for as long as your account is active or as needed to provide our services. Transaction records are retained for a minimum of 6 years for legal and regulatory compliance. You may request deletion of your account at any time, after which we will remove your data within 30 days, except where retention is required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Security Measures</h2>
              <p>We employ administrative, technical, and physical safeguards to protect your information, including firewalls, data encryption, access controls, and secure hosting infrastructure. Our team undergoes regular security training.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Children's Privacy</h2>
              <p>Afrivend is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a minor, we will delete it promptly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">12. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of Afrivend after changes constitutes acceptance of the revised policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">13. Contact Us</h2>
              <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:privacy@afrivend.com" className="text-primary hover:underline">privacy@afrivend.com</a><br />
                <strong>Address:</strong> Afrivend, Owerri, Imo State, Nigeria
              </p>
            </section>
          </div>
        </main>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
