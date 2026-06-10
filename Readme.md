# 📚 SPMA — Study Planner Mobile App

<div align="center">

<img src="https://github.com/user-attachments/assets/929b2f1b-c53e-4059-8a04-f7773c0e04ea" width="220" alt="SPMA Logo"/>

### Modern Task Management Application for Students

Built with **React Native (Expo)** and **Spring Boot**

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-Academic-blue)
![Status](https://img.shields.io/badge/Status-Completed-success)

</div>

---

# 📋 Project Information

| Field      | Value                                         |
| ---------- | --------------------------------------------- |
| Student    | **Yusif Rahimov**                             |
| Student ID | **53206**                                     |
| Course     | **Mobile Programming Languages — Laboratory** |
| Project    | **SPMA (Study Planner Mobile App)**           |

---

# ✨ Features

## 🔐 Authentication & Security

Complete user authentication system with secure backend integration.

### Implemented Features

* User Registration
* Email Verification
* Login & Logout
* JWT Authentication
* Session Persistence
* Forgot Password Flow
* Password Reset via Verification Code
* Change Password
* Change Email

---

## ✅ Task Management

Manage academic and personal tasks efficiently.

### Features

* Create Tasks
* Edit Task Information
* Delete Tasks
* Mark as Completed
* Mark as Pending
* Due Date Support
* Task Description Support

### Filtering

* 📋 All Tasks
* ⏳ To Do
* ✅ Completed

---

## 📅 Calendar Module

Integrated monthly calendar for task planning.

### Features

* Monthly Navigation
* Task Indicators on Dates
* View Tasks by Selected Day
* Fast Schedule Overview

---

## ⚙️ Settings

Personalization and productivity tools.

### Available Options

* 12 Selectable Avatars
* Notification Configuration
* Account Management
* Export Tasks to Excel (.xlsx)

### Notification Times

* 15 Minutes Before
* 30 Minutes Before
* 1 Hour Before
* 2 Hours Before

---

# 🏗 Architecture

```text
┌─────────────────────┐
│   React Native App  │
│      (Expo)         │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐
│   Spring Boot API   │
│      JWT Auth       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    PostgreSQL DB    │
└─────────────────────┘
```

---

# 🛠 Technology Stack

## Frontend

- React Native 0.81
- Expo SDK 54
- Expo Router
- TypeScript
- AsyncStorage
- Expo Notifications
- Expo FileSystem
- Expo Sharing
- React Native DateTimePicker

---

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* PostgreSQL
* REST API

---

## Development Tools

* EAS Build
* Expo Go
* Android Studio
* IntelliJ IDEA

---

# 📱 Application Screenshots

| Home                                                                                     | Calendar                                                                                     |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![Home](https://github.com/user-attachments/assets/b8e3ce69-3774-4805-86e5-0bfe0038f624) | ![Calendar](https://github.com/user-attachments/assets/08d1a817-9df2-4e6e-9ce8-8e53771edd96) |

| Add Task                                                                                     | Settings                                                                                     |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![Add Task](https://github.com/user-attachments/assets/ae7a8ea1-0e15-49d9-a220-fb1c98eb4e50) | ![Settings](https://github.com/user-attachments/assets/3cad1a09-417d-4def-b918-f180927010c4) |

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/spma.git
cd spma
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npx expo start
```

---

## Run on Android

```bash
npx expo run:android
```

---

## Run on iOS

```bash
npx expo run:ios
```

---

# 🌐 Backend Configuration

Backend API:

```text
http://152.70.5.51:8080
```

Example configuration:

```typescript
export const API_URL = "http://152.70.5.51:8080";
```

---

# 📂 Project Structure

```text
spma/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── calendar.tsx
│   │   ├── tasks.tsx
│   │   └── settings.tsx
│   │
│   ├── change-email.tsx
│   ├── change-pass.tsx
│   └── forgot-pass-change-password.tsx
│   └── email-verification.tsx
│   └── forgot-pass-verify.tsx
│   └── forgot-password.tsx
│   └── index.tsx
│   └── _layout.tsx
│   └── sign-in.tsx
│   └── sign-up.tsx
│   └── splash.tsx
│   └── start.tsx
├── api/
│   └── api.ts
│
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── TaskCard.tsx
│
├── constants/
│   └── theme.ts
│
├── assets/
│
├── app.json
├── package.json
└── README.md
```

---

# 📊 Implemented Laboratory Criteria

## ✅ Base Criteria

All base laboratory requirements (1–15) have been implemented successfully.

### Included

* Navigation
* Forms
* State Management
* API Communication
* Local Storage
* UI Components
* Notifications
* Data Validation
* Mobile UX Features

---

## ⭐ Extended Criteria

### A. Backend & Database

* Spring Boot REST API
* PostgreSQL Database
* Persistent Storage

### B. Authentication & Authorization

* JWT Authentication
* Email Verification
* Password Recovery
* Protected Routes

---

# 🎓 Evaluation

| Requirement          | Status      |
| -------------------- | ----------- |
| Base Criteria (1–15) | ✅ Completed |
| Extended Criterion A | ✅ Completed |
| Extended Criterion B | ✅ Completed |

### Final Result

**Base Criteria + 2 Extended Criteria**

🎯 **Eligible for Grade 5.0**

---

# 👨‍💻 Author

## Yusif Rahimov

**Student ID:** 53206

Mobile Programming Languages Laboratory Project

---

<div align="center">

### SPMA — Study Planner Mobile App

Built with ❤️ using React Native, Expo and Spring Boot

</div>
