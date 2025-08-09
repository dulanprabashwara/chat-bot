export async function uploadBotImage(userId, file) {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    // Upload through API route
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload image");
    }

    return data.url;
  } catch (error) {
    console.error("Error uploading bot image:", error);
    if (error.code === "storage/unauthorized") {
      throw new Error("Permission denied: Please check if you are logged in");
    } else if (error.code === "storage/canceled") {
      throw new Error("Upload was cancelled");
    } else if (error.code === "storage/invalid-argument") {
      throw new Error("Invalid file provided");
    } else {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}
