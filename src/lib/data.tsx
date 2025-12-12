import { Briefcase, Code, Coffee, Flag, GitFork, GraduationCap, HardHat, Megaphone, Mic, Milestone, Pizza, Presentation, Trophy, Users, Wrench, Database, Server, Cloud, Atom, FlaskConical, TestTube, BrainCircuit } from 'lucide-react';
import type { Sponsor, Project, ProjectIdea, ScheduleEvent, Conductor } from './types';
import { PlaceHolderImages } from './placeholder-images';

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
    { id: '1', time: 'Day 1 - 09:00 AM', sortTime: 'day1-0900', title: 'Registration & Breakfast', description: 'Check-in, grab your swag, and fuel up for the day.', type: 'default', icon: Coffee },
    { id: '2', time: 'Day 1 - 10:00 AM', sortTime: 'day1-1000', title: 'Opening Ceremony', description: 'Kick-off speeches and introduction to the hackathon theme.', type: 'milestone', icon: Milestone },
    { id: '3', time: 'Day 1 - 11:00 AM', sortTime: 'day1-1100', title: 'Hacking Begins', description: 'Start your engines! Let the coding commence.', type: 'flag', icon: Flag },
    { id: '4', time: 'Day 1 - 01:00 PM', sortTime: 'day1-1300', title: 'Lunch', description: 'Refuel and connect with fellow hackers.', type: 'social', icon: Pizza },
    { id: '5', time: 'Day 1 - 02:00 PM', sortTime: 'day1-1400', title: 'Workshop: Intro to Genkit', description: 'Learn the basics of building AI-powered apps with Genkit.', type: 'workshop', icon: Wrench },
    { id: '6', time: 'Day 1 - 04:00 PM', sortTime: 'day1-1600', title: 'Tech Talk: Scaling with Firebase', description: 'Discover how to build scalable applications with Firebase.', type: 'talk', icon: Mic },
    { id: '7', time: 'Day 1 - 07:00 PM', sortTime: 'day1-1900', title: 'Dinner', description: 'Enjoy a delicious dinner on us.', type: 'social', icon: Pizza },
    { id: '10', time: 'Day 2 - 08:00 AM', sortTime: 'day2-0800', title: 'Breakfast', description: 'Good morning! Time for the final push.', type: 'default', icon: Coffee },
    { id: '11', time: 'Day 2 - 11:00 AM', sortTime: 'day2-1100', title: 'Hacking Ends', description: 'Pencils down! Submit your projects.', type: 'flag', icon: Flag },
    { id: '12', time: 'Day 2 - 11:30 AM', sortTime: 'day2-1130', title: 'Project Expo & Judging', description: 'Showcase your project to judges and attendees.', type: 'presentation', icon: Presentation },
    { id: '13', time: 'Day 2 - 01:00 PM', sortTime: 'day2-1300', title: 'Lunch', description: 'Celebrate your hard work with a final meal together.', type: 'social', icon: Pizza },
    { id: '14', time: 'Day 2 - 02:30 PM', sortTime: 'day2-1430', title: 'Closing Ceremony & Awards', description: 'Announcing the winners and closing remarks.', type: 'milestone', icon: Trophy },
];


export const projects: Project[] = [
  { id: '1', name: 'EcoTrack', team: ['Alice', 'Bob'], description: 'A mobile app to track and reduce personal carbon footprint using gamification.', githubUrl: '#', demoUrl: '#' },
  { id: '2', name: 'HealthConnect', team: ['Charlie', 'Dana'], description: 'A platform connecting rural patients with urban doctors via telemedicine.', githubUrl: '#', demoUrl: '#' },
  { id: '3', name: 'LearnSphere', team: ['Eve', 'Frank'], description: 'An AI-powered personalized learning platform for students.', githubUrl: '#', demoUrl: '#' },
  { id: '4', name: 'SafeRoute', team: ['Grace', 'Heidi'], description: 'A navigation app that suggests safer routes for pedestrians based on crime data.', githubUrl: '#', demoUrl: '#' },
];

