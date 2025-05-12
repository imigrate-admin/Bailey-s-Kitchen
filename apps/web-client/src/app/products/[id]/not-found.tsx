import Link from 'next/link';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Product Not Found',
  description: 'The requested product could not be found',
};

export default function ProductNotFound() {
  return (
    <Container>
      <div className="mb-4">
        <Link
          href="/products"
          className="text-primary hover:text-primary/80 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </Link>
      </div>
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Product Not Found
        </h2>
        <p className="text-red-600 mb-6">
          The requested product could not be found. Please try again later.
        </p>
        <Link
          href="/products"
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors inline-block"
        >
          Browse Other Products
        </Link>
      </div>
    </Container>
  );
}

