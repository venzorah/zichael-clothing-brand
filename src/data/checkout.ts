export const discountCodes: Record<string, {rate: number;label: string;}> = {
  HOZWELCOME: { rate: 0.1, label: 'Welcome — 10% off' },
  ATELIER5: { rate: 0.05, label: 'Atelier — 5% off' }
};

export const shippingMethods = [
{ id: 'standard', label: 'Standard delivery', detail: 'Lagos & Abuja 2–4 days · other states 3–7 days', fee: 5000 },
{ id: 'express', label: 'Express delivery', detail: 'Lagos & Abuja only · 1–2 days', fee: 12000 },
{ id: 'pickup', label: 'Collect from a showroom', detail: 'Free · we notify you when it’s ready', fee: 0 }];


export const nigerianStates = [
'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];