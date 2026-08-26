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
