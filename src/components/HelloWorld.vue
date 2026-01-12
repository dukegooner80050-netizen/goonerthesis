<template>
  <div class="container-fluid">
    <div class="row">
      <!-- LEFT SIDE: FORM + TABLE -->
      <div class="col-lg-9">
        <!-- ADD ITEM FORM -->
        <form @submit.prevent="addItem" class="row g-2 align-items-center mb-3">
          <div class="col-md-5">
            <input
              class="form-control"
              v-model.trim="newItem.name"
              placeholder="Item name"
              required
            />
          </div>

          <div class="col-md-2">
            <input
              class="form-control"
              v-model.number="newItem.quantity"
              type="number"
              min="1"
              placeholder="Qty"
              required
            />
          </div>

          <div class="col-md-3">
            <select class="form-select" v-model="newItem.status" required>
              <option disabled value="">Select status</option>
              <option v-for="s in statusOptions" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </div>

          <div class="col-md-2">
            <button class="btn btn-primary w-100" type="submit">
              Add Item
            </button>
          </div>
        </form>

        <!-- TABLE -->
        <!-- TABLE -->
<div v-if="items.length" class="card shadow-sm p-2">
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Status</th>
          <th style="width: 130px;">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in items" :key="item.id">
          <td>
            <span v-if="!item.isEditingName">{{ item.name }}</span>
            <input
              v-else
              class="form-control"
              v-model.trim="item.name"
              @blur="item.isEditingName = false"
              @keyup.enter="item.isEditingName = false"
            />
          </td>

          <td>
            <input
              class="form-control"
              type="number"
              v-model.number="item.quantity"
              min="1"
              style="max-width: 90px;"
            />
          </td>

          <td>
            <select
              class="form-select"
              v-model="item.status"
              style="max-width: 160px;"
            >
              <option v-for="s in statusOptions" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </td>

          <td class="d-flex gap-2">
            <button
              class="btn btn-sm btn-primary btn-sm"
              @click="item.isEditingName = !item.isEditingName"
            >
              {{ item.isEditingName ? 'Save' : 'Edit' }}
            </button>

            <button
              class="btn btn-sm btn-danger btn-sm"
              @click="removeItem(index)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<p v-else>No inventory items.</p>
</div>

      <!-- PIE CHART AT RIGHT SIDE -->
      <div class="col-lg-3">
        <div class="chart-card">
          <h6 class="text-center mb-3">Inventory by Status</h6>
          <canvas ref="statusChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const STORAGE_KEY = 'inventory-items'

const statusOptions = [
  'In stock',
  'Low stock',
  'Out of stock',
  'Reserved',
  'Ordered'
]

const items = ref(loadItems())
const newItem = ref(defaultNewItem())

const statusChart = ref(null)
let chartInstance = null

function defaultNewItem() {
  return { name: '', quantity: 1, status: '' }
}

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveItems(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

function addItem() {
  if (!newItem.value.name || !newItem.value.status) return

  items.value.push({
    id: crypto.randomUUID?.() || Date.now(),
    name: newItem.value.name,
    quantity: newItem.value.quantity,
    status: newItem.value.status,
    isEditingName: false
  })

  newItem.value = defaultNewItem()
}

function removeItem(index) {
  items.value.splice(index, 1)
}

function getStatusData() {
  const counts = {}
  statusOptions.forEach(s => (counts[s] = 0))

  items.value.forEach(item => {
    counts[item.status] += item.quantity
  })

  return counts
}

function renderChart() {
  const data = getStatusData()

  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(statusChart.value, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
           backgroundColor: [
      '#198754', // In stock (green)
      '#ffc107', // Low stock (yellow)
      '#dc3545', // Out of stock (red)
      '#0dcaf0', // Reserved (blue)
      '#6c757d'  // Ordered (gray)
        ]
        }
      ]
    }
  })
}

onMounted(renderChart)

watch(
  items,
  (val) => {
    saveItems(val)
    renderChart()
  },
  { deep: true }
)
</script>

<style scoped>
.chart-card {
  font-weight: 600;
  color: #495057;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table td,
.table th {
    font-weight: 600;
    color: #495057;
}

.table .form-control,
.table .form-select {
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>
