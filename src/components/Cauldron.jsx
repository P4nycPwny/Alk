import { COHERENCE_META } from '../utils/coherence.js';
import { USE_EMOJI, RARITY_COLOR } from '../data/plants.js';

export default function Cauldron({ herbs, stabilizer, coherence, onGenerate, loading, onRemoveHerb, onRemoveStabilizer }) {
  const meta = coherence.level ? COHERENCE_META[coherence.level] : null;

  return (
    <aside style={{
      background: 'rgba(12,26,14,0.95)',
      border: '1px solid rgba(168,230,207,0.15)',
      borderRadius: 12,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minWidth: 0,
    }}>
      <h2 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 16,
        color: '#a8e6cf',
        letterSpacing: '0.1em',
        textAlign: 'center',
        borderBottom: '1px solid rgba(168,230,207,0.15)',
        paddingBottom: 12,
      }}>⚗️ Calderone</h2>

      {/* Herbs list */}
      <div>
        <p style={{ fontSize: 11, color: '#5a8a5a', fontFamily: 'monospace', marginBottom: 8, letterSpacing: '0.05em' }}>
          ERBE ({herbs.length}/5)
        </p>
        {herbs.length === 0 ? (
          <p style={{ fontSize: 13, color: '#3a5a3a', fontStyle: 'italic', fontFamily: "'Crimson Text', serif" }}>
            Nessuna erba selezionata…
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {herbs.map(h => (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(168,230,207,0.06)',
                borderRadius: 6, padding: '6px 10px',
                border: '1px solid rgba(168,230,207,0.1)',
              }}>
                <span style={{ fontSize: 13, fontFamily: "'IM Fell English', serif", color: '#d0ead0' }}>
                  {USE_EMOJI[h.use] || '🌿'} {h.name}
                </span>
                <button onClick={() => onRemoveHerb(h)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#5a8a5a', fontSize: 14, lineHeight: 1, padding: '0 2px',
                }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stabilizer */}
      <div>
        <p style={{ fontSize: 11, color: '#c0a030', fontFamily: 'monospace', marginBottom: 8, letterSpacing: '0.05em' }}>
          STABILIZZATORE ({stabilizer ? 1 : 0}/1)
        </p>
        {!stabilizer ? (
          <p style={{ fontSize: 13, color: '#5a4a10', fontStyle: 'italic', fontFamily: "'Crimson Text', serif" }}>
            Nessuno stabilizzatore…
          </p>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(240,192,64,0.08)',
            borderRadius: 6, padding: '6px 10px',
            border: '1px solid rgba(240,192,64,0.2)',
          }}>
            <span style={{ fontSize: 13, fontFamily: "'IM Fell English', serif", color: '#f0d080' }}>
              ⚖️ {stabilizer.name}
            </span>
            <button onClick={onRemoveStabilizer} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8a7030', fontSize: 14, lineHeight: 1, padding: '0 2px',
            }}>×</button>
          </div>
        )}
      </div>

      {/* Coherence badge */}
      {meta && (
        <div style={{
          background: meta.bg,
          border: `1px solid ${meta.color}40`,
          borderRadius: 8, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: coherence.conflicts.length > 0 ? 8 : 0 }}>
            <span style={{ fontSize: 16 }}>{meta.icon}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: meta.color, letterSpacing: '0.05em' }}>
              MISCELA {meta.label.toUpperCase()}
            </span>
          </div>
          {coherence.conflicts.length > 0 && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {coherence.conflicts.map((c, i) => (
                <li key={i} style={{ fontSize: 11, color: '#e74c3c', fontFamily: 'monospace' }}>⚡ {c}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={herbs.length === 0 || loading}
        style={{
          padding: '12px 16px',
          background: herbs.length === 0 || loading
            ? 'rgba(168,230,207,0.05)'
            : 'linear-gradient(135deg, rgba(168,230,207,0.2), rgba(100,180,140,0.3))',
          border: `1px solid ${herbs.length === 0 || loading ? 'rgba(168,230,207,0.1)' : 'rgba(168,230,207,0.4)'}`,
          borderRadius: 8,
          color: herbs.length === 0 || loading ? '#3a6a3a' : '#a8e6cf',
          fontFamily: "'Cinzel', serif",
          fontSize: 13,
          letterSpacing: '0.08em',
          cursor: herbs.length === 0 || loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? '⚗️ Distillando…' : '🧪 Distilla Pozione'}
      </button>
    </aside>
  );
}
