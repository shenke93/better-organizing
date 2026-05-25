import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CATEGORIES } from '../../utils/constants';
import './CategoryChart.css';

export function CategoryChart({ items }) {
  const { t } = useTranslation();

  // Calculate counts per category
  const dataMap = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = CATEGORIES.map((cat) => ({
    id: cat.id,
    name: t(`category.${cat.id}`),
    value: dataMap[cat.id] || 0,
    color: cat.color,
  })).filter((d) => d.value > 0);

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  if (total === 0) {
    return (
      <div className="category-chart-container glass-card">
        <h4 className="chart-title">{t('dashboard.categoryDistribution')}</h4>
        <div className="chart-empty-state">
          <span>{t('common.noData')}</span>
        </div>
      </div>
    );
  }

  // Custom tooltips matching theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(0);
      return (
        <div className="chart-tooltip">
          <span className="tooltip-dot" style={{ backgroundColor: data.color }} />
          <span className="tooltip-label">{data.name}:</span>
          <span className="tooltip-value">{data.value} ({percentage}%)</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="category-chart-container glass-card stagger-item">
      <h4 className="chart-title">{t('dashboard.categoryDistribution')}</h4>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="legend-text">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-center-label">
          <span className="total-count">{total}</span>
          <span className="total-label">{t('dashboard.totalItems')}</span>
        </div>
      </div>
    </div>
  );
}
