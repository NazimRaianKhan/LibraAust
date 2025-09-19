# LibraAust - University Library Management System

## Project Overview

LibraAust is a modern Library Management System designed for our university, streamlining book borrowing processes for students and faculty while providing librarians with efficient tools for inventory management.

## Project Objective

To create a digital platform that:

- Simplifies book borrowing for university members
- Provides librarians with an intuitive management interface
- Reduces manual paperwork and improves tracking of library resources

## Collaborators

Mohymin Zawad </br>
[![wakatime](https://wakatime.com/badge/user/c3c34631-addf-409a-b19f-6bf0fb04b554/project/0e52deff-b132-4fe5-8cc1-e5d73cd2960c.svg)](https://wakatime.com/badge/user/c3c34631-addf-409a-b19f-6bf0fb04b554/project/0e52deff-b132-4fe5-8cc1-e5d73cd2960c)

Md. Aribur Rahman Dhruvo </br>
[![wakatime](https://wakatime.com/badge/user/53321020-0332-4842-9551-15adf1c7024d/project/7c1af66b-9f76-4382-9075-bfcf48505616.svg)](https://wakatime.com/badge/user/53321020-0332-4842-9551-15adf1c7024d/project/7c1af66b-9f76-4382-9075-bfcf48505616)

Mohammad Yahya Bin Belal</br>
[![wakatime](https://wakatime.com/badge/user/91444d8d-8ee5-4246-a579-3cdb56fed006/project/39f2c80e-5729-4273-be68-33e7a5407d65.svg)](https://wakatime.com/badge/user/91444d8d-8ee5-4246-a579-3cdb56fed006/project/39f2c80e-5729-4273-be68-33e7a5407d65)

Nazim Raian Khan</br>
[![wakatime](https://wakatime.com/badge/user/05c510cd-06a7-4f8e-9e91-7e8a6f5cbee9/project/fd4998b5-85f5-4504-ba27-6c1cf2da9ece.svg)](https://wakatime.com/badge/user/05c510cd-06a7-4f8e-9e91-7e8a6f5cbee9/project/fd4998b5-85f5-4504-ba27-6c1cf2da9ece)

## Target Audience

- University students
- Faculty members
- Librarians and library staff

## Core Features

- **AI Suggestions**: AI Chatbot to help find the interest-relevant books
- **Library Membership**: Easier Library Membership using authentication
- **Book Borrowing System**: Online reservation and borrowing for university members
- **Inventory Management**: Librarians can add/update/remove books and publications
- **Book Previews**: Each book card displays preview information
- **Search Functionality**: Easy discovery of available resources
- **Borrowing History**: Track past and current borrowings

## Tech Stack

- **Backend**: Laravel PHP framework
- **Frontend**: React
- **Database**: MySQL

## Setup Instructions

### Backend (Laravel) Setup

1. Clone the repository: `git clone [repository-url]`
2. Navigate to backend directory: `cd libraaust/backend`
3. Install dependencies: `composer install`
4. Copy `.env.example` to `.env` and configure your database settings
5. Generate application key: `php artisan key:generate`
6. Run migrations: `php artisan migrate`
7. Seed initial data: `php artisan db:seed`
8. Start development server: `php artisan serve`

### Frontend (React) Setup

1. Navigate to frontend directory: `cd libraaust/frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## UI Design

View our UI prototype on Figma: [LibraAust](https://www.figma.com/make/YtpOSa3FB7CS3hPW0d7SlH/LibraAust?fullscreen=1)
