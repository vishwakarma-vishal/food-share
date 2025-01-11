# Food Share

**Food Share: Share Food, Spread Smiles**

---

### Table of Contents

1. [Demo](#demo)
2. [Design Inspiration](#design-inspiration)
3. [Problem Statement](#problem-statement)
4. [Key Highlights](#key-highlights)
5. [Features](#features)
6. [Challenges and Solutions](#challenges-and-solutions)
7. [Technology Stack](#technology-stack)
8. [Future Enhancements](#future-enhancements)
9. [Conclusion](#conclusion)
10. [Acknowledgments](#acknowledgments) 

---

## Demo
**Deployed link** 👉 https://food-share-app.netlify.app/

**Demo link** 👉 [Watch the Food Share Demo](https://drive.google.com/file/d/1Uqf4IqXitfgH8cd19nsUKNLQjPiDAGaN/view?usp=sharing)

---

### Design Inspiration

The design for **Food Share** was inspired by various food donation platforms and concepts available on the internet. It is not copied from any specific source but rather developed using common UI patterns found in such platforms.

---

## Problem Statement

In today's world, many people go to bed hungry due to poverty, while numerous restaurants throw away surplus food at the end of the day. Although many NGOs are dedicated to helping these people by providing food, they face a significant challenge: they do not know which restaurants have surplus food available for donation. Additionally, restaurants are unaware of where they can donate food and often lack the time to handle the donation process.

**Food Share** solves this gap by providing a platform where restaurants can easily upload their surplus food listings, and NGOs can view, reserve, and collect the food for distribution to those in need. This system helps reduce hunger and food wastage by utilizing existing resources efficiently.

---

## Key Highlights

- Full-stack application built with **React.js** (Frontend) and **Node.js** with **Express.js** (Backend)
- **JWT Authentication** for secure user login and authorization
- **Role-based dashboards** for both restaurants and NGOs
- Cloud-based image storage with **Cloudinary** for restaurant, NGO profile and food listing pictures
- **MongoDB** as the database to store food listings, user profiles, and donation history
- **Recoil** for state management and efficient data flow
- Easy-to-use interface with **Tailwind CSS** for responsive design
- **Zod** for input validation to ensure clean and secure data

---

## Features

- **Restaurant Dashboard:**
  - Restaurants can easily upload, edit, and delete food listings.
  - Each food listing includes details like food name, image, expiry, pickup time, and donation notes.
  - Restaurants can track their donation history and see whether food has been distributed by the NGO or not.
  
- **NGO Dashboard:**
  - NGOs can create a profile and view available food listings from restaurants.
  - NGOs can reserve food to collect it from restaurants.
  - NGOs can mark food as distributed after delivering it to the needy and add distribution notes.
  - A history of collected and donated food is available for NGOs.

- **User Profile:**
  - Both restaurants and NGOs have customizable profiles, including the option to upload profile images.
  
- **Search and Filter:**
  - Both dashboards have powerful search and filtering features, allowing users to find food listings based on specific criteria.

---

## Challenges and Solutions

- **Challenge-1:** Storing Images on the Server  
  Storing images directly on the server can lead to scalability issues, increased storage requirements, and slower application performance.  
  **Solution:** I used **Cloudinary**, a cloud-based media management service, to handle image uploads. This ensures quick access to images, improved scalability, and reduced server load.

- **Challenge-2:** Managing Secure User Authentication  
  Ensuring secure user authentication and authorization is crucial, especially when dealing with sensitive user data.  
  **Solution:** Implemented **JWT (JSON Web Tokens)** for authentication, ensuring that user data remains secure while also providing an efficient way to manage user sessions.
  
---

## Technology Stack

- **Frontend:**
  - **React.js** – for building dynamic and responsive user interfaces.
  - **Tailwind CSS** – for creating a clean, mobile-first, and responsive design.
  - **Recoil** – for state management and efficient data flow between components.

- **Backend:**
  - **Node.js** – for building the server-side logic.
  - **Express.js** – for creating RESTful APIs and handling HTTP requests.
  - **JWT (JSON Web Tokens)** – for secure authentication and authorization.
  - **bcrypt** – for securely hashing passwords.
  - **Zod** – for input validation to ensure safe data entry.

- **Database:**
  - **MongoDB** – for storing user profiles, food listings, and donation histories.

- **Media Management:**
  - **Cloudinary** – for cloud-based image storage and management.

- **Deployment:**
  - **Frontend:** Deployed on **Netlify** for fast and reliable hosting.
  - **Backend:** Deployed on **Render** for scalable server-side hosting.

---

## Future Enhancements

- **Real-time Notifications:** Add real-time push notifications to alert restaurants when an NGO reserves food and to notify NGOs when food is ready for pickup.
- **Review System:** Implement a review and rating system where restaurants can rate NGOs based on their punctuality and the quality of the food distribution, and vice versa. This will help build trust and improve the service.
- **User Roles and Permissions:** Introduce more granular roles and permissions to allow multiple users (e.g., restaurant managers or NGO coordinators) with varying access levels.
- **Food Expiry Alerts:** Implement alerts to notify NGOs when food is approaching its expiry date, ensuring timely collection and distribution.
- **Mobile App:** Build a mobile application to provide a better user experience for both restaurants and NGOs on the go.

---

## Conclusion

**Food Share** is a platform designed to bridge the gap between restaurants with surplus food and NGOs helping feed the hungry. By streamlining the donation process and ensuring the efficient distribution of food, the project addresses a critical issue of hunger and food wastage. The application demonstrates my ability to create a full-stack solution, handle complex features like authentication, image storage, real-time notifications, and work with modern technologies like React, Node.js, and MongoDB. I am committed to continuously improving this project and exploring new ways to expand its impact in the future.

---

## Acknowledgments

- Special thanks to the open-source community for providing helpful tools and libraries that made this project possible, such as **React**, **Node.js**, **Express.js**, and **MongoDB**.
- Thanks to the developers of **Cloudinary**, **JWT**, and **Zod** for their tools that made the application more robust.
