const PH = {
  1: [
    "Phase 1 · Foundation",
    "Decide what you're building, and make CI the first thing that runs.",
  ],
  2: [
    "Phase 2 · Build the store",
    "Catalog, checkout and the merchant's daily work.",
  ],
  3: [
    "Phase 3 · Smart and safe",
    "The AI assistant, then the production work that makes it trustworthy.",
  ],
  4: [
    "Phase 4 · Launch and sell",
    "Turn the project into a template and put it in front of a real shop.",
  ],
  5: [
    "Later · Scale and grow",
    "Unlock after launch, or once a paying customer or budget exists.",
  ],
};
const weeks = [
  {
    ph: 1,
    t: "Spec, schema and CI",
    tag: "Foundation",
    c: "green",
    d: "Decide what you're building before you build it. CI runs from the very first commit.",
    tasks: [
      [
        "Interview 2 real shop owners (jersey, cloth or eyewear)",
        3,
        "Ask how they take orders today, what eats their time, what they'd pay monthly. Their words become your spec.",
      ],
      [
        "Write a 1-page spec with a cut line",
        2,
        "Must-have, should-have, not-now. Define 'sellable' in five bullets.",
      ],
      [
        "Design the schema on paper first",
        5,
        "Stores, products, variants (JSONB attributes), inventory, orders, order events. store_id + RLS like your CRM. Draw the ERD, then let AI review it.",
      ],
      [
        "Scaffold the monorepo and Docker Compose",
        4,
        "API, web, Postgres (pgvector image), Redis, MinIO. One command boots everything; env validated with Zod.",
      ],
      [
        "GitHub Actions CI from day one",
        5,
        "Lint, typecheck, test, build on every PR with a Postgres service. Protect main and use PRs even solo.",
      ],
      [
        "Seed realistic Bangladeshi demo data",
        3,
        "A jersey, a clothing and an eyewear store. BDT prices, Bangla and English names.",
      ],
      [
        "Keep applying + write ADR-001 (why store_id tenancy)",
        2,
        "Five applications. One paragraph on the decision and the alternative you rejected.",
      ],
    ],
    x: "Why a store_id column with RLS instead of a database per shop? When would you change your mind?",
    cv: "Designed a multi-tenant commerce schema with PostgreSQL RLS; CI runs __ tests against a Postgres service on every pull request.",
  },
  {
    ph: 2,
    t: "Catalog, storefront and caching",
    tag: "Core build",
    c: "blue",
    d: "Merchants add products, customers find them fast. Redis goes in where it earns its place.",
    tasks: [
      [
        "Merchant auth and roles",
        3,
        "Reuse the JWT-cookie and role pattern from your CRM, and re-test it here.",
      ],
      [
        "Product CRUD with variants and per-store attributes",
        6,
        "Jersey: size, version, name/number print. Eyewear: frame colour, lens type. Attribute schema lives in store config; Zod on client and server.",
      ],
      [
        "Image upload with presigned URLs",
        4,
        "MinIO locally, S3 later, same code. Compress on upload: mobile data in Bangladesh isn't free.",
      ],
      [
        "Storefront: home, category, product page, search",
        6,
        "Mobile-first, Bangla + English. Postgres full-text plus pg_trgm for typos. Cursor pagination.",
      ],
      [
        "Seed 10k products, read EXPLAIN, add indexes",
        3,
        "Keep before/after query plans. Without volume you learn nothing.",
      ],
      [
        "Redis cache-aside for catalog reads",
        4,
        "TTL plus explicit invalidation on product edits. Count hits and misses so you can show it working.",
      ],
      [
        "Open Graph share cards for products",
        2,
        "Many shops get traffic from Facebook and Messenger shares, so the preview matters.",
        1,
      ],
      [
        "Keep applying + ADR on cache invalidation",
        2,
        "Record what you cache, for how long, and what stale data costs.",
      ],
    ],
    x: "A merchant changes a price. How does the cached page become correct again, and what might a customer see meanwhile?",
    cv: "Implemented Redis cache-aside with TTL and event-based invalidation; cut product-list p95 from __ ms to __ ms.",
  },
  {
    ph: 2,
    t: "Checkout, orders and first AWS deploy",
    tag: "Core build",
    c: "orange",
    d: "The workflow that must never be wrong, then your first real deployment.",
    tasks: [
      [
        "Cart with server-side pricing",
        4,
        "Client sends product IDs and quantities only. Server computes prices, shipping, total.",
      ],
      [
        "Phone-first guest checkout with COD",
        4,
        "Name, phone (01XXXXXXXXX), district, address. No account required; COD is the default.",
      ],
      [
        "Transactional order creation and stock deduction",
        6,
        "One transaction, conditional UPDATE or row lock. Test: 20 simultaneous orders for 5 items.",
      ],
      [
        "Idempotency key on order placement",
        2,
        "A double tap on slow 4G must not create two orders.",
      ],
      [
        "Order state machine and event log",
        4,
        "placed → confirmed → packed → shipped → delivered / cancelled / returned. Illegal jumps rejected; every change logged.",
      ],
      [
        "Create the AWS account, guardrails first",
        2,
        "Do this now, not earlier: the free plan clock starts at sign-up. Budget alert, MFA, no daily root use.",
      ],
      [
        "First deploy: EC2 + Docker Compose + Nginx",
        6,
        "One small instance running everything. Deploy by hand once so you feel every step; automate in Week 6.",
      ],
      [
        "Keep applying + write a debugging story",
        2,
        "The overselling bug you prevented (or caused), as a short STAR story.",
      ],
    ],
    x: "Two customers buy the last jersey at the same instant. What does your database do, and how did you prove it?",
    cv: "Built transactional checkout with idempotency keys; zero overselling across __ concurrent orders; deployed on AWS EC2 with Docker.",
  },
  {
    ph: 2,
    t: "Merchant operations and background jobs",
    tag: "Core build",
    c: "green",
    d: "Make the merchant's day work, and move slow or retryable work off the request path.",
    tasks: [
      [
        "Merchant order dashboard",
        5,
        "Filter by status, date, phone. Order detail, status changes, printable invoice or packing slip.",
      ],
      [
        "BullMQ queue and worker",
        4,
        "Separate container. Learn retries, backoff, failed-job handling, and why jobs must be idempotent.",
      ],
      [
        "Order notifications as jobs",
        4,
        "Email first (free tier of a transactional email service). SMS and WhatsApp usually cost money, so hide the channel behind an interface.",
      ],
      [
        "Manual bKash/Nagad payment with TrxID",
        3,
        "Customer pays, enters TrxID, merchant verifies. Payments sit behind a provider interface for a real gateway later.",
      ],
      [
        "CSV product import as a background job",
        4,
        "Batch inserts, row-level error report, visible progress. Never block an HTTP request.",
      ],
      [
        "Rate limiting and fake-COD signals",
        3,
        "Redis limiter on checkout. Flag repeat numbers and many cancellations from one phone.",
      ],
      [
        "Playwright: browse → checkout → merchant fulfils",
        5,
        "One real-browser journey in CI, traces kept on failure.",
      ],
      [
        "Courier sandbox booking (Steadfast or Pathao)",
        4,
        "Check current API docs and merchant requirements first. Sandbox only, behind an interface.",
        1,
      ],
      [
        "Keep applying + diagram the async flow",
        2,
        "producer → queue → worker → result.",
      ],
    ],
    x: "A worker crashes halfway through 500 emails. What happens on restart, and why does nobody get two?",
    cv: "Built a BullMQ pipeline (notifications, CSV import) with retries and idempotent workers; Playwright E2E tests run in CI.",
  },
  {
    ph: 3,
    t: "AI assistant: RAG, tools and MCP",
    tag: "AI",
    c: "pink",
    d: "The heaviest week. If it slips, move the MCP server to Week 8 instead of skipping the safety tests.",
    tasks: [
      [
        "Chat backend with a swappable LLM provider",
        5,
        "One adapter, chosen by config. Free tiers change often and may train on your data, so develop with fake data only.",
      ],
      [
        "Live-data tools as plain, tested functions",
        5,
        "search_products, get_product, check_stock, get_order_status (order number + phone), get_shipping_info. Zod inputs, store-scoped, read-only.",
      ],
      [
        "RAG over store policies and FAQs with pgvector",
        6,
        "Chunk, embed, retrieve, cite the source, say 'I don't know' when retrieval is weak. Store the embedding model name and dimension.",
      ],
      [
        "Chat widget",
        4,
        "Streaming, mobile-friendly, handles Bangla, English and Banglish, 'talk to a human' fallback with the shop's phone or WhatsApp.",
      ],
      [
        "Expose the tools through an MCP server",
        5,
        "TypeScript SDK, read-only, merchant-authenticated. Try it from an MCP client: 'how many orders are pending today?'",
      ],
      [
        "Eval set and safety tests",
        4,
        "30+ questions in three languages. Prompt injection, someone else's order, 'say it's free', runaway tool loops.",
      ],
      [
        "Cost and abuse guards",
        3,
        "Per-IP limits, max tool calls per turn, daily token budget, Redis-cached FAQ answers, kill switch in store config.",
      ],
      [
        "Keep applying + RAG vs tools vs MCP decision note",
        2,
        "When each is the right tool, in your own words.",
      ],
    ],
    x: "Why must your backend, not the model, decide who can see an order? Show the line of code that enforces it.",
    cv: "Built a tool-calling shopping assistant (pgvector RAG, read-only MCP server) in Bangla/English; evaluated on __ questions incl. prompt-injection and cross-customer access tests.",
  },
  {
    ph: 3,
    t: "Hardening, CD and custom domain",
    tag: "Production",
    c: "blue",
    d: "Observable, secure, automatically deployed, on a real domain. A long week.",
    tasks: [
      [
        "Structured logs, request IDs, health and readiness endpoints",
        4,
        "pino JSON logs; one ID follows a request through API, DB and worker.",
      ],
      [
        "Security pass against OWASP API Top 10",
        5,
        "Store A must never touch store B. Mass assignment, rate limits, cookie and CORS flags, npm audit.",
      ],
      [
        "CD: GitHub Actions → ECR → EC2 with OIDC",
        5,
        "Merge to main deploys. Use OIDC role assumption, not long-lived AWS keys.",
      ],
      [
        "Postgres on RDS, then a real restore drill",
        4,
        "Compare RDS with a container plus scripted backups. Either way, restore into a fresh instance and time it.",
      ],
      [
        "S3 + CloudFront for images and the frontend",
        4,
        "Private bucket, CloudFront origin access, cache headers, least-privilege IAM.",
      ],
      [
        "Custom domain and HTTPS end to end",
        4,
        "Registrar → nameservers → DNS records → ACM certificate → CloudFront → HTTPS redirect. Cloudflare DNS is free; domains aren't, so use a cheap one or the client's.",
      ],
      [
        "Load test with k6 and write down the numbers",
        4,
        "Product list with cache off and on, then checkout. Find what breaks first.",
      ],
      [
        "Error tracking and CloudWatch alarms",
        3,
        "Free-tier Sentry or similar, plus alarms for 5xx, CPU and disk. Break something on purpose and find it from logs.",
        1,
      ],
      [
        "Keep applying + record a 3-minute walkthrough",
        2,
        "Architecture plus live demo. Recruiters do watch these.",
      ],
    ],
    x: "Trace a request from the browser to Postgres and back: DNS, TLS, CloudFront, Nginx, Node, DB. Where can each step fail?",
    cv: "CI/CD to AWS via GitHub Actions + OIDC; RDS backups with tested restore; CloudFront + ACM HTTPS on a custom domain; load-tested to __ req/s.",
  },
  {
    ph: 4,
    t: "Template it, pilot it, package it",
    tag: "Launch",
    c: "",
    d: "Turn a project into a product a shop owner can buy.",
    tasks: [
      [
        "One store config file for theme and rules",
        5,
        "Colours, logo, attribute schema, delivery zones, languages, payment options. Goal: a new store in under a day without touching core code.",
      ],
      [
        "Re-skin for a second shop type",
        4,
        "Jersey store to eyewear. Any core-code change you needed is a bug to fix.",
      ],
      [
        "Pilot with one real shop",
        6,
        "Import their real products, train them for an hour, watch them use it. Note every confusion.",
      ],
      [
        "Fix the top five pilot issues",
        5,
        "Only what blocked or confused them.",
      ],
      [
        "README, architecture diagram, demo video, live link",
        4,
        "Your DeepWiki-style README format works. Keep demo data seeded so the live demo is never empty.",
      ],
      [
        "Define the offer",
        3,
        "Setup fee, monthly care plan, hosting and LLM costs included. Test the price with the shop owners from Week 1.",
      ],
      [
        "Update CV, portfolio, LinkedIn with real numbers + keep applying",
        3,
        "Replace every __ with something you measured.",
      ],
    ],
    x: "Pitch this to a shop owner in 60 seconds, then to an engineering manager in 60 seconds. What changes?",
    cv: "Built and launched a multi-store e-commerce platform for Bangladeshi online shops; onboarded a store in __ hours (live link).",
  },
  {
    ph: 5,
    later: 1,
    t: "SPOF-proof the architecture",
    tag: "Scale",
    c: "blue",
    d: "Do this when a customer pays or budget exists. Labs run for a day, then get torn down: load balancers bill by the hour.",
    tasks: [
      [
        "Map every single point of failure",
        2,
        "One instance, one DB, one AZ, one DNS provider, one Redis. Rank by likelihood and impact.",
      ],
      [
        "Lab: load balancer + two app instances in two AZs",
        5,
        "Health checks, kill one instance, watch traffic continue. Tear down the same day.",
      ],
      [
        "Lab: RDS Multi-AZ failover",
        3,
        "Trigger a failover, measure downtime, compare cost with a snapshot restore.",
      ],
      [
        "Infrastructure as Code (Terraform or CDK)",
        6,
        "Rebuild everything from code, destroy it, rebuild. Proof you can recover.",
      ],
      [
        "Zero-downtime deploys (rolling or blue/green)",
        4,
        "Deploy during a k6 run and watch for errors.",
      ],
      [
        "Disaster recovery runbook with real RTO/RPO",
        3,
        "Restore into a fresh environment, time it, write the steps.",
      ],
      [
        "Containers on ECS Fargate",
        6,
        "Task definitions, services, autoscaling. Know what you gain over hand-managed EC2.",
        1,
      ],
    ],
    x: "If the instance, the database or a whole AZ dies tonight, what happens to a customer mid-checkout?",
    cv: "Rebuilt production with Terraform; Multi-AZ failover tested at __ s downtime; documented RTO __ / RPO __.",
  },
  {
    ph: 5,
    later: 1,
    t: "Payments, couriers, onboarding",
    tag: "Grow",
    c: "orange",
    d: "What turns one pilot into a business.",
    tasks: [
      [
        "Real payment gateway in sandbox",
        8,
        "SSLCOMMERZ or bKash. Check merchant eligibility, fees and sandbox access first. Signed webhooks, idempotent handlers.",
      ],
      [
        "Courier integration with status sync",
        6,
        "Book parcels, pull delivery status on a schedule.",
      ],
      [
        "Self-serve store onboarding",
        8,
        "Merchant signs up, picks a theme, adds products, maps a domain.",
      ],
      [
        "Merchant analytics",
        5,
        "Daily sales, top products, repeat buyers; cached or materialised.",
      ],
      [
        "Chatbot v2: drafts actions, merchant approves",
        5,
        "The bot drafts a cancel or refund request; a human confirms. Never autonomous.",
      ],
    ],
    x: "Which webhook can arrive twice or out of order, and what stops it from corrupting an order?",
    cv: "Integrated a payment gateway with signed, idempotent webhooks; self-serve onboarding cut store setup to __ minutes.",
  },
];
const STORAGE_KEY = "build-mode-roadmap-v2";
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
    out += `<article class="week-card${w.later ? " later" : ""}${wide ? " wide" : ""}" data-week="${wi}"><div class="week-top"><div><div class="week-num">WEEK ${String(wi + 1).padStart(2, "0")}${wi === h ? '<span class="here">you are here</span>' : ""}</div><h3>${w.t}</h3></div><span class="pill ${w.c}">${w.tag}</span></div><p class="desc">${w.d}</p><div class="mini-track"><span></span></div><div class="task-list">${tasks}</div><details class="proof"><summary>Explain-back and CV line</summary><p><b>Be able to answer:</b> ${w.x}</p><p><b>CV line you're earning:</b> ${w.cv}</p></details><div class="week-footer"><span class="week-progress"></span><span>~${hrs} h core</span></div></article>`;
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
      "Reset all completed tasks and notes on this browser? Export your progress first if you want a backup.",
    )
  ) {
    state = { done: {}, notes: {} };
    save();
    renderWeeks();
  }
};
renderWeeks();

