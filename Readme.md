# SPMA — Study Planner Mobile App

**Modern React Native task management application with full authentication and Spring Boot backend.**

<img width="512" height="512" alt="SPMA Logo" src="https://github.com/user-attachments/assets/929b2f1b-c53e-4059-8a04-f7773c0e04ea" />

## 📋 Project Information

- **Student Name**: Yusif Rahimov
- **Student ID**: 53206
- **Course**: Mobile Programming Languages — Laboratory
- **Project Type**: React Native (Expo) + Spring Boot Application

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
- **React Native** (Expo)
- **Expo Router** (file-based navigation with Tabs + Stack)
- **TypeScript**
- **Expo Notifications**
- **Expo FileSystem** + **Expo Sharing**
- **@react-native-community/datetimepicker**
- **AsyncStorage**
- Custom dark theme with consistent design system (`constants/theme.ts`)

**Backend**
- **Java Spring Boot**
- **PostgreSQL** Database
- REST API with **JWT Authentication**
- Spring Security + Spring Data JPA

**Tools**
- EAS Build
- Expo Go
- Postman (API testing)

---

## 📱 Screenshots

| Home | Calendar | Add Task | Settings |
|------|----------|----------|----------|
| ![Home](https://github.com/user-attachments/assets/b8e3ce69-3774-4805-86e5-0bfe0038f624) | ![Calendar](https://github.com/user-attachments/assets/08d1a817-9df2-4e6e-9ce8-8e53771edd96) | ![Add Task](https://github.com/user-attachments/assets/ae7a8ea1-0e15-49d9-a220-fb1c98eb4e50) | ![Settings](https://github.com/user-attachments/assets/3cad1a09-417d-4def-b918-f180927010c4) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Backend server running at `http://152.70.5.51:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd spma
