package com.keystone.realestate.initializer;

import com.keystone.realestate.model.*;
import com.keystone.realestate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SiteSettingsRepository settingsRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedSettings();
        seedProjects();
        seedTestimonials();
    }

    public void seedAdmin() {
        if (adminRepository.findByEmail("admin@keystone.com").isEmpty()) {
            Admin admin = Admin.builder()
                    .name("Keystone Admin")
                    .email("admin@keystone.com")
                    .passwordHash(passwordEncoder.encode("Admin@123456"))
                    .build();
            adminRepository.save(admin);
            System.out.println("✅ Default Admin account created: admin@keystone.com");
        }
    }

    public void seedSettings() {
        if (settingsRepository.findById("site_settings").isEmpty()) {
            SiteSettings settings = SiteSettings.builder()
                    .id("site_settings")
                    .companyName("Shri Shyam Associate")
                    .phone("+91 9911956274")
                    .whatsapp("+91 9911956274")
                    .email("shrishyamproperties001@gmail.com")
                    .address("Shop No. 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7, Dwarka, Delhi - 110077")
                    .workingHours("Monday - Sunday: Open 24 Hours (24/7)")
                    .siteTitle("Shri Shyam Associate | Home Builder & Real Estate in Sector 7 Dwarka, Delhi")
                    .siteDescription("Shri Shyam Associate is a premier Home Builder and Real Estate Consultant in Sector 7, Dwarka, Delhi. Located at Shop No 247, 2nd Floor, Vardhaman City Mall. Call +91 9911956274.")
                    .projectsDelivered("48+")
                    .yearsExperience("15+")
                    .happyCustomers("12,500+")
                    .ongoingProjects("12")
                    .build();
            settingsRepository.save(settings);
            System.out.println("✅ Default Site Settings seeded.");
        }
    }

    public void seedProjects() {
        if (projectRepository.count() == 0) {
            Project p1 = Project.builder()
                    .name("The Grand Azure Residences")
                    .slug("grand-azure-residences")
                    .type("Residential")
                    .status("Ongoing")
                    .shortDescription("Ultra-luxury 3 & 4 BHK sky-villas featuring panoramic oceanfront balcony views.")
                    .description("Designed by world-renowned architects, The Grand Azure Residences combines modern luxury living with state-of-the-art sustainable engineering. Enjoy heated infinity pools, private elevator access, and automated smart-home climate control.")
                    .developer("Keystone Luxury Housing Ltd.")
                    .address("Sector 12, Golf Course Road")
                    .area("Dwarka Expressway")
                    .city("Delhi")
                    .state("Delhi NCR")
                    .pincode("110075")
                    .totalArea("5.2 Acres")
                    .buildings(4)
                    .floors(32)
                    .units(240)
                    .completionDate("Q4 2027")
                    .featured(true)
                    .published(true)
                    .seoTitle("The Grand Azure Residences | Luxury Apartments Dwarka Expressway")
                    .metaDescription("Ultra-luxury 3 & 4 BHK sky villas in Dwarka Expressway by Keystone.")
                    .build();

            ProjectImage img1 = ProjectImage.builder()
                    .project(p1)
                    .imageUrl("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80")
                    .isPrimary(true)
                    .sortOrder(0)
                    .build();

            ProjectAmenity am1 = ProjectAmenity.builder().project(p1).name("Swimming Pool").build();
            ProjectAmenity am2 = ProjectAmenity.builder().project(p1).name("Gym & Fitness").build();
            ProjectAmenity am3 = ProjectAmenity.builder().project(p1).name("24/7 Security").build();

            p1.setImages(List.of(img1));
            p1.setAmenities(List.of(am1, am2, am3));

            projectRepository.save(p1);

            Project p2 = Project.builder()
                    .name("Keystone Commercial Square")
                    .slug("keystone-commercial-square")
                    .type("Commercial")
                    .status("Upcoming")
                    .shortDescription("Next-generation Grade-A office spaces and premium retail high-street boulevards.")
                    .description("A landmark commercial hub designed for Fortune 500 corporations and flagship luxury retail brands. Features LEED Gold green building certification, double-height grand lobbies, and multi-tier subterranean parking.")
                    .developer("Keystone Commercial Projects")
                    .address("Cyber City Phase 2")
                    .area("Dwarka Sector 21")
                    .city("Delhi")
                    .state("Delhi NCR")
                    .pincode("110075")
                    .totalArea("3.8 Acres")
                    .buildings(2)
                    .floors(24)
                    .units(120)
                    .completionDate("Q2 2028")
                    .featured(true)
                    .published(true)
                    .seoTitle("Keystone Commercial Square | Grade A Commercial Space Delhi")
                    .metaDescription("Grade A office spaces and high-street retail shops at Sector 21 Dwarka.")
                    .build();

            ProjectImage img2 = ProjectImage.builder()
                    .project(p2)
                    .imageUrl("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80")
                    .isPrimary(true)
                    .sortOrder(0)
                    .build();

            p2.setImages(List.of(img2));
            projectRepository.save(p2);

            System.out.println("✅ Default Projects seeded.");
        }
    }

    public void seedTestimonials() {
        if (testimonialRepository.count() == 0) {
            Testimonial t1 = Testimonial.builder()
                    .name("Vikram Malhotra")
                    .designation("Senior Tech Executive")
                    .review("Keystone's attention to detail, transparent communication, and timely delivery exceeded all expectations. Purchasing our home here was the best financial decision we made.")
                    .image("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80")
                    .published(true)
                    .build();

            Testimonial t2 = Testimonial.builder()
                    .name("Sunita Sharma")
                    .designation("Commercial Investor")
                    .review("The rental yield on Keystone Commercial Square has been outstanding. Their property management and admin support are truly world-class.")
                    .image("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80")
                    .published(true)
                    .build();

            testimonialRepository.saveAll(Arrays.asList(t1, t2));
            System.out.println("✅ Default Testimonials seeded.");
        }
    }
}
