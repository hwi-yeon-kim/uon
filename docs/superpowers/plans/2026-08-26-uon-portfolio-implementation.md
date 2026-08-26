# u:on Portfolio GitHub Pages Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, dependency-free GitHub Pages portfolio site for the agency u:on, with a dark, minimal, blog-style layout, one real case study (sourced from the provided landing-page mockup) and two clearly-marked placeholder case studies.

**Architecture:** Pure HTML/CSS/JS, no build step. `js/projects-data.js` holds project metadata as a plain array; `js/main.js` renders it into `index.html`'s project grid. Each project detail page (`projects/*.html`) is an independent static HTML file. Both data files use the `typeof module !== 'undefined'` guard so their core logic is unit-testable with plain Node (no bundler, no test framework dependency).

**Tech Stack:** HTML5, CSS3 (CSS custom properties, Grid), vanilla JS (ES6), Node's built-in `assert` module for tests, macOS `sips` for image asset prep.

---

## Reference material already in the repo root

- `logo.png` — u:on wordmark (serif "u:on" with a two-dot colon), dark text.
- `Desktop.pdf` — real past landing page mockup for u:on's "여론 분석 플랫폼" (public-opinion analysis platform). Single tall page, 1200×5213px when rasterized.
- `docs/superpowers/specs/2026-08-26-uon-portfolio-design.md` — approved design spec for this plan.

---

### Task 1: Project skeleton and image assets

**Files:**
- Create dirs: `css/`, `js/`, `projects/`, `assets/images/`, `tests/`
- Create: `assets/images/logo.png` (copy of repo-root `logo.png`)
- Create: `assets/images/uon-voice-platform-full.jpg` (rasterized from `Desktop.pdf`)

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p css js projects assets/images tests
```

- [ ] **Step 2: Copy the logo into assets**

```bash
cp logo.png assets/images/logo.png
```

- [ ] **Step 3: Rasterize the PDF mockup into a web-sized JPEG**

```bash
sips -s format jpeg -s formatOptions 80 Desktop.pdf --out assets/images/uon-voice-platform-full.jpg
sips --resampleWidth 1000 assets/images/uon-voice-platform-full.jpg
```

- [ ] **Step 4: Verify the assets**

```bash
file assets/images/logo.png assets/images/uon-voice-platform-full.jpg
```

Expected: `assets/images/logo.png: PNG image data ...` and `assets/images/uon-voice-platform-full.jpg: JPEG image data ... 1000x4344 ...`

- [ ] **Step 5: Commit**

```bash
git add assets/images
git commit -m "Add u:on logo and rasterized case-study screenshot"
```

---

### Task 2: Base CSS — design tokens, reset, typography

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Write the base stylesheet**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0a0a0a;
  --bg-elevated: #141414;
  --text: #f5f5f0;
  --text-muted: #9a9a9a;
  --border: #262626;
  --accent-start: #3b5bfd;
  --accent-end: #a855f7;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --max-width: 1080px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.accent-text {
  background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

- [ ] **Step 2: Verify the tokens are present**

```bash
grep -c -- "--accent-start" css/style.css
grep -c -- "--font-serif" css/style.css
```

Expected: both commands print `1`.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add base design tokens and reset"
```

---

### Task 3: Project data layer (TDD)

**Files:**
- Create: `tests/projects-data.test.js`
- Create: `js/projects-data.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/projects-data.test.js
const assert = require('assert');
const PROJECTS = require('../js/projects-data.js');

assert.strictEqual(Array.isArray(PROJECTS), true, 'PROJECTS should be an array');
assert.strictEqual(PROJECTS.length, 3, 'PROJECTS should have exactly 3 entries');

const requiredFields = ['id', 'title', 'summary', 'tags', 'thumbnail', 'href', 'isPlaceholder'];
for (const project of PROJECTS) {
  for (const field of requiredFields) {
    assert.ok(field in project, `project ${project.id || '?'} missing field: ${field}`);
  }
  assert.strictEqual(Array.isArray(project.tags), true, `project ${project.id} tags should be an array`);
  assert.strictEqual(typeof project.title, 'string', `project ${project.id} title should be a string`);
  assert.ok(project.title.length > 0, `project ${project.id} title should not be empty`);
}

const realProjects = PROJECTS.filter((p) => !p.isPlaceholder);
assert.strictEqual(realProjects.length, 1, 'exactly one project should be marked as real (isPlaceholder: false)');
assert.strictEqual(realProjects[0].id, 'voice-of-public-platform');

console.log('PASS: projects-data.test.js');
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
node tests/projects-data.test.js
```

