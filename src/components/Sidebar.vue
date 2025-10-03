<template>
  <div class="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
    <h2 class="text-xl font-bold text-gray-800 mb-4">
      <i class="fas fa-cubes mr-2"></i>Block Types
    </h2>
    <div class="space-y-3" ref="blockList">
      <div
        v-for="block in blockTypes"
        :key="block.id"
        :data-block-type="block.id"
        class="p-4 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-gray-400 transition-all hover:shadow-md group"
      >
        <div class="flex items-center gap-3">
          <i :class="getIconClass(block)"></i>
          <span class="font-medium text-gray-700">{{ block.name }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          {{ getBlockDescription(block.id) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    blockTypes: {
      type: Object,
      required: true
    }
  },
  methods: {
    getIconClass(block) {
      const colorClasses = {
        blue: 'text-blue-500',
        yellow: 'text-yellow-500',
        green: 'text-green-500'
      }
      return `fas ${block.icon} ${colorClasses[block.color]} text-xl group-hover:scale-110 transition-transform`
    },
    getBlockDescription(blockId) {
      const descriptions = {
        'send-email': 'Send an email with custom subject and body',
        'wait': 'Wait for a specified number of days',
        'send-whatsapp': 'Send a WhatsApp message'
      }
      return descriptions[blockId] || ''
    }
  }
}
</script>