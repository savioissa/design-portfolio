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

// Logos coloridos de marcas (ferramentas), do conjunto "logos" do Iconify. Cada um tem o próprio viewBox.
const logoSet = require('@iconify-json/logos/icons.json');
const { logos: logoNames = [] } = JSON.parse(readFileSync(new URL('./icons.config.json', import.meta.url), 'utf8'));

const missingLogos = logoNames.filter((n) => !logoSet.icons[n]);
if (missingLogos.length) {
  console.error(`Logos não encontrados: ${missingLogos.join(', ')}`);
  console.error('Veja os nomes disponíveis em https://icon-sets.iconify.design/logos/');
  process.exit(1);
}

const logoEntries = [...logoNames]
  .sort()
  .map((n) => {
    const { body, width = logoSet.width, height = logoSet.height } = logoSet.icons[n];
    return `  '${n}': { viewBox: '0 0 ${width} ${height}', body: ${JSON.stringify(body)} },`;
  })
  .join('\n');

const logosOut = `// Arquivo gerado por scripts/build-icons.mjs. Não edite à mão: rode \`npm run icons\`.
// Logos: gilbarbara/logos (https://github.com/gilbarbara/logos). Licença CC0

export const LOGOS = {
${logoEntries}
} as const;

export type LogoName = keyof typeof LOGOS;
`;

writeFileSync(new URL('../src/app/ui/icon/logos.generated.ts', import.meta.url), logosOut);
console.log(`${logoNames.length} logos gerados.`);