Expected: `Error: Cannot find module '../js/projects-data.js'`

- [ ] **Step 3: Implement the data file**

```javascript
// js/projects-data.js
const PROJECTS = [
  {
    id: 'voice-of-public-platform',
    title: '여론 분석 플랫폼',
    summary: '소셜 리스닝 데이터를 시각화하고 대응 시나리오를 시뮬레이션하는 여론 분석 SaaS 랜딩페이지',
    tags: ['Landing Page', 'SaaS', 'Data Viz'],
    thumbnail: 'assets/images/uon-voice-platform-full.jpg',
    href: 'projects/voice-of-public-platform.html',
    isPlaceholder: false
  },
  {
    id: 'sample-project-a',
    title: '샘플 프로젝트 A',
    summary: '이 카드는 예시 콘텐츠입니다. 실제 프로젝트 내용으로 교체해주세요.',
    tags: ['Web', 'Branding'],
    thumbnail: null,
    href: 'projects/sample-project-a.html',
    isPlaceholder: true
  },
  {
    id: 'sample-project-b',
    title: '샘플 프로젝트 B',
    summary: '이 카드는 예시 콘텐츠입니다. 실제 프로젝트 내용으로 교체해주세요.',
    tags: ['Mobile', 'Product'],
    thumbnail: null,
    href: 'projects/sample-project-b.html',
    isPlaceholder: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROJECTS;
}
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
node tests/projects-data.test.js
```

Expected: `PASS: projects-data.test.js`

- [ ] **Step 5: Commit**

```bash
git add tests/projects-data.test.js js/projects-data.js
git commit -m "Add project data layer with test coverage"
```

---

### Task 4: Project card renderer (TDD)

**Files:**
- Create: `tests/main.test.js`
- Create: `js/main.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/main.test.js
const assert = require('assert');
const { projectCardHTML } = require('../js/main.js');

const sampleProject = {
  id: 'test-project',
  title: 'Test Project',
  summary: 'A test summary',
  tags: ['Tag1', 'Tag2'],
  thumbnail: 'assets/images/test.png',
  href: 'projects/test-project.html',
  isPlaceholder: false
};

const html = projectCardHTML(sampleProject);
assert.ok(html.includes('Test Project'), 'card HTML should include the title');
assert.ok(html.includes('A test summary'), 'card HTML should include the summary');
assert.ok(html.includes('Tag1'), 'card HTML should include tags');
assert.ok(html.includes('projects/test-project.html'), 'card HTML should link to the project href');
assert.ok(html.includes('<img'), 'card with a thumbnail should render an <img> tag');

const placeholderProject = { ...sampleProject, id: 'placeholder', thumbnail: null, isPlaceholder: true };
const placeholderHtml = projectCardHTML(placeholderProject);
assert.ok(!placeholderHtml.includes('<img'), 'placeholder card without thumbnail should not render an <img> tag');
assert.ok(placeholderHtml.includes('project-card__thumb-placeholder'), 'placeholder card should render a placeholder block');

console.log('PASS: main.test.js');
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
node tests/main.test.js
```

Expected: `Error: Cannot find module '../js/main.js'`

- [ ] **Step 3: Implement the renderer**

