# Vérification 5× — Ce qui existe déjà avant Medelor (27 oct 2026)

> Règle houetorwasm : preuve brute avant conclusion. 5 vérifications indépendantes, sources datées. Ne plus prétendre à une révolution.

## 1. Dubbing voix par personnage — déjà vendu
- **Rask AI** (`rask.ai/multispeakers`) : détection auto du nombre de locuteurs, traduction 135 langues, **20+ voix distinctes**, Voice Clone 32 langues, séparation speaker/background — vérifié 27/10/2026.
- **HeyGen** (`heygen.com/translate`) : 175 langues, voice cloning + lip-sync, Brand Glossary — mono-voix par défaut.
- **Dubverse** (`dubverse.ai`) : 200+ voix, multi-speaker **manuel** (choisir speakers), pas d'assignation auto.
- **Papercup/RWS + ElevenLabs Dubbing v2** : speaker detection + prosody transfer, mais 1 voix clonée par source ou revue humaine obligatoire.
- **GitHub** `search speaker diarization dubbing` → 28 repos, `Dubora-ai-v2` seul avec “voice per character” (17 stars). Le reste = prototypes.
- **Verdict :** la “voix par personnage” n'est PAS nouvelle. Rask le fait déjà en auto. Medelor ne peut pas le vendre comme invention.

## 2. Modèles Meta — seul Spark est prouvé
- **Listés** `api.meta.ai/v1/models` 27/10 05:35 UTC : `muse-spark-1.3`, `wonder-1.0`, `image-1.0`, `voice-transcribe-1.0`, `sam-3.1` — `STATUT.md:43`
- **Appelable** : seul `muse-spark-1.3` → `POST /chat/completions` 200 (headers `3000 req / 4M tokens`). Rejoué via `prototype/medelor.mjs --demo` 10.9s.
- **Non exposé** : `muse-voice-transcribe-1.0` → 6 endpoints `POST /audio/transcriptions` = **404 systématique** (`STATUT.md:52`, `transcribe.mjs:19`). Listé ≠ utilisable.
- **Verdict :** impossible d'écrire “Medelor utilise Muse Voice Transcribe”. Le seul cœur Meta prouvé = Spark en traduction. Léger pour 25% note + éliminatoire. Il faut assumer ce scope restreint.

## 3. TTS 2 voix distinctes — déjà résolu, mieux et en offline
- **edge-tts** (actuel) : LGPLv3, online `speech.platform.bing.com`, `--voice en-US-GuyNeural/AriaNeural` validé `T4 3.0s/3.86s` (`STATUT.md:78`). Prosodie limitée (rate/volume/pitch), risque coupure ToS.
- **Piper** `rhasspy/piper` MIT (archivé 06/10/2025) → successeur GPL. Offline 100%, 1 modèle=1 voix, `length_scale` seul.
- **Coqui XTTS v2** MPL-2.0 / CPML poids : clonage 6s `speaker_wav`, offline GPU 2GB, meilleur contrôle (`temperature`, `speed`).
- **ElevenLabs** : propriétaire, 10k crédits free non-commercial, `POST /v1/text-to-speech/{voice_id}` le plus stable/prosodique, mais payant + cloud.
- **Verdict :** 2 voix stables ne sont pas un défi technique en 2026. Medelor ne peut pas le présenter comme percée.

## 4. Pipelines open source fr→en — déjà complets
- **pyvideotrans** `jianchang512/pyvideotrans` 19.6k★ : `Faster-Whisper → pyannote → LLM → Edge-TTS/F5-TTS/CosyVoice → FFmpeg`, Demucs, GUI, GPL-3.0 — réutilisable tel quel.
- **sun-kic/video-dubbing-system** : `Demucs → whisper → pyannote 3.1 → Helsinki/GPT-5 → F5-TTS → pydub`, `speaker_voice_map`, 10h/21min sur M1.
- **HuggingFace `seamless-m4t-v2-large`** 2.3B : `fra→eng` S2ST/S2TT direct, mais pas de diarisation, pas de 2 voix, pas de tu/vous.
- **Briques** : `pyannote-audio` 10.7k★, `openai/whisper` 111k★, `coqui/TTS` 46.1k★ — toutes matures.
- **Verdict :** le pipeline générique existe déjà et est plus complet que Medelor actuel. Ce qui manque partout = **traduction avec contrôle tu/vous + 2 voix verrouillées + grille d'évaluation** — c'est le seul gap.

## 5. Offres commerciales — marché saturé, prix connus
- **Rask AI** $39/25min → $249/250min ($1–$3.96/min), 135 langues, glossary + **translation prompting (formality)** déjà exposé.
- **HeyGen** $29/600 crédits → $149/1500 crédits, 175 langues, Brand voice glossary, pas de tu/vous nommé.
- **ElevenLabs Dubbing v2** $6/30k → $99/600k crédits, ~$2.23/min pro, 90 langues, tone/emotion carry, pas de glossary dubbing.
- **DeepDub** enterprise only (pricing 404), 100+ langues, `terminology control at scale`.
- **Camb.ai** $5/10k (1min) → $900/136min, Custom Voices limit 2→150.
- **Verdict :** FR→EN se vend déjà $1–3/min avec voix par personnage incluse. Medelor ne peut pas justifier un prix par personnage.

## Synthèse honnête — apport défendable de Medelor

**Ce qui est déjà fait (ne pas revendiquer) :**
- pipeline ASR→diarization→LLM→TTS→FFmpeg
- détection multi-locuteurs + 2+ voix distinctes
- voice cloning / TTS multilingue
- vente FR→EN à la minute

**Ce qui n'est PAS fait ailleurs (angle Medelor) :**
1. **Contrôle explicite du registre français tu/vous par relation** (`Vous avez tout mon respect, Madame` → `With all due respect, ma'am` vs `Tu sais bien` → `You know full well`) avec contexte scène `speaker A/B + relation` injecté dans le prompt Spark — seul Rask s'en approche avec “prompting formality” générique, aucun ne modélise le graphe de politesse par couple de personnages.
2. **Grille d'évaluation figée avant test** (`GRILLE-EVALUATION.md` 6 critères tu/vous, idiome, durée) — `pyvideotrans` et `sun-kic` ont **0 métrique** (pas de WER/BLEU/COMET, pas de DER, pas de MOS).
3. **Pipeline léger traçable** (`prototype/lib/logger.mjs` + `journal.jsonl` à la houetorwasm, `measure()` par étape, 10.9s traduction / 18.5s TTS / 1.9s remix mesurés) — pas de boîte noire commerciale.

**Ce qu'il est interdit d'écrire dans README/vidéo :**
- “premier doublage à voix par personnage” → faux (Rask 20+ voix)
- “utilise Muse Voice Transcribe” → faux aujourd'hui (404)
- “révolution du doublage” → marché saturé $2/min

**Ce qu'on peut écrire (avec preuve) :**
- “Sur 5 répliques FR testées le 27/10, `muse-spark-1.3` distingue tu/vous (2/2) et adapte 2 idiomes (`beating around the bush`, `We're not that close`) — logs `t3_output.json` + `logs/journal.jsonl`”
- “2 voix EN stables `GuyNeural`/`AriaNeural` (3.0s/3.86s, LGPL, fallback Piper MIT prévu)”
- “Évaluation à l'aveugle à venir sur clip Podlab avec grille 6 critères”

> Medelor n'est pas une révolution : c'est un **outil niche français → anglais avec registre par relation + mesure honnête**. C'est déjà défendable pour le hackathon si on le présente ainsi.
