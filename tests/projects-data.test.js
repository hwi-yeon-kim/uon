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
