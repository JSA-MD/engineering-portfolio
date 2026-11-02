import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
const exec=promisify(execFile); const workspace=path.resolve(process.cwd(),'..');
const output=path.resolve(process.cwd(),'local-review'); await mkdir(output,{recursive:true});
const entries=await readdir(workspace,{withFileTypes:true}); const results=[];
for(const entry of entries){
 if(!entry.isDirectory()||entry.name.startsWith('.')||entry.name===path.basename(process.cwd()))continue;
 const directory=path.join(workspace,entry.name);const st=await stat(directory);let git=null;
 try {const inside=await exec('git',['-C',directory,'rev-parse','--show-toplevel'],{timeout:5000}); if(path.resolve(inside.stdout.trim())===directory){const log=await exec('git',['-C',directory,'log','--all','--format=%cs'],{timeout:10000,maxBuffer:10_000_000});const dates=log.stdout.trim().split('\n').filter(Boolean).sort();git={commits:dates.length,earliest:dates[0]||null,latest:dates.at(-1)||null};}} catch {}
 results.push({directory:entry.name,localFolderCreated:st.birthtime.toISOString().slice(0,10),git});
}
results.sort((a,b)=>a.localFolderCreated.localeCompare(b.localFolderCreated)||a.directory.localeCompare(b.directory));
await writeFile(path.join(output,'project-candidates.json'),JSON.stringify({generatedAt:new Date().toISOString(),scope:'top-level directories; metadata only; review before use',projects:results},null,2)+'\n');
console.log(`Wrote ${results.length} candidate entries to local-review/project-candidates.json. Nothing was published.`);
