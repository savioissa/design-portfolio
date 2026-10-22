// Gera src/app/ui/icon/icons.generated.ts só com os ícones listados em icons.config.json,
// para não incluir no bundle a biblioteca coolicons inteira.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const set = require('@iconify-json/ci/icons.json');
const { icons: names } = JSON.parse(readFileSync(new URL('./icons.config.json', import.meta.url), 'utf8'));

const missing = names.filter((n) => !set.icons[n]);
if (missing.length) {
  console.error(`Ícones não encontrados no coolicons: ${missing.join(', ')}`);
  console.error('Veja os nomes disponíveis em https://icon-sets.iconify.design/ci/');
  process.exit(1);
}

const entries = [...names]
  .sort()
  .map((n) => `  '${n}': ${JSON.stringify(set.icons[n].body)},`)
  .join('\n');

const out = `// Arquivo gerado por scripts/build-icons.mjs. Não edite à mão: rode \`npm run icons\`.
// Ícones: coolicons, por Kryston Schwarze. Licença CC BY 4.0
// https://github.com/krystonschwarze/coolicons

export const ICONS = {
${entries}
} as const;

export type IconName = keyof typeof ICONS;
`;

writeFileSync(new URL('../src/app/ui/icon/icons.generated.ts', import.meta.url), out);
console.log(`${names.length} ícones gerados.`);
