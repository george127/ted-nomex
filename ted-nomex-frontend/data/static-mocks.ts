import { IMAGES } from "@/lib/assets";

export const MOCK_SERVICES = [
  { id: "s1", num: "01.", icon: "construction", title: "Interior Renovation", excerpt: "Elevate your space with our expert interior renovation services. From design to execution, we ensure every detail is tailored to your needs.", image: IMAGES.services[0], slug: "interior-renovation" },
  { id: "s2", num: "02.", icon: "auto_towing", title: "General Constracting", excerpt: "Trust our team of experienced contractors to handle your general contracting needs efficiently. From project management to on-site execution, we've got you covered.", image: IMAGES.services[1], slug: "general-contracting" },
  { id: "s3", num: "03.", icon: "apartment", title: "Build Engineering", excerpt: "Optimize your building's performance and efficiency with our expert engineering solutions. From structural design to energy optimization, we provide holistic engineering services.", image: IMAGES.homeSlides[0], slug: "build-engineering" }
];

export const MOCK_PROJECTS = [
  { id: "p1", num: "01.", title: "Trinity River Renovate", excerpt: "Constant care and attention to the patients makes good record", image: IMAGES.projects[0], slug: "trinity-river" },
  { id: "p2", num: "02.", title: "White Walls House", excerpt: "Constant care and attention to the patients makes good record.", image: IMAGES.projects[1], slug: "white-walls" },
  { id: "p3", num: "03.", title: "Project Endoran", excerpt: "Constant care and attention to the patients makes good record.", image: IMAGES.projects[2], slug: "endoran" },
  { id: "p4", num: "04.", title: "World Trade Center", excerpt: "Constant care and attention to the patients makes good record", image: IMAGES.projects[3], slug: "world-trade-center" },
];



export const MOCK_TEAM = [
  { name: "Nodin Somuah", role: "Founder and CEO", img: IMAGES.team[0], desc: "Nodin Somuah oversees all operations, strategic planning, and client relationships to ensure project success." },
  { name: "Jeffrey Luke", role: "Administrator", img: IMAGES.team[1], desc: "Jeffrey Luke manages administrative tasks, coordinates schedules, and supports daily operations for smooth project execution." },
  { name: "Austin Evon", role: "Main Manager", img: IMAGES.team[2], desc: "Austin Evon oversees project management, supervises construction teams, and ensures quality and safety standards are met." }
];