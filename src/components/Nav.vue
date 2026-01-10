<template>
  <nav class="navbar">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <div class="icon">📦</div>
        <div class="title">
          <span class="main">Inventory System</span>
          <span class="sub">Management Dashboard</span>
        </div>
      </div>

      <!-- Navigation -->
      <ul class="menu">
        <li class="active">Dashboard</li>
        <li>Inventory</li>
        <li>Categories</li>
        <li>Reports</li>
      </ul>

      <!-- User Profile -->
      <div class="profile">
        <div class="avatar">A</div>
        <div class="user">
          <span class="name">Admin</span>
          <span class="role">Administrator</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// UI-only navbar
</script>

<style scoped>
/* Glassmorphism Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon {
  font-size: 1.8rem;
}

.title {
  display: flex;
  flex-direction: column;
}

.title .main {
  font-weight: 700;
  font-size: 1.1rem;
}

.title .sub {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Menu */
.menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  font-weight: 500;
}

.menu li {
  cursor: pointer;
  position: relative;
  color: #374151;
}

.menu li::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -6px;
  left: 0;
  background: linear-gradient(to right, #2563eb, #3b82f6);
  transition: width 0.3s ease;
}

.menu li:hover::after,
.menu .active::after {
  width: 100%;
}

.menu .active {
  color: #2563eb;
}

/* Profile */
.profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user {
  display: flex;
  flex-direction: column;
}

.user .name {
  font-size: 0.9rem;
  font-weight: 600;
}

.user .role {
  font-size: 0.7rem;
  color: #6b7280;
}
</style>