
import { Briefcase, Code, Coffee, Flag, GitFork, GraduationCap, HardHat, Megaphone, Mic, Milestone, Pizza, Presentation, Trophy, Users, Wrench, Database, Server, Cloud, Atom, FlaskConical, TestTube, BrainCircuit } from 'lucide-react';
import type { Sponsor, Project, ProjectIdea, ScheduleEvent, Conductor } from './types';

export const sponsors: Sponsor[] = [
  { name: 'Innovate Inc.', icon: <Briefcase /> },
  { name: 'CodeCrafters', icon: <Code /> },
  { name: 'DevSolutions', icon: <GitFork /> },
  { name: 'FutureForge', icon: <HardHat /> },
  { name: 'NextGen EDU', icon: <GraduationCap /> },
  { name: 'Data Dynamos', icon: <Database /> },
  { name: 'Server Systems', icon: <Server /> },
  { name: 'CloudNet', icon: <Cloud /> },
  { name: 'QuantumLeap', icon: <Atom /> },
  { name: 'TestWorks', icon: <TestTube /> },
  { name: 'AI Alchemists', icon: <BrainCircuit /> },
  { name: 'SynthLabs', icon: <FlaskConical /> },
];

export const schedule: ScheduleEvent[] = [
    { id: '1', time: 'Day 1 - 09:00 AM', title: 'Registration & Breakfast', description: 'Check-in, grab your swag, and fuel up for the day.', type: 'default', icon: Coffee },
    { id: '2', time: 'Day 1 - 10:00 AM', title: 'Opening Ceremony', description: 'Kick-off speeches and introduction to the hackathon theme.', type: 'milestone', icon: Milestone },
    { id: '3', time: 'Day 1 - 11:00 AM', title: 'Hacking Begins', description: 'Start your engines! Let the coding commence.', type: 'flag', icon: Flag },
    { id: '4', time: 'Day 1 - 01:00 PM', title: 'Lunch', description: 'Refuel and connect with fellow hackers.', type: 'social', icon: Pizza },
    { id: '5', time: 'Day 1 - 02:00 PM', title: 'Workshop: Intro to Genkit', description: 'Learn the basics of building AI-powered apps with Genkit.', type: 'workshop', icon: Wrench },
    { id: '6', time: 'Day 1 - 04:00 PM', title: 'Tech Talk: Scaling with Firebase', description: 'Discover how to build scalable applications with Firebase.', type: 'talk', icon: Mic },
    { id: '7', time: 'Day 1 - 07:00 PM', title: 'Dinner', description: 'Enjoy a delicious dinner on us.', type: 'social', icon: Pizza },
    { id: '10', time: 'Day 2 - 08:00 AM', title: 'Breakfast', description: 'Good morning! Time for the final push.', type: 'default', icon: Coffee },
    { id: '11', time: 'Day 2 - 11:00 AM', title: 'Hacking Ends', description: 'Pencils down! Submit your projects.', type: 'flag', icon: Flag },
    { id: '12', time: 'Day 2 - 11:30 AM', title: 'Project Expo & Judging', description: 'Showcase your project to judges and attendees.', type: 'presentation', icon: Presentation },
    { id: '13', time: 'Day 2 - 01:00 PM', title: 'Lunch', description: 'Celebrate your hard work with a final meal together.', type: 'social', icon: Pizza },
    { id: '14', time: 'Day 2 - 02:30 PM', title: 'Closing Ceremony & Awards', description: 'Announcing the winners and closing remarks.', type: 'milestone', icon: Trophy },
];


