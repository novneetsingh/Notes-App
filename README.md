# 📝 Notes App

The **Notes App** is a full-stack web application that allows users to create, manage, and organize their notes. Users can add notes using text input or voice recording, with the latter being transcribed to text using the Browser Web Speech API. The app includes authentication, search functionality, and various note management features.

---

## 🌐 **Live Demo**

🔗 https://notes-app-q6ec.onrender.com

---

## 🚀 **Features**

### 🔹 **User Authentication**

- Sign-up and login functionality using **JWT authentication**.
- Secure storage of user credentials.

### 🔹 **Note Management**

- Create notes using **text input** or **voice recording**.
- Audio notes are transcribed into text using the **Browser Web Speech API**.
- Notes are **stored in MongoDB** and linked to the user.

### 🔹 **Sorting & Searching**

- Users can **search** notes by title or content in real-time.
- Sort notes from **oldest to newest**.

### 🔹 **Note Actions**

- **Copy to clipboard**.
- **Delete notes**.
- **Rename notes**.
- **Edit notes**.
- **Favorite notes**.
- **View notes in a modal with fullscreen support**.

### 🔹 **Image Upload**

- Users can upload an image as part of a note.

---

## 🛠 **Technologies Used**

| Technology         | Description            |
| ------------------ | ---------------------- |
| **Frontend**       | React.js, Tailwind CSS |
| **Backend**        | Node.js, Express.js    |
| **Database**       | MongoDB (Mongoose)     |
| **Authentication** | JSON Web Tokens (JWT)  |
| **Speech API**     | Browser Web Speech API |

---

## 📂 **Project Structure**

```
notes-app/
├── client/  # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/  # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── index.js
├── .gitignore
├── README.md
└── package.json
```

---

## 🎯 **API Endpoints**

### 🔑 **Authentication**

#### ✅ **User Sign-Up**

- **Endpoint:** `POST /user/signup`

#### ✅ **User Login**

- **Endpoint:** `POST /user/login`

### 📌 **Notes Management** (Protected Routes - Requires Token)

#### ✅ **Create a Note**

- **Endpoint:** `POST /notes/create-notes`
- **Request Body:**
  ```json
  {
    "title": "Meeting Notes",
    "transcribedText": "This is the transcribed text",
    "audio": "audio-file-url"
  }
  ```

#### ✅ **Get All Notes**

- **Endpoint:** `GET /notes/all-notes`

#### ✅ **Update a Note**

- **Endpoint:** `PUT /notes/update/:id`

#### ✅ **Delete a Note**

- **Endpoint:** `DELETE /notes/delete/:id`

#### ✅ **Search Notes by Title**

- **Endpoint:** `GET /notes/search-notes?search=keyword`

#### ✅ **Favorite a Note**

- **Endpoint:** `PUT /notes/mark-favourite/:id`

---
