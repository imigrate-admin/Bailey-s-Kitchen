import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// Import UI components
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Bailey's Kitchen | Premium Pet Food Delivery",
  description: "Healthy, fresh food for your pets, delivered to your door. Customized nutrition plans for dogs and cats.",
};

// Types for our data
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  category: 'dog' | 'cat';
  badge?: 'new' | 'popular' | 'best-seller';
};

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Testimonial = {
  id: number;
  content: string;
  author: string;
  role: string;
};

type Benefit = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

// Sample data
const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Fresh Chicken Feast',
    description: 'Premium chicken with vegetables and brown rice.',
    price: 29.99,
    imageSrc: '/placeholder-product.jpg',
    imageAlt: 'Fresh chicken meal for dogs',
    category: 'dog',
    badge: 'best-seller',
  },
  {
    id: 2,
    name: 'Ocean Delight',
    description: 'Wild-caught salmon with sweet potatoes and herbs.',
    price: 34.99,
    imageSrc: '/placeholder-product.jpg',
    imageAlt: 'Salmon meal for cats',
    category: 'cat',
    badge: 'new',
  },
  {
    id: 3,
    name: 'Tender Turkey',
    description: 'Lean turkey with quinoa and garden vegetables.',
    price: 31.99,
    imageSrc: '/placeholder-product.jpg',
    imageAlt: 'Turkey meal for dogs',
    category: 'dog',
  },
  {
    id: 4,
    name: 'Savory Beef',
    description: 'Grass-fed beef with ancient grains and vegetables.',
    price: 32.99,
    imageSrc: '/placeholder-product.jpg',
    imageAlt: 'Beef meal for dogs',
    category: 'dog',
    badge: 'popular',
  },
];

const howItWorks: Step[] = [
  {
    id: 1,
    title: 'Create a Pet Profile',
    description: "Tell us about your furry friend's breed, age, weight, activity level, and any dietary needs.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Select Your Meals',
    description: 'Browse our nutritionist-developed meals and pick the ones your pet will love.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Customize Delivery',
    description: 'Choose delivery frequency that works for you - weekly, bi-weekly, or monthly.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Serve & Enjoy',
    description: 'Watch your pet thrive on their personalized nutrition plan.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "My dog Max has never been healthier since switching to Bailey's Kitchen. The personalized meals have improved his energy and his coat is shinier than ever!",
    author: "Coco & Choco",
    role: "Pet parent to Max, Golden Retriever",
  },
  {
    id: 2,
    content: "After years of trying different foods for my cat's sensitive stomach, Bailey's Kitchen has been a game-changer. Luna actually looks forward to mealtime now!",
    author: "Michael Chen",
    role: "Pet parent to Luna, Siamese Cat",
  },
  {
    id: 3,
    content: "The convenience of home delivery combined with the quality of the food makes Bailey's Kitchen worth every penny. My dogs are thriving!",
    author: "Emily Rodriguez",
    role: "Pet parent to Bella & Charlie",
  },
];

const benefits: Benefit[] = [
  {
    id: 1,
    title: "Human-Grade Ingredients",
    description: "All meals are made with ingredients you'd eat yourself, sourced from trusted suppliers.",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Vet-Approved Recipes",
    description: "Formulated by veterinary nutritionists to ensure balanced nutrition for your pet.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Personalized Portions",
    description: "Perfect portions based on your pet's size, age, breed, and activity level.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Freshly Prepared",
    description: "Cooked in small batches and delivered fresh, never frozen, to preserve nutrients.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <Container className="py-20 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Real Food for <span className="text-primary-500">Real Pets</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-2xl">
                  Premium, freshly-prepared pet food, delivered to your door. Customized for your pet's nutritional needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" href="/quiz">
                  Start Your Pet's Plan
                </Button>
                <Button variant="outline" size="lg" href="/products">
                  Explore Our Meals
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No artificial ingredients</span>
                </div>
              </div>
            </div>
            <div className="relative lg:h-[500px] rounded-lg overflow-hidden">
              {/* In a real app, replace with an actual image */}
              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                <div className="text-center p-8 bg-white/30 backdrop-blur-sm rounded-lg">
                  <p className="text-lg font-semibold">Pet Food Image Placeholder</p>
                  <p className="text-sm text-gray-600">Premium pet meals shown here</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nutrition Your Pet Deserves
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing pet food with freshly prepared, human-grade meals tailored to your pet's needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Meals
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Discover our most popular pet-approved recipes
              </p>
            </div>
            <Button 
              variant="outline" 
              href="/products" 
              className="mt-4 md:mt-0"
            >
              View All Products
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-48 bg-gray-200">
                  {/* Product image would go here */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  {product.badge && (
                    <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white
                      ${product.badge === 'new' ? 'bg-secondary-500' : 
                        product.badge === 'popular' ? 'bg-tertiary-500' : 'bg-primary-500'}`}>
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-2">
                        For {product.category === 'dog' ? 'Dogs' : 'Cats'}
                      </p>
                    </div>
                    <span className="font-bold text-primary-500">${product.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    href={`/products/${product.id}`} 
                    fullWidth
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How Bailey's Kitchen Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is easy. We'll deliver healthy, portioned meals right to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  {/* Step connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200"></div>
                  )}
                  <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Pet Parents Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it — hear from our happy customers and their pets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="mb-4">
                  {/* Star rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-50">
        <Container>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Pet's Meals?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Get started today with a customized meal plan that's perfect for your furry friend's needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    href="/quiz"
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    href="/contact"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center p-8">
                <div className="text-center p-6 bg-white/30 backdrop-blur-sm rounded-lg">
                  <p className="text-lg font-semibold">Happy Pets Image</p>
                  <p className="text-sm text-gray-600">Thriving on Bailey's Kitchen</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


