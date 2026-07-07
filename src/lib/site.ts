export const SITE = 'https://xabier.me';
export const SITE_HOST = 'xabier.me';
export const SITE_NAME = 'Xabier Ariznabarreta';
export const SITE_TAGLINE = 'AI agent builder & researcher-in-training';
export const SITE_DESCRIPTION_ES =
  'Cuaderno público de research. Notas sobre evals de LLM, mech interp, agent harnesses y lecciones de producción que me trajeron aquí.';
export const SITE_DESCRIPTION_EN =
  'Public research notebook. Notes on LLM evals, mech interp, agent harnesses, and the production lessons that pushed me here.';

export const AUTHOR = {
  name: 'Xabier Ariznabarreta',
  alternateName: 'Xabier Ariznabarreta Alomar',
  jobTitle: 'AI Engineer & Researcher-in-training',
  location: 'Madrid',
  email: 'xabier.ariznabarreta@gmail.com',
  github: 'https://github.com/Xabilimon1',
  sameAs: [
    'https://github.com/Xabilimon1',
    // TBC: LinkedIn, X/Twitter, Bluesky, Scholar/ORCID — added once confirmed
  ],
};

export function canonicalFor(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return `${SITE}${clean === '/' ? '' : clean}`;
}
