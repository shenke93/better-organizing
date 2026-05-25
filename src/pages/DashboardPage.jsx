import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, AlertTriangle, BatteryWarning } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { StatsCard } from '../components/dashboard/StatsCard';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { ExpiringList } from '../components/dashboard/ExpiringList';
import { RecentItems } from '../components/dashboard/RecentItems';
import { Modal } from '../components/ui/Modal';
import { ItemDetail } from '../components/items/ItemDetail';
import { useToast } from '../components/ui/Toast';
import { daysUntilExpiry } from '../utils/expiry';
import { LOW_STOCK_THRESHOLD } from '../utils/constants';
import { OnboardingModal } from '../components/ui/OnboardingModal';
import { GuidingBoard } from '../components/ui/GuidingBoard';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { items, places, deleteItem } = useInventory();

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Auto-open onboarding if no places exist
  useEffect(() => {
    if (places.length === 0) {
      setIsOnboardingOpen(true);
    } else {
      setIsOnboardingOpen(false);
    }
  }, [places.length]);

  // Expiry Calculations
  const expiringCount = items.filter((item) => {
    if (!item.expiryDate) return false;
    const days = daysUntilExpiry(item.expiryDate);
    return days <= 7;
  }).length;

  // Low Stock Calculations
  const lowStockCount = items.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD).length;

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

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('dashboard.title')}</h1>
        <p className="page-subtitle">{t('dashboard.subtitle')}</p>
      </div>

      <GuidingBoard pageKey="dashboard" />

      {/* Stats Cards Grid */}
      <div className="grid-3">
        <StatsCard
          title={t('dashboard.totalItems')}
          value={items.length}
          icon={Package}
          status="info"
        />
        <StatsCard
          title={t('dashboard.expiringSoon')}
          value={expiringCount}
          icon={AlertTriangle}
          status={expiringCount > 0 ? 'danger' : 'fresh'}
          description={expiringCount > 0 ? t('dashboard.expiringSoon') : t('dashboard.noExpiringItems')}
        />
        <StatsCard
          title={t('dashboard.lowStock')}
          value={lowStockCount}
          icon={BatteryWarning}
          status={lowStockCount > 0 ? 'warning' : 'fresh'}
        />
      </div>

      {/* Main dashboard grid */}
      <div className="grid-3" style={{ marginTop: 'var(--space-6)', alignItems: 'stretch' }}>
        {/* Category distribution */}
        <div style={{ gridColumn: 'span 1' }}>
          <CategoryChart items={items} />
        </div>

        {/* Expiring items */}
        <div style={{ gridColumn: 'span 1' }}>
          <ExpiringList 
            items={items} 
            onViewAll={() => navigate('/inventory')} 
            onViewItem={(item) => setSelectedItem(item)}
          />
        </div>

        {/* Recently added */}
        <div style={{ gridColumn: 'span 1' }}>
          <RecentItems 
            items={items} 
            onViewAll={() => navigate('/inventory')} 
            onViewItem={(item) => setSelectedItem(item)}
          />
        </div>
      </div>

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

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
