export type StackIcon =
  | "typescript"
  | "react"
  | "nextjs"
  | "angular"
  | "tailwind"
  | "openjdk"
  | "springboot"
  | "nodejs"
  | "express"
  | "nestjs"
  | "python"
  | "php"
  | "fastapi"
  | "django"
  | "laravel"
  | "mariadb"
  | "mongodb"
  | "postgresql"
  | "graphql";

export type StackItem = {
  name: string;
  kind: "language" | "framework" | "library" | "runtime" | "database" | "api";
  icon: StackIcon;
};

export type DeveloperData = {
  profile: {
    name: string;
    headline: string;
    bio: string;
    email: string;
    phone?: string;
    socials: {
      github?: string;
      linkedin?: string;
      x?: string;
      website?: string;
    };
  };
  projects: Array<{
    slug: string;
    name: string;
    shortDescription: string;
    tags: string[];
    github: string;
    demo?: string;
    readmePath?: string; // optional local public path to detailed MD used by CLI/GUI
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    verifyUrl?: string;
    certificateId?: string;
    issuedOn?: string;
  }>;
  resume: {
    enPath?: string; // expected PDF path for GUI Resume buttons
    frPath?: string; // expected PDF path for GUI Resume buttons
    aboutMdPath?: string; // optional rich about-me markdown in public
  };
  stack: {
    frontend: StackItem[];
    backend: StackItem[];
  };
  timeline: Array<{
    type: "education" | "experience";
    title: string;
    org: string;
    start: string;
    end: string | "Present";
    description?: string;
  }>;
};

