import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    console.log("Converting file to buffer");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create file path
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = `bots/${userId}/${fileName}`;

    console.log("Starting upload process:", {
      fileName,
      fileType: file.type,
      fileSize: buffer.length,
    });

    // Create storage reference and upload
    const storageRef = ref(storage, filePath);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    };

    console.log("Uploading to Firebase Storage...");
    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    console.log("Upload successful, getting download URL");

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Got download URL:", downloadURL);

    return NextResponse.json({ url: downloadURL });
  } catch (error) {
    console.error("Upload error:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: `Upload failed: ${error.message}`,
        code: error.code || "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
