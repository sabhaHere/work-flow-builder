export const BLOCK_TYPES = {
  EMAIL: {
    id: 'send-email',
    name: 'Send Email',
    icon: 'fa-envelope',
    color: 'blue',
    defaultProps: {
      subject: '',
      body: ''
    }
  },
  WAIT: {
    id: 'wait',
    name: 'Wait X Days',
    icon: 'fa-clock',
    color: 'yellow',
    defaultProps: {
      days: 1
    }
  },
  WHATSAPP: {
    id: 'send-whatsapp',
    name: 'Send WhatsApp',
    icon: 'fab fa-whatsapp',
    color: 'green',
    defaultProps: {
      phone: '',
      message: ''
    }
  }
}