```javascript
// js/main.js
function projectCardHTML(project) {
  const thumb = project.thumbnail
    ? `<img src="${project.thumbnail}" alt="${project.title}" loading="lazy">`
    : `<div class="project-card__thumb-placeholder">Sample</div>`;

  const tags = project.tags.map((tag) => `<li>${tag}</li>`).join('');

  return `
    <a class="project-card" href="${project.href}">
      <div class="project-card__thumb">${thumb}</div>
      <div class="project-card__body">
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__summary">${project.summary}</p>
        <ul class="project-card__tags">${tags}</ul>
      </div>
    </a>
  `;
}

function renderProjectGrid(projects, container) {
  container.innerHTML = projects.map(projectCardHTML).join('');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectCardHTML, renderProjectGrid };
}
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
node tests/main.test.js
```

Expected: `PASS: main.test.js`

- [ ] **Step 5: Commit**

```bash
git add tests/main.test.js js/main.js
git commit -m "Add project card renderer with test coverage"
```

---

### Task 5: Hero / About / Grid / Footer CSS

**Files:**
- Modify: `css/style.css` (append to end of file)

- [ ] **Step 1: Append the layout styles**

```css
/* Header / Logo */
.site-header {
  padding: 40px 0 0;
}

.logo-badge {
  display: inline-block;
  background: #ffffff;
  padding: 10px 18px;
  border-radius: 8px;
}

.logo-badge img {
  height: 28px;
}

/* Hero */
.hero {
  padding: 80px 0 60px;
  text-align: center;
}

.hero__tagline {
  font-family: var(--font-serif);
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 700;
  margin: 24px 0 12px;
}

.hero__subcopy {
  color: var(--text-muted);
  font-size: 18px;
  max-width: 560px;
  margin: 0 auto;
}

/* About */
.about {
  padding: 40px 0 80px;
  border-bottom: 1px solid var(--border);
}

.about p {
  max-width: 640px;
  color: var(--text-muted);
  font-size: 16px;
}

.about__contact {
  display: inline-block;
  margin-top: 8px;
  color: var(--text);
  border-bottom: 1px solid var(--accent-end);
}

/* Project grid */
.projects {
  padding: 80px 0;
}

.projects__heading {
  font-family: var(--font-serif);
  font-size: 28px;
  margin-bottom: 32px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.project-card {
  display: block;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.project-card:hover {
  border-color: var(--accent-end);
  transform: translateY(-4px);
}

.project-card__thumb {
  height: 200px;
  overflow: hidden;
  background: var(--bg);
}

.project-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.project-card__thumb-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: linear-gradient(135deg, rgba(59, 91, 253, 0.15), rgba(168, 85, 247, 0.15));
}

.project-card__body {
  padding: 20px;
}

.project-card__title {
  font-family: var(--font-serif);
  font-size: 20px;
  margin: 0 0 8px;
}

.project-card__summary {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0 0 16px;
}

.project-card__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.project-card__tags li {
  font-size: 12px;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px 10px;
}

/* Footer */
.site-footer {
  padding: 40px 0;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 14px;
}

.site-footer .container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
```

- [ ] **Step 2: Verify the rules were appended**

```bash
grep -c "project-grid" css/style.css
```

