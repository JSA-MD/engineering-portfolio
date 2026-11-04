import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
const projects=JSON.parse(await readFile('content/projects.json','utf8'));
const ids=new Set();
for(const p of projects){if(p.detailMedia && (p.detailMedia.type!=='youtube'||!/^[\w-]{11}$/.test(p.detailMedia.id)||!p.detailMedia.source||!p.detailMedia.sourceKo))throw Error(`${p.id}: invalid detail media`);for(const field of ['id','name','source']) if(!p[field]) throw Error(`${p.id}: missing ${field}`);if(ids.has(p.id)) throw Error(`duplicate ${p.id}`);ids.add(p.id);await access(join('dist','work',p.id,'index.html'));if(p.image) await access(join('dist',p.image));for(const image of p.images||[]){for(const field of ['src','alt','caption','captionKo'])if(!image[field])throw Error(`${p.id}: image missing ${field}`);await access(join('dist',image.src));}}
const career=JSON.parse(await readFile('content/career.json','utf8'));
for(const [i,entry] of career.entries()){for(const field of ['period','company','companyKo','role','roleKo','detail','detailKo'])if(!entry[field])throw Error(`career ${i}: missing ${field}`);if(i&&career[i-1].period.slice(0,7)<entry.period.slice(0,7))throw Error(`career ${i}: order is not newest first`);}
const careerProjects=JSON.parse(await readFile('content/career-projects.json','utf8'));
const careerDetails=JSON.parse(await readFile('content/career-details.json','utf8'));
const detailSlugs=new Set(projects.map(p=>p.id));
for(const d of careerDetails){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)||detailSlugs.has(d.slug))throw Error(`invalid or duplicate detail slug: ${d.slug}`);detailSlugs.add(d.slug);if(careerProjects.filter(p=>p.name===d.project&&p.career>=3).length!==1)throw Error(`invalid detail project: ${d.project}`);if(!Array.isArray(d.notes)||!d.notes.length||d.notes.some(n=>!n.en||!n.ko)||!Array.isArray(d.links)||d.links.some(l=>!l.en||!l.ko||!l.url?.startsWith('https://')))throw Error(`invalid detail content: ${d.project}`);const html=await readFile(join('dist','work',d.slug,'index.html'),'utf8');if(!html.includes('career-detail-content')||!html.includes('/career/#career-'))throw Error(`missing detail content: ${d.slug}`);}
for(const p of careerProjects.filter(p=>p.career>=3))if(!careerDetails.some(d=>d.project===p.name))throw Error(`missing career detail: ${p.name}`);
const designStyles=JSON.parse(await readFile('content/design-styles.json','utf8'));
for(const [i,p] of careerProjects.entries()){
  for(const field of ['name','nameKo','summary','summaryKo','skills','highlight','highlightKo'])if(!p[field])throw Error(`career project ${i}: missing ${field}`);
  for(const field of ['description','descriptionKo'])if(!Array.isArray(p[field])||p[field].length!==3||p[field].some(line=>typeof line!=='string'||!line.trim()))throw Error(`career project ${i}: ${field} must contain three lines`);
  if(!Number.isInteger(p.career)||p.career<0||p.career>=career.length)throw Error(`career project ${i}: invalid career index`);
  if(p.media?.type==='youtube'&&!/^[\w-]{11}$/.test(p.media.id))throw Error(`career project ${i}: invalid video ID`);
  if(p.media?.type==='external'&&[p.media.url,p.media.listingUrl].some(url=>typeof url!=='string'||!url.startsWith('https://')))throw Error(`career project ${i}: invalid external media URL`);
  if(p.media?.type==='external'&&p.media.images?.some(url=>typeof url!=='string'||!url.startsWith('https://')))throw Error(`career project ${i}: invalid external image URL`);
  if(p.media?.type==='external'&&p.media.label&&!p.media.labelKo)throw Error(`career project ${i}: missing Korean media label`);
  if(['image','channel'].includes(p.media?.type))await access(join('dist',p.media.src));
  if(p.media?.type==='video'){await access(join('dist',p.media.src));await access(join('dist',p.media.poster));}
  if(p.media?.channelUrl && !/^https:\/\/www\.youtube\.com\/@[A-Za-z0-9%_-]+$/.test(p.media.channelUrl))throw Error(`career project ${i}: invalid channel URL`);
  if(p.media&&(!p.media.source||!p.media.sourceKo))throw Error(`career project ${i}: media attribution missing`);
}
for(const [i] of career.entries())if(!careerProjects.some(p=>p.career===i))throw Error(`career ${i}: missing project`);
const careerHtml=await readFile('dist/career/index.html','utf8');
if((careerHtml.match(/data-career-group/g)||[]).length!==career.length)throw Error('career entries missing from built page');
if((careerHtml.match(/class="career-project"/g)||[]).length!==careerProjects.length)throw Error('career projects missing from built page');
const labHtml=await readFile('dist/lab/index.html','utf8');
if((labHtml.match(/class="career-project"/g)||[]).length!==careerProjects.filter(p=>p.career===0).length)throw Error('independent projects missing from AI lab');
const briefs=[...careerHtml.matchAll(/<div class="project-brief">([\s\S]*?)<\/div>/g)];
if(briefs.length!==careerProjects.length || briefs.some(x=>(x[1].match(/<p(?:\s[^>]*)?>/g)||[]).length!==5))throw Error('Each project must have three description lines, skills and highlight');
for(const p of projects){const html=await readFile(join('dist','work',p.id,'index.html'),'utf8');if(!p.overview?.en||!p.overview?.ko||!html.includes('class="project-overview"'))throw Error(`${p.id}: missing bilingual project overview`);if(/THE PROBLEM|THE SYSTEM|해결할 문제|구현 방식/.test(html))throw Error(`${p.id}: old detailed sections remain`);if((html.match(/class="project-brief"/g)||[]).length!==1)throw Error(`${p.id}: missing project brief`);if(p.roleDetails?.length&&html.indexOf('class="project-overview"')>html.indexOf('class="project-role"'))throw Error(`${p.id}: overview must precede role`);}
for(const id of ['olobo','purenista']){const p=projects.find(p=>p.id===id);if(!p?.roleDetails?.length||p.roleDetails.some(n=>!n.en||!n.ko))throw Error(`${id}: missing bilingual role details`);const html=await readFile(join('dist','work',id,'index.html'),'utf8');if(!html.includes('career-role-details'))throw Error(`${id}: role details missing from page`);}
for(const d of careerDetails){const html=await readFile(join('dist','work',d.slug,'index.html'),'utf8');if(!d.overview?.en||!d.overview?.ko||!html.includes('class="project-overview"')||html.indexOf('class="project-overview"')>html.indexOf('class="project-role"'))throw Error(`${d.slug}: overview missing or out of order`);}
for(const id of [...careerDetails.map(d=>d.slug),'olobo','purenista']){const html=await readFile(join('dist','work',id,'index.html'),'utf8');if(/경력기술서에는|경력 문서\)|확인하지 못했습니다|기존 포트폴리오 기록에는|The résumé records|The existing portfolio record/i.test(html))throw Error(`${id}: research commentary leaked into project copy`);}
for(const route of ['', 'work','career','journey','lab','about',...projects.map(p=>`work/${p.id}`)]) {const html=await readFile(join('dist',route,'index.html'),'utf8'); if(!html.includes('<title>')||!html.includes('id="main"')||!html.includes('name="description"')) throw Error(`${route}: missing required structure`);for(const style of designStyles.styles)if(!html.includes(`data-style-choice="${style.id}"`))throw Error(`${route}: missing ${style.id} style control`);}
console.log(`Verified ${projects.length} existing case studies, ${careerDetails.length} career detail pages, ${career.length} career entries, ${careerProjects.length} career projects and referenced media.`);
