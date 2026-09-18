import { Profile, Project, Skill, Experience, Education, Service, GalleryItem, BlogPost, SiteSettings } from '../types';

export const initialProfile: Profile = {
  fullName: "Johnny Siele",
  title: "Senior Full-Stack Engineer & Cloud Solutions Architect",
  headline: "Crafting mission-critical cloud infrastructure, elegant distributed architectures, and modern web applications.",
  bio: "Over 8 years of engineering experience architecting scalable distributed systems, high-performance web applications, and resilient cloud architectures. Passionate about clean code, developer experience, and product-focused engineering.",
  aboutStory: [
    "I specialize in bridging high-level architectural design with rigorous software execution. From architecting distributed microservices to building fluid, accessible user interfaces, I prioritize maintainability, security, and velocity.",
    "Throughout my career, I have led engineering teams across fintech, cloud computing, and enterprise SaaS, deploying software that serves millions of users reliably under peak workloads.",
    "When I'm not shipping code, I mentor emerging engineers, contribute to open-source developer tooling, and write technical articles on system architecture and cloud patterns."
  ],
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  location: "San Francisco, CA (Open to Remote)",
  email: "johnnysiele@gmail.com",
  phone: "+1 (555) 349-8821",
  availableForHire: true,
  resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "https://johnnysiele.dev"
  },
  highlights: [
    { title: "Experience", value: "8+ Years", description: "Production systems engineering" },
    { title: "Production Deployments", value: "140+", description: "Distributed cloud projects" },
    { title: "Uptime Maintained", value: "99.98%", description: "Across high-throughput SLAs" },
    { title: "Open Source", value: "35+", description: "Tools and community packages" }
  ]
};

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "OmniFlow Cloud Orchestrator",
    slug: "omniflow-cloud-orchestrator",
    shortDescription: "Distributed workflow orchestration engine with real-time telemetry and automated state reconciliation.",
    fullDescription: `### Overview
OmniFlow is an enterprise-grade distributed workflow engine designed to execute asynchronous multi-step pipeline tasks across hybrid cloud clusters with strict fault tolerance and zero data loss guarantees.

### Key Highlights
- **Distributed State Machine**: Leveraged consensus protocols and event sourcing to ensure idempotent execution even during node failures.
- **Real-Time Telemetry**: Integrated streaming metrics pipeline processing 50,000 events/second using Apache Kafka and WebSockets.
- **Zero-Downtime Migration**: Seamless canary rollouts without customer connection drops.

### Architectural Decisions
Built using TypeScript, Node.js, Go microservices, and PostgreSQL with Firestore state caches for millisecond-latency UI status updates.`,
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["TypeScript", "Node.js", "Docker", "Kubernetes", "PostgreSQL", "Tailwind CSS"],
    category: "Full Stack",
    githubUrl: "https://github.com/example/omniflow",
    liveUrl: "https://example.com/demo",
    featured: true,
    completionDate: "2024-08",
    displayOrder: 1,
    status: "published"
  },
  {
    id: "proj-2",
    title: "Apex FinTech Ledger & Payment Gateway",
    slug: "apex-fintech-ledger",
    shortDescription: "Double-entry accounting ledger and payment settlement core handling high-frequency card transactions.",
    fullDescription: `### The Challenge
Financial platforms require immutable audit trails, strict consistency models, and ACID guarantees for concurrent balance mutations.

### Implementation
- Built double-entry ledger database with cryptographic receipt chaining.
- Multi-region failover cluster ensuring continuous authorization routing.
- Sub-50ms latency SLAs across tokenized settlement routes.`,
    coverImageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["PHP 8.2", "PostgreSQL", "Redis", "Docker", "Tailwind CSS", "REST API"],
    category: "Backend",
    githubUrl: "https://github.com/example/apex-ledger",
    liveUrl: "https://example.com/apex",
    featured: true,
    completionDate: "2024-03",
    displayOrder: 2,
    status: "published"
  },
  {
    id: "proj-3",
    title: "Pulse Realtime Analytics Canvas",
    slug: "pulse-realtime-analytics",
    shortDescription: "Interactive multi-tenant analytics dashboard with WebGL charts and sub-second query latency.",
    fullDescription: `Pulse provides teams with an intuitive, drag-and-drop metric exploration canvas for high-cardinality streaming datasets.`,
    coverImageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "D3.js", "Firebase"],
    category: "Frontend",
    githubUrl: "https://github.com/example/pulse-analytics",
    liveUrl: "https://example.com/pulse",
    featured: true,
    completionDate: "2023-11",
    displayOrder: 3,
    status: "published"
  }
];

