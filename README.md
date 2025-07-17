# 🏛️ Bid Avenue - Online Auction Platform

A modern, full-stack online auction platform built with the MERN stack, featuring real-time bidding, admin management, and a sleek glass morphism UI design.

## 📸 Screenshots

<!-- Add your screenshots here -->
*Screenshots will be added here*

## 🎥 Demo Video

<!-- Add your demo video here -->
*Demo video will be added here*

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with secure authentication
- **Persistent Sessions** with automatic logout on browser close
- **Admin Access Control** with passcode protection and 2-hour session expiry
- **Integrated Logout System** that clears both user and admin sessions

### 🏷️ Item Management
- **Create Auction Items** with image URLs, descriptions, and end times
- **View All Items** with real-time countdown timers
- **Delete Items** (Admin only) with custom confirmation modals
- **Image Support** with fallback placeholders for broken images

### 💰 Bidding System
- **Real-time Bidding** with live auction status monitoring
- **Bid Validation** ensuring bids are higher than current amounts
- **Auction End Detection** preventing bids on expired auctions
- **Winner Display** showing successful bidders on completed auctions

### 🎨 Modern UI/UX
- **Glass Morphism Design** with transparent cards and blur effects
- **Responsive Layout** optimized for desktop and mobile devices
- **Toast Notifications** for all user actions and feedback
- **Live Timers** showing remaining auction time with automatic updates
- **Professional Navigation** with dynamic login/logout states

### ⚡ Real-time Features
- **Live Countdown Timers** on all auction items
- **Automatic Session Monitoring** with smart logout detection
- **Cross-component State Sync** for seamless user experience
- **Auction Status Updates** without manual page refreshes

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **React Router DOM 6.24.1** - Client-side routing
- **Axios 1.7.2** - HTTP client for API calls
- **React Toastify** - Beautiful toast notifications
- **CSS3** - Custom styling with glass morphism effects

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

### Development Tools
- **VS Code** - Primary development environment
- **Git** - Version control system
- **npm** - Package management

## 📁 Project Structure

```
Bid Avenue/
├── frontend/                 # React frontend application
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── bids/        # Bidding components
│   │   │   │   └── BidForm.js
│   │   │   ├── items/       # Item management components
│   │   │   │   ├── ItemList.js
│   │   │   │   ├── ItemForm.js
│   │   │   │   └── ItemDelete.js
│   │   │   └── layout/      # Layout components
│   │   │       ├── Navbar.js
│   │   │       └── HomePage.js
│   │   ├── styles/          # CSS stylesheets
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   └── package.json         # Frontend dependencies
├── backend/                 # Express.js backend API
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── models/             # Mongoose data models
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/             # API route definitions
│   │   ├── auth.js
│   │   └── items.js
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/Bid-Avenue.git
cd Bid-Avenue
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
touch .env

# Add the following to .env file:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment variables file
touch .env

# Add the following to .env file:
# REACT_APP_BACKEND_URL=http://localhost:5000

# Start the frontend development server
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎮 Usage Guide

### For Regular Users

1. **Registration**: Create a new account with username, email, and password
2. **Login**: Sign in to access auction features
3. **Browse Items**: View all available auction items with live timers
4. **Place Bids**: Click "Place Bid" and enter amount higher than current bid
5. **Monitor Auctions**: Watch real-time countdown timers and bid updates
6. **Logout**: Click logout to securely end your session

### For Administrators

1. **Admin Access**: Navigate to "Delete Item" and enter admin passcode
2. **Item Management**: Create new auction items with details and images
3. **Item Deletion**: Select and delete items with confirmation modal
4. **Session Management**: 2-hour admin sessions with automatic expiry
5. **Monitoring**: View all items and their current bidding status

### Default Admin Credentials
- **Admin Passcode**: `adminaccess123`

## 🔧 API Endpoints

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/createuser` - Create new user

### Item Management Routes
- `GET /items/itemget` - Fetch all items
- `GET /items/:id` - Fetch single item details
- `POST /items/createItem` - Create new auction item
- `PUT /items/:id/bid` - Place bid on item
- `DELETE /items/:id` - Delete item (Admin only)

## 🎨 Design Features

### Glass Morphism UI
- **Transparent Cards** with backdrop blur effects
- **Gradient Backgrounds** for visual depth
- **Smooth Animations** and hover effects
- **Consistent Color Scheme** throughout the application

### Responsive Design
- **Mobile-First** approach for all components
- **Flexible Layouts** that adapt to screen sizes
- **Touch-Friendly** buttons and interactions
- **Optimized Performance** on all devices

## 🔒 Security Features

- **JWT Authentication** for secure user sessions
- **Admin Authorization** with passcode protection
- **Session Expiry** automatic logout after inactivity
- **Input Validation** on both frontend and backend
- **CORS Protection** for cross-origin requests

## 🐛 Known Issues & Limitations

- Image URLs must be publicly accessible (no file upload yet)
- Admin passcode is hardcoded (should be environment variable)
- No email verification for user registration
- Limited to single auction format (no reserve prices)

## 🔮 Future Enhancements

- [ ] **File Upload System** for auction item images
- [ ] **Email Notifications** for auction updates
- [ ] **Payment Integration** for completed auctions
- [ ] **Auction Categories** and filtering options
- [ ] **User Profiles** with bidding history
- [ ] **Real-time Chat** for auction discussions
- [ ] **Mobile App** development
- [ ] **Advanced Admin Dashboard** with analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@YourUsername](https://github.com/YourUsername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- **MongoDB** for the robust database solution
- **React Team** for the amazing frontend library
- **Express.js** for the lightweight backend framework
- **Glass Morphism Design** inspiration from modern UI trends
- **Open Source Community** for the incredible tools and libraries

---

⭐ If you found this project helpful, please give it a star on GitHub!
