# IT Ticketing System

A modern, full-stack IT ticketing system with email (Gmail) and WhatsApp integration.

## Features

- ✅ Create, view, update, and manage IT tickets
- ✅ Priority and status tracking
- ✅ Comments and notes on tickets
- ✅ Search and filtering
- ✅ Gmail integration for automatic ticket creation
- ✅ WhatsApp integration ready
- ✅ RESTful API
- ✅ PostgreSQL database

## Tech Stack

**Frontend:**
- React 18
- Lucide React (icons)
- Tailwind CSS

**Backend:**
- Node.js
- Express
- PostgreSQL
- Gmail API
- Twilio (WhatsApp)

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/it-ticketing-system.git
cd it-ticketing-system
```

2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

4. Database Setup
```bash
# Make sure PostgreSQL is running
psql -U postgres -f database/schema.sql
```

## API Endpoints

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License