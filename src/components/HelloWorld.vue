<template>
  <div>
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
        <!-- Status dropdown -->
        <select class="form-select" v-model="newItem.status">
          <option disabled value="">Select status</option>
          <option v-for="s in statusOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>

      <div class="col-md-2">
        <button class="btn btn-primary w-100" type="submit">Add Item</button>
      </div>
    </form>

    <table v-if="items.length" class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Status</th>
          <th>Actions</th>
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
              @keyup.enter="item.isEditingName = false"
              @blur="item.isEditingName = false"
            />
          </td>

          <td>
            <input
              class="form-control"
              type="number"
              v-model.number="item.quantity"
              min="1"
            />
          </td>

          <td>
            <select class="form-select" v-model="item.status">
              <option disabled value="">Select status</option>
              <option v-for="s in statusOptions" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </td>

          <td>
            <div class="actions d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                @click="item.isEditingName = !item.isEditingName"
              >
                {{ item.isEditingName ? 'Save' : 'Edit' }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="removeItem(index)"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No inventory items.</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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

function defaultNewItem() {
  return {
    name: '',
    quantity: 1,
    status: ''
  }
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
  if (!newItem.value.name.trim() || !newItem.value.status) return

  items.value.push({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
    name: newItem.value.name.trim(),
    quantity: newItem.value.quantity || 1,
    status: newItem.value.status,
    isEditingName: false
  })

  newItem.value = defaultNewItem()
}

function removeItem(index) {
  items.value.splice(index, 1)
}

watch(
  items,
  (val) => {
    saveItems(val)
  },
  { deep: true }
)
</script>

<style scoped>
form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

input,
select {
  padding: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 6px;
}

button {
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 4px;
}
</style>