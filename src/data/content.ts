import { SiteContent } from '../types/content';
import { brandImages } from './products';

// Default website content. Everything here is editable from Admin → Website content.
export const defaultSiteContent: SiteContent = {
  announcement: 'Complimentary fittings at our showrooms · Bespoke commissions welcome',
  hero: {
    women: {
      house: 'Zichael Woman',
      title: 'Women',
      subtitle: "Discover the Women's Collection",
      cta: 'Explore Women',
      image: brandImages.womenHero
    },
    men: {
      house: 'Zichael Men',
      title: 'Men',
      subtitle: "Discover the Men's Collection",
      cta: 'Explore Men',
      image: brandImages.menHero
    }
  },
  intro: {
    heading: 'Classy clothiers for those who dress',
    highlight: 'with intention.',
    body: 'House of Zichael is home to two houses — Zichael Woman and Zichael Men. Every piece is designed, cut and finished in our Nigerian atelier, ready to wear or made entirely to your measure.'
  },
  featured: {
    women: {
      title: 'The Women’s Collection',
      leadImage: "/66ad53ab-766b-470f-8861-e67e7829b62b.jpg",
      leadCaption: 'The Evening Edit'
    },
    men: {
      title: 'The Men’s Collection',
      leadImage: "/House_of_Zichael_Male_(11).jpg",
      leadCaption: 'Embroidered by hand'
    }
  },
  custom: {
    eyebrow: 'Bespoke atelier',
    heading: 'Your vision,',
    highlight: 'cut to measure.',
    body: 'From agbada for the wedding to a gown for the gala — commission something entirely your own, or adapt any piece in our collections.',
    image: brandImages.craft
  },
  showroom: {
    eyebrow: 'Visit our showrooms',
    heading: 'Try it on. Be fitted. Take it home.',
    body: 'Reserve any piece online and our stylists will prepare it for your visit — fittings and consultations are complimentary.',
    image: brandImages.showroom
  },
  story: {
    quote: 'Every Zichael piece begins with a conversation — about who you are, where you are going, and how you want to feel when you arrive.',
    attribution: 'The Atelier · House of Zichael'
  },
  social: { womenHandle: 'zichaelwoman', menHandle: 'zichaelmen' },
  footer: {
    tagline: 'Classy clothiers for men and women. Made to measure in Nigeria.',
    newsletterHeading: 'Join the House.',
    newsletterBody: 'New collections, private showroom evenings and atelier stories — sent sparingly.'
  },
  faqs: [
  {
    q: 'How long does a bespoke piece take?',
    a: 'Most made-to-measure pieces take 7–21 working days depending on embroidery and beadwork. Bridal and couture gowns can take up to 6 weeks. Your quotation always states the production window.'
  },
  {
    q: 'Why do some pieces not show a price?',
    a: 'Couture and ceremonial pieces are priced individually according to fabric, embellishment and measurements. Request a quote or visit a showroom and our stylists will prepare one for you.'
  },
  {
    q: 'Does reserving a piece guarantee it is available?',
    a: 'No. A reservation is a request. The selected showroom confirms availability and you will be notified once it is confirmed or ready for collection.'
  },
  {
    q: 'Can I send my own design or inspiration?',
    a: 'Yes. Use Request Custom Design to upload photos, sketches, screenshots or fabric references. Your files are stored privately and only viewed by our design team.'
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'Online payments are processed securely by Paystack (cards, bank transfer, USSD). Orders are only confirmed after the payment provider verifies the transaction.'
  },
  {
    q: 'Do you ship outside Nigeria?',
    a: 'We currently deliver across Nigeria. International delivery is being introduced — contact us for a quote in the meantime.'
  }],

  pages: {
    about: {
      title: 'About House of Zichael',
      intro: 'House of Zichael is a Nigerian fashion house creating considered, made-to-measure clothing for men and women — classy clothiers for people who dress with intention.',
      sections: [
      {
        heading: 'Two houses, one standard',
        body: 'Zichael Men designs kaftans, senator wear, agbada and tailoring with signature plackets and hand embroidery. Zichael Woman creates gowns, occasion wear and corporate pieces cut to flatter and built to last.'
      },
      {
        heading: 'Made in our atelier',
        body: 'Every garment is cut, stitched and finished by our in-house tailors. We fit to your measurements, adjust to your posture and finish each piece with our engraved Zichael hardware.'
      },
      {
        heading: 'Visit, buy or commission',
        body: 'Shop ready pieces online, reserve a fitting at one of our showrooms, or commission something entirely your own through our custom design service.'
      }]

    },
    'shipping-returns': {
      title: 'Shipping & Returns',
      intro: 'Delivery timelines begin once your payment is verified and production is complete.',
      sections: [
      { heading: 'Delivery within Nigeria', body: 'Standard delivery (Lagos & Abuja): 2–4 working days. Other states: 3–7 working days. Express delivery is available in Lagos and Abuja.' },
      { heading: 'Showroom collection', body: 'Choose collection at checkout and we will notify you when your order is ready at your selected showroom.' },
      { heading: 'Returns', body: 'Ready-to-wear items may be returned unworn within 7 days of delivery. Made-to-measure and custom pieces are final sale, but we offer complimentary alterations within 14 days.' }]

    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'We collect only the information needed to serve you and never sell your personal data.',
      sections: [
      { heading: 'What we collect', body: 'Contact details, delivery addresses, measurements and design references you choose to share, and order history.' },
      { heading: 'Your design references', body: 'Uploaded files are stored privately, accessible only through expiring links issued to authorised staff, and deleted on request.' },
      { heading: 'Your rights', body: 'You may request access, correction or deletion of your data at any time by contacting privacy@houseofzichael.com.' }]

    },
    terms: {
      title: 'Terms & Conditions',
      intro: 'By using this website and placing orders you agree to the following terms.',
      sections: [
      { heading: 'Orders', body: 'An order is accepted once payment has been verified by our payment provider. We will contact you if an item becomes unavailable.' },
      { heading: 'Quotations', body: 'Custom quotations are valid for the period stated. Production begins after the quotation is accepted and payment is verified.' },
      { heading: 'Reservations', body: 'Showroom reservations are requests and are not a guarantee of stock until confirmed by the showroom.' }]

    }
  }
};