
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
  demoUrl: string;
};

export type SubmittedProject = {
  id: string;
  name:string;
  teamName?: string;
  studentNames?: string[];
  teamMembers?: string[]; // Add optional teamMembers
  description: string;
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
  registrationType?: 'individual' | 'team';
  teamName?: string;
  teamMembers?: string[];
  mentorName?: string;
  department?: string;
  leaderName?: string;
  plan?: 'with-kit' | 'without-kit';
};

export type ProjectIdea = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
};

export type Conductor = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  email: string;
  linkedin: string;
  qualification: string;
  skills: string[];
};

export type Judgment = {
    id: string;
    projectId: string;
    judgeId: string;
    judgeName: string;
    scores: Record<string, number>;
    totalScore: number;
    feedback: string;
    submittedAt: Timestamp;
};

export type PreviousParticipant = {
  id: string;
  name: string;
  college: string;
  project: string;
  imageUrl: string;
  imageHint: string;
};
