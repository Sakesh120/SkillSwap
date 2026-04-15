# 🚀 SkillSwap

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" />
</p>

<p align="center">
  <b>A peer-to-peer skill exchange platform where learning is mutual, practical, and free.</b>
</p>

---

## 🌟 Why SkillSwap?

Most platforms follow **one-way learning** — you pay, you watch, you forget.

**SkillSwap flips that model.**

> 💡 Learn by teaching. Teach by learning.

- No money barrier  
- Real human interaction  
- Practical, hands-on learning  

👉 Connect. Exchange. Grow.

---

## 🎬 Demo & Preview

- 🌐 Live App: // coming soon.....  
- 🎥 Demo Video: coming soon.....

### 📸 UI Preview

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=SkillSwap+Dashboard" width="80%" />
</p>

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=User+Profile+Page" width="80%" />
</p>

---

## ✨ Core Features

### 👤 Authentication & Profiles
- JWT-based authentication  
- Personalized user profiles  
- Skills offered & skills wanted  

### 🔍 Smart Skill Discovery
- Search users by skills  
- Match users based on interests  

### 🤝 Skill Exchange System
- Send / Accept / Reject requests  
- Track request status  

### 📅 Session Scheduling
- Schedule and manage sessions  
- Track upcoming sessions  

### 💬 Communication
- Messaging enabled after request acceptance  

---

## 🧠 How It Works

```mermaid
flowchart LR
A[Create Profile] --> B[Add Skills]
B --> C[Search Users]
C --> D[Send Request]
D --> E{Accepted?}
E -->|Yes| F[Schedule Session]
E -->|No| G[Explore Others]
F --> H[Learn & Teach]
