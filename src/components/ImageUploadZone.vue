<template>
  <div class="image-upload-zone-wrapper">
    <div
      class="image-upload-zone"
      :class="{ 'is-dragover': isDragOver, 'has-image': !!preview }"
      :style="{ aspectRatio: aspectRatio }"
      @click="triggerInput"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <!-- Preview da imagem -->
      <template v-if="preview">
        <q-img :src="preview" fit="cover" class="full-width full-height upload-img" />
        <div class="upload-overlay">
          <div class="overlay-actions">
            <q-btn
              round
              unelevated
              size="sm"
              icon="photo_camera"
              color="white"
              text-color="dark"
              @click.stop="triggerInput"
            >
              <q-tooltip>Trocar imagem</q-tooltip>
            </q-btn>
            <q-btn
              round
              unelevated
              size="sm"
              icon="delete"
              color="negative"
              class="q-ml-sm"
              @click.stop="handleRemove"
            >
              <q-tooltip>Remover imagem</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>

      <!-- Estado vazio -->
      <div v-else class="upload-placeholder">
        <div class="upload-icon-wrapper" :class="{ 'dragover-icon': isDragOver }">
          <q-icon :name="isDragOver ? 'file_download' : 'cloud_upload'" size="36px" />
        </div>
        <div class="upload-label q-mt-sm">{{ isDragOver ? 'Solte aqui' : label }}</div>
        <div class="upload-hint q-mt-xs">{{ hint }}</div>
        <div class="upload-formats q-mt-xs">PNG, JPG · máx. 5 MB</div>
      </div>

      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        class="hidden-input"
        @change="handleInputChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  preview: { type: String, default: null },
  label: { type: String, default: 'Clique ou arraste uma imagem' },
  hint: { type: String, default: '' },
  aspectRatio: { type: [Number, String], default: 1 },
  maxSize: { type: Number, default: 5 * 1024 * 1024 },
})

const emit = defineEmits(['change', 'remove', 'error'])

const inputRef = ref(null)
const isDragOver = ref(false)

const triggerInput = () => {
  inputRef.value?.click()
}

const validate = (file) => {
  if (!file.type.startsWith('image/')) {
    emit('error', 'Apenas imagens são permitidas.')
    return false
  }
  if (file.size > props.maxSize) {
    emit('error', 'A imagem deve ter no máximo 5MB.')
    return false
  }
  return true
}

const handleInputChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (!validate(file)) {
    event.target.value = ''
    return
  }
  emit('change', file, URL.createObjectURL(file))
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files?.[0]
  if (!file) return
  if (!validate(file)) return
  emit('change', file, URL.createObjectURL(file))
}

const handleRemove = () => {
  emit('remove')
}
</script>

<style lang="scss" scoped>
.image-upload-zone {
  position: relative;
  width: 100%;
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 0, 0.02);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .body--dark & {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
  }

  &:hover:not(.has-image) {
    border-color: var(--q-primary, #1976d2);
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.04);
    transform: translateY(-1px);

    .body--dark & {
      background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.08);
    }
  }

  &.is-dragover {
    border-color: var(--q-primary, #1976d2);
    border-style: solid;
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.08);
    transform: scale(1.01);

    .body--dark & {
      background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.14);
    }
  }

  &.has-image {
    border-style: solid;
    border-color: transparent;
    cursor: default;

    &:hover .upload-overlay {
      opacity: 1;
    }
  }
}

.upload-img {
  border-radius: 10px;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 10px;
}

.overlay-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  text-align: center;
  pointer-events: none;
  user-select: none;
}

.upload-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--q-primary, #1976d2);
  transition: background 0.2s ease;

  .body--dark & {
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.15);
  }

  &.dragover-icon {
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.18);
  }
}

.upload-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--q-primary, #1976d2);
}

.upload-hint {
  font-size: 11px;
  color: #9e9e9e;
}

.upload-formats {
  font-size: 10px;
  color: #bdbdbd;
}

.hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
