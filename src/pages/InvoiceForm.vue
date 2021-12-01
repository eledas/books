<template>
  <div class="flex flex-col" v-if="doc">
    <PageHeader>
      <BackLink slot="title" />
      <template slot="actions">
        <!--<StatusBadge :status="status" />-->
        <Button
          v-if="doc.submitted"
          class="text-gray-900 text-xs ml-2"
          :icon="true"
          @click="routeTo(`/print/${doc.doctype}/${doc.name}`)"
        >
          Print
        </Button>
        <DropdownWithActions class="ml-2" :actions="actions" />
        <Button
          v-if="showSave"
          type="primary"
          class="text-white ml-2 text-md"
          @click="onSaveClick"
        >
          {{ doctype == 'SalesInvoice' ? _('Vender') : _('Comprar') }}
        </Button>
        <!--<Button
          v-if="!doc._dirty && !doc._notInserted && !doc.submitted"
          type="primary"
          class="text-white text-xs ml-2"
          @click="onSubmitClick"
          >{{ _('Submit') }}</Button
        >-->
      </template>
    </PageHeader>
    <div class="flex" v-if="doc">
      <div class="w-1/2 mb-1 mt-2 px-10" v-if="meta">
        <div
          class="border rounded-lg shadow h-full flex flex-col justify-between"
          style="width: 100%; height: 100%"
        >
          <div class="mt-6 px-6">
            <div class="flex justify-between mt-2">
              <div class="w-1/3 text-left">
                <label style="color: gray; font-family: verdana">
                  Buscar Producto
                </label>
              </div>

              <div class="w-1/3 ext-right">
                <FormControl
                  input-class="bg-gray-100 px-3 py-2 text-base text-right"
                  :df="new Date()"
                  :value="`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`"
                  @change="(value) => doc.set('date', value)"
                  :read-only="doc.submitted"
                />
              </div>
            </div>
            <div class="flex justify-between mt-4">
              <div class="w-2/4 px-2">
                <div class="input-container ic1">
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
                    placeholder=" "
                    type="text"
                    v-model="producto"
                    @keyup="buscarProductos"
                  />
                  <label class="bg-gray-100 placeholder text-base"
                    >Productos</label
                  >
                </div>
              </div>
              <div class="w-1/4 px-2">
                <div class="input-container ic1">
                  <input
                    class="
                      input2
                      mt-2
                      w-full
                      text-base
                      bg-gray-100
                      px-3
                      py-2
                      text-base
                      rounded
                    "
                    placeholder=" "
                    type="number"
                    min="0"
                    v-model="amount"
                    @keyup="activateButton"
                    @change="activateButton"
                  />
                  <label class="bg-gray-100 placeholder text-base"
                    >Cantidad</label
                  >
                </div>
              </div>
              <div class="w-1/4 px-2">
                <div class="input-container ic1">
                  <input
                    class="
                      input3
                      mt-2
                      w-full
                      text-base
                      bg-gray-100
                      px-3
                      py-2
                      text-base
                      rounded
                    "
                    placeholder=" "
                    type="number"
                    min="0"
                    v-model="newRate"
                    @keyup="validateNewRate"
                    @change="validateNewRate"
                  />
                  <label class="bg-gray-100 placeholder text-base"
                    >Nuevo Precio</label
                  >
                </div>
              </div>
              <div class="w-2/4 mt-2 px-2">
                <Button
                  :icon="true"
                  @click="addItem"
                  type="tird"
                  v-if="doc"
                  class="bg-success text-white text-md"
                  :disabled="desactivateButton"
                >
                  {{ _('Agregar Producto') }}
                </Button>
              </div>
            </div>

            <div class="mt-2 px-2"></div>
            <div class="mt-2 px-2">
              <TableView
                :head="head"
                :items="items"
                @getItemSelected="getItemSelected"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/2 mb-1 mt-2" v-if="meta">
        <div
          class="border rounded-lg shadow h-full flex flex-col justify-between"
          style="width: 90%; height: 100%"
        >
          <div class="mt-6 px-6">
            <div class="flex justify-between mt-2">
              <div class="w-1/3 text-left">
                <label style="color: gray; font-family: verdana">
                  Productos a
                  {{ doctype == 'SalesInvoice' ? 'Vender' : 'Comprar' }}
                </label>
              </div>

              <div class="w-1/3 ext-right">
                <FormControl
                  input-class="bg-gray-100 px-3 py-2 text-base text-right"
                  :df="new Date()"
                  :value="`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`"
                  @change="(value) => doc.set('date', value)"
                  :read-only="doc.submitted"
                />
              </div>
            </div>
            <div class="mt-4 px-6">
              <FormControl
                :df="meta.getField('items')"
                :value="doc.items"
                :showHeader="true"
                :max-rows-before-overflow="7"
                @change="(value) => doc.set('items', value)"
                :read-only="doc.submitted"
              />
            </div>
          </div>
          <div
            class="px-6 mb-6 flex justify-between text-base"
            v-if="doc.items.length"
          >
            <div class="flex-1 mr-10">
              <FormControl
                v-if="!doc.submitted || doc.terms"
                :df="meta.getField('terms')"
                :value="doc.terms"
                :show-label="true"
                input-class="bg-gray-100"
                @change="(value) => doc.set('terms', value)"
                :read-only="doc.submitted"
              />
            </div>
            <div class="w-64">
              <div class="flex pl-2 justify-between py-3 border-b"></div>
              <div
                class="flex pl-2 justify-between py-3"
                v-for="tax in doc.taxes"
                :key="tax.name"
              >
                <div>{{ tax.account }}</div>
                <div>
                  {{
                    frappe.format(tax.amount, {
                      fieldtype: 'Currency',
                      currency: doc.currency,
                    })
                  }}
                </div>
              </div>
              <div
                class="
                  flex
                  pl-2
                  justify-between
                  py-3
                  border-t
                  text-green-600
                  font-semibold
                  text-base
                "
              >
                <div>{{ _('Total') }}</div>
                <div>{{ formattedValue('grandTotal') }}</div>
              </div>
              <div
                v-if="doc.outstandingAmount > 0"
                class="
                  flex
                  pl-2
                  justify-between
                  py-3
                  border-t
                  text-red-600
                  font-semibold
                  text-base
                "
              >
                <div>{{ _('Outstanding Amount') }}</div>
                <div>{{ formattedValue('outstandingAmount') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import frappe from 'frappejs';
import TableView from '../components/Tableview.vue';
//import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import FormControl from '@/components/Controls/FormControl';
import DropdownWithActions from '@/components/DropdownWithActions';
import BackLink from '@/components/BackLink';
import {
  openSettings,
  handleErrorWithDialog,
  getActionsForDocument,
  getInvoiceStatus,
  showMessageDialog,
  routeTo,
} from '@/utils';

export default {
  name: 'InvoiceForm',
  props: ['doctype', 'name'],
  components: {
    TableView,
    PageHeader,
    //StatusBadge,
    Button,
    FormControl,
    DropdownWithActions,
    BackLink,
  },
  provide() {
    return {
      doctype: this.doctype,
      name: this.name,
    };
  },
  data() {
    return {
      doc: null,
      status: null,
      color: null,
      printSettings: null,
      companyName: null,
      desactivateButton: true,
      amount: 1,
      newRate: null,
      producto: '',
      items: [],
      itemSelected: '',
      head: [
        {
          title: 'Nombre',
          fieldName: 'name',
        },
        {
          title: 'Precio',
          fieldName: 'rate',
        },
        {
          title: 'Cantidad',
          fieldName: 'amount',
        },
        {
          title: 'Descripcion',
          fieldName: 'description',
        },
      ],
    };
  },
  computed: {
    meta() {
      return frappe.getMeta(this.doctype);
    },
    partyField() {
      let fieldname = {
        SalesInvoice: 'customer',
        PurchaseInvoice: 'supplier',
      }[this.doctype];
      return this.meta.getField(fieldname);
    },
    address() {
      return this.printSettings && this.printSettings.getLink('address');
    },
    showSave() {
      return this.doc && (this.doc._notInserted || this.doc._dirty);
    },
    actions() {
      return getActionsForDocument(this.doc);
    },
  },
  async mounted() {
    try {
      this.doc = await frappe.getDoc(this.doctype, this.name);
      window.d = this.doc;
    } catch (error) {
      if (error instanceof frappe.errors.NotFoundError) {
        routeTo(`/list/${this.doctype}`);
        return;
      }
      this.handleError(error);
    }
    this.printSettings = await frappe.getSingle('PrintSettings');
    this.companyName = (
      await frappe.getSingle('AccountingSettings')
    ).companyName;

    let query = this.$route.query;
    if (query.values && query.doctype === this.doctype) {
      this.doc.set(this.$router.currentRoute.query.values);
    }
    this.status = getInvoiceStatus(this.doc);
  },
  updated() {
    this.status = getInvoiceStatus(this.doc);
  },
  methods: {
    routeTo,
    async onSaveClick() {
      this.doc.customer = 'cf';
      console.log(this.doc)
      await this.doc.set(
        'items',
        this.doc.items.filter((row) => row.item)
      );
      console.log(this.doc)
      return this.doc.insertOrUpdate().catch(error=>{
        console.log(error);
        this.handleError});
    },
    getItemSelected(value) {
      this.itemSelected = value;
      this.amount = 1;
      this.newRate = null;
      this.desactivateButton = false;
    },
    async getItem() {
      let item;
      try {
        item = await frappe.db.sql(
          `Select * from Item Where ` + `name = '${this.itemSelected}'`
        );
        return item[0];
      } catch (error) {
        return undefined;
      }
    },
    existInList(name) {
      for (let i = 0; i < this.doc.items.length; i++) {
        if (this.doc.items[i].item === name) return true;
      }
      return false;
    },
    //Manejo de errores
    validateShop(item) {
      if (item == undefined) {
        //Producto no encontrado
        handleErrorWithDialog(
          {
            message: `El producto "${this.producto}" no se encontro en la base de datos.`,
          },
          this.doc
        );
        return true;
      }

      if (this.existInList(item.name)) {
        //Producto ya se encuentra en lista
        handleErrorWithDialog(
          { message: `El producto "${item.name}" ya fue agregado a la lista.` },
          this.doc
        );
        return true;
      }

      if (item.amount < this.amount) {
        //No se cuenta con la cantidad necesaria
        handleErrorWithDialog(
          {
            message: `El producto "${item.name}" no cuenta con stock suficiente.`,
          },
          this.doc
        );
        return true;
      }

      return false;
    },
    createData() {
      let data = {};
      data.doctype = this.doctype + 'Item';
      data.parent = this.doc.name;
      data.parenttype = this.doc.doctype;
      data.parentfield = 'items';
      data.parentdoc = this.doc;
      (this.doc['items'] || []).length;

      if (!data.name) {
        data.name = frappe.getRandomString();
      }

      if (!data.idx) {
        data.idx = (this.doc['items'] || []).length;
      }
      return data;
    },
    createDocument(data, item) {
      let document = new frappe.BaseDocument(data);
      document.account = 'Activos - 1';
      document.item = this.itemSelected;
      document.description = item.description;
      document.rate = this.newRate != null ? this.newRate : item.rate;
      document.amount = this.amount;
      document.quantity = this.amount;
      document.baseRate = item.costRate;
      this.doc.items.push(document);
    },
    getTotal() {
      let total = 0;
      for (let i = 0; i < this.doc.items.length; i++) {
        total += this.doc.items[i].rate * this.doc.items[i].quantity;
      }
      return total;
    },
    async addItem() {
      let item = await this.getItem();
      if (this.validateShop(item)) return;

      let data = this.createData();
      this.createDocument(data, item);
      this.amount = 1;
      this.newRate = null;
      this.doc.grandTotal = this.getTotal();
    },
    validateNewRate() {
      this.newRate = this.newRate >= 0 ? this.newRate : 1;
    },
    activateButton() {
      this.amount = this.amount >= 0 ? this.amount : 1;
      this.desactivateButton = this.amount < 1;
    },
    async buscarProductos() {
      try {
        this.items = await frappe.db.sql(
          `Select * from Item Where ` +
            `name like '%${this.producto}%' or ` +
            `barCode like '%${this.producto}%' or ` +
            `description like '%${this.producto}%' ` +
            `order by name asc`
        );
      } catch (error) {
        handleErrorWithDialog(
          {
            message: `Error al buscar el prodcto "${item.name}".`,
          },
          this.doc
        );
      }
    },
    onSubmitClick() {
      let message =
        this.doctype === 'SalesInvoice'
          ? this._('Are you sure you want to submit this invoice?')
          : this._('Are you sure you want to submit this bill?');
      showMessageDialog({
        message,
        buttons: [
          {
            label: this._('Submit'),
            action: () => {
              this.doc.submit().catch(this.handleError);
            },
          },
          {
            label: this._('Cancel'),
            action() {},
          },
        ],
      });
    },
    handleError(e) {
      handleErrorWithDialog(e, this.doc);
    },
    openInvoiceSettings() {
      openSettings('Invoice');
    },
    formattedValue(fieldname, doc) {
      if (!doc) {
        doc = this.doc;
      }
      let df = doc.meta.getField(fieldname);
      return frappe.format(doc[fieldname], df, doc);
    },
  },
  beforeMount() {
    this.buscarProductos();
  },
};
</script>
<style scoped>
.input-container {
  position: relative;
  width: 100%;
}

.placeholder {
  color: #b4b4b4;
  font-family: sans-serif;
  left: 5px;
  line-height: 0px;
  position: absolute;
  top: -10px;
}

.input1:not(:placeholder-shown) ~ .placeholder {
  color: #000000;
}
.input2:not(:placeholder-shown) ~ .placeholder {
  color: #000000;
}
.input3:not(:placeholder-shown) ~ .placeholder {
  color: #000000;
}

.input1:focus ~ .placeholder {
  color: #4780ca;
}

.input2:focus ~ .placeholder {
  color: #5aca47;
}

.input3:focus ~ .placeholder {
  color: #d18624;
}
</style> 