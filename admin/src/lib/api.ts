const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

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

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    removeAdminToken();
  }

  return res;
}

export async function adminLogin(email: string, password: string) {
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
}

export async function adminLogout() {
  removeAdminToken();
}

export async function getAdminMetrics() {
  const res = await adminFetch('/projects');
  const projects = res.ok ? await res.json() : [];

  const inqRes = await adminFetch('/inquiries');
  const inquiries = inqRes.ok ? await inqRes.json() : [];

  const msgRes = await adminFetch('/messages');
  const messages = msgRes.ok ? await msgRes.json() : [];

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
}
