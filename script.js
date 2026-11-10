const weeks = [
  {
    t: "Validate the workflow and set the foundation", tag: "Plan + setup", c: "green",
    d: "I learn how one real business operates, then shape the smallest useful product around that workflow.",
    tasks: [
      ["Interview two service-business owners", 2, "Map how requests arrive, how jobs are assigned, how schedules change and how payments are recorded."],
      ["Write the v1 scope and acceptance criteria", 1, "Define one complete path: request → review → schedule → job update → quote/payment status. Record what is explicitly out of scope."],
      ["Design the schema and tenant boundary", 2, "Draw the ERD for businesses, users, customers, services, requests, jobs, assignments, quotes and payment records."],
      ["Create the app skeleton and local environment", 2, "React + TypeScript, Express, Drizzle, PostgreSQL, Zod, Docker Compose, env validation and health endpoint."],
      ["Implement business context, auth and roles", 2, "Reuse proven patterns from Kin CRM; enforce business-scoped access in server code and database policies."],
    ],
    x: "Can I explain the real business workflow, the v1 boundary and how every tenant-owned record is isolated?",
    cv: "Designed and implemented a multi-tenant service-management application using React, TypeScript, Express and PostgreSQL."
  },
  {
    t: "Public service pages and request intake", tag: "Core workflow", c: "pink",
    d: "A customer can discover a service and submit a real request without needing an account.",
    tasks: [
      ["Build configurable public service pages", 2, "Show the business profile, service categories, contact details, hours and service area."],
      ["Build the public service-request form", 2, "Collect contact details, service type, problem description, address and preferred time; validate with Zod."],
      ["Add safe photo uploads", 2, "Validate file type and size, use generated object keys, store metadata and keep private files private."],
      ["Create the request API and status state machine", 2, "Validate transitions on the server; prevent invalid state jumps and record status history."],
      ["Build the owner request inbox", 2, "List, filter and inspect incoming requests; allow the owner to accept, reject or request more information."],
    ],
    x: "What stops an unauthorised user from changing another business’s request or uploading an unsafe file?",
    cv: "Built validated customer request intake, secure file uploads and a status-driven admin workflow."
  },
  {
    t: "Scheduling and technician assignment", tag: "Core workflow", c: "blue",
    d: "The owner can assign work without creating overlapping bookings or relying on fragile browser-only checks.",
    tasks: [
      ["Add technician and availability records", 2, "Model staff membership, working hours, time off and job assignment."],
      ["Build a simple day/week schedule view", 2, "Show assigned jobs and status; keep the UI functional before polishing the calendar."],
      ["Prevent double-booking in PostgreSQL", 2, "Use a time-range/exclusion constraint where appropriate; handle the database conflict cleanly in the API."],
      ["Handle time zones consistently", 2, "Store instants in UTC, keep the business time zone as configuration and format dates at the edges."],
      ["Test concurrent booking attempts", 2, "Send overlapping requests concurrently and prove that only a valid booking succeeds."],
    ],
    x: "Two requests try to reserve the same technician at the same time. Which database rule rejects the conflict?",
    cv: "Implemented database-enforced technician scheduling with time-zone-safe handling and concurrency tests."
  },
  {
    t: "Technician workflow and customer tracking", tag: "Core workflow", c: "orange",
    d: "The assigned technician can do the work from a phone, while the customer can follow progress securely.",
    tasks: [
      ["Build the technician mobile job view", 2, "Show today’s assigned jobs, customer notes, address, contact details and current status."],
      ["Add job updates and completion notes", 2, "Support allowed transitions, timestamps and before/after photos where needed."],
      ["Build secure customer tracking", 2, "Use authenticated access or a high-entropy, expiring, revocable tracking token; expose only customer-safe fields."],
      ["Show a customer-facing status timeline", 2, "Display scheduled time, progress, approved quote and payment status without leaking internal notes."],
      ["Add audit events for important changes", 2, "Record who changed assignment, schedule, quote or status, and when."],
    ],
    x: "What can a customer see, what must stay internal, and how can a tracking link be revoked?",
    cv: "Built a mobile-first technician workflow, secure customer tracking and auditable job updates."
  },
  {
    t: "Quotes, payment records and notifications", tag: "Business workflow", c: "green",
    d: "I complete the business flow with simple money handling and reliable notifications.",
    tasks: [
      ["Build a simple line-item quotation", 2, "Labour and parts; calculate totals on the server and freeze the approved quote version."],
      ["Handle money correctly", 1, "Store integer minor units, define rounding and currency rules, and test edge cases."],
      ["Record manual payments", 2, "Cash, bank transfer or mobile financial service reference; calculate outstanding balance on the server."],
      ["Add a Redis-backed background worker", 2, "Use BullMQ for email jobs; learn retries, backoff, failed jobs and idempotent processing."],
      ["Send status emails and appointment reminders", 2, "Use templates and a provider adapter; make retries safe so duplicate emails are controlled."],
    ],
    x: "If a worker crashes and retries a notification, what prevents duplicate side effects?",
    cv: "Implemented quote and payment records with integer minor-unit money handling and retry-safe background notifications."
  },
  {
    t: "Testing, security and first deployment", tag: "Production", c: "blue",
    d: "I make the main journey testable, observable and deployable before inviting a real business.",
    tasks: [
      ["Write integration tests for the critical workflow", 2, "Cover request creation, tenant isolation, scheduling conflicts, status transitions, quote approval and payment records."],
      ["Add one Playwright end-to-end journey", 2, "Test request → owner review → schedule → technician update → customer tracking."],
      ["Set up GitHub Actions CI", 2, "Run lint, type checks, unit/integration tests and build on pull requests; protect main."],
      ["Complete an OWASP-focused security pass", 2, "Check authorization, tenant leakage, rate limits, file uploads, secrets, cookies, CORS and mass assignment."],
      ["Add logs, request IDs and health checks", 2, "Use structured logs and an error boundary; make failures diagnosable without logging sensitive data."],
    ],
    x: "Can I trace a failing request across the browser, API, database and worker, and can CI catch a regression?",
    cv: "Added CI, integration and browser tests, tenant-isolation checks and structured application logging."
  },
  {
    t: "Pilot, feedback and launch", tag: "Ship it", c: "orange",
    d: "I deploy a stable demo, test it with a business and turn the work into credible evidence.",
    tasks: [
      ["Deploy a production-like pilot environment", 2, "Use a cost-checked AWS EC2 + Docker path or a reliable managed host; configure HTTPS, secrets and backups."],
      ["Run a backup and restore drill", 2, "Create a backup, restore it into a fresh database and record the actual recovery steps and time."],
      ["Onboard one pilot business or run two owner reviews", 2, "Configure services and branding; watch the workflow being used and capture friction points."],
      ["Fix the three highest-impact problems", 2, "Prioritise blockers and confusing steps over extra features or cosmetic polish."],
      ["Measure performance and inspect database queries", 2, "Seed realistic data, inspect EXPLAIN ANALYZE, add justified indexes and record baseline timings."],
      ["Record the demo, update CV and pitch the product", 2, "Publish README, architecture diagram, demo video and live link; include only measured outcomes and approved testimonials."],
      ["Day 50: review the build and define the next iteration", 1, "Write what shipped, what failed, what the pilot taught me and the three highest-value improvements for the next release."],
    ],
    x: "Can I demo the full workflow to a business owner and explain the architecture, security and trade-offs to an engineering interviewer?",
    cv: "Deployed and piloted a multi-tenant service-management platform; measured workflow, reliability and performance outcomes."
  }
];

