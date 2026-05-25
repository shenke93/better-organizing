import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Plus, Package, CalendarOff, SlidersHorizontal } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterChips } from '../components/ui/FilterChips';
import { ItemGrid } from '../components/items/ItemGrid';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ItemDetail } from '../components/items/ItemDetail';
import { useToast } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';
import { GuidingBoard } from '../components/ui/GuidingBoard';
import './Pages.css';

export default function InventoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { items, places, storageLocations, deleteItem } = useInventory();

  // Layout View Mode State
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('instock-view-mode') || 'grid';
  });

  // Collapsible Filters State
  const [showFilters, setShowFilters] = useState(false);

  // Modal State for Previewing
  const [selectedItem, setSelectedItem] = useState(null);

  // Place Filter State (we handle placeId filtering in the page because hook does not have storageLocations list)
  const [placeFilter, setPlaceFilter] = useState('');

  // Pre-filter items by placeId if selected
  const itemsForSearch = useMemo(() => {
    if (!placeFilter) return items;
    const placeStorageIds = storageLocations
      .filter((sl) => sl.placeId === placeFilter)
      .map((sl) => sl.id);
    return items.filter((item) => placeStorageIds.includes(item.storageLocationId));
  }, [items, placeFilter, storageLocations]);

  // Hook Search & Filters
  const {
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
  } = useSearch(itemsForSearch);

  const handleToggleViewMode = () => {
    const nextMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(nextMode);
    localStorage.setItem('instock-view-mode', nextMode);
  };

  const handleEditItem = (item) => {
    setSelectedItem(null);
    navigate(`/edit/${item.id}`);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(t('inventory.deleteConfirm', { name: item.name }))) {
      try {
        await deleteItem(item.id);
        addToast(t('item.deleteSuccess'), 'success');
        setSelectedItem(null);
      } catch (err) {
        addToast(t('common.error'), 'error');
      }
    }
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setPlaceFilter('');
  };

  // Build filter choices
  const categoryOptions = [
    { value: null, label: t('inventory.filterAll') },
    { value: 'food', label: t('category.food'), icon: '🍎' },
    { value: 'clothing', label: t('category.clothing'), icon: '👕' },
    { value: 'goods', label: t('category.goods'), icon: '📦' },
    { value: 'other', label: t('category.other'), icon: '📋' },
  ];

  const expiryOptions = [
    { value: null, label: t('inventory.filterAll') },
    { value: 'fresh', label: t('expiry.fresh'), icon: '🟢' },
    { value: 'warning', label: t('expiry.warning'), icon: '🟡' },
    { value: 'expired', label: t('expiry.expired'), icon: '🔴' },
  ];

  return (
    <div className="inventory-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">{t('inventory.title')}</h1>
          <p className="page-subtitle">{t('inventory.subtitle')}</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/add')}>
          {t('inventory.addItem')}
        </Button>
      </div>

      <GuidingBoard pageKey="inventory" />

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('inventory.noItems')}
          description={t('inventory.noItemsDescription')}
          action={
            <Button variant="primary" icon={Plus} onClick={() => navigate('/add')}>
              {t('inventory.addItem')}
            </Button>
          }
        />
      ) : (
        <>
          {/* Filters Dashboard Toolbar */}
          <div className="inventory-toolbar glass-card">
            {/* Search row */}
            <div className="toolbar-search-row">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t('inventory.searchPlaceholder')}
                className="inventory-search-bar"
              />

              <div className="toolbar-actions">
                {/* Advanced Filters Toggle */}
                <button
                  className={`layout-toggle-btn ${showFilters ? 'bottom-nav-item-active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                  title="Toggle Advanced Filters"
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal size={18} />
                </button>

                {/* Layout Switcher */}
                <button
                  className="layout-toggle-btn"
                  onClick={handleToggleViewMode}
                  title={viewMode === 'grid' ? t('inventory.listView') : t('inventory.gridView')}
                  aria-label="Toggle layout"
                >
                  {viewMode === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
                </button>
              </div>
            </div>

            {/* Collapsible Chips & Dropdowns filters */}
            {showFilters && (
              <div className="toolbar-chips-row animate-fade-in">
                {/* Dropdowns inside filters panel */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                  {/* Place Filter Dropdown */}
                  <select
                    className="picker-select place-filter-select"
                    value={placeFilter}
                    onChange={(e) => setPlaceFilter(e.target.value)}
                  >
                    <option value="">{t('item.selectPlace')}</option>
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.name}
                      </option>
                    ))}
                  </select>

                  {/* Sort Dropdown */}
                  <select
                    className="picker-select sort-select"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                  >
                    <option value="createdAt-desc">{t('inventory.sortBy')}: {t('inventory.sortDateAdded')} (↓)</option>
                    <option value="createdAt-asc">{t('inventory.sortBy')}: {t('inventory.sortDateAdded')} (↑)</option>
                    <option value="name-asc">{t('inventory.sortBy')}: {t('inventory.sortName')} (A-Z)</option>
                    <option value="name-desc">{t('inventory.sortBy')}: {t('inventory.sortName')} (Z-A)</option>
                    <option value="expiryDate-asc">{t('inventory.sortBy')}: {t('inventory.sortExpiry')} (↓)</option>
                    <option value="quantity-desc">{t('inventory.sortBy')}: {t('inventory.sortQuantity')} (↓)</option>
                  </select>
                </div>

                <div className="chips-group">
                  <span className="chips-group-label">{t('item.category')}:</span>
                  <FilterChips
                    options={categoryOptions}
                    value={filters.category}
                    onChange={(val) => updateFilter('category', val)}
                  />
                </div>

                <div className="chips-group" style={{ marginTop: 'var(--space-2)' }}>
                  <span className="chips-group-label">{t('dashboard.expiringSoon')}:</span>
                  <FilterChips
                    options={expiryOptions}
                    value={filters.expiryStatus}
                    onChange={(val) => updateFilter('expiryStatus', val)}
                  />
                </div>

                {(searchQuery || filters.category || filters.expiryStatus || placeFilter) && (
                  <button className="clear-all-filters-btn" onClick={handleClearAllFilters}>
                    {t('common.close') ? 'Clear All Filters' : 'Clear All Filters'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Item Grid/List list */}
          <div className="inventory-results">
            <ItemGrid
              items={filteredItems}
              viewMode={viewMode}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onView={(item) => setSelectedItem(item)}
            />
          </div>
        </>
      )}

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={t('item.details')}
        size="md"
      >
        {selectedItem && (
          <ItemDetail
            item={selectedItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </Modal>
    </div>
  );
}
