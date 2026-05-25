import Dexie from 'dexie';

export const db = new Dexie('InStockDB');

db.version(1).stores({
  items:
    'id, name, category, subcategory, storageLocationId, expiryDate, purchaseDate, createdAt, updatedAt',
  places: 'id, name, sortOrder, createdAt',
  storageLocations: 'id, placeId, name, sortOrder, createdAt',
});

export default db;
