export interface HeroPanel {
  house: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

export interface FeaturedBlock {
  title: string;
  leadImage: string;
  leadCaption: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface InfoSection {
  heading: string;
  body: string;
}

export interface InfoPageContent {
  title: string;
  intro: string;
  sections: InfoSection[];
}

export const INFO_PAGE_SLUGS = ['about', 'shipping-returns', 'privacy', 'terms'] as const;
export type InfoPageSlug = (typeof INFO_PAGE_SLUGS)[number];

export interface SiteContent {
  announcement: string;
  hero: {women: HeroPanel;men: HeroPanel;};
  intro: {heading: string;highlight: string;body: string;};
  featured: {women: FeaturedBlock;men: FeaturedBlock;};
  custom: {eyebrow: string;heading: string;highlight: string;body: string;image: string;};
  showroom: {eyebrow: string;heading: string;body: string;image: string;};
  story: {quote: string;attribution: string;};
  social: {womenHandle: string;menHandle: string;};
  footer: {tagline: string;newsletterHeading: string;newsletterBody: string;};
  faqs: FaqItem[];
  pages: Record<InfoPageSlug, InfoPageContent>;
}