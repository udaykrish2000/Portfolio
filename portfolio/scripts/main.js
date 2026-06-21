/* ==========================================================================
   Uday Krishna — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================================== */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------------------
     Loader
  --------------------------------------------------------------------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    if (!loader) return;
    setTimeout(() => loader.classList.add("is-hidden"), 450);
  });

  /* ---------------------------------------------------------------------
     Theme switcher (dark default, persists for session)
  --------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try { sessionStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  (function initTheme() {
    let saved = "dark";
    try { saved = sessionStorage.getItem(THEME_KEY) || "dark"; } catch (e) { /* ignore */ }
    applyTheme(saved);
  })();

  themeToggle?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });

  /* ---------------------------------------------------------------------
     Custom cursor spotlight (desktop only)
  --------------------------------------------------------------------- */
  const spotlight = $("#cursorSpotlight");
  const cursorDot = $("#cursorDot");
  if (spotlight && cursorDot && matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", (e) => {
      spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  /* ---------------------------------------------------------------------
     Mouse parallax on hero blobs
  --------------------------------------------------------------------- */
  const heroSection = $("#home");
  const blobs = $$(".bg-blob");
  if (heroSection && !reduceMotion) {
    heroSection.addEventListener("pointermove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((blob, i) => {
        const depth = (i + 1) * 8;
        blob.style.translate = `${x * depth}px ${y * depth}px`;
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll / reading progress bar
  --------------------------------------------------------------------- */
  const progressBar = $("#progressBar");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progressBar) progressBar.style.width = `${scrolled}%`;
  }
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------------------------------------------------------------------
     Header: active link + mobile menu + back-to-top visibility
  --------------------------------------------------------------------- */
  const navLinks = $$(".nav-links a");
  const sections = $$("section[id]");
  const menuToggle = $("#menuToggle");
  const navLinksEl = $("#navLinks");

  menuToggle?.addEventListener("click", () => {
    const open = navLinksEl.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinksEl?.addEventListener("click", (e) => {
    if (e.target.tagName === "A") navLinksEl.classList.remove("is-open");
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach((s) => navObserver.observe(s));

  /* ---------------------------------------------------------------------
     Hero typing effect
  --------------------------------------------------------------------- */
  const typeTarget = $("#typeTarget");
  const roles = ["Frontend Developer", "Angular Developer", "UI Engineer", "Problem Solver"];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tickType() {
    if (!typeTarget) return;
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typeTarget.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) { deleting = true; setTimeout(tickType, 1500); return; }
    } else {
      charIndex--;
      typeTarget.textContent = current.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(tickType, deleting ? 40 : 80);
  }
  if (typeTarget) reduceMotion ? (typeTarget.textContent = roles[0]) : tickType();

  /* ---------------------------------------------------------------------
     Hero particles canvas
  --------------------------------------------------------------------- */
  const canvas = $("#particleCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function makeParticles() {
      const count = Math.min(60, Math.floor(canvas.offsetWidth / 18));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.6 + 0.6) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        a: Math.random() * 0.5 + 0.15,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); makeParticles(); draw();
    window.addEventListener("resize", () => { resize(); makeParticles(); });
  }

  /* ---------------------------------------------------------------------
     Generic reveal-on-scroll
  --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  $$(".reveal, .reveal-stagger").forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     Skills: tab filter + animated bars
  --------------------------------------------------------------------- */
  const tabButtons = $$(".tab-btn");
  const skillCards = $$(".skill-card");
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector(".skill-bar-fill");
        if (fill) fill.style.width = `${fill.dataset.level}%`;
      }
    });
  }, { threshold: 0.4 });
  skillCards.forEach((c) => barObserver.observe(c));

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.cat;
      skillCards.forEach((card) => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.style.display = show ? "" : "none";
        if (show) {
          const fill = card.querySelector(".skill-bar-fill");
          if (fill) requestAnimationFrame(() => { fill.style.width = `${fill.dataset.level}%`; });
        }
      });
    });
  });

  /* ---------------------------------------------------------------------
     Animated counters (achievements)
  --------------------------------------------------------------------- */
  const counters = $$(".stat-num");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.innerHTML = `${value}<span class="plus">${suffix}</span>`;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------------------------------------------------------------------
     Projects: search + filter + modal
  --------------------------------------------------------------------- */
  const projectCards = $$(".project-card");
  const projectChips = $$(".chip[data-filter]");
  const searchInput = $("#projectSearch");
  let activeFilter = "all";

  function applyProjectFilters() {
    const query = (searchInput?.value || "").toLowerCase().trim();
    projectCards.forEach((card) => {
      const matchesFilter = activeFilter === "all" || card.dataset.tags.includes(activeFilter);
      const matchesSearch = !query || card.dataset.search.includes(query);
      card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
    });
  }
  projectChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      projectChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = chip.dataset.filter;
      applyProjectFilters();
    });
  });
  searchInput?.addEventListener("input", applyProjectFilters);

  const modalOverlay = $("#projectModal");
  const modalBody = $("#projectModalBody");
  function openProjectModal(card) {
    if (!modalOverlay || !modalBody) return;
    modalBody.innerHTML = `
      <h3 class="section-title" style="font-size:24px;margin-bottom:10px;">${card.dataset.title}</h3>
      <p class="section-sub" style="margin-bottom:18px;">${card.dataset.full}</p>
      <div class="project-stack" style="margin-bottom:22px;">${card.dataset.tagsDisplay.split(",").map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="project-actions">
        <a class="btn btn-ghost btn-sm" href="${card.dataset.github}" target="_blank" rel="noopener noreferrer">View code</a>
        <a class="btn btn-primary btn-sm" href="${card.dataset.demo}" target="_blank" rel="noopener noreferrer">Live demo</a>
      </div>`;
    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    $(".modal-close", modalOverlay)?.focus();
  }
  function closeProjectModal() {
    modalOverlay?.classList.remove("is-open");
    modalOverlay?.setAttribute("aria-hidden", "true");
  }
  projectCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      openProjectModal(card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openProjectModal(card);
    });
  });
  $("#projectModalClose")?.addEventListener("click", closeProjectModal);
  modalOverlay?.addEventListener("click", (e) => { if (e.target === modalOverlay) closeProjectModal(); });

  /* ---------------------------------------------------------------------
     3D tilt on project cards (desktop)
  --------------------------------------------------------------------- */
  if (matchMedia("(hover: hover)").matches && !reduceMotion) {
    projectCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------------
     ATS ring + breakdown bars
  --------------------------------------------------------------------- */
  const atsRing = $("#atsRingFill");
  const atsSection = $("#resume");
  const atsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (atsRing) {
          const circumference = 2 * Math.PI * 32;
          const score = 94;
          atsRing.style.strokeDasharray = `${circumference}`;
          atsRing.style.strokeDashoffset = `${circumference - (score / 100) * circumference}`;
        }
        $$(".ats-fill").forEach((f) => { f.style.width = `${f.dataset.level}%`; });
        atsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (atsSection) atsObserver.observe(atsSection);

  /* ---------------------------------------------------------------------
     Testimonials carousel
  --------------------------------------------------------------------- */
  const slidesTrack = $("#testimonialSlides");
  const dots = $$(".carousel-dot");
  let slideIndex = 0;
  function goToSlide(i) {
    const total = dots.length;
    slideIndex = (i + total) % total;
    if (slidesTrack) slidesTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === slideIndex));
  }
  dots.forEach((dot, idx) => dot.addEventListener("click", () => goToSlide(idx)));
  $("#carouselPrev")?.addEventListener("click", () => goToSlide(slideIndex - 1));
  $("#carouselNext")?.addEventListener("click", () => goToSlide(slideIndex + 1));
  if (dots.length && !reduceMotion) {
    setInterval(() => goToSlide(slideIndex + 1), 6000);
  }

  /* ---------------------------------------------------------------------
     Contact form (mailto-based, client-validated)
  --------------------------------------------------------------------- */
  const contactForm = $("#contactForm");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cf-name").value.trim();
    const email = $("#cf-email").value.trim();
    const subject = $("#cf-subject").value.trim();
    const message = $("#cf-message").value.trim();
    const status = $("#formStatus");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let valid = true;
    const setError = (id, msg) => { const el = $(`#err-${id}`); if (el) el.textContent = msg; if (msg) valid = false; };
    setError("name", name ? "" : "Enter your name.");
    setError("email", emailOk ? "" : "Enter a valid email address.");
    setError("message", message.length >= 10 ? "" : "Message should be at least 10 characters.");

    if (!valid) return;

    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const mailto = `mailto:uday.krishna.dev@gmail.com?subject=${encodeURIComponent(subject || "Portfolio inquiry from " + name)}&body=${body}`;
    window.location.href = mailto;
    if (status) status.textContent = "Opening your email client…";
    contactForm.reset();
  });

  /* ---------------------------------------------------------------------
     Button ripple
  --------------------------------------------------------------------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------------------------
     Command palette (Ctrl/Cmd + K)
  --------------------------------------------------------------------- */
  const cmdkOverlay = $("#cmdk");
  const cmdkInput = $("#cmdkInput");
  const cmdkList = $("#cmdkList");
  const commands = [
    { label: "Go to Home", href: "#home" },
    { label: "Go to About", href: "#about" },
    { label: "Go to Skills", href: "#skills" },
    { label: "Go to Experience", href: "#experience" },
    { label: "Go to Projects", href: "#projects" },
    { label: "Go to Certifications", href: "#certifications" },
    { label: "Go to Achievements", href: "#achievements" },
    { label: "Go to GitHub", href: "#github" },
    { label: "Go to Resume", href: "#resume" },
    { label: "Go to Testimonials", href: "#testimonials" },
    { label: "Go to Contact", href: "#contact" },
    { label: "Download Resume (PDF)", action: () => $("#downloadResume")?.click() },
    { label: "Toggle Dark / Light Theme", action: () => themeToggle?.click() },
    { label: "Open GitHub Profile", href: "https://github.com/udaykrish2000", external: true },
    { label: "Open LinkedIn Profile", href: "https://linkedin.com/in/uday-krishna-nemala-66044a19a", external: true },
  ];
  let cmdkActive = 0;

  function renderCmdk(filter = "") {
    const q = filter.toLowerCase();
    const filtered = commands.filter((c) => c.label.toLowerCase().includes(q));
    cmdkList.innerHTML = filtered.length
      ? filtered.map((c, i) => `<li class="cmdk-item${i === cmdkActive ? " is-active" : ""}" data-idx="${i}" role="option">${c.label}<kbd>${c.external ? "↗" : "↵"}</kbd></li>`).join("")
      : `<li class="cmdk-empty">No matching commands</li>`;
    return filtered;
  }
  let currentFiltered = commands;

  function openCmdk() {
    cmdkOverlay.classList.add("is-open");
    cmdkOverlay.setAttribute("aria-hidden", "false");
    cmdkInput.value = "";
    cmdkActive = 0;
    currentFiltered = renderCmdk();
    setTimeout(() => cmdkInput.focus(), 50);
  }
  function closeCmdk() {
    cmdkOverlay.classList.remove("is-open");
    cmdkOverlay.setAttribute("aria-hidden", "true");
  }
  function runCommand(cmd) {
    if (!cmd) return;
    closeCmdk();
    if (cmd.action) { cmd.action(); return; }
    if (cmd.external) { window.open(cmd.href, "_blank", "noopener"); return; }
    $(cmd.href)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      cmdkOverlay.classList.contains("is-open") ? closeCmdk() : openCmdk();
    }
    if (e.key === "Escape") { closeCmdk(); closeProjectModal(); }
    if (cmdkOverlay.classList.contains("is-open")) {
      if (e.key === "ArrowDown") { e.preventDefault(); cmdkActive = Math.min(cmdkActive + 1, currentFiltered.length - 1); currentFiltered = renderCmdk(cmdkInput.value); }
      if (e.key === "ArrowUp") { e.preventDefault(); cmdkActive = Math.max(cmdkActive - 1, 0); currentFiltered = renderCmdk(cmdkInput.value); }
      if (e.key === "Enter") { e.preventDefault(); runCommand(currentFiltered[cmdkActive]); }
    }
  });
  $("#cmdkTrigger")?.addEventListener("click", openCmdk);
  cmdkOverlay?.addEventListener("click", (e) => { if (e.target === cmdkOverlay) closeCmdk(); });
  cmdkInput?.addEventListener("input", () => { cmdkActive = 0; currentFiltered = renderCmdk(cmdkInput.value); });
  cmdkList?.addEventListener("click", (e) => {
    const item = e.target.closest(".cmdk-item");
    if (!item) return;
    runCommand(currentFiltered[parseInt(item.dataset.idx, 10)]);
  });

  /* ---------------------------------------------------------------------
     Back to top
  --------------------------------------------------------------------- */
  $("#backToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     GitHub: live fetch with graceful static fallback
  --------------------------------------------------------------------- */
  const GITHUB_USERNAME = "udaykrish2000"; // change to your real GitHub username
  const repoGrid = $("#repoGrid");
  const githubNote = $("#githubNote");

  const fallbackRepos = [
    { name: "angular-dashboard-kit", description: "Reusable Angular admin dashboard with chart widgets and role-based routing.", language: "TypeScript", stars: 24 },
    { name: "ngx-form-builder", description: "Schema-driven dynamic form generator for Angular reactive forms.", language: "TypeScript", stars: 17 },
    { name: "task-flow-app", description: "Drag-and-drop task management app with offline support.", language: "JavaScript", stars: 12 },
    { name: "ngo-outreach-site", description: "Accessible marketing site for a nonprofit, built with semantic HTML and SCSS.", language: "HTML", stars: 9 },
  ];
  const langColors = { TypeScript: "#3178c6", JavaScript: "#eab308", HTML: "#e34c26", CSS: "#06b6d4", SCSS: "#7c3aed" };

  function renderRepos(repos) {
    if (!repoGrid) return;
    repoGrid.innerHTML = repos.slice(0, 4).map((r) => `
      <div class="repo-card">
        <span class="repo-name">${r.name}</span>
        <p class="repo-desc">${r.description || "No description provided."}</p>
        <div class="repo-meta">
          <span><span class="lang-dot" style="background:${langColors[r.language] || "#94a3b8"}"></span>${r.language || "—"}</span>
          <span>★ ${r.stars ?? 0}</span>
        </div>
      </div>`).join("");
  }

  function renderHeatmap() {
    const heatmap = $("#heatmap");
    if (!heatmap) return;
    const weeks = 53;
    let html = "";
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const intensity = Math.random();
        const level = intensity > 0.85 ? 4 : intensity > 0.65 ? 3 : intensity > 0.4 ? 2 : intensity > 0.2 ? 1 : 0;
        const colors = ["var(--card-soft)", "#0e4429", "#006d32", "#26a641", "#39d353"];
        html += `<div class="heatmap-cell" style="background:${colors[level]}"></div>`;
      }
    }
    heatmap.innerHTML = html;
  }
  renderHeatmap();
  renderRepos(fallbackRepos);

  if (GITHUB_USERNAME) {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
      .then((res) => { if (!res.ok) throw new Error("GitHub API unavailable"); return res.json(); })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          renderRepos(data.map((r) => ({ name: r.name, description: r.description, language: r.language, stars: r.stargazers_count })));
          if (githubNote) githubNote.textContent = `Live data fetched from github.com/${GITHUB_USERNAME}`;
        }
      })
      .catch(() => {
        if (githubNote) githubNote.textContent = "Showing cached repository data — live GitHub API request was unavailable.";
      });
  }

  /* ---------------------------------------------------------------------
     Init: trigger filters/bars on load for above-the-fold content
  --------------------------------------------------------------------- */
  applyProjectFilters();
})();
