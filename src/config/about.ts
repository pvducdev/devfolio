import {
  page_about_interest1,
  page_about_interest2,
  page_about_interest3,
  page_about_longbio,
  page_about_shortbio,
} from "@/paraglide/messages.js";

export const ABOUT = {
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

export type About = typeof ABOUT;