const STORAGE_KEY = "build-mode-roadmap-v4";
let state = loadState();
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { done: {}, notes: {} };
  } catch {
    return { done: {}, notes: {} };
  }
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  updateProgress();
}
function taskId(w, t) { return `w${w}-t${t}`; }
const isDone = (wi, ti) => !!state.done[taskId(wi, ti)];
function totalTasks() { return weeks.reduce((n, w) => n + w.tasks.length, 0); }
function completed() {
  return weeks.reduce((n, w, wi) => n + w.tasks.filter((_, ti) => isDone(wi, ti)).length, 0);
}
function updateProgress() {
  const total = totalTasks(), done = completed(), pct = Math.round(done / total * 100);
  document.getElementById("progressPercent").textContent = pct + "%";
  document.getElementById("overallBar").style.width = pct + "%";
  document.getElementById("progressLabel").textContent = `${done} of ${total} core tasks completed`;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("remainingCount").textContent = total - done;
  document.querySelectorAll(".week-card").forEach(card => {
    const wi = Number(card.dataset.week), n = weeks[wi].tasks.filter((_, ti) => isDone(wi, ti)).length;
    card.querySelector(".mini-track span").style.width = Math.round(n / weeks[wi].tasks.length * 100) + "%";
    card.querySelector(".week-progress").textContent = `${n}/${weeks[wi].tasks.length} tasks done`;
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
}
function renderWeeks() {
  const firstIncomplete = weeks.findIndex((w, wi) => w.tasks.some((_, ti) => !isDone(wi, ti)));
  let out = "";
  weeks.forEach((w, wi) => {
    const tasks = w.tasks.map((t, ti) => {
      const id = taskId(wi, ti), d = isDone(wi, ti);
      return `<div><label class="task ${d ? "done" : ""}"><input type="checkbox" data-id="${id}" ${d ? "checked" : ""}><span class="task-copy"><span class="task-title">${escapeHtml(t[0])}</span><span class="task-meta">◷ ${t[1]}h · ${escapeHtml(t[2])}</span></span></label>${state.notes[id] ? `<div class="task-note">✎ ${escapeHtml(state.notes[id])}</div>` : ""}<button class="btn" style="margin:0 0 3px 29px;padding:4px 9px;font-size:10px" data-note="${id}">${state.notes[id] ? "Edit session note" : "+ Add session note"}</button></div>`;
    }).join("");
    const hrs = w.tasks.reduce((n, t) => n + t[1], 0);
    out += `<article class="week-card" data-week="${wi}"><div class="week-top"><div><div class="week-num">WEEK ${String(wi + 1).padStart(2, "0")}${wi === firstIncomplete ? '<span class="here">CURRENT FOCUS</span>' : ""}</div><h3>${escapeHtml(w.t)}</h3></div><span class="pill ${w.c}">${escapeHtml(w.tag)}</span></div><p class="desc">${escapeHtml(w.d)}</p><div class="mini-track"><span></span></div><div class="task-list">${tasks}</div><details class="proof"><summary>Explain-back and CV line</summary><p><b>Be able to answer:</b> ${escapeHtml(w.x)}</p><p><b>CV line I’m working towards:</b> ${escapeHtml(w.cv)}</p></details><div class="week-footer"><span class="week-progress"></span><span>~${hrs}h total</span></div></article>`;
  });
  document.getElementById("weekGrid").innerHTML = out;
  updateProgress();
}
function toast(message) {
  const el = document.createElement("div");
  el.className = "toast"; el.textContent = message;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2500);
}
document.getElementById("weekGrid").addEventListener("change", e => {
  if (!e.target.matches('input[type="checkbox"]')) return;
  const id = e.target.dataset.id, wi = Number(id.match(/\d+/)[0]);
  state.done[id] = e.target.checked; save();
  e.target.closest(".task").classList.toggle("done", e.target.checked);
  if (e.target.checked && weeks[wi].tasks.every((_, ti) => isDone(wi, ti))) toast(`Week ${wi + 1} complete.`);
});
let currentNoteId = null;
document.getElementById("weekGrid").addEventListener("click", e => {
  const button = e.target.closest("[data-note]");
  if (!button) return;
  currentNoteId = button.dataset.note;
  const [w, t] = currentNoteId.match(/\d+/g).map(Number);
  document.getElementById("noteTaskTitle").textContent = weeks[w].tasks[t][0];
  document.getElementById("noteText").value = state.notes[currentNoteId] || "";
  document.getElementById("noteModal").classList.add("show");
});
document.getElementById("closeNote").onclick = () => document.getElementById("noteModal").classList.remove("show");
document.getElementById("saveNote").onclick = () => {
  const value = document.getElementById("noteText").value.trim();
  if (value) state.notes[currentNoteId] = value; else delete state.notes[currentNoteId];
  save(); renderWeeks(); document.getElementById("noteModal").classList.remove("show");
};
document.getElementById("tabs").addEventListener("click", e => {
  const button = e.target.closest("button[data-tab]");
  if (!button) return;
  document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("active", x === button));
  document.querySelectorAll(".panel").forEach(x => x.classList.toggle("active", x.id === button.dataset.tab));
  history.replaceState(null, "", "#" + button.dataset.tab);
});
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "build-mode-progress.json"; a.click(); URL.revokeObjectURL(url);
};
document.getElementById("importBtn").onclick = () => document.getElementById("importFile").click();
document.getElementById("importFile").onchange = async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text()), incoming = data.state || data;
    if (!incoming.done || !incoming.notes) throw new Error("Invalid progress file");
    state = incoming; save(); renderWeeks(); alert("Progress imported.");
  } catch { alert("I could not import this file. Choose a valid Build Mode JSON export."); }
  e.target.value = "";
};
document.getElementById("resetBtn").onclick = () => {
  if (confirm("Reset all completed tasks and notes in this browser? Export a backup first if needed.")) {
    state = { done: {}, notes: {} }; save(); renderWeeks();
  }
};
renderWeeks();

