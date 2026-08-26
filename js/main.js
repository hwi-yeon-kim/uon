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
