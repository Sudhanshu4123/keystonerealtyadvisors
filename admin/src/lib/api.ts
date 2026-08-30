export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function seedDatabase() {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    console.error('Seed database error:', err);
    return { success: false, error: 'Backend server is offline or unreachable.' };
  }
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('keystone_admin_token');
}

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('keystone_admin_token', token);
    document.cookie = `keystone_admin_token=${token}; path=/; max-age=86400`;
  }
}

export function removeAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('keystone_admin_token');
    document.cookie = 'keystone_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401 && typeof window !== 'undefined') {
      removeAdminToken();
    }

    return res;
  } catch (error: any) {
    console.error(`adminFetch error on ${endpoint}:`, error);
    return new Response(
      JSON.stringify({ error: 'Backend server is unreachable. Please ensure the backend is running.' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function adminLogin(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setAdminToken(data.token);
    }
    return { ok: res.ok, status: res.status, data };
  } catch (error: any) {
    console.error('adminLogin error:', error);
    return {
      ok: false,
      status: 503,
      data: { error: 'Backend server is offline or unreachable. Please start the backend server.' },
    };
  }
}

export async function adminLogout() {
  removeAdminToken();
}

export async function getAdminMetrics() {
  try {
    const res = await adminFetch('/projects');
    const projectsRaw = res.ok ? await res.json() : [];
    const projects = Array.isArray(projectsRaw) ? projectsRaw : (projectsRaw?.projects || []);

    const inqRes = await adminFetch('/inquiries');
    const inquiriesRaw = inqRes.ok ? await inqRes.json() : [];
    const inquiries = Array.isArray(inquiriesRaw) ? inquiriesRaw : (inquiriesRaw?.inquiries || []);

    const msgRes = await adminFetch('/messages');
    const messagesRaw = msgRes.ok ? await msgRes.json() : [];
    const messages = Array.isArray(messagesRaw) ? messagesRaw : (messagesRaw?.messages || []);

    const upcomingProjects = projects.filter((p: any) => p.status === 'Upcoming').length;
    const ongoingProjects = projects.filter((p: any) => p.status === 'Ongoing').length;
    const completedProjects = projects.filter((p: any) => p.status === 'Completed').length;
    const newInquiries = inquiries.filter((i: any) => i.status === 'NEW').length;

    return {
      totalProjects: projects.length,
      upcomingProjects,
      ongoingProjects,
      completedProjects,
      totalInquiries: inquiries.length,
      newInquiries,
      totalMessages: messages.length,
      recentInquiries: inquiries.slice(0, 5),
    };
  } catch (err) {
    console.error('getAdminMetrics error:', err);
    return {
      totalProjects: 0,
      upcomingProjects: 0,
      ongoingProjects: 0,
      completedProjects: 0,
      totalInquiries: 0,
      newInquiries: 0,
      totalMessages: 0,
      recentInquiries: [],
    };
  }
}
