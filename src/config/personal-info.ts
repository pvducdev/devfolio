import {
  page_about_bio,
  page_about_interest1,
  page_about_interest2,
  page_about_interest3,
} from "@/paraglide/messages.js";

export const PERSONAL_INFO = {
  name: "PVD",
  nickname: "D",
  dob: 2001,
  role: "Javascript Developer",
  location: "HCMC, Vietnam",
  experience: 3, // years
  openToWork: true,
  avatar:
    "https://res.cloudinary.com/d-devfolio/image/upload/f_auto/Vector_c5fjon.svg",

  contact: {
    email: "pvducc.dev@gmail.com",
    github: "https://github.com/pvducdev",
    linkedin: "https://linkedin.com/in/pvducc",
    gitlab: "https://gitlab.com/pvducc.dev",
  },

  resume: {
    url: "https://res.cloudinary.com/d-devfolio/image/upload/q_auto/pvd-resume_wh0n3t.pdf",
    fileName: "pvd-resume.pdf",
  },

  get interests() {
    return [
      page_about_interest1(),
      page_about_interest2(),
      page_about_interest3(),
    ];
  },

  get bio() {
    return page_about_bio();
  },
};

export type PersonalInfo = typeof PERSONAL_INFO;
