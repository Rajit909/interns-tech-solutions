
'use client';

import { notFound } from 'next/navigation';

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  // This page is no longer used for taking the quiz, as it's now handled by a popup.
  // We can redirect to the main quizzes page or show a message.
  // For now, we'll just redirect to not found, as this page shouldn't be accessed directly.
  notFound();

  return null;
}
