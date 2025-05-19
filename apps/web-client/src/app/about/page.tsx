import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about Bailey's Kitchen's mission to provide premium, healthy pet food and our commitment to pet nutrition.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <Image
          src="/images/about-hero.jpg"
          alt="Bailey's Kitchen Team"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center font-montserrat">
            Our Story
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              At Bailey's Kitchen, we believe every pet deserves the highest quality nutrition. Our journey began with a simple observation: pets are family, and they deserve food that's as good as what we eat.
            </p>
            <p className="text-lg text-gray-600">
              We work directly with veterinary nutritionists and food scientists to create balanced, wholesome meals that support your pet's health and happiness at every stage of life.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/mission.jpg"
              alt="Pet food preparation"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Quality First</h3>
              <p className="text-gray-600">
                We source only the finest ingredients and maintain strict quality control throughout our preparation process.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Sustainability</h3>
              <p className="text-gray-600">
                Our packaging is eco-friendly, and we work with local suppliers to reduce our carbon footprint.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Innovation</h3>
              <p className="text-gray-600">
                We continuously research and develop new recipes to meet evolving pet nutrition standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/team/founder.jpg"
                alt="Coco & Choco - Founder"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Coco & Choco</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/team/nutritionist.jpg"
                alt="Dr. Asif - Head Nutritionist"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dr. Asif Pasha</h3>
            <p className="text-gray-600">Head Nutritionist, Anicure Pet Hospital</p>
          </div>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/team/chef.jpg"
                alt="Priyanka - Head Chef"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Priyanka</h3>
            <p className="text-gray-600">Head Chef</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about our products or want to learn more about our mission? We'd love to hear from you!
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
} 