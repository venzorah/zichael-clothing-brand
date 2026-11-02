import { Category, Product } from '../types/catalog';

export const LOGO_URL = "/HOZ.png";

export const brandImages = {
  womenHero: "/9869bcac-bd4a-4fb3-ab3d-ee2ab44b5811.jpg",
  menHero: "/House_of_Zichael_Male_(15).jpg",
  showroom: "/14647bbc-4bed-4008-ba21-f29115615d35.jpg",
  craft: "/House_of_Zichael_Male_(14).jpg"
};

export const categories: Category[] = [
{ slug: 'kaftans', name: 'Kaftans', gender: 'MEN', description: 'Long-line kaftans with signature plackets and hand-finished detail.' },
{ slug: 'senators', name: 'Senator Wear', gender: 'MEN', description: 'Structured senator cuts for boardrooms, weddings and Sunday service.' },
{ slug: 'traditional', name: 'Traditional', gender: 'MEN', description: 'Heritage pieces with intricate hand embroidery for ceremony.' },
{ slug: 'evening-gowns', name: 'Evening Gowns', gender: 'WOMEN', description: 'Floor-length silhouettes for galas, dinners and red carpets.' },
{ slug: 'occasion', name: 'Occasion & Bridal', gender: 'WOMEN', description: 'Statement pieces for engagements, receptions and celebrations.' },
{ slug: 'corporate', name: 'Corporate', gender: 'WOMEN', description: 'Tailored dresses and suiting for the modern executive.' }];


const MEN_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const WOMEN_SIZES = ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16'];

const m = (code: string, file: string) => `https://cdn.magicpatterns.com/uploads/${code}/House_of_Zichael_Male_(${file}).jpg`;

