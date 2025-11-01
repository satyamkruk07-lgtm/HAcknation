import { Briefcase, Code, Coffee, Flag, GitFork, GraduationCap, HardHat, Megaphone, Mic, Milestone, Pizza, Presentation, Trophy, Users, Wrench } from 'lucide-react';
import type { Sponsor, Announcement, ScheduleEvent, Project, TeamMemberProfile, ProjectIdea } from './types';

export const sponsors: Sponsor[] = [
  { name: 'Innovate Inc.', icon: <Briefcase className="h-8 w-8 text-muted-foreground" /> },
  { name: 'CodeCrafters', icon: <Code className="h-8 w-8 text-muted-foreground" /> },
  { name: 'DevSolutions', icon: <GitFork className="h-8 w-8 text-muted-foreground" /> },
  { name: 'FutureForge', icon: <HardHat className="h-8 w-8 text-muted-foreground" /> },
  { name: 'NextGen EDU', icon: <GraduationCap className="h-8 w-8 text-muted-foreground" /> },
];

export const announcements: Announcement[] = [
  { id: 1, type: 'Info', time: '10 minutes ago', content: 'Welcome to HackTrack! Check-in is now open at the main hall.' },
  { id: 2, type: 'Update', time: '5 minutes ago', content: 'The "Intro to AI" workshop has been moved to Room 202.' },
  { id: 3, type: 'Info', time: 'Just now', content: 'Lunch is being served in the main cafeteria. Enjoy the pizza!' },
];

export const schedule: ScheduleEvent[] = [
  { id: 1, time: 'Day 1 - 09:00 AM', title: 'Opening Ceremony', description: 'Kick-off and welcome address.', type: 'milestone', icon: Flag },
  { id: 2, time: 'Day 1 - 10:00 AM', title: 'Hacking Begins', description: 'Let the innovation start!', type: 'milestone', icon: Code },
  { id: 3, time: 'Day 1 - 11:00 AM', title: 'Workshop: React State Management', description: 'By Jane Doe from Innovate Inc.', type: 'workshop', icon: Wrench },
  { id: 4, time: 'Day 1 - 01:00 PM', title: 'Lunch Break', description: 'Pizza and networking.', type: 'social', icon: Pizza },
  { id: 5, time: 'Day 1 - 03:00 PM', title: 'Talk: The Future of Web Dev', description: 'By John Smith from CodeCrafters.', type: 'talk', icon: Mic },
  { id: 6, time: 'Day 1 - 07:00 PM', title: 'Dinner', description: 'Refuel for a long night of coding.', type: 'social', icon: Coffee },
  { id: 7, time: 'Day 2 - 09:00 AM', title: 'Breakfast & Morning Updates', description: 'Start the day with coffee and announcements.', type: 'social', icon: Megaphone },
  { id: 8, time: 'Day 2 - 12:00 PM', title: 'Submission Deadline', description: 'All projects must be submitted.', type: 'milestone', icon: Milestone },
  { id: 9, time: 'Day 2 - 01:00 PM', title: 'Judging Begins', description: 'Present your projects to the judges.', type: 'milestone', icon: Presentation },
  { id: 10, time: 'Day 2 - 04:00 PM', title: 'Closing Ceremony & Awards', description: 'Announcing the winners of HackTrack!', type: 'milestone', icon: Trophy },
];

export const projects: Project[] = [
  { id: '1', name: 'EcoTrack', team: ['Alice', 'Bob'], description: 'A mobile app to track and reduce personal carbon footprint using gamification.', githubUrl: '#', demoUrl: '#' },
  { id: '2', name: 'HealthConnect', team: ['Charlie', 'Dana'], description: 'A platform connecting rural patients with urban doctors via telemedicine.', githubUrl: '#', demoUrl: '#' },
  { id: '3', name: 'LearnSphere', team: ['Eve', 'Frank'], description: 'An AI-powered personalized learning platform for students.', githubUrl: '#', demoUrl: '#' },
  { id: '4', name: 'SafeRoute', team: ['Grace', 'Heidi'], description: 'A navigation app that suggests safer routes for pedestrians based on crime data.', githubUrl: '#', demoUrl: '#' },
];

