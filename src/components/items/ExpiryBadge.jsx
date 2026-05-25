import { useTranslation } from 'react-i18next';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getExpiryStatus, formatExpiryLabel } from '../../utils/expiry';
import './ExpiryBadge.css';

export function ExpiryBadge({ expiryDate, size = 'sm' }) {
  const { t } = useTranslation();
  const status = getExpiryStatus(expiryDate);

  if (!status) return null;

  const icons = {
    fresh: CheckCircle,
    warning: Clock,
    expired: AlertTriangle,
  };
  const Icon = icons[status];

  return (
    <span className={`expiry-badge expiry-badge-${status} expiry-badge-${size}`}>
      <Icon size={size === 'sm' ? 12 : 14} />
      <span>{formatExpiryLabel(expiryDate, t)}</span>
    </span>
  );
}
