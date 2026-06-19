import {
  page_about_bio,
  page_about_interest1,
  page_about_interest2,
  page_about_interest3,
} from "@/paraglide/messages.js";

export const PERSONAL_INFO = {
  avatar:
    "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Vector_c5fjon.svg",

  get bio() {
    return page_about_bio();
  },

  contact: {
    email: "pvducc.dev@gmail.com",
    github: "https://github.com/pvducdev",
    gitlab: "https://gitlab.com/pvducc.dev",
    linkedin: "https://linkedin.com/in/pvducc",
  },

  dob: 2001,
  experience: 3,

  get interests() {
    return [
      page_about_interest1(),
      page_about_interest2(),
      page_about_interest3(),
    ];
  },

  location: "HCMC, Vietnam",
  name: "PVD",
  nickname: "D",
  openToWork: true,

  resume: {
    fileName: "pvd-resume.pdf",
    url: "https://res.cloudinary.com/d-devfolio/image/upload/q_auto/pvd-resume_wh0n3t.pdf",
  },

  role: "Javascript Developer",
};

export type PersonalInfo = typeof PERSONAL_INFO;
