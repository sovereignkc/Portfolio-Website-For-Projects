"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContactLink, DeployStep, Project } from "../../lib/site-content";

type DashboardContent = {
  projects: Project[];
  contacts: ContactLink[];
  deploySteps: DeployStep[];
};

type Props = {
  initialContent: DashboardContent;
  onContentChange?: (content: DashboardContent) => void;
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

const emptyContact: ContactLink = {
  label: "Contact",
  href: "mailto:you@example.com",
  description: "Short contact description",
  icon: "send"
};

const emptyDeployStep: DeployStep = {
  title: "Deploy step",
  body: "Describe the deployment step here."
};

export function AdminDashboard({ initialContent, onContentChange }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialContent.projects);
  const [contacts, setContacts] = useState<ContactLink[]>(initialContent.contacts);
  const [deploySteps, setDeploySteps] = useState<DeployStep[]>(initialContent.deploySteps);
  const [status, setStatus] = useState<string>("Ready");
  const hasMounted = useRef(false);

  const preview = useMemo(
    () =>
      JSON.stringify(
        {
          projects,
          contacts,
          deploySteps
        },
        null,
        2
      ),
    [projects, contacts, deploySteps]
  );

  useEffect(() => {
    onContentChange?.({ projects, contacts, deploySteps });
  }, [projects, contacts, deploySteps, onContentChange]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      void save("Auto-saved");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [projects, contacts, deploySteps]);

  function updateProject(index: number, patch: Partial<Project>) {
    setProjects((current) =>
      current.map((project, currentIndex) => (currentIndex === index ? { ...project, ...patch } : project))
    );
  }

  function updateContact(index: number, patch: Partial<ContactLink>) {
    setContacts((current) =>
      current.map((contact, currentIndex) => (currentIndex === index ? { ...contact, ...patch } : contact))
    );
  }

  function updateDeployStep(index: number, patch: Partial<DeployStep>) {
    setDeploySteps((current) =>
      current.map((step, currentIndex) => (currentIndex === index ? { ...step, ...patch } : step))
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

  function addContact() {
    setContacts((current) => [...current, { ...emptyContact }]);
  }

  function addDeployStep() {
    setDeploySteps((current) => [...current, { ...emptyDeployStep }]);
  }

  async function save(nextStatus = "Saved") {
    setStatus("Saving...");
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects, contacts, deploySteps })
    });

    setStatus(response.ok ? nextStatus : "Save failed");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <SectionTitle title="Project cards" subtitle="Front image, links, and doc buttons" />
        <div className="space-y-4">
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

        <SectionTitle title="Contacts" subtitle="Clickable contact links for the header/footer" />
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={`${contact.label}-${index}`} className="glass rounded-3xl border border-white/10 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium">{contact.label}</div>
                <button
                  type="button"
                  onClick={() => setContacts((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-100"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Label" value={contact.label} onChange={(value) => updateContact(index, { label: value })} />
                <Field label="Href" value={contact.href} onChange={(value) => updateContact(index, { href: value })} />
                <Field
                  label="Description"
                  value={contact.description}
                  onChange={(value) => updateContact(index, { description: value })}
                />
                <Field label="Icon" value={contact.icon} onChange={(value) => updateContact(index, { icon: value as ContactLink["icon"] })} />
              </div>
            </div>
          ))}
          <button type="button" onClick={addContact} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
            + Add contact
          </button>
        </div>

        <SectionTitle title="Vercel steps" subtitle="Editable deployment checklist" />
        <div className="space-y-3">
          {deploySteps.map((step, index) => (
            <div key={`${step.title}-${index}`} className="glass rounded-3xl border border-white/10 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium">Step {index + 1}</div>
                <button
                  type="button"
                  onClick={() => setDeploySteps((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-100"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Title"
                  value={step.title}
                  onChange={(value) => updateDeployStep(index, { title: value })}
                />
                <Field
                  label="Body"
                  value={step.body}
                  onChange={(value) => updateDeployStep(index, { body: value })}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addDeployStep} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
            + Add step
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
