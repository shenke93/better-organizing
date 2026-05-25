import db from '../db/database';

/**
 * Export all InStock data to a JSON file and trigger a download.
 */
export async function exportToJSON() {
  const items = await db.items.toArray();
  const places = await db.places.toArray();
  const storageLocations = await db.storageLocations.toArray();

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'HomeStorage',
    items,
    places,
    storageLocations,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `homestorage-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON backup file.
 * @param {File} file - The JSON file to import
 * @param {'merge'|'replace'} mode - Whether to merge with or replace existing data
 * @returns {Promise<{items: number, places: number, storageLocations: number}>}
 *   Counts of imported records
 */
export async function importFromJSON(file, mode = 'merge') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.app || (data.app !== 'InStock' && data.app !== 'HomeStorage')) {
          throw new Error('Invalid HomeStorage backup file');
        }

        if (mode === 'replace') {
          await db.items.clear();
          await db.places.clear();
          await db.storageLocations.clear();
        }

        if (data.places && data.places.length > 0) {
          await db.places.bulkPut(data.places);
        }
        if (data.storageLocations && data.storageLocations.length > 0) {
          await db.storageLocations.bulkPut(data.storageLocations);
        }
        if (data.items && data.items.length > 0) {
          await db.items.bulkPut(data.items);
        }

        resolve({
          items: data.items?.length || 0,
          places: data.places?.length || 0,
          storageLocations: data.storageLocations?.length || 0,
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
