import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for contact message
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  updated_at?: string;
}

// API functions
export const contactAPI = {
  /**
   * Submit a contact form message
   * @param data Contact form data
   * @returns Response from API
   */
  async submit(data: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'ip_address' | 'user_agent'>) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit message');
      }

      return result;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  /**
   * Get all messages (admin only)
   * @param apiKey Admin API key
   * @returns Array of messages
   */
  async getAll(apiKey: string): Promise<ContactMessage[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/messages`, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch messages');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
};
