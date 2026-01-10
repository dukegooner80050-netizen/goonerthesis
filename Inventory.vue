<template>
  <div>
    <form @submit.prevent="addItem">
      <input
        v-model.trim="newItem.name"
        placeholder="Item name"
        required
      />
      <input
        v-model.number="newItem.quantity"
        type="number"
        min="1"
        placeholder="Qty"
        required
      />

      <!-- Status dropdown -->
      <select v-model="newItem.status">
        <option disabled value="">Select status</option>
        <option v-for="s in statusOptions" :key="s" :value="s">
          {{ s }}
        </option>
      </select>

      <button type="submit">Add Item</button>
    </form>

    <table v-if="items.length">
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
              v-model.trim="item.name"
              @keyup.enter="item.isEditingName = false"
              @blur="item.isEditingName = false"
            />
          </td>

          <td>
            <input
              type="number"
              v-model.number="item.quantity"
              min="1"
            />
          </td>

          <td>
            <select v-model="item.status">
              <option disabled value="">Select status</option>
              <option v-for="s in statusOptions" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </td>

          <td>
            <div class="actions">
              <button
                type="button"
                @click="item.isEditingName = !item.isEditingName"
              >
                {{ item.isEditingName ? 'Save' : 'Edit' }}
              </button>
              <button
                type="button"
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
