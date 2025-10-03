<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold">
          <i class="fas fa-puzzle-piece mr-2"></i>
          Workflow Builder
        </h1>
        <p class="text-blue-100 mt-1">Create automated workflows with drag and drop</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <Sidebar :block-types="blockTypes" ref="sidebar" />
      <Canvas
        :workflow="workflow"
        :block-types="blockTypes"
        @clear="clearWorkflow"
        @simulate="openSimulation"
        @export="exportWorkflow"
        @remove-block="removeBlock"
        ref="canvas"
      />
    </div>

    <!-- Simulation Modal -->
    <SimulationModal
      :show="showSimulation"
      :workflow="workflow"
      :block-types="blockTypes"
      @close="closeSimulation"
    />

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="showConfirm"
      :type="confirmConfig.type"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :confirm-text="confirmConfig.confirmText"
      :cancel-text="confirmConfig.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- Toast Notifications -->
    <Toast
      :show="toast.show"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      @close="closeToast"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Sortable from 'sortablejs'
import Sidebar from './components/Sidebar.vue'
import Canvas from './components/Canvas.vue'
import SimulationModal from './components/SimulationModal.vue'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialogue.vue'
import { BLOCK_TYPES } from './constants/blockType'
import { saveWorkflow, loadWorkflow, exportToJSON } from './utils/storage'

export default {
  name: 'App',
  components: {
    Sidebar,
    Canvas,
    SimulationModal,
    Toast,
    ConfirmDialog
  },
  setup() {
    const workflow = ref([])
    const showSimulation = ref(false)
    const blockTypes = ref(BLOCK_TYPES)
    const sidebar = ref(null)
    const canvas = ref(null)
    let sidebarSortable = null
    let canvasSortable = null

    // Toast state
    const toast = ref({
      show: false,
      type: 'info',
      title: '',
      message: '',
      duration: 3000
    })

    // Confirm dialog state
    const showConfirm = ref(false)
    const confirmConfig = ref({
      type: 'warning',
      title: 'Are you sure?',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    })
    let confirmCallback = null

    // Load workflow from localStorage on mount
    onMounted(() => {
      workflow.value = loadWorkflow()
      if (workflow.value.length > 0) {
        showToast('success', 'Workflow Loaded', `${workflow.value.length} block(s) restored from previous session`)
      }
      nextTick(() => {
        initializeDragAndDrop()
      })
    })

    // Save workflow to localStorage whenever it changes
    watch(workflow, (newWorkflow) => {
      saveWorkflow(newWorkflow)
      // Reinitialize canvas sortable when workflow changes
      nextTick(() => {
        initializeCanvasSortable()
      })
    }, { deep: true })

    // Toast functions
    function showToast(type, title, message, duration = 3000) {
      toast.value = {
        show: true,
        type,
        title,
        message,
        duration
      }
    }

    function closeToast() {
      toast.value.show = false
    }

    // Confirm dialog functions
    function showConfirmDialog(config) {
      return new Promise((resolve) => {
        confirmConfig.value = {
          type: config.type || 'warning',
          title: config.title || 'Are you sure?',
          message: config.message,
          confirmText: config.confirmText || 'Confirm',
          cancelText: config.cancelText || 'Cancel'
        }
        confirmCallback = resolve
        showConfirm.value = true
      })
    }

    function handleConfirm() {
      showConfirm.value = false
      if (confirmCallback) {
        confirmCallback(true)
        confirmCallback = null
      }
    }

    function handleCancel() {
      showConfirm.value = false
      if (confirmCallback) {
        confirmCallback(false)
        confirmCallback = null
      }
    }

    // Initialize drag and drop functionality
    function initializeDragAndDrop() {
      initializeSidebarSortable()
      initializeCanvasSortable()
    }

    function initializeSidebarSortable() {
      if (sidebarSortable) return

      const sidebarElement = sidebar.value?.$refs?.blockList
      if (sidebarElement) {
        sidebarSortable = Sortable.create(sidebarElement, {
          group: {
            name: 'blocks',
            pull: 'clone',
            put: false
          },
          sort: false,
          animation: 150,
          ghostClass: 'ghost'
        })
      }
    }

    function initializeCanvasSortable() {
      if (canvasSortable) {
        canvasSortable.destroy()
        canvasSortable = null
      }

      const canvasElement = canvas.value?.$refs?.workflowBlocks || canvas.value?.$refs?.canvasDropzone
      
      if (canvasElement) {
        canvasSortable = Sortable.create(canvasElement, {
          group: {
            name: 'blocks',
            pull: false,
            put: true
          },
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          filter: 'input, textarea, button, select',
          preventOnFilter: false,
          onAdd: (evt) => {
            const blockType = evt.item.getAttribute('data-block-type')
            if (blockType) {
              const config = Object.values(BLOCK_TYPES).find(b => b.id === blockType)
              if (config) {
                const newBlock = {
                  id: Date.now() + Math.random(),
                  type: blockType,
                  props: JSON.parse(JSON.stringify(config.defaultProps))
                }
                
                evt.item.remove()
                workflow.value.splice(evt.newIndex, 0, newBlock)
                
                showToast('success', 'Block Added', `${config.name} added to workflow`)
              }
            }
          },
          onUpdate: (evt) => {
            const movedBlock = workflow.value.splice(evt.oldIndex, 1)[0]
            workflow.value.splice(evt.newIndex, 0, movedBlock)
            showToast('info', 'Block Moved', 'Block order updated')
          }
        })
      }
    }

    // Remove a block from the workflow
    async function removeBlock(index) {
      const blockName = workflow.value[index]?.type || 'Block'
      const config = Object.values(BLOCK_TYPES).find(b => b.id === workflow.value[index]?.type)
      
      const confirmed = await showConfirmDialog({
        type: 'error',
        title: 'Remove Block',
        message: `Are you sure you want to remove this ${config?.name || blockName}?`,
        confirmText: 'Remove',
        cancelText: 'Cancel'
      })

      if (confirmed) {
        workflow.value.splice(index, 1)
        showToast('success', 'Block Removed', `${config?.name || blockName} has been removed`)
      }
    }

    // Clear all blocks from the workflow
    async function clearWorkflow() {
      const confirmed = await showConfirmDialog({
        type: 'warning',
        title: 'Clear Workflow',
        message: `Are you sure you want to clear all ${workflow.value.length} block(s)? This action cannot be undone.`,
        confirmText: 'Clear All',
        cancelText: 'Cancel'
      })

      if (confirmed) {
        const count = workflow.value.length
        workflow.value = []
        showToast('success', 'Workflow Cleared', `${count} block(s) removed`)
      }
    }

    // Export workflow as JSON
    function exportWorkflow() {
      try {
        exportToJSON(workflow.value)
        showToast('success', 'Export Successful', 'Workflow exported as JSON file')
      } catch (error) {
        showToast('error', 'Export Failed', 'Failed to export workflow')
      }
    }

    // Open simulation modal
    function openSimulation() {
      showSimulation.value = true
    }

    // Close simulation modal
    function closeSimulation() {
      showSimulation.value = false
    }

    return {
      workflow,
      blockTypes,
      showSimulation,
      sidebar,
      canvas,
      toast,
      showConfirm,
      confirmConfig,
      removeBlock,
      clearWorkflow,
      exportWorkflow,
      openSimulation,
      closeSimulation,
      closeToast,
      handleConfirm,
      handleCancel
    }
  }
}
</script>