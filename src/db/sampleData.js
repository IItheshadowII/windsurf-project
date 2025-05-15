import db from '../db';

export async function seedSampleData() {
  await db.products.bulkAdd([
    { name: 'Widget A', category: 'Gadgets', supplierId: 1, costPrice: 10, salePrice: 15, sku: 'WIDGETA001', stock: 50 },
    { name: 'Widget B', category: 'Gadgets', supplierId: 1, costPrice: 12, salePrice: 18, sku: 'WIDGETB001', stock: 20 },
    { name: 'Gizmo C', category: 'Tools', supplierId: 2, costPrice: 20, salePrice: 30, sku: 'GIZMOC001', stock: 10 },
  ]);
  await db.suppliers.bulkAdd([
    { name: 'Acme Corp', contact: 'John Doe', phone: '123-456-7890', email: 'acme@example.com', address: '123 Main St' },
    { name: 'Tools Inc', contact: 'Jane Smith', phone: '555-123-4567', email: 'tools@example.com', address: '456 Tool Ave' },
  ]);
  await db.sales.bulkAdd([
    {
      date: new Date().toISOString(),
      items: [
        { productId: 1, name: 'Widget A', quantity: 2, costPrice: 10, salePrice: 15 },
        { productId: 2, name: 'Widget B', quantity: 1, costPrice: 12, salePrice: 18 }
      ],
      total: 48, // 2x15 + 1x18
      paymentType: 'cash',
      discount: 0,
      change: 2,
      receipt: '0001-000001'
    },
    {
      date: new Date(Date.now()-86400000).toISOString(),
      items: [
        { productId: 3, name: 'Gizmo C', quantity: 1, costPrice: 20, salePrice: 30 }
      ],
      total: 30,
      paymentType: 'card',
      discount: 0,
      change: 0,
      receipt: '0001-000002'
    }
  ]);
  await db.settings.put({ id: 1, storeName: 'My Warehouse', currency: 'USD', taxes: 0.15 });
  await db.users.bulkAdd([
    { username: 'admin', role: 'admin', passwordHash: 'admin' },
    { username: 'cashier', role: 'cashier', passwordHash: 'cashier' }
  ]);
}
