export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <h1 className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          This is a placeholder privacy policy. Customize with real details
          about data collection, usage, storage duration, third-party services,
          and user rights.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>We store account & chat data in Firebase (scoped per user).</li>
          <li>No public sharing of your private chats.</li>
          <li>Contact messages stored for support purposes.</li>
          <li>Delete your profile to remove associated bots & messages.</li>
        </ul>
      </div>
    </div>
  );
}
