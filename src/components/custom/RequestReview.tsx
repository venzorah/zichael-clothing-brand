import React from 'react';
import { CustomForm } from '../../hooks/useCustomOrderForm';
import { formatDate } from '../../utils/format';

interface RequestReviewProps {
  form: CustomForm;
  fileCount: number;
  onEdit: (step: number) => void;
}

export function RequestReview({ form, fileCount, onEdit }: RequestReviewProps) {
  const groups: {title: string;step: number;rows: [string, string][];}[] = [
  {
    title: 'Your details',
    step: 0,
    rows: [
    ['Name', form.fullName],
    ['Email', form.email],
    ['Phone', form.phone],
    ['WhatsApp', form.whatsapp || '—'],
    ['Preferred contact', form.preferredContact]]

  },
  { title: 'Collection', step: 1, rows: [['Fashion category', form.gender === 'MEN' ? "Men's Fashion" : "Women's Fashion"]] },
  {
    title: 'Requirements',
    step: 2,
    rows: [
    ['Clothing type', form.clothingType],
    ['Description', form.description],
    ['Occasion', form.occasion || '—'],
    ['Fabric', form.fabric || '—'],
    ['Colour', form.colour || '—'],
    ['Size', form.size || '—'],
    ['Measurements', form.measurements || 'To be taken at fitting'],
    ['Number of outfits', String(form.quantity)],
    ['Completion date', form.completionDate ? formatDate(form.completionDate) : 'Flexible'],
    ['Budget', form.budget || 'Not specified']]

  },
  { title: 'References', step: 3, rows: [['Files attached', fileCount ? `${fileCount} file${fileCount > 1 ? 's' : ''}` : 'None']] },
  { title: 'Instructions', step: 4, rows: [['Additional instructions', form.instructions || '—']] }];


  return (
    <div className="divide-y divide-line border-y border-line">
      {groups.map((g) =>
      <section key={g.title} className="py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink">{g.title}</h3>
            <button type="button" onClick={() => onEdit(g.step)} className="text-[13px] text-gold-ink underline-offset-4 hover:underline">
              Edit
            </button>
          </div>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[180px_1fr]">
            {g.rows.map(([k, v]) =>
          <React.Fragment key={k}>
                <dt className="text-[14px] text-muted">{k}</dt>
                <dd className="whitespace-pre-line text-[14px] text-ink">{v}</dd>
              </React.Fragment>
          )}
          </dl>
        </section>
      )}
    </div>);

}