Expected: `2` or more (class definition plus usage in comments/selectors).

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add hero, about, project grid, and footer styles"
```

---

### Task 6: Main page markup (`index.html`)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>u:on — Portfolio</title>
  <meta name="description" content="u:on의 프로젝트를 모은 포트폴리오입니다.">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <span class="logo-badge"><img src="assets/images/logo.png" alt="u:on"></span>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <h1 class="hero__tagline">Weave the voices,<br><span class="accent-text">Simulate the future.</span></h1>
      <p class="hero__subcopy">목소리를 데이터로 엮어 다음을 시뮬레이션하는 u:on의 작업들입니다.</p>
    </div>
  </section>

  <section class="about">
    <div class="container">
      <!-- 회사 소개 문구는 예시입니다. 실제 소개로 교체해주세요 -->
      <p>u:on은 데이터와 이야기 사이의 신호를 발견하는 작은 스튜디오입니다. 여론 분석부터 인터랙티브 프로덕트까지, 목소리를 엮어 다음을 예측하는 작업을 함께합니다.</p>
      <a class="about__contact" href="mailto:uon.data@gmail.com">uon.data@gmail.com</a>
    </div>
  </section>

  <section class="projects">
    <div class="container">
      <h2 class="projects__heading">Projects</h2>
      <div class="project-grid" id="project-grid"></div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <span>&copy; 2026 u:on</span>
      <a href="mailto:uon.data@gmail.com">uon.data@gmail.com</a>
    </div>
  </footer>

  <script src="js/projects-data.js"></script>
  <script src="js/main.js"></script>
  <script>
    renderProjectGrid(PROJECTS, document.getElementById('project-grid'));
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify required elements are present**

```bash
grep -q 'id="project-grid"' index.html && echo OK-grid
grep -q 'uon.data@gmail.com' index.html && echo OK-email
grep -q 'Weave the voices' index.html && echo OK-tagline
```

Expected: all three `OK-*` lines print.

- [ ] **Step 3: Serve locally and check the static shell loads**

```bash
python3 -m http.server 8000 &
sleep 1
curl -s -o /dev/null -w "index: %{http_code}\n" http://localhost:8000/
curl -s -o /dev/null -w "css: %{http_code}\n" http://localhost:8000/css/style.css
curl -s -o /dev/null -w "main.js: %{http_code}\n" http://localhost:8000/js/main.js
curl -s -o /dev/null -w "logo: %{http_code}\n" http://localhost:8000/assets/images/logo.png
kill %1
```

Expected: every line reports `200`.

- [ ] **Step 4: Manual browser check**

Open `http://localhost:8000` in a real browser (the JS-rendered project grid can't be verified with `curl` since it's built at runtime). Confirm: logo shows on a white badge, hero tagline renders in serif with the gradient accent on the second line, and the grid shows 3 cards — one with the case-study screenshot cropped to its top edge, two with the gradient "Sample" placeholder block.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add main portfolio page"
```

---

### Task 7: Case-study detail page CSS

**Files:**
- Modify: `css/style.css` (append to end of file)

- [ ] **Step 1: Append the detail-page styles**

```css
/* Case study detail page */
.case-study {
  padding: 60px 0 100px;
}

.case-study__back {
  display: inline-block;
  color: var(--text-muted);
  margin-bottom: 24px;
  font-size: 14px;
}

.case-study__back:hover {
  color: var(--text);
}

.case-study__title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 4vw, 40px);
  margin: 0 0 8px;
}

.case-study__lead {
  color: var(--text-muted);
  font-size: 18px;
  max-width: 640px;
}

.case-study__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin: 32px 0;
  padding: 24px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.case-study__meta dt {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.case-study__meta dd {
  margin: 0;
  font-size: 15px;
}

.case-study__hero-image {
  width: 100%;
  border-radius: 12px;
  margin: 32px 0;
}

.case-study__hero-image--placeholder {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 91, 253, 0.15), rgba(168, 85, 247, 0.15));
  color: var(--text-muted);
  font-family: var(--font-serif);
}

.case-study__section {
  max-width: 720px;
  margin: 40px 0;
}

.case-study__section h2 {
  font-family: var(--font-serif);
  font-size: 22px;
}

.case-study__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.case-study__features h3 {
  font-size: 16px;
  margin-bottom: 6px;
}

.case-study__features p {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0;
}

blockquote {
  border-left: 3px solid var(--accent-end);
  padding-left: 20px;
  margin: 24px 0;
  color: var(--text-muted);
}

blockquote cite {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  font-style: normal;
  color: var(--text);
}
```

- [ ] **Step 2: Verify the rules were appended**

```bash
grep -c "case-study__meta" css/style.css
```

Expected: `2` or more.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add case study detail page styles"
```

---

