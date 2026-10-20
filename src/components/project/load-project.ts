import { notFound } from "@tanstack/react-router";

import { getProjectById } from "@/config/projects";

export const loadProject = ({ params }: { params: { id: string } }) => {
  const project = getProjectById(params.id);
  if (!project) {
    throw notFound();
  }
  return project;
};
