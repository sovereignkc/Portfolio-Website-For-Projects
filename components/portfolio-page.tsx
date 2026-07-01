"use client";

import { useMemo, useState } from "react";
import { AdminDashboard } from "./admin/admin-dashboard";
import { LoginForm } from "./admin/login-form";
import { AssistantPanel } from "./assistant-panel";
import { Icon } from "./icon";
import { siteContent, type Project } from "../lib/site-content";

type PortfolioPageProps = {
  projects: Project[];
};

function badgeClass(accent: string) {
  return accent === "cyan"
    ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
    : "border-violet-400/20 bg-violet-500/10 text-violet-100";
}

export function PortfolioPage(initialContent: PortfolioPageProps) {
  const [projects, setProjects] = useState<Project[]>(initialContent.projects);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [featured, ...rest] = projects;

  const stats = useMemo(() => siteContent.footerStats, []);

  function openEditor() {
    if (isUnlocked) {
      setEditorOpen(true);
    } else {
      setLoginOpen(true);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-white">
      <div className="mx-auto grid min-h-screen max-w-[1800px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_430px]">
        <section className="grid-surface border-white/10 lg:border-r">
          <div className="px-5 py-6 lg:px-7">
            <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <div className="text-3xl font-semibold tracking-tight text-white">{siteContent.name}</div>
                <div className="mt-1 text-sm text-white/56">
                  {siteContent.title} <span className="px-1 text-white/18">//</span> Portfolio command center
                </div>
              </div>
              <button
                type="button"
                onClick={openEditor}
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/55 transition hover:bg-white/10 md:flex"
              >
                <Icon name="lock" className="text-violet-300" />
                {isUnlocked ? "Edit portfolio" : "Unlock editor"}
              </button>
            </div>

            <p className="max-w-3xl text-lg leading-8 text-white/62">{siteContent.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {siteContent.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/14 bg-white/4 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/66"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {siteContent.contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10"
                >
                  <Icon name={contact.icon} />
                  {contact.label}
                </a>
              ))}
              <button
                type="button"
                onClick={openEditor}
                className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-100 transition hover:bg-violet-500/20"
              >
                Edit portfolio
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-5 lg:px-7">
            <div className="mb-5 flex items-center gap-4 text-sm">
              <span className="font-mono uppercase tracking-[0.32em] text-white/65">Tier 1</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/72">Crown Jewels</span>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <ProjectCard project={featured} large />
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-5 lg:px-7">
            <div className="mb-4 flex items-center gap-4 text-sm">
              <span className="font-mono uppercase tracking-[0.32em] text-white/65">Deploy</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/72">Vercel steps</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {siteContent.deploySteps.map((step, index) => (
                <article key={`${step.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.26em] text-white/35">Step {index + 1}</div>
                  <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/54">{step.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-white/45 lg:px-7">
            <span>
              {stats[0].value} {stats[0].label}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openEditor}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/72 transition hover:bg-white/10"
              >
                Get in Contact
              </button>
              <button
                type="button"
                onClick={openEditor}
                className="rounded-full bg-white px-4 py-2 text-xs font-medium text-zinc-900 transition hover:bg-white/90"
              >
                + Add Project
              </button>
            </div>
          </div>
        </section>

        <AssistantPanel />
      </div>

      {loginOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-white/35">Unlock editor</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Admin login</h2>
              </div>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/65"
              >
                Close
              </button>
            </div>
            <LoginForm
              nextPath="/admin"
              onSuccess={() => {
                setLoginOpen(false);
                setIsUnlocked(true);
                setEditorOpen(true);
              }}
            />
          </div>
        </div>
      ) : null}

      {editorOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditorOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[920px] overflow-y-auto border-l border-white/10 bg-bg shadow-glow">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-bg/95 px-5 py-4 backdrop-blur">
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-white/35">Private editor</div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">Edit text, links, and images live</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
              >
                Done
              </button>
            </div>
            <div className="p-5">
              <AdminDashboard initialProjects={projects} onProjectsChange={setProjects} />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-white/12 bg-panel shadow-glow transition hover:border-white/18 ${
        large ? "xl:col-span-2" : ""
      }`}
    >
      <div
        className={`relative border-b border-white/10 ${large ? "h-[320px]" : "h-[220px]"}`}
        style={{ background: project.imageUrl }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_46%)] opacity-0 transition group-hover:opacity-100" />
        <div className="absolute inset-0 bg-black/12" />
        <div className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/66">
          {project.tier}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold tracking-tight text-white">{project.name}</h3>
            <p className="mt-1 text-sm text-white/48">{project.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <CardLink href={project.githubUrl} icon="github" />
            <CardLink href={project.youtubeUrl} icon="youtube" />
            <CardLink href={project.docsUrl} icon="doc" />
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-white/58">{project.description}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-md border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${badgeClass(project.accent)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CardLink({ href, icon }: { href?: string; icon: "github" | "youtube" | "doc" }) {
  const isDisabled = !href;
  const className =
    "flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition " +
    (isDisabled ? "cursor-not-allowed text-white/25" : "text-white/60 hover:bg-white/10 hover:text-white");

  if (!href) {
    return (
      <span className={className} aria-disabled="true">
        <Icon name={icon} />
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      <Icon name={icon} />
    </a>
  );
}