export const projectIdeas: ProjectIdea[] = [
    {
        id: "idea-1",
        title: "GreenThumb",
        description: "An app that helps users identify plants, diagnose plant diseases, and get care instructions using their phone's camera.",
        technologies: ["React Native", "Firebase", "Google Cloud Vision API", "Genkit"]
    },
    {
        id: "idea-2",
        title: "CommuniCare",
        description: "A platform for local communities to organize volunteer activities, from cleaning drives to helping the elderly.",
        technologies: ["Next.js", "Firestore", "Google Maps API", "Tailwind CSS"]
    },
    {
        id: "idea-3",
        title: "FitFlow",
        description: "An AI-powered yoga and fitness instructor that provides real-time feedback on your poses and form using your webcam.",
        technologies: ["TensorFlow.js", "Next.js", "WebRTC", "ShadCN UI"]
    },
    {
        id: "idea-4",
        title: "CodeCollab",
        description: "A real-time collaborative coding editor with integrated video chat and a shared terminal, built for pair programming.",
        technologies: ["React", "Firebase Realtime Database", "WebRTC", "Monaco Editor"]
    },
    {
        id: "idea-5",
        title: "StorySpark",
        description: "A creative writing assistant that uses generative AI to help overcome writer's block by suggesting plot points, characters, and dialogue.",
        technologies: ["Genkit", "Google AI", "Next.js", "TipTap Editor"]
    },
    {
        id: "idea-6",
        title: "BudgetBuddy",
        description: "A simple, intuitive budgeting app that uses Plaid to connect to bank accounts and automatically categorizes transactions.",
        technologies: ["Plaid API", "React", "Node.js", "PostgreSQL"]
    },
    {
        id: "idea-7",
        title: "EchoSafe",
        description: "A personal safety app that can be activated by a voice command to send alerts with your location to pre-selected contacts.",
        technologies: ["Web Speech API", "Geolocation API", "Twilio", "Firebase"]
    },
    {
        id: "idea-8",
        title: "LocalLens",
        description: "A travel app that helps you discover hidden gems and local experiences by creating personalized itineraries based on your interests.",
        technologies: ["Google Maps API", "Foursquare API", "Next.js", "Tailwind CSS"]
    },
    {
        id: "idea-9",
        title: "MindGarden",
        description: "A mental wellness app that combines guided meditations, journaling, and a mood tracker to help users cultivate mindfulness.",
        technologies: ["React Native", "Firestore", "D3.js", "Genkit"]
    },
    {
        id: "idea-10",
        title: "ConnectEd",
        description: "A peer-to-peer tutoring platform that connects students who need help with those who excel in specific subjects within a university.",
        technologies: ["Next.js", "Firebase", "Stripe Connect", "WebRTC"]
    },
    {
        id: "idea-11",
        title: "WasteNot",
        description: "A platform connecting restaurants with surplus food to NGOs and individuals in need, reducing food waste and hunger.",
        technologies: ["Flutter", "Firebase", "Google Maps API", "Stripe"]
    },
    {
        id: "idea-12",
        title: "Artify",
        description: "An AI-powered tool that transforms your photos into different art styles (e.g., Van Gogh, Picasso) using style transfer.",
        technologies: ["Python", "PyTorch", "Next.js", "Genkit"]
    },
    {
        id: "idea-13",
        title: "ElderLink",
        description: "A simple video-calling app with a clean UI, designed to help elderly individuals stay connected with their families.",
        technologies: ["WebRTC", "React", "Firebase", "Tailwind CSS"]
    },
    {
        id: "idea-14",
        title: "AR Navigator",
        description: "An augmented reality navigation app for large indoor venues like malls or airports, overlaying directions onto the real world.",
        technologies: ["ARCore/ARKit", "Unity/React Native", "Google Maps Indoor API"]
    },
    {
        id: "idea-15",
        title: "FakeNews Detector",
        description: "A browser extension that uses natural language processing (NLP) to analyze news articles and flag potential misinformation.",
        technologies: ["Python", "NLTK/SpaCy", "Browser Extension API", "Flask"]
    },
    {
        id: "idea-16",
        title: "Sign-to-Speech",
        description: "A mobile app that translates sign language gestures into spoken words in real-time using machine learning and computer vision.",
        technologies: ["TensorFlow Lite", "OpenCV", "Android/iOS", "Text-to-Speech API"]
    },
    {
        id: "idea-17",
        title: "AquaCheck",
        description: "A smart water monitoring system using IoT devices to test water quality in real-time and alert authorities about pollutants.",
        technologies: ["Arduino/Raspberry Pi", "MQTT", "Firebase", "React"]
    },
    {
        id: "idea-18",
        title: "VR Museum Tour",
        description: "A virtual reality experience that allows users to explore famous museums from around the world from the comfort of their homes.",
        technologies: ["Unity/Unreal Engine", "Oculus SDK", "3D Modeling", "Photogrammetry"]
    },
    {
        id: "idea-19",
        title: "CrowdSource Reporter",
        description: "A platform for citizen journalism where users can report local news and events, with a system for verifying information.",
        technologies: ["Next.js", "Firebase", "Geolocation API", "WebSockets"]
    },
    {
        id: "idea-20",
        title: "Gamer's Hub",
        description: "A social network for gamers to find teammates, schedule gaming sessions, and track their stats across different games.",
        technologies: ["Discord API", "Steam API", "React", "Node.js", "MongoDB"]
    },
    {
        id: "idea-21",
        title: "SmartPlanter",
        description: "An automated indoor gardening system that uses sensors to monitor soil moisture, light, and temperature, and waters plants automatically.",
        technologies: ["IoT", "Raspberry Pi", "Python", "Firebase", "Next.js"]
    },
    {
        id: "idea-22",
        title: "MusicMood",
        description: "An AI that creates personalized playlists based on your current mood, analyzed from your facial expression or text input.",
        technologies: ["Genkit", "Spotify API", "OpenCV.js", "React"]
    },
    {
        id: "idea-23",
        title: "TravelPal",
        description: "An all-in-one travel app that helps with itinerary planning, budget tracking, and real-time language translation.",
        technologies: ["Google Maps API", "Google Translate API", "Next.js", "Firebase"]
    },
    {
        id: "idea-24",
        title: "PantryChef",
        description: "An app that suggests recipes based on the ingredients you already have in your pantry, helping to reduce food waste.",
        technologies: ["React Native", "Spoonacular API", "Firebase"]
    },
    {
        id: "idea-25",
        title: "SkillSwap",
        description: "A platform where users can trade skills with each other (e.g., I'll teach you guitar if you teach me how to code).",
        technologies: ["Next.js", "Firebase", "WebRTC"]
    },
    {
        id: "idea-26",
        title: "ParkRight",
        description: "A smart parking solution that uses sensors and a mobile app to guide drivers to available parking spots in real-time.",
        technologies: ["IoT", "Flutter", "Firebase", "Google Maps"]
    },
    {
        id: "idea-27",
        title: "MedAlert",
        description: "A medication reminder app that also tracks adherence and can notify family members if a dose is missed.",
        technologies: ["React Native", "Firebase Firestore", "Push Notifications"]
    },
    {
        id: "idea-28",
        title: "CharityChain",
        description: "A transparent donation platform built on blockchain, allowing donors to track exactly how their contributions are used.",
        technologies: ["Solidity", "Ethereum", "Next.js", "IPFS"]
    },
    {
        id: "idea-29",
        title: "DreamScape",
        description: "An app that generates unique, beautiful artwork from a user's text descriptions using generative AI models like DALL-E or Midjourney.",
        technologies: ["Genkit", "Next.js", "Firebase Storage"]
    },
    {
        id: "idea-30",
        title: "CodeTutorAI",
        description: "An AI-powered coding tutor that provides hints, explains concepts, and debugs code for beginners.",
        technologies: ["Genkit", "Monaco Editor", "React", "Next.js"]
    },
    {
        id: "idea-31",
        title: "TheraBot",
        description: "A compassionate AI chatbot designed to provide a safe space for users to talk about their mental health and practice CBT techniques.",
        technologies: ["Genkit", "Next.js", "Firebase"]
    },
    {
        id: "idea-32",
        title: "EventHive",
        description: "A decentralized platform for event ticketing that eliminates scalping and fraud using NFTs for tickets.",
        technologies: ["Solidity", "IPFS", "Next.js", "Thirdweb"]
    },
    {
        id: "idea-33",
        title: "LegalEase",
        description: "An AI tool that simplifies complex legal documents (like terms of service) into plain, easy-to-understand language.",
        technologies: ["Genkit", "Next.js", "PDF.js"]
    },
    {
        id: "idea-34",
        title: "DriveSafe",
        description: "A mobile app that monitors driving behavior using phone sensors and provides feedback to encourage safer driving habits.",
        technologies: ["React Native", "Core Motion/SensorManager", "Firebase"]
    },
    {
        id: "idea-35",
        title: "StudyBuddy",
        description: "A platform that uses AI to create flashcards, summaries, and quizzes from a user's uploaded lecture notes or textbooks.",
        technologies: ["Genkit", "OCR (Tesseract.js)", "Next.js", "Firebase"]
    },
    {
        id: "idea-36",
        title: "TradeUp",
        description: "A local bartering platform where users can trade items and services without using money.",
        technologies: ["React Native", "Firebase", "Geolocation"]
    },
    {
        id: "idea-37",
        title: "InterviewPro",
        description: "An AI-powered mock interview simulator that asks you questions and provides feedback on your answers and body language.",
        technologies: ["Genkit", "WebRTC", "OpenCV.js", "Next.js"]
    },
    {
        id: "idea-38",
        title: "AllergyAlert",
        description: "A mobile app that lets you scan food barcodes to instantly check if the product contains any of your specified allergens.",
        technologies: ["React Native", "OpenFoodFacts API", "Barcode Scanner"]
    },
    {
        id: "idea-39",
        title: "HomeSecure",
        description: "A DIY home security system using Raspberry Pis, webcams, and motion sensors that sends alerts to your phone.",
        technologies: ["Python", "Raspberry Pi", "OpenCV", "Firebase Cloud Messaging"]
    },
    {
        id: "idea-40",
        title: "RecycleRight",
        description: "An app that uses image recognition to tell you whether an item is recyclable and how to dispose of it properly in your local area.",
        technologies: ["TensorFlow.js", "Next.js", "Geolocation API"]
    },
    {
        id: "idea-41",
        title: "CultureConnect",
        description: "A language exchange platform that connects you with native speakers for conversation practice via video chat.",
        technologies: ["WebRTC", "Next.js", "Firebase", "Socket.io"]
    },
    {
        id: "idea-42",
        title: "NoiseReducer",
        description: "An AI-powered desktop app that removes background noise from your microphone in real-time during calls or recordings.",
        technologies: ["Python", "Krisp/NVIDIA Maxine SDK", "Electron"]
    },
    {
        id: "idea-43",
        title: "BookWorm",
        description: "A social platform for book lovers to track their reading, write reviews, and get personalized recommendations from an AI.",
        technologies: ["Genkit", "Google Books API", "Next.js", "Firebase"]
    },
    {
        id: "idea-44",
        title: "PetAdopter",
        description: "A platform that aggregates pet adoption listings from various local shelters into one searchable interface.",
        technologies: ["React", "Node.js", "Web Scraping (Beautiful Soup/Puppeteer)", "Firebase"]
    },
    {
        id: "idea-45",
        title: "AccessibilityChecker",
        description: "A web tool that automatically scans websites and reports accessibility issues (WCAG compliance) to help developers make sites more inclusive.",
        technologies: ["Axe-core", "Puppeteer", "Next.js"]
    },
    {
        id: "idea-46",
        title: "Workout-DJ",
        description: "An app that creates high-energy music playlists that match the tempo of your run or workout in real-time.",
        technologies: ["Spotify API", "React Native", "Accelerometer"]
    },
    {
        id: "idea-47",
        title: "DeepFake-Detector",
        description: "An AI tool that analyzes videos to detect signs of deepfake manipulation, helping to combat misinformation.",
        technologies: ["Python", "TensorFlow/PyTorch", "OpenCV", "Flask"]
    },
    {
        id: "idea-48",
        title: "Smart-Home-Dash",
        description: "A universal dashboard to control all your smart home devices (lights, thermostat, etc.) from different brands in one place.",
        technologies: ["Home Assistant API", "Next.js", "WebSockets"]
    },
    {
        id: "idea-49",
        title: "Finance-for-Teens",
        description: "An educational app that teaches teenagers about personal finance and investing through interactive games and simulations.",
        technologies: ["Flutter/React Native", "Firebase", "Lottie"]
    },
    {
        id: "idea-50",
        title: "Poll-Everywhere-Clone",
        description: "A real-time polling tool for presentations and classrooms, where the audience can respond via their phones and see live results.",
        technologies: ["WebSockets", "React", "Chart.js", "Firebase"]
    }
];

