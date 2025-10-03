# 🚀 Workflow Builder

A modern, drag-and-drop workflow automation builder built with Vue.js 3 and Tailwind CSS. Create automated workflows visually without writing any code!


 Features

- 🎨 **Drag & Drop Interface** - Intuitive visual workflow creation
- 🔧 **Multiple Block Types** - Email, Wait, and WhatsApp actions
- ✅ **Real-time Validation** - Form validation with visual feedback
- 💾 **Auto-save** - Workflows automatically saved to localStorage
- 🎬 **Animated Simulation** - Preview workflow execution step-by-step
- 📥 **Export/Import** - Save workflows as JSON files
- 🎉 **Toast Notifications** - Beautiful feedback for user actions
- 🔔 **Confirmation Dialogs** - Safe actions with modern confirm dialogs
- 📱 **Responsive Design** - Works on desktop and tablet devices
- 🌈 **Modern UI** - Clean, professional interface with smooth animations



### Main Interface
The workflow builder consists of three main sections:
1. **Sidebar** - Available block types to drag
2. **Canvas** - Workspace to build your workflow
3. **Action Buttons** - Clear, Simulate, and Export options

### Workflow Blocks
- **Send Email**: Configure email subject and body
- **Wait X Days**: Set delay between actions (1-365 days)
- **Send WhatsApp**: Set phone number and message

## 🚀 Getting Started

### Prerequisites

- Node.js 
- npm or yarn package manager

### Installation

1. Clone the repository**

   git clone https://github.com/yourusername/work-flow-builder.git
   cd workflow-builder
2. Install dependencies
    npm install
3. Run development server
   npm run dev

4. Open your browser
   http://localhost:5173


# Build the project
npm run build


The production files will be in the `dist/` directory.


## 🎯 How to Use

### Creating a Workflow

1. **Drag blocks from sidebar** - Choose from Email, Wait, or WhatsApp blocks
2. **Drop onto canvas** - Place blocks in your desired order
3. **Fill in details** - Complete all required fields (marked with *)
4. **Reorder blocks** - Grab the grip icon (⋮⋮) to reorder
5. **Remove blocks** - Click the trash icon to delete a block

### Block Types

#### 📧 Send Email
Configure email automation with:
- **Subject** (3-200 characters, required)
- **Body** (10+ characters, required)

**Example Use Case**: Send welcome emails, notifications, or follow-ups

#### ⏰ Wait X Days
Add delays between actions:
- **Days** (1-365, whole numbers, required)

**Example Use Case**: Wait 3 days before sending a follow-up email

#### 💬 Send WhatsApp
Send WhatsApp messages with:
- **Phone Number** (International format: +1234567890, required)
- **Message** (1-1000 characters, required)

**Example Use Case**: Send reminders, promotions, or updates

### Validation Rules

All blocks must be valid before simulation or export:
- ✅ **Valid Block** - Green badge, all fields properly filled
- ❌ **Incomplete Block** - Red badge, missing or invalid fields

### Simulating Workflows

1. Click the **Simulate** button (enabled only when all blocks are valid)
2. Watch the animated step-by-step execution
3. See timing for each step (Day 0, Day 3, etc.)
4. View total workflow duration
5. Click **Replay Simulation** to run again





## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **Vue.js 3** | Progressive JavaScript framework with Composition API |
| **Vite** | Next-generation frontend build tool |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **SortableJS** | JavaScript library for drag-and-drop functionality |
| **Font Awesome** | Icon library for UI elements |
| **localStorage API** | Browser storage for workflow persistence |

## 📝 API Reference

### Storage Utils (`src/utils/storage.js`)

// Save workflow to localStorage
saveWorkflow(workflow: Array): boolean

// Load workflow from localStorage  
loadWorkflow(): Array

// Clear workflow from localStorage
clearWorkflow(): boolean

// Export workflow as JSON file download
exportToJSON(workflow: Array): void



### Coding Standards
- Follow Vue.js style guide
- Use Tailwind utility classes
- Add comments for complex logic
- Write meaningful commit messages

