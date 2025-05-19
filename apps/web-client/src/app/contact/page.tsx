import React from 'react';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | Bailey\'s Kitchen',
  description: 'Get in touch with Bailey\'s Kitchen. We\'d love to hear from you!',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our pet food delivery service? We're here to help!
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Other ways to reach us
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">support@baileyskitchen.com</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      123 Pet Food Lane<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      Saturday: 10:00 AM - 4:00 PM PST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 