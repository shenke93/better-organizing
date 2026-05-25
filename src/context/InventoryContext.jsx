import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import db from '../db/database';
import { v4 as uuidv4 } from 'uuid';

const InventoryContext = createContext();

const initialState = {
  items: [],
  places: [],
  storageLocations: [],
  loading: true,
};

function inventoryReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        items: action.payload.items || state.items,
        places: action.payload.places || state.places,
        storageLocations: action.payload.storageLocations || state.storageLocations,
        loading: false,
      };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'ADD_PLACE':
      return { ...state, places: [...state.places, action.payload] };
    case 'UPDATE_PLACE':
      return {
        ...state,
        places: state.places.map((place) =>
          place.id === action.payload.id ? action.payload : place
        ),
      };
    case 'DELETE_PLACE':
      return {
        ...state,
        places: state.places.filter((place) => place.id !== action.payload),
        storageLocations: state.storageLocations.filter(
          (sl) => sl.placeId !== action.payload
        ),
        items: state.items.map((item) => {
          const deletedStorageIds = state.storageLocations
            .filter((sl) => sl.placeId === action.payload)
            .map((sl) => sl.id);
          if (deletedStorageIds.includes(item.storageLocationId)) {
            return { ...item, storageLocationId: undefined };
          }
          return item;
        }),
      };
    case 'ADD_STORAGE_LOCATION':
      return {
        ...state,
        storageLocations: [...state.storageLocations, action.payload],
      };
    case 'UPDATE_STORAGE_LOCATION':
      return {
        ...state,
        storageLocations: state.storageLocations.map((sl) =>
          sl.id === action.payload.id ? action.payload : sl
        ),
      };
    case 'DELETE_STORAGE_LOCATION':
      return {
        ...state,
        storageLocations: state.storageLocations.filter(
          (sl) => sl.id !== action.payload
        ),
        items: state.items.map((item) =>
          item.storageLocationId === action.payload
            ? { ...item, storageLocationId: undefined }
            : item
        ),
      };
    case 'CLEAR_ALL':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Load data from IndexedDB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [items, places, storageLocations] = await Promise.all([
          db.items.toArray(),
          db.places.orderBy('sortOrder').toArray(),
          db.storageLocations.orderBy('sortOrder').toArray(),
        ]);
        dispatch({ type: 'SET_DATA', payload: { items, places, storageLocations } });
      } catch (error) {
        console.error('Failed to load data from IndexedDB:', error);
        dispatch({ type: 'SET_DATA', payload: {} });
      }
    }
    loadData();
  }, []);

  // Item actions
  const addItem = useCallback(async (itemData) => {
    const item = {
      ...itemData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.items.add(item);
    dispatch({ type: 'ADD_ITEM', payload: item });
    return item;
  }, []);

  const updateItem = useCallback(async (itemData) => {
    const item = {
      ...itemData,
      updatedAt: new Date().toISOString(),
    };
    await db.items.put(item);
    dispatch({ type: 'UPDATE_ITEM', payload: item });
    return item;
  }, []);

  const deleteItem = useCallback(async (id) => {
    await db.items.delete(id);
    dispatch({ type: 'DELETE_ITEM', payload: id });
  }, []);

  // Place actions
  const addPlace = useCallback(async (placeData) => {
    const place = {
      ...placeData,
      id: uuidv4(),
      sortOrder: placeData.sortOrder ?? Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.places.add(place);
    dispatch({ type: 'ADD_PLACE', payload: place });
    return place;
  }, []);

  const updatePlace = useCallback(async (placeData) => {
    const place = {
      ...placeData,
      updatedAt: new Date().toISOString(),
    };
    await db.places.put(place);
    dispatch({ type: 'UPDATE_PLACE', payload: place });
    return place;
  }, []);

  const deletePlace = useCallback(async (id) => {
    // Also delete all storage locations in this place
    const storageIds = state.storageLocations
      .filter((sl) => sl.placeId === id)
      .map((sl) => sl.id);
    
    await db.storageLocations.where('placeId').equals(id).delete();
    // Unlink items from deleted storage locations
    const itemsToUpdate = state.items.filter((item) =>
      storageIds.includes(item.storageLocationId)
    );
    for (const item of itemsToUpdate) {
      await db.items.update(item.id, { storageLocationId: undefined });
    }
    await db.places.delete(id);
    dispatch({ type: 'DELETE_PLACE', payload: id });
  }, [state.storageLocations, state.items]);

  // Storage Location actions
  const addStorageLocation = useCallback(async (slData) => {
    const storageLocation = {
      ...slData,
      id: uuidv4(),
      sortOrder: slData.sortOrder ?? Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.storageLocations.add(storageLocation);
    dispatch({ type: 'ADD_STORAGE_LOCATION', payload: storageLocation });
    return storageLocation;
  }, []);

  const updateStorageLocation = useCallback(async (slData) => {
    const storageLocation = {
      ...slData,
      updatedAt: new Date().toISOString(),
    };
    await db.storageLocations.put(storageLocation);
    dispatch({ type: 'UPDATE_STORAGE_LOCATION', payload: storageLocation });
    return storageLocation;
  }, []);

  const deleteStorageLocation = useCallback(async (id) => {
    // Unlink items from this storage location
    const itemsToUpdate = state.items.filter(
      (item) => item.storageLocationId === id
    );
    for (const item of itemsToUpdate) {
      await db.items.update(item.id, { storageLocationId: undefined });
    }
    await db.storageLocations.delete(id);
    dispatch({ type: 'DELETE_STORAGE_LOCATION', payload: id });
  }, [state.items]);

  // Clear all data
  const clearAll = useCallback(async () => {
    await db.items.clear();
    await db.places.clear();
    await db.storageLocations.clear();
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Reload data (useful after import)
  const reloadData = useCallback(async () => {
    const [items, places, storageLocations] = await Promise.all([
      db.items.toArray(),
      db.places.orderBy('sortOrder').toArray(),
      db.storageLocations.orderBy('sortOrder').toArray(),
    ]);
    dispatch({ type: 'SET_DATA', payload: { items, places, storageLocations } });
  }, []);

  const value = {
    ...state,
    addItem,
    updateItem,
    deleteItem,
    addPlace,
    updatePlace,
    deletePlace,
    addStorageLocation,
    updateStorageLocation,
    deleteStorageLocation,
    clearAll,
    reloadData,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}