export const developer: DeveloperData = {
  profile: {
    name: "Otmane Touhami",
    headline: "Distributed Systems & AI Master's Student · Full-Stack Engineer",
    bio: [
      "Proactive and results-driven Master's student specializing in distributed systems and artificial intelligence.",
      "Hands-on experience delivering production-ready solutions across Spring Boot, React, Angular, and microservices architectures.",
      "Currently seeking a software engineering internship to contribute to innovative engineering teams.",
    ].join("\n"),
    email: "otmanetouhami01@gmail.com",
    phone: "+212 615-306366",
    socials: {
      github: "https://github.com/OtmaneTouhami",
      linkedin: "https://www.linkedin.com/in/otmane-touhami/",
      x: undefined,
      website: "https://otmane.dev",
    },
  },
  projects: [
    {
      slug: "budgetwise",
      name: "BudgetWise+",
      shortDescription:
        "Full-stack personal finance platform with Spring Boot APIs, JWT-secured access, interactive analytics via Recharts, and automated SMS/email budget alerts.",
      tags: [
        "spring-boot",
        "react",
        "jwt",
        "mariadb",
        "swagger",
        "zustand",
        "tailwind",
      ],
      github: "https://github.com/OtmaneTouhami/budget-wise",
      readmePath: "/resume/budget-wise.md",
    },
    {
      slug: "medical-report-generator",
      name: "Medical Report Generator",
      shortDescription:
        "CrewAI-powered multi-agent workflow that transcribes notes, runs RAG pipelines, and ships validated French medical reports via FastAPI + Next.js.",
      tags: ["python", "crewai", "rag", "fastapi", "nextjs", "sqlalchemy"],
      github: "https://github.com/OtmaneTouhami/medical-report-generator",
      readmePath: "/resume/medical-report-generator.md",
    },
    {
      slug: "microservices",
      name: "Microservices Architecture",
      shortDescription:
        "Spring Cloud microservices suite with Eureka discovery, Config Server, API Gateway, GraphQL endpoints, and database-per-service patterns.",
      tags: ["java", "spring-boot", "graphql", "ddd", "microservices"],
      github: "https://github.com/OtmaneTouhami/microservices",
      readmePath: "/resume/microservices.md",
    },
    {
      slug: "digital-banking",
      name: "Digital Banking Application",
      shortDescription:
        "Secure online banking suite pairing Angular with Spring Boot services, featuring JWT/OAuth2 auth, account operations, and rich admin tooling.",
      tags: ["spring-boot", "angular", "jwt", "oauth2", "mariadb"],
      github: "https://github.com/OtmaneTouhami/digital-banking",
      readmePath: "/resume/digital-banking.md",
    },
    {
      slug: "e-gestion",
      name: "e-Gestion",
      shortDescription:
        "Laravel + React management platform with role-based dashboards, PDF scheduling exports, and automated credential workflows.",
      tags: ["laravel", "react", "tailwind", "inertia", "sanctum"],
      github: "https://github.com/OtmaneTouhami/e-Gestion",
      readmePath: "/resume/e-gestion.md",
    },
    {
      slug: "team-projects-hub",
      name: "Projects Management System",
      shortDescription:
        "Collaboration hub with Express + TypeScript API, React + shadcn UI, JWT + Google OAuth auth, and workspace/project/task management.",
      tags: [
        "node",
        "express",
        "typescript",
        "mongodb",
        "react",
        "shadcn",
        "tailwind",
      ],
      github: "https://github.com/OtmaneTouhami/team-projects-hub",
      readmePath: "/resume/Projects Management System.md",
    },
  ],
  certifications: [
    {
      name: "ALX Software Engineering Programme (Back-end Specialization)",
      issuer: "ALX",
      verifyUrl: "https://savanna.alxafrica.com/certificates/98yHEscSMN",
      issuedOn: "2025-07-24",
    },
    {
      name: "Linux Essentials",
      issuer: "Cisco Networking Academy",
      issuedOn: "2025-05",
    },
    {
      name: "Blockchain: Understanding Its Uses and Implications (LFS170)",
      issuer: "The Linux Foundation",
      issuedOn: "2025-05",
    },
  ],
  resume: {
    enPath: "/resume/en.pdf",
    frPath: "/resume/fr.pdf",
    aboutMdPath: "/resume/me.md",
  },
  stack: {
    frontend: [
      { name: "TypeScript", kind: "language", icon: "typescript" },
      { name: "React", kind: "library", icon: "react" },
      { name: "Next.js", kind: "framework", icon: "nextjs" },
      { name: "Angular", kind: "framework", icon: "angular" },
      { name: "Tailwind CSS", kind: "library", icon: "tailwind" },
    ],
    backend: [
      { name: "Java", kind: "language", icon: "openjdk" },
      { name: "Python", kind: "language", icon: "python" },
      { name: "PHP", kind: "language", icon: "php" },
      { name: "Spring Boot", kind: "framework", icon: "springboot" },
      { name: "Node.js", kind: "runtime", icon: "nodejs" },
      { name: "Express", kind: "framework", icon: "express" },
      { name: "NestJS", kind: "framework", icon: "nestjs" },
      { name: "FastAPI", kind: "framework", icon: "fastapi" },
      { name: "Django", kind: "framework", icon: "django" },
      { name: "Laravel", kind: "framework", icon: "laravel" },
      { name: "MariaDB", kind: "database", icon: "mariadb" },
      { name: "PostgreSQL", kind: "database", icon: "postgresql" },
      { name: "MongoDB", kind: "database", icon: "mongodb" },
      { name: "GraphQL", kind: "api", icon: "graphql" },
    ],
  },
  timeline: [
    {
      type: "education",
      title: "Master's Degree - Distributed Systems & AI",
      org: "ENSET Mohammedia",
      start: "2024",
      end: "Present",
    },
    {
      type: "education",
      title:
        "Bachelor's Degree - Software Engineering and Advanced Administration of Computer Systems and Networks",
      org: "ESTC Casablanca",
      start: "2023",
      end: "2024",
    },
    {
      type: "education",
      title: "Specialized Technician - Web Full-Stack Development",
      org: "ISTA NTIC",
      start: "2021",
      end: "2023",
    },
    {
      type: "experience",
      title: "Software Engineer (Intern)",
      org: "CMGP CAS, Casablanca",
      start: "2024-04",
      end: "2024-06",
      description:
        "Delivered a Spring Boot + React document validation platform for 50+ daily users, spanning REST design, data modeling, testing, and rollout.",
    },
    {
      type: "experience",
      title: "Full-Stack Developer (Intern)",
      org: "Start Jobs, Casablanca",
      start: "2023-04",
      end: "2023-08",
      description:
        "Implemented Laravel + React inventory tooling that lifted tracking efficiency by 40% and modernized the client website with TypeScript.",
    },
  ],
};
