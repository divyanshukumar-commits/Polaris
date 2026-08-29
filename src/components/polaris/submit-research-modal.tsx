import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  File,
  FileAudio,
  FileCheck,
  FileImage,
  FilePlus,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Globe2,
  HardDrive,
  Info,
  Layers,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import type {
  ContentType,
  Region,
  ResearchAttachment,
  ResearchGalleryItem,
  ResearchItem,
  ResearchTimelineEvent,
  Topic,
} from "@/lib/data/types";
import { useApp } from "@/lib/store";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SubmitResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (item: ResearchItem) => void;
}

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".mp4",
  ".webm",
  ".mov",
  ".mp3",
  ".wav",
  ".m4a",
  ".csv",
  ".xlsx",
];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function getFileCategory(file: File): "document" | "image" | "video" | "audio" | "dataset" {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (type.startsWith("image/") || name.match(/\.(png|jpe?g|webp|gif|svg)$/)) return "image";
  if (type.startsWith("video/") || name.match(/\.(mp4|webm|mov|mkv)$/)) return "video";
  if (type.startsWith("audio/") || name.match(/\.(mp3|wav|m4a|aac|flac)$/)) return "audio";
  if (name.match(/\.(csv|xlsx|xls|tsv|json|nc|h5)$/)) return "dataset";
  return "document";
}

function getFileIcon(category: "document" | "image" | "video" | "audio" | "dataset") {
  switch (category) {
    case "image":
      return <FileImage className="text-emerald-400" size={24} />;
    case "video":
      return <FileVideo className="text-purple-400" size={24} />;
    case "audio":
      return <FileAudio className="text-amber-400" size={24} />;
    case "dataset":
      return <FileSpreadsheet className="text-blue-400" size={24} />;
    default:
      return <FileText className="text-cyan-400" size={24} />;
  }
}

