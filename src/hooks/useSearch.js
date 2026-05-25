import { useState, useMemo, useCallback } from 'react';

export function useSearch(items, delay = 300) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: null,
    placeId: null,
    storageLocationId: null,
    expiryStatus: null, // 'fresh' | 'warning' | 'expired'
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: null,
      placeId: null,
      storageLocationId: null,
      expiryStatus: null,
    });
    setSearchQuery('');
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.subcategory?.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    // Place filter (need to check via storageLocationId -> placeId)
    if (filters.storageLocationId) {
      result = result.filter(
        (item) => item.storageLocationId === filters.storageLocationId
      );
    }

    // Expiry status filter
    if (filters.expiryStatus) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      result = result.filter((item) => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        expiry.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

        switch (filters.expiryStatus) {
          case 'expired':
            return daysLeft < 0;
          case 'warning':
            return daysLeft >= 0 && daysLeft <= 7;
          case 'fresh':
            return daysLeft > 7;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'expiryDate':
          if (!a.expiryDate && !b.expiryDate) comparison = 0;
          else if (!a.expiryDate) comparison = 1;
          else if (!b.expiryDate) comparison = -1;
          else comparison = new Date(a.expiryDate) - new Date(b.expiryDate);
          break;
        case 'quantity':
          comparison = (a.quantity || 0) - (b.quantity || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, searchQuery, filters, sortBy, sortOrder]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== null).length;
  }, [filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredItems,
    activeFilterCount,
  };
}