export const initialSkills: Skill[] = [
  // Backend
  { id: "sk-1", name: "PHP 8+ & Laravel", category: "Backend", proficiency: 92, levelLabel: "Expert", iconName: "Server", displayOrder: 1, isTopSkill: true, description: "Modern Object-Oriented architecture, PSR standards, queue workers, REST APIs" },
  { id: "sk-2", name: "Node.js & TypeScript", category: "Backend", proficiency: 95, levelLabel: "Expert", iconName: "Terminal", displayOrder: 2, isTopSkill: true, description: "Asynchronous I/O, Express, event-driven pipelines, strict type safety" },
  { id: "sk-3", name: "REST & GraphQL APIs", category: "Backend", proficiency: 94, levelLabel: "Expert", iconName: "Network", displayOrder: 3, isTopSkill: true, description: "OpenAPI specifications, versioning, rate-limiting, and webhook routing" },
  // Frontend
  { id: "sk-4", name: "React & Next.js", category: "Frontend", proficiency: 96, levelLabel: "Expert", iconName: "Layers", displayOrder: 4, isTopSkill: true, description: "Hooks architecture, state machines, SSR/SSG, performant virtual DOM rendering" },
  { id: "sk-5", name: "Tailwind CSS & Design Systems", category: "Frontend", proficiency: 95, levelLabel: "Expert", iconName: "Palette", displayOrder: 5, isTopSkill: true, description: "Responsive fluid design, tokens, dark mode engines, WCAG AA accessibility" },
  { id: "sk-6", name: "Modern JavaScript (ES6+)", category: "Frontend", proficiency: 98, levelLabel: "Expert", iconName: "Code", displayOrder: 6, isTopSkill: true, description: "Modules, closures, generators, web workers, memory profiling" },
  // Database
  { id: "sk-7", name: "Firebase (Firestore & Auth)", category: "Database", proficiency: 92, levelLabel: "Expert", iconName: "Database", displayOrder: 7, isTopSkill: true, description: "NoSQL schema modeling, security rules hardening, real-time subscriptions" },
  { id: "sk-8", name: "PostgreSQL & MySQL", category: "Database", proficiency: 90, levelLabel: "Advanced", iconName: "HardDrive", displayOrder: 8, isTopSkill: false, description: "ACID transactions, relational indexing, query plans, replication" },
  // Cloud & DevOps
  { id: "sk-9", name: "Docker & Containerization", category: "Cloud & DevOps", proficiency: 88, levelLabel: "Advanced", iconName: "Box", displayOrder: 9, isTopSkill: false, description: "Multi-stage builds, rootless containers, compose configurations" },
  { id: "sk-10", name: "CI/CD & Cloud Deployments", category: "Cloud & DevOps", proficiency: 87, levelLabel: "Advanced", iconName: "GitBranch", displayOrder: 10, isTopSkill: false, description: "GitHub Actions, automated test suites, zero-downtime releases" }
];

export const initialExperience: Experience[] = [
  {
    id: "exp-1",
    organization: "Vanguard Cloud Systems",
    position: "Staff Full-Stack Architect",
    description: [
      "Led the core platform architecture team of 9 engineers driving cloud migration and microservices decomposition.",
      "Engineered high-throughput event processing pipelines handling over 10M daily transactions with sub-80ms p99 latency.",
      "Reduced cloud hosting overhead by 34% through proactive caching layers, query optimization, and memory tuning."
    ],
    startDate: "2022-04",
    endDate: "Present",
    isCurrent: true,
    technologies: ["TypeScript", "PHP 8", "Node.js", "Docker", "Firestore", "Tailwind CSS"],
    location: "San Francisco, CA",
    locationType: "Hybrid",
    displayOrder: 1
  },
  {
    id: "exp-2",
    organization: "Apex Media & Software",
    position: "Senior Software Engineer",
    description: [
      "Built multi-tenant CMS and asset delivery pipelines with automated image transformation and CDN caching.",
      "Standardized backend API guidelines across 4 cross-functional development squads.",
      "Authored unit and integration test suites achieving 91% code coverage across core billing engines."
    ],
    startDate: "2019-08",
    endDate: "2022-03",
    isCurrent: false,
    technologies: ["PHP", "Laravel", "MySQL", "JavaScript", "Redis"],
    location: "Austin, TX",
    locationType: "Remote",
    displayOrder: 2
  },
  {
    id: "exp-3",
    organization: "Horizon Digital Interactive",
    position: "Full-Stack Web Developer",
    description: [
      "Delivered over 25 bespoke commercial web applications, e-commerce backends, and custom CMS platforms.",
      "Mentored junior engineers and instituted peer code review standards."
    ],
    startDate: "2016-06",
    endDate: "2019-07",
    isCurrent: false,
    technologies: ["PHP", "HTML5", "CSS3", "JavaScript", "REST APIs"],
    location: "Seattle, WA",
    locationType: "On-site",
    displayOrder: 3
  }
];

