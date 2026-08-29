export type Region = "Arctic" | "Antarctic";
export type Topic =
  | "Climate"
  | "Glaciology"
  | "Oceanography"
  | "Wildlife"
  | "Meteorology"
  | "Geology"
  | "Space & Satellite";
export type ContentType =
  "Research Paper" | "Report" | "Article" | "Dataset" | "Educational Resource";
export type ResearchStatus = "Published" | "Pending Review" | "Under Review" | "Draft" | "Rejected";
export type ExpeditionStatus = "Active" | "Completed" | "Upcoming";
export type MediaType = "image" | "video" | "infographic";

export interface ResearchTimelineEvent {
  id: string;
  date: string;
  actor: string;
  actorRole?: string;
  actorAvatar?: string;
  action: string;
  note?: string;
  status?: "pending" | "success" | "warning" | "info" | "rejected";
  icon?: string;
  iconType?: "created" | "upload" | "edit" | "collaborator" | "submitted" | "review" | "approved" | "rejected" | "published" | "activity";
}

export interface ResearchAttachment {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: string;
  category: "document" | "image" | "video" | "audio" | "dataset";
  url?: string;
  uploadedAt: string;
}

export interface ResearchGalleryItem {
  id: string;
  url: string;
  caption: string;
  credit?: string | undefined;
  creditUrl?: string | undefined;
  tag?: string | undefined;
}

export interface ResearchItem {
  id: string;
  title: string;
  authors: string[];
  institution: string;
  year: number;
  region: Region;
  topic: Topic;
  type: ContentType;
  abstract: string;
  keyFindings?: string[] | undefined;
  tags: string[];
  views: number;
  status: ResearchStatus;
  dateAdded?: string | undefined;
  expeditionId?: string | undefined;
  doi?: string | undefined;
  downloadUrl?: string | undefined;
  verified?: boolean | undefined;
  access?: "public" | "restricted" | "confidential" | undefined;
  downloadAllowed?: boolean | undefined;
  location?: string | undefined;
  publicationDate?: string | undefined;
  publisherName?: string | undefined;
  publisherEmail?: string | undefined;
  publisherImageUrl?: string | undefined;
  visibility?: "public" | "restricted" | undefined;
  imageUrl?: string | undefined;
  imageSourceUrl?: string | undefined;
  videoUrl?: string | undefined;
  gallery?: ResearchGalleryItem[] | undefined;
  timeline?: ResearchTimelineEvent[] | undefined;
  attachments?: ResearchAttachment[] | undefined;
}

export interface ExpeditionGalleryItem {
  id: string;
  url: string;
  caption: string;
  credit?: string;
  creditUrl?: string;
  tag?: string;
}

export interface Expedition {
  id: string;
  name: string;
  region: Region;
  location: string;
  lat: number;
  lon: number;
  objective?: string;
  objectives?: string[];
  lead?: string;
  leadRole?: string;
  leadAvatar?: string;
  leadAvatarSourceUrl?: string;
  researchArea?: string;
  plainSummary?: string;
  leadAgency?: string;
  team?: number;
  members?: number;
  startDate?: string;
  endDate?: string;
  startYear?: number;
  endYear?: number | null;
  status: ExpeditionStatus;
  summary?: string;
  description?: string;
  stationRef?: string;
  imageUrl?: string;
  imageSourceUrl?: string;
  gallery?: ExpeditionGalleryItem[];
  telemetryStatus?: string;
  keyFindings?: string[];
}

export interface MediaAsset {
  id: string;
  title: string;
  type: MediaType;
  region: Region;
  topic: Topic;
  description: string;
  year: number;
  credit: string;
  creditUrl?: string;
  views: number;
  duration?: string | undefined;
  seed: number;
  imageUrl?: string | undefined;
  imageSourceUrl?: string | undefined;
  videoUrl?: string | undefined;
}

export interface EducationTopic {
  id: string;
  title: string;
  icon: string;
  simple: string;
  scientific: string;
  facts: string[];
  region: Region;
  topic: Topic;
  relatedResearchIds: string[];
  imageUrl?: string;
  imageSourceUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  category: "Announcement" | "Discovery" | "Expedition" | "Policy" | "Event";
  region: Region;
  seed?: number;
  imageUrl?: string;
  imageSourceUrl?: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "User" | "Researcher" | "Admin";
  status: "Active" | "Disabled";
  joined: string;
}

export type UserRole = ManagedUser["role"];
export type UserStatus = ManagedUser["status"];

export interface TimelinePeriod {
  id: string;
  label: string;
  range: [number, number];
  title: string;
  summary: string;
  imageUrl?: string;
  imageSourceUrl?: string;
  events: { year: number; text: string; imageUrl?: string }[];
}
