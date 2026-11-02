import { Office } from '../types/catalog';

// Initial showroom records. All office details, coordinates and photographs are
// managed from Admin → Offices; replace these with the verified branch details.
export const offices: Office[] = [
{
  id: 'off-abuja',
  name: 'Abuja Flagship Atelier',
  address: 'Plot 12, Aminu Kano Crescent, Wuse 2',
  city: 'Abuja',
  state: 'FCT',
  country: 'Nigeria',
  lat: 9.0765,
  lng: 7.4802,
  phone: '+234 800 000 0001',
  whatsapp: '2348000000001',
  email: 'abuja@houseofzichael.com',
  hours: [
  { label: 'Mon – Fri', hours: '9:00 – 19:00' },
  { label: 'Saturday', hours: '10:00 – 18:00' },
  { label: 'Sunday', hours: 'By appointment' }],

  services: ['Purchases', 'Fittings', 'Consultations', 'Collections'],
  image: "/14647bbc-4bed-4008-ba21-f29115615d35.jpg",
  active: true
},
{
  id: 'off-lagos',
  name: 'Lagos Showroom',
  address: 'Admiralty Way, Lekki Phase 1',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  lat: 6.4474,
  lng: 3.4723,
  phone: '+234 800 000 0002',
  whatsapp: '2348000000002',
  email: 'lagos@houseofzichael.com',
  hours: [
  { label: 'Mon – Fri', hours: '10:00 – 19:00' },
  { label: 'Saturday', hours: '11:00 – 18:00' }],

  services: ['Purchases', 'Fittings', 'Collections'],
  image: "/House_of_Zichael_Male_(9).jpg",
  active: true
}];