import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageWrapper from "@/components/layout/PageWrapper";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <PageWrapper>
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 22, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p>Welcome to Afrivend. These Terms of Service ("Terms") govern your use of the Afrivend marketplace platform operated from Owerri, Imo State, Nigeria. By creating an account or using our services, you agree to be bound by these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. User Eligibility</h2>
              <p>You must be at least 18 years of age to use Afrivend. By registering, you represent that you are of legal age and have the capacity to enter into a binding agreement. We reserve the right to verify your identity and refuse service at our discretion.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Account Registration</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>You must provide accurate and complete information during registration.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>One person may not operate multiple accounts without prior approval.</li>
                <li>You must notify us immediately of any unauthorised access to your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Seller Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>List only genuine, accurately described products with truthful images.</li>
                <li>Ship orders within the agreed timeframe after payment confirmation.</li>
                <li>Respond to buyer enquiries and disputes in a timely manner.</li>
                <li>Comply with all applicable Nigerian laws regarding product safety and commerce.</li>
                <li>Maintain adequate stock for listed products.</li>
                <li>Accept responsibility for product quality and accurate representation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Buyer Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate delivery information.</li>
                <li>Confirm delivery promptly upon receiving goods in satisfactory condition.</li>
                <li>Raise disputes within a reasonable timeframe if goods are defective or not as described.</li>
                <li>Do not abuse the dispute or refund system.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Escrow Payment System</h2>
              <p>Afrivend operates a secure escrow payment system to protect both buyers and sellers:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-3">
                <li><strong>Order Placed:</strong> The buyer places an order and makes payment.</li>
                <li><strong>Payment Held:</strong> Funds are securely held in escrow by Afrivend.</li>
                <li><strong>Seller Ships:</strong> The seller marks the order as shipped and dispatches the product.</li>
                <li><strong>Buyer Confirms:</strong> The buyer confirms delivery and satisfaction with the product.</li>
                <li><strong>Funds Released:</strong> Payment is released to the seller's wallet, minus the platform commission.</li>
              </ol>
              <p className="mt-3">If a buyer does not confirm delivery within the platform's auto-release window, funds may be automatically released to the seller.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Platform Commission</h2>
              <p>Afrivend charges a <strong>10% commission</strong> on every successful transaction. This commission is automatically deducted from the seller's earnings before funds are released to their wallet. The commission covers platform maintenance, escrow services, dispute resolution, and customer support.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Refunds & Dispute Resolution</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Buyers may raise a dispute if goods are not received, defective, or not as described.</li>
                <li>Both parties will be given an opportunity to provide evidence.</li>
                <li>Afrivend's dispute resolution team will review and make a final decision.</li>
                <li>Refunds, when approved, will be processed to the buyer's original payment method.</li>
                <li>Fraudulent dispute claims may result in account suspension.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Prohibited Items</h2>
              <p>The following items may not be listed or sold on Afrivend:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Counterfeit or stolen goods</li>
                <li>Illegal substances or controlled items</li>
                <li>Weapons, explosives, or hazardous materials</li>
                <li>Adult content or explicit material</li>
                <li>Items that violate intellectual property rights</li>
                <li>Any item prohibited under Nigerian law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Fraud Prevention</h2>
              <p>Afrivend actively monitors for fraudulent activity. We employ automated systems and manual reviews to detect suspicious behaviour. Users found engaging in fraud, including but not limited to fake orders, false disputes, or identity theft, will have their accounts immediately suspended and may face legal action.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Account Suspension & Termination</h2>
              <p>Afrivend reserves the right to suspend or terminate any account that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violates these Terms of Service</li>
                <li>Engages in fraudulent or illegal activity</li>
                <li>Receives repeated valid complaints from other users</li>
                <li>Provides false information during registration</li>
                <li>Abuses the platform's dispute or refund system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">12. Limitation of Liability</h2>
              <p>Afrivend acts as a marketplace facilitator and is not a party to transactions between buyers and sellers. To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>We are not liable for the quality, safety, or legality of products listed.</li>
                <li>We are not responsible for seller performance or delivery delays.</li>
                <li>Our total liability shall not exceed the fees paid to us in the preceding 12 months.</li>
                <li>We are not liable for indirect, incidental, or consequential damages.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">13. Intellectual Property</h2>
              <p>All content on the Afrivend platform, including logos, design elements, text, and software, is the property of Afrivend or its licensors and is protected by Nigerian and international intellectual property laws. Users retain ownership of content they upload but grant Afrivend a licence to display and distribute it on the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">14. Governing Law</h2>
              <p>These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Imo State, Nigeria.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">15. Changes to These Terms</h2>
              <p>We may revise these Terms at any time by posting updates on this page. Material changes will be communicated via email or platform notification. Your continued use of Afrivend after changes constitutes acceptance of the revised Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">16. Contact Us</h2>
              <p>For questions about these Terms, please contact us:</p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:legal@afrivend.com" className="text-primary hover:underline">legal@afrivend.com</a><br />
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

export default TermsOfService;
