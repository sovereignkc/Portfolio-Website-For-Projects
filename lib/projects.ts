import { projectSeed, type Project } from "./site-content";

type ProjectStore = {
  projects: Project[];
};

const globalForProjects = globalThis as typeof globalThis & {
  __portfolioProjectStore?: ProjectStore;
};

function store() {
  if (!globalForProjects.__portfolioProjectStore) {
    globalForProjects.__portfolioProjectStore = {
      projects: projectSeed.map((project) => ({ ...project, tags: [...project.tags] }))
    };
  }

  return globalForProjects.__portfolioProjectStore;
}

export function getProjects() {
  return store().projects.map((project) => ({ ...project, tags: [...project.tags] }));
}

export function updateProjects(nextProjects: Project[]) {
  store().projects = nextProjects.map((project) => ({ ...project, tags: [...project.tags] }));
  return getProjects();
}
