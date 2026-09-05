import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProjectBySlug } from '@/lib/api';
import ProjectDetailsClient from './ProjectDetailsClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Keystone Real Estate Developments',
    };
  }

  const primaryImage =
    project.images?.find((img) => img.isPrimary)?.imageUrl ||
    project.images?.[0]?.imageUrl ||
    '';

  return {
    title: `${project.seoTitle || project.name} | Keystone Developments`,
    description: project.metaDescription || project.shortDescription.substring(0, 160),
    openGraph: {
      title: `${project.name} - ${project.type} Project in ${project.city}`,
      description: project.shortDescription,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    url: `https://keystonerealtyadvisor.com/projects/${project.slug}`,
    image: project.images?.map((img) => img.imageUrl) || [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.address,
      addressLocality: project.city,
      addressRegion: project.state,
      postalCode: project.pincode,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailsClient project={project} />
    </>
  );
}
