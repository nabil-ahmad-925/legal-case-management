# Legal Case Management System

A comprehensive application for law firms to efficiently manage cases, clients, and legal staff.

## Technologies Used

- **Backend**: Node.js with Express 5.x
- **Database**: PostgreSQL with Prisma 6.x ORM
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: Joi for request validation
- **Logging**: Pino logger with pretty-print formatting
- **Security**: Helmet middleware for HTTP security headers
- **Development**: TypeScript with ts-node-dev for hot reloading

## Features

- User authentication with JWT
- Role-based access control (Admin, Lawyer, Paralegal, Assistant)
- Case management with standard and custom fields
- Team assignment system
- RESTful API with validation

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nabil-ahmad-925/legal-case-management.git
cd legal-case-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/legal_case_management"

# JWT secret
JWT_SECRET="your-secure-jwt-secret"

# Server configuration
PORT=3000
NODE_ENV=development
```

### 4. Set Up the Database

Make sure your PostgreSQL server is running, then create a database:

```bash
# Access PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE legal_case_management;
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate -- --name initial_setup
```

This will:

- Apply the database schema defined in `prisma/schema.prisma`
- Generate the Prisma client

Alternatively, you can also run:

```bash
npm run prisma:generate
```

to only generate the Prisma client without running migrations.

### 6. Start the Development Server

```bash
npm run dev
```

The server will start at http://localhost:3000 (or the port specified in your .env file).

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user

  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "LAWYER"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

### Case Management

- `GET /api/cases` - Get all cases (with filtering and pagination)
- `GET /api/cases/:id` - Get a specific case
- `POST /api/cases` - Create a new case
- `PUT /api/cases/:id` - Update a case
- `DELETE /api/cases/:id` - Delete a case

## Project Structure

```
legal-case-management/
├── prisma/                   # Database schema and migrations
│   └── schema.prisma         # Prisma schema definition
├── src/
│   ├── controllers/          # API controllers
│   │   ├── auth.controller.ts
│   │   └── case.controller.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   └── case.routes.ts
│   ├── validations/          # Validation schemas
│   │   ├── auth.validation.ts
│   │   └── case.validation.ts
│   ├── utils/                # Utility functions
│   │   ├── errors.ts
│   │   └── logger.ts
│   ├── app.ts                # Express application setup
│   └── index.ts              # Main entry point
├── .env                      # Environment variables
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

## Scripts

- `npm run dev` - Start the development server with hot reloading using ts-node-dev
- `npm run build` - Build the TypeScript code using tsc
- `npm start` - Start the production server from the compiled code
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrations

## Custom Case Fields

The system supports both standard fields and custom fields via JSON:

- **Standard fields**: Defined in the schema (client info, dates, etc.)
- **Custom fields**: Stored as JSON in the `customFields` column

Example custom fields:

```json
{
  "caseSpecificField1": "value1",
  "caseSpecificField2": "value2"
}
```

## License

[MIT](LICENSE)
