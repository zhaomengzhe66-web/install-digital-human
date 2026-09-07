import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'SKILL.md',
  'README.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'agents/openai.yaml',
  'references/frameworks.md',
  'examples/index.html',
  'examples/manifests/xia-yu-yao-earphones.json',
  'examples/manifests/vrm1-constraint-sample.json',
];

const models = [
  {
    file: 'examples/models/xia-yu-yao-earphones.vrm',
    sha256: '4E3AC8F17C8AC158D954A9CC0B70E568B9FF3C482742DEBF205DAB3E9B4164A9',
  },
  {
    file: 'examples/models/VRM1-Constraint-Sample.vrm',
    sha256: '12C2B97E95E700783A6A550DC0EEE2D7880AEEDCCEF9AE67BC4C5A2F0F2631A2',
  },
];

const manifests = [
  'examples/manifests/xia-yu-yao-earphones.json',
  'examples/manifests/vrm1-constraint-sample.json',
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const file of requiredFiles) {
  try {
    await access(path.join(root, file));
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

const skill = await readFile(path.join(root, 'SKILL.md'), 'utf8');
check(skill.startsWith('---\nname: install-digital-human\n'), 'SKILL.md frontmatter name is invalid');
check(skill.includes('description:'), 'SKILL.md needs a discovery description');

const openAiYaml = await readFile(path.join(root, 'agents/openai.yaml'), 'utf8');
check(openAiYaml.includes('$install-digital-human'), 'openai.yaml default prompt must mention $install-digital-human');

for (const manifestPath of manifests) {
  const raw = await readFile(path.join(root, manifestPath), 'utf8');
  const manifest = JSON.parse(raw);
  check(manifest.schemaVersion === '1.1', `${manifestPath}: expected schemaVersion 1.1`);
  check(typeof manifest.id === 'string' && manifest.id.length > 0, `${manifestPath}: missing id`);
  check(/^\d+\.\d+\.\d+$/.test(manifest.version), `${manifestPath}: version must be semver-like`);
  check(Array.isArray(manifest.actions) && manifest.actions.length > 0, `${manifestPath}: actions must not be empty`);
  check(Array.isArray(manifest.expressions) && manifest.expressions.length > 0, `${manifestPath}: expressions must not be empty`);
  check(Array.isArray(manifest.menu) && manifest.menu.length > 0 && manifest.menu.length <= 24, `${manifestPath}: menu must contain 1-24 items`);
  check(manifest.model?.license?.confirmed === true, `${manifestPath}: model licence must be confirmed`);

  const modelFile = path.basename(new URL(manifest.model.url).pathname);
  try {
    await access(path.join(root, 'examples/models', modelFile));
  } catch {
    failures.push(`${manifestPath}: model URL does not map to examples/models/${modelFile}`);
  }
}

const hashFile = (file) => new Promise((resolve, reject) => {
  const hash = createHash('sha256');
  createReadStream(file)
    .on('error', reject)
    .on('data', (chunk) => hash.update(chunk))
    .on('end', () => resolve(hash.digest('hex').toUpperCase()));
});

for (const model of models) {
  const actual = await hashFile(path.join(root, model.file));
  check(actual === model.sha256, `${model.file}: SHA-256 mismatch`);
}

if (failures.length) {
  console.error('Validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${requiredFiles.length} required files, ${manifests.length} manifests, and ${models.length} VRM assets.`);
}
