// This file centralizes Firebase configuration and shared application settings.

// Available admin roles
export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  HOD: 'HOD',
  EXAM_OFFICER: 'ExamOfficer',
  // Add other roles here
};

// Available departments for routing
export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Telecommunication Engineering',
  'Business Administration',
];

// Complaint submission targets available to students
export const COMPLAINT_TARGETS = {
  GENERAL: 'General',
  HOD: 'HOD',
  EXAM_OFFICER: 'ExamOfficer',
};

/*********** Replace these with your firebase project config ***********/
export const firebaseConfig = {
  apiKey: "AIzaSyDIqR0b9hA9IaLhRsVtJKSSwh9NktuIIjI",
  authDomain: "queueup-85662.firebaseapp.com",
  databaseURL: "https://queueup-85662-default-rtdb.firebaseio.com",
  projectId: "queueup-85662",
  storageBucket: "queueup-85662.firebasestorage.app",
  messagingSenderId: "647901471109",
  appId: "1:647901471109:web:2607f4883cd1393259e4ec"
};
/************************************************************************/
