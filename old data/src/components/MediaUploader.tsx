"use client";

import {
  Image as ImageIcon,
  MoveDown,
  MoveUp,
  Play,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  Video as VideoIcon,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import {
  ARCHITECTURAL_PRESET_MEDIA,
  createMediaItem,
  fileToBase64,
  formatVideoEmbedUrl,
} from "../projects/mediaUtils";
import type { MediaItem, MediaType } from "../projects/types";

interface MediaUploaderProps {
  coverMedia: { type: MediaType; url: string; caption?: string };
  galleryMedia: MediaItem[];
  onChangeCover: (cover: {
    type: MediaType;
    url: string;
    caption?: string;
  }) => void;
  onChangeGallery: (gallery: MediaItem[]) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  coverMedia,
  galleryMedia,
  onChangeCover,
  onChangeGallery,
}) => {
  const [activeTab, setActiveTab] = useState<"cover" | "gallery" | "presets">(
    "cover",
  );
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<MediaType>("image");
  const [newCaption, setNewCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, isForCover = false) => {
    try {
      setIsUploading(true);
      const isVideo = file.type.startsWith("video/");
      const type: MediaType = isVideo ? "video" : "image";
      const base64Data = await fileToBase64(file);

      if (isForCover) {
        onChangeCover({
          type,
          url: base64Data,
          caption: file.name.replace(/\.[^/.]+$/, ""),
        });
      } else {
        const newItem = createMediaItem(
          type,
          base64Data,
          file.name.replace(/\.[^/.]+$/, ""),
          true,
        );
        onChangeGallery([...galleryMedia, newItem]);
      }
    } catch (e) {
      console.error("File upload error:", e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isForCover = false) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0], isForCover);
    }
  };

  const handleAddUrlToGallery = () => {
    if (!newUrl.trim()) return;
    const item = createMediaItem(
      newType,
      newUrl.trim(),
      newCaption.trim() || undefined,
      false,
    );
    onChangeGallery([...galleryMedia, item]);
    setNewUrl("");
    setNewCaption("");
  };

  const handleRemoveGalleryItem = (id: string) => {
    onChangeGallery(galleryMedia.filter((item) => item.id !== id));
  };

  const handleMoveGalleryItem = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= galleryMedia.length) return;
    const reordered = [...galleryMedia];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;
    onChangeGallery(reordered);
  };

  const handleApplyPreset = (
    preset: (typeof ARCHITECTURAL_PRESET_MEDIA)[0],
    asCover: boolean,
  ) => {
    if (asCover) {
      onChangeCover({
        type: preset.type,
        url: preset.url,
        caption: preset.label,
      });
    } else {
      const item = createMediaItem(
        preset.type,
        preset.url,
        preset.label,
        false,
      );
      onChangeGallery([...galleryMedia, item]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("cover")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all ${
            activeTab === "cover"
              ? "bg-primary/20 text-primary border border-primary/40 font-bold"
              : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Cover Media ({coverMedia.type.toUpperCase()})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all ${
            activeTab === "gallery"
              ? "bg-primary/20 text-primary border border-primary/40 font-bold"
              : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
          }`}
        >
          <VideoIcon className="w-4 h-4" />
          Gallery & Videos ({galleryMedia.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all ${
            activeTab === "presets"
              ? "bg-primary/20 text-primary border border-primary/40 font-bold"
              : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Media Library Presets
        </button>
      </div>

      {/* COVER TAB */}
      {activeTab === "cover" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Live Preview Box */}
            <div className="w-full sm:w-1/2 aspect-video bg-surface-container-lowest border border-outline-variant/40 rounded-lg overflow-hidden relative group shadow-inner">
              {coverMedia.url ? (
                coverMedia.type === "video" ? (
                  formatVideoEmbedUrl(coverMedia.url).isEmbed ? (
                    <iframe
                      src={formatVideoEmbedUrl(coverMedia.url).embedUrl}
                      className="w-full h-full"
                      title="Cover Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={coverMedia.url}
                      controls
                      className="w-full h-full object-cover"
                    >
                      <track kind="captions" src="" label="English" />
                    </video>
                  )
                ) : (
                  <img
                    src={coverMedia.url}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/40 text-xs">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-30" />
                  <span>No cover media assigned</span>
                </div>
              )}
              {coverMedia.url && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-mono text-primary border border-primary/40 uppercase">
                  {coverMedia.type} Cover
                </div>
              )}
            </div>

            {/* Input fields */}
            <div className="w-full sm:w-1/2 space-y-3">
              <div>
                <label
                  htmlFor="cover-media-type"
                  className="block text-xs font-mono text-on-surface-variant uppercase mb-1"
                >
                  Cover Media Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeCover({ ...coverMedia, type: "image" })
                    }
                    className={`py-2 px-3 text-xs font-mono rounded border flex items-center justify-center gap-2 ${
                      coverMedia.type === "image"
                        ? "bg-primary/20 border-primary text-primary font-bold"
                        : "bg-surface-container border-outline-variant/30 text-on-surface-variant"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Image Photo
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeCover({ ...coverMedia, type: "video" })
                    }
                    className={`py-2 px-3 text-xs font-mono rounded border flex items-center justify-center gap-2 ${
                      coverMedia.type === "video"
                        ? "bg-primary/20 border-primary text-primary font-bold"
                        : "bg-surface-container border-outline-variant/30 text-on-surface-variant"
                    }`}
                  >
                    <VideoIcon className="w-4 h-4" /> Video Demo
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cover-url-input"
                  className="block text-xs font-mono text-on-surface-variant uppercase mb-1"
                >
                  Cover URL / Path
                </label>
                <input
                  id="cover-url-input"
                  type="text"
                  value={coverMedia.url}
                  onChange={(e) =>
                    onChangeCover({ ...coverMedia, url: e.target.value })
                  }
                  placeholder="https://... or photos_and_videos/projects/... or YouTube link"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cover-caption-input"
                  className="block text-xs font-mono text-on-surface-variant uppercase mb-1"
                >
                  Caption / Architectural Angle
                </label>
                <input
                  id="cover-caption-input"
                  type="text"
                  value={coverMedia.caption || ""}
                  onChange={(e) =>
                    onChangeCover({ ...coverMedia, caption: e.target.value })
                  }
                  placeholder="e.g. Front Sandstone Portico & Cantilevered Balconies"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              {/* Direct Drag-and-Drop Local File Upload */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => handleDrop(e, true)}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/40 hover:border-primary/60 bg-surface-container-low"
                }`}
              >
                <UploadCloud className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs font-semibold text-on-surface">
                  {isUploading
                    ? "Encoding Media..."
                    : "Click to Upload or Drag File Here"}
                </p>
                <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                  Converts JPG, PNG, WEBP, or MP4 to persistent client-side Data
                  URL
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleFileUpload(e.target.files[0], true)
                  }
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === "gallery" && (
        <div className="space-y-5">
          {/* Add New Gallery Item Section */}
          <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-lg space-y-3">
            <h4 className="text-xs font-mono font-bold text-primary uppercase flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Photo / Video to Gallery
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3">
                <label
                  htmlFor="gallery-type-select"
                  className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1"
                >
                  Type
                </label>
                <select
                  id="gallery-type-select"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as MediaType)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded px-2 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="image">Image Photo</option>
                  <option value="video">Video (YouTube/MP4)</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label
                  htmlFor="gallery-url-input"
                  className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1"
                >
                  Media URL or Embed Link
                </label>
                <input
                  id="gallery-url-input"
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://... or YouTube video link"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="gallery-caption-input"
                  className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1"
                >
                  Caption
                </label>
                <div className="flex gap-2">
                  <input
                    id="gallery-caption-input"
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Master Bedroom Courtyard"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlToGallery}
                    disabled={!newUrl.trim()}
                    className="px-3 py-1.5 bg-primary text-background font-bold text-xs rounded hover:bg-primary-hover disabled:opacity-40 transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Drag & drop upload to gallery */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => handleDrop(e, false)}
              className="mt-2 border border-dashed border-outline-variant/30 rounded p-2.5 text-center bg-surface-container/40 flex items-center justify-center gap-3 cursor-pointer hover:border-primary/50"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
            >
              <UploadCloud className="w-4 h-4 text-primary" />
              <span className="text-xs text-on-surface-variant">
                Or drag & drop local media files here to append directly to the
                gallery
              </span>
            </div>
          </div>

          {/* Gallery Items List & Reorder */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
              <span>CURRENT GALLERY ASSETS ({galleryMedia.length})</span>
              <span className="text-[11px] opacity-60">
                Drag / Reorder / Delete items
              </span>
            </div>

            {galleryMedia.length === 0 ? (
              <div className="p-8 text-center border border-outline-variant/20 rounded-lg text-on-surface-variant/40 text-xs">
                No extra gallery items. Add photos, walk-through videos, or
                YouTube drones.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {galleryMedia.map((item, index) => {
                  const isVid = item.type === "video";
                  const embedInfo = isVid
                    ? formatVideoEmbedUrl(item.url)
                    : null;

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 bg-surface-container border border-outline-variant/30 rounded-lg flex flex-col gap-2 relative group hover:border-primary/50 transition-all shadow-md"
                    >
                      {/* Media preview thumbnail */}
                      <div className="aspect-video w-full bg-black/60 rounded overflow-hidden relative">
                        {isVid ? (
                          embedInfo?.isEmbed ? (
                            <iframe
                              src={embedInfo.embedUrl}
                              className="w-full h-full"
                              title={item.caption || "Video"}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-primary">
                              <Play className="w-8 h-8" />
                            </div>
                          )
                        ) : (
                          <img
                            src={item.url}
                            alt={item.caption || "Gallery"}
                            className="w-full h-full object-cover"
                          />
                        )}

                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-primary uppercase">
                          {index + 1}. {item.type}
                        </div>
                      </div>

                      {/* Caption & Controls */}
                      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                        <div
                          className="truncate text-xs text-on-surface flex-1"
                          title={item.caption || item.url}
                        >
                          {item.caption || "No caption"}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryItem(index, "up")}
                            disabled={index === 0}
                            className="p-1 rounded bg-surface-container-high hover:bg-primary/20 text-on-surface-variant hover:text-primary disabled:opacity-20 text-xs"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryItem(index, "down")}
                            disabled={index === galleryMedia.length - 1}
                            className="p-1 rounded bg-surface-container-high hover:bg-primary/20 text-on-surface-variant hover:text-primary disabled:opacity-20 text-xs"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryItem(item.id)}
                            className="p-1 rounded bg-red-900/30 hover:bg-red-900/60 text-red-300 text-xs"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRESETS TAB */}
      {activeTab === "presets" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">
            Select verified architectural renders, branding animation videos,
            and blueprints from the built-in assets directory:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ARCHITECTURAL_PRESET_MEDIA.map((preset) => (
              <div
                key={preset.url || preset.label}
                className="p-3 bg-surface-container border border-outline-variant/30 rounded-lg flex flex-col justify-between gap-3 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-12 rounded bg-black/60 overflow-hidden shrink-0 flex items-center justify-center">
                    {preset.type === "video" ? (
                      <VideoIcon className="w-6 h-6 text-primary" />
                    ) : (
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-primary uppercase block">
                      {preset.category}
                    </span>
                    <h5
                      className="text-xs font-medium text-white truncate"
                      title={preset.label}
                    >
                      {preset.label}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset, true)}
                    className="flex-1 py-1 px-2 text-[10px] font-mono uppercase bg-primary/20 hover:bg-primary text-primary hover:text-background font-semibold rounded transition-colors text-center"
                  >
                    Set as Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset, false)}
                    className="flex-1 py-1 px-2 text-[10px] font-mono uppercase bg-surface-container-high hover:bg-white/10 text-on-surface rounded transition-colors text-center"
                  >
                    + Add to Gallery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
