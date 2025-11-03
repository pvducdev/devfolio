export const PERSONAL_INFO = {
  name: "PVD",
  fullName: "PVD",
  nickname: "D",
  age: 24,
  role: "Frontend Developer",
  experience: 3, // years

  contact: {
    email: "your.email@example.com",
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    gitlab: "https://gitlab.com/username",
  },

  resume: {
    url: "https://snippet.embedpdf.com/ebook.pdf",
    fileName: "pvd-resume.pdf",
  },

  skills: {
    core: ["React/Next.js", "Vue.js", "Svelte/SvelteKit"],
    languages: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"],
    styling: ["TailwindCSS"],
    tools: ["Vite", "Rollup", "API Integration"],
  },

  interests: [
    "Exploring the newest frontend libraries and tools",
    "Building responsive, professional UIs",
    "Staying updated on modern development workflows and frameworks",
  ],

  about: {
    shortBio:
      "Frontend Developer with 3 years of experience specializing in React, Vue, and modern web technologies.",
    longBio:
      "Frontend Developer with 3 years of experience specializing in React, Vue, and modern web technologies.",
  },
} as const;

export type PersonalInfo = typeof PERSONAL_INFO;

// Legacy exports for backward compatibility
export const RESUME_URL = PERSONAL_INFO.resume.url;
export const RESUME_FILE_NAME = PERSONAL_INFO.resume.fileName;
