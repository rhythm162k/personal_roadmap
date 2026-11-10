const PH = {
  1: ["Phase 1 · Foundation", "Talk to real businesses, design the data, and make CI the first thing that runs."],
  2: ["Phase 2 · Build the product", "Requests, scheduling, technicians, quotes and invoices. Tests ship with every feature."],
  3: ["Phase 3 · Production", "Hardening, deployment, custom domain and a real pilot."],
  4: ["Phase 4 · Launch and sell", "Turn the project into an offer a business owner can say yes to."],
  5: ["Later · Scale and grow", "Unlock after launch, or once a paying customer or budget exists."],
};
const weeks = [
  {
    ph: 1, t: "Validate, spec, schema and CI", tag: "Foundation", c: "green",
    d: "Find a real design-partner business before writing features. CI runs from the first commit.",
    tasks: [
      ["Talk to 2-3 repair or home-service businesses", 3, "AC, appliance repair, cleaning. How do requests arrive today (phone, WhatsApp, notebook)? What gets lost? What would they pay monthly? Ask one to be my design partner."],
      ["Write a 1-page spec with a cut line", 2, "Must-have, should-have, not-now. Define 'sellable' in five bullets."],
      ["Design the schema on paper first", 5, "Businesses, users + roles, customers, service types, requests, jobs, job events, quotes + lines, invoices, payments, attachments. business_id + RLS like Kin CRM. Draw the ERD first."],
      ["Scaffold the monorepo and Docker Compose", 4, "Reuse Kin CRM's structure. API, web, Postgres, Redis, MinIO; env validated with Zod."],
      ["GitHub Actions CI from day one", 5, "Lint, typecheck, test, build on every PR with a Postgres service. Protect main, use PRs even solo."],
      ["Seed realistic demo data", 3, "An AC repair shop in Dhaka (BDT) and a cleaning company abroad (another currency and time zone). It proves the product isn't Bangladesh-only."],
      ["Keep applying + write ADR-001 (tenancy)", 2, "Five applications. One paragraph on why business_id + RLS and what I rejected."],
    ],
    x: "Why a business_id column with RLS instead of a database per business? When would I change my mind?",
    cv: "Designed a multi-tenant service-management schema with PostgreSQL RLS; CI runs __ tests against a Postgres service on every pull request.",
  },
  {
    ph: 2, t: "Auth, tenants and service requests", tag: "Core build", c: "blue",
    d: "Customers can ask for a service; the business can't see anyone else's data. Write the tests as each feature lands.",
    tasks: [
      ["Auth, roles and permissions", 4, "Owner, technician, customer. Reuse Kin CRM's JWT-cookie pattern and re-test it here."],
      ["Public business page and service request form", 5, "Service type, description, address, preferred time. Guest request with phone number first; mobile-first; Zod on client and server."],
      ["Photo upload with presigned URLs", 4, "MinIO locally, S3 later. Validate type and size, compress on upload."],
      ["Request lifecycle state machine and event log", 5, "new → reviewed → quoted → scheduled → in progress → completed → paid / cancelled. Illegal jumps rejected; every change logged."],
      ["Cross-tenant isolation tests", 3, "Business A's owner, technician and customer must never read or change business B's data. These run in CI forever."],
      ["Keep applying + ADR on the request state machine", 2, "List each state, who may move it, and why."],
    ],
    x: "A customer guesses another request's ID in the URL. What stops them, and which test proves it?",
    cv: "Built role-based service-request workflow with an auditable state machine; __ cross-tenant isolation tests run in CI.",
  },
  {
    ph: 2, t: "Dashboard, scheduling and caching", tag: "Core build", c: "orange",
    d: "The owner's daily screen, and the part recruiters will actually be impressed by: scheduling without double-booking.",
    tasks: [
      ["Owner dashboard: request inbox", 5, "Filter by status, date, phone. Request detail, status changes."],
      ["Technician management and job assignment", 3, "Add technicians, assign a request, see each technician's load."],
      ["Scheduling without double-booking", 6, "Day and week view. Prevent overlapping jobs per technician in the database (Postgres range type + exclusion constraint), not only in the UI. Test with concurrent requests."],
      ["Time zones done right", 2, "Store UTC, show in each business's time zone."],
      ["Seed 10k jobs, read EXPLAIN, add indexes", 3, "Keep before/after query plans."],
      ["Redis cache-aside for dashboard stats", 4, "TTL plus explicit invalidation on job changes. Count hits and misses so I can show it working."],
      ["Demo the dashboard to my design-partner business", 2, "Watch them use it. Write down every confusion."],
      ["Keep applying + ADR on caching", 2, "What I cache, for how long, and what stale data costs."],
    ],
    x: "Two requests are booked for the same technician at the same instant. What does my database do, and how did I prove it?",
    cv: "Prevented technician double-booking with a Postgres exclusion constraint; Redis cache-aside cut dashboard p95 from __ ms to __ ms.",
  },
  {
    ph: 2, t: "Technician app, jobs queue and first AWS deploy", tag: "Core build", c: "green",
    d: "Field staff update jobs from their phones, customers track progress, slow work moves to a queue, and it goes live on AWS.",
    tasks: [
      ["Technician mobile view", 6, "Today's jobs, status updates, notes, before/after photos. A responsive web page, not a native app."],
      ["Customer tracking page", 5, "Magic link or login: status timeline, scheduled time, quote and payment status."],
      ["BullMQ queue and worker", 4, "Separate container. Learn retries, backoff, failed jobs, and why jobs must be idempotent."],
      ["Email notifications and appointment reminders as jobs", 5, "Request received, scheduled, completed, plus a delayed reminder before the visit. Channel behind an interface so SMS or WhatsApp can be added later."],
      ["Create the AWS account, guardrails first", 2, "The free-plan clock starts at sign-up, so do it now. Budget alert, MFA, no daily root use."],
      ["First deploy: EC2 + Docker Compose + Nginx", 6, "Deploy by hand once to feel every step; automate in Week 7."],
      ["Keep applying + write a debugging story", 2, "The double-booking bug I prevented (or caused), as a short STAR story."],
    ],
    x: "A worker crashes after sending 3 of 5 reminders. What happens on restart, and why does nobody get two?",
    cv: "Built BullMQ pipeline for notifications and delayed reminders with idempotent workers; deployed on AWS EC2 with Docker.",
  },
  {
    ph: 2, t: "Quotes, invoices and payment records", tag: "Core build", c: "pink",
    d: "The money flow. If the schedule slips, shrink this week first: simple line-item quotes, skip PDF invoices.",
    tasks: [
      ["Quotation builder", 6, "Line items (labour, parts), tax, per-business currency. Server computes totals; customer approves or rejects."],
      ["Money correctness", 2, "Integer minor units, rounding rules, tests for edge cases."],
      ["Invoice and printable PDF", 4, "Generated from the approved quote. Make it print well on A4."],
      ["Manual payment records", 4, "Cash, bank transfer, bKash/Nagad TrxID. Balance due. Behind a provider interface so a real gateway fits later."],
      ["Reports: revenue, jobs by status, technician workload", 4, "Cached or materialised."],
      ["Rate limiting and spam protection on public forms", 3, "Redis limiter, honeypot field, per-IP caps."],
      ["Show the quote-to-invoice flow to the design partner", 2, "Does it match how they actually charge?"],
      ["Keep applying + diagram the async and money flows", 2, "request → quote → job → invoice → payment."],
    ],
    x: "Why store money as integers, and what happens if a quote is edited after the customer approves it?",
    cv: "Implemented quote-to-invoice workflow with integer-cent money handling and audit trail; reports cached in Redis.",
  },
  {
    ph: 3, t: "Hardening, E2E tests and observability", tag: "Production", c: "blue",
    d: "Observable, secure, tested end to end, and ready for people outside Bangladesh.",
    tasks: [
      ["Playwright: request → quote → schedule → complete → paid", 5, "One real-browser journey in CI, traces kept on failure."],
      ["Structured logs, request IDs, health endpoints", 4, "pino JSON logs; one ID follows a request through API, DB and worker."],
      ["Security pass against OWASP API Top 10", 5, "Tenant isolation, file upload validation, mass assignment, cookie and CORS flags, npm audit."],
      ["English + Bangla UI, per-business currency and time zone", 4, "i18n strings, formatted dates and money. This is what makes 'tweak for an international client' a config change."],
      ["Production Docker images", 3, "Small, non-root, env validated at boot."],
      ["Load test with k6 and write down the numbers", 4, "Dashboard with cache off and on, then the request form. Find what breaks first."],
      ["Error tracking and CloudWatch alarms", 3, "Free-tier Sentry plus 5xx, CPU and disk alarms.", 1],
      ["Keep applying + record a 3-minute walkthrough", 2, "Architecture plus live demo."],
    ],
    x: "Trace a request from the browser to Postgres and back. Where can each step fail?",
    cv: "Playwright E2E in CI; load-tested to __ req/s; OWASP API Top 10 review including cross-tenant tests.",
  },
  {
    ph: 3, t: "CD, domain and backups", tag: "Production", c: "orange",
    d: "Merge to main deploys automatically, on a real domain, with backups I've actually restored.",
    tasks: [
      ["CD: GitHub Actions → ECR → EC2 with OIDC", 5, "Merge to main deploys. OIDC role assumption, not long-lived AWS keys."],
      ["Postgres backups and a real restore drill", 4, "RDS or container plus scripted backups. Restore into a fresh instance and time it."],
      ["S3 + CloudFront for photos and the frontend", 4, "Private bucket, origin access, cache headers, least-privilege IAM."],
      ["Custom domain and HTTPS end to end", 4, "Registrar → nameservers → DNS → ACM → CloudFront → HTTPS redirect. Use a cheap domain or the client's."],
      ["Real-phone test on slow mobile data", 3, "Technician view and request form on a mid-range Android, throttled network."],
      ["Keep applying + ADR on the deploy pipeline", 2, "What triggers a deploy, how I roll back."],
    ],
    x: "A bad deploy goes out at 2am. How do I know, and how do I roll back?",
    cv: "CI/CD to AWS via GitHub Actions + OIDC; Postgres backups with tested restore in __ min; CloudFront + ACM HTTPS on a custom domain.",
  },
  {
    ph: 4, t: "Template it, pilot it, sell it", tag: "Launch", c: "",
    d: "Turn a project into a product a business owner can buy, and write down what I'd charge.",
    tasks: [
      ["One business config for branding and rules", 5, "Logo, colours, service types, currency, time zone, language, notification channel. Goal: a new business in under a day without touching core code."],
      ["Re-skin for a second business type", 4, "AC repair to cleaning. Any core-code change I needed is a bug to fix."],
      ["Pilot with one real business", 6, "Import their real services and customers, train them for an hour, watch them use it."],
      ["Fix the top five pilot issues", 5, "Only what blocked or confused them."],
      ["README, architecture diagram, demo video, live link", 4, "Keep demo data seeded so the live demo is never empty."],
      ["Define the offer and where to find buyers", 3, "Setup fee, monthly care plan, hosting included. Go direct with a demo first; use Upwork, Freelancer and LinkedIn as a second channel."],
      ["Update CV, portfolio, LinkedIn with real numbers + keep applying", 3, "Replace every __ with something I measured. Ask the pilot for a testimonial."],
    ],
    x: "Pitch this to a repair-shop owner in 60 seconds, then to an engineering manager in 60 seconds. What changes?",
    cv: "Built and launched a multi-tenant service-management platform; onboarded a business in __ hours (live link, pilot client).",
  },
  {
    ph: 5, later: 1, t: "SPOF-proof the architecture", tag: "Scale", c: "blue",
    d: "Do this when a customer pays or budget exists. Labs run for a day, then get torn down: load balancers bill by the hour.",
    tasks: [
      ["Map every single point of failure", 2, "One instance, one DB, one AZ, one DNS provider, one Redis. Rank by likelihood and impact."],
      ["Lab: load balancer + two app instances in two AZs", 5, "Kill one instance, watch traffic continue. Tear down the same day."],
      ["Lab: RDS Multi-AZ failover", 3, "Trigger a failover, measure downtime, compare cost with a snapshot restore."],
      ["Infrastructure as Code (Terraform or CDK)", 6, "Rebuild everything from code, destroy it, rebuild."],
      ["Zero-downtime deploys", 4, "Deploy during a k6 run and watch for errors."],
      ["Disaster recovery runbook with real RTO/RPO", 3, "Restore into a fresh environment, time it, write the steps."],
      ["Containers on ECS Fargate", 6, "Task definitions, services, autoscaling.", 1],
    ],
    x: "If the instance, the database or a whole AZ dies tonight, what happens to a technician mid-job?",
    cv: "Rebuilt production with Terraform; Multi-AZ failover tested at __ s downtime; documented RTO __ / RPO __.",
  },
  {
    ph: 5, later: 1, t: "Payments, messaging, AI and growth", tag: "Grow", c: "orange",
    d: "What turns one pilot into a business. AI is deliberately here, not in v1.",
    tasks: [
      ["Real payment gateway in sandbox", 8, "Stripe for international, SSLCOMMERZ or bKash for Bangladesh. Signed webhooks, idempotent handlers."],
      ["SMS or WhatsApp reminders", 5, "Check provider pricing and rules first; plug into the notification interface."],
      ["Self-serve business onboarding", 8, "Sign up, pick a theme, add services, map a domain."],
      ["AI request triage assistant", 6, "Reads the customer's description, suggests a service type and urgency; the owner confirms. A place to learn RAG and MCP properly."],
      ["Technician PWA with offline notes", 5, "Installable, works on weak signal.", 1],
    ],
    x: "Which webhook can arrive twice or out of order, and what stops it from corrupting a payment record?",
    cv: "Integrated a payment gateway with signed, idempotent webhooks; self-serve onboarding cut setup to __ minutes.",
  },
];
const STORAGE_KEY = "build-mode-roadmap-v3";
let state = loadState();
function loadState() {
  try {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        done: {},
        notes: {},
      }
    );
  } catch (e) {
    return { done: {}, notes: {} };
  }
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
  updateProgress();
}
function taskId(w, t) {
  return `w${w}-t${t}`;
}
const isDone = (wi, ti) => !!state.done[taskId(wi, ti)];
const core = (wi) =>
  weeks[wi].tasks.map((t, i) => [t, i]).filter(([t]) => !t[3]);
