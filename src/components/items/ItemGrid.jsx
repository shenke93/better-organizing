import { useTranslation } from 'react-i18next';
import { PackageSearch } from 'lucide-react';
import { ItemCard } from './ItemCard';
import { EmptyState } from '../ui/EmptyState';
import './ItemGrid.css';

export function ItemGrid({ items, viewMode = 'grid', onEdit, onDelete, onView }) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={t('inventory.noResults')}
        description={t('inventory.noResultsDescription')}
      />
    );
  }

  return (
    <div className={`item-grid item-grid-${viewMode}`}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
