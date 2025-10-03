<template>
  <Transition name="modal">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancel"
    >
      <div class="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div :class="iconContainerClass">
              <i :class="iconClass + ' text-2xl'"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
              <p class="text-gray-600">{{ message }}</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
          <button
            @click="cancel"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            :class="[
              'px-4 py-2 rounded-lg transition-colors font-medium',
              confirmButtonClass
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'warning', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: 'Are you sure?'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  emits: ['confirm', 'cancel'],
  computed: {
    iconClass() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[this.type]
    },
    iconContainerClass() {
      const classes = {
        success: 'bg-green-100 text-green-600',
        error: 'bg-red-100 text-red-600',
        warning: 'bg-yellow-100 text-yellow-600',
        info: 'bg-blue-100 text-blue-600'
      }
      return `p-3 rounded-full ${classes[this.type]}`
    },
    confirmButtonClass() {
      const classes = {
        success: 'bg-green-600 hover:bg-green-700 text-white',
        error: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-blue-600 hover:bg-blue-700 text-white'
      }
      return classes[this.type]
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>