<template>
  <div class="bg-white border-2 border-gray-300 rounded-lg p-4 mb-3 hover:shadow-lg transition-all workflow-block-item">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3 flex-1">
        <i class="fas fa-grip-vertical drag-handle text-gray-400 cursor-move hover:text-gray-600"></i>
        <i :class="getIconClasses()"></i>
        <h3 class="font-semibold text-gray-800">{{ blockConfig.name }}</h3>
        <!-- Validation Warning Badge -->
        <span v-if="!isValid" class="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
          <i class="fas fa-exclamation-circle"></i> Incomplete
        </span>
        <span v-else class="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
          <i class="fas fa-check-circle"></i> Valid
        </span>
      </div>
      <button
        @click="$emit('remove')"
        class="text-red-500 hover:text-red-700 transition-colors p-1"
        title="Remove block"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- Email Block -->
    <div v-if="block.type === 'send-email'" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fas fa-heading mr-1"></i>Subject <span class="text-red-500">*</span>
        </label>
        <input
          v-model="block.props.subject"
          type="text"
          placeholder="Enter email subject"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
          @blur="validateField('subject')"
          @input="validateField('subject')"
        />
        <p v-if="errors.subject" class="text-red-500 text-xs mt-1">
          <i class="fas fa-exclamation-triangle mr-1"></i>{{ errors.subject }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fas fa-align-left mr-1"></i>Body <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="block.props.body"
          rows="3"
          placeholder="Enter email body"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            errors.body ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
          @blur="validateField('body')"
          @input="validateField('body')"
        ></textarea>
        <p v-if="errors.body" class="text-red-500 text-xs mt-1">
          <i class="fas fa-exclamation-triangle mr-1"></i>{{ errors.body }}
        </p>
      </div>
    </div>

    <!-- Wait Block -->
    <div v-if="block.type === 'wait'" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fas fa-calendar-day mr-1"></i>Number of Days <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="block.props.days"
          type="number"
          min="1"
          max="365"
          placeholder="Enter days (1-365)"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            errors.days ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
          ]"
          @blur="validateField('days')"
          @input="validateField('days')"
        />
        <p v-if="errors.days" class="text-red-500 text-xs mt-1">
          <i class="fas fa-exclamation-triangle mr-1"></i>{{ errors.days }}
        </p>
        <p v-else class="text-gray-500 text-xs mt-1">
          <i class="fas fa-info-circle mr-1"></i>Must be between 1 and 365 days
        </p>
      </div>
    </div>

    <!-- WhatsApp Block -->
    <div v-if="block.type === 'send-whatsapp'" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fab fa-whatsapp mr-1"></i>Phone Number <span class="text-red-500">*</span>
        </label>
        <input
          v-model="block.props.phone"
          type="tel"
          placeholder="+1234567890"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          ]"
          @blur="validateField('phone')"
          @input="validateField('phone')"
        />
        <p v-if="errors.phone" class="text-red-500 text-xs mt-1">
          <i class="fas fa-exclamation-triangle mr-1"></i>{{ errors.phone }}
        </p>
        <p v-else class="text-gray-500 text-xs mt-1">
          <i class="fas fa-info-circle mr-1"></i>Format: +[country code][number] (e.g., +1234567890)
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fas fa-comment mr-1"></i>Message <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="block.props.message"
          rows="3"
          placeholder="Enter WhatsApp message"
          maxlength="1000"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          ]"
          @blur="validateField('message')"
          @input="validateField('message')"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p v-if="errors.message" class="text-red-500 text-xs">
            <i class="fas fa-exclamation-triangle mr-1"></i>{{ errors.message }}
          </p>
          <p v-else class="text-gray-500 text-xs">
            {{ block.props.message?.length || 0 }}/1000 characters
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkflowBlock',
  props: {
    block: {
      type: Object,
      required: true
    },
    blockConfig: {
      type: Object,
      required: true
    }
  },
  emits: ['remove', 'validation-change'],
  data() {
    return {
      errors: {}
    }
  },
  computed: {
    isValid() {
      if (this.block.type === 'send-email') {
        return !!(this.block.props.subject?.trim() && 
                 this.block.props.subject.length >= 3 &&
                 this.block.props.body?.trim() && 
                 this.block.props.body.length >= 10)
      } else if (this.block.type === 'wait') {
        return this.block.props.days >= 1 && 
               this.block.props.days <= 365 && 
               Number.isInteger(this.block.props.days)
      } else if (this.block.type === 'send-whatsapp') {
        return this.isValidPhone(this.block.props.phone) && 
               this.block.props.message?.trim() &&
               this.block.props.message.length >= 1
      }
      return false
    }
  },
  watch: {
    isValid: {
      handler(newVal) {
        this.$emit('validation-change', { id: this.block.id, isValid: newVal })
      },
      immediate: true
    },
    'block.props': {
      handler() {
        // Re-emit validation when props change
        this.$nextTick(() => {
          this.$emit('validation-change', { id: this.block.id, isValid: this.isValid })
        })
      },
      deep: true
    }
  },
  mounted() {
    // Emit initial validation state
    this.$emit('validation-change', { id: this.block.id, isValid: this.isValid })
  },
  methods: {
    getIconClasses() {
      const colorMap = {
        blue: 'text-blue-500',
        yellow: 'text-yellow-500',
        green: 'text-green-500'
      }
      const prefix = this.blockConfig.iconPrefix || 'fas'
      return `${prefix} ${this.blockConfig.icon} ${colorMap[this.blockConfig.color]} text-xl`
    },
    validateField(field) {
      this.errors = { ...this.errors }
      
      if (this.block.type === 'send-email') {
        if (field === 'subject') {
          if (!this.block.props.subject?.trim()) {
            this.errors.subject = 'Subject is required'
          } else if (this.block.props.subject.length < 3) {
            this.errors.subject = 'Subject must be at least 3 characters'
          } else if (this.block.props.subject.length > 200) {
            this.errors.subject = 'Subject must be less than 200 characters'
          } else {
            delete this.errors.subject
          }
        }
        if (field === 'body') {
          if (!this.block.props.body?.trim()) {
            this.errors.body = 'Body is required'
          } else if (this.block.props.body.length < 10) {
            this.errors.body = 'Body must be at least 10 characters'
          } else {
            delete this.errors.body
          }
        }
      } else if (this.block.type === 'wait') {
        if (field === 'days') {
          if (!this.block.props.days) {
            this.errors.days = 'Number of days is required'
          } else if (this.block.props.days < 1) {
            this.errors.days = 'Must be at least 1 day'
          } else if (this.block.props.days > 365) {
            this.errors.days = 'Must be less than 365 days'
          } else if (!Number.isInteger(this.block.props.days)) {
            this.errors.days = 'Must be a whole number'
          } else {
            delete this.errors.days
          }
        }
      } else if (this.block.type === 'send-whatsapp') {
        if (field === 'phone') {
          if (!this.block.props.phone?.trim()) {
            this.errors.phone = 'Phone number is required'
          } else if (!this.isValidPhone(this.block.props.phone)) {
            this.errors.phone = 'Invalid phone format. Use +[country code][number]'
          } else {
            delete this.errors.phone
          }
        }
        if (field === 'message') {
          if (!this.block.props.message?.trim()) {
            this.errors.message = 'Message is required'
          } else if (this.block.props.message.length < 1) {
            this.errors.message = 'Message cannot be empty'
          } else if (this.block.props.message.length > 1000) {
            this.errors.message = 'Message must be less than 1000 characters'
          } else {
            delete this.errors.message
          }
        }
      }
    },
    isValidPhone(phone) {
      const phoneRegex = /^\+[1-9]\d{7,14}$/
      return phoneRegex.test(phone?.trim())
    }
  }
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
</style>