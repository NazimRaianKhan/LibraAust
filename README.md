# LibraAust - University Library Management System

**Team Members:**

- Member 1 - Md. Aribur Rahman Dhruvo | aribur.cse.20220204003@aust.edu </br>

- Member 2 - Mohammad Yahya Bin Belal | yahya.cse.20220204004@aust.edu </br>

- Member 3 - Tanzila Tabassum Ahona | tanzila.cse.20220204006@aust.edu</br>

- Member 4 - Nazim Raian Khan | nazim.cse.20220204026@aust.edu </br>

**Project Live Link:** [libra-aust.vercel.app](https://libra-aust.vercel.app/) </br>
**Recorded video:**

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [Workflow Overview](#2-workflow-overview)
3. [Main Features](#3-main-features)
4. [Technologies Used](#4-technologies-used)
5. [System Architecture](#5-system-architecture)
6. [Setup Guidelines](#6-setup-guidelines)
   - [Backend](#backend)
   - [Frontend](#frontend)
7. [Running the Application](#7-running-the-application)
8. [Deployment Status & Tests](#8-deployment-status--tests)
9. [Screenshots](#9-screenshots)
10. [Limitations / Known Issues](#10-limitations--known-issues)
11. [UI](#11-ui-design)

---

## 1. Project Description

LibraAust is a modern Library Management System designed for our university, streamlining book borrowing processes for students and faculty while providing librarians with efficient tools for inventory management.

The obejective is to create a digital platform that:

- Simplifies book borrowing for university members
- Provides librarians with an intuitive management interface
- Reduces manual paperwork and improves tracking of library resources

---

## 2. Workflow Overview

![Workflow](Images/Workflow.png)

---

## 3. Main Features

- **Library Membership**: Easier Library Membership using authentication
- **Book Borrowing System**: Online reservation and borrowing for university members
- **Inventory Management**: Librarians can add/update/remove books and publications
- **Book Previews**: Each book card displays preview information
- **Search Functionality**: Easy discovery of available resources
- **Borrowing History**: Track past and current borrowings
- **Borrow Management**: Librarians can confirm the return of book and fine (if fined for late return) that was done in offline

---

## 4. Technologies Used

- Frontend: React, Tailwind CSS,
- Backend: Laravel, Sanctum
- Database: MySQL
- APIs: Cloudinary, Gemini, Restful API
- Other Tools: Docker, Vercel(Frontend), Railway(Database), Render(Backend)

---

## 5. System Architecture

## ![SystemArchitecture](Images/SysArchi.png)

## 6. Setup Guidelines

### Backend

```bash
# Clone the repository
git clone https://github.com/NazimRaianKhan/LibraAust.git
cd Backend

# Install dependencies
composer install

# Setup environment variables
cp .env.example .env
# Add DB, Cloudinary, and Gemini API credentials

# Generate app key
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Start development server
php artisan serve

```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add API URL (e.g., VITE_API_URL=http://localhost:8000/api)

# Start frontend
npm run dev
```

---

## 7. Running the Application

### Local Development:

- Frontend: http://localhost:5173

- Backend: http://localhost:8000/api

### Live Deployment:

- Frontend (Vercel): [libra-aust.vercel.app](https://libra-aust.vercel.app)

- Backend (Railway): Will be deployed later

## 8. Deployment Status & Tests

| Component | Is Deployed? | Is Dockerized? | Unit Tests Added? (Optional) |
| --------- | ------------ | -------------- | ---------------------------- |
| Backend   | No           | Yes            | No                           |
| Frontend  | Yes          | No             | No                           |

## 9. Screenshots

### Homepage

![Homepage](Images/Homepage.png)

### Book Page

![Book Page](Images/Bookpage.png)

### Thesis Page

![Thesis Page](Images/Thesispage.png)

### About Page

![About Page](Images/AboutPage.png)

### Contact Page

![Contact Page](Images/ContactPage.png)

### My Borrow Page

![My Borrow Page](Images/MyBorrowPage.png)

### Book Detail Page

![Book Detail Page](Images/BookDetailPage.png)

### Sign In Page

![Sign In Page](Images/SignInPage.png)

### Sign Up Page

![Sign Up Page](Images/SignUpPage.png)

### Add Publication Page(Librarian only)

![Add Publication Page](Images/AddPublicationPage.png)

### Manage Borrow Page(Librarian only)

![Manage Borrow Page](Images/ManageBorrowsPage.png)

### Edit Book Page(Librarian only)

![Edit Book Page](Images/EditBookPage.png)

### Book Detail Page((Librarian only))

![Book Detail Page](Images/BookDetailPage.png)

## 10. Limitations / Known Issues

- No option for account recovery
- No option for email verification or reset password
- chatbot sometimes dont work properly and only recommend based on department

## 11. UI Design

View our UI prototype on Figma: [LibraAust](https://www.figma.com/make/YtpOSa3FB7CS3hPW0d7SlH/LibraAust?fullscreen=1)
