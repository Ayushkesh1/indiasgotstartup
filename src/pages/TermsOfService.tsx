import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">Legal</Badge>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: January 11, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none pt-8">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using India's Got Startup ("the Platform"), you accept and agree to be bound by 
                the terms and provisions of this agreement. If you do not agree to abide by these terms, 
                please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                India's Got Startup is an online publishing platform that allows users to read, write, and share 
                articles on technology, fintech, blockchain, and related topics. We provide tools for content 
                creation, community engagement, and monetization for creators.
              </p>

              <h2>3. User Accounts</h2>
              <h3>3.1 Registration</h3>
              <p>
                To access certain features of the Platform, you must register for an account. You agree to 
                provide accurate, current, and complete information during registration and to update such 
                information to keep it accurate, current, and complete.
              </p>
              <h3>3.2 Account Security</h3>
              <p>
                You are responsible for safeguarding your password and for all activities that occur under 
                your account. You agree to notify us immediately of any unauthorized access to your account.
              </p>

              <h2>4. User Content</h2>
              <h3>4.1 Ownership</h3>
              <p>
                You retain all ownership rights to the content you create and publish on our Platform. By 
                posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, 
                reproduce, modify, and distribute your content in connection with operating the Platform.
              </p>
              <h3>4.2 Content Standards</h3>
              <p>
                You agree not to post content that:
              </p>
              <ul>
                <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                <li>Infringes on any patent, trademark, copyright, or other proprietary rights</li>
                <li>Contains viruses, malware, or other harmful components</li>
                <li>Constitutes spam, unsolicited advertising, or unauthorized promotion</li>
                <li>Impersonates any person or entity or falsely states your affiliation</li>
              </ul>

              <h2>5. Creator Program</h2>
              <h3>5.1 Eligibility</h3>
              <p>
                To participate in our Creator Program and earn money, you must be at least 18 years old, 
                have a verified account, and comply with all applicable tax regulations in your jurisdiction.
              </p>
              <h3>5.2 Earnings</h3>
              <p>
                Earnings are calculated based on engagement metrics including views, comments, and bookmarks. 
                We distribute 50% of our subscription revenue to creators based on their share of total 
                engagement points. Payment terms and minimum thresholds are detailed in our Creator Program 
                documentation.
              </p>
              <h3>5.3 Payment</h3>
              <p>
                Payments are processed monthly, subject to a minimum balance of ₹500. We reserve the right 
                to withhold payments if we detect fraudulent activity or violation of these terms.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                The Platform, including its original content (excluding user content), features, and 
                functionality, is owned by India's Got Startup and is protected by international copyright, 
                trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2>7. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Platform for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to any portion of the Platform</li>
                <li>Interfere with or disrupt the Platform or servers or networks connected to it</li>
                <li>Use any robot, spider, or other automated means to access the Platform</li>
                <li>Collect or harvest any personally identifiable information from the Platform</li>
                <li>Create fake accounts or manipulate engagement metrics</li>
              </ul>

              <h2>8. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason, including breach of these Terms. Upon termination, your right to use the 
                Platform will immediately cease. Unpaid earnings may be forfeited if termination is due 
                to violation of these terms.
              </p>

              <h2>9. Disclaimers</h2>
              <p>
                The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, 
                expressed or implied, regarding the operation of the Platform or the information, content, 
                or materials included thereon.
              </p>

              <h2>10. Limitation of Liability</h2>
              <p>
                In no event shall Not Your World be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including loss of profits, data, or other intangible 
                losses, resulting from your access to or use of or inability to access or use the Platform.
              </p>

              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions. Any disputes arising from these terms 
                shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.
              </p>

              <h2>12. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. We will provide notice 
                of significant changes by posting the new Terms on this page and updating the "Last updated" 
                date. Your continued use of the Platform after such modifications constitutes acceptance 
                of the updated terms.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul>
                <li>Email: legal@notyourworld.com</li>
                <li>Address: 123 Tech Park, Andheri East, Mumbai 400093, India</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default TermsOfService;
