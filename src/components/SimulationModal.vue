<template>
  <Transition name="modal">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-play-circle mr-2 text-purple-500"></i>
            Workflow Simulation
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto flex-1">
          <p v-if="workflow.length === 0" class="text-center text-gray-500 py-8">
            <i class="fas fa-inbox text-4xl mb-3 block"></i>
            No blocks in workflow
          </p>
          
          <div v-else class="space-y-4">
            <div
              v-for="(step, index) in simulationSteps"
              :key="index"
              :class="[
                'flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-500',
                index < currentStep ? 'border-green-500 bg-green-50' :
                index === currentStep && isPlaying ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' :
                'border-gray-200 bg-gray-50'
              ]"
            >
              <!-- Icon -->
              <div :class="getStepColorClass(step.color) + ' p-3 rounded-lg text-white flex-shrink-0'">
                <i :class="getStepIconClass(step)"></i>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="font-semibold text-gray-800">
                    Step {{ index + 1 }}: {{ step.name }}
                  </span>
                  <span class="text-xs text-white bg-gray-600 px-2 py-1 rounded">
                    {{ step.timing }}
                  </span>
                  <span v-if="index < currentStep" class="text-green-600 text-sm font-medium">
                    <i class="fas fa-check-circle"></i> Completed
                  </span>
                  <span v-if="index === currentStep && isPlaying" class="text-blue-600 text-sm font-medium animate-pulse">
                    <i class="fas fa-circle"></i> Running
                  </span>
                </div>
                <p class="text-gray-600 text-sm">{{ step.description }}</p>
              </div>
            </div>

            <!-- Summary -->
            <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p class="text-sm text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>Total Duration:</strong> {{ totalDays }} day{{ totalDays !== 1 ? 's' : '' }}
              </p>
            </div>

            <!-- Completion Message -->
            <div v-if="!isPlaying && currentStep >= workflow.length" class="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p class="text-sm text-green-800">
                <i class="fas fa-check-circle mr-2"></i>
                <strong>Simulation Complete!</strong> All {{ workflow.length }} steps executed successfully.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer with Play Button -->
        <div class="p-6 border-t border-gray-200">
          <button
            @click="handlePlay"
            :disabled="workflow.length === 0 || isPlaying"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            <svg v-if="!isPlaying" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isPlaying ? 'Running Simulation...' : currentStep >= workflow.length ? 'Replay Simulation' : 'Start Simulation' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'SimulationModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    workflow: {
      type: Array,
      required: true
    },
    blockTypes: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      currentStep: 0,
      isPlaying: false,
      timer: null
    }
  },
  computed: {
    simulationSteps() {
      let currentDay = 0
      return this.workflow.map(block => {
        const config = Object.values(this.blockTypes).find(b => b.id === block.type)
        let step = {
          name: config.name,
          icon: config.icon,
          color: config.color,
          timing: `Day ${currentDay}`,
          description: ''
        }

        if (block.type === 'send-email') {
          step.description = `Send email with subject: "${block.props.subject || 'No subject'}" - Body: "${block.props.body || 'No body'}"`
        } else if (block.type === 'wait') {
          step.description = `Wait for ${block.props.days} day(s) before proceeding to next step`
          currentDay += block.props.days
        } else if (block.type === 'send-whatsapp') {
          step.description = `Send WhatsApp to ${block.props.phone || 'No phone'}: "${block.props.message || 'No message'}"`
        }

        return step
      })
    },
    totalDays() {
      return this.workflow.reduce((total, block) => {
        if (block.type === 'wait') {
          return total + (block.props.days || 0)
        }
        return total
      }, 0)
    }
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        this.resetSimulation()
      }
    }
  },
  methods: {
    getStepIconClass(step) {
      return `fas ${step.icon} text-lg`
    },
    getStepColorClass(color) {
      const colorMap = {
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500'
      }
      return colorMap[color] || 'bg-gray-500'
    },
    handlePlay() {
      this.resetSimulation()
      this.isPlaying = true
      this.runSimulation()
    },
    async runSimulation() {
      for (let i = 0; i < this.workflow.length; i++) {
        if (!this.isPlaying) break // Allow stopping mid-simulation
        
        this.currentStep = i
        
        // Wait for 1.5 seconds before moving to next step
        await new Promise(resolve => {
          this.timer = setTimeout(resolve, 1500)
        })
      }
      
      // Mark all steps as complete
      this.currentStep = this.workflow.length
      this.isPlaying = false
    },
    resetSimulation() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.currentStep = 0
      this.isPlaying = false
    }
  },
  beforeUnmount() {
    this.resetSimulation()
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>