### Task 8: Real case study — "여론 분석 플랫폼"

**Files:**
- Create: `projects/voice-of-public-platform.html`

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>여론 분석 플랫폼 — u:on</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="../index.html"><span class="logo-badge"><img src="../assets/images/logo.png" alt="u:on"></span></a>
    </div>
  </header>

  <article class="case-study">
    <div class="container">
      <a class="case-study__back" href="../index.html">&larr; 목록으로</a>
      <h1 class="case-study__title">여론 분석 플랫폼</h1>
      <p class="case-study__lead">여론의 파도, 수습하지 말고 미리 예측하세요.</p>

      <dl class="case-study__meta">
        <div><dt>클라이언트</dt><dd>[클라이언트명 입력]</dd></div>
        <div><dt>역할</dt><dd>[역할 입력, 예: 웹 디자인 · 프론트엔드 개발]</dd></div>
        <div><dt>기간</dt><dd>[기간 입력]</dd></div>
        <div><dt>스택</dt><dd>Landing Page · Data Viz · Motion</dd></div>
      </dl>

      <img class="case-study__hero-image" src="../assets/images/uon-voice-platform-full.jpg" alt="여론 분석 플랫폼 랜딩페이지 스크린샷">

      <section class="case-study__section">
        <h2>문제</h2>
        <p>작은 이슈가 사회적 쟁점으로 번지는 속도는 점점 빨라지고 있습니다. 대부분의 팀은 반응을 확인할 수는 있지만, 어떤 내용이 여론의 전환점이 되었는지 '왜'는 알지 못한 채 사후 수습에 그치고 있었습니다.</p>
      </section>

      <section class="case-study__section">
        <h2>접근 방식</h2>
        <p>흩어진 데이터를 하나의 흐름으로 모니터링하고, 댓글 간 인과관계와 지지/대립 구조를 자동으로 분석해 이슈 확산의 맥락을 시각화하는 플랫폼을 설계했습니다.</p>
        <div class="case-study__features">
          <div><h3>Monitor</h3><p>시간에 따라 흩어진 데이터를 하나의 흐름으로 모니터링합니다.</p></div>
          <div><h3>Analyze</h3><p>댓글 간 인과관계, 지지/대립 구조를 자동으로 분석합니다.</p></div>
          <div><h3>Discover</h3><p>이슈 확산의 주제별 점유율을 직관적으로 파악합니다.</p></div>
          <div><h3>Simulate</h3><p>대응 시 달라질 대중의 반응을 사전에 예측합니다.</p></div>
        </div>
      </section>

      <section class="case-study__section">
        <h2>결과</h2>
        <blockquote>
          <p>"정부 정책 발표 때마다 수천 개의 댓글을 감정 분석만 돌려봤습니다. 하지만 정작 '왜' 반발이 생겼는지는 알 길이 없었죠. 이제는 어떤 논점이 대립을 이끌어냈는지 흐름을 파악해 다음 정책 준비에 바로 반영하고 있습니다."</p>
          <cite>공공기관 정책 담당자</cite>
        </blockquote>
        <blockquote>
          <p>"아티스트나 브랜드의 논란은 확산 속도가 생명입니다. 도입 후에는 특정 메시지로 대응했을 때 여론이 어떻게 변할지 사전 시뮬레이션으로 확인할 수 있어, 위기 관리의 불확실성이 사라졌습니다."</p>
          <cite>대기업 홍보/PR 담당자</cite>
        </blockquote>
      </section>
    </div>
  </article>

  <footer class="site-footer">
    <div class="container">
      <span>&copy; 2026 u:on</span>
      <a href="mailto:uon.data@gmail.com">uon.data@gmail.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify required elements**

```bash
grep -q 'uon-voice-platform-full.jpg' projects/voice-of-public-platform.html && echo OK-image
grep -q '여론의 파도' projects/voice-of-public-platform.html && echo OK-copy
grep -q '../index.html' projects/voice-of-public-platform.html && echo OK-backlink
```