export function SubmitResearchModal({ isOpen, onClose, onSuccess }: SubmitResearchModalProps) {
  const { submitResearch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Metadata Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentType>("Research Paper");
  const [region, setRegion] = useState<Region>("Antarctic");
  const [topic, setTopic] = useState<Topic>("Glaciology");
  const [authors, setAuthors] = useState("");
  const [institution, setInstitution] = useState(
    "National Centre for Polar and Ocean Research (NCPOR), Goa",
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [doi, setDoi] = useState("");
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState("Antarctica, NCPOR, Cryosphere");
  const [location, setLocation] = useState("Maitri / Bharati Station");
  const [keyFindings, setKeyFindings] = useState<string[]>([""]);

  // Field Image Attachments State
  const [galleryItems, setGalleryItems] = useState<
    ResearchGalleryItem[]
  >([]);

  // Auto-fill logged-in researcher's name
  useEffect(() => {
    const session = getAuthSession();
    if (session) {
      const fullName = [session.firstName, session.middleName, session.lastName]
        .filter(Boolean)
        .join(" ");
      if (fullName) {
        setAuthors(fullName);
      }
      if (session.organization) {
        setInstitution(session.organization);
      }
    }
  }, [isOpen]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleValidateAndSetFile = (file: File) => {
    setFileError(null);

    // Format extension check
    const fileName = file.name.toLowerCase();
    const isExtensionValid = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!isExtensionValid) {
      setFileError(
        `Unsupported file type "${file.name}". Please upload a PDF, DOC/DOCX, Image (JPG/PNG/WebP), Video (MP4/WebM), Audio (MP3/WAV), or Dataset (CSV/XLSX).`,
      );
      toast.error("Unsupported file type", {
        description: "Please choose a valid research manuscript, media, or data file.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `File is too large (${formatBytes(file.size)}). The maximum allowed upload size is 50 MB.`,
      );
      toast.error("File exceeds 50 MB limit");
      return;
    }

    setSelectedFile(file);

    // If title is empty, prefill cleanly from filename
    if (!title.trim()) {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setTitle(cleanTitle);
    }

    // Simulate animated upload progress
    setIsUploading(true);
    setUploadProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 25) + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(100);
        toast.success("File attached & checksum verified", {
          description: `${file.name} (${formatBytes(file.size)}) is ready for submission.`,
        });
      } else {
        setUploadProgress(current);
      }
    }, 120);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleValidateAndSetFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleValidateAndSetFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add Key Finding input
  const addFindingField = () => {
    setKeyFindings([...keyFindings, ""]);
  };

  const updateFindingField = (index: number, val: string) => {
    const next = [...keyFindings];
    next[index] = val;
    setKeyFindings(next);
  };

  const removeFindingField = (index: number) => {
    if (keyFindings.length <= 1) {
      setKeyFindings([""]);
      return;
    }
    setKeyFindings(keyFindings.filter((_, i) => i !== index));
  };

  // Add photo to gallery
  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload image files for the research gallery");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const newPhoto = {
        id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url: previewUrl,
        caption: `Field observation record: ${file.name.replace(/\.[^/.]+$/, "")}`,
        credit: institution || "NCPOR Research Team",
        tag: "Field Observation",
      };
      setGalleryItems((prev) => [...prev, newPhoto]);
    });
  };

  const removeGalleryPhoto = (id: string) => {
    setGalleryItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateGalleryCaption = (id: string, caption: string) => {
    setGalleryItems((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a research title.");
      return;
    }
    if (!abstract.trim()) {
      toast.error("Please provide an abstract or research summary.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload a manuscript, dataset, or research media file.");
      return;
    }
    if (isUploading) {
      toast.info("Please wait for the file upload check to finish.");
      return;
    }

    const session = getAuthSession();
    const authorList = authors
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeFormatted = now.toISOString().replace("T", " ").slice(0, 16) + " UTC";

    // Format attachments
    const attachments: ResearchAttachment[] = [];
    if (selectedFile) {
      const cat = getFileCategory(selectedFile);
      attachments.push({
        id: `att-${Date.now()}`,
        name: selectedFile.name,
        size: selectedFile.size,
        sizeFormatted: formatBytes(selectedFile.size),
        type: selectedFile.type || "application/octet-stream",
        category: cat,
        url: URL.createObjectURL(selectedFile),
        uploadedAt: dateStr,
      });
    }

    // Initial Lifecycle Timeline Events
    const initialTimeline: ResearchTimelineEvent[] = [
      {
        id: `evt-${Date.now()}-1`,
        date: timeFormatted,
        actor: authorList[0] || session?.firstName || "Researcher",
        actorRole: "Submitting Author / Principal Investigator",
        action: "Submitted to NCPOR Peer Review & Moderation Cell",
        note: "Manuscript and scientific attachments submitted for official review.",
        status: "pending",
        iconType: "submitted",
      },
      {
        id: `evt-${Date.now()}-2`,
        date: timeFormatted,
        actor: authorList[0] || session?.firstName || "Researcher",
        actorRole: "Author",
        action: selectedFile
          ? `Primary File Uploaded (${selectedFile.name})`
          : "Research Record Drafted",
        note: selectedFile
          ? `Attached ${formatBytes(selectedFile.size)} ${getFileCategory(selectedFile)} document.`
          : "Draft record created.",
        status: "info",
        iconType: "upload",
      },
      {
        id: `evt-${Date.now()}-3`,
        date: timeFormatted,
        actor: authorList[0] || session?.firstName || "Researcher",
        actorRole: "Author",
        action: "Research Project Initiated",
        note: `Project initialized under ${region} Program.`,
        status: "info",
        iconType: "created",
      },
    ];

    const cleanFindings = keyFindings.map((f) => f.trim()).filter(Boolean);

    const newResearchItem: ResearchItem = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      type,
      region,
      topic,
      authors: authorList.length > 0 ? authorList : ["Lead Researcher"],
      institution: institution.trim(),
      year: Number(year) || now.getFullYear(),
      abstract: abstract.trim(),
      doi: doi.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      keyFindings: cleanFindings.length > 0 ? cleanFindings : [abstract.slice(0, 120) + "..."],
      status: "Under Review",
      views: 0,
      location: location.trim() || undefined,
      publicationDate: dateStr,
      publisherName: session?.firstName
        ? [session.firstName, session.middleName, session.lastName].filter(Boolean).join(" ")
        : authorList[0],
      publisherEmail: session?.email,
      publisherImageUrl: session?.profileImage,
      imageUrl: galleryItems[0]?.url,
      visibility: "public",
      downloadAllowed: attachments.length > 0,
      downloadUrl: attachments[0]?.url,
      verified: false,
      attachments,
      gallery: galleryItems.length > 0 ? galleryItems : undefined,
      timeline: initialTimeline,
    };

    submitResearch(newResearchItem);

    toast.success("Research paper submitted successfully!", {
      description: `"${newResearchItem.title}" is now under review by the NCPOR moderation board.`,
    });

    onSuccess?.(newResearchItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="glass-strong relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#071322]/95 shadow-2xl glow-primary max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-secondary/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
                <FilePlus size={18} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  Submit Research Manuscript or Dataset
                </h2>
                <p className="text-xs text-muted-foreground">
                  Direct local upload to National Polar Data Centre (NPDC)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-border bg-secondary/50 p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Direct Local File Upload Dropzone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                  <UploadCloud size={14} /> 1. Upload Manuscript / Media File *
                </label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Max 50MB (PDF, DOCX, Images, Video, Audio, Data)
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={ACCEPTED_EXTENSIONS.join(",")}
                className="hidden"
                id="research-file-input"
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition-all cursor-pointer",
                    isDragOver
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-border/80 bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40",
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-3">
                    <Upload size={22} className="animate-bounce" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to browse or drag & drop research files
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Supports <strong>PDF, DOC, DOCX, PNG, JPG, WebP, MP4, WebM, MP3, WAV, CSV</strong>
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border shrink-0">
                        {getFileIcon(getFileCategory(selectedFile))}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground mt-0.5">
                          <span>{formatBytes(selectedFile.size)}</span>
                          <span>·</span>
                          <span className="uppercase text-cyan-300">
                            {getFileCategory(selectedFile)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Replace file"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Upload progress indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className={uploadProgress === 100 ? "text-emerald-400 font-bold" : "text-cyan-300"}>
                        {uploadProgress === 100 ? "✓ Upload & Checksum Complete" : `Uploading (${uploadProgress}%)...`}
                      </span>
                      <span className="text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn(
                          "h-full transition-all duration-200",
                          uploadProgress === 100 ? "bg-emerald-400" : "bg-primary",
                        )}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {fileError && (
                <p className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                  <AlertCircle size={13} className="shrink-0" />
                  {fileError}
                </p>
              )}
            </div>

            {/* 2. Research Metadata Fields */}
            <div className="space-y-4 pt-2 border-t border-border/80">
              <label className="font-mono text-xs uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                <FileText size={14} /> 2. Research Metadata & Classification
              </label>

              <div>
                <label className="text-xs font-semibold text-foreground">Manuscript / Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Decadal Acceleration in West Antarctic Ice Stream Discharge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Content Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ContentType)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  >
                    <option value="Research Paper">Research Paper</option>
                    <option value="Report">Scientific Report</option>
                    <option value="Dataset">Telemetry Dataset</option>
                    <option value="Article">Field Article</option>
                    <option value="Educational Resource">Educational Resource</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Polar Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  >
                    <option value="Antarctic">Antarctic</option>
                    <option value="Arctic">Arctic</option>
                    <option value="Himalayan">Himalayan / Third Pole</option>
                    <option value="Southern Ocean">Southern Ocean</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Scientific Discipline</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as Topic)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  >
                    <option value="Glaciology">Glaciology</option>
                    <option value="Climate">Climate Science</option>
                    <option value="Oceanography">Oceanography</option>
                    <option value="Wildlife">Wildlife & Biology</option>
                    <option value="Space & Satellite">Space & Satellite</option>
                    <option value="Meteorology">Meteorology</option>
                    <option value="Geology">Geology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Authors (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Geeta Nair, Dr. Thamban Meloth"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Affiliation / Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. NCPOR, MoES, Goa"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Abstract / Plain Summary *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a concise summary of your research methods, observational findings, and significance..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                />
              </div>

              {/* Key Findings List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Key Observational Findings (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={addFindingField}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={12} /> Add finding
                  </button>
                </div>

                {keyFindings.map((finding, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground w-4 text-center">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      placeholder={`Finding ${idx + 1}...`}
                      value={finding}
                      onChange={(e) => updateFindingField(idx, e.target.value)}
                      className="flex-1 rounded-xl border border-input bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                    />
                    {keyFindings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFindingField(idx)}
                        className="rounded-lg p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Tags</label>
                  <input
                    type="text"
                    placeholder="e.g. Ice Sheet, GRACE-FO, Sea Level"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">DOI (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10.1038/s41561-026-..."
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                  />
                </div>
              </div>
            </div>

            {/* 3. Research Field Photos & Media Gallery */}
            <div className="space-y-3 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
                  <Camera size={14} /> 3. Research Field Photos & Captions
                </label>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="rounded-lg bg-secondary border border-border px-2.5 py-1 text-xs font-bold text-primary hover:border-primary/40 cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} /> Add Photo
                </button>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddGalleryPhoto}
                className="hidden"
              />

              {galleryItems.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {galleryItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border bg-secondary/30 p-2.5 space-y-2 relative"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40">
                        <img
                          src={item.url}
                          alt={item.caption}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryPhoto(item.id)}
                          className="absolute top-1.5 right-1.5 rounded-md bg-black/70 p-1 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder={`Figure ${idx + 1} caption...`}
                        value={item.caption}
                        onChange={(e) => updateGalleryCaption(item.id, e.target.value)}
                        className="w-full rounded-lg border border-input bg-secondary/70 px-2.5 py-1 text-[11px] text-foreground outline-none focus:border-primary/50"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No field photos attached yet. You can attach expedition photographs, sensor plots, or diagrams.
                </p>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-border/80 px-6 py-4 bg-secondary/30 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 glow-primary cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Submit to Moderation Board
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