const videos = [
  ["GitHub Actions CI for Node and React", "github actions node react ci tutorial"],
  ["PostgreSQL exclusion constraints and range types", "postgresql exclusion constraint range types prevent double booking"],
  ["PostgreSQL transactions and EXPLAIN ANALYZE", "postgresql explain analyze indexes practical tutorial"],
  ["Redis and BullMQ background jobs", "node js bullmq redis background jobs retries idempotency"],
  ["Playwright end-to-end testing", "playwright end to end testing typescript tutorial"],
  ["OWASP API security testing", "owasp api security top 10 practical testing"],
  ["Docker Compose production deployment", "docker compose production node postgres nginx deployment"],
  ["AWS EC2 IAM and S3 practical deployment", "aws ec2 iam s3 deploy docker application tutorial"],
  ["RAG with PostgreSQL and pgvector", "rag postgres pgvector embeddings tutorial typescript"],
  ["MCP server with TypeScript", "model context protocol typescript sdk build mcp server tutorial"],
  ["LLM tool calling and structured outputs", "llm tool calling structured outputs typescript tutorial"],
  ["Evaluating RAG and AI agents", "rag evaluation retrieval evaluation prompt injection tutorial"],
];
const docs = [
  ["GitHub Actions", "CI/CD", "https://docs.github.com/en/actions"],
  ["PostgreSQL range types", "Scheduling", "https://www.postgresql.org/docs/current/rangetypes.html"],
  ["PostgreSQL constraints", "Data integrity", "https://www.postgresql.org/docs/current/ddl-constraints.html"],
  ["Drizzle ORM", "Database", "https://orm.drizzle.team/docs/overview"],
  ["Redis docs", "Cache + queues", "https://redis.io/docs/latest/"],
  ["BullMQ", "Background jobs", "https://docs.bullmq.io/"],
  ["Playwright", "E2E testing", "https://playwright.dev/docs/intro"],
  ["OWASP API Security", "Security", "https://owasp.org/www-project-api-security/"],
  ["AWS documentation", "Cloud", "https://docs.aws.amazon.com/"],
  ["AWS pricing calculator", "Cost checks", "https://calculator.aws/"],
  ["pgvector", "Vector search", "https://github.com/pgvector/pgvector"],
  ["MCP introduction", "Tool protocol", "https://modelcontextprotocol.io/docs/getting-started/intro"],
  ["MCP TypeScript SDK", "MCP implementation", "https://github.com/modelcontextprotocol/typescript-sdk"],
  ["OpenAI API docs", "LLM integration", "https://platform.openai.com/docs/"],
  ["OWASP Top 10 for LLM Applications", "AI security", "https://owasp.org/www-project-top-10-for-large-language-model-applications/"],
  ["roadmap.sh System Design", "Architecture", "https://roadmap.sh/system-design"],
  ["Docker docs", "Containers", "https://docs.docker.com/"],
];
document.getElementById("vidList").innerHTML = videos.map(v =>
  `<a class="resource" href="https://www.youtube.com/results?search_query=${encodeURIComponent(v[1])}" target="_blank" rel="noopener">${escapeHtml(v[0])}<span>▶ Watch ↗</span></a>`
).join("");
document.getElementById("docList").innerHTML = docs.map(d =>
  `<a class="resource" href="${d[2]}" target="_blank" rel="noopener">${escapeHtml(d[0])}<span>${escapeHtml(d[1])} ↗</span></a>`
).join("");
const noteModal = document.getElementById("noteModal");
noteModal.addEventListener("click", e => { if (e.target === noteModal) noteModal.classList.remove("show"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") noteModal.classList.remove("show"); });
const initialTab = document.querySelector(`.tabs button[data-tab="${location.hash.slice(1)}"]`);
if (initialTab) initialTab.click();
