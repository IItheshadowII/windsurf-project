import Dexie from 'dexie';

const db = new Dexie('WarehouseDB');
db.version(1).stores({
  products: '++id, name, category, supplierId, costPrice, salePrice, sku, stock',
  suppliers: '++id, name, contact, phone, email, address',
  sales: '++id, date, items, total, paymentType, discount, change, receipt',
  stockMovements: '++id, productId, type, quantity, date',
  expenses: '++id, description, amount, date, recurring',
  settings: 'id, storeName, currency, taxes',
  users: '++id, username, role, passwordHash'
});

export default db;
