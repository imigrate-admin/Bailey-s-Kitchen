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

- **Frontend Application**: Next.js-based web client (Port 3000)
- **API Gateway**: Central API server for routing and aggregation (Port 5001)
- **Backend Services**:
  - User Service (Port 5002): Authentication, profiles, and user management
  - Product Service (Port 5003): Catalog and inventory management
  - Blog Service (Port 5004): Content management and blog functionality
  - Order Service: Order processing and tracking (Planned)
  - Payment Service: Payment processing (Planned)
  - Notification Service: Email and notifications (Planned)
  - Analytics Service: Reporting and metrics (Planned)
- **Databases**: PostgreSQL with separate schemas per service
- **Caching**: Redis (Planned)
- **Message Queue**: RabbitMQ/Kafka (Planned)

### Architecture Diagram

```
┌────────────────┐      
│  Web Client    │      
│  (Next.js:3000)│      
└────────┬───────┘      
         │              
         ▼              
┌────────────────┐      
│  API Gateway   │      
│  (Port: 5001)  │      
└────────┬───────┘      
         │              
    ┌────┴─────┐        
    ▼          ▼        
┌─────────┐  ┌─────────┐
│  User   │  │Product  │
│Service  │  │Service  │
│(P:5002) │  │(P:5003) │
└────┬────┘  └────┬────┘
     │            │     
┌────┴────┐  ┌────┴────┐
│User DB  │  │Product  │
│Schema   │  │DB Schema│
└─────────┘  └─────────┘

┌─────────┐  ┌─────────┐
│  Blog   │  │Future   │
│Service  │  │Services │
│(P:5004) │  │(Planned)│
└────┬────┘  └─────────┘
     │                  
┌────┴────┐            
│Blog DB  │            
│Schema   │            
└─────────┘            
```

## 📁 Current Directory Structure

```
bailey-s-kitchen/
├── apps/                      # Application services
│   ├── web-client/           # Next.js frontend application
│   ├── api-server/           # API Gateway service
│   ├── user-service/         # User management service
│   ├── product-service/      # Product management service
│   ├── blog-service/         # Blog and content service
│   ├── order-service/        # Order processing (Planned)
│   ├── payment-service/      # Payment processing (Planned)
│   ├── notification-service/ # Notification handling (Planned)
│   └── analytics-service/    # Analytics and reporting (Planned)
│
├── packages/                  # Shared libraries and utilities
│   └── common/               # Common utilities and helpers
│
├── docker-compose.yml        # Local development environment
├── package.json              # Root package.json (Turborepo)
└── README.md                 # Project documentation
```

## 🔧 Local Development Setup

### Prerequisites

- Node.js (v18 or later)
- npm (v9.5.0 or later)
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bailey-s-kitchen.git
   cd bailey-s-kitchen
   ```

2. Create required Docker volumes:
   ```bash
   docker volume create baileys_postgres_data
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development environment:
   ```bash
   # Start all services with Docker Compose
   docker-compose up -d
   ```

### Service Ports

- Web Client: http://localhost:3000
- API Gateway: http://localhost:5001
- User Service: http://localhost:5002
- Product Service: http://localhost:5003
- Blog Service: http://localhost:5004
- PostgreSQL: localhost:5432

## 🛠️ Current Technology Stack

### Frontend (Web Client)
- **Framework**: Next.js
- **State Management**: React Context API
- **UI Components**: Custom components with TipTap editor integration
- **Development Port**: 3000

### Backend Services
- **API Gateway**
  - Framework: NestJS
  - Port: 5001
  - Features: Request routing, API aggregation

- **User Service**
  - Framework: NestJS
  - Port: 5002
  - Features: Authentication, JWT, email integration

- **Product Service**
  - Framework: NestJS
  - Port: 5003
  - Features: Product management, categories

- **Blog Service**
  - Framework: NestJS
  - Port: 5004
  - Features: Content management, rich text editing

### Infrastructure
- **Database**: PostgreSQL 15 (Alpine)
  - Separate schemas per service
  - Automated health checks
  - Backup volume support

- **Container Orchestration**: Docker Compose
  - Health checks for all services
  - Volume management
  - Network isolation

- **Development Tools**
  - Turbo for monorepo management
  - ESLint and Prettier for code formatting
  - Husky for git hooks
  - Commitlint for commit message formatting

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

