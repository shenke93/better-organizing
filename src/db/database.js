import Dexie from 'dexie';

export const db = new Dexie('InStockDB');

db.version(1).stores({
  items:
    'id, name, category, subcategory, storageLocationId, expiryDate, purchaseDate, createdAt, updatedAt',
  places: 'id, name, sortOrder, createdAt',
  storageLocations: 'id, placeId, name, sortOrder, createdAt',
});

db.version(2).stores({
  items:
    'id, name, category, subcategory, storageLocationId, expiryDate, registrationDate, createdAt, updatedAt',
}).upgrade(async (tx) => {
  // Migrate existing items from purchaseDate to registrationDate
  await tx.items.toCollection().modify((item) => {
    if (item.purchaseDate !== undefined) {
      item.registrationDate = item.purchaseDate;
      delete item.purchaseDate;
    }
  });
});

export default db;
