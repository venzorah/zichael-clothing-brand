import React from 'react';
import { StatusEvent } from '../types/commerce';
import { formatDateTime } from '../utils/format';

interface StatusTimelineProps {
  history: StatusEvent[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  const items = [...history].reverse();
  return (
    <ol className="relative space-y-5 border-l border-line pl-6">
      {items.map((h, i) =>
      <li key={h.at + h.status} className="relative">
          <span className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-gold' : 'bg-line'}`} aria-hidden="true" />
          <p className={`text-[15px] ${i === 0 ? 'font-medium text-ink' : 'text-body'}`}>{h.status}</p>
          <p className="text-[13px] text-muted">
            {formatDateTime(h.at)}
            {h.note ? ` · ${h.note}` : ''}
          </p>
        </li>
      )}
    </ol>);

}