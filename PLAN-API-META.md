# PLAN API META — Medelor (français → anglais)

> Ce plan est une hypothèse de travail. Les capacités des modèles Muse ne sont PAS vérifiées.
> Tout ce qui est marqué [À VÉRIFIER] doit être testé avant d'être écrit dans le README ou la vidéo.

## Principe
Meta doit être au cœur du pipeline, pas un composant secondaire (25 % de la note, et étape 1 éliminatoire).
Un modèle Meta fait donc le travail central à chaque étape où c'est possible, et on documente ce qui ne l'est pas.

## Pipeline envisagé
| Étape | Outil envisagé | Statut |
|---|---|---|
| 1. Transcription du français | Muse Voice Transcribe (Meta Model API) | [À VÉRIFIER] : français, horodatage par mot, durée max, taille de fichier |
| 2. Qui parle à chaque instant (2 personnages) | Option A : la transcription le fournit. Option B : outil open source de diarisation. | [À VÉRIFIER] : sinon, licence à contrôler |
| 3. Traduction réplique par réplique, avec ton et durée cible | Muse Spark (Meta Model API), éventuellement Muse Spark Open | [À VÉRIFIER] : identifiant du modèle, format de réponse, limites |
| 4. Voix de synthèse anglaise, une par personnage | Pas de modèle Meta de synthèse confirmé dans le guide | [À VÉRIFIER] : modèle open source, licence, voix prédéfinies |
| 5. Remixage avec musique et effets | ffmpeg en local | Simple |
| 6. Évaluation de la traduction | Grille écrite à l'avance (voir GRILLE-EVALUATION.md) | À faire |

## Idées pour dépasser l'intégration basique (à tester, pas à promettre)
- Muse Spark prend en entrée le contexte de la scène (qui parle, relation entre les personnages, émotion) pour choisir le registre (tu/vous) et le ton.
- Muse Spark produit plusieurs traductions candidates par réplique, avec une contrainte de durée, puis une étape de choix. À mesurer : durée anglaise contre durée française.
- Un contrôle de cohérence : un second appel relit toute la scène traduite et signale les incohérences de registre entre répliques.
- Version à poids ouverts (Muse Spark Open via Baseten ou Modal) en plus de l'API, pour viser le bonus de 10 000 $. À décider après les premiers tests.

## Tests du jour 1 (bloquants)
- **T1 — Accès.** Appel de base à Meta Model API avec une clé et un modèle. Noter : identifiant exact, coût, limites.
- **T2 — Transcription.** Un extrait français de 30 secondes. Noter : qualité, horodatage, séparation des voix si elle existe.
- **T3 — Traduction.** 5 répliques françaises avec tu/vous et une expression idiomatique. Noter ce qui est bon et ce qui ne l'est pas.
- **T4 — Voix.** Deux voix anglaises distinctes avec un modèle de synthèse libre de licence suffisante.
- Tout est consigné dans STATUT.md, rubrique « Journal des mesures », avec la date et le résultat brut.

## Calendrier (jours 1 à 8, selon les dates réelles)
| Date | Objectif |
|---|---|
| Mar 27 oct | Comptes et crédits. Lecture de la doc. Tests T1 à T4. Clip en cours d'obtention. |
| Mer 28 oct | Clip validé par écrit. Transcription et identification des deux personnages. |
| Jeu 29 oct | Séparation fiable. Fichier de répliques horodaté. |
| Ven 30 oct | Traduction avec Muse Spark. Grille d'évaluation figée avant de voir les sorties. |
| Sam 31 oct – Dim 1er nov | Voix de synthèse, calage des durées, remixage. |
| Lun 2 nov | Évaluation chiffrée. Premier montage de bout en bout. |
| Mar 3 nov | Vidéo de 3 minutes, README, nettoyage du dépôt. |
| Mer 4 nov | **Soumission avant 18h (Cotonou).** Marge pour les imprévus jusqu'à 3h du matin. |

## Risques connus
- Clip sans accord écrit à temps : le projet ne peut pas avancer. Piste de repli : scène produite par l'équipe.
- Le modèle de transcription ne gère pas bien le français ou ne sépare pas les voix : plan B open source, à vérifier côté licence.
- La synthèse vocale anglaise sonne mal ou est trop proche d'une voix à l'autre : tester deux ou trois modèles le jour 1.
- Une durée anglaise qui déborde ou finit trop tôt : prévoir un ajustement de vitesse avec ffmpeg et le mesurer.
- Accès GPU ou crédits non accordés : le pipeline doit tourner avec l'API Meta seule plus du calcul local léger.
- Consommation des 150 $ : régler une alerte de dépense sur la page Billing.
