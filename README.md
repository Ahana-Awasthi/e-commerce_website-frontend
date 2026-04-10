<h1 align="center">🛍️ E-Commerce Web Application</h1>

<p align="center">
A Full-Stack MERN E-Commerce Platform<br>
<strong>⚠️ Work In Progress</strong>
</p>

---

## 🚧 Project Status

> 🚀 This project is currently <strong>under development</strong>.  
> Core modules are being implemented and additional features such as Chatbot and AI Lens are in progress.

---

## 📌 Overview

This is a full-stack E-Commerce web application built using the <strong>MERN Stack</strong> (MongoDB, Express.js, React.js, Node.js).

The application demonstrates:

- 🔐 Authentication System
- 🛒 Cart & Wishlist Logic
- 📦 Product Category Browsing
- 👤 User Account Management
- 🤖 Chatbot & AI-Based Feature (Planned)

This project is being developed as part of an academic evaluation to demonstrate backend architecture, API design, and dynamic frontend rendering.

---

## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT-based Authentication
- Protected Routes (Cart, Wishlist, Account)
- Dynamic Navbar after Login

---

### 🛍️ Product Browsing

- Categories: <strong>Men | Women | Kids</strong>
- Product Listing
- Dynamic Routing
- Structured Product Data

---

### 🛒 Cart System

- Add to Cart
- Remove from Cart
- Update Quantity
- Persistent User-Specific Cart

---

### ❤️ Wishlist

- Add to Wishlist
- Remove from Wishlist
- Protected (Login Required)

---

### 👤 My Account Page

- User Details Display
- Profile Information
- Logout Functionality

---

### 🤖 Upcoming Features

- Chatbot (Flow-based customer support system)
- AI Lens (Product recognition / smart feature)
- Order Management System
- Admin Controls

---

## 🏗️ Tech Stack

### 💻 Frontend

- React.js
- React Router
- CSS / Custom Styling

### 🖥️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### 🔑 Authentication

- JWT (JSON Web Token)
- Bcrypt (Password Hashing)

---

## 📂 Project Structure

/frontend  
&nbsp;&nbsp;&nbsp;&nbsp;/components  
&nbsp;&nbsp;&nbsp;&nbsp;/pages  
&nbsp;&nbsp;&nbsp;&nbsp;App.js  
&nbsp;&nbsp;&nbsp;&nbsp;index.js

/backend  
&nbsp;&nbsp;&nbsp;&nbsp;/models  
&nbsp;&nbsp;&nbsp;&nbsp;/routes  
&nbsp;&nbsp;&nbsp;&nbsp;/controllers  
&nbsp;&nbsp;&nbsp;&nbsp;server.js

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔒 Security Implementation

- Passwords hashed using <strong>Bcrypt</strong>
- Authentication secured via <strong>JWT</strong>
- Protected Routes implemented
- User-specific data isolation

---

## 🎯 Learning Objectives

This project demonstrates:

- Full-Stack Development
- REST API Design
- Authentication Flow
- Database Schema Design
- React State Management
- Frontend–Backend Integration

---

## 👩‍💻 Contributors

- <strong>Your Name</strong> – Backend Architecture & Integration
- Team Member 1 – Frontend Development
- Team Member 2 – Research & Feature Planning

---

## 📈 Future Improvements

- Payment Gateway Integration
- Order History
- Deployment (AWS / Render / Vercel)
- Performance Optimization
- Advanced AI Features

---

<p align="center">
<strong>🚀 Built with dedication and continuous improvement.</strong>
</p>
