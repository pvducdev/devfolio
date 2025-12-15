import type { ContributionProvider, ContributionSource } from "../types";
import { githubProvider } from "./github";
import { gitlabProvider } from "./gitlab";

const providers: Record<ContributionSource, ContributionProvider> = {
  github: githubProvider,
  gitlab: gitlabProvider,
};

export const getProvider = (source: ContributionSource): ContributionProvider =>
  providers[source];
