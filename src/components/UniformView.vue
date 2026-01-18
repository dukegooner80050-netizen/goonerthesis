<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

/* CONSTANTS */
const STORAGE_KEY = 'inventory-items'
const route = useRoute()

/* STATE */
const categoryName = route.params.name
const items = ref([])

const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  id: null,
  name: '',
  size: '',
  status: 'In stock',
  quantity: 1,
  price: 0
})

/* UNIFORM SIZES */
const sizeOptions = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL'
]

const statusOptions = [
  'In stock',
  'Low stock',
  'Out of stock',
  'Reserved',
  'Ordered'
]

/* LOAD DATA */
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  items.value = saved ? JSON.parse(saved) : []
})

/* AUTO-SYNC ACROSS PAGES */
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    items.value = event.newValue
      ? JSON.parse(event.newValue)
      : []
  }
})

/* FILTER BY CATEGORY */
const categoryItems = computed(() =>
  items.value.filter(i => i.category === categoryName)
)

/* SUMMARY */
const totalItems = computed(() => categoryItems.value.length)

const totalQuantity = computed(() =>
  categoryItems.value.reduce((sum, i) => sum + Number(i.quantity || 0), 0)
)

const lowStockCount = computed(() =>
  categoryItems.value.filter(i => i.status === 'Low stock').length
)

const totalValue = computed(() =>
  categoryItems.value.reduce(
    (sum, i) => sum + Number(i.quantity || 0) * Number(i.price || 0),
    0
  )
)

const formattedTotalValue = computed(() =>
  totalValue.value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'PHP'
  })
)

/* MODAL ACTIONS */
function openAddModal() {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    size: '',
    status: 'In stock',
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
  if (
    !form.value.name ||
    !form.value.size ||
    !form.value.status
  ) {
    return
  }

  if (isEditing.value) {
    const index = items.value.findIndex(i => i.id === form.value.id)
    items.value[index] = { ...form.value }
  } else {
    items.value.push({
      ...form.value,
      id: Date.now(),
      category: categoryName
    })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  showModal.value = false
}

</script>

<template>
  <div class="container mt-4">

    <!-- TITLE -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold mb-0">Uniforms</h4>
      <button class="btn btn-sm btn-primary" @click="openAddModal">
        + Add Item
      </button>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="row mb-3">
      <div class="col-md-3" v-for="(label, i) in [
        ['Items', totalItems],
        ['Quantity', totalQuantity],
        ['Low Stock', lowStockCount],
        ['Total Value', formattedTotalValue]
      ]" :key="i">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted">{{ label[0] }}</div>
            <h5 :class="label[0] === 'Low Stock' ? 'text-warning' : ''">
              {{ label[1] }}
            </h5>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Item</th>
              <th>Size</th>
              <th>Status</th>
              <th>Qty</th>
              <th>Price</th>
              <th style="width: 100px">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in categoryItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.size || '-' }}</td>

              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-success': item.status === 'In stock',
                    'bg-warning text-dark': item.status === 'Low stock',
                    'bg-danger': item.status === 'Out of stock',
                    'bg-info text-dark': item.status === 'Reserved',
                    'bg-secondary': item.status === 'Ordered'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>

              <td>{{ item.quantity }}</td>

              <td>
                {{ Number(item.price).toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'PHP'
                }) }}
              </td>

              <td>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="openEditModal(item)"
                >
                  Edit
                </button>
              </td>
            </tr>

            <tr v-if="!categoryItems.length">
              <td colspan="6" class="text-center text-muted py-3">
                No items found in this category
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-backdrop-custom">
      <div class="modal-card">
        <h5 class="mb-3">
          {{ isEditing ? 'Edit Item' : 'Add Item' }}
        </h5>

        <input class="form-control mb-2" placeholder="Item name" v-model="form.name" />
        <select class="form-select mb-2" v-model="form.size">
        <option disabled value="">Select size</option>
        <option v-for="s in sizeOptions" :key="s">{{ s }}</option>
        </select>

        <select class="form-select mb-2" v-model="form.status">
          <option disabled value="">Select status</option>
          <option v-for="s in statusOptions" :key="s">
            {{ s }}
          </option>
        </select>

        <input class="form-control mb-2" type="number" min="1" v-model.number="form.quantity" />
        <input class="form-control mb-3" type="number" min="0" v-model.number="form.price" />

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary btn-sm" @click="showModal = false">
            Cancel
          </button>
          <button class="btn btn-primary btn-sm" @click="saveItem">
            Save
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
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