export const initialEducation: Education[] = [
  {
    id: "edu-1",
    institution: "University of California, Berkeley",
    qualification: "Bachelor of Science",
    field: "Computer Science & Information Systems",
    startDate: "2012-09",
    endDate: "2016-05",
    description: "Graduated with Honors. Core coursework in Distributed Systems, Database Management, Algorithms, and Software Engineering.",
    displayOrder: 1
  },
  {
    id: "edu-2",
    institution: "Google Cloud Certification",
    qualification: "Professional Cloud Architect",
    field: "Cloud Systems & Security Architecture",
    startDate: "2023-01",
    endDate: "2026-01",
    description: "Demonstrated proficiency in designing scalable, secure, and robust Google Cloud architectures.",
    displayOrder: 2
  }
];

export const initialServices: Service[] = [
  {
    id: "srv-1",
    title: "Full-Stack Web Application Development",
    description: "End-to-end engineering of bespoke web applications, from database schema design and API services to responsive frontend user interfaces.",
    iconName: "Layout",
    features: [
      "Modular, maintainable codebases built with modern best practices",
      "Robust RESTful or GraphQL API architectures",
      "Seamless authentication and role-based permissions",
      "Mobile-first, fully responsive UI execution"
    ],
    displayOrder: 1,
    featured: true
  },
  {
    id: "srv-2",
    title: "Cloud Architecture & Backend APIs",
    description: "Designing resilient, scalable backend infrastructures capable of handling high concurrency with zero downtime and strict security posture.",
    iconName: "Server",
    features: [
      "Firestore and SQL schema design and query optimization",
      "Microservice and serverless system design",
      "Containerized deployments with Docker and CI/CD automation",
      "Strict data sanitization and defensive security controls"
    ],
    displayOrder: 2,
    featured: true
  },
  {
    id: "srv-3",
    title: "Custom CMS & Internal Tooling",
    description: "Purpose-built content management systems and administrative dashboards that empower teams to manage complex workflows without developer intervention.",
    iconName: "Sliders",
    features: [
      "Custom CRUD management dashboards for any data model",
      "Real-time analytics and telemetry tracking",
      "Granular audit trails and user access management",
      "Automated file, media, and document pipelines"
    ],
    displayOrder: 3,
    featured: true
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Distributed Infrastructure Topology",
    description: "High-level architecture map of a multi-region microservices deployment with automated failover.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture",
    date: "2024-06",
    featured: true,
    tags: ["Cloud", "Topology", "High Availability"],
    displayOrder: 1
  },
  {
    id: "gal-2",
    title: "Developer Workstation & Hardware Lab",
    description: "Ergonomic dual-monitor development rig optimized for multi-container local simulation and testing.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    category: "Workspace",
    date: "2024-02",
    featured: true,
    tags: ["Workspace", "Hardware", "Productivity"],
    displayOrder: 2
  },
  {
    id: "gal-3",
    title: "Design System & Color Tokens Spec",
    description: "Mathematical typographic scale, contrast ratios, and interactive component state matrices.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    category: "Design",
    date: "2023-10",
    featured: true,
    tags: ["Design System", "UI/UX", "Typography"],
    displayOrder: 3
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Architecting Resilient Distributed Systems: Lessons from Production",
    slug: "architecting-resilient-distributed-systems",
    excerpt: "Practical insights into fault tolerance, circuit breakers, idempotency, and graceful degradation in high-throughput cloud environments.",
    content: `Distributed systems do not fail predictably—they fail in subtle, cascading ways that defy straightforward unit tests. After years of running production services under peak transaction volume, here are the foundational patterns that prevent outages.

### 1. The Fallacy of Linear Failover
When a downstream microservice degrades, naive retry policies frequently act as a distributed denial of service attack against your own infrastructure. 

Implementing **exponential backoff with randomized jitter** is essential:

\`\`\`typescript
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function retryWithJitter<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      const baseDelay = 100 * Math.pow(2, i);
      const jitter = Math.random() * 50;
      await sleep(baseDelay + jitter);
    }
  }
  throw new Error('Retries exhausted');
}
\`\`\`

### 2. Embrace Idempotency
Every mutate endpoint that deals with state modification must accept a deterministic idempotency key. If a client drops connection mid-flight, repeating the request should never duplicate transactions.

### 3. Graceful Degradation over Hard Failures
If the recommendation engine is offline, fall back to cached trending items rather than returning an HTTP 500 error screen. Your users should always experience functional software.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    category: "Architecture",
    tags: ["Distributed Systems", "Cloud", "Resilience", "Backend"],
    readingTimeMinutes: 6,
    publishedAt: "2024-07-15",
    status: "published",
    viewsCount: 1420
  },
  {
    id: "post-2",
    title: "Clean Architecture in Modern PHP 8+: Beyond Framework Dogma",
    slug: "clean-architecture-php-8",
    excerpt: "How to decouple business domain logic from framework conventions in modern PHP applications for long-term maintainability.",
    content: `PHP 8+ with typed properties, enums, attributes, and fibers offers an exceptionally capable language environment. Yet many applications still suffer from fat controllers and leaky abstraction boundaries.

### Separating Domain from Infrastructure
By enforcing strict boundaries between pure domain entities, repository interfaces, and framework transport layers, you guarantee that your business logic remains testable without mocking the entire database or web server.

### Key Principles:
1. **Entities don't know about the database**: Domain models shouldn't inherit ORM base classes directly.
2. **Use Value Objects**: Wrap primitives in domain types like \`EmailAddress\` or \`Money\` to ensure self-validation.
3. **Command/Query Separation**: Keep read queries performant and mutation operations clean and audited.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    category: "PHP & Backend",
    tags: ["PHP", "Clean Architecture", "Software Engineering"],
    readingTimeMinutes: 5,
    publishedAt: "2024-05-20",
    status: "published",
    viewsCount: 980
  },
  {
    id: "post-3",
    title: "Hardening Firestore Security Rules for Production Multi-Role Applications",
    slug: "firestore-security-rules-production",
    excerpt: "A deep dive into writing comprehensive Attribute-Based Access Control (ABAC) rules for Firestore documents and audit fields.",
    content: `Firestore security rules are not simple firewall filters—they are a declarative programming language that executes against every single document access attempt.

### The Golden Rules
- Never trust client-side claims without verifying against auth tokens or lookup documents.
- Keep audit fields (\`createdAt\`, \`createdBy\`) strictly immutable on updates.
- Validate payload shapes and character limits directly in security rules.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    category: "Security",
    tags: ["Firebase", "Firestore", "Security", "Auth"],
    readingTimeMinutes: 4,
    publishedAt: "2024-03-10",
    status: "published",
    viewsCount: 1650
  }
];

export const initialSiteSettings: SiteSettings = {
  siteTitle: "Johnny Siele | Senior Full-Stack Engineer & Cloud Architect",
  metaDescription: "Professional portfolio and software engineering showcase of Johnny Siele. Specializing in high-performance cloud architectures, PHP 8+, TypeScript, and modern distributed web platforms.",
  ogImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  contactEmail: "johnnysiele@gmail.com",
  footerText: "© 2026 Johnny Siele. All rights reserved. Engineered with precision using PHP, TypeScript, Tailwind CSS, and Firebase.",
  primaryDomain: "https://johnnysiele.dev"
};

export const INITIAL_PROFILE = initialProfile;
export const INITIAL_PROJECTS = initialProjects;
export const INITIAL_SKILLS = initialSkills;
export const INITIAL_EXPERIENCE = initialExperience;
export const INITIAL_EDUCATION = initialEducation;
export const INITIAL_SERVICES = initialServices;
export const INITIAL_GALLERY = initialGallery;
export const INITIAL_BLOG_POSTS = initialBlogPosts;
export const INITIAL_SETTINGS = initialSiteSettings;
