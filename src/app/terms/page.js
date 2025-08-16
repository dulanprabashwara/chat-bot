import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Return to Homepage Button */}
          <div className="flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors group"
            >
              <svg
                className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Homepage</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-green-600 dark:text-green-400">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our
              platform.
            </p>
          </div>

          {/* Terms Content */}
          <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  1. Introduction
                </h2>
                <p>
                  By accessing and using this website, you agree to comply with
                  these Terms & Conditions. If you do not agree, please do not
                  use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  2. User Responsibilities
                </h2>
                <p>
                  You agree to use the platform responsibly and not engage in
                  harmful activities such as spamming, sharing inappropriate
                  content, or violating the rights of others.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  3. Data & Privacy
                </h2>
                <p>
                  We respect your privacy. Any personal information or chat data
                  you share will be stored securely and handled according to our
                  <a
                    href="/privacy"
                    className="underline ml-1 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  4. Service Availability
                </h2>
                <p>
                  While we strive to provide uninterrupted service, we do not
                  guarantee that the platform will always be available without
                  errors or downtime.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  5. Changes to Terms
                </h2>
                <p>
                  We reserve the right to update or change these terms at any
                  time. Continued use of the service means you accept the new
                  terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  6. Contact Us
                </h2>
                <p>
                  If you have questions about these Terms & Conditions, please{" "}
                  <a
                    href="/contact"
                    className="underline text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                  >
                    contact us
                  </a>
                  .
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
