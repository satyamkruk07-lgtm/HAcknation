import type { LucideIcon } from "lucide-react";
import type { Timestamp } from 'firebase/firestore';

export type Sponsor = {
  name: string;
  icon: React.ReactElement;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: "Update" | "Info";
  timestamp: Timestamp;
};

export type ScheduleEvent = {
  id: string; // Changed from number to string for Firestore IDs
  time: string;
  sortTime: string; // For chronological sorting, e.g., "day1-0900", "day1-1300"
  title: string;
  description: string;
  speaker?: string;
  // The 'type' and 'icon' properties might be deprecated if not used in Firestore model
  type?: 'workshop' | 'talk' | 'milestone' | 'social' | 'default' | 'flag' | 'code' | 'coffee' | 'megaphone' | 'presentation' | 'trophy' ;
  icon?: LucideIcon;
};

export type Project = {
  id: string;
  name: string;
  team: string[];
  description: string;
  githubUrl: string;
  demoUrl: string;
};

export type SubmittedProject = {
  id: string;
  name: string;
  studentNames?: string[];
  teamMembers?: string[]; // Add optional teamMembers
  description: string;
  githubUrl: string;
  demoUrl: string;
  submittedBy: string;
  submissionDate: Timestamp;
}

export type UserAccount = {
  id: string;
  email: string;
  name:string;
  registrationDate: string;
  emailVerified?: boolean;
  college?: string;
  skills?: string[];
  bio?: string;
  photoURL?: string;
  profileBannerUrl?: string;
  phoneNumber?: string;
};

export type ProjectIdea = {
  title: string;
  description: string;
  technologies: string[];
};
