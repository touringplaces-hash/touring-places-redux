import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={() => {}} activeTripType="tours" />
      <main className="container py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>

        <h1 className="font-display text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Welcome to Touring Places South Africa ("Company", "we", "us", or "our"). These Terms and Conditions govern your use of our website <strong>touringplaces.co.za</strong> and all related services, bookings, and transactions. By accessing or using our services, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground">
              <li><strong>"Services"</strong> refers to tours, shuttle transfers, accommodation bookings, and any other travel-related services offered through our platform.</li>
              <li><strong>"Booking"</strong> refers to any reservation made through our website or affiliated channels.</li>
              <li><strong>"Supplier"</strong> refers to third-party service providers including tour operators, transport companies, and accommodation providers.</li>
              <li><strong>"Customer"</strong> or <strong>"You"</strong> refers to any person or entity that accesses or uses our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">3. Bookings & Payments</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              All bookings are subject to availability and confirmation. Prices displayed are in South African Rand (ZAR) unless otherwise indicated. Currency conversions are provided for convenience only and the final charge will be in the currency agreed upon at checkout. A booking is only confirmed once full payment has been received and a confirmation email with a booking reference has been issued.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mt-3">
              We reserve the right to cancel or modify bookings in the event of pricing errors, unavailability of services, or force majeure events. In such cases, a full refund will be issued.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">4. Cancellation & Refund Policy</h2>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground">
              <li><strong>More than 14 days before travel:</strong> Full refund less a 10% administrative fee.</li>
              <li><strong>7–14 days before travel:</strong> 50% refund.</li>
              <li><strong>Less than 7 days before travel:</strong> No refund.</li>
              <li><strong>No-shows:</strong> No refund will be provided.</li>
            </ul>
            <p className="font-body text-muted-foreground leading-relaxed mt-3">
              Certain tours and services provided by third-party suppliers may have their own cancellation policies, which will be communicated at the time of booking. In the event of a conflict, the more restrictive policy shall apply.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              To the fullest extent permitted by South African law, Touring Places South Africa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground mt-3">
              <li>Any service provided by third-party suppliers, including but not limited to delays, cancellations, injury, loss, or damage to property.</li>
              <li>Any act of God, natural disaster, civil unrest, terrorism, pandemic, government action, or other force majeure event.</li>
              <li>Personal injury, illness, or death occurring during the provision of any service, unless caused by our direct and proven negligence.</li>
              <li>Loss, theft, or damage to personal belongings during tours, transfers, or accommodations.</li>
            </ul>
            <p className="font-body text-muted-foreground leading-relaxed mt-3">
              Our total liability in any matter arising out of or related to these terms is limited to the amount paid by you for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">6. Indemnity</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless Touring Places South Africa, its directors, officers, employees, agents, suppliers, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney fees) arising out of or in connection with:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-body text-muted-foreground mt-3">
              <li>Your use or misuse of our services.</li>
              <li>Your violation of these Terms and Conditions.</li>
              <li>Your violation of any applicable law, regulation, or the rights of any third party.</li>
              <li>Any content you submit, post, or transmit through our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">7. Assumption of Risk</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Travel and tourism activities inherently carry risks. By booking any tour, shuttle, or excursion through our platform, you acknowledge and voluntarily assume all risks associated with such activities, including but not limited to risks of injury, illness, property damage, and death. You confirm that you are physically fit and medically able to participate in the activities booked.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">8. Third-Party Services</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              We act as an intermediary connecting customers with third-party service providers. We are not responsible for the acts, errors, omissions, representations, warranties, or negligence of any third-party supplier. Any dispute arising from third-party services must be resolved directly with the relevant supplier.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">9. Intellectual Property</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              All content on our website—including text, graphics, logos, images, videos, and software—is the property of Touring Places South Africa or its licensors and is protected by South African and international intellectual property laws. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">10. Governing Law & Jurisdiction</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of the Western Cape, South Africa. Where possible, disputes will first be resolved through mediation before proceeding to litigation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">11. Amendments</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">12. Contact</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-xl mt-3">
              <p className="font-body text-foreground font-medium">Touring Places South Africa</p>
              <p className="font-body text-muted-foreground">Email: legal@touringplaces.co.za</p>
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

export default TermsConditions;
