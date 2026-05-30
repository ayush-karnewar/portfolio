const projects = {
    heading: `Major Projects`,
    list: [
        {
            image: '/assets/Screenshot 2026-05-30 114013.png',
            label: 'Featured Project',
            title: 'HotSpot.ai – AI-Powered Infrastructure Damage Detection',
            description: 'A civic-tech platform using AI and Computer Vision to detect infrastructure damage — potholes, road cracks, building cracks, bridge defects, and pipeline leaks. Citizens report damage via photo uploads; officials manage reports through a centralized dashboard. Uses YOLOv8, OpenCV, and predictive analytics to assess severity, estimate repair costs, detect fraud, and prioritize maintenance. Features live mapping, automated repair planning, transparency dashboards, and citizen gamification.',
            
            techs: ['React', 'Vite', 'FastAPI', 'YOLOv8', 'OpenCV', 'Leaflet', 'Tailwind CSS', 'JWT']
        },
        {
            image: '/assets/image.png',
            label: 'Featured Project',
            title: 'IDiot – AI-Powered IoT Circuit Simulator',
            description: 'Canvas-based IoT workspace with drag-drop components, real-time simulation, AI-generated layouts, and Arduino code export. Built to make IoT prototyping accessible and intelligent.',
            link: 'https://idiot-iot.vercel.app',
            github: 'https://github.com/Copper369/IDiot',
            techs: ['React.js', 'Canvas WS', 'AI Layout Generation', 'Arduino', 'IoT']
        },
        {
            image: '/assets/Screenshot 2026-04-14 210645.png',
            label: 'Featured Project',
            link: 'https://ved-researchhub.vercel.app',
            github: 'https://github.com/Copper369/ResearchHub',
            title: 'ResearchHub AI',
            description: 'An AI-powered research paper management platform that helps researchers discover, organize, and analyze academic papers efficiently. Features intelligent paper search, workspace-based organization, and an AI chatbot that provides contextual summaries and insights from multiple research documents, significantly reducing literature review time.',
            techs: ['Python', 'AI/ML', 'NLP', 'RAG System']
        },
        {
            image: '/assets/drishyamitra.png',
            label: 'Featured Project',
            title: 'Drishyamitra',
            description: 'An AI-powered smart photo management system that automatically organizes and retrieves images using facial recognition and natural language interaction. It detects and groups people across photos, creates intelligent albums, and allows users to search or share memories through conversational commands, making large photo collections easy to manage.',
            link: 'https://laughing-waddle-snowy.vercel.app',
            github: 'https://github.com/Copper369/Drishyamitra',
            techs: ['Flask', 'React.js', 'Computer Vision', 'DeepFace', 'Natural Language Processing']
        },
        {
            image: '/assets/projects/digitalplattform.png',
            label: 'Featured Project',
            title: 'DUSTIN - Mental Health Dr.',
            description: 'An AI-powered RAG-based, voice-enabled mental health support system designed to provide continuous, accessible, and emotionally safe assistance for children and young adults.',
            github: 'https://github.com/Copper369/DUSTIN',
            techs: ['Python', 'RAG System', 'Voice AI', 'Mental Health AI']
        },
        {
            image: '/assets/projects/rolazdoro.png',
            label: 'Featured Project',
            title: 'StudyHub',
            description: 'A centralized academic resource platform where students can access notes, study materials, and exam resources in one place. Integrated with Razorpay for secure payments, allowing controlled distribution of premium study content while simplifying access for students.',
            link: 'https://studyhub-vercel.vercel.app',
            github: 'https://github.com/Copper369/StudyHub',
            techs: ['React Js', 'Node.js', 'Razorpay API', 'MongoDB']
        },
        {
            image: '/assets/projects/declinica.png',
            label: 'Featured Project',
            title: 'Prakriti',
            description: 'A sustainability-focused waste management system designed for institutions to encourage proper waste segregation. Tracks student participation through a performance dashboard and assigns a Prakriti Score. Uses AI image analysis to identify waste types and promote responsible disposal practices.',
            github: 'https://github.com/Copper369/Prakriti',
            techs: ['Python', 'Computer Vision', 'AI Image Analysis', 'Dashboard']
        },
        {
            image: '/assets/projects/chainracers.png',
            label: 'Featured Project',
            title: 'Sudama- Knowledge-Driven AI Chatbot',
            description: 'Built Sudama, an AI chatbot trained on the Shiv Purana with domain-specific learning creating a persona, designed to provide contextual answers and meaningful spiritual insights.',
            github: 'https://github.com/Copper369/Sudama',
            techs: ['Python', 'NLP', 'RAG System', 'Chatbot Development']
        },
    ],
    miniProjects: {
        heading: 'Hobby Projects',
        list: [
                        {
                title: 'ICRTET 2026',
                subtitle: 'Conference Website',
                description: 'International conference management with live updates and submission tracking',
                image: '/assets/icrtet.png',
                link: 'https://dypcet.in/ICRTET-2026',
            },
            
            {
                title: 'Court Piece Game',
                subtitle: 'Multiplayer Game',
                description: 'A real-time multiplayer implementation of the Indian card game "Mendhi" with stunning UI.',
                image: '/assets/cards.jpg',
                link: 'https://mendhikot-io.vercel.app/',
            },
            {
                title: 'Medical Management App',
                subtitle: 'MERN Stack',
                description: 'Full-stack medical management system with appointment booking, sold to local doctor',
                image: '/assets/medicalapp.png',
            },
            {
                title: 'Crowd Density Analyzer',
                subtitle: 'AI Safety System',
                description: 'Real-time visual analysis for crowd density estimation and safety monitoring',
                image: '/assets/crowd.png',
            },
            {
                title: 'SenseAI',
                subtitle: 'Image to Text AI',
                description: 'Real-time AI converting images to text with interactive chat-based understanding',
                image: '/assets/Senseai.png',
            },
            {
                title: 'Planet PDF',
                subtitle: 'Smart Document Platform',
                description: 'Multi-format file conversion with AI-powered document chat for quick retrieval',
                image: '/assets/planetpdf.png',
            },
            {
                title: 'Raspberry Pi IoT',
                subtitle: 'DIY Tech Project',
                description: 'Worked on DIY tech with Raspberry Pi and IoT integration for Women Safety',
                image: '/assets/raspi.png',
            },
            {
                title: 'Loki - Voice Assistant',
                subtitle: 'AI Voice Assistant',
                description: 'Advanced voice assistant capable of answering diverse queries and seamlessly opening applications or websites through intuitive voice commands.',
                image: '/assets/dailycart.png',
            },
        ]
    }
}

export default projects
