// Kopiert das gebaute Bundle an die veröffentlichte Stelle (MatheKompass.html).
import {copyFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const src=fileURLToPath(new URL('./dist/index.html',import.meta.url));
const dst=fileURLToPath(new URL('../../MatheKompass.html',import.meta.url));
copyFileSync(src,dst);
console.log('MatheKompass.html aktualisiert:',Math.round(statSync(dst).size/1024),'KB');
