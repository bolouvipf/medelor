// diarize.mjs — Étape 2 : Qui parle quand (diarisation 2 personnages)
// Inspiré houetorwasm : deny-by-default sur les données, logs par runtime
import { log, measure } from "../lib/logger.mjs";

export async function diarize(transcription, opts = {}) {
  const scope = "diarize";
  return measure(scope, "diarisation 2 personnages", async () => {
    log(scope, "entrée transcription", { words: transcription.words?.length ?? 0 });

    // Si la transcription Meta fournit déjà la diarisation (option A), on la réutilise
    if (transcription.speakers) {
      log(scope, "diarisation fournie par transcription (option A)");
      return transcription.speakers;
    }

    // Option B : outil open source (pyannote / silero) — à valider licence
    log(scope, "diarisation open source non branchée — placeholder 2 personnages");
    // TODO: brancher pyannote.audio ou silero quand clip réel Podlab reçu
    // Pour l'instant on renvoie une segmentation fictive pour débloquer le pipeline
    const fake = [
      { speaker: "A", start_ms: 0, end_ms: 1500, text: "—" },
      { speaker: "B", start_ms: 1500, end_ms: 3000, text: "—" },
    ];
    log(scope, "diarisation placeholder", { segments: fake.length });
    return fake;
  });
}
