import {
  page_about_interest1,
  page_about_interest2,
  page_about_interest3,
  page_about_longbio,
  page_about_shortbio,
} from "@/paraglide/messages.js";

export const PERSONAL_INFO = {
  name: "PVD",
  nickname: "D",
  dob: 2001,
  role: "Frontend Developer",
  location: "HCMC, Vietnam",
  experience: 3, // years
  openToWork: true,

  contact: {
    email: "pvducc.dev@gmail.com",
    github: "https://github.com/pvducdev",
    linkedin: "https://linkedin.com/in/username",
    gitlab: "https://gitlab.com/pvducc.dev",
  },

  resume: {
    url: "https://snippet.embedpdf.com/ebook.pdf",
    fileName: "pvd-resume.pdf",
  },

  get interests() {
    return [
      page_about_interest1(),
      page_about_interest2(),
      page_about_interest3(),
    ];
  },

  get shortBio() {
    return page_about_shortbio();
  },

  get longBio() {
    return page_about_longbio();
  },
};

export type PersonalInfo = typeof PERSONAL_INFO;