export const projects: Project[] = [
  { id: '1', name: 'EcoTrack', team: ['Alice', 'Bob'], description: 'A mobile app to track and reduce personal carbon footprint using gamification.', githubUrl: '#', demoUrl: '#' },
  { id: '2', name: 'HealthConnect', team: ['Charlie', 'Dana'], description: 'A platform connecting rural patients with urban doctors via telemedicine.', githubUrl: '#', demoUrl: '#' },
  { id: '3', name: 'LearnSphere', team: ['Eve', 'Frank'], description: 'An AI-powered personalized learning platform for students.', githubUrl: '#', demoUrl: '#' },
  { id: '4', name: 'SafeRoute', team: ['Grace', 'Heidi'], description: 'A navigation app that suggests safer routes for pedestrians based on crime data.', githubUrl: '#', demoUrl: '#' },
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
    },
    {
        title: "WasteNot",
        description: "A platform connecting restaurants with surplus food to NGOs and individuals in need, reducing food waste and hunger.",
        technologies: ["Flutter", "Firebase", "Google Maps API", "Stripe"]
    },
    {
        title: "Artify",
        description: "An AI-powered tool that transforms your photos into different art styles (e.g., Van Gogh, Picasso) using style transfer.",
        technologies: ["Python", "PyTorch", "Next.js", "Genkit"]
    },
    {
        title: "ElderLink",
        description: "A simple video-calling app with a clean UI, designed to help elderly individuals stay connected with their families.",
        technologies: ["WebRTC", "React", "Firebase", "Tailwind CSS"]
    },
    {
        title: "AR Navigator",
        description: "An augmented reality navigation app for large indoor venues like malls or airports, overlaying directions onto the real world.",
        technologies: ["ARCore/ARKit", "Unity/React Native", "Google Maps Indoor API"]
    },
    {
        title: "FakeNews Detector",
        description: "A browser extension that uses natural language processing (NLP) to analyze news articles and flag potential misinformation.",
        technologies: ["Python", "NLTK/SpaCy", "Browser Extension API", "Flask"]
    },
    {
        title: "Sign-to-Speech",
        description: "A mobile app that translates sign language gestures into spoken words in real-time using machine learning and computer vision.",
        technologies: ["TensorFlow Lite", "OpenCV", "Android/iOS", "Text-to-Speech API"]
    },
    {
        title: "AquaCheck",
        description: "A smart water monitoring system using IoT devices to test water quality in real-time and alert authorities about pollutants.",
        technologies: ["Arduino/Raspberry Pi", "MQTT", "Firebase", "React"]
    },
    {
        title: "VR Museum Tour",
        description: "A virtual reality experience that allows users to explore famous museums from around the world from the comfort of their homes.",
        technologies: ["Unity/Unreal Engine", "Oculus SDK", "3D Modeling", "Photogrammetry"]
    },
    {
        title: "CrowdSource Reporter",
        description: "A platform for citizen journalism where users can report local news and events, with a system for verifying information.",
        technologies: ["Next.js", "Firebase", "Geolocation API", "WebSockets"]
    },
    {
        title: "Gamer's Hub",
        description: "A social network for gamers to find teammates, schedule gaming sessions, and track their stats across different games.",
        technologies: ["Discord API", "Steam API", "React", "Node.js", "MongoDB"]
    },
    {
        title: "SmartPlanter",
        description: "An automated indoor gardening system that uses sensors to monitor soil moisture, light, and temperature, and waters plants automatically.",
        technologies: ["IoT", "Raspberry Pi", "Python", "Firebase", "Next.js"]
    },
    {
        title: "MusicMood",
        description: "An AI that creates personalized playlists based on your current mood, analyzed from your facial expression or text input.",
        technologies: ["Genkit", "Spotify API", "OpenCV.js", "React"]
    },
    {
        title: "TravelPal",
        description: "An all-in-one travel app that helps with itinerary planning, budget tracking, and real-time language translation.",
        technologies: ["Google Maps API", "Google Translate API", "Next.js", "Firebase"]
    },
    {
        title: "PantryChef",
        description: "An app that suggests recipes based on the ingredients you already have in your pantry, helping to reduce food waste.",
        technologies: ["React Native", "Spoonacular API", "Firebase"]
    },
    {
        title: "SkillSwap",
        description: "A platform where users can trade skills with each other (e.g., I'll teach you guitar if you teach me how to code).",
        technologies: ["Next.js", "Firebase", "WebRTC"]
    },
    {
        title: "ParkRight",
        description: "A smart parking solution that uses sensors and a mobile app to guide drivers to available parking spots in real-time.",
        technologies: ["IoT", "Flutter", "Firebase", "Google Maps"]
    },
    {
        title: "MedAlert",
        description: "A medication reminder app that also tracks adherence and can notify family members if a dose is missed.",
        technologies: ["React Native", "Firebase Firestore", "Push Notifications"]
    },
    {
        title: "CharityChain",
        description: "A transparent donation platform built on blockchain, allowing donors to track exactly how their contributions are used.",
        technologies: ["Solidity", "Ethereum", "Next.js", "IPFS"]
    },
    {
        title: "DreamScape",
        description: "An app that generates unique, beautiful artwork from a user's text descriptions using generative AI models like DALL-E or Midjourney.",
        technologies: ["Genkit", "Next.js", "Firebase Storage"]
    },
    {
        title: "CodeTutorAI",
        description: "An AI-powered coding tutor that provides hints, explains concepts, and debugs code for beginners.",
        technologies: ["Genkit", "Monaco Editor", "React", "Next.js"]
    },
    {
        title: "TheraBot",
        description: "A compassionate AI chatbot designed to provide a safe space for users to talk about their mental health and practice CBT techniques.",
        technologies: ["Genkit", "Next.js", "Firebase"]
    },
    {
        title: "EventHive",
        description: "A decentralized platform for event ticketing that eliminates scalping and fraud using NFTs for tickets.",
        technologies: ["Solidity", "IPFS", "Next.js", "Thirdweb"]
    },
    {
        title: "LegalEase",
        description: "An AI tool that simplifies complex legal documents (like terms of service) into plain, easy-to-understand language.",
        technologies: ["Genkit", "Next.js", "PDF.js"]
    },
    {
        title: "DriveSafe",
        description: "A mobile app that monitors driving behavior using phone sensors and provides feedback to encourage safer driving habits.",
        technologies: ["React Native", "Core Motion/SensorManager", "Firebase"]
    },
    {
        title: "StudyBuddy",
        description: "A platform that uses AI to create flashcards, summaries, and quizzes from a user's uploaded lecture notes or textbooks.",
        technologies: ["Genkit", "OCR (Tesseract.js)", "Next.js", "Firebase"]
    },
    {
        title: "TradeUp",
        description: "A local bartering platform where users can trade items and services without using money.",
        technologies: ["React Native", "Firebase", "Geolocation"]
    },
    {
        title: "InterviewPro",
        description: "An AI-powered mock interview simulator that asks you questions and provides feedback on your answers and body language.",
        technologies: ["Genkit", "WebRTC", "OpenCV.js", "Next.js"]
    },
    {
        title: "AllergyAlert",
        description: "A mobile app that lets you scan food barcodes to instantly check if the product contains any of your specified allergens.",
        technologies: ["React Native", "OpenFoodFacts API", "Barcode Scanner"]
    },
    {
        title: "HomeSecure",
        description: "A DIY home security system using Raspberry Pis, webcams, and motion sensors that sends alerts to your phone.",
        technologies: ["Python", "Raspberry Pi", "OpenCV", "Firebase Cloud Messaging"]
    },
    {
        title: "RecycleRight",
        description: "An app that uses image recognition to tell you whether an item is recyclable and how to dispose of it properly in your local area.",
        technologies: ["TensorFlow.js", "Next.js", "Geolocation API"]
    },
    {
        title: "CultureConnect",
        description: "A language exchange platform that connects you with native speakers for conversation practice via video chat.",
        technologies: ["WebRTC", "Next.js", "Firebase", "Socket.io"]
    },
    {
        title: "NoiseReducer",
        description: "An AI-powered desktop app that removes background noise from your microphone in real-time during calls or recordings.",
        technologies: ["Python", "Krisp/NVIDIA Maxine SDK", "Electron"]
    },
    {
        title: "BookWorm",
        description: "A social platform for book lovers to track their reading, write reviews, and get personalized recommendations from an AI.",
        technologies: ["Genkit", "Google Books API", "Next.js", "Firebase"]
    },
    {
        title: "PetAdopter",
        description: "A platform that aggregates pet adoption listings from various local shelters into one searchable interface.",
        technologies: ["React", "Node.js", "Web Scraping (Beautiful Soup/Puppeteer)", "Firebase"]
    },
    {
        title: "AccessibilityChecker",
        description: "A web tool that automatically scans websites and reports accessibility issues (WCAG compliance) to help developers make sites more inclusive.",
        technologies: ["Axe-core", "Puppeteer", "Next.js"]
    },
    {
        title: "Workout-DJ",
        description: "An app that creates high-energy music playlists that match the tempo of your run or workout in real-time.",
        technologies: ["Spotify API", "React Native", "Accelerometer"]
    },
    {
        title: "DeepFake-Detector",
        description: "An AI tool that analyzes videos to detect signs of deepfake manipulation, helping to combat misinformation.",
        technologies: ["Python", "TensorFlow/PyTorch", "OpenCV", "Flask"]
    },
    {
        title: "Smart-Home-Dash",
        description: "A universal dashboard to control all your smart home devices (lights, thermostat, etc.) from different brands in one place.",
        technologies: ["Home Assistant API", "Next.js", "WebSockets"]
    },
    {
        title: "Finance-for-Teens",
        description: "An educational app that teaches teenagers about personal finance and investing through interactive games and simulations.",
        technologies: ["Flutter/React Native", "Firebase", "Lottie"]
    },
    {
        title: "Poll-Everywhere-Clone",
        description: "A real-time polling tool for presentations and classrooms, where the audience can respond via their phones and see live results.",
        technologies: ["WebSockets", "React", "Chart.js", "Firebase"]
    }
];

