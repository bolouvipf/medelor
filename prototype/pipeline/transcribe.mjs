// transcribe.mjs — Étape 1 : Transcription FR (Meta Muse Voice Transcribe + fallback)
// Inspiré houetorwasm : preuve brute, logs à chaque appel, JSON mesures
import fs from "node:fs";
import { log, error, measure } from "../lib/logger.mjs";

const API_URL = process.env.MEDELEOR_API_URL || "https://api.meta.ai/v1";
const API_KEY = process.env.META_API_KEY || process.env.MEDELEOR_API_KEY || "";

export async function transcribe(filePath, opts = {}) {
  const scope = "transcribe";
  return measure(scope, `transcription ${filePath}`, async () => {
    if (!fs.existsSync(filePath)) throw new Error(`fichier introuvable: ${filePath}`);

    // Tentative Meta API — cf PLAN-API-META.md Étape 1 (Muse Voice Transcribe)
    if (API_KEY) {
      log(scope, "tentative Muse Voice Transcribe", { api: API_URL, model: "muse-voice-transcribe-1.0" });
      try {
        // NOTE: endpoint actuellement 404 sur api.meta.ai (cf STATUT.md T2 27 oct) — on log et on fallback
        const res = await fetch(`${API_URL}/audio/transcriptions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${API_KEY}` },
          // corps multipart à implémenter quand l'endpoint sera documenté
        });
        log(scope, `réponse Meta transcription: ${res.status}`, { status: res.status });
        if (res.ok) {
          const data = await res.json();
          log(scope, "transcription Meta OK", { words: data.words?.length });
          return data;
        }
        error(scope, "transcription Meta non disponible, fallback local", { status: res.status });
      } catch (e) {
        error(scope, "erreur réseau transcription Meta, fallback", { error: e.message });
      }
    } else {
      log(scope, "META_API_KEY absente — fallback local direct");
    }

    // Fallback local (ex: whisper local) — à brancher quand Podlab clip reçu
    log(scope, "fallback local non encore branché — placeholder");
    // TODO: picks whisper.cpp / faster-whisper quand clip Podlab reçu
    // Pour l'instant on renvoie un squelette pour que le pipeline ne bloque pas
    return {
      source: "fallback-placeholder",
      language: "fr",
      duration_ms: 0,
      words: [],
      note: "clip Podlab en attente — transcription réelle à implémenter ici (whisper local)",
    };
  });
}