Expected: all three `OK-*` lines print.

- [ ] **Step 3: Serve locally and confirm the page loads**

```bash
python3 -m http.server 8000 &
sleep 1
curl -s -o /dev/null -w "case-study: %{http_code}\n" http://localhost:8000/projects/voice-of-public-platform.html
curl -s -o /dev/null -w "screenshot: %{http_code}\n" http://localhost:8000/assets/images/uon-voice-platform-full.jpg
kill %1
```

Expected: both lines report `200`.

- [ ] **Step 4: Commit**

```bash
git add projects/voice-of-public-platform.html
git commit -m "Add real case study page for voice-of-public-platform"
```

---

### Task 9: Placeholder detail pages A and B

**Files:**
- Create: `projects/sample-project-a.html`
- Create: `projects/sample-project-b.html`

- [ ] **Step 1: Write sample-project-a.html**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>샘플 프로젝트 A — u:on</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="../index.html"><span class="logo-badge"><img src="../assets/images/logo.png" alt="u:on"></span></a>
    </div>
  </header>

  <!-- PLACEHOLDER PAGE: 실제 프로젝트 내용으로 전체 교체해주세요 -->
  <article class="case-study">
    <div class="container">
      <a class="case-study__back" href="../index.html">&larr; 목록으로</a>
      <h1 class="case-study__title">샘플 프로젝트 A</h1>
      <p class="case-study__lead">이 페이지는 예시 콘텐츠입니다. 실제 프로젝트 내용으로 교체해주세요.</p>

      <dl class="case-study__meta">
        <div><dt>클라이언트</dt><dd>[클라이언트명 입력]</dd></div>
        <div><dt>역할</dt><dd>[역할 입력]</dd></div>
        <div><dt>기간</dt><dd>[기간 입력]</dd></div>
        <div><dt>스택</dt><dd>[사용 기술 입력]</dd></div>
      </dl>

      <div class="case-study__hero-image case-study__hero-image--placeholder">이미지 자리</div>

      <section class="case-study__section">
        <h2>문제</h2>
        <p>[이 프로젝트에서 해결하려던 문제를 작성해주세요.]</p>
      </section>

      <section class="case-study__section">
        <h2>접근 방식</h2>
        <p>[어떤 방식으로 문제를 해결했는지 작성해주세요.]</p>
      </section>

      <section class="case-study__section">
        <h2>결과</h2>
        <p>[프로젝트의 성과나 결과를 작성해주세요.]</p>
      </section>
    </div>
  </article>

  <footer class="site-footer">
    <div class="container">
      <span>&copy; 2026 u:on</span>
      <a href="mailto:uon.data@gmail.com">uon.data@gmail.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Write sample-project-b.html (same structure, project B copy)**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>샘플 프로젝트 B — u:on</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="../index.html"><span class="logo-badge"><img src="../assets/images/logo.png" alt="u:on"></span></a>
    </div>
  </header>

  <!-- PLACEHOLDER PAGE: 실제 프로젝트 내용으로 전체 교체해주세요 -->
  <article class="case-study">
    <div class="container">
      <a class="case-study__back" href="../index.html">&larr; 목록으로</a>
      <h1 class="case-study__title">샘플 프로젝트 B</h1>
      <p class="case-study__lead">이 페이지는 예시 콘텐츠입니다. 실제 프로젝트 내용으로 교체해주세요.</p>

      <dl class="case-study__meta">
        <div><dt>클라이언트</dt><dd>[클라이언트명 입력]</dd></div>
        <div><dt>역할</dt><dd>[역할 입력]</dd></div>
        <div><dt>기간</dt><dd>[기간 입력]</dd></div>
        <div><dt>스택</dt><dd>[사용 기술 입력]</dd></div>
      </dl>

      <div class="case-study__hero-image case-study__hero-image--placeholder">이미지 자리</div>

      <section class="case-study__section">
        <h2>문제</h2>
        <p>[이 프로젝트에서 해결하려던 문제를 작성해주세요.]</p>
      </section>

      <section class="case-study__section">
        <h2>접근 방식</h2>
        <p>[어떤 방식으로 문제를 해결했는지 작성해주세요.]</p>
      </section>

      <section class="case-study__section">
        <h2>결과</h2>
        <p>[프로젝트의 성과나 결과를 작성해주세요.]</p>
      </section>
    </div>
  </article>

  <footer class="site-footer">
    <div class="container">
      <span>&copy; 2026 u:on</span>
      <a href="mailto:uon.data@gmail.com">uon.data@gmail.com</a>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Verify both pages exist and are marked as placeholders**

