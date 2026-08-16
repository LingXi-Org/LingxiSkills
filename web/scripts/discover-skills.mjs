import { discoverSkills } from './skill-data.mjs';

const entries = discoverSkills();
console.log(JSON.stringify(entries.map(({ markdown, body, ...entry }) => entry), null, 2));

