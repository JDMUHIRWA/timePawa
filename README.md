# timePawa

## Description
timePawa is a scheduling and time management web application that enables users to request swaps and schedule breaks for activities like coaching, training, meetings, or other special breaks. The system ensures efficient handling of schedule modifications while maintaining transparency and ease of use.

## Features
- User authentication with multifactor authentication (MFA)
- Request and approve swap requests
- Schedule and manage breaks
- Role-based access control
- Real-time updates and notifications
- Secure data storage using MongoDB

## Tech Stack
- **Frontend:** React.js, tailwind css & SCSS (Hosted on Vercel)
- **Backend:** Node.js, Express.js (Hosted on Render)
- **Database:** MongoDB (MongoDB Atlas)
- **Authentication:** Multifactor authentication (MFA)

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or a local MongoDB instance)

### Clone the Repository
```sh
git clone https://github.com/your-username/timepawa.git
cd timepawa
```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure the following environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and configure the following environment variables:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com
   NEXT_PUBLIC_MFA_ENABLED=true
   ```
4. Start the frontend application:
   ```sh
   npm run dev
   ```
5. Open the application in your browser at `http://localhost:3000`

## Deployment
### Frontend (Vercel)
1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy the frontend:
   ```sh
   vercel
   ```

### Backend (Render)
1. Push your backend code to a GitHub repository.
2. Create a new web service on Render and connect it to the repository.
3. Set the environment variables in Render’s settings.
4. Deploy the backend service.


## Troubleshooting
- Check the console for the displayed error.    
- If MongoDB is not connecting, verify the `MONGO_URI`.
- If MFA is not working, check your authentication settings and confirm your frontend and backend configurations align.

## Author
**Jean de Dieu Muhirwa Harerimana**
