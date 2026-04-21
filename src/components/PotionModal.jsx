import { RARITY_COLOR } from '../data/plants.js';
import { COHERENCE_META } from '../utils/coherence.js';

const TAG_COLORS = ['#6ab0d4','#b07adc','#2ecc71','#f0c040','#e67e22','#e74c3c','#a8e6cf'];

function Corner({ pos }) {
  const style = {
    position: 'absolute', width: 28, height: 28,
    borderColor: 'rgba(168,230,207,0.3)', borderStyle: 'solid',
    ...(pos === 'tl' ? { top: 8, left: 8, borderWidth: '2px 0 0 2px' } :
        pos === 'tr' ? { top: 8, right: 8, borderWidth: '2px 2px 0 0' } :
        pos === 'bl' ? { bottom: 8, left: 8, borderWidth: '0 0 2px 2px' } :
                       { bottom: 8, right: 8, borderWidth: '0 2px 2px 0' }),
  };
  return <div style={style} />;
}

export default function PotionModal({ potion, coherenceLevel, onClose }) {
  if (!potion) return null;

  const failed = coherenceLevel === 'pericolosa';
  const icon = failed ? '💀' : '🧪';
  const rarityColor = RARITY_COLOR[potion.rarity] || '#a8e6cf';
  const qualityMeta = coherenceLevel && coherenceLevel !== 'coerente' ? COHERENCE_META[coherenceLevel] : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #0d1f10 0%, #091209 100%)',
          border: '1px solid rgba(168,230,207,0.25)',
          borderRadius: 14,
          padding: '32px 28px 28px',
          maxWidth: 520,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{icon}</div>

          {qualityMeta && (
            <span style={{
              display: 'inline-block', marginBottom: 10,
              padding: '3px 12px',
              background: qualityMeta.bg,
              border: `1px solid ${qualityMeta.color}50`,
              borderRadius: 20, fontSize: 11,
              color: qualityMeta.color, fontFamily: 'monospace',
              letterSpacing: '0.06em',
            }}>
              {qualityMeta.icon} {qualityMeta.label.toUpperCase()}
            </span>
          )}

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 22,
            color: failed ? '#e74c3c' : '#a8e6cf',
            letterSpacing: '0.06em',
            lineHeight: 1.3,
            margin: 0,
          }}>{potion.name}</h2>
        </div>

        {/* Flavor text */}
        {potion.flavorText && (
          <p style={{
            fontFamily: "'IM Fell English', serif",
            fontStyle: 'italic',
            fontSize: 15,
            color: '#8aaa8a',
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 1.5,
            borderBottom: '1px solid rgba(168,230,207,0.1)',
            paddingBottom: 16,
          }}>"{potion.flavorText}"</p>
        )}

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
          {potion.rarity && (
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12,
              background: `${rarityColor}18`,
              border: `1px solid ${rarityColor}50`,
              color: rarityColor, fontFamily: 'monospace',
            }}>{potion.rarity}</span>
          )}
          {potion.cost && (
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12,
              background: 'rgba(240,192,64,0.12)',
              border: '1px solid rgba(240,192,64,0.3)',
              color: '#f0c040', fontFamily: 'monospace',
            }}>💰 {potion.cost}</span>
          )}
          {potion.color && (
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12,
              background: `${potion.color}22`,
              border: `1px solid ${potion.color}60`,
              color: potion.color, fontFamily: 'monospace',
            }}>● {potion.color}</span>
          )}
        </div>

        {/* Effect */}
        {potion.effect && (
          <div style={{
            background: 'rgba(168,230,207,0.06)',
            border: '1px solid rgba(168,230,207,0.12)',
            borderRadius: 8, padding: '14px 16px',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 11, color: '#5a8a5a', fontFamily: 'monospace', marginBottom: 6, letterSpacing: '0.05em' }}>
              EFFETTO MECCANICO
            </p>
            <p style={{ fontSize: 14, color: '#c8d8c0', fontFamily: "'Crimson Text', serif", lineHeight: 1.6, margin: 0 }}>
              {potion.effect}
            </p>
          </div>
        )}

        {/* Duration & DC */}
        {(potion.duration || potion.dc) && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {potion.duration && (
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '10px 12px',
              }}>
                <p style={{ fontSize: 10, color: '#4a7a4a', fontFamily: 'monospace', marginBottom: 4 }}>DURATA</p>
                <p style={{ fontSize: 13, color: '#a0c8a0', fontFamily: "'Crimson Text', serif", margin: 0 }}>{potion.duration}</p>
              </div>
            )}
            {potion.dc && (
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '10px 12px',
              }}>
                <p style={{ fontSize: 10, color: '#4a7a4a', fontFamily: 'monospace', marginBottom: 4 }}>DC CRAFTING</p>
                <p style={{ fontSize: 13, color: '#a0c8a0', fontFamily: "'Crimson Text', serif", margin: 0 }}>{potion.dc}</p>
              </div>
            )}
          </div>
        )}

        {/* Side effect */}
        {potion.sideEffect && (
          <div style={{
            background: 'rgba(231,76,60,0.08)',
            border: '1px solid rgba(231,76,60,0.25)',
            borderRadius: 8, padding: '12px 14px',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 11, color: '#e74c3c', fontFamily: 'monospace', marginBottom: 6, letterSpacing: '0.05em' }}>
              ⚠️ EFFETTO COLLATERALE
            </p>
            <p style={{ fontSize: 13, color: '#d09090', fontFamily: "'Crimson Text', serif", lineHeight: 1.5, margin: 0 }}>
              {potion.sideEffect}
            </p>
          </div>
        )}

        {/* Tags */}
        {potion.tags && potion.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {potion.tags.map((tag, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: 20,
                fontSize: 11, fontFamily: 'monospace',
                background: `${TAG_COLORS[i % TAG_COLORS.length]}15`,
                border: `1px solid ${TAG_COLORS[i % TAG_COLORS.length]}40`,
                color: TAG_COLORS[i % TAG_COLORS.length],
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px',
            background: 'rgba(168,230,207,0.08)',
            border: '1px solid rgba(168,230,207,0.2)',
            borderRadius: 8, cursor: 'pointer',
            fontFamily: "'Cinzel', serif",
            fontSize: 13, color: '#a8e6cf',
            letterSpacing: '0.08em',
            transition: 'all 0.15s ease',
          }}
        >
          Chiudi il Grimorio
        </button>
      </div>
    </div>
  );
}
