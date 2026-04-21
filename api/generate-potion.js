const sdk = require('@anthropic-ai/sdk');
const Anthropic = sdk.default || sdk.Anthropic || sdk;

function buildPrompt(herbs, stabilizer, coherence, conflicts) {
  const herbList = herbs.map(h => `- ${h.name} (${h.rarity}, utilizzo: ${h.use})`).join('\n');
  const stabLine = stabilizer
    ? `Stabilizzatore: ${stabilizer.name} (${stabilizer.rarity})`
    : 'Nessuno stabilizzatore aggiunto.';

  const conflictLine = conflicts.length > 0
    ? `Conflitti rilevati: ${conflicts.join('; ')}`
    : 'Nessun conflitto rilevato.';

  const toneGuide = {
    coerente:   'Genera una pozione solida, utile e affidabile. Effetti chiari e precisi, qualità alta.',
    debole:     'Genera una pozione di effetto ridotto o incompleto. Dadi ridotti rispetto alla norma, effetti parziali.',
    caotica:    'Genera una "Pozione Instabile di [nome]" con effetti imprevedibili e un effetto collaterale casuale ma non letale.',
    pericolosa: 'Genera un "Intruglio Fallito" o "Mistura Velenosa di [nome]" che danneggia chi la beve. Effetto negativo obbligatorio.',
  };

  return `Sei un alchimista esperto di Fenrhold, mondo fantasy medievale. Genera una pozione D&D 5e in base a questi ingredienti.

INGREDIENTI:
${herbList}
${stabLine}

ANALISI MISCELA: ${coherence.toUpperCase()} — ${conflictLine}

ISTRUZIONE: ${toneGuide[coherence]}

Rispondi SOLO con un oggetto JSON valido (nessun testo aggiuntivo, nessun backtick) con questi campi:
{
  "name": "Nome poetico della pozione in italiano",
  "effect": "Effetto meccanico D&D 5e preciso (dadi, durata, condizioni)",
  "duration": "Durata dell'effetto (es. 1 ora, 10 minuti, istantaneo)",
  "rarity": "Una di: Comune / Non Comune / Raro / Molto Raro / Leggendario",
  "dc": "DC di Crafting (numero intero, es. 12)",
  "cost": "Costo stimato in mo (es. 25 mo)",
  "color": "Colore esadecimale del liquido (es. #4a9e6f)",
  "flavorText": "Breve frase poetica evocativa (max 20 parole)",
  "sideEffect": "Effetto collaterale (stringa vuota se assente)",
  "tags": ["array", "di", "3-5", "tag", "tematici"],
  "quality": "coerente | debole | caotica | pericolosa"
}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { herbs, stabilizer, coherence, conflicts } = req.body;

  if (!herbs || herbs.length === 0) {
    return res.status(400).json({ error: 'Nessuna erba fornita' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY non configurata' });
  }

  let client;
  try {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  } catch (err) {
    return res.status(500).json({ error: 'Errore inizializzazione client AI: ' + err.message });
  }

  try {
    const prompt = buildPrompt(herbs, stabilizer, coherence, conflicts || []);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = message.content[0]?.text || '';

    let potion = null;
    try {
      potion = JSON.parse(rawText);
    } catch {
      try {
        const stripped = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        potion = JSON.parse(stripped);
      } catch {
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) {
          try { potion = JSON.parse(match[0]); } catch {}
        }
      }
    }

    if (!potion) {
      return res.status(500).json({ error: 'Parsing fallito', raw: rawText });
    }

    return res.status(200).json({ potion });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Errore interno' });
  }
};
