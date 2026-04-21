const INCOMPATIBLE_PAIRS = [
  ['cura ferite e infezioni',           'veleno paralizzante se distillato'],
  ['calmante mentale',                  'provoca allucinazioni'],
  ['induce sonno profondo',             'rafforza resistenza fisica'],
  ['neutralizza tossine',               'veleno paralizzante se distillato'],
  ['potenzia rituali divini',           'provoca allucinazioni'],
  ['antidoto universale leggero',       'veleno paralizzante se distillato'],
  ['induce sonno profondo',             'amplifica incantesimi'],
  ['calmante mentale',                  'ingrediente per esplosivi arcani'],
  ['neutralizza tossine',               'ingrediente per esplosivi arcani'],
];

export function analyzeCoherence(herbs, stabilizer) {
  if (herbs.length === 0) return { level: null, conflicts: [], uses: [] };

  const uses = herbs.map(h => h.use);
  const uniqueUses = [...new Set(uses)];
  const conflicts = [];

  for (let i = 0; i < uses.length; i++) {
    for (let j = i + 1; j < uses.length; j++) {
      for (const [a, b] of INCOMPATIBLE_PAIRS) {
        if ((uses[i] === a && uses[j] === b) || (uses[i] === b && uses[j] === a)) {
          const conflict = `${uses[i]} ✕ ${uses[j]}`;
          if (!conflicts.includes(conflict)) conflicts.push(conflict);
        }
      }
    }
  }

  const hasStabilizer = !!stabilizer;
  const tooManyUses = uniqueUses.length > 3;

  let level;
  if (conflicts.length >= 2) {
    level = 'pericolosa';
  } else if (conflicts.length === 1) {
    level = 'caotica';
  } else if (tooManyUses || !hasStabilizer) {
    level = 'debole';
  } else {
    level = 'coerente';
  }

  return { level, conflicts, uses: uniqueUses };
}

export const COHERENCE_META = {
  coerente:   { label: 'Coerente',   color: '#2ecc71', bg: 'rgba(46,204,113,0.15)',  icon: '✅' },
  debole:     { label: 'Debole',     color: '#f0c040', bg: 'rgba(240,192,64,0.15)',  icon: '⚠️' },
  caotica:    { label: 'Caotica',    color: '#e67e22', bg: 'rgba(230,126,34,0.15)',  icon: '🌀' },
  pericolosa: { label: 'Pericolosa', color: '#e74c3c', bg: 'rgba(231,76,60,0.15)',   icon: '💀' },
};
