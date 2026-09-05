import { Project, SiteSettings, Testimonial } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function fetchProjects(params?: {
  search?: string;
  type?: string;
  status?: string;
  location?: string;
  featured?: boolean;
  sortBy?: string;
  publishedOnly?: boolean;
}): Promise<Project[]> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.type && params.type !== 'ALL') query.append('type', params.type);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.location) query.append('location', params.location);
    if (params?.featured) query.append('featured', 'true');
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.publishedOnly !== false) query.append('publishedOnly', 'true');

    const res = await fetch(`${API_BASE_URL}/projects?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Fetch projects client error:', err);
    return [];
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fetch project detail client error:', err);
    return null;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    id: 'site_settings',
    companyName: 'Shri Shyam Associate',
    phone: '+91 9911956274',
    whatsapp: '+91 9911956274',
    email: 'shrishyamproperties001@gmail.com',
    address: 'Shop No. 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7, Dwarka, Delhi - 110077',
    workingHours: 'Monday - Sunday: Open 24 Hours (24/7)',
    siteTitle: 'Shri Shyam Associate | Home Builder & Real Estate in Sector 7 Dwarka, Delhi',
    siteDescription:
      'Shri Shyam Associate is a premier Home Builder and Real Estate Consultant in Sector 7, Dwarka, Delhi. Located at Shop No 247, 2nd Floor, Vardhaman City Mall. Call +91 9911956274.',
    projectsDelivered: '48+',
    yearsExperience: '15+',
    happyCustomers: '12,500+',
    ongoingProjects: '12',
  };

  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      cache: 'no-store',
    });
    if (!res.ok) return fallbackSettings;
    const data = await res.json();
    return data.settings || data || fallbackSettings;
  } catch (err) {
    return fallbackSettings;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials?publishedOnly=true`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function submitInquiry(data: {
  name: string;
  phone: string;
  email?: string;
  projectId?: string;
  message: string;
  preferredContact?: string;
  visitDate?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Submit inquiry network error:', err);
    return { success: false, error: 'Backend server is offline or unreachable. Please try again later.' };
  }
}

export async function submitContactMessage(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Submit message network error:', err);
    return { success: false, error: 'Backend server is offline or unreachable. Please try again later.' };
  }
}

export async function submitReview(data: {
  name: string;
  designation?: string;
  review: string;
  image?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Submit review network error:', err);
    return { success: false, error: 'Backend server is offline or unreachable. Please try again later.' };
  }
}
