import { useState, useEffect, useRef } from "react";
import { api } from "../../utils/api";
import { resolveImagePath, getAssetBaseUrl } from "../../utils/imageUrl";

interface ImageSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  required?: boolean;
  aspectRatio?: string;
}

type InputMode = "gallery" | "url" | null;

export default function ImageSelector({
  value,
  onChange,
  label = "Image",
  required = false,
  aspectRatio = "16/9",
}: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [urlInput, setUrlInput] = useState("");
  const [gallery, setGallery] = useState<Array<{ id: number; filePath: string; fileName: string }>>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = value ? resolveImagePath(value) : null;

  useEffect(() => {
    if (inputMode === "gallery") fetchGallery();
  }, [inputMode]);

  async function fetchGallery() {
    setLoadingGallery(true);
    try {
      const response = await api.get<{ media?: Array<{ id: number; filePath: string; fileName: string }> }>(
        "/media?fileType=image&page=1&limit=40"
      );
      if (response.success && response.data) setGallery(response.data.media || []);
    } catch {
      alert("Failed to load gallery.");
    } finally {
      setLoadingGallery(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("auth_token");
      const base = getAssetBaseUrl() || "";
      const response = await fetch(`${base}/api/v1/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ""}` },
        body: formData,
      });
      const data = await response.json();
      if (data.success && data.imageUrl) {
        onChange(data.imageUrl);
        setInputMode(null);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const aspectClass =
    aspectRatio === "1/1" ? "aspect-square" : aspectRatio === "16/9" ? "aspect-video" : "";

  return (
    <div className="space-y-3">
      {label ? (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </label>
      ) : null}

      {preview ? (
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          <img
            src={preview}
            alt="Preview"
            className={`w-full rounded-lg object-cover ${aspectClass}`}
            style={{ maxHeight: "300px" }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-sm bg-[#0798bc] text-white rounded-lg"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          {!inputMode ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-[#0798bc] text-white rounded-lg"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setInputMode("gallery")}
                className="px-4 py-3 bg-green-600 text-white rounded-lg"
              >
                Gallery
              </button>
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg"
              >
                Path / URL
              </button>
            </div>
          ) : inputMode === "gallery" ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Media gallery</h4>
                <button type="button" onClick={() => setInputMode(null)} className="text-gray-500">
                  Close
                </button>
              </div>
              {loadingGallery ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : gallery.length === 0 ? (
                <p className="text-sm text-gray-500">No images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {gallery.map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => {
                        onChange(media.filePath);
                        setInputMode(null);
                      }}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#0798bc]"
                    >
                      <img
                        src={resolveImagePath(media.filePath)}
                        alt={media.fileName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Image path or URL</h4>
                <button type="button" onClick={() => setInputMode(null)} className="text-gray-500">
                  Close
                </button>
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="/images/banner.jpg or /uploads/2026/05/photo.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500">Use /images/... for static assets or upload for /uploads/...</p>
              <button
                type="button"
                onClick={() => {
                  const trimmed = urlInput.trim();
                  if (trimmed) {
                    onChange(trimmed);
                    setUrlInput("");
                    setInputMode(null);
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Use path
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
      />
      {uploading ? <p className="text-sm text-[#0798bc]">Uploading...</p> : null}
    </div>
  );
}
