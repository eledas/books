import { _ } from 'frappejs/utils';

export default {
  doctype: 'Item',
  title: _('Productos'),
  columns: [
    'barCode',
    'name',
    'unit',
    'amount',
    'dateExpired',
    'rate',
    'description'
  ]
}
