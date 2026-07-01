"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../../lib/site-content";

type Props = {
  initialProjects?: Project[];
  onProjectsChange?: (projects: Project[]) => void;
};

const emptyProject: Project = {
  id: "new-project",
  tier: "Tier 2",
  name: "New Project",
  subtitle: "Short subtitle",
  description: "Describe the project in one or two crisp sentences.",
  tags: ["TypeScript", "Next.js"],
  githubUrl: "",
  youtubeUrl: "",
  docsUrl: "",
  imageUrl:
    "radial-gradient(circle at 25% 25%, rgba(168,85,247,0.24), transparent 18%), linear-gradient(135deg, #0b1020 0%, #05070b 100%)",
  accent: "violet"
};

export function AdminDashboard({ initialProjects, onProjectsChange }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
  const [status, setStatus] = useState<string>("Loading...");
  const hasMounted = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setStatus("Loading...");
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) {
          const error = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(error?.error ?? "Unable to load projects");
        }

        const data = (await response.json()) as {
          projects?: Project[];
          content?: { projects?: Project[] };
        };
        const loadedProjects = data.projects ?? data.content?.projects ?? [];

        if (!cancelled) {
          setProjects(loadedProjects);
          setStatus("Ready");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus(error instanceof Error ? error.message : "Failed to load projects");
        }
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const preview = useMemo(
    () => JSON.stringify({ projects }, null, 2),
    [projects]
  );

  useEffect(() => {
    onProjectsChange?.(projects);
  }, [projects, onProjectsChange]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      void save("Auto-saved");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [projects]);

  function updateProject(index: number, patch: Partial<Project>) {
    setProjects((current) =>
      current.map((project, currentIndex) => (currentIndex === index ? { ...project, ...patch } : project))
    );
  }

  function addProject() {
    setProjects((current) => [
      ...current,
      {
        ...emptyProject,
        id: `project-${Date.now()}`
      }
    ]);
  }

  async function save(nextStatus = "Saved") {
    setStatus("Saving...");
    const response = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects })
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(error?.error ?? "Save failed");
      return;
    }

    setStatus(nextStatus);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
          {status === "Loading..." ? "Loading projects from /api/projects..." : status}
        </div>
        <SectionTitle title="Project cards" subtitle="Front image, links, and doc buttons" />
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
              No projects loaded yet.
            </div>
          ) : null}
          {projects.map((project, index) => (
            <div key={project.id} className="glass rounded-3xl border border-white/10 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.26em] text-white/35">{project.tier}</div>
                  <div className="mt-1 text-lg font-semibold">{project.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setProjects((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-100"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Name" value={project.name} onChange={(value) => updateProject(index, { name: value })} />
                <Field
                  label="Subtitle"
                  value={project.subtitle}
                  onChange={(value) => updateProject(index, { subtitle: value })}
                />
                <Field label="Tier" value={project.tier} onChange={(value) => updateProject(index, { tier: value })} />
                <Field
                  label="Accent"
                  value={project.accent}
                  onChange={(value) => updateProject(index, { accent: value as Project["accent"] })}
                />
                <Field label="GitHub" value={project.githubUrl ?? ""} onChange={(value) => updateProject(index, { githubUrl: value })} />
                <Field label="YouTube" value={project.youtubeUrl ?? ""} onChange={(value) => updateProject(index, { youtubeUrl: value })} />
                <Field label="Docs" value={project.docsUrl ?? ""} onChange={(value) => updateProject(index, { docsUrl: value })} />
                <Field
                  label="Front image"
                  value={project.imageUrl ?? ""}
                  onChange={(value) => updateProject(index, { imageUrl: value })}
                />
              </div>

              <div className="mt-3">
                <label className="mb-2 block text-xs uppercase tracking-[0.26em] text-white/35">Description</label>
                <textarea
                  value={project.description}
                  onChange={(event) => updateProject(index, { description: event.target.value })}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="mt-3">
                <label className="mb-2 block text-xs uppercase tracking-[0.26em] text-white/35">Tags</label>
                <input
                  value={project.tags.join(", ")}
                  onChange={(event) =>
                    updateProject(index, {
                      tags: event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addProject} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900">
            + Add project
          </button>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="button" onClick={() => void save()} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900">
            Save changes
          </button>
        </div>
        <div className="text-sm text-white/40">{status}</div>
      </div>

      <div className="glass rounded-3xl border border-white/10 p-5">
        <div className="mb-4 text-xs uppercase tracking-[0.26em] text-white/35">JSON export</div>
        <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/65">
          {preview}
        </pre>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-2">
      <div>
        <div className="text-xs uppercase tracking-[0.28em] text-white/35">{title}</div>
        <div className="mt-1 text-sm text-white/55">{subtitle}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.26em] text-white/35">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
      />
    </div>
  );
}
