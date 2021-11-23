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
      fieldtype: 'Number',
      placeholder: '0',
    },
    {
      fieldname: 'minAmount',
      label: 'Existencia Minima',
      fieldtype: 'Number',
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


