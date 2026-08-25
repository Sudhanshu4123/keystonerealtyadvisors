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
    companyName: 'Keystone Real Estate Developments',
    phone: '+91 9217668175',
    whatsapp: '+91 9217668175',
    email: 'shrishyamproperties001@gmail.com',
    address: 'Vardhaman City Mall, Dwarka, Delhi',
    workingHours: 'Monday - Sunday: 9:00 AM - 8:00 PM (7 Days Open)',
    siteTitle: 'Keystone | Premium Real Estate Projects Showcase',
    siteDescription: 'Explore luxury residential and commercial developments built for modern living and lasting value.',
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
  const res = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function submitContactMessage(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function submitReview(data: {
  name: string;
  designation?: string;
  review: string;
  image?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
