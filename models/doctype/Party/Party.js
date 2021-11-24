import frappe from 'frappejs';
import { _ } from 'frappejs/utils';

export default {
  name: 'Party',
  label: 'Party',
  keywordFields: ['name'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre',
      fieldtype: 'Data',
      required: 1,
      placeholder: 'Nombre',
    },
    {
      fieldname: 'company',
      label: 'Empresa',
      fieldtype: 'Data',
      placeholder: 'Empresa',
    },
    {
      fieldname: 'image',
      label: 'Image',
      fieldtype: 'AttachImage',
    },
    {
      fieldname: 'customer',
      label: 'Customer',
      fieldtype: 'Check',
    },
    {
      fieldname: 'supplier',
      label: 'Supplier',
      fieldtype: 'Check',
    },
    {
      fieldname: 'defaultAccount',
      label: 'Default Account',
      fieldtype: 'Link',
      target: 'Account',
      getFilters: (query, doc) => {
        return {
          isGroup: 0,
          accountType: doc.customer ? 'Receivable' : 'Payable',
        };
      },
      async formula(doc) {
        let accountName = 'Debtors'; // if Party is a Customer
        if (doc.supplier) {
          accountName = 'Creditors';
        }

        const accountExists = await frappe.db.exists('Account', accountName);
        return accountExists ? accountName : '';
      },
    },
    {
      fieldname: 'outstandingAmount',
      label: 'Outstanding Amount',
      fieldtype: 'Currency',
    },
    {
      fieldname: 'currency',
      label: 'Currency',
      fieldtype: 'Link',
      target: 'Currency',
      placeholder: 'INR',
      formula: () => frappe.AccountingSettings.currency,
    },
    {
      fieldname: 'email',
      label: 'Correo Electronico',
      fieldtype: 'Data',
      placeholder: 'TotoGuapo@gmail.com',
      validate: {
        type: 'email',
      },
    },
    {
      fieldname: 'phone',
      label: 'Celular',
      fieldtype: 'Data',
      placeholder: 'Celular',
      validate: {
        type: 'phone',
      },
    },
    {
      fieldname: 'address',
      label: 'Direccion',
      fieldtype: 'Link',
      target: 'Address',
      placeholder: _('Click para Crear'),
      inline: true,
    },
    {
      fieldname: 'addressDisplay',
      label: 'Address Display',
      fieldtype: 'Text',
      readOnly: true,
      formula: (doc) => {
        if (doc.address) {
          return doc.getFrom('Address', doc.address, 'addressDisplay');
        }
      },
    },
    {
      fieldname: 'gstin',
      label: 'GSTIN No.',
      fieldtype: 'Data',
      hidden: (form) => {
        return form.gstType === 'Registered Regular' ? 0 : 1;
      },
    },
  ],

  quickEditFields: [
    'email',
    'phone',
    'company',
    'address',
  ],
};
