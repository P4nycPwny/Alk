import { useState, useMemo } from 'react';
import { HERBS, STABILIZERS, RARITY_ORDER, USE_EMOJI } from './data/plants.js';
import { analyzeCoherence } from './utils/coherence.js';
import PlantCard from './components/PlantCard.jsx';
import Cauldron from './components/Cauldron.jsx';
import PotionModal from './components/PotionModal.jsx';

const ALL_USES = [...new Set(HERBS.map(h => h.use))].sort();

function parsePotion(text) {
  try { return JSON.parse(text); } catch {}
  try {
    const stripped = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    return JSON.parse(stripped);
  } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  return null;
}

export default function App() {
  const [tab, setTab] = useState('erbe');
  const [search, setSearch] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [filterUse, setFilterUse] = useState('');
  const [selectedHerbs, setSelectedHerbs] = useState([]);
  const [selectedStabilizer, setSelectedStabilizer] = useState(null);
  const [potion, setPotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const coherence = useMemo(
    () => analyzeCoherence(selectedHerbs, selectedStabilizer),
    [selectedHerbs, selectedStabilizer]
  );

  const filteredHerbs = useMemo(() => HERBS.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchRarity = !filterRarity || h.rarity === filterRarity;
    const matchUse = !filterUse || h.use === filterUse;
    return matchSearch && matchRarity && matchUse;
  }), [search, filterRarity, filterUse]);

  function toggleHerb(plant) {
    const isSelected = selectedHerbs.some(h => h.id === plant.id);
    if (isSelected) {
      setSelectedHerbs(prev => prev.filter(h => h.id !== plant.id));
    } else if (selectedHerbs.length < 5) {
      setSelectedHerbs(prev => [...prev, plant]);
    }
  }

  function toggleStabilizer(plant) {
    setSelectedStabilizer(prev => prev?.id === plant.id ? null : plant);
  }

  async function generatePotion() {
    if (selectedHerbs.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-potion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          herbs: selectedHerbs,
          stabilizer: selectedStabilizer,
          coherence: coherence.level,
          conflicts: coherence.conflicts,
        }),
      });
      if (!res.ok) {
        let msg = `Errore ${res.status}`;
        try { const e = await res.json(); if (e.error) msg = e.error; } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      const parsed = data.potion ? data.potion : parsePotion(data.raw || '');
      if (!parsed) throw new Error('Risposta AI non valida');
      setPotion(parsed);
    } catch (e) {
      setError(e.message || 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }

  const selectStyle = {
    padding: '7px 10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6, color: '#a0c8a0',
    fontFamily: "'Crimson Text', serif",
    fontSize: 13, cursor: 'pointer',
    flex: 1, minWidth: 0,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #080d09 0%, #0c1a0e 50%, #080d09 100%)',
      padding: '16px',
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 28, paddingTop: 8 }}>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(20px, 5vw, 30px)',
          color: '#a8e6cf',
          letterSpacing: '0.15em',
          marginBottom: 4,
        }}>⚗️ Laboratorio di Fenrhold</h1>
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontStyle: 'italic',
          color: '#5a8a5a',
          fontSize: 14,
        }}>Arte alchemica per l'avventuriero prudente</p>
      </header>

      {/* Main layout */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(240px,320px)',
        gap: 20,
        alignItems: 'start',
      }}
        className="main-grid"
      >
        {/* Left: ingredient panel */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 16,
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
            {['erbe','stabilizzatori'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px',
                background: tab === t
                  ? t === 'erbe' ? 'rgba(168,230,207,0.12)' : 'rgba(240,192,64,0.12)'
                  : 'rgba(0,0,0,0.2)',
                border: 'none',
                borderBottom: tab === t
                  ? `2px solid ${t === 'erbe' ? '#a8e6cf' : '#f0c040'}`
                  : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                fontSize: 13,
                color: tab === t
                  ? t === 'erbe' ? '#a8e6cf' : '#f0c040'
                  : '#4a7a4a',
                letterSpacing: '0.06em',
                transition: 'all 0.15s',
              }}>
                {t === 'erbe' ? '🌿 Erbe' : '⚖️ Stabilizzatori'}
              </button>
            ))}
          </div>

          {/* Filters — only on Erbe tab */}
          {tab === 'erbe' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca erba…"
                style={{
                  ...selectStyle,
                  flex: '2 1 160px',
                  outline: 'none',
                }}
              />
              <select value={filterRarity} onChange={e => setFilterRarity(e.target.value)} style={selectStyle}>
                <option value="">Tutte le rarità</option>
                {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterUse} onChange={e => setFilterUse(e.target.value)} style={selectStyle}>
                <option value="">Tutti gli utilizzi</option>
                {ALL_USES.map(u => (
                  <option key={u} value={u}>{USE_EMOJI[u] || '🌿'} {u}</option>
                ))}
              </select>
            </div>
          )}

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}>
            {tab === 'erbe'
              ? filteredHerbs.map(p => (
                  <PlantCard
                    key={p.id} plant={p}
                    selected={selectedHerbs.some(h => h.id === p.id)}
                    onToggle={toggleHerb}
                    disabled={selectedHerbs.length >= 5}
                  />
                ))
              : STABILIZERS.map(p => (
                  <PlantCard
                    key={p.id} plant={p}
                    selected={selectedStabilizer?.id === p.id}
                    onToggle={toggleStabilizer}
                    disabled={!!selectedStabilizer && selectedStabilizer.id !== p.id}
                  />
                ))
            }
          </div>

          {tab === 'erbe' && filteredHerbs.length === 0 && (
            <p style={{ textAlign: 'center', color: '#3a5a3a', fontStyle: 'italic',
              fontFamily: "'Crimson Text', serif", padding: '24px 0', fontSize: 14 }}>
              Nessuna erba trovata con questi filtri.
            </p>
          )}
        </div>

        {/* Right: Cauldron — sticky on desktop */}
        <div style={{ position: 'sticky', top: 16 }} className="cauldron-sticky">
          <Cauldron
            herbs={selectedHerbs}
            stabilizer={selectedStabilizer}
            coherence={coherence}
            onGenerate={generatePotion}
            loading={loading}
            onRemoveHerb={h => setSelectedHerbs(prev => prev.filter(x => x.id !== h.id))}
            onRemoveStabilizer={() => setSelectedStabilizer(null)}
          />
          {error && (
            <p style={{
              marginTop: 10, padding: '10px 14px',
              background: 'rgba(231,76,60,0.1)',
              border: '1px solid rgba(231,76,60,0.3)',
              borderRadius: 8, fontSize: 13, color: '#e74c3c',
              fontFamily: "'Crimson Text', serif",
            }}>⚠️ {error}</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {potion && (
        <PotionModal
          potion={potion}
          coherenceLevel={coherence.level}
          onClose={() => setPotion(null)}
        />
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
          .cauldron-sticky {
            position: static !important;
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
