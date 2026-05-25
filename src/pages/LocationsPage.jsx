import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Home, Box } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../components/ui/Toast';
import { PlaceCard } from '../components/locations/PlaceCard';
import { PlaceForm } from '../components/locations/PlaceForm';
import { StorageLocationForm } from '../components/locations/StorageLocationForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { GuidingBoard } from '../components/ui/GuidingBoard';
import './Pages.css';

export default function LocationsPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { 
    places, 
    addPlace, 
    updatePlace, 
    deletePlace,
    addStorageLocation,
    updateStorageLocation,
    deleteStorageLocation
  } = useInventory();

  // Modals state management
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'addPlace' | 'editPlace' | 'addStorage' | 'editStorage'
    placeId: null, // For adding sub storage location
    data: null, // For editing
  });

  const handleOpenModal = (type, placeId = null, data = null) => {
    setModalState({
      isOpen: true,
      type,
      placeId,
      data,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      placeId: null,
      data: null,
    });
  };

  // Place operations
  const handlePlaceSubmit = async (placeData) => {
    try {
      if (modalState.type === 'editPlace') {
        await updatePlace({ ...modalState.data, ...placeData });
        addToast(t('locations.updatePlaceSuccess'), 'success');
      } else {
        await addPlace(placeData);
        addToast(t('locations.addPlaceSuccess'), 'success');
      }
      handleCloseModal();
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  const handleDeletePlace = async (place) => {
    if (window.confirm(t('locations.deletePlaceConfirm', { name: place.name }))) {
      try {
        await deletePlace(place.id);
        addToast(t('locations.deletePlaceSuccess'), 'success');
      } catch (err) {
        addToast(t('common.error'), 'error');
      }
    }
  };

  // Storage Location operations
  const handleStorageSubmit = async (storageData) => {
    try {
      if (modalState.type === 'editStorage') {
        await updateStorageLocation({ ...modalState.data, ...storageData });
        addToast(t('locations.updateStorageSuccess'), 'success');
      } else {
        await addStorageLocation(storageData);
        addToast(t('locations.addStorageSuccess'), 'success');
      }
      handleCloseModal();
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  const handleDeleteStorage = async (storage) => {
    if (window.confirm(t('locations.deleteStorageConfirm', { name: storage.name }))) {
      try {
        await deleteStorageLocation(storage.id);
        addToast(t('locations.deleteStorageSuccess'), 'success');
      } catch (err) {
        addToast(t('common.error'), 'error');
      }
    }
  };

  return (
    <div className="locations-page animate-fade-in">
      <div className="locations-header">
        <div>
          <h1 className="page-title">{t('locations.title')}</h1>
          <p className="page-subtitle">{t('locations.subtitle')}</p>
        </div>
        <div className="locations-actions-top">
          <Button 
            variant="secondary" 
            icon={Box} 
            onClick={() => handleOpenModal('addStorage')}
            disabled={places.length === 0}
          >
            {t('locations.addStorage')}
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => handleOpenModal('addPlace')}
          >
            {t('locations.addPlace')}
          </Button>
        </div>
      </div>

      <GuidingBoard pageKey="locations" />

      {places.length === 0 ? (
        <EmptyState
          icon={Home}
          title={t('locations.noPlaces')}
          description={t('locations.noPlacesDescription')}
          action={
            <Button 
              variant="primary" 
              icon={Plus} 
              onClick={() => handleOpenModal('addPlace')}
            >
              {t('locations.addPlace')}
            </Button>
          }
        />
      ) : (
        <div className="locations-grid">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onEditPlace={() => handleOpenModal('editPlace', null, place)}
              onDeletePlace={handleDeletePlace}
              onAddStorage={(placeId) => handleOpenModal('addStorage', placeId)}
              onEditStorage={(sl) => handleOpenModal('editStorage', null, sl)}
              onDeleteStorage={handleDeleteStorage}
            />
          ))}
        </div>
      )}

      {/* Global CRUD Modals */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={
          modalState.type === 'addPlace' 
            ? t('locations.addPlace') 
            : modalState.type === 'editPlace' 
              ? t('locations.editPlace') 
              : modalState.type === 'addStorage' 
                ? t('locations.addStorage') 
                : t('locations.editStorage')
        }
        size="md"
      >
        {/* Render Place Form */}
        {(modalState.type === 'addPlace' || modalState.type === 'editPlace') && (
          <PlaceForm
            initialData={modalState.data}
            onSubmit={handlePlaceSubmit}
            onCancel={handleCloseModal}
          />
        )}

        {/* Render Storage Location Form */}
        {(modalState.type === 'addStorage' || modalState.type === 'editStorage') && (
          <StorageLocationForm
            placeId={modalState.placeId}
            initialData={modalState.data}
            onSubmit={handleStorageSubmit}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
}
