// lib/sheets-client.ts
// Pode ser importado em 'use client'
import { FeedbackFormData } from '@/types';

interface SheetData extends FeedbackFormData {
  user_id: string;
  user_name: string;
}

export async function sendToGoogleSheets(data: SheetData): Promise<void> {
  const res = await fetch('/api/sheets/append', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  console.log(data)
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Sheets append failed: ${res.status} ${text}`);
  }
}