```bash
grep -l "PLACEHOLDER PAGE" projects/sample-project-a.html projects/sample-project-b.html
```

Expected: both file paths print.

- [ ] **Step 4: Commit**

```bash
git add projects/sample-project-a.html projects/sample-project-b.html
git commit -m "Add placeholder case study pages"
```

---

### Task 10: Full-site verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run both automated tests together**

```bash
node tests/projects-data.test.js && node tests/main.test.js
```

Expected: `PASS: projects-data.test.js` then `PASS: main.test.js`.

- [ ] **Step 2: Serve the whole site and check every page/asset returns 200**

```bash
python3 -m http.server 8000 &
sleep 1
for path in / css/style.css js/projects-data.js js/main.js assets/images/logo.png assets/images/uon-voice-platform-full.jpg projects/voice-of-public-platform.html projects/sample-project-a.html projects/sample-project-b.html; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$path")
  echo "$path -> $code"
done
kill %1
```

Expected: every line ends in `-> 200`.

- [ ] **Step 3: Manual browser walk-through**

Open `http://localhost:8000` and:
1. Confirm the 3 project cards render in the grid.
2. Click into the real case study card — confirm the full screenshot, feature grid, and quotes render, and "목록으로" returns to the main page.
3. Click into each placeholder card — confirm the gradient placeholder image and bracketed placeholder copy render, and the back link works.
4. Resize the browser to a narrow (mobile) width and confirm the grid collapses to a single column and text stays readable.

If a project skill for launching/screenshotting the app is available, use it here instead of a manual visual check.

- [ ] **Step 4: Commit any fixes found during verification**

```bash
git add -A
git commit -m "Fix issues found during full-site verification"
```

(Skip this step if no fixes were needed.)

---

### Task 11: README and deployment instructions

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write the README**

```markdown
# u:on Portfolio

u:on의 프로젝트를 모은 GitHub Pages 포트폴리오 사이트입니다. 빌드 도구 없이 순수 HTML/CSS/JS로 작성되었습니다.

## 로컬에서 보기

\`\`\`bash
python3 -m http.server 8000
\`\`\`

브라우저에서 http://localhost:8000 접속

## 새 프로젝트 추가하기

1. `js/projects-data.js`의 `PROJECTS` 배열에 새 항목을 추가합니다.
2. `projects/` 폴더에 있는 기존 HTML 파일(예: `sample-project-a.html`)을 복사해 새 파일을 만들고 내용을 수정합니다.
3. 메인 페이지(`index.html`)의 카드 그리드에 자동으로 반영됩니다.

## 테스트

\`\`\`bash
node tests/projects-data.test.js
node tests/main.test.js
\`\`\`

## 배포 (GitHub Pages)

1. GitHub에서 `<username>.github.io` 이름으로 새 리포지토리를 생성합니다.
2. 아래 명령으로 원격 저장소를 연결하고 push합니다.

\`\`\`bash
git remote add origin https://github.com/<username>/<username>.github.io.git
git branch -M main
git push -u origin main
\`\`\`

3. 잠시 후 `https://<username>.github.io`에서 사이트를 확인할 수 있습니다.
```

- [ ] **Step 2: Verify**

```bash
grep -q "새 프로젝트 추가하기" README.md && echo OK
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add README with usage and deployment instructions"
```
