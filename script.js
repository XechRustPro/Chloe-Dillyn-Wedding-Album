document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const uploadStatus = document.getElementById("uploadStatus");

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevents the page from refreshing
      
      const file = fileInput.files[0];
      if (!file) return;

      // Show a loading message
      uploadStatus.textContent = "Uploading... please wait!";
      uploadStatus.style.color = "#666";

      // Prepare the photo to be sent to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", window.UPLOAD_PRESET);

      try {
        // Send it to your specific Cloudinary account
        const response = await fetch(`https://api.cloudinary.com/v1_1/${window.CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          uploadStatus.textContent = "Photo uploaded successfully! Thank you for sharing.";
          uploadStatus.style.color = "green";
          uploadForm.reset();
        } else {
          console.error("Upload error:", data);
          uploadStatus.textContent = "Oops! Something went wrong: " + (data.error?.message || "Please try again.");
          uploadStatus.style.color = "red";
        }
      } catch (error) {
        console.error("Fetch error:", error);
        uploadStatus.textContent = "Network error. Please try again.";
        uploadStatus.style.color = "red";
      }
    });
  }
});
