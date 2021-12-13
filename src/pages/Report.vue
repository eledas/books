<template>
  <div class="flex flex-col max-w-full">
    <PageHeader>
      <h1 slot="title" class="text-2xl font-bold">Reportes</h1>
    </PageHeader>
    <div class="flex flex-col px-8 mt-2 text-base" v-if="report.filterFields">
      <div class="flex">
        <div class="flex flex-col w-1/3 px-5">
          <div>
            <label>Seleccione tipo de reporte</label>
            <select
              class="
                input1
                mt-2
                w-full
                text-base
                bg-gray-100
                px-3
                py-2
                text-base
                rounded
              "
              v-model="tipeReportTime"
              @change="changueType"
            >
              <option value="year">Anual</option>
              <option value="month">Mensual</option>
              <option value="day">Diario</option>
              <option value="range">Por Rango de Tiempo</option>
            </select>
          </div>
        </div>
        <div class="flex w-2/3 px-5">
          <div
            class="w-1/2 px-3"
            v-if="tipeReportTime == 'year' || tipeReportTime == 'month'"
          >
            <label>Ingrese el Año</label>
            <input
              class="
                input1
                mt-2
                w-full
                text-base
                bg-gray-100
                px-3
                py-2
                text-base
                rounded
              "
              type="number"
              v-model="theDateStart"
            />
          </div>
          <div class="w-1/2 px-3" v-if="tipeReportTime == 'month'">
            <label>Seleccione el Mes</label>
            <select
              class="
                input1
                mt-2
                w-full
                text-base
                bg-gray-100
                px-3
                py-2
                text-base
                rounded
              "
              v-model="theDateEnd"
            >
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
          <div
            class="w-1/2 px-3"
            v-if="tipeReportTime == 'day' || tipeReportTime == 'range'"
          >
            <label
              >Seleccione Fecha{{
                tipeReportTime == 'range' ? ' Inicial' : ''
              }}</label
            >
            <input
              class="
                input1
                mt-2
                w-full
                text-base
                bg-gray-100
                px-3
                py-2
                text-base
                rounded
              "
              type="date"
              v-model="theDateStart"
            />
          </div>
          <div class="w-1/2 px-3" v-if="tipeReportTime == 'range'">
            <label>Seleccione Fecha Final</label>
            <input
              class="
                input1
                mt-2
                w-full
                text-base
                bg-gray-100
                px-3
                py-2
                text-base
                rounded
              "
              type="date"
              v-model="theDateEnd"
            />
          </div>
        </div>
      </div>
      <div class="flex mt-4 px-10">
        <div class="px-2">
          <Button
            :icon="true"
            @click="createSimpleReport"
            type="primary"
            class="bg-success text-white text-xl"
          >
            Ver Reporte Simple
          </Button>
        </div>
        <div class="px-2">
          <Button
            :icon="true"
            @click="createDetailReport"
            type="primary"
            class="bg-success text-white text-xl"
          >
            Ver Reporte Detallado
          </Button>
        </div>
        <div class="px-2">
          <Button
            :icon="true"
            @click="minProducts"
            type="primary"
            class="bg-success text-white text-xl"
          >
            Ver Productos Agotados
          </Button>
        </div>
        <div class="px-2">
          <Button
            :icon="true"
            @click="expiredProducts"
            type="primary"
            class="bg-success text-white text-xl"
          >
            Ver Productos por Vencer
          </Button>
        </div>
      </div>
      <div class="flex mt-4 px-10">
        <div class="px-2">
          <Button
            :icon="true"
            @click="generateReport"
            type="tird"
            class="bg-success text-white text-xl"
          >
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
    <div class="mt-2 px-2">
      <TableView
        v-if="tipo === 0 || tipo === 1"
        :head="getHead"
        :items="items"
        :messages="false"
        :color="false"
      />
      <TableView
        v-if="tipo === 2 || tipo === 3"
        :head="getHead"
        :items="items"
        :messages="false"
        :color="true"
      />
    </div>
    <div class="mt-2 px-2"></div>
  </div>
