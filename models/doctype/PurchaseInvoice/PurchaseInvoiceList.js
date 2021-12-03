import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'PurchaseInvoice',
  title: _('Compras'),
  formRoute: name => `/edit/PurchaseInvoice/${name}`,
  columns: [
    'supplier',
    'name',
    'date',
    'grandTotal'
  ]
};
