Component({
  properties: {
    locale: {
      type: String,
      value: 'zh-CN',
    },
    label: {
      type: String,
      value: '',
    },
  },

  methods: {
    handleSelect(event) {
      const { locale } = event.currentTarget.dataset;

      if (!locale || locale === this.properties.locale) {
        return;
      }

      this.triggerEvent('change', {
        locale,
      });
    },
  },
});
