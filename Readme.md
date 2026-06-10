# SPMA — Study Planner Mobile App

**Modern React Native task management application with full authentication and Spring Boot backend.**

![SPMA Banner](<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/929b2f1b-c53e-4059-8a04-f7773c0e04ea" />
)

## 📋 Project Information

- **Student Name**: Yusif Rahimov
- **Student ID**: 53206
- **Course**: Mobile Programming Languages -- Laboratory
- **Project Type**: React Native (Expo) Application

---

## ✨ Features

- **Complete Authentication System**
  - User registration with email verification
  - Secure login / logout with session persistence
  - Forgot password recovery with reset code
  - Change email with confirmation code
  - Change password functionality

- **Task Management**
  - Create tasks with title, description and due date
  - Mark tasks as completed / pending
  - Delete tasks
  - Filter tasks (All / To Do / Done)

- **Calendar View**
  - Full monthly calendar navigation
  - Visual indicators for days containing tasks
  - Detailed tasks list for selected day

- **Settings & Additional Features**
  - Customizable avatar (12 emoji options)
  - Local push notifications with customizable intervals
  - Export all tasks to Excel (.xlsx) format
  - Clean, modern dark theme

---

## 🛠 Tech Stack

**Frontend**
- React Native (Expo)
- Expo Router (file-based navigation)
- TypeScript / JavaScript
- Expo Notifications, FileSystem, Sharing, DateTimePicker
- AsyncStorage

**Backend**
- Java Spring Boot
- PostgreSQL Database
- REST API with JWT Authentication

**Tools**
- EAS Build
- Expo Go

---

## 📱 Screenshots


**Home** | **Calendar** | **Add Task** | **Settings**
---|---|---|---
![Home](screenshots/home.png) | ![Calendar](screenshots/calendar.png) | ![Add Task](screenshots/add-task.png) | ![Settings](screenshots/settings.png)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Backend server running at `http://152.70.5.51:8080`

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd spma

2. Install dependencies:
    npm install

3. Start the app:
   npx expo start


## Backend Connection🛜️
The app connects to the backend at:
http://152.70.5.51:8080
You can change BASE_URL in api/api.ts if necessary.

### 📁 Project Structure
 spma/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Home
│   │   ├── calendar.tsx
│   │   ├── tasks.tsx             # Add Task
│   │   └── settings.tsx
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── forgot-password.tsx
│   ├── email-verification.tsx
│   └── ... (auth flows)
├── components/ui/                # Reusable components
├── api/
│   └── api.ts                    # API service layer
├── constants/
│   └── theme.ts                  # Colors, fonts, spacing
├── assets/
└── app.json


