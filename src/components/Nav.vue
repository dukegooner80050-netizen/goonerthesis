<template>
  <nav class="navbar navbar-expand-lg custom-navbar sticky-top">
    <div class="container">

      <!-- BRAND -->
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <img :src="logo" alt="C.I.M.S logo" class="navbar-logo" />
        <div class="d-flex flex-column">
          <span class="fw-bold">C.I.M.S</span>
          <small class="text-muted">Inventory System</small>
        </div>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <!-- DASHBOARD -->
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              Dashboard
            </router-link>
          </li>

          <!-- INVENTORY -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              Inventory
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/inventory">
                  All Items
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/inventory">
                  Add Item
                </router-link>
              </li>
            </ul>
          </li>

          <!-- CATEGORIES (OPTION 2 – SEPARATE PAGES) -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              Categories
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/categories/Uniforms">
                  Uniforms
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/categories/Office Supplies">
                  Office Supplies
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/categories/School Equipments">
                  School Equipments
                </router-link>
              </li>
            </ul>
          </li>

          <!-- REPORTS (STUB PAGES OK FOR STUDENT PROJECT) -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              Reports
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Sales</a></li>
              <li><a class="dropdown-item" href="#">Stock</a></li>
            </ul>
          </li>

          <!-- ACTIVITY -->
          <li class="nav-item">
            <a class="nav-link" href="#">
              ACTIVITY
            </a>
          </li>
        </ul>

        <!-- USER -->
        <div class="d-flex align-items-center gap-3">
          <div class="avatar">A</div>
          <div class="d-none d-sm-flex flex-column">
            <span class="fw-semibold">Admin</span>
            <small class="text-muted">Administrator</small>
          </div>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import logo from '../assets/logoCC.png'
</script>

<style scoped>
.custom-navbar {
  backdrop-filter: blur(12px);
  background: rgba(29, 226, 11, 0.918);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.navbar-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
</style>