const launch = () => weeks.map((w, i) => i).filter((i) => !weeks[i].later);
function totalTasks() {
  return launch().reduce((n, i) => n + core(i).length, 0);
}
function completed() {
  return launch().reduce(
    (n, i) => n + core(i).filter(([, ti]) => isDone(i, ti)).length,
    0,
  );
}
function updateProgress() {
  const total = totalTasks(),
    done = completed(),
    pct = Math.round((done / total) * 100);
  document.getElementById("progressPercent").textContent = pct + "%";
  document.getElementById("overallBar").style.width = pct + "%";
  document.getElementById("progressLabel").textContent =
    `${done} of ${total} core tasks completed`;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("remainingCount").textContent = total - done;
  document.querySelectorAll(".week-card").forEach((card) => {
    const wi = Number(card.dataset.week),
      c = core(wi),
      n = c.filter(([, ti]) => isDone(wi, ti)).length;
    card.querySelector(".mini-track span").style.width =
      Math.round((n / c.length) * 100) + "%";
    card.querySelector(".week-progress").textContent =
      `${n}/${c.length} core done`;
  });
}
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}
function hereWeek() {
  return launch().find((i) => core(i).some(([, ti]) => !isDone(i, ti)));
}
function renderWeeks() {
  const h = hereWeek();
  let lastPh = 0,
    out = "";
  weeks.forEach((w, wi) => {
    if (w.ph !== lastPh) {
      lastPh = w.ph;
      out += `<div class="phase-head${w.later ? " later" : ""}"><h3>${PH[w.ph][0]}</h3><p>${PH[w.ph][1]}</p></div>`;
    }
    const tasks = w.tasks
      .map((t, ti) => {
        const id = taskId(wi, ti),
          d = isDone(wi, ti);
        return `<div><label class="task ${d ? "done" : ""}${t[3] ? " bonus" : ""}"><input type="checkbox" data-id="${id}" ${d ? "checked" : ""}><span class="task-copy"><span class="task-title">${t[0]}</span><span class="task-meta">◷ ${t[1]} h${t[3] ? " · bonus" : ""} · ${t[2]}</span></span></label>${state.notes[id] ? `<div class="task-note">✎ ${escapeHtml(state.notes[id])}</div>` : ""}<button class="btn" style="margin:0 0 3px 29px;padding:4px 9px;font-size:10px" data-note="${id}">${state.notes[id] ? "Edit session note" : "+ Add session note"}</button></div>`;
      })
      .join("");
    const hrs = core(wi).reduce((n, [t]) => n + t[1], 0);
    const sib = weeks.filter((x) => x.ph === w.ph),
      wide = sib.length % 2 === 1 && sib[sib.length - 1] === w;
    out += `<article class="week-card${w.later ? " later" : ""}${wide ? " wide" : ""}" data-week="${wi}"><div class="week-top"><div><div class="week-num">WEEK ${String(wi + 1).padStart(2, "0")}${wi === h ? '<span class="here">I are here</span>' : ""}</div><h3>${w.t}</h3></div><span class="pill ${w.c}">${w.tag}</span></div><p class="desc">${w.d}</p><div class="mini-track"><span></span></div><div class="task-list">${tasks}</div><details class="proof"><summary>Explain-back and CV line</summary><p><b>Be able to answer:</b> ${w.x}</p><p><b>CV line I'm earning:</b> ${w.cv}</p></details><div class="week-footer"><span class="week-progress"></span><span>~${hrs} h core</span></div></article>`;
  });
  document.getElementById("weekGrid").innerHTML = out;
  updateProgress();
}
function toast(m) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = m;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
document.getElementById("weekGrid").addEventListener("change", (e) => {
  if (!e.target.matches('input[type="checkbox"]')) return;
  const id = e.target.dataset.id,
    wi = Number(id.match(/\d+/)[0]);
  state.done[id] = e.target.checked;
  save();
  e.target.closest(".task").classList.toggle("done", e.target.checked);
  if (e.target.checked && core(wi).every(([, ti]) => isDone(wi, ti)))
    toast(`Week ${wi + 1} shipped. Nice.`);
});
let currentNoteId = null;
document.getElementById("weekGrid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-note]");
  if (!b) return;
  currentNoteId = b.dataset.note;
  const [w, t] = currentNoteId.match(/\d+/g).map(Number);
  document.getElementById("noteTaskTitle").textContent = weeks[w].tasks[t][0];
  document.getElementById("noteText").value = state.notes[currentNoteId] || "";
  document.getElementById("noteModal").classList.add("show");
});
document.getElementById("closeNote").onclick = () =>
  document.getElementById("noteModal").classList.remove("show");
