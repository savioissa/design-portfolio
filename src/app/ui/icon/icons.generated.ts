// Arquivo gerado por scripts/build-icons.mjs. Não edite à mão: rode `npm run icons`.
// Ícones: coolicons, por Kryston Schwarze. Licença CC BY 4.0
// https://github.com/krystonschwarze/coolicons

export const ICONS = {
  'chevron-down': "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m19 9l-7 7l-7-7\"/>",
  'moon': "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 6a9 9 0 0 0 9 9c.91 0 1.787-.134 2.614-.385A9 9 0 0 1 12 21A9 9 0 0 1 9.386 3.386A9 9 0 0 0 9 6\"/>",
  'sun': "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 4V2m0 18v2M6.414 6.414L5 5m12.728 12.728l1.414 1.414M4 12H2m18 0h2m-4.271-5.586L19.143 5M6.415 17.728L5 19.142M12 17a5 5 0 1 1 0-10a5 5 0 0 1 0 10\"/>",
} as const;

export type IconName = keyof typeof ICONS;
