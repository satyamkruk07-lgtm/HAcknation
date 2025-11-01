import type { LucideIcon } from "lucide-react";

export type Sponsor = {
  name: string;
  icon: React.ReactElement;
};

export type Announcement = {
  id: number;
  type: "Update" | "Info";
  time: string;
  content: string;
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

export type TeamMemberProfile = {
  id: number;
  name: string;
  avatarUrl: string;
  skills: string[];
  bio: string;
  email: string;
};

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
