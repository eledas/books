import frappe from 'frappejs';
import { _ } from 'frappejs/utils';

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
      fieldtype: 'Select',
      placeholder: 'Proveedor',
      default: 'NA',
      options: ['NA']
    },
    {
      fieldname: 'amount',
      label: 'Existencia',
      fieldtype: 'Int',
      placeholder: '0',
    },
    {
      fieldname: 'minAmount',
      label: 'Existencia Minima',
      fieldtype: 'Int',
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
      default: '',
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
      fieldname: 'rate',
      label: 'Precion venta',
      fieldtype: 'Currency',
      placeholder: '0.00',
      validate(value) {
        if (!value) {
          throw new frappe.errors.ValidationError(
            'Rate must be greater than 0'
          );
        }
      },
    },
    {
      fieldname: 'costRate',
      label: 'Precion Costo',
      fieldtype: 'Currency',
      placeholder: '0.00',
      validate(value) {
        if (!value) {
          throw new frappe.errors.ValidationError(
            'Rate must be greater than 0'
          );
        }
      },
    },
    {
      fieldname: 'incomeAccount',
      label: 'Income',
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Sales',
      required: 1,
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          rootType: 'Income',
        };
      },
      formulaDependsOn: ['itemType'],
      async formula(doc) {
        let accountName = 'Service';
        if (doc.itemType === 'Product') {
          accountName = 'Sales';
        }

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
    'unit',
    'supplier',
    'description',
  ],
  actions: [
    {
      label: _('New Invoice'),
      condition: (doc) => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('SalesInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate
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
          rate: doc.rate
        });
        router.push(`/edit/PurchaseInvoice/${invoice.name}`);
      },
    },
  ],
};