const vids = [
  [
    "CI/CD with GitHub Actions",
    "github actions node.js postgres ci cd tutorial",
  ],
  [
    "Docker Compose: Node, Postgres, Redis",
    "docker compose node postgres redis tutorial",
  ],
  ["Redis cache-aside in Node", "redis cache aside node.js tutorial"],
  ["AWS EC2 + IAM, deploy a Docker app", "aws ec2 iam deploy docker compose"],
  [
    "AWS VPC, subnets, security groups",
    "aws vpc explained subnets security groups",
  ],
  [
    "CloudFront + S3 + ACM + custom domain",
    "aws cloudfront s3 acm custom domain https",
  ],
  [
    "PostgreSQL EXPLAIN and indexes",
    "postgresql explain analyze indexes tutorial",
  ],
  ["BullMQ background jobs", "bullmq node.js queue tutorial"],
  ["Build an MCP server in TypeScript", "build mcp server typescript tutorial"],
  ["RAG with Postgres + pgvector", "rag pgvector postgres tutorial"],
  ["LLM tool calling and evals", "llm function calling evals tutorial"],
  ["k6 load testing", "k6 load testing tutorial"],
  ["Playwright end-to-end tests", "playwright e2e testing tutorial"],
  ["Terraform on AWS", "terraform aws beginner tutorial"],
  [
    "System design: e-commerce checkout",
    "system design e-commerce checkout inventory",
  ],
  [
    "Multi-AZ, load balancers, failover",
    "aws high availability multi az load balancer",
  ],
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
  ["pgvector", "Vector search", "https://github.com/pgvector/pgvector"],
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
  ["Ollama", "Local LLMs", "https://ollama.com/"],
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
