import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Container className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="h-14 w-14 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">BK</span>
              </div>
              <span className="text-3xl font-bold text-primary-500">Bailey's Kitchen</span>
            </Link>
            <p className="mt-2 text-gray-600">Premium pet food, delivered fresh</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Bailey's Kitchen. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