export const conductors: Conductor[] = [
    {
        id: "1",
        name: "Mr. Kumar Satyam",
        role: "Student",
        imageUrl: "https://images.unsplash.com/photo-1627328950087-ce4ed2b5896a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8bW91bnRhaW4lMjBib3l8ZW58MHx8fHwxNzYyMTg5NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        email: "devesh.kumar@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/dr-devesh-kumar-0a849725/",
        qualification: "Ph.D. in Computer Science",
        skills: ["Machine Learning", "Data Science", "AI", "Python"]
    },
    {
        id: "2",
        name: "Ms. Kalyani Kumari",
        role: "Student",
        imageUrl: "https://images.unsplash.com/photo-1610916113640-d6332ff87ddf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8bW91bnRhaW4lMjBnaXJsfGVufDB8fHx8MTc2MjE4OTM3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        email: "satyam.kumar@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/satyam-kumar-87913b168/",
        qualification: "M.Tech in CSE",
        skills: ["Web Development", "React", "Node.js", "Firebase"]
    },
    {
        id: "3",
        name: "Mr. Sartaj Khan",
        role: "Head of Department",
        imageUrl: `https://picsum.photos/seed/3/128/128`,
        email: "kalyani.kumari@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/kalyani-kumari-b97280249/",
        qualification: "B.Tech in CSE",
        skills: ["Event Management", "Public Speaking", "Canva", "Photoshop"]
    },
    {
        id: "4",
        name: "Mr. Paramjeet Singh",
        role: "Faculty",
        imageUrl: `https://picsum.photos/seed/4/128/128`,
        email: "manas.kumar@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/manas-kumar-87913b168/",
        qualification: "B.Tech in CSE",
        skills: ["Competitive Programming", "Java", "C++", "DSA"]
    },
    {
        id: "5",
        name: "Mr. Akshat Sharma",
        role: "Faculty",
        imageUrl: `https://picsum.photos/seed/5/128/128`,
        email: "rakhi@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/rakhi-/",
        qualification: "MBA in Marketing",
        skills: ["Digital Marketing", "SEO", "Content Writing", "Social Media"]
    }
];

    





    



    

    

    