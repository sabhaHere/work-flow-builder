<template>
  <Transition name="toast">
    <div
      v-if="show"
      :class="[
        'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-80 max-w-md',
        typeClasses
      ]"
    >
      <i :class="iconClass + ' text-2xl'"></i>
      <div class="flex-1">
        <h4 v-if="title" class="font-semibold mb-1">{{ title }}</h4>
        <p class="text-sm">{{ message }}</p>
      </div>
      <button
        v-if="showClose"
        @click="close"
        class="ml-2 hover:opacity-70 transition-opacity"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'info', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  computed: {
    typeClasses() {
      const classes = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
      }
      return classes[this.type]
    },
    iconClass() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[this.type]
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.duration > 0) {
        setTimeout(() => {
          this.close()
        }, this.duration)
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>