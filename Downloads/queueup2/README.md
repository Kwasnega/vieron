# QUEUEUP

QUEUEUP is a modern, Firebase-powered queue and issue management system for university students and administrators. It provides real-time complaint and result issue tracking, user management, and a clean, responsive admin dashboard with dark mode support.

## Features
- Student and admin dashboards with real-time sync
- Submit and manage complaints and result issues
- Admin can update statuses, resolve, or delete issues
- Activity log for recent actions
- User management for admins
- Modern UI/UX with dark mode toggle
- Mobile responsive and accessible
- Firebase Realtime Database and Auth integration

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Kwasnega/QUEUEUP.git
   cd QUEUEUP
   ```
2. **Open in VS Code or your preferred editor.**
3. **Firebase Setup:**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Create a Realtime Database and set rules as needed
   - Replace the Firebase config in `admin_dashboard.html` and other HTML files with your own project credentials if deploying elsewhere
4. **Run locally:**
   - Open `admin_dashboard.html` or `dashboard.html` in your browser
   - For full functionality, deploy to a static hosting service (Firebase Hosting, Netlify, Vercel, etc.)

## Screenshots
![Admin Dashboard Screenshot](gctu.png)

## File Structure
- `admin_dashboard.html` - Main admin dashboard
- `dashboard.html` - Student dashboard
- `login.html`, `signup.html`, `password_reset.html`, `change-password.html` - Auth pages
- `admin.html` - Admin login
- `gctu.ico`, `gctu.png` - Branding assets

## Accessibility & UX
- Keyboard navigation and ARIA labels for all interactive elements
- Responsive design for mobile and desktop
- Loading spinners and error messages for better feedback

## License
MIT

---

For questions or contributions, open an issue or pull request on GitHub.
