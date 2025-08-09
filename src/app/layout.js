import "./globals.css";

export const metadata = {
  title: "AI Character Chat Platform",
  description: "Chat with AI characters powered by OpenRouter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg">{children}</body>
    </html>
  );
}
