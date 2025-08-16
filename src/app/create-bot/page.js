"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import CreateBotForm from "@/components/CreateBotForm";
import Link from "next/link";
import Footer from "@/components/Footer";

function CreateBotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preSelectedBotType, setPreSelectedBotType] = useState(null);

  useEffect(() => {
    // Get bot type from URL parameters
    const botType = searchParams.get("type");
    if (botType) {
      setPreSelectedBotType(botType);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen transition-colors">
        <div className="text-center space-y-6">
          {/* Enhanced loading spinner */}
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 dark:border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-green-500 border-r-green-400 border-transparent mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            {/* Inner pulse */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Loading text with animation */}
          <div className="space-y-2">
            <p className="text-green-600 dark:text-green-400 text-2xl font-bold animate-pulse">
              Loading...
            </p>
            <div className="flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Create New Bot
            </h1>
            <p className="text-muted-foreground mt-2">
              Design your perfect AI companion
            </p>
          </div>
          <Link href="/" className="text-green-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {user && (
          <CreateBotForm user={user} preSelectedBotType={preSelectedBotType} />
        )}
      </div>

      {/* Spacer between form and footer */}
      <div className="py-8"></div>

      <Footer />
    </div>
  );
}

export default function CreateBotPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <CreateBotContent />
    </Suspense>
  );
}