document.getElementById("saveNote").onclick = () => {
  const val = document.getElementById("noteText").value.trim();
  if (val) state.notes[currentNoteId] = val;
  else delete state.notes[currentNoteId];
  save();
  renderWeeks();
  document.getElementById("noteModal").classList.remove("show");
};
document.getElementById("tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tab]");
  if (!b) return;
  document
    .querySelectorAll(".tabs button")
    .forEach((x) => x.classList.toggle("active", x === b));
  document
    .querySelectorAll(".panel")
    .forEach((x) => x.classList.toggle("active", x.id === b.dataset.tab));
});
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob(
    [
      JSON.stringify(
        { version: 1, exportedAt: new Date().toISOString(), state },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "build-mode-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
document.getElementById("importBtn").onclick = () =>
  document.getElementById("importFile").click();
document.getElementById("importFile").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    const incoming = data.state || data;
    if (!incoming.done || !incoming.notes) throw Error("Invalid file");
    state = incoming;
    save();
    renderWeeks();
    alert("Progress imported.");
  } catch (err) {
    alert(
      "Could not import this progress file. Choose a valid Build Mode JSON export.",
    );
  }
  e.target.value = "";
};
document.getElementById("resetBtn").onclick = () => {
  if (
    confirm(
      "Reset all completed tasks and notes on this browser? Export my progress first if I want a backup.",
    )
  ) {
    state = { done: {}, notes: {} };
    save();
    renderWeeks();
  }
};
renderWeeks();

const vids = [
  ["CI/CD with GitHub Actions", "github actions node.js postgres ci cd tutorial"],
  ["Docker Compose: Node, Postgres, Redis", "docker compose node postgres redis tutorial"],
  ["Prevent double booking in PostgreSQL", "postgresql exclusion constraint prevent double booking"],
  ["Time zones in Postgres and JavaScript", "postgresql timestamptz time zones best practices"],
  ["State machines in TypeScript", "typescript state machine order workflow tutorial"],
  ["Redis cache-aside in Node", "redis cache aside node.js tutorial"],
  ["PostgreSQL EXPLAIN and indexes", "postgresql explain analyze indexes tutorial"],
  ["BullMQ background and delayed jobs", "bullmq node.js delayed jobs queue tutorial"],
  ["Generate PDF invoices in Node", "node.js generate pdf invoice tutorial"],
  ["React i18n with i18next", "react i18next tutorial"],
  ["AWS EC2 + IAM, deploy a Docker app", "aws ec2 iam deploy docker compose"],
  ["CloudFront + S3 + ACM + custom domain", "aws cloudfront s3 acm custom domain https"],
  ["Playwright end-to-end tests", "playwright e2e testing tutorial"],
  ["k6 load testing", "k6 load testing tutorial"],
  ["Terraform on AWS", "terraform aws beginner tutorial"],
  ["Multi-AZ, load balancers, failover", "aws high availability multi az load balancer"],
];
const docs = [
  ["AWS Free Tier", "Check eligibility", "https://aws.amazon.com/free/"],
  ["GitHub Actions", "CI/CD", "https://docs.github.com/en/actions"],
  ["AWS documentation", "Cloud", "https://docs.aws.amazon.com/"],
  [
    "AWS Well-Architected",
    "Architecture",
    "https://aws.amazon.com/architecture/well-architected/",
  ],
  ["Redis docs", "Caching", "https://redis.io/docs/latest/"],
  ["BullMQ", "Queues", "https://docs.bullmq.io/"],
  ["PostgreSQL docs", "Database", "https://www.postgresql.org/docs/"],
  ["Drizzle ORM", "ORM", "https://orm.drizzle.team/docs/overview"],
  ["pgvector (later: AI)", "Vector search", "https://github.com/pgvector/pgvector"],
  [
    "MCP introduction",
    "AI tools",
    "https://modelcontextprotocol.io/docs/getting-started/intro",
  ],
  [
    "MCP TypeScript SDK",
    "AI tools",
    "https://github.com/modelcontextprotocol/typescript-sdk",
  ],
  ["Playwright", "E2E tests", "https://playwright.dev/docs/intro"],
  ["Grafana k6", "Load testing", "https://k6.io/docs/"],
  [
    "OWASP API Security",
    "Security",
    "https://owasp.org/www-project-api-security/",
  ],
  [
    "Terraform tutorials",
    "IaC",
    "https://developer.hashicorp.com/terraform/tutorials",
  ],
  ["Docker 101", "Containers", "https://www.docker.com/101-tutorial/"],
  ["System Design Roadmap", "Architecture", "https://roadmap.sh/system-design"],
  ["Postgres range types", "Scheduling", "https://www.postgresql.org/docs/current/rangetypes.html"],
  ["Nodemailer", "Email", "https://nodemailer.com/"],
  ["i18next", "Translations", "https://www.i18next.com/"],
];
document.getElementById("vidList").innerHTML = vids
  .map(
    (v) =>
      `<a class="resource" href="https://www.youtube.com/results?search_query=${encodeURIComponent(v[1])}" target="_blank" rel="noopener">${v[0]} <span>▶ Watch ↗</span></a>`,
  )
  .join("");
document.getElementById("docList").innerHTML = docs
  .map(
    (d) =>
      `<a class="resource" href="${d[2]}" target="_blank" rel="noopener">${d[0]} <span>${d[1]} ↗</span></a>`,
  )
  .join("");
const tabsEl = document.getElementById("tabs");
tabsEl.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tab]");
  if (b) history.replaceState(null, "", "#" + b.dataset.tab);
});
{
  const b = tabsEl.querySelector('[data-tab="' + location.hash.slice(1) + '"]');
  if (b) b.click();
}
const nm = document.getElementById("noteModal");
nm.addEventListener("click", (e) => {
  if (e.target === nm) nm.classList.remove("show");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") nm.classList.remove("show");
});
