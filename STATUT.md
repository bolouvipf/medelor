# STATUT — Medelor
Dernière mise à jour : mardi 27 octobre 2026

> Le fichier CADRAGE-medelor.md reste intact. Ce fichier-ci porte tout ce qui évolue.
> Règle : une case n'est cochée que si c'est vérifié.

## Décisions prises
| Date | Décision | Source |
|---|---|---|
| 27 oct | Langue source : français. Langue cible : anglais. | Décision du porteur |
| 27 oct | Développement avec l'API Meta (Meta Model API) | Décision du porteur |

## Écarts entre le CADRAGE et le guide officiel
Le guide participant fait foi. Il corrige le CADRAGE sur ces points :

1. **Modèles Meta.** Le CADRAGE parle de « Llama via Baseten ». Le guide cite les modèles Muse (Muse Spark, Muse Wonder, Muse Image, Muse Voice Transcribe, SAM 3.1 via Meta Model API ; Muse Glimmer et Muse Spark Open en poids ouverts). Le CADRAGE est donc périmé sur ce point.
2. **Baseten.** Utiliser `meta-models/muse-spark-open-1026` (et non l'identifiant des docs).
3. **Rôle de Meta dans la note.** Étape 1 éliminatoire (usage réel de Meta) puis 25 % pour la créativité d'usage. Une simple comparaison de traduction est trop faible.
4. **Fuseau.** Dépôt à 21h ET le 4 nov = 3h du matin à Cotonou le 5 nov. Limite interne : mercredi 4 nov, 18h Cotonou.
5. **Préexistant.** Le guide permet aux startups de s'appuyer sur un existant en le déclarant. Notre choix est plus strict que la règle. On le garde.

## À faire aujourd'hui (jour 1)
- [ ] Réclamer les 150 $ de crédits Meta Model API (individuel, avant le 4 nov 21h ET, carte bancaire requise)
- [ ] Demander les 100 $ Baseten (sur dossier)
- [ ] Demander les 100 $ Modal (1 000 premiers participants)
- [ ] Demander les 25 $ Fireworks (équipes présélectionnées)
- [ ] Rejoindre le Discord, poser la question « définition d'une startup » dans #questions
- [ ] Lire la doc Meta Model API (voir PLAN-API-META.md, tests T1 à T4)
- [ ] Obtenir un clip français avec accord écrit (BLOQUANT)

## Décisions ouvertes
- [ ] Source du clip (accord écrit)
- [ ] Piste : Indie ou Startup (à confirmer selon la définition officielle)
- [ ] Équipe : participants acceptés uniquement, tous listés dans la soumission
- [ ] Représentant de l'équipe pour la soumission
- [ ] Synthèse vocale : modèle et licence
- [ ] Deuxième modèle de comparaison de traduction (si on garde cette partie)
- [ ] Format du clip : éviter tout sujet politique ou de guerre (exclu par le guide)

## Journal des mesures
> Tout est brut et daté. Aucune extrapolation. Source : tests du 27 oct 2026 sur la clé `LLM_143...` fournie.

### T1 — Accès Meta Model API — 27 oct 2026 05:35 UTC — RÉUSSI
- Endpoint vérifié : `https://api.meta.ai/v1` (OpenAI-compatible)
- `GET /v1/models` → 200. Modèles retournés (9) : `muse-spark-1.1`, `muse-spark-1.2`, `muse-spark-1.2-contributor`, `muse-spark-1.3`, `muse-spark-1.3-contributor`, `muse-wonder-1.0`, `muse-image-1.0`, `muse-voice-transcribe-1.0`, `sam-3.1`
- `POST /v1/chat/completions` avec `muse-spark-1.3` → 200, `x-request-id: 62af955a...`, `x-ratelimit-limit-requests: 3000`, `x-ratelimit-remaining-requests: 3000`, `x-ratelimit-limit-tokens: 4000000`
- `muse-spark-1.2-contributor` → 200, `limit-requests: 150`, `limit-tokens: 3000000`
- Test prompt `Dis bonjour en une phrase` avec `max_tokens: 1000` → `Bonjour !` — reasoning_tokens 312 / completion 324 / prompt 16 / total 340
- Clé valide, crédits actifs. Aucune facturation testée au-delà des limites headers. Limite interne à surveiller via Billing.
- Identifiant exact à consigner dans README : `muse-spark-1.3` (ou `muse-spark-1.3-contributor` pour variante contributor)

### T2 — Transcription du français — 27 oct 2026 05:39 UTC — ÉCHEC API, PISTE LOCALE OK
- Tentatives `POST /v1/audio/transcriptions` avec `muse-voice-transcribe-1.0` via `httpx` et `OpenAI(base_url='https://api.meta.ai/v1')` → 404 systématique (testé : `/v1/audio/transcriptions`, `/v1/audio/translations`, `/v1/transcriptions`, `/v1/transcribe`, `/v1/speech/transcriptions`, `/v1/voice/transcribe`)
- `GET /v1/models/muse-voice-transcribe-1.0` → 200 : modèle listé mais endpoint transcription non exposé sur `api.meta.ai` avec cette clé/entitlement.
- Fallback local généré : `fr_test.mp3` (34272 bytes, `fr-FR-DeniseNeural` via edge-tts, durée estimée ~5s, phrase : `Bonjour, tu sais bien que je... Arrete de tourner autour du pot !`) — prêt pour test hors-API.
- Conséquence : [À VÉRIFIER] de PLAN-API-META.md reste ouvert. Diarisation (2 personnages) non testée — probablement plan B open source (pyannote/silero) à valider côté licence.
- Fichier de test : `C:\Users\Kimsh\AppData\Local\Temp\opencode\fr_test.mp3`

### T3 — Traduction — 27 oct 2026 05:36 UTC — RÉUSSI
- Modèle : `muse-spark-1.3`, `max_tokens: 3000`, prompt JSON avec 5 répliques FR couvrant tu/vous, idiomes, émotion.
- Entrée :
  1. `Tu sais bien que je ne peux pas te laisser faire ça.`
  2. `Vous avez tout mon respect, Madame, mais je ne suis pas d'accord.`
  3. `Arrête de tourner autour du pot, dis-moi ce que tu veux vraiment !`
  4. `Ça me fait chaud au coeur de te voir enfin sourire.`
  5. `On n'a pas gardé les cochons ensemble, alors surveille ton ton.`
- Sortie (usage prompt 205 / completion 2096 dont reasoning 1615 / total 2301) :
  1. EN `You know full well I can't let you do that.` — tu → informal, concerned
  2. EN `With all due respect, ma'am, I have to disagree.` — vous → formal respectful
  3. EN `Quit beating around the bush, tell me what you really want!` — idiome correctement adapté (beating around the bush)
  4. EN `It warms my heart to finally see you smile.` — émotion tendre conservée
  5. EN `We're not that close, so watch your tone.` — idiome `garder les cochons ensemble` rendu par équivalent naturel (condensé)
- Durées notées par le modèle : ~2.2–2.8s EN vs 9–16 syllabes FR, cohérentes pour doublage. À mesurer réellement après synthèse.
- Registre tu/vous distingué, humour/idiome non traduit mot-à-mot. Fichier brut : `C:\Users\Kimsh\AppData\Local\Temp\opencode\t3_output.json`

### T4 — Voix de synthèse anglaise — 27 oct 2026 05:38 UTC — RÉUSSI (hors Meta)
- Modèle Meta de synthèse non confirmé dans le guide → test hors-Meta validé avec `edge-tts 7.3.1` (Microsoft Edge TTS, usage à vérifier côté licence pour hackathon).
- Voix distinctes générées via `ffmpeg 9.0.2` vérifié :
  - `voice1.mp3` 18000 bytes, 3.0s, voix `en-US-GuyNeural` (male) : `You know full well I can't let you do that.`
  - `voice2.mp3` 23184 bytes, 3.864s, voix `en-US-AriaNeural` (female) : `With all due respect, ma'am, I have to disagree.`
- Commandes : `edge-tts --voice en-US-GuyNeural --write-media voice1.mp3`, `edge-tts --voice en-US-AriaNeural --write-media voice2.mp3`
- Alternatives à évaluer jour 1 : Piper (local, licence MIT), Coqui XTTS (licence à vérifier), Baseten/Muse si TTS Meta apparaît. Timbrage distinct validé, ajustement de vitesse prévu via ffmpeg `atempo` si écart >15% (cf GRILLE-EVALUATION.md:18).
