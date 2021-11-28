<template>
  <div>
    <div class="text-gray-600 text-sm mb-1" v-if="showLabel">
      {{ df.label }}
    </div>
    <!--
    <DatePicker
      ref="input"
      :input-class="[inputClasses, 'cursor-text']"
      :value="value"
      :placeholder="inputPlaceholder"
      :format-value="formatValue"
      @change="(value) => triggerChange(value)"
    />-->

    <div id="app">
      <input
        type="date"
        v-model="theDate"
        v-on:change="changueDate"
      />
    </div>
  </div>
</template>

<script>
import frappe from 'frappejs';
import Base from './Base';
//import DatePicker from '../DatePicker/DatePicker';

export default {
  name: 'Date',
  extends: Base,
  components: {
    //DatePicker,
  },
  data() {
    return {
      theDate: this.doc.get('dateExpired'),
    };
  },
  methods: {
    getSome: function (dateValue) {
      return (this.beforeDate = moment(dateValue, 'YYYY-MM-DD').unix());
    },
  },
  computed: {
    inputType() {
      return 'date';
    },
  },
  methods: {
    changueDate() {
      this.doc.set('dateExpired', this.theDate.toString())
    },
    formatValue(value) {
      return frappe.format(value, this.df);
    },
  },
};
</script>