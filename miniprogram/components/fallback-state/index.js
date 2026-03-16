Component({
  properties: {
    tone: {
      type: String,
      value: 'info',
    },
    title: {
      type: String,
      value: '',
    },
    body: {
      type: String,
      value: '',
    },
    ctaText: {
      type: String,
      value: '',
    },
  },

  methods: {
    handleAction() {
      this.triggerEvent('action');
    },
  },
});