export const products: Product[] = [
{
  id: 'p-m-001',
  slug: 'ivory-heritage-kaftan',
  sku: 'HOZ-M-KFT-001',
  name: 'Ivory Heritage Kaftan',
  gender: 'MEN',
  category: 'traditional',
  description:
  'A pure ivory kaftan with a clean concealed placket framed by hand-applied cross-stitch motifs in bronze thread. Finished with a rounded patch pocket and our polished Zichael signature bar — quiet, regal and made for occasions that matter.',
  images: [
  { src: m('oNfJ4aRzyHEA23pnbR83jc', '15'), alt: 'Ivory Heritage Kaftan on mannequin, full length three-quarter view' },
  { src: m('s2BgFjQWwSxymnwtdDNpUh', '16'), alt: 'Close-up of bronze cross-stitch motif and signature pocket bar on the Ivory Heritage Kaftan' }],

  sizes: MEN_SIZES,
  colours: [
  { name: 'Ivory', hex: '#F4F1EA' },
  { name: 'Sand', hex: '#D9CBB0' }],

  fabric: 'Premium cashmere-blend suiting, 2-ply',
  productionDays: '7–10 working days',
  stock: 'IN_STOCK',
  featured: true,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 240000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-20'
},
{
  id: 'p-m-002',
  slug: 'navy-lumen-kaftan',
  sku: 'HOZ-M-KFT-002',
  name: 'Navy Lumen Kaftan',
  gender: 'MEN',
  category: 'kaftans',
  description:
  'Deep navy textured weave with a contrasting powder-blue inset placket, outlined in soft grey piping. The back carries a matching tapered strip — a design you notice twice, coming and going.',
  images: [
  { src: m('giCnHLYsfzetRsGMhEPYWh', '1'), alt: 'Front placket of the Navy Lumen Kaftan with powder-blue inset and grey piping' },
  { src: m('s9528KL6whhbF8V39JH67x', '2'), alt: 'Back neckline detail of the Navy Lumen Kaftan with tapered contrast strip' }],

  sizes: MEN_SIZES,
  colours: [
  { name: 'Navy', hex: '#1F2B57' },
  { name: 'Midnight', hex: '#121A33' }],

  fabric: 'Textured Italian wool-blend',
  productionDays: '7–10 working days',
  stock: 'IN_STOCK',
  featured: true,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 185000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-18'
},
{
  id: 'p-m-003',
  slug: 'onyx-split-kaftan',
  sku: 'HOZ-M-KFT-003',
  name: 'Onyx Split Colourblock',
  gender: 'MEN',
  category: 'kaftans',
  description:
  'An architectural short-sleeve kaftan split in onyx and slate, traced with white piping and hand-saddle stitching. The back features a diagonal white bar and our engraved Zichael hardware loop.',
  images: [
  { src: m('77jXGtqWZaAZyRtr4mU4jU', '3'), alt: 'Onyx Split Colourblock kaftan in black and slate on mannequin, front view' },
  { src: m('x9qXLGagExVa5WC78YSDfC', '5'), alt: 'Back of the Onyx Split Colourblock with diagonal white bar and engraved Zichael hardware' }],

  sizes: MEN_SIZES,
  colours: [
  { name: 'Onyx / Slate', hex: '#1A1A1A' },
  { name: 'Navy / Steel', hex: '#22304F' }],

  fabric: 'Matte suiting cotton with satin piping',
  productionDays: '10–14 working days',
  stock: 'LOW_STOCK',
  featured: true,
  newArrival: false,
  published: true,
  showPrice: true,
  price: 210000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-09-28'
},
{
  id: 'p-m-004',
  slug: 'forest-bloom-senator',
  sku: 'HOZ-M-SEN-004',
  name: 'Forest Bloom Senator',
  gender: 'MEN',
  category: 'senators',
  description:
  'Deep forest green with a hand-beaded botanical motif rising from the hem of the chest — three stylised blooms in silver thread. A slim placket and engraved tag keep the front disciplined.',
  images: [
  { src: m('qzuLe2uZG91ne52zfsdCCE', '9'), alt: 'Forest Bloom Senator in deep green on mannequin, three-quarter view' },
  { src: m('sMf89ZXjEvXzB1ATgHCaMv', '8'), alt: 'Close-up of the silver beaded botanical embroidery on the Forest Bloom Senator' }],

  sizes: MEN_SIZES,
  colours: [
  { name: 'Forest', hex: '#1B2A22' },
  { name: 'Black', hex: '#111111' }],

  fabric: 'Premium cashmere-feel wool',
  productionDays: '10–14 working days',
  stock: 'IN_STOCK',
  featured: true,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 195000,
  salePrice: 175000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-25'
},
{
  id: 'p-m-005',
  slug: 'obsidian-wave-senator',
  sku: 'HOZ-M-SEN-005',
  name: 'Obsidian Wave Senator',
  gender: 'MEN',
  category: 'senators',
  description:
  'Jet black with a bib of flowing wave embroidery in emerald and citrine thread, echoed at the cuffs. The back panel repeats the palette in triple-run saddle stitching.',
  images: [
  { src: m('ttV8mgSjnnNpU9EUbZ6SZH', '6'), alt: 'Obsidian Wave Senator with emerald and citrine wave embroidery, front view' },
  { src: m('qzrtwprNkinMAJeuefyUwC', '7'), alt: 'Back of the Obsidian Wave Senator with emerald and citrine saddle stitching' }],

  sizes: MEN_SIZES,
  colours: [{ name: 'Obsidian', hex: '#0F0F0F' }],
  fabric: 'Japanese suiting cotton',
  productionDays: '12–15 working days',
  stock: 'MADE_TO_ORDER',
  featured: true,
  newArrival: false,
  published: true,
  showPrice: false,
  price: 0,
  currency: 'NGN',
  purchaseOptions: { online: false, office: true, custom: true },
  createdAt: '2026-09-12'
},
{
  id: 'p-m-006',
  slug: 'midnight-vine-kaftan',
  sku: 'HOZ-M-KFT-006',
  name: 'Midnight Vine Kaftan',
  gender: 'MEN',
  category: 'kaftans',
  description:
  'A full-length navy kaftan with a single diagonal vine embroidered across the chest, twin covered buttons at the collar and a minimalist welt pocket.',
  images: [{ src: m('nn5KxuicDAa7fekQi6EgJZ', '19'), alt: 'Midnight Vine Kaftan in navy with diagonal vine embroidery, full length' }],
  sizes: MEN_SIZES,
  colours: [{ name: 'Navy', hex: '#1F2B57' }],
  fabric: 'Lightweight wool-blend',
  productionDays: '7–10 working days',
  stock: 'IN_STOCK',
  featured: false,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 165000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-22'
},
{
  id: 'p-m-007',
  slug: 'graphite-motif-senator',
  sku: 'HOZ-M-SEN-007',
  name: 'Graphite Motif Senator',
  gender: 'MEN',
  category: 'senators',
  description:
  'Charcoal senator with geometric pixel-stitch motifs at the pocket and placket base. Understated enough for the office, distinctive enough for the evening.',
  images: [{ src: m('dnNxa2yBnHfnpADKzPNjie', '10'), alt: 'Graphite Motif Senator close-up with white geometric pixel-stitch embroidery' }],
  sizes: MEN_SIZES,
  colours: [
  { name: 'Graphite', hex: '#2A2B2E' },
  { name: 'Black', hex: '#111111' }],

  fabric: 'Brushed suiting cotton',
  productionDays: '7–10 working days',
  stock: 'IN_STOCK',
  featured: false,
  newArrival: false,
  published: true,
  showPrice: true,
  price: 155000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-08-30'
},
{
  id: 'p-m-008',
  slug: 'merlot-thread-kaftan',
  sku: 'HOZ-M-KFT-008',
  name: 'Merlot Thread Kaftan',
  gender: 'MEN',
  category: 'kaftans',
  description:
  'Black-plum kaftan with a long back placket drawn in merlot saddle stitching and a hidden polka-dot inlay. Made to measure in our atelier.',
  images: [{ src: m('3QHBHKumqUvQs98hvwPA1E', '18'), alt: 'Back of the Merlot Thread Kaftan with merlot stitched placket and polka-dot inlay' }],
  sizes: MEN_SIZES,
  colours: [{ name: 'Black Plum', hex: '#1C1418' }],
  fabric: 'Fine twill suiting',
  productionDays: '10–14 working days',
  stock: 'MADE_TO_ORDER',
  featured: false,
  newArrival: false,
  published: true,
  showPrice: false,
  price: 0,
  currency: 'NGN',
  purchaseOptions: { online: false, office: true, custom: true },
  createdAt: '2026-08-14'
},
{
  id: 'p-m-009',
  slug: 'pearl-regal-kaftan',
  sku: 'HOZ-M-TRD-009',
  name: 'Pearl Regal Kaftan',
  gender: 'MEN',
  category: 'traditional',
  description:
  'Brilliant white with a ceremonial placket border of interlocking motifs in champagne and bronze, studded with hand-set pearl beading. Our most requested wedding piece.',
  images: [{ src: m('b6ZoY27jWDKGJoVTV4g8KQ', '13'), alt: 'Pearl Regal Kaftan with champagne and bronze hand-beaded placket border' }],
  sizes: MEN_SIZES,
  colours: [{ name: 'Pearl White', hex: '#FAFAF7' }],
  fabric: 'Swiss cotton voile, double-lined',
  productionDays: '14–21 working days',
  stock: 'MADE_TO_ORDER',
  featured: true,
  newArrival: true,
  published: true,
  showPrice: false,
  price: 0,
  currency: 'NGN',
  purchaseOptions: { online: false, office: true, custom: true },
  createdAt: '2026-10-28'
},
{
  id: 'p-w-001',
  slug: 'amara-emerald-mermaid-gown',
  sku: 'HOZ-W-EVG-001',
  name: 'Amara Emerald Mermaid Gown',
  gender: 'WOMEN',
  category: 'evening-gowns',
  description:
  'Liquid emerald satin cut close through the body and released into a sweeping mermaid train. The sweetheart bodice is crowned with hand-set gold beadwork.',
  images: [
  { src: "/f165f8ce-f576-4ff9-91c7-288ba092156f.jpg", alt: 'Amara Emerald Mermaid Gown on dress form, full length' },
  { src: "/789e2a18-ebe9-45bc-b359-f6adea4256d2.jpg", alt: 'Gold beaded sweetheart neckline detail on the Amara gown' }],

  sizes: WOMEN_SIZES,
  colours: [
  { name: 'Emerald', hex: '#0F6B45' },
  { name: 'Midnight', hex: '#121A33' }],

  fabric: 'Duchess satin with glass bead embellishment',
  productionDays: '14–21 working days',
  stock: 'IN_STOCK',
  featured: true,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 320000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-27'
},
{
  id: 'p-w-002',
  slug: 'adaeze-champagne-corset-gown',
  sku: 'HOZ-W-OCC-002',
  name: 'Adaeze Champagne Corset Gown',
  gender: 'WOMEN',
  category: 'occasion',
  description:
  'A boned corset in champagne sequins with sheer embroidered sleeves and a cloud of layered tulle. Built to your measurements for receptions and milestone nights.',
  images: [
  { src: "/66ad53ab-766b-470f-8861-e67e7829b62b.jpg", alt: 'Adaeze Champagne Corset Gown on dress form, full length' },
  { src: "/3daa25c9-e279-46d5-9c5f-3529ac460064.jpg", alt: 'Close-up of sequinned corset and sheer embroidered sleeve' }],

  sizes: WOMEN_SIZES,
  colours: [
  { name: 'Champagne', hex: '#D8C08A' },
  { name: 'Rose Gold', hex: '#C99A86' }],

  fabric: 'Sequinned mesh, tulle and silk lining',
  productionDays: '21–28 working days',
  stock: 'MADE_TO_ORDER',
  featured: true,
  newArrival: false,
  published: true,
  showPrice: false,
  price: 0,
  currency: 'NGN',
  purchaseOptions: { online: false, office: true, custom: true },
  createdAt: '2026-09-30'
},
{
  id: 'p-w-003',
  slug: 'ifeoma-wine-peplum-dress',
  sku: 'HOZ-W-OCC-003',
  name: 'Ifeoma Wine Peplum Dress',
  gender: 'WOMEN',
  category: 'occasion',
  description:
  'Off-shoulder neckline, sculpted princess seams and a box-pleated peplum in rich wine crepe. Polished from brunch to evening.',
  images: [
  { src: "/2c2862c0-fba3-4164-ad25-d076f5c5b7fc.jpg", alt: 'Ifeoma Wine Peplum Dress on dress form, front view' },
  { src: "/3f0e8e72-e2ef-4df4-acfd-136f87768585.jpg", alt: 'Close-up of off-shoulder neckline and pleated peplum' }],

  sizes: WOMEN_SIZES,
  colours: [
  { name: 'Wine', hex: '#5E1A2A' },
  { name: 'Black', hex: '#111111' }],

  fabric: 'Heavy stretch crepe',
  productionDays: '7–10 working days',
  stock: 'IN_STOCK',
  featured: true,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 145000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-24'
},
{
  id: 'p-w-004',
  slug: 'zara-ivory-power-dress',
  sku: 'HOZ-W-COR-004',
  name: 'Zara Ivory Power Dress',
  gender: 'WOMEN',
  category: 'corporate',
  description:
  'A structured ivory sheath with fine black piping and a column of gold buttons. Cap sleeves and a knee-length hem — boardroom authority, softly said.',
  images: [
  { src: "/29d0a6b8-d83c-41eb-99e0-d385b1bb1e83.jpg", alt: 'Zara Ivory Power Dress on dress form, front view' },
  { src: "/1307d34a-3331-41a2-a2f6-534d08812caf.jpg", alt: 'Neckline with black piping and gold buttons on the Zara dress' }],

  sizes: WOMEN_SIZES,
  colours: [
  { name: 'Ivory', hex: '#F4F1EA' },
  { name: 'Black', hex: '#111111' }],

  fabric: 'Bonded ponte with satin piping',
  productionDays: '7–10 working days',
  stock: 'IN_STOCK',
  featured: false,
  newArrival: true,
  published: true,
  showPrice: true,
  price: 135000,
  salePrice: 120000,
  currency: 'NGN',
  purchaseOptions: { online: true, office: true, custom: true },
  createdAt: '2026-10-21'
}];