# GEDPro - Document & Recruitment Management System

A comprehensive **NestJS-powered** platform for managing recruitment workflows, candidate applications, and document storage with real-time notifications.

## 🎯 Overview

GEDPro is a modern, scalable backend API built with NestJS that streamlines the entire recruitment lifecycle - from form creation to candidate management, interview scheduling, and document storage.

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin RH, RH, Manager)
- Secure password hashing with bcrypt

### 📋 Dynamic Form Builder
- Create custom recruitment forms
- Multiple field types (text, email, file upload, date, etc.)
- Drag-and-drop field reordering
- Public form publishing with unique URLs

### 👥 Candidate Management
- Track candidate applications
- Status workflow (New → Pre-selected → Accepted/Rejected)
- Complete status history tracking
- Document attachment support

### 📁 Document Storage
- MinIO-powered S3-compatible storage
- Secure file upload/download
- Document management per candidate
- Support for multiple file types

### 📅 Interview Scheduling
- Schedule interviews for candidates
- Multi-participant support
- Date-range filtered interview lists
- Interview status management (Scheduled/Cancelled)

### 🔔 Real-Time Notifications
- WebSocket-based live notifications
- Targeted notifications by user role
- Mark as read/unread functionality
