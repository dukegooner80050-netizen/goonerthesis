<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend)

/* CONSTANTS */
const STORAGE_KEY = 'inventory-items'

const categories = [
  'Uniforms',
  'Office Supplies',
  'School Equipments',
]

const statusOptions = [
  'In stock',
  'Low stock',
  'Out of stock',
  'Reserved',
  'Ordered'
]

/* STATE */
const items = ref([])
const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  id: null,
  name: '',
  category: '',
  status: '',
  quantity: 1,
  price: 0
})

/* CHART */
const statusChart = ref(null)
let chartInstance = null

/* LOAD */
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  items.value = saved ? JSON.parse(saved) : []
  renderChart()
})

/* AUTO-SYNC ACROSS PAGES */
function syncItems(event) {
  if (event.key === STORAGE_KEY) {
    items.value = event.newValue
      ? JSON.parse(event.newValue)
      : []
  }
}

onMounted(() => {
  window.addEventListener('storage', syncItems)
})

onUnmounted(() => {
  window.removeEventListener('storage', syncItems)
})


/* SAVE */
watch(
  items,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    renderChart()
  },
  { deep: true }
)

/* COMPUTED */
const filteredItems = computed(() =>
  items.value.filter(i =>
    i.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const totalItems = computed(() => items.value.length)

const lowStockCount = computed(() =>
  items.value.filter(i => i.status === 'Low stock').length
)

const categoryCount = computed(() =>
  new Set(items.value.map(i => i.category)).size
)

const totalQuantity = computed(() =>
  items.value.reduce((total, item) => total + Number(item.quantity || 0), 0)
)

const totalInventoryValue = computed(() =>
  items.value.reduce(
    (total, item) =>
      total + (Number(item.quantity || 0) * Number(item.price || 0)),
    0
  )
)

const formattedInventoryValue = computed(() =>
  totalInventoryValue.value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'PHP'
  })
)

/* CHART DATA */
function getStatusData() {
  const counts = {}
  statusOptions.forEach(s => (counts[s] = 0))

  items.value.forEach(item => {
    counts[item.status] += item.quantity
  })

  return counts
}

function renderChart() {
  if (!statusChart.value) return

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
            '#198754',
            '#ffc107',
            '#dc3545',
            '#0dcaf0',
            '#6c757d'
          ]
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

/* ACTIONS */
function openAddModal() {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    category: '',
    status: '',
    quantity: 1,
    price: 0
  }
  showModal.value = true
}

function openEditModal(item) {
  isEditing.value = true
  form.value = { ...item }
  showModal.value = true
}

function saveItem() {
  if (!form.value.name || !form.value.category || !form.value.status) return

  if (isEditing.value) {
    const index = items.value.findIndex(i => i.id === form.value.id)
    items.value[index] = { ...form.value }
  } else {
    items.value.push({
      ...form.value,
      id: Date.now()
    })
  }

  showModal.value = false
}

function deleteItem(id) {
  items.value = items.value.filter(i => i.id !== id)
}
</script>

<template>
  <div class="inventory-wrapper">
    <div class="row">

      <!-- SUMMARY + CHART -->
      <div class="col-lg-3 mb-3">
        <div class="card shadow-sm mb-3">
          <div class="card-header fw-bold">Summary</div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>Total Items</span>
              <strong>{{ totalItems }}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Low Stock</span>
              <strong class="text-warning">{{ lowStockCount }}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Categories</span>
              <strong>{{ categoryCount }}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Total Quantity</span>
              <strong>{{ totalQuantity }}</strong>
            </div>
            <hr class="my-2" />
            <div class="d-flex justify-content-between">
              <span>Total Inventory Value</span>
              <strong>{{ formattedInventoryValue }}</strong>
            </div>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-header fw-bold text-center">
            Inventory by Status
          </div>
          <div class="card-body">
            <canvas ref="statusChart"></canvas>
          </div>
        </div>
      </div>

      <!-- INVENTORY TABLE -->
      <div class="col-lg-9">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <strong>Inventory</strong>

            <div class="d-flex gap-2">
              <input
                class="form-control form-control-sm"
                placeholder="Search item..."
                v-model="search"
                style="width: 200px"
              />
              <button class="btn btn-sm btn-primary" @click="openAddModal">
                + Add Item
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th style="width: 140px">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.price }}</td>
                  <td class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" @click="openEditModal(item)">
                      Edit
                    </button>
                    <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr v-if="!filteredItems.length">
                  <td colspan="6" class="text-center text-muted py-3">
                    No items found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-backdrop-custom">
      <div class="modal-card">
        <h5>{{ isEditing ? 'Edit Item' : 'Add Item' }}</h5>

        <input class="form-control mb-2" placeholder="Item name" v-model="form.name" />

        <select class="form-select mb-2" v-model="form.category">
          <option disabled value="">Select category</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>

        <select class="form-select mb-2" v-model="form.status">
          <option disabled value="">Select status</option>
          <option v-for="s in statusOptions" :key="s">{{ s }}</option>
        </select>

        <input class="form-control mb-2" type="number" min="1" v-model.number="form.quantity" />
        <input class="form-control mb-3" type="number" min="0" v-model.number="form.price" />

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary btn-sm" @click="showModal = false">Cancel</button>
          <button class="btn btn-primary btn-sm" @click="saveItem">Save</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.inventory-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #fff;
  padding: 1rem;
  width: 320px;
  border-radius: 8px;
}
</style>
