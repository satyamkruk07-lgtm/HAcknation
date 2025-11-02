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
  id: number;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  type: 'workshop' | 'talk' | 'milestone' | 'social';
  icon: LucideIcon;
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
  studentNames: string[];
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
  college?: string;
  skills?: string[];
  bio?: string;
  photoURL?: string;
  profileBannerUrl?: string;
};

export type ProjectIdea = {
  title: string;
  description: string;
  technologies: string[];
};

    