</template>
<script>
import frappe from 'frappejs';
import infoReport from './infoReport.js';
import queryReport from './queryReport';
import PageHeader from '@/components/PageHeader';
import TableView from '../components/Tableview.vue';
import Button from '@/components/Button';
import reportViewConfig from '@/../reports/view';
import { generateReport } from '../../generateFiles/app';
import { handleErrorWithDialog, showMessageDialog } from '@/utils';
export default {
  name: 'Report',
  props: ['reportName', 'defaultFilters'],
  components: {
    PageHeader,
    Button,
    TableView,
  },
  provide() {
    return {
      doc: this.filters,
    };
  },
  data() {
    let filters = {};
    for (let df of reportViewConfig[this.reportName].filterFields) {
      filters[df.fieldname] = null;
    }

    return {
      loading: true,
      filters,
      reportData: {
        rows: [],
        columns: [],
      },
      timeReport: '',
      tipo: 0,
      tipeReportTime: 'year',
      theDateStart: '',
      theDateEnd: '',
      items: [],
    };
  },
  async activated() {
    this.reportData.columns = this.report.getColumns();
    await this.setDefaultFilters();
    await this.fetchReportData();
  },
  methods: {
    errorValidation(message) {
      handleErrorWithDialog(
        {
          message: message,
        },
        this
      );
    },
    generateReport() {
      let date = this.getDate();
      const shortPrintData = {
        invoice: {
          number: this.getNameReport(),
          date: `${date.dd}/${date.mm}/${date.yyyy}`,
          totalCost: ``,
          totalRate: ``,
          totalGan: ``,
        },
        items: this.items,
      };

      generateReport(infoReport.getBaseReport(this.tipo), shortPrintData);
    },
    validateInputs() {
      switch (this.tipeReportTime) {
        case 'month':
          if (this.theDateStart == '' || this.theDateEnd == '') return true;
          break;
        case 'year':
          if (this.theDateStart == '') return true;
          break;
        case 'day':
          if (this.theDateStart == '') return true;
          break;
        case 'rangue':
          if (this.theDateStart == '' || this.theDateEnd == '') return true;
      }
      return false;
    },
    async getDetailQuery() {
      let dates = await frappe.db.sql(queryReport.getDates(this.timeReport));
      let data = await frappe.db.sql(
        queryReport.getDetailQuery(this.timeReport)
      );

      dates.forEach((date) => {
        this.items.push({
          title: '',
          quantity: '',
          cost: '',
          rate: '',
          gain: '',
          date: date.date,
          costTotal: '',
          rateTotal: '',
          gainTotal: '',
        });
        data.forEach((item) => {
          if (date.date == item.date) {
            this.items.push({
              title: item.item,
              quantity: item.quantity + '',
              cost: this.convertTomoneyFormat(item.costo),
              rate: this.convertTomoneyFormat(item.venta),
              gain: this.convertTomoneyFormat(item.ganancia),
              date: '',
              costTotal: this.convertTomoneyFormat(item.costoTotal),
              rateTotal: this.convertTomoneyFormat(item.ventaTotal),
              gainTotal: this.convertTomoneyFormat(item.gananciaTotal),
            });
          }
        });
      });

      data = await frappe.db.sql(queryReport.getTotals(this.timeReport));

      return data[0];
    },
    async getSimpleReport() {
      let data = await frappe.db.sql(
        queryReport.getSimpleQuery(this.timeReport)
      );

      data.forEach((item) => {
        this.items.push({
          title: item.item,
          quantity: item.cantidad + '',
          cost: this.convertTomoneyFormat(item.SumatoriaCosto),
          rate: this.convertTomoneyFormat(item.SumatoriaVenta),
          gain: this.convertTomoneyFormat(item.Ganancia),
        });
      });

      data = await frappe.db.sql(queryReport.getTotals(this.timeReport));

      return data[0];
    },
    setTime() {
      this.timeReport = 'WHERE ';
      switch (this.tipeReportTime) {
        case 'month': {
          this.timeReport += ` strftime('%m',date(creation)) = '${this.theDateEnd}' and`;
        }
        case 'year': {
          this.timeReport += ` strftime('%Y',date(creation)) = '${this.theDateStart}' `;
          break;
        }
        case 'day': {
          this.timeReport += ` date(creation) = '${this.theDateStart}'`;
          break;
        }
        case 'range': {
          this.timeReport += ` date(creation) >= '${this.theDateStart}' and `;
          this.timeReport += ` date(creation) <= '${this.theDateEnd}' `;
          break;
        }
      }
    },
    convertTomoneyFormat(number) {
      return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' Q';
    },
    getNameReport() {
      let nameReport = 'Ventas ';
      switch (this.tipeReportTime) {
        case 'month': {
          nameReport += `del Mes ${this.theDateEnd} `;
        }
        case 'year': {
          nameReport += `del Año ${this.theDateStart}`;
          break;
        }
        case 'day': {
          nameReport += `del Dia ${this.theDateStart}`;
          break;
        }
        case 'range': {
          nameReport += `de las Fechas ${this.theDateStart} a ${this.theDateEnd}`;
          break;
        }
      }
      return nameReport;
    },
    changueType() {
      this.theDateStart = '';
      this.theDateEnd = '';
    },
    getDate() {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0');
      let yyyy = today.getFullYear();

      return { dd, mm, yyyy };
    },
    async expiredProducts() {
      this.items = [];
      this.tipo = 2;
      this.setTime();
      try {
        let data = await frappe.db.sql(queryReport.getExpired());
        data.forEach((item) => {
          this.items.push({
            title: item.name,
            quantity: item.amount + '',
            cost: '',
            rate: item.fechaVencimiento + '',
            gain: item.vencido === 1 ? 'Si' : 'No',
          });
        });

        this.items.push({
          title: '--',
          quantity: '--',
          cost: '',
          rate: '--',
          gain: '--',
        });

        if (data.length === 0) {
          showMessageDialog({
            message: 'No se encontraron datos en la fecha seleccionada',
          });
          return;
        }
      } catch (error) {
        this.errorValidation('Error al generar el reporte');
      }
    },
    async minProducts() {
      this.items = [];
      this.tipo = 3;
      this.setTime();
      try {
        let data = await frappe.db.sql(queryReport.getMin());

        data.forEach((item) => {
          this.items.push({
            title: item.name,
            quantity: item.amount === null ? '0' : item.amount + '',
            cost: '',
            rate: item.minAmount + '',
            gain: item.amount === 0 ? 'Si' : 'No',
          });
        });

        this.items.push({
          title: '--',
          quantity: '--',
          cost: '',
          rate: '--',
          gain: '--',
        });

        if (data.length === 0) {
          showMessageDialog({
            message: 'No se encontraron datos en la fecha seleccionada',
          });
          return;
        }
      } catch (error) {
        this.errorValidation('Error al generar el reporte');
      }
    },
    async createSimpleReport() {
      this.items = [];
      if (this.validateInputs()) {
        this.errorValidation('Por favor, ingresar fecha');
        return;
      }
      this.tipo = 0;
      this.setTime();
      try {
        let data = await this.getSimpleReport();
        this.items.push({
          title: '--',
          quantity: '--',
          cost: '--',
          rate: '--',
          gain: '--',
        });

        if (data.cost === null) {
          showMessageDialog({
            message: 'No se encontraron datos en la fecha seleccionada',
          });
          return;
        }

        this.items.push({
          title: '',
          quantity: 'Total',
          cost: this.convertTomoneyFormat(data.cost),
          rate: this.convertTomoneyFormat(data.rate),
          gain: this.convertTomoneyFormat(data.gan),
        });
      } catch (error) {
        this.errorValidation('Error al generar el reporte');
      }
    },
    async createDetailReport() {
      this.items = [];
      if (this.validateInputs()) {
        this.errorValidation('Por favor, ingresar fecha');
        return;
      }
      try {
        this.tipo = 1;
        this.setTime();

        let data = await this.getDetailQuery();

        this.items.push({
          title: '--',
          quantity: '--',
          cost: '--',
          rate: '--',
          gain: '--',
          date: '--',
          costTotal: '--',
          rateTotal: '--',
          gainTotal: '--',
        });

        if (data.cost === null) {
          showMessageDialog({
            message: 'No se encontraron datos en la fecha seleccionada',
          });
          return;
        }

        this.items.push({
          title: '',
          quantity: '',
          cost: '',
          rate: '',
          gain: '',
          date: 'Total',
          costTotal: this.convertTomoneyFormat(data.cost),
          rateTotal: this.convertTomoneyFormat(data.rate),
          gainTotal: this.convertTomoneyFormat(data.gan),
        });
      } catch (error) {
        this.errorValidation('Error al generar el reporte');
      }
    },
    onBodyScroll({ scrollLeft }) {
      this.$nextTick(() => {
        this.$refs.header.scrollLeft = scrollLeft;
      });
    },
    async fetchReportData() {
      let data = await frappe.call({
        method: this.report.method,
        args: this.filters,
      });

      let rows;
      if (data.rows) {
        rows = data.rows;
      } else {
        rows = data;
      }

      if (data.columns) {
        this.reportData.columns = this.report.getColumns(data);
      }

      if (!rows) {
        rows = [];
      }

      this.reportData.rows = this.addTreeMeta(rows);
      this.loading = false;
    },

    addTreeMeta(rows) {
      return rows.map((row) => {
        if ('indent' in row) {
          row.isBranch = true;
          row.expanded = true;
          row.isLeaf = !row.isGroup;
        }
        row.isShown = true;
        return row;
      });
    },

    toggleChildren(row, rowIndex) {
      if (!row.isBranch) return;

      let flag;
      if (row.expanded) {
        row.expanded = false;
        flag = false;
      } else {
        row.expanded = true;
        flag = true;
      }

      let _rows = this.rows.slice(rowIndex + 1);
      for (let _row of _rows) {
        if (row.isBranch && _row.indent > row.indent) {
          _row.expanded = flag;
          _row.isShown = flag;
          continue;
        }
        break;
      }
    },

    onFilterChange(df, value) {
      this.filters[df.fieldname] = value;
      this.fetchReportData();
    },

    async setDefaultFilters() {
      for (let df of this.report.filterFields) {
        let defaultValue = null;
        if (df.default) {
          if (typeof df.default === 'function') {
            defaultValue = await df.default();
          } else {
            defaultValue = df.default;
          }
        }
        this.filters[df.fieldname] = defaultValue;
      }

      if (this.defaultFilters) {
        Object.assign(this.filters, this.defaultFilters);
      }
    },

    cellComponent(cellValue, column) {
      if (typeof cellValue === 'object') {
        // cellValue has a component definition
        return cellValue;
      }
      if (column.component) {
        // column has a component definition
        return column.component(cellValue, column);
      }

      // default cell component
      let formattedValue =
        cellValue != null && cellValue !== ''
          ? frappe.format(cellValue, column)
          : '';
      return {
        render(h) {
          return h('span', formattedValue);
        },
      };
    },

    getColumnAlignClass(column) {
      return {
        'text-right': ['Int', 'Float', 'Currency'].includes(column.fieldtype),
      };
    },

    getCellClasses(row, column) {
      let padding = ['pl-0', 'pl-6', 'pl-12', 'pl-18', 'pl-20'];
      let treeCellClasses;
      if (row.isBranch && column === this.columns[0]) {
        treeCellClasses = [
          padding[row.indent],
          'hover:bg-gray-100 cursor-pointer',
        ];
      }
      return [
        this.getColumnAlignClass(column),
        treeCellClasses,
        this.loading ? 'text-gray-100' : 'text-gray-900',
      ];
    },
  },
  computed: {
    getHead() {
      return infoReport.getHead(this.tipo);
    },
    columns() {
      return this.loading
        ? this.blankStateData.columns
        : this.reportData.columns;
    },
    rows() {
      return this.loading ? this.blankStateData.rows : this.reportData.rows;
    },
    blankStateData() {
      let columns = Array.from(new Array(6)).map((v, i) => {
        return {
          fieldtype: 'Data',
          fieldname: `Test ${i + 1}`,
          label: `Test ${i + 1}`,
        };
      });
      let rows = Array.from(new Array(14)).map(() => {
        return columns.reduce((obj, col) => {
          obj[col.fieldname] = 'Test Data ' + col.fieldname;
          obj.isShown = true;
          return obj;
        }, {});
      });
      return {
        columns,
        rows,
      };
    },
    report() {
      return reportViewConfig[this.reportName];
    },
    columnWidth() {
      return 'minmax(7rem, 1fr)';
    },
    gridTemplateColumns() {
      return this.columns
        .map((col) => {
          let multiplier = col.width;
          if (!multiplier) {
            multiplier = 1;
          }
          let minWidth = `${7 * multiplier}rem`;
          let maxWidth = `${9 * multiplier}rem`;

          return `minmax(${minWidth}, ${maxWidth})`;
        })
        .join(' ');
    },
  },
};
</script>

<style>
.report-scroll-container {
  height: calc(100vh - 12rem);
}
.report-scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.report-scroll-container::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.200');
}
.report-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.gray.300');
}
.report-scroll-container::-webkit-scrollbar-track {
  background-color: white;
}
</style>
