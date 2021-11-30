<template>
  <div class="py-3">
    <div class="text-center px-50">
      <label
        class="bg-gray-100 rounded px-4"
        style="color: gray; font-family: verdana"
      >
        {{ items[index]['name'] }}
      </label>
    </div>
    <div class="tableFixHead py-3">
      <table class="table table-xs table-hover">
        <thead class="" v-b-scrollspy:nav-scroller>
          <tr>
            <th v-for="(item, index) in head" :key="index">
              <label style="color: gray; font-family: verdana">
                {{ item.title }}
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="selectItem(index)"
            :class="index % 2 != 0 ? 'bg-gray-100 ' : ''"
            v-for="(item, index) in items"
            :v-if="index < 5"
            :key="item.name"
          >
            <td
              scope="col"
              v-for="(field, index) in head"
              :key="item.name + index"
            >
              {{ item[field.fieldName] }}
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
        return []
      },
    },
    items: {
      type: Array,
      default() {
        return []
      },
    },
    test: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      index: 0,
      head2: [],
    };
  },
  methods: {
    selectItem(value) {
      this.head2 = this.head;
      console.log(12312, value);
      this.index = value;
    },
  },
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
  height: 100%;
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