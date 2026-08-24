import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function seedDatabase() {
  try {
    // 1. Seed Admin
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const passwordHash = await hashPassword('Admin@123456');
      await prisma.admin.create({
        data: {
          name: 'Keystone Super Admin',
          email: 'admin@keystone.com',
          passwordHash,
        },
      });
      console.log('Admin user seeded (admin@keystone.com / Admin@123456)');
    }

    // 2. Seed Settings
    await prisma.settings.upsert({
      where: { id: 'site_settings' },
      update: {
        phone: '+91 9217668175',
        whatsapp: '+91 9217668175',
        email: 'shrishyamproperties001@gmail.com',
        address: 'Vardhaman City Mall, Dwarka, Delhi',
        workingHours: 'Monday - Sunday: 9:00 AM - 8:00 PM (7 Days Open)',
      },
      create: {
        id: 'site_settings',
        companyName: 'Keystone Real Estate Developments',
        phone: '+91 9217668175',
        whatsapp: '+91 9217668175',
        email: 'shrishyamproperties001@gmail.com',
        address: 'Vardhaman City Mall, Dwarka, Delhi',
        workingHours: 'Monday - Sunday: 9:00 AM - 8:00 PM (7 Days Open)',
        siteTitle: 'Keystone | Premium Real Estate Projects Showcase',
        siteDescription: 'Explore luxury residential and commercial projects built for modern living, architectural innovation, and lasting value.',
        projectsDelivered: '48+',
        yearsExperience: '15+',
        happyCustomers: '12,500+',
        ongoingProjects: '12',
      },
    });
    console.log('Site settings seeded');

    // 3. Seed Testimonials
    const testimonialCount = await prisma.testimonial.count();
    if (testimonialCount === 0) {
      await prisma.testimonial.createMany({
        data: [
          {
            name: 'Alexander Vance',
            designation: 'Managing Director, Sterling Group',
            review: 'Keystone Developments delivered our corporate office tower ahead of schedule. The architectural quality and sustainable design standards are truly world class.',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            published: true,
          },
          {
            name: 'Victoria Kensington',
            designation: 'Villa Resident',
            review: 'Our family moved into Grand Horizon Bay Villas last year. The private landscaping, high-end security, and community amenities exceed every expectation.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            published: true,
          },
          {
            name: 'Marcus Thorne',
            designation: 'Commercial Real Estate Investor',
            review: 'Keystone’s transparent project planning, digital walkthroughs, and detailed floor plan execution make them our top choice developer for long-term equity growth.',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            published: true,
          },
        ],
      });
      console.log('Sample testimonials seeded');
    }

    // 4. Seed Projects
    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
      const sampleProjects = [
        {
          name: 'The Royal Azure Residences',
          slug: 'the-royal-azure-residences-manhattan',
          type: 'Residential',
          status: 'Ongoing',
          shortDescription: 'A landmark 36-story luxury high-rise condominium tower featuring panoramic Manhattan skyline views and resort-style amenities.',
          description: 'The Royal Azure Residences redefines Manhattan vertical living. Spanning 4.5 acres of prime waterfront real estate, this project comprises 240 masterfully crafted luxury suites with Italian marble finishes, private outdoor terraces, smart home automation, and double-height ceiling lobbies.',
          developer: 'Keystone Real Estate Developments',
          address: '420 Park Avenue Waterfront',
          area: 'Manhattan',
          city: 'New York',
          state: 'NY',
          pincode: '10001',
          totalArea: '4.5 Acres',
          buildings: 3,
          floors: 36,
          units: 240,
          completionDate: 'Q3 2027',
          featured: true,
          published: true,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
              { imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isPrimary: false },
              { imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isPrimary: false },
            ],
          },
          amenities: {
            create: [
              { name: 'Swimming Pool' },
              { name: 'Gym' },
              { name: 'Club House' },
              { name: 'Parking' },
              { name: 'CCTV' },
              { name: 'Security' },
              { name: 'Garden' },
              { name: 'Power Backup' },
              { name: 'Lift' },
            ],
          },
          floorPlans: {
            create: [
              { title: 'Type A - 2 Bedroom Deluxe Suite (1,450 sq.ft)', description: 'Spacious 2 BHK layout with ocean view balcony and master suite.', fileUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80' },
              { title: 'Type B - 4 Bedroom Penthouse (3,200 sq.ft)', description: 'Top floor penthouse layout with private plunge pool terrace.', fileUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80' },
            ],
          },
          brochures: {
            create: [
              { fileName: 'Royal_Azure_Residences_Brochure.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            ],
          },
        },
        {
          name: 'Grand Horizon Bay Villas',
          slug: 'grand-horizon-bay-villas-beverly-hills',
          type: 'Luxury',
          status: 'Ongoing',
          shortDescription: 'An ultra-exclusive gated sanctuary of 18 Mediterranean luxury villas nestled in Beverly Hills.',
          description: 'Grand Horizon Bay Villas is an architectural masterwork. Set amidst 12 acres of private hillside, each 2-story villa includes infinity edge private swimming pools, zero-edge glass facades, wine cellars, organic gardens, and 24/7 dedicated security personnel.',
          developer: 'Keystone Real Estate Developments',
          address: '742 Foothill Ridge Road',
          area: 'Beverly Hills',
          city: 'Los Angeles',
          state: 'CA',
          pincode: '90210',
          totalArea: '12 Acres',
          buildings: 18,
          floors: 2,
          units: 18,
          completionDate: 'Q1 2027',
          featured: true,
          published: true,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
              { imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', isPrimary: false },
            ],
          },
          amenities: {
            create: [
              { name: 'Swimming Pool' },
              { name: 'Gym' },
              { name: 'Parking' },
              { name: 'CCTV' },
              { name: 'Security' },
              { name: 'Garden' },
              { name: 'Power Backup' },
            ],
          },
          floorPlans: {
            create: [
              { title: 'Villa Model Alpha (6,500 sq.ft)', description: '6-bedroom villa with 4-car subterranean garage and infinity pool.', fileUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
            ],
          },
          brochures: {
            create: [
              { fileName: 'Grand_Horizon_Villas_Brochure.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            ],
          },
        },
        {
          name: 'The Zenith Corporate Tower',
          slug: 'the-zenith-corporate-tower-financial-district',
          type: 'Commercial',
          status: 'Completed',
          shortDescription: 'A 42-story LEED-certified Grade-A corporate headquarters tower in Wall Street Financial District.',
          description: 'The Zenith Corporate Tower stands as an iconic glass skyscraper designed for global financial institutions and tech enterprises. Features double-height glass lobbies, column-free floor plates, high-speed destination elevators, and energy-efficient climate control.',
          developer: 'Keystone Real Estate Developments',
          address: '100 Wall Street Plaza',
          area: 'Financial District',
          city: 'New York',
          state: 'NY',
          pincode: '10005',
          totalArea: '2.8 Acres',
          buildings: 1,
          floors: 42,
          units: 50,
          completionDate: 'Completed 2025',
          featured: true,
          published: true,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
              { imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', isPrimary: false },
            ],
          },
          amenities: {
            create: [
              { name: 'Parking' },
              { name: 'CCTV' },
              { name: 'Security' },
              { name: 'Power Backup' },
              { name: 'Lift' },
              { name: 'Fire Safety' },
              { name: 'Intercom' },
            ],
          },
          floorPlans: {
            create: [
              { title: 'Typical Executive Floor Plate (12,500 sq.ft)', description: 'Open floor plan with 360-degree curtain wall glass facade.', fileUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80' },
            ],
          },
          brochures: {
            create: [
              { fileName: 'Zenith_Corporate_Tower_Brochure.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            ],
          },
        },
        {
          name: 'Greenwood Park Estates',
          slug: 'greenwood-park-estates-austin',
          type: 'Residential',
          status: 'Upcoming',
          shortDescription: 'A master-planned sustainable eco-township comprising 120 contemporary modern craftsman homes.',
          description: 'Greenwood Park Estates offers sustainable suburban luxury across 35 acres of oak groves in Austin, Texas. Includes solar microgrid integration, organic community farms, miles of walking trails, and clubhouses.',
          developer: 'Keystone Real Estate Developments',
          address: '1208 Windsor Park Way',
          area: 'Tarrytown',
          city: 'Austin',
          state: 'TX',
          pincode: '78703',
          totalArea: '35 Acres',
          buildings: 120,
          floors: 2,
          units: 120,
          completionDate: 'Launching Q2 2027',
          featured: false,
          published: true,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
            ],
          },
          amenities: {
            create: [
              { name: 'Garden' },
              { name: "Children's Play Area" },
              { name: 'Sports Facilities' },
              { name: 'Security' },
              { name: 'Parking' },
            ],
          },
        },
        {
          name: 'The Promenade Plaza',
          slug: 'the-promenade-plaza-soho',
          type: 'Mixed Use',
          status: 'Ongoing',
          shortDescription: 'A modern mixed-use development combining luxury residential lofts and high-end street-level retail promenades.',
          description: 'Situated in the heart of SoHo, Manhattan, The Promenade Plaza blends iconic cast-iron architecture with contemporary luxury. Features 60 designer lofts and 15 flagship retail storefronts.',
          developer: 'Keystone Real Estate Developments',
          address: '512 Broadway Promenade',
          area: 'SoHo',
          city: 'New York',
          state: 'NY',
          pincode: '10012',
          totalArea: '3.2 Acres',
          buildings: 1,
          floors: 12,
          units: 60,
          completionDate: 'Q4 2027',
          featured: true,
          published: true,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
              { imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', isPrimary: false },
            ],
          },
          amenities: {
            create: [
              { name: 'Parking' },
              { name: 'Security' },
              { name: 'CCTV' },
              { name: 'Lift' },
              { name: 'Power Backup' },
            ],
          },
        },
        {
          name: 'Apex Innovation & Logistics Hub',
          slug: 'apex-innovation-logistics-hub-chicago',
          type: 'Commercial',
          status: 'Upcoming',
          shortDescription: 'A 45-acre industrial logistics park designed for next-generation automated distribution & fulfillment.',
          description: 'Apex Innovation & Logistics Hub is engineered for global supply chains. Features 32ft clear height ceilings, ESFR fire suppression systems, 3-phase heavy industrial power, and heavy vehicle dock yards.',
          developer: 'Keystone Real Estate Developments',
          address: '9400 W Higgins Rd',
          area: 'O’Hare Industrial Corridor',
          city: 'Chicago',
          state: 'IL',
          pincode: '60666',
          totalArea: '45 Acres',
          buildings: 4,
          floors: 3,
          units: 12,
          completionDate: 'Launching Q1 2028',
          featured: false,
          published: true,
          images: {
            create: [
              { imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', isPrimary: true },
            ],
          },
          amenities: {
            create: [
              { name: 'Parking' },
              { name: 'Security' },
              { name: 'Power Backup' },
              { name: 'Fire Safety' },
            ],
          },
        },
      ];

      for (const proj of sampleProjects) {
        await prisma.project.create({ data: proj });
      }
      console.log('6 Sample projects seeded');
    }

    return { success: true, message: 'Projects database seeded successfully' };
  } catch (error) {
    console.error('Database seed error:', error);
    return { success: false, error: String(error) };
  }
}
