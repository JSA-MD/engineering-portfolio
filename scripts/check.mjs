import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
const projects=JSON.parse(await readFile('content/projects.json','utf8'));
const ids=new Set();
for(const p of projects){for(const field of ['id','name','summary','summaryKo','challenge','challengeKo','approach','approachKo','result','resultKo','source']) if(!p[field]) throw Error(`${p.id}: missing ${field}`);if(ids.has(p.id)) throw Error(`duplicate ${p.id}`);ids.add(p.id);await access(join('dist','work',p.id,'index.html'));if(p.image) await access(join('dist',p.image));for(const image of p.images||[]){for(const field of ['src','alt','caption','captionKo'])if(!image[field])throw Error(`${p.id}: image missing ${field}`);await access(join('dist',image.src));}}
const career=JSON.parse(await readFile('content/career.json','utf8'));
for(const [i,entry] of career.entries()){for(const field of ['period','company','companyKo','role','roleKo','detail','detailKo'])if(!entry[field])throw Error(`career ${i}: missing ${field}`);if(i&&career[i-1].period.slice(0,7)<entry.period.slice(0,7))throw Error(`career ${i}: order is not newest first`);}
const careerProjects=JSON.parse(await readFile('content/career-projects.json','utf8'));
for(const [i,p] of careerProjects.entries()){
  for(const field of ['name','nameKo','summary','summaryKo','commercial','commercialKo','technical','technicalKo'])if(!p[field])throw Error(`career project ${i}: missing ${field}`);
  if(!Number.isInteger(p.career)||p.career<0||p.career>=career.length)throw Error(`career project ${i}: invalid career index`);
  if(p.media?.type==='youtube'&&!/^[\w-]{11}$/.test(p.media.id))throw Error(`career project ${i}: invalid video ID`);
  if(p.media?.type==='image')await access(join('dist',p.media.src));
  if(p.media&&(!p.media.source||!p.media.sourceKo))throw Error(`career project ${i}: media attribution missing`);
}
for(const [i] of career.entries())if(!careerProjects.some(p=>p.career===i))throw Error(`career ${i}: missing project`);
const careerHtml=await readFile('dist/career/index.html','utf8');
if((careerHtml.match(/data-career-group/g)||[]).length!==career.length)throw Error('career entries missing from built page');
if((careerHtml.match(/class="career-project"/g)||[]).length!==careerProjects.length)throw Error('career projects missing from built page');
for(const route of ['', 'work','career','journey','lab','about',...projects.map(p=>`work/${p.id}`)]) {const html=await readFile(join('dist',route,'index.html'),'utf8'); if(!html.includes('<title>')||!html.includes('id="main"')||!html.includes('name="description"')) throw Error(`${route}: missing required structure`);for(const style of ['modern','classic'])if(!html.includes(`data-style-choice="${style}"`))throw Error(`${route}: missing ${style} style control`);}
console.log(`Verified ${projects.length} case studies, ${career.length} career entries, ${careerProjects.length} career projects and referenced media.`);