export const teamProfiles: TeamMemberProfile[] = [
  { id: 1, name: 'Alex', avatarUrl: 'https://picsum.photos/seed/avatar1/200/200', skills: ['React', 'Node.js', 'UI/UX'], bio: 'Frontend developer passionate about creating beautiful and intuitive user interfaces.', email: 'alex@example.com' },
  { id: 2, name: 'Brenda', avatarUrl: 'https://picsum.photos/seed/avatar2/200/200', skills: ['Python', 'Machine Learning', 'Data Science'], bio: 'Data scientist with a knack for finding stories in complex datasets.', email: 'brenda@example.com' },
  { id: 3, name: 'Carlos', avatarUrl: 'https://picsum.photos/seed/avatar3/200/200', skills: ['Java', 'Spring Boot', 'DevOps'], bio: 'Backend engineer who loves building robust and scalable systems.', email: 'carlos@example.com' },
  { id: 4, name: 'Diana', avatarUrl: 'https://picsum.photos/seed/avatar4/200/200', skills: ['Figma', 'User Research', 'Prototyping'], bio: 'UX designer focused on human-centered design principles.', email: 'diana@example.com' },
  { id: 5, name: 'Ethan', avatarUrl: 'https://picsum.photos/seed/avatar5/200/200', skills: ['Go', 'Kubernetes', 'Cloud'], bio: 'Cloud native enthusiast and DevOps specialist.', email: 'ethan@example.com' },
  { id: 6, name: 'Fiona', avatarUrl: 'https://picsum.photos/seed/avatar6/200/200', skills: ['Swift', 'iOS', 'Mobile Dev'], bio: 'Mobile developer crafting amazing experiences for iOS.', email: 'fiona@example.com' },
];

export const projectIdeas: ProjectIdea[] = [
    {
        title: "GreenThumb",
        description: "An app that helps users identify plants, diagnose plant diseases, and get care instructions using their phone's camera.",
        technologies: ["React Native", "Firebase", "Google Cloud Vision API", "Genkit"]
    },
    {
        title: "CommuniCare",
        description: "A platform for local communities to organize volunteer activities, from cleaning drives to helping the elderly.",
        technologies: ["Next.js", "Firestore", "Google Maps API", "Tailwind CSS"]
    },
    {
        title: "FitFlow",
        description: "An AI-powered yoga and fitness instructor that provides real-time feedback on your poses and form using your webcam.",
        technologies: ["TensorFlow.js", "Next.js", "WebRTC", "ShadCN UI"]
    },
    {
        title: "CodeCollab",
        description: "A real-time collaborative coding editor with integrated video chat and a shared terminal, built for pair programming.",
        technologies: ["React", "Firebase Realtime Database", "WebRTC", "Monaco Editor"]
    },
    {
        title: "StorySpark",
        description: "A creative writing assistant that uses generative AI to help overcome writer's block by suggesting plot points, characters, and dialogue.",
        technologies: ["Genkit", "Google AI", "Next.js", "TipTap Editor"]
    },
    {
        title: "BudgetBuddy",
        description: "A simple, intuitive budgeting app that uses Plaid to connect to bank accounts and automatically categorizes transactions.",
        technologies: ["Plaid API", "React", "Node.js", "PostgreSQL"]
    },
    {
        title: "EchoSafe",
        description: "A personal safety app that can be activated by a voice command to send alerts with your location to pre-selected contacts.",
        technologies: ["Web Speech API", "Geolocation API", "Twilio", "Firebase"]
    },
    {
        title: "LocalLens",
        description: "A travel app that helps you discover hidden gems and local experiences by creating personalized itineraries based on your interests.",
        technologies: ["Google Maps API", "Foursquare API", "Next.js", "Tailwind CSS"]
    },
    {
        title: "MindGarden",
        description: "A mental wellness app that combines guided meditations, journaling, and a mood tracker to help users cultivate mindfulness.",
        technologies: ["React Native", "Firestore", "D3.js", "Genkit"]
    },
    {
        title: "ConnectEd",
        description: "A peer-to-peer tutoring platform that connects students who need help with those who excel in specific subjects within a university.",
        technologies: ["Next.js", "Firebase", "Stripe Connect", "WebRTC"]
    }
];
