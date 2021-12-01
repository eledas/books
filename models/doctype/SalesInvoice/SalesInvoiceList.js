import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'SalesInvoice',
  title: _('Ventas'),
  formRoute: name => `/edit/SalesInvoice/${name}`,
  columns: [
    'customer',
    'name',
    getStatusColumn('SalesInvoice'),
    'date',
    'grandTotal',
    'outstandingAmount'
  ]
};
