<template>
  <q-input
    v-bind="$attrs"
    :model-value="displayValue"
    inputmode="numeric"
    prefix="R$"
    @update:model-value="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: null },
})

const emit = defineEmits(['update:modelValue'])

const displayValue = ref('')

// Convert a decimal number to "1.234,56" display string
function toDisplay(val) {
  if (val === null || val === undefined || val === '') return ''
  const cents = Math.round(Number(val) * 100)
  if (isNaN(cents)) return ''
  const padded = String(Math.abs(cents)).padStart(3, '0')
  const intPart = parseInt(padded.slice(0, -2) || '0', 10)
  const decPart = padded.slice(-2)
  return `${intPart.toLocaleString('pt-BR')},${decPart}`
}

// Sync display when modelValue changes externally (e.g., on load)
watch(
  () => props.modelValue,
  (val) => {
    displayValue.value = toDisplay(val)
  },
  { immediate: true }
)

function handleInput(val) {
  // Keep only digits
  const digits = String(val ?? '').replace(/\D/g, '')

  if (!digits) {
    displayValue.value = ''
    emit('update:modelValue', null)
    return
  }

  // Remove leading zeros, keep at least one digit
  const stripped = digits.replace(/^0+/, '') || '0'

  // Build formatted string: last 2 digits = cents
  const padded = stripped.padStart(3, '0')
  const intPart = parseInt(padded.slice(0, -2) || '0', 10)
  const decPart = padded.slice(-2)
  displayValue.value = `${intPart.toLocaleString('pt-BR')},${decPart}`

  const numValue = parseInt(stripped, 10) / 100
  emit('update:modelValue', numValue)
}

function handleFocus(event) {
  // Select all text on focus for easy replacement
  event.target?.select()
}

function handleBlur() {
  // Reformat on blur to ensure consistent display
  displayValue.value = toDisplay(props.modelValue)
}
</script>
