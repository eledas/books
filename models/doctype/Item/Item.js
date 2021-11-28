import frappe from 'frappejs';
import { _ } from 'frappejs/utils';

const getSuppliers = async () => {
  const suppliers = await frappe.db.knex('Party');
  const list = suppliers.map(
    (item) => `${item.name} - ${item.phone || '########'}`
  );
  list.push('NA')
  console.log(list)
  return list;
}

export default {
  name: 'Item',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: ['name', 'description'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre',
      fieldtype: 'Data',
      placeholder: 'Nombre',
      required: 1,
    },
    {
      fieldname: 'barCode',
      label: 'Codigo de Barras',
      fieldtype: 'Data',
      placeholder: 'Codigo de Barras',
    },
    {
      fieldname: 'dateExpired',
      label: 'Fecha Vencimiento',
      fieldtype: 'Date',
      placeholder: 'Fecha Vencimiento',
    },
    {
      fieldname: 'supplier',
      label: 'Proveedor',
      fieldtype: 'Link',
      placeholder: 'Proveedor',
      //options: () => { this.getSuppliers2() }
      //default: 'NA',
      target: 'Party'
      /*
       fieldname: 'tax',
      target: 'Tax',
      placeholder: 'GST',
      */
    },
    {
      fieldname: 'amount',
      label: 'Existencia',
      fieldtype: 'Int',
      default: '0',
      placeholder: '0',
    },
    {
      fieldname: 'minAmount',
      label: 'Existencia Minima',
      fieldtype: 'Int',
      default: 0.0,
      placeholder: '0',
    },
    {
      fieldname: 'image',
      label: 'Image',
      fieldtype: 'AttachImage',
    },
    {
      fieldname: 'description',
      label: 'Descripcion',
      placeholder: 'Description del Producto',
      default: '...',
      fieldtype: 'Text',
    },
    {
      fieldname: 'unit',
      label: 'Tipo Unidad',
      fieldtype: 'Select',
      default: 'NA',
      options: ['NA', 'Kg', 'Gram', 'Hour', 'Day'],
    },
    {
      fieldname: 'itemType',
      label: 'Type',
      placeholder: 'Sales',
      fieldtype: 'Select',
      default: 'Product',
      options: ['Product', 'Service'],
    },
    {
      fieldname: 'rate',
      label: 'Precio venta',
      fieldtype: 'Currency',
      placeholder: '0.00',
      default: 0,
      validate(value) {
        if (!value) {
          throw new frappe.errors.ValidationError(
            'El precio de venta debe de ser mayor a Q0.00'
          );
        }
      },
    },
    {
      fieldname: 'costRate',
      label: 'Precion Costo',
      fieldtype: 'Currency',
      placeholder: '0.00',
      default: 0
    },
    {
      fieldname: 'incomeAccount',
      label: 'Income',
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Sales',
      required: 0,
      default: 'Activos - 1',
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          rootType: 'Income',
        };
      },
      formulaDependsOn: ['itemType'],
      async formula(doc) {
        let accountName = 'Sales';
        /*let accountName = 'Service';
        if (doc.itemType === 'Product') {
          accountName = 'Sales';
        }*/

        const accountExists = await frappe.db.exists('Account', accountName);
        return accountExists ? accountName : '';
      },
    },
    {
      fieldname: 'expenseAccount',
      label: 'Expense',
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Select Account',
      required: 1,
      default: 'Activos - 1',
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          rootType: 'Expense',
        };
      },
      formulaDependsOn: ['itemType'],
      async formula() {
        const cogs = await frappe.db
          .knex('Account')
          .where({ accountType: 'Cost of Goods Sold' });
        if (cogs.length === 0) {
          return '';
        } else {
          return cogs[0].name;
        }
      },
    },
    {
      fieldname: 'tax',
      label: 'Tax',
      fieldtype: 'Link',
      target: 'Tax',
      placeholder: 'GST',
    }
  ],
  quickEditFields: [
    'barCode',
    'costRate',
    'rate',
    'amount',
    'minAmount',
    'dateExpired',
    'supplier',
    'description',
  ],
  actions: [
    {
      label: _('Nueva Venta'),
      condition: (doc) => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('SalesInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate,
          tax: doc.tax,
        });
        router.push(`/edit/SalesInvoice/${invoice.name}`);
      },
    },
    {
      label: _('New Bill'),
      condition: (doc) => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('PurchaseInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate,
          tax: doc.tax,
        });
        router.push(`/edit/PurchaseInvoice/${invoice.name}`);
      },
    },
  ],
  methods: {
    async getSuppliers2() {
      const suppliers = await frappe.db.knex('Party');
      const list = suppliers.map(
        (item) => `${item.name} - ${item.phone || '########'}`
      );
      list.push('NA')
      console.log(list)
      return list;
    }
  }
};


