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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600 dark:border-t-green-400"></div>
          <p className="text-green-600 dark:text-green-400 text-lg font-medium">
            Loading...
          </p>
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
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CreateBotContent />
    </Suspense>
  );
}
