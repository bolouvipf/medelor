// translate.mjs — Étape 3 : Traduction FR→EN par réplique avec Muse Spark
// Coeur Meta du pipeline (25% note + étape 1 éliminatoire) — cf PLAN-API-META.md
import { log, error, measure } from "../lib/logger.mjs";

const API_URL = process.env.MEDELEOR_API_URL || "https://api.meta.ai/v1";
const API_KEY = process.env.META_API_KEY || process.env.MEDELEOR_API_KEY || "";
const MODEL = process.env.MEDELEOR_MODEL || "muse-spark-1.3";

export async function translate(replicas, context = {}) {
  const scope = "translate";
  return measure(scope, `traduction ${replicas.length} répliques via ${MODEL}`, async () => {
    if (!API_KEY) throw new Error("META_API_KEY manquante — voir STATUT.md T1");

    const prompt = `Tu es traducteur français→anglais pour doublage où chaque personnage garde sa voix.
Contexte scène: ${context.scene || "2 personnages, relation à préciser"}
Consigne: pour chaque réplique, renvoie JSON {id, fr, en, register_choice, emotion, duration_note}
Répliques:
${replicas.map((r, i) => `${i + 1}. "${r.text || r}" speaker=${r.speaker || "?"}`).join("\n")}
Réponds UNIQUEMENT en JSON {"translations":[...]}`;

    log(scope, "appel Muse Spark", { model: MODEL, replicas: replicas.length });

    const res = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content: prompt }], max_tokens: 4000 }),
    });

    const data = await res.json();
    log(scope, `réponse ${res.status}`, { usage: data.usage, request_id: res.headers.get("x-request-id") });

    if (!res.ok) {
      error(scope, "échec traduction", { status: res.status, body: JSON.stringify(data).slice(0, 800) });
      throw new Error(`Muse Spark ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);
    }

    const content = data.choices?.[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // extraction JSON si le modèle ajoute du texte
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }

    log(scope, "traduction OK", { translations: parsed?.translations?.length });
    return { raw: data, translations: parsed?.translations || [], content };
  });
}
