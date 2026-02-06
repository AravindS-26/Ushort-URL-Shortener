# 🔗 Ushort – URL Shortener Web Application

**Ushort** is a modern, production-style **URL Shortener web application** built with a strong focus on **clean architecture, performance, and user experience**.  
It allows users to shorten long URLs, redirect using short links, and view basic analytics through a clean, intuitive interface.

This project is designed to reflect **real-world system design and frontend UX practices**, not a simple demo.

---

## 🎯 Project Goals

The primary goals of Ushort are to:

- Build a **fully functional end-to-end URL shortener**
- Follow **clean backend architecture principles**
- Deliver a **modern, light-themed, responsive UI**
- Handle **real-world edge cases correctly**
- Prepare the system for **scalability and optimization**

---

## 🧱 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- REST APIs

### Frontend
- React
- Tailwind CSS
- Axios
- Lucide Icons
- Mobile-first responsive design

---

## 🏗️ High-Level Architecture

Frontend (React)
↓
REST APIs (Spring Boot)
↓
Service Layer (Business Logic)
↓
Repository Layer (JPA)
↓
MySQL Database


### Architectural Principles
- Controllers handle HTTP concerns only
- Services contain pure business logic
- Repositories manage persistence
- Frontend and backend remain loosely coupled

---

## ⚙️ Core Features

### 1. URL Shortening

Users can submit a long URL and receive a shortened link.

**Flow:**
1. User submits a URL from the frontend  
2. Backend validates the URL  
3. A unique short code is generated  
4. URL mapping is stored in the database  
5. The short URL is returned to the user  

**Validation Rules:**
- Empty URLs are rejected
- Only `http` and `https` URLs are allowed
- Missing protocol is handled automatically
- URLs longer than 2000 characters are rejected

---

### 2. Short Code Generation

Ushort uses a **hybrid deterministic + random strategy**:

Base62(Database ID) + Random Base62 Suffix


**Why this approach:**
- Database ID guarantees uniqueness
- Random suffix reduces predictability
- Prevents easy URL enumeration
- Extremely low collision risk
- Simple and efficient implementation

---

### 3. Redirect Handling

Short URLs redirect users to the original destination using **HTTP 302 redirects**.

**Redirect checks include:**
- Short code existence
- Active status
- Expiry validation

**Performance-focused design:**
- Minimal logic in the redirect path
- No DTO mapping during redirects
- Atomic database updates for click counts

Invalid, inactive, or expired links display **friendly error pages** instead of raw JSON responses.

---

### 4. Click Tracking

Each successful redirect increments a click counter.

**Implementation details:**
- Click counts are updated using **atomic database operations**
- Prevents race conditions under concurrent traffic
- Ensures accurate analytics data

---

### 5. Analytics Dashboard

Users can view analytics for a shortened URL by entering a short code or short URL.

**Displayed information:**
- Original URL
- Short URL
- Total click count
- Creation date
- Expiry date
- Status (Active / Expired / Inactive)

The frontend automatically extracts the short code if a full short URL is pasted.

---

## 🛡️ Edge Case Handling

Ushort includes safeguards for real-world usage:

### URL Validation
- Invalid or malformed URLs are never persisted
- Only valid web URLs are accepted

### Self-Referencing URL Protection
- Prevents shortening URLs belonging to Ushort itself
- Avoids infinite redirect loops
- Protects analytics integrity

### Expiry Enforcement
- Expired links never redirect
- Expired links are clearly marked in analytics
- Redirects fail gracefully

### Frontend Guards
- Buttons disabled during API calls
- Inline validation messages
- Copy-to-clipboard fallback handling

---

## 🧼 Clean Architecture Decisions

### Backend
- No business logic in controllers
- No HTTP concerns inside services
- Centralized URL-building logic
- Database remains the single source of truth

### Frontend
- Reusable, well-scoped components
- Clear separation between pages, services, and utilities
- Centralized styling using Tailwind and CSS variables

---

## 🎨 UI / UX Design

### Design Principles
- Light theme only
- Clean spacing and typography
- Minimal visual clutter
- Clear content hierarchy

### UX Features
- Prominent input fields and CTAs
- Loading and disabled states
- Copy-to-clipboard feedback
- Toast notifications for success and errors
- Subtle, non-distracting animations

### Responsiveness
- Fully responsive layout
- Optimized for mobile, tablet, and desktop
- Touch-friendly interactions

---

## ❗ Error Handling & User Feedback

- Backend returns meaningful error responses
- Frontend displays clear, user-friendly messages
- Redirect failures show branded HTML error pages
- No stack traces or internal errors are exposed to users

---

## 🧪 Reliability & Correctness

Ushort is designed to:
- Handle concurrent requests safely
- Avoid race conditions
- Fail gracefully under error scenarios
- Maintain data integrity at all times

---

## 🚀 Current Scope (Implemented)

- URL shortening  
- Short URL redirection  
- Click tracking  
- Analytics dashboard  
- Edge case handling  
- Clean UI/UX  
- Responsive frontend  
- Clean backend architecture  

Only implemented features are documented here.

---

## 🏁 Conclusion

Ushort demonstrates a **production-minded approach** to building a URL shortener:

- Clean backend design
- Thoughtful frontend UX
- Performance-aware decisions
- Robust edge case handling

The project goes beyond “just working” and focuses on **correctness, usability, and long-term maintainability**.
