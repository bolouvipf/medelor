// synthesize.mjs — Étape 4 : Synthèse vocale EN, une voix par personnage
// Pas de modèle Meta TTS confirmé — fallback open source (edge-tts, Piper, Coqui) cf PLAN-API-META.md
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { log, error, measure } from "../lib/logger.mjs";

const VOICES = {
  A: process.env.MEDELEOR_VOICE_A || "en-US-GuyNeural",
  B: process.env.MEDELEOR_VOICE_B || "en-US-AriaNeural",
};

export async function synthesize(translations, outDir) {
  const scope = "synthesize";
  return measure(scope, `synthèse ${translations.length} répliques`, async () => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const results = [];
    for (const t of translations) {
      const speaker = t.speaker || (t.id % 2 ? "A" : "B");
      const voice = VOICES[speaker] || VOICES.A;
      const text = t.en || t.text || "";
      const out = path.join(outDir, `${String(t.id).padStart(2, "0")}_${speaker}.mp3`);

      log(scope, `TTS speaker ${speaker} voice ${voice}`, { id: t.id, len: text.length });

      // edge-tts disponible localement (cf STATUT.md T4) — Piper/Coqui en plan B local offline
      const r = spawnSync("python", ["-m", "edge_tts", "--voice", voice, "--text", text, "--write-media", out], {
        encoding: "utf8",
        timeout: 15000,
      });

      if (r.status !== 0) {
        error(scope, `échec TTS id=${t.id}`, { stderr: r.stderr?.slice(0, 500), stdout: r.stdout?.slice(0, 200) });
        continue;
      }
      const stat = fs.statSync(out);
      log(scope, `TTS OK`, { file: path.basename(out), bytes: stat.size });
      results.push({ ...t, voice, file: out, bytes: stat.size });
    }
    return results;
  });
}
