import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">Legal</Badge>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
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
              <h2>1. Introduction</h2>
              <p>
                Not Your World ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
                Policy explains how we collect, use, disclose, and safeguard your information when you use 
                our platform and services.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Information You Provide</h3>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
                <li><strong>Content:</strong> Articles, comments, and other content you create</li>
                <li><strong>Payment Information:</strong> Bank details or UPI IDs for creator payouts</li>
                <li><strong>Communications:</strong> Messages you send to us or other users</li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, time spent, articles read, and interactions</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li><strong>Location Data:</strong> General location based on IP address</li>
                <li><strong>Cookies and Tracking:</strong> As described in our Cookie Policy</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the collected information for:</p>
              <ul>
                <li>Providing and maintaining our services</li>
                <li>Processing your transactions and managing your account</li>
                <li>Personalizing your experience and content recommendations</li>
                <li>Calculating and distributing creator earnings</li>
                <li>Sending newsletters and marketing communications (with your consent)</li>
                <li>Analyzing usage patterns to improve our platform</li>
                <li>Preventing fraud and ensuring platform security</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2>4. Information Sharing</h2>
              <h3>4.1 Public Information</h3>
              <p>
                Your profile name, bio, and published articles are publicly visible. Comments you post 
                are visible to other users.
              </p>

              <h3>4.2 Third-Party Service Providers</h3>
              <p>
                We may share your information with service providers who assist us in operating the platform, 
                including:
              </p>
              <ul>
                <li>Cloud hosting and infrastructure providers</li>
                <li>Payment processing services</li>
                <li>Analytics and performance monitoring tools</li>
                <li>Email delivery services</li>
              </ul>

              <h3>4.3 Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, court order, or government request, 
                or to protect the rights, property, or safety of our users or the public.
              </p>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These 
                measures include:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>

              <h2>6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to 
                provide you services. We may retain certain information for longer periods for legal, 
                business, or security purposes.
              </p>

              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Export:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@notyourworld.com or through your 
                account settings.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 13. We do not knowingly 
                collect personal information from children under 13. If you become aware that a child 
                has provided us with personal information, please contact us.
              </p>

              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than India. We 
                ensure appropriate safeguards are in place to protect your data in accordance with this 
                Privacy Policy.
              </p>

              <h2>10. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible for the 
                privacy practices of these sites. We encourage you to read the privacy policies of any 
                linked websites.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. We 
                encourage you to review this Privacy Policy periodically.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>Email: privacy@notyourworld.com</li>
                <li>Address: 123 Tech Park, Andheri East, Mumbai 400093, India</li>
                <li>Data Protection Officer: dpo@notyourworld.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewsletterFooter />
    </div>
  );
};

export default PrivacyPolicy;
