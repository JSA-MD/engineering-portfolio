import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
const projects=JSON.parse(await readFile('content/projects.json','utf8'));
const ids=new Set();
for(const p of projects){for(const field of ['id','name','summary','summaryKo','challenge','challengeKo','approach','approachKo','result','resultKo','source']) if(!p[field]) throw Error(`${p.id}: missing ${field}`);if(ids.has(p.id)) throw Error(`duplicate ${p.id}`);ids.add(p.id);await access(join('dist','work',p.id,'index.html'));if(p.image) await access(join('dist',p.image));for(const image of p.images||[]){for(const field of ['src','alt','caption','captionKo'])if(!image[field])throw Error(`${p.id}: image missing ${field}`);await access(join('dist',image.src));}}
const career=JSON.parse(await readFile('content/career.json','utf8'));
for(const [i,entry] of career.entries()){for(const field of ['period','company','companyKo','role','roleKo','detail','detailKo'])if(!entry[field])throw Error(`career ${i}: missing ${field}`);if(i&&career[i-1].period.slice(0,7)<entry.period.slice(0,7))throw Error(`career ${i}: order is not newest first`);}
const careerHtml=await readFile('dist/career/index.html','utf8');if((careerHtml.match(/class="career-entry"/g)||[]).length!==career.length)throw Error('career entries missing from built page');
for(const route of ['', 'work','career','journey','lab','about']) {const html=await readFile(join('dist',route,'index.html'),'utf8'); if(!html.includes('<title>')||!html.includes('id="main"')||!html.includes('name="description"')) throw Error(`${route}: missing required structure`);}
console.log(`Verified ${projects.length} case studies, ${career.length} career entries, page structure and referenced media.`);
