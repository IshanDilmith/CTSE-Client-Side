# 📱 Mobile Parts Shop - Frontend

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

A modern, fast, and responsive React-based storefront for mobile accessories and parts. Built with Vite, Tailwind CSS, and Shadcn UI, this client-side application provides a seamless shopping experience and an integrated admin dashboard.

---

## 🚀 Features

### **🛒 User Experience**
- **Dynamic Product Browsing**: Explore a wide range of mobile accessories with category-based filtering.
- **Detailed Product Pages**: Deep-dive into product specifications, ratings, and availability.
- **Smart Shopping Cart**: Add/remove items, manage quantities, and persist your cart across sessions.
- **Order Tracking**: View order history, track statuses, and see detailed invoice information.
- **User Authentication**: Secure Login and Registration system.
- **User Profile**: Manage personal details and track historical data.

### **🛠️ Admin Panel**
- **Sales Analytics**: Dashboard view of key performance metrics.
- **Product Management**: Create, update, and manage the product catalog.
- **Order Fulfillment**: Review and manage customer orders.
- **Admin Management**: Manage staff permissions and admin accounts.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: React Context & Hooks
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📁 Project Structure

```bash
src/
├── components/      # Reusable UI components (Shadcn + Custom)
│   ├── Auth/        # Protected routes & login components
│   ├── Layout/      # Header, Footer, Sidebar layouts
│   └── ui/          # Core shadcn/ui components
├── context/         # React Context for global state (Cart, User)
├── lib/             # Utility functions (utils.js)
├── pages/           # Page-level components (Home, Cart, Admin, etc.)
├── services/        # Axios service layers for API communication
├── App.jsx          # Main routing & application entry point
└── main.jsx         # React DOM rendering
```

---

## ⚙️ Getting Started

### 1️⃣ Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **pnpm** or **yarn**

### 2️⃣ Installation
```bash
git clone https://github.com/IshanDilmith/CTSE-Client-Side.git
cd CTSE-Client-Side
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root directory and add the following:
```env
VITE_API_BASE_URL=https://your-api-gateway-url.com
```

### 4️⃣ Run locally
```bash
npm run dev
```
By default, the app runs on `http://localhost:5173`.

---

## 🐳 Dockerization

The project includes a `Dockerfile` and `nginx.conf` for production deployments.

### Local Build
```bash
docker build -t mobile-parts-frontend .
docker run -p 80:80 mobile-parts-frontend
```

---
