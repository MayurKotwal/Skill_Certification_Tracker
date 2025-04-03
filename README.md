# Skill & Certification Tracker

A web application for tracking and showcasing skills and certifications, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication and authorization
- Add and manage certifications
- Track skills and proficiency levels
- Profile comparison and analysis
- Public profile sharing
- Search for other profiles
- Generate skill gap analysis and recommendations

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/skill-certification-tracker.git
cd skill-certification-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create environment variables
   
Backend (.env file in backend directory):
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/skill-tracker
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

5. Start the servers

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
skill-certification-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       └── App.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Team Members

- [Your Name]
- [Team Member 1]
- [Team Member 2]

## License

This project is licensed under the MIT License - see the LICENSE file for details 