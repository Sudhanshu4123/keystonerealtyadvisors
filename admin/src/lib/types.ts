export interface SiteSettings {
  id: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  workingHours: string;
  siteTitle: string;
  siteDescription: string;
  projectsDelivered: string;
  yearsExperience: string;
  happyCustomers: string;
  ongoingProjects: string;
  updatedAt?: Date | string;
}
