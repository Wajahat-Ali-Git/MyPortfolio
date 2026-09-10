'use server';

import { supabase } from '@/lib/supabase';

export interface SubmitContactState {
  success: boolean;
  error?: string;
}

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  message: string;
}): Promise<SubmitContactState> {
  const { name, email, message } = formData;

  // Validation
  if (!name || !name.trim()) {
    return { success: false, error: 'Name is required' };
  }

  if (!email || !email.trim()) {
    return { success: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address' };
  }

  if (!message || message.trim().length < 10) {
    return { success: false, error: 'Message must be at least 10 characters long' };
  }

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        },
      ]);

    if (error) {
      console.error('Supabase contact submission error:', error);
      return { success: false, error: 'Failed to send message. Please try again later.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Server action error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}
