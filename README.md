# Bailey's Kitchen

A microservices-based e-commerce platform for pet food delivery, enabling pet parents to order healthy food for their pets.

## 🚀 Project Overview

Bailey's Kitchen is a full-featured e-commerce platform designed specifically for pet food delivery. The platform allows pet parents to browse, order, and manage deliveries of healthy food options for their pets. The system is built using a microservices architecture to ensure scalability, maintainability, and resilience.

### Key Features

- **User Management**: Registration, authentication, profiles, and preferences
- **Product Management**: Catalog, search, filtering, and inventory management
- **Order Management**: Cart functionality, checkout process, and order tracking
- **Payment Processing**: Integration with payment gateways and transaction management
- **Notifications**: Email, SMS, and real-time notifications
- **Analytics and Reporting**: Sales reports, user metrics, and business intelligence

## 🏗️ System Architecture

Bailey's Kitchen follows a microservices architecture pattern with the following components:

- **Frontend Application**: Next.js-based web client
- **Backend Services**:
  - User Service
  - Product Service
  - Order Service
  - Payment Service
  - Notification Service
  - Analytics Service
- **API Gateway**: Entry point for client applications
- **Databases**: Each service has its own PostgreSQL database
- **Message Broker**: For asynchronous communication between services
- **Caching Layer**: Redis for performance optimization

### Architecture Diagram

```
┌────────────────┐      ┌────────────────┐
│  Web Client    │      │  Mobile Apps   │
│  (Next.js)     │      │  (Future)      │
└────────┬───────┘      └────────┬───────┘
         │                       │        
         └───────────┬───────────┘        
                     ▼                    
         ┌────────────────────────┐       
         │      API Gateway       │       
         └────────────┬───────────┘       
                     │                    
         ┌───────────┴───────────┐        
         ▼           ▼           ▼        
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  User       │ │  Product    │ │  Order      │
│  Service    │ │  Service    │ │  Service    │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │       
       ▼               ▼               ▼       
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  User DB    │ │  Product DB │ │  Order DB   │
└─────────────┘ └─────────────┘ └─────────────┘
                                              
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Payment    │ │Notification │ │  Analytics  │
│  Service    │ │  Service    │ │  Service    │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │       
       ▼               ▼               ▼       
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Payment DB  │ │Notification │ │Analytics DB │
└─────────────┘ │     DB      │ └─────────────┘
                └─────────────┘                
```

## 📁 Directory Structure

```
bailey-s-kitchen/
├── apps/                      # Application services
│   ├── web-client/            # Next.js frontend application
│   ├── user-service/          # User management service
│   ├── product-service/       # Product management service
│   ├── order-service/         # Order processing service
│   ├── payment-service/       # Payment processing service
│   ├── notification-service/  # Notification handling service
│   └── analytics-service/     # Analytics and reporting service
│
├── packages/                  # Shared libraries and utilities
│   ├── common/                # Common utilities and helpers
│   ├── api-client/            # API client libraries
│   ├── ui-components/         # Shared UI components (if applicable)
│   └── database/              # Database schemas and migrations
│
├── infrastructure/            # Infrastructure as code
│   ├── docker/                # Docker configurations
│   │   └── docker-compose.yml # Local development setup
│   └── kubernetes/            # Kubernetes manifests
│       ├── base/              # Base configurations
│       ├── development/       # Development environment config
│       └── production/        # Production environment config
│
├── docs/                      # Documentation
│   ├── architecture/          # Architecture documents
│   ├── api/                   # API documentation
│   └── development/           # Development guides
│
├── scripts/                   # Utility scripts
├── .gitignore                 # Git ignore file
├── package.json               # Root package.json for workspace management
└── README.md                  # This file
```

## 🔧 Local Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Docker and Docker Compose
- PostgreSQL (optional if using containerized version)
- Redis (optional if using containerized version)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bailey-s-kitchen.git
   cd bailey-s-kitchen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   # Start all services with Docker Compose
   docker-compose up -d

   # Or start specific services
   docker-compose up -d postgres redis
   ```

4. Set up environment variables:
   ```bash
   # Copy example environment files for each service
   cd apps/web-client && cp .env.example .env.local
   # Repeat for other services
   ```

5. Start the development servers:
   ```bash
   # Start all services in development mode
   npm run dev

   # Or start specific services
   npm run dev:web
   npm run dev:user-service
   # etc.
   ```

## 📋 Available Scripts

- `npm run dev`: Start all services in development mode
- `npm run build`: Build all services
- `npm run test`: Run tests for all services
- `npm run lint`: Run linting for all services
- `npm run format`: Format code using Prettier
- `npm run docker:up`: Start Docker Compose environment
- `npm run docker:down`: Stop Docker Compose environment

Service-specific scripts can be run using the workspace syntax:
```bash
npm run dev -w apps/web-client
npm run test -w apps/user-service
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **State Management**: React Context API / Redux (as needed)
- **Styling**: Tailwind CSS / Styled Components
- **Testing**: Jest, React Testing Library, Cypress

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **API**: REST with OpenAPI documentation
- **Database**: PostgreSQL
- **ORM**: TypeORM / Prisma
- **Caching**: Redis
- **Message Broker**: Redis / RabbitMQ / Kafka
- **Testing**: Jest, Supertest

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions (or other CI tool)
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack (or similar)
- **Service Mesh**: Istio (planned)

## 🤝 Contribution Guidelines

### Code Style and Standards
- Follow the TypeScript style guide
- Use ESLint and Prettier for code formatting
- Write unit tests for all new features
- Follow the conventional commit message format

### Pull Request Process
1. Create a feature branch from `develop` branch
2. Implement your changes with tests
3. Ensure all tests pass and linting issues are fixed
4. Submit a PR to the `develop` branch
5. Request a review from at least one team member
6. Address review comments
7. PR will be merged once approved

## 🌐 Service Descriptions

### Web Client
The frontend application built with Next.js that provides the user interface for customers and administrators.

### User Service
Handles user registration, authentication, profile management, and authorization across the platform.

### Product Service
Manages the product catalog, categories, inventory, and search functionality.

### Order Service
Processes orders, manages the shopping cart, and handles the checkout flow.

### Payment Service
Integrates with payment gateways to process payments and manage transactions.

### Notification Service
Manages all notifications including email, SMS, and real-time notifications.

### Analytics Service
Collects and processes data from other services to generate reports and insights.

## 📚 Service-Specific Documentation

- [Web Client Documentation](./apps/web-client/README.md)
- [User Service Documentation](./apps/user-service/README.md)
- [Product Service Documentation](./apps/product-service/README.md)
- [Order Service Documentation](./apps/order-service/README.md)
- [Payment Service Documentation](./apps/payment-service/README.md)
- [Notification Service Documentation](./apps/notification-service/README.md)
- [Analytics Service Documentation](./apps/analytics-service/README.md)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

