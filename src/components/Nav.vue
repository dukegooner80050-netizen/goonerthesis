<template>
  <nav class="navbar navbar-expand-lg custom-navbar sticky-top">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="#">
        <img :src="logo" alt="C.I.M.S logo" class="navbar-logo" />
        <div class="d-flex flex-column">
          <span class="fw-bold">C.I.M.S</span>
          <small class="text-muted">Inventory System</small>
        </div>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Dashboard</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="inventoryDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Inventory
            </a>
            <ul class="dropdown-menu" aria-labelledby="inventoryDropdown">
              <li><a class="dropdown-item" href="#">All Items</a></li>
              <li><a class="dropdown-item" href="#">Add Item</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#">Import</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Categories
            </a>
            <ul class="dropdown-menu" aria-labelledby="categoriesDropdown">
              <li><a class="dropdown-item" href="#">All Categories</a></li>
              <li><a class="dropdown-item" href="#">Add Category</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="reportsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Reports
            </a>
            <ul class="dropdown-menu" aria-labelledby="reportsDropdown">
              <li><a class="dropdown-item" href="#">Sales</a></li>
              <li><a class="dropdown-item" href="#">Stock</a></li>
            </ul>
          </li>
        </ul>

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
// UI-only navbar
</script>

<style scoped>
.custom-navbar {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

/* dark-mode tweak when page background is dark */
:root {
  --navbar-bg: rgba(12, 12, 12, 0.6);
}

.custom-navbar {
  background: var(--navbar-bg, rgba(29, 226, 11, 0.918));
}

.icon {
  font-size: 1.6rem;
}

.navbar-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: inline-block;
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

/* Slight spacing fixes */
.navbar-brand { gap: .5rem; }

@media (prefers-color-scheme: dark) {
  .custom-navbar {
    --navbar-bg: rgba(33, 206, 10, 0.6);
    border-bottom-color: rgba(255,255,255,0.03);
  }
}
</style>