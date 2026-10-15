(() => {
  const config = window.ALBUM_CONFIG || {};
  const input = document.getElementById("photoInput");
  const dropZone = document.getElementById("dropZone");
  const previewArea = document.getElementById("previewArea");
  const previewGrid = document.getElementById("previewGrid");
  const photoCount = document.getElementById("photoCount");
  const clearPhotos = document.getElementById("clearPhotos");
  const uploadForm = document.getElementById("uploadForm");
  const uploadButton = document.getElementById("uploadButton");
  const uploadStatus = document.getElementById("uploadStatus");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".desktop-nav");
  let selectedFiles = [];
  let previews = [];

  const configured = () =>
    config.cloudinaryCloudName &&
    config.cloudinaryUploadPreset &&
    !config.cloudinaryCloudName.startsWith("YOUR_") &&
    !config.cloudinaryUploadPreset.startsWith("YOUR_");

  function setStatus(message, type = "") {
    uploadStatus.textContent = message;
    uploadStatus.className = "upload-status" + (type ? " " + type : "");
  }

  function revokePreviews() {
    previews.forEach(url => URL.revokeObjectURL(url));
    previews = [];
  }

  function renderPreviews() {
    revokePreviews();
    previewGrid.replaceChildren();
    selectedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      previews.push(url);
      const tile = document.createElement("div");
      tile.className = "preview-tile";
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Selected photo preview";
      const name = document.createElement("span");
      name.textContent = file.name;
      tile.append(img, name);
      previewGrid.append(tile);
    });
    previewArea.hidden = selectedFiles.length === 0;
    photoCount.textContent = `${selectedFiles.length} photo${selectedFiles.length === 1 ? "" : "s"} selected`;
    setStatus(selectedFiles.length ? "Photos selected. Add your name or a note, then share when storage is connected." :
      "Photo sharing will be ready once the album owner connects photo storage.");
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList || []).filter(file => file.type.startsWith("image/"));
    const maxPhotos = Number(config.maxPhotos || 10);
    const maxBytes = Number(config.maxFileSizeMB || 10) * 1024 * 1024;
    const tooLarge = incoming.filter(file => file.size > maxBytes);
    const valid = incoming.filter(file => file.size <= maxBytes);
    const combined = [...selectedFiles, ...valid];
    const unique = [];
    const seen = new Set();
    combined.forEach(file => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (!seen.has(key)) { seen.add(key); unique.push(file); }
    });
    selectedFiles = unique.slice(0, maxPhotos);
    renderPreviews();
    if (tooLarge.length) setStatus(`${tooLarge.length} photo(s) were skipped because each file must be under ${config.maxFileSizeMB || 10} MB.`, "error");
    else if (unique.length > maxPhotos) setStatus(`You can choose up to ${maxPhotos} photos per submission.`, "error");
    else if (!incoming.length) setStatus("Please choose image files to share.", "error");
  }

  dropZone.addEventListener("click", () => input.click());
  dropZone.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); input.click(); }
  });
  input.addEventListener("change", event => {
    addFiles(event.target.files);
    input.value = "";
  });
  ["dragenter", "dragover"].forEach(type => dropZone.addEventListener(type, event => {
    event.preventDefault(); dropZone.classList.add("drag-over");
  }));
  ["dragleave", "drop"].forEach(type => dropZone.addEventListener(type, event => {
    event.preventDefault(); dropZone.classList.remove("drag-over");
  }));
  dropZone.addEventListener("drop", event => addFiles(event.dataTransfer.files));
  clearPhotos.addEventListener("click", () => {
    selectedFiles = [];
    renderPreviews();
  });

  async function uploadToCloudinary(file, metadata) {
    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudinaryCloudName)}/image/upload`;
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", config.cloudinaryUploadPreset);
    body.append("folder", "chloe-dillyn-wedding-album");
    body.append("context", `guest_name=${metadata.name || "Guest"}|note=${metadata.note || ""}`);
    const response = await fetch(endpoint, { method: "POST", body });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "A photo could not be uploaded.");
    return result;
  }

  uploadForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!selectedFiles.length) {
      setStatus("Choose at least one photo first. ♡", "error");
      dropZone.focus();
      return;
    }
    if (!configured()) {
      setStatus("Almost there! The album owner needs to connect Cloudinary photo storage. Your photos have not been uploaded yet.", "error");
      return;
    }
    const name = document.getElementById("guestName").value.trim().slice(0, 80);
    const note = document.getElementById("photoNote").value.trim().slice(0, 300);
    uploadButton.disabled = true;
    uploadButton.textContent = "Uploading your memories…";
    setStatus("Uploading photos securely to the album storage. Please keep this page open.");
    let uploaded = 0;
    const failures = [];
    try {
      for (const file of selectedFiles) {
        try {
          await uploadToCloudinary(file, { name, note });
          uploaded++;
          setStatus(`Uploading your memories… ${uploaded} of ${selectedFiles.length} complete.`);
        } catch (error) {
          failures.push(`${file.name}: ${error.message}`);
        }
      }
      if (uploaded && !failures.length) {
        selectedFiles = [];
        renderPreviews();
        uploadForm.reset();
        setStatus(`Thank you! ${uploaded} photo${uploaded === 1 ? "" : "s"} shared successfully. Chloe & Dillyn will love these memories. ♡`, "success");
      } else if (uploaded) {
        setStatus(`${uploaded} photo(s) uploaded, but ${failures.length} failed. Try the failed photos again.`, "error");
      } else {
        setStatus(failures[0] || "Upload failed. Please try again.", "error");
      }
    } finally {
      uploadButton.disabled = false;
      uploadButton.innerHTML = 'Share the memories <span aria-hidden="true">↗</span>';
    }
  });

  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    observer.observe(element);
  });
})();