export const conductors: Conductor[] = [
    {
        id: "1",
        name: "Mr. Kumar Satyam",
        role: "Website Head",
        imageUrl: PlaceHolderImages.find(p => p.id === 'conductor-satyam')?.imageUrl || `https://picsum.photos/seed/1/128/128`,
        email: "satyamkruk07@gmail.com",
        linkedin: "https://www.linkedin.com/in/kumar-satyam-055841394",
        qualification: "BCA",
        skills: ["Python", "C"],
        phone: "+917060550243"
    },
    {
        id: "3",
        name: "Mr. Sartaj Khan",
        role: "Head Of Department",
        imageUrl: PlaceHolderImages.find(p => p.id === 'conductor-sartaj')?.imageUrl || `https://picsum.photos/seed/3/128/128`,
        email: "sartaj.khan@sce.org.in",
        linkedin: "https://www.linkedin.com/in/sartaj-khan-52149724b",
        qualification: "Head of BCA Department",
        skills: ["Event Management", "Public Speaking", "Canva", "Photoshop"],
        phone: "+919760017416"
    },
    {
        id: "4",
        name: "Mr. Paramjeet Singh",
        role: "Faculty",
        imageUrl: PlaceHolderImages.find(p => p.id === 'conductor-paramjeet')?.imageUrl || `https://picsum.photos/seed/4/128/128`,
        email: "manas.kumar@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/paramjeetsingh22",
        qualification: "M.Tech in CSE",
        skills: ["Competitive Programming", "Java", "C++", "DSA"],
        phone: "+918923859863"
    },
    {
        id: "5",
        name: "Mr. Ajay Kumar Verma",
        role: "Associate Dean-CBII & CEO, iHub Shivalik",
        imageUrl: "https://images.unsplash.com/photo-1765528447514-b85fbdd0e43d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        email: "rakhi@shivalikcollege.eduin",
        linkedin: "https://www.linkedin.com/in/ajay-verma-5b825668",
        qualification: "Mr. Verma specializes in Bearing Fault Diagnosis, Mechanics of Machines, Tribology, and Mechanical Vibrations. His prolific contributions to research include 17+ publications in esteemed journals and conferences, along with his role as a Principal Investigator in government-funded research projects. His expertise is widely recognized, serving as a reviewer for top-tier journals and conferences",
        skills: ["Digital Marketing", "SEO", "Content Writing", "Social Media"],
        phone: "+91 7355128710"
    },
    {
        id: "6",
        name: "Mr. Kshitij Jain",
        role: "Assistant Professor",
        imageUrl: "https://images.unsplash.com/photo-1765519817953-8f4206a73b70?q=80&w=738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        email: "kshitij.jain@shivalikcollege.edu.in",
        linkedin: "https://www.linkedin.com/in/kshitij-jain-531029109",
        qualification: "UG B.TECH ,PG M.TECH , PHD Pursuing",
        skills: ["Cloud Computing", "AWS", "DevOps", "Docker"],
        phone: "+918375052135"
    }
];

    





    



    

    

    




    



    

    

    

    

    



    

    

    




    






















