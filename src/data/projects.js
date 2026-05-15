export const projects = [
  {
    id: "hirag-personal-ai",
    title: "hiRAG",
    subtitle: "A document intelligence system for grounded Q&A over long-form content.",
    category: "AI systems",
    status: "Working MVP",
    summary:
      "I built hiRAG as a working AI system that can ingest documents, retrieve relevant context, and return source-backed answers with citations.",
    highlights: [
      "Upload and process documents",
      "Retrieve relevant source material",
      "Generate grounded answers with clear citations",
    ],
    tech: ["React", "AWS", "Bedrock", "DynamoDB", "CDK"],
    links: [],
    featured: true,
  },
  {
    id: "out-and-about-events",
    title: "Out & About Events",
    subtitle: "A community events concept focused on discovery without the usual clutter.",
    category: "Product prototype",
    status: "Concept",
    summary:
      "A calmer way to browse local events, compare options, and make plans without fighting noisy listings.",
    highlights: [
      "Event browsing and lightweight filtering",
      "Mobile-first planning flows",
      "Friendly editorial structure",
    ],
    tech: ["React", "Supabase", "Vite", "Tailwind"],
    links: [
      { label: "Live site", href: "https://adrcodes.github.io/neighbourhood-tech/" },
      { label: "Code", href: "https://github.com/ADRcodes/neighbourhood-tech" },
    ],
    featured: true,
  },
  {
    id: "ai-builders-club",
    title: "AI Builders Club",
    subtitle: "A learning and prototyping space for people building useful AI tools.",
    category: "Community",
    status: "Early idea",
    summary:
      "A workshop and demo format for helping people move from AI curiosity to working prototypes, with small prompts, shared implementation patterns, and plain-language notes that keep the work practical.",
    highlights: [
      "Workshop-ready project prompts",
      "Shared demo patterns",
      "Plain-language AI implementation notes",
    ],
    tech: ["Teaching", "AI tooling", "Prototyping"],
    links: [],
    featured: true,
  },
  {
    id: "portfolio-ai-dev-workflow",
    title: "Portfolio / AI Dev Workflow",
    subtitle: "This redesign as a testbed for sharper portfolio systems and assisted development.",
    category: "Meta project",
    status: "Now building",
    summary:
      "A portfolio foundation built as a live testbed for content structure, AI-assisted development, reusable project data, and fast publishing as the work shifts toward practical AI consulting.",
    highlights: [
      "Reusable content data model",
      "Motion-aware static pages",
      "Design tokens before page polish",
    ],
    tech: ["Vite", "React", "Tailwind CSS", "Motion"],
    links: [],
    featured: true,
  },
  {
    id: "spiritual-retreat-centre",
    title: "Spiritual Retreat Centre",
    subtitle: "A paid WordPress project for a retreat centre client.",
    category: "Client project",
    status: "Shipped",
    summary:
      "A client website project brought forward from PortfolioV2, focused on presenting a retreat centre clearly with familiar WordPress publishing workflows.",
    highlights: [
      "Paid client delivery",
      "WordPress-based content management",
      "Retreat centre presentation and service information",
    ],
    tech: ["WordPress", "PHP"],
    links: [],
    image: "/images/portfolio-v2/TOLscreenshot.png",
    origin: "PortfolioV2",
    featured: true,
  },
  {
    id: "erco-homes-clone",
    title: "ERCO Homes Clone",
    subtitle: "A no-framework multi-page site clone built in plain HTML, CSS, and JavaScript.",
    category: "Frontend build",
    status: "Complete",
    summary:
      "A focused frontend exercise recreating a real estate site experience with multiple pages, a carousel, and hand-authored interactions without frameworks or external UI libraries.",
    highlights: [
      "Multi-page static site structure",
      "Carousel and page interactions built from scratch",
      "No-framework implementation practice",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Live site", href: "https://adrcodes.github.io/erco-homes-copy/" },
      { label: "Code", href: "https://github.com/ADRcodes/erco-homes-copy" },
    ],
    image: "/images/portfolio-v2/ErcoWebsitePic.png",
    origin: "PortfolioV2",
    featured: true,
  },
  {
    id: "movie-night",
    title: "Movie Night",
    subtitle: "A watchlist and film-discovery concept.",
    category: "Product prototype",
    status: "In progress",
    summary:
      "A passion project for organizing watchlists and discovering films, originally listed as a work-in-progress React build on PortfolioV2.",
    highlights: [
      "Watchlist organization concept",
      "Film discovery interface direction",
      "React and Tailwind prototype foundation",
    ],
    tech: ["React", "Vite", "Tailwind"],
    links: [],
    image: "/images/portfolio-v2/movie-site-screenshot.png",
    origin: "PortfolioV2",
    featured: true,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const portfolioV2Projects = projects.filter((project) => project.origin === "PortfolioV2");
