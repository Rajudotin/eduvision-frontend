# EduVision - Frontend

AI-Powered Face Recognition Attendance System

[![React-18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg)](https://tailwindcss.com/)
[![Deployed](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://vercel.com/)

---

## 📖 Table of Contents

- ✨ Features
- 🛠 Tech Stack
- 📄 Pages
- 🚀 Quick Start
- 📂 Project Structure
- 🔐 Environment Variables
- 🚢 Deployment

---

## ✨ Features

### 🎓 Student Dashboard

- Real-time attendance gauge
- Color-coded calendar (Green = Present, Red = Absent)
- WhatsApp reason submission (for absence)
- PDF/Excel report downloads
- Upcoming classes view

### 👨‍🏫 Teacher Dashboard

- Live camera attendance
- Photo upload attendance
- Manual face verification
- Student registry with status
- One-click WhatsApp alerts

### 🔧 Admin Dashboard

- User management (CRUD)
- System analytics & charts
- Academic calendar settings
- Face database monitoring
- Department-wise reports

### 🔐 Authentication

- Multi-step registration wizard
- Face photo upload (3 angles)
- JWT-based login
- Role-based access control

### 📱 Responsive Design

- Mobile-first approach
- PWA-ready
- Dark mode support
- Touch-friendly UI

---

## 🛠 Tech Stack

| Category      | Technology       |
| ------------- | ---------------- |
| Framework     | React 18         |
| Build Tool    | Vite             |
| Styling       | Tailwind CSS     |
| Icons         | Lucide React     |
| Charts        | Recharts         |
| Routing       | React Router DOM |
| HTTP Client   | Axios            |
| Animations    | Framer Motion    |
| Notifications | React Hot Toast  |
| Deployment    | Vercel           |

---

## 📄 Pages

| Page               | Route                 | Description                              |
| ------------------ | --------------------- | ---------------------------------------- |
| Landing            | `/`                   | Marketing page with features & pricing   |
| Login              | `/login`              | User authentication                      |
| Register           | `/register`           | Multi-step registration with face upload |
| Student Dashboard  | `/student/dashboard`  | Attendance overview & stats              |
| Student Attendance | `/student/attendance` | Calendar view with color coding          |
| Student Reports    | `/student/reports`    | PDF/Excel downloads                      |
| Student Profile    | `/student/profile`    | User settings & preferences              |
| Teacher Dashboard  | `/teacher/dashboard`  | Take attendance & manage students        |
| Teacher Reports    | `/teacher/reports`    | Class-wise analytics                     |
| Admin Dashboard    | `/admin/dashboard`    | System management & analytics            |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Rajudotin/eduvision-frontend.git
cd eduvision-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📂 Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── TeacherLayout.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── AttendancePage.jsx
│   │   ├── ClassesPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend/` folder (or set variables in Vercel).

```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_NAME=EduVision AI
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your changes to GitHub
2. Import the repo in Vercel
3. Add environment variables:
   - `VITE_API_URL`
4. Deploy

### Manual Build

```bash
npm run build
# Output: dist/ folder
# Deploy to any static hosting (Netlify, AWS S3, etc.)
```

---

## 🎨 Design System

| Token         | Value                     |
| ------------- | ------------------------- |
| Primary       | #004ac6                   |
| Secondary     | #712ae2                   |
| Tertiary      | #006242                   |
| Error         | #ba1a1a                   |
| Background    | #f9f9ff                   |
| Font Family   | Inter, Space Grotesk      |
| Border Radius | 0.5rem (lg), 0.75rem (xl) |

---

## 📄 License

MIT License

---

## 📞 Contact

- **Balavenkata Raju**
- **Email:** balavenkatarajusingampalli@gmail.com
- **GitHub:** (add your link)

<p align="center">Made with ❤️ by Raju | Acharya Nagarjuna University</p>
