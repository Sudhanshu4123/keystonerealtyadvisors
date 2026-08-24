export type ProjectType = 'Residential' | 'Commercial' | 'Mixed Use' | 'Luxury' | 'Other';
export type ProjectStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder?: number;
  createdAt?: Date | string;
}

export interface FloorPlan {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  createdAt?: Date | string;
}

export interface Brochure {
  id: string;
  projectId: string;
  fileUrl: string;
  fileName: string;
  createdAt?: Date | string;
}

export interface ProjectAmenity {
  id: string;
  projectId: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  type: ProjectType | string;
  status: ProjectStatus | string;
  shortDescription: string;
  description: string;
  developer: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  totalArea?: string | null;
  buildings?: number | null;
  floors?: number | null;
  units?: number | null;
  completionDate?: string | null;
  featured: boolean;
  published: boolean;
  seoTitle?: string | null;
  metaDescription?: string | null;
  images: ProjectImage[];
  amenities?: ProjectAmenity[] | string[];
  floorPlans?: FloorPlan[];
  brochures?: Brochure[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ProjectFilterParams {
  search?: string;
  type?: string;
  status?: string;
  location?: string;
  featured?: boolean;
  sortBy?: 'newest' | 'name-asc';
  page?: number;
  limit?: number;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
    city: string;
    area: string;
  } | null;
  message: string;
  preferredContact: 'PHONE' | 'EMAIL' | 'WHATSAPP';
  visitDate?: string | null;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: Date | string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
  createdAt: Date | string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  review: string;
  image?: string | null;
  published: boolean;
  createdAt?: Date | string;
}

export interface SiteSettings {
  id: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  siteTitle: string;
  siteDescription: string;
  projectsDelivered: string;
  yearsExperience: string;
  happyCustomers: string;
  ongoingProjects: string;
  updatedAt?: Date | string;
}

export const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Mixed Use',
  'Luxury',
  'Other',
] as const;

export const PROJECT_STATUSES = ['Upcoming', 'Ongoing', 'Completed'] as const;

export const PROJECT_AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Club House',
  'Parking',
  'CCTV',
  'Security',
  'Garden',
  "Children's Play Area",
  'Power Backup',
  'Lift',
  'Sports Facilities',
  'Intercom',
  'Fire Safety',
] as const;
