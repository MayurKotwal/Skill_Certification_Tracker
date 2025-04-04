# Skill Certification Tracker

A web application that helps users track their certifications and automatically extracts skills using AI analysis. The system validates certificates, extracts relevant skills, and maintains a comprehensive skill profile for each user.

## Features

- Certificate Upload and Management
- AI-Powered Certificate Analysis
- Automatic Skill Extraction
- Certificate Authenticity Validation
- User Skill Profile Management
- Interactive Skill Review Interface

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI Integration**: Google's Gemini AI
- **File Processing**: Multer, Sharp, PDF-Parse

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account (for Gemini AI API)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skill-certification-tracker.git
cd skill-certification-tracker
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory with the following:
```
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the application:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## API Endpoints

### Certifications
- `GET /api/certifications` - Get all certifications
- `GET /api/certifications/:id` - Get single certification
- `POST /api/certifications` - Add new certification
- `POST /api/certifications/analyze` - Analyze certificate
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for powering the certificate analysis
- Material-UI for the frontend components
- All contributors who have helped shape this project 