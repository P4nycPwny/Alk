import { RARITY_COLOR, USE_EMOJI } from '../data/plants.js';

export default function PlantCard({ plant, selected, onToggle, disabled }) {
  const rarityColor = RARITY_COLOR[plant.rarity];
  const emoji = USE_EMOJI[plant.use] || '🌿';

  return (
    <button
      onClick={() => onToggle(plant)}
      disabled={disabled && !selected}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '10px 12px',
        background: selected
          ? 'rgba(168,230,207,0.12)'
          : disabled
          ? 'rgba(255,255,255,0.02)'
          : 'rgba(255,255,255,0.04)',
        border: selected
          ? `1.5px solid #a8e6cf`
          : `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 8,
        cursor: disabled && !selected ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        opacity: disabled && !selected ? 0.4 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {selected && (
        <span style={{
          position: 'absolute', top: 4, right: 6,
          fontSize: 10, color: '#a8e6cf', fontFamily: 'monospace',
        }}>✓</span>
      )}
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: 13,
        color: '#e8f4e8',
        lineHeight: 1.2,
      }}>{plant.name}</span>
      <span style={{
        fontSize: 10,
        color: rarityColor,
        fontFamily: 'monospace',
        letterSpacing: '0.02em',
      }}>{plant.rarity}</span>
      <span style={{
        fontSize: 10,
        color: '#8aab8a',
        fontFamily: 'monospace',
      }}>{plant.cost}</span>
    </button>
  );
}
