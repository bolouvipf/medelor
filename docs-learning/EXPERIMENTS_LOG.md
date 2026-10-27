# EXPERIMENTS_LOG — Medelor (inspiré houetorwasm)

> Format : `## Exp 00N — Titre (date)` · Contexte · Action · **Preuves brutes** · Résultat · Suite.
> Preuve brute obligatoire : sortie de commande, chiffre mesuré, log `logs/journal.jsonl` + `logs/medelor.log`

---

## Exp 001 — Tests T1-T4 jour 1 (2026-10-27)

**Contexte :** jour 1 hackathon, clip Podlab en attente (mail envoyé).

**Action :** T1 accès Meta Model API, T2 transcription, T3 traduction, T4 voix — cf `STATUT.md` Journal des mesures.

**Preuves brutes (copiées de STATUT.md) :**
- T1 `GET /v1/models` → 200 (9 modèles, `muse-spark-1.3` limite 3000 req / 4M tokens)
- T2 `POST /v1/audio/transcriptions` → 404 systématique (fallback `fr_test.mp3` 34KB)
- T3 `muse-spark-1.3` 5 répliques → `beating around the bush` OK, usage prompt 205 / completion 2096
- T4 `edge-tts` Guy 3.0s / Aria 3.86s

**Résultat :** pipeline coeur (traduction + voix) validé, transcription Meta non exposée → fallback local à prévoir.

**Suite :** scaffold `prototype/` + `logs/` réalisé pour accueillir le clip Podlab.

---

## Exp 002 — Scaffold pipeline + logs à la houetorwasm (2026-10-27)

**Contexte :** clip en attente, besoin de trâcer tout ce qui se passe et les erreurs en chemin (habitude houetorwasm).

**Action :** création `prototype/lib/logger.mjs` (INFO/WARN/ERROR, `measure()`, `journal.jsonl` + `medelor.log` + `errors.log`), 5 étapes `prototype/pipeline/*.mjs` (transcribe/diarize/translate/synthesize/remix), `prototype/medelor.mjs` (--demo / --clip), `.gitignore` (logs/.env/clips ignorés).

**Preuves brutes :**
- `logs/` + `prototype/lib/logger.mjs` + `prototype/medelor.mjs` créés
- `node prototype/medelor.mjs --demo` à tester (génère `out/medelor_demo.mp3` + logs)

**Résultat :** code prêt à recevoir `clips/podlab.mp3` dès réception du mail.

**Suite :** tester --demo, puis brancher whisper local pour T2 quand clip réel arrive.
