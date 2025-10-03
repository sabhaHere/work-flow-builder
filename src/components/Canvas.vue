<template>
  <div class="flex-1 p-6 overflow-y-auto bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <!-- Header with Actions -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-project-diagram mr-2"></i>Workflow Canvas
        </h2>
        <div class="flex gap-3">
          <button
            @click="$emit('clear')"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="workflow.length === 0"
            title="Clear all blocks"
          >
            <i class="fas fa-trash-alt mr-2"></i>Clear All
          </button>
          <button
            @click="$emit('simulate')"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="workflow.length === 0"
            title="Simulate workflow"
          >
            <i class="fas fa-play mr-2"></i>Simulate
          </button>
          <button
            @click="$emit('export')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="workflow.length === 0"
            title="Export as JSON"
          >
            <i class="fas fa-download mr-2"></i>Export JSON
          </button>
        </div>
      </div>

      <!-- Canvas Area -->
      <div
        ref="canvasDropzone"
        class="min-h-96 bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 shadow-inner"
      >
        <div v-if="workflow.length === 0" class="text-center text-gray-400 py-20">
          <i class="fas fa-mouse-pointer text-5xl mb-4"></i>
          <p class="text-lg font-medium">Drag blocks here to start building your workflow</p>
          <p class="text-sm mt-2">Add blocks from the sidebar on the left</p>
        </div>
        
        <div v-else ref="workflowBlocks" class="space-y-3">
          <WorkflowBlock
            v-for="(block, index) in workflow"
            :key="block.id"
            :block="block"
            :block-config="getBlockConfig(block.type)"
            @remove="$emit('remove-block', index)"
          />
        </div>
      </div>

      <!-- Block Count -->
      <div v-if="workflow.length > 0" class="mt-4 text-center text-gray-600">
        <i class="fas fa-info-circle mr-1"></i>
        {{ workflow.length }} block{{ workflow.length !== 1 ? 's' : '' }} in workflow
      </div>
    </div>
  </div>
</template>

<script>
import WorkflowBlock from './WorkFlow.vue'

export default {
  name: 'Canvas',
  components: {
    WorkflowBlock
  },
  props: {
    workflow: {
      type: Array,
      required: true
    },
    blockTypes: {
      type: Object,
      required: true
    }
  },
  emits: ['clear', 'simulate', 'export', 'remove-block'],
  methods: {
    getBlockConfig(type) {
      return Object.values(this.blockTypes).find(b => b.id === type)
    }
  }
}
</script>