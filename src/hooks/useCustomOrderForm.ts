import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Gender } from '../types/catalog';
import { CustomRequest } from '../types/commerce';
import { makeReference } from '../utils/format';

export interface CustomForm {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: 'WhatsApp' | 'Phone call' | 'Email';
  gender: Gender | '';
  clothingType: string;
  description: string;
  occasion: string;
  fabric: string;
  colour: string;
  size: string;
  measurements: string;
  quantity: number;
  completionDate: string;
  budget: string;
  instructions: string;
  consent: boolean;
}

export const STEPS = ['Your details', 'Collection', 'Requirements', 'References', 'Instructions', 'Review'];

export const clothingTypes: Record<Gender, string[]> = {
  MEN: ['Kaftan', 'Senator', 'Agbada', 'Suit', 'Shirt & trousers', 'Traditional attire', 'Other'],
  WOMEN: ['Evening gown', 'Bridal / reception', 'Corporate dress', 'Two-piece', 'Traditional attire', 'Casual wear', 'Other']
};

export const budgetRanges = ['', 'Under ₦100,000', '₦100,000 – ₦250,000', '₦250,000 – ₦500,000', '₦500,000 – ₦1,000,000', 'Above ₦1,000,000'];

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES = 10;

export function useCustomOrderForm() {
  const { products, user, submitRequest, categories } = useStore();
  const [params] = useSearchParams();
  const basedOn = useMemo(() => products.find((p) => p.slug === params.get('product')), [products, params]);
  const presetGender = params.get('gender') as Gender | null ?? basedOn?.gender ?? '';

  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CustomForm>(() => {
    const cat = basedOn && categories.find((c) => c.slug === basedOn.category);
    const typeGuess = basedOn ? clothingTypes[basedOn.gender].find((t) => cat?.name.toLowerCase().includes(t.toLowerCase().split(' ')[0])) : '';
    return {
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      whatsapp: '',
      preferredContact: 'WhatsApp',
      gender: presetGender === 'MEN' || presetGender === 'WOMEN' ? presetGender : '',
      clothingType: typeGuess ?? '',
      description: basedOn ? `Based on the ${basedOn.name} (${basedOn.sku}). ` : '',
      occasion: '',
      fabric: '',
      colour: '',
      size: '',
      measurements: '',
      quantity: 1,
      completionDate: '',
      budget: '',
      instructions: '',
      consent: false
    };
  });

  const set = <K extends keyof CustomForm,>(k: K, v: CustomForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validate = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (form.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email.';
      if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a valid phone number.';
      if (form.preferredContact === 'WhatsApp' && form.whatsapp && form.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Please check this number.';
    }
    if (s === 1 && !form.gender) e.gender = 'Choose a collection.';
    if (s === 2) {
      if (!form.clothingType) e.clothingType = 'Choose a clothing type.';
      if (form.description.trim().length < 15) e.description = 'Tell us a little more (at least 15 characters).';
      if (form.quantity < 1 || form.quantity > 50) e.quantity = 'Between 1 and 50 outfits.';
      if (form.completionDate && new Date(form.completionDate) < new Date(Date.now() + 6 * 86400000)) e.completionDate = 'Please allow at least 7 days.';
    }
    if (s === 5 && !form.consent) e.consent = 'Please confirm consent to continue.';
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const goTo = (s: number) => {
    setErrors({});
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (): string | null => {
    for (let s = 0; s < STEPS.length; s++) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return null;
      }
    }
    const now = new Date().toISOString();
    const ref = makeReference('CR');
    const req: CustomRequest = {
      ref,
      createdAt: now,
      contact: { fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), whatsapp: form.whatsapp.trim(), preferredContact: form.preferredContact },
      gender: form.gender as Gender,
      clothingType: form.clothingType,
      description: form.description.trim(),
      occasion: form.occasion.trim(),
      fabric: form.fabric.trim(),
      colour: form.colour.trim(),
      size: form.size.trim(),
      measurements: form.measurements.trim(),
      quantity: form.quantity,
      completionDate: form.completionDate,
      budget: form.budget,
      instructions: form.instructions.trim(),
      basedOn: basedOn?.id,
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      status: 'New Request',
      history: [{ status: 'New Request', at: now }],
      notes: []
    };
    submitRequest(req);
    return ref;
  };

  return { step, form, set, files, setFiles, errors, next, back, goTo, submit, basedOn };
}