## 📱 Todo Task Manager - Hackathon Submission

This is a cross-platform **Todo Task Management Mobile App** built using **React Native**. It enables users to manage personal tasks efficiently with an intuitive interface, supporting social authentication and full task CRUD functionalities.  

---

### 🚀 Features

- ✅ Social login with **Google**
- 🗂 Full task CRUD operations
- 📅 Task fields: title, description, due date, status (open/complete), and priority
- 🔍 Search, filter, and tabbed views for better UX
- 🤏 Swipe-to-delete & pull-to-refresh
- 💾 Offline support via local state
- 💣 Crash reporting with **Firebase Crashlytics**
- 💡 Smooth animations on task interactions
- 🧹 Clean, scalable, and modular codebase
- 🎯 Follows MVVM (Model-View-ViewModel) pattern

---

### 🧑‍💻 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Frontend    | React Native (Expo)    |
| Backend     | None (Local State)     |
| Auth        | Firebase Auth (Google) |
| Crashlytics | Firebase Crashlytics   |

---

### 🧱 Architecture Diagram

[ 👤 User ]
     |
     v
+--------------------------+
|      UI Layer            |
|  (React Native Views)    |
|--------------------------|
| - Login Screen           |
| - Task List / Filters    |
| - Add/Edit Task Form     |
+--------------------------+
     |
     v
+--------------------------+
|    ViewModel Layer       |
|--------------------------|
| - Handles business logic |
| - Manages task state     |
| - Filters, sorting, etc. |
+--------------------------+
     |
     v
+-------------------------------+
|         Service Layer         |
|-------------------------------|
| - AuthService (Google Auth)   |
| - TaskService (Local CRUD)    |
| - CrashService (Crashlytics)  |
+-------------------------------+
     |
     v
+--------------------------------------+
|         External Services            |
|--------------------------------------|
| - Firebase Auth (Google Sign-In)     |
| - Firebase Crashlytics               |
+--------------------------------------+



---

### ✅ Assumptions

- No backend is required; task data is stored **locally** using app state (e.g., Redux or useState).
- Authentication is done using **Google**, not GitHub/Facebook/Apple, as only one is required.
- We assumed **Expo** is allowed for faster development and easier APK generation.
- Design is kept **minimal but modern**, prioritizing usability.
- Offline mode is limited to session-based local state (not persisted across app restarts).

---

### 📍 About

This project is a part of a hackathon run by [https://www.katomaran.com](https://www.katomaran.com)
