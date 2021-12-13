<template>
  <div class="py-3">
    <div v-if="messages">
      <div class="text-center px-50">
        <label
          v-if="itemSelected != ''"
          class="bg-green-100 rounded px-4"
          style="color: gray; font-family: verdana"
        >
          {{ itemSelected }}
        </label>
        <label
          v-else-if="itemSelected == ''"
          class="bg-orange-100 rounded px-4"
          style="color: gray; font-family: verdana"
        >
          Seleecione un Porducto
        </label>
      </div>

      <div class="text-center py-2 px-50">
        <label
          v-if="items.length < 1"
          class="bg-red-100 rounded px-4"
          style="color: gray; font-family: verdana"
        >
          No se encontraron productos
        </label>
      </div>
    </div>
    <div class="tableFixHead py-2">
      <table class="table table-xs table-hover">
        <thead class="">
          <tr>
            <th v-for="(item, indexKey) in head" :key="indexKey">
              <label style="color: gray; font-family: verdana">
                {{ item.title }}
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="selectItem(item.name)"
            :class="indexKey % 2 != 0 ? 'bg-gray-100 ' : ''"
            v-for="(item, indexKey) in items"
            :v-if="indexKey < 5"
            :key="indexKey + 'tr'"
          >
            <td
              scope="col"
              v-for="(field, indexKey) in head"
              :key="indexKey + 'td'"
              :class="getColor(item[field.fieldName])"
            >
              {{
                field.fieldName === 'rate' && messages
                  ? `Q ${parseFloat(item[field.fieldName]).toFixed(2)}`
                  : item[field.fieldName]
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableView',
  props: {
    head: {
      type: Array,
      default() {
        return [];
      },
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    messages: {
      type: Boolean,
      default() {
        return true;
      },
    },
    color: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      itemSelected: '',
    };
  },
  methods: {
    selectItem(value) {
      this.$emit('getItemSelected', value);
      this.itemSelected = value;
    },
    getColor(text) {
      if (!this.color) return '';
      switch(text){
        case 'Si': return 'text-danger'
        case 'No': return 'text-warning'
        default: return ''
      }
    },
  },
  computed: {},
};
</script>
<style scoped>
table {
  border-collapse: separate;
}
td,
th {
  border: solid 0px rgb(154, 161, 163);
}
tr td,
th {
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
th:first-child {
  border-top-left-radius: 5px;
}
th:last-child {
  border-top-right-radius: 5px;
}
tr:last-child td:first-child {
  border-bottom-left-radius: 5px;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 5px;
}

.tableFixHead {
  overflow: auto;
  height: 600px;
}
.tableFixHead thead th {
  position: sticky;
  top: 0;
  z-index: 5;
}

/* Just common table stuff. Really. */
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 8px 8px;
}
th {
  background: #eee;
}
</style>