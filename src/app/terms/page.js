export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <h1 className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          These are placeholder terms. Replace with real legal language covering
          acceptable use, limitations, disclaimers, and liability.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>Use the platform responsibly; no abusive or illegal content.</li>
          <li>We may update features; continued use implies acceptance.</li>
          <li>AI responses may be inaccurate; verify critical information.</li>
          <li>Deleting your account removes stored bots & messages.</li>
        </ul>
      </div>
    </div>
  );
}
