const STORAGE_KEY = 'workflow-builder-data'

export const saveWorkflow = (workflow) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow))
    return true
  } catch (error) {
    console.error('Failed to save workflow:', error)
    return false
  }
}

export const loadWorkflow = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load workflow:', error)
    return []
  }
}

export const clearWorkflow = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear workflow:', error)
    return false
  }
}

export const exportToJSON = (workflow) => {
  const json = {
    workflow: workflow.map(block => ({
      type: block.type,
      props: block.props
    }))
  }
  
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `workflow-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}