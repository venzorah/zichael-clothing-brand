import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../contexts/StoreContext';
import { budgetRanges, clothingTypes, CustomForm, STEPS, useCustomOrderForm } from '../hooks/useCustomOrderForm';
import { Gender } from '../types/catalog';
import { ReferenceUploader } from '../components/custom/ReferenceUploader';
import { RequestReview } from '../components/custom/RequestReview';
import { Button } from '../components/ui/Button';
import { Field, inputClass, textareaClass } from '../components/ui/Field';

export function CustomOrder() {
  const navigate = useNavigate();
  const { content } = useStore();
  const { step, form, set, files, setFiles, errors, next, back, goTo, submit, basedOn } = useCustomOrderForm();

  useEffect(() => {
    document.title = 'Request a Custom Design | House of Zichael';
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    const ref = submit();
    if (ref) navigate(`/custom-order/success/${ref}`);
  };

  const text = (k: keyof CustomForm, label: string, opts: {type?: string;optional?: boolean;placeholder?: string;auto?: string;hint?: string;span?: boolean;} = {}) =>
  <Field label={label} htmlFor={`cf-${k}`} error={errors[k]} optional={opts.optional} hint={opts.hint} className={opts.span ? 'sm:col-span-2' : ''}>
      <input
      id={`cf-${k}`}
      type={opts.type ?? 'text'}
      autoComplete={opts.auto}
      placeholder={opts.placeholder}
      value={form[k] as string}
      onChange={(e) => set(k, e.target.value as never)}
      className={inputClass} />
    
    </Field>;


  return (
    <div className="mx-auto grid max-w-site lg:grid-cols-[minmax(0,420px)_1fr]">
      <aside className="relative hidden overflow-hidden bg-luxe lg:block">
        <div className="sticky top-20 h-[calc(100vh-80px)]">
          <img src={content.custom.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 p-10 text-white">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">Bespoke atelier</p>
            <p className="mt-3 font-display text-4xl leading-tight">Tell us what you imagine. We’ll make it real.</p>
            <p className="mt-4 text-[14px] leading-relaxed text-white/70">Every request is reviewed by a stylist. You’ll receive a detailed quotation before anything is cut.</p>
          </div>
        </div>
      </aside>

      <div className="px-5 py-10 lg:px-16 lg:py-14">
        <h1 className="font-display text-5xl leading-none text-ink lg:text-6xl">Request a custom design</h1>
        {basedOn &&
        <div className="mt-6 flex items-center gap-4 border border-line p-3">
            <img src={basedOn.images[0].src} alt="" className="h-16 w-12 object-cover" />
            <p className="text-[14px] text-body">
              Starting from <strong className="font-medium text-ink">{basedOn.name}</strong>
            </p>
          </div>
        }

        <ol className="mt-10 hidden grid-cols-6 gap-2 sm:grid" aria-label="Progress">
          {STEPS.map((s, i) =>
          <li key={s} aria-current={i === step ? 'step' : undefined}>
              <div className={`h-0.5 ${i <= step ? 'bg-gold' : 'bg-line'}`} />
              <p className={`mt-2 truncate text-[11px] uppercase tracking-[0.14em] ${i === step ? 'text-ink' : 'text-muted'}`}>{s}</p>
            </li>
          )}
        </ol>
        <div className="mt-8 sm:hidden">
          <div className="h-0.5 bg-line">
            <div className="h-full bg-gold transition-[width] duration-300 ease-luxe" style={{ width: `${(step + 1) / STEPS.length * 100}%` }} />
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-ink">{STEPS[step]}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              {step === 0 &&
              <div className="grid gap-5 sm:grid-cols-2">
                  {text('fullName', 'Full name', { auto: 'name', span: true })}
                  {text('email', 'Email', { type: 'email', auto: 'email' })}
                  {text('phone', 'Phone number', { type: 'tel', auto: 'tel' })}
                  {text('whatsapp', 'WhatsApp number', { type: 'tel', optional: true, hint: 'If different from your phone number' })}
                  <Field label="Preferred contact" htmlFor="cf-contact">
                    <select id="cf-contact" value={form.preferredContact} onChange={(e) => set('preferredContact', e.target.value as CustomForm['preferredContact'])} className={inputClass}>
                      <option>WhatsApp</option>
                      <option>Phone call</option>
                      <option>Email</option>
                    </select>
                  </Field>
                </div>
              }

              {step === 1 &&
              <fieldset>
                  <legend className="mb-5 text-[15px] text-body">Which house should design your piece?</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(
                  [
                  ['WOMEN', "Women's Fashion", 'Zichael Woman', "/f165f8ce-f576-4ff9-91c7-288ba092156f.jpg"],
                  ['MEN', "Men's Fashion", 'Zichael Men', "/House_of_Zichael_Male_(9).jpg"]] as
                  [Gender, string, string, string][]).
                  map(([g, label, house, img]) =>
                  <label key={g} className={`group relative block cursor-pointer overflow-hidden border-2 transition-colors duration-150 ${form.gender === g ? 'border-gold' : 'border-transparent'}`}>
                        <input
                      type="radio"
                      name="gender"
                      className="sr-only"
                      checked={form.gender === g}
                      onChange={() => {
                        set('gender', g);
                        set('clothingType', '');
                      }} />
                    
                        <div className="relative aspect-[4/3]">
                          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#E6C860]">{house}</p>
                            <p className="font-display text-3xl">{label}</p>
                          </div>
                        </div>
                      </label>
                  )}
                  </div>
                  {errors.gender &&
                <p role="alert" className="mt-3 text-[13px] text-red-700 dark:text-red-400">
                      {errors.gender}
                    </p>
                }
                </fieldset>
              }

              {step === 2 && form.gender &&
              <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Clothing type" htmlFor="cf-type" error={errors.clothingType}>
                    <select id="cf-type" value={form.clothingType} onChange={(e) => set('clothingType', e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      {clothingTypes[form.gender].map((t) =>
                    <option key={t}>{t}</option>
                    )}
                    </select>
                  </Field>
                  {text('occasion', 'Occasion', { optional: true, placeholder: 'Wedding, gala, office…' })}
                  <Field label="Outfit description" htmlFor="cf-desc" error={errors.description} className="sm:col-span-2">
                    <textarea id="cf-desc" value={form.description} onChange={(e) => set('description', e.target.value)} className={textareaClass} placeholder="Silhouette, neckline, sleeves, embroidery, length…" />
                  </Field>
                  {text('fabric', 'Preferred fabric', { optional: true, placeholder: 'Cashmere wool, lace, aso-oke…' })}
                  {text('colour', 'Preferred colour', { optional: true })}
                  {text('size', 'Size', { optional: true, placeholder: form.gender === 'MEN' ? 'e.g. L' : 'e.g. UK 10' })}
                  <Field label="Number of outfits" htmlFor="cf-qty" error={errors.quantity}>
                    <input id="cf-qty" type="number" min={1} max={50} value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} className={inputClass} />
                  </Field>
                  <Field label="Measurements" htmlFor="cf-meas" optional hint="Leave blank to be measured at a showroom fitting." className="sm:col-span-2">
                    <textarea id="cf-meas" value={form.measurements} onChange={(e) => set('measurements', e.target.value)} className={`${textareaClass} min-h-[96px]`} placeholder="Chest 42in, shoulder 19in, sleeve 25in, length 44in…" />
                  </Field>
                  <Field label="Preferred completion date" htmlFor="cf-date" optional error={errors.completionDate}>
                    <input id="cf-date" type="date" value={form.completionDate} onChange={(e) => set('completionDate', e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Budget range" htmlFor="cf-budget" optional>
                    <select id="cf-budget" value={form.budget} onChange={(e) => set('budget', e.target.value)} className={inputClass}>
                      {budgetRanges.map((b) =>
                    <option key={b} value={b}>
                          {b || 'Prefer not to say'}
                        </option>
                    )}
                    </select>
                  </Field>
                </div>
              }

              {step === 3 &&
              <div>
                  <p className="mb-6 text-[15px] text-body">Add inspiration photos, screenshots, sketches, fabric samples or existing designs.</p>
                  <ReferenceUploader files={files} onChange={setFiles} />
                </div>
              }

              {step === 4 &&
              <Field label="Additional instructions" htmlFor="cf-instr" optional hint="Anything else we should know — fit preferences, details to avoid, delivery needs.">
                  <textarea id="cf-instr" value={form.instructions} onChange={(e) => set('instructions', e.target.value)} className={`${textareaClass} min-h-[240px]`} />
                </Field>
              }

              {step === 5 &&
              <div>
                  <RequestReview form={form} fileCount={files.length} onEdit={goTo} />
                  <label className="mt-8 flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-body">
                    <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#D4AF37]" />
                    I consent to House of Zichael processing my personal information, measurements and uploaded references to prepare my design and quotation, as described in the Privacy Policy.
                  </label>
                  {errors.consent &&
                <p role="alert" className="mt-2 text-[13px] text-red-700 dark:text-red-400">
                      {errors.consent}
                    </p>
                }
                </div>
              }
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
            {step > 0 ?
            <Button variant="ghost" onClick={back} className="px-0">
                Back
              </Button> :

            <span />
            }
            <Button type="submit" variant={step === STEPS.length - 1 ? 'gold' : 'primary'} size="lg">
              {step === STEPS.length - 1 ? 'Submit request' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>);

}