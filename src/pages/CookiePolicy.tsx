import Navbar from "@/components/Navbar";
import { NewsletterFooter } from "@/components/NewsletterFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CookiePolicy = () => {
  const cookies = [
    {
      name: "session_id",
      purpose: "Authentication and session management",
      duration: "Session",
      type: "Essential",
    },
    {
      name: "user_preferences",
      purpose: "Store user preferences (theme, language)",
      duration: "1 year",
      type: "Functional",
    },
    {
      name: "analytics_id",
      purpose: "Track usage patterns for platform improvement",
      duration: "2 years",
      type: "Analytics",
    },
    {
      name: "ad_tracking",
      purpose: "Measure advertising effectiveness",
      duration: "90 days",
      type: "Advertising",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">Legal</Badge>
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
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
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit a website. They are widely used to make websites work more efficiently and provide 
                information to website owners.
              </p>
              <p>
                Similar technologies like web beacons, pixels, and local storage may also be used on our 
                platform. When we refer to "cookies" in this policy, we include these similar technologies.
              </p>

              <h2>2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li><strong>Essential:</strong> Enable core functionality like security, authentication, and accessibility</li>
                <li><strong>Functional:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics:</strong> Understand how visitors use our platform to improve the experience</li>
                <li><strong>Advertising:</strong> Deliver relevant advertisements and measure campaign effectiveness</li>
              </ul>

              <h2>3. Types of Cookies We Use</h2>
              <h3>3.1 Essential Cookies</h3>
              <p>
                These cookies are necessary for the platform to function and cannot be switched off. They 
                are usually set in response to actions you take, such as logging in or filling in forms.
              </p>

              <h3>3.2 Functional Cookies</h3>
              <p>
                These cookies enable enhanced functionality and personalization, such as remembering your 
                preferred theme (light/dark mode) or language preferences.
              </p>

              <h3>3.3 Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our platform by collecting 
                and reporting information anonymously. This helps us improve our services.
              </p>

              <h3>3.4 Advertising Cookies</h3>
              <p>
                These cookies are used to make advertising more relevant to you. They may be used by our 
                advertising partners to build a profile of your interests and show you relevant ads.
              </p>

              <h2>4. Cookies We Use</h2>
              <p>Here are the main cookies we use on our platform:</p>
              
              <div className="not-prose">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cookie Name</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cookies.map((cookie, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{cookie.name}</TableCell>
                        <TableCell>{cookie.purpose}</TableCell>
                        <TableCell>{cookie.duration}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{cookie.type}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <h2>5. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party services that appear on our pages. We use the 
                following third-party services:
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> Website traffic analysis</li>
                <li><strong>Supabase:</strong> Authentication and database services</li>
              </ul>
              <p>
                These third parties have their own privacy policies, and we encourage you to read them.
              </p>

              <h2>6. Managing Cookies</h2>
              <h3>6.1 Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can typically 
                find these settings in the "Privacy" or "Security" section of your browser preferences.
              </p>
              <p>Common browser cookie settings:</p>
              <ul>
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
              </ul>

              <h3>6.2 Opt-Out Options</h3>
              <p>
                You can opt out of certain types of cookies:
              </p>
              <ul>
                <li>To opt out of Google Analytics, visit the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                <li>For advertising cookies, visit <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
              </ul>

              <h3>6.3 Impact of Disabling Cookies</h3>
              <p>
                Please note that if you disable or refuse cookies, some parts of our platform may become 
                inaccessible or not function properly. Essential cookies cannot be disabled as they are 
                necessary for the platform to work.
              </p>

              <h2>7. Do Not Track</h2>
              <p>
                Some browsers have a "Do Not Track" feature that signals to websites that you do not want 
                your online activity tracked. Our platform currently does not respond to "Do Not Track" 
                signals, but you can opt out of analytics cookies as described above.
              </p>

              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or 
                for legal, operational, or regulatory reasons. We will notify you of any significant 
                changes by posting the updated policy on our website.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us:
              </p>
              <ul>
                <li>Email: privacy@notyourworld.com</li>
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

export default CookiePolicy;
