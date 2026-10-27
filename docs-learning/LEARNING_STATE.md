# LEARNING_STATE — Medelor (point de reprise)

> Dernière mise à jour : 2026-10-27 (après Exp 002)

## Fait
1. **Repo** `bolouvipf/medelor` (2 → 4 commits, `main` : `a997f9c` Journal T1-T4)
2. **Renommage** `Voix par personnage` / `HOUETOR` → `Medelor` (tous docs nettoyés)
3. **T1-T4** : T1 OK (muse-spark-1.3), T2 404 (fallback), T3 OK (tu/vous + idiomes), T4 OK (2 voix edge-tts), consigné `STATUT.md:40`
4. **Scaffold** `prototype/` + `logs/` inspiré `C:\houetorwasm` (logger, 5 étapes, --demo/--clip, .gitignore)

## À faire (ordre)
1. **Podlab Media** : attendre clip + accord écrit (bloquant — mail envoyé)
2. **Tester démo** : `node prototype/medelor.mjs --demo` (vérifier `out/medelor_demo.mp3` + `logs/journal.jsonl`)
3. **T2 réel** : brancher whisper local (fallback) quand clip reçu — tester qualité/horodatage/diarisation 2 voix
4. **Pipeline complet** : `--clip clips/podlab.mp3` → `out/medelor_dubbed.mp3` + mesure durée (GRILLE-EVALUATION.md <15%)
5. **README** : remplir `README-squelette.md` à partir de `STATUT.md` + `logs/` (chiffres bruts uniquement)

## Point de reprise exact
```powershell
node prototype/medelor.mjs --demo
cat logs/medelor.log
cat logs/journal.jsonl
# quand clip reçu:
node prototype/medelor.mjs --clip clips/podlab.mp3 --out out/medelor_dubbed.mp3
```
Vérifier `.env` : `META_API_KEY=LLM_143...` (jamais commité, cf .gitignore)
