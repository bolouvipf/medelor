#!/usr/bin/env node
// medelor.mjs — Pipeline complet Medelor (doublage voix par personnage)
// Inspiré houetorwasm : preuve brute → logs + JSON mesures + journal
// Usage: node prototype/medelor.mjs --clip clips/podlab.mp3 --out out/dubbed.mp3
//        node prototype/medelor.mjs --demo   (démo T3/T4 sans clip)

import fs from "node:fs";
import path from "node:path";
import { log, error, Journal } from "./lib/logger.mjs";
import { transcribe } from "./pipeline/transcribe.mjs";
import { diarize } from "./pipeline/diarize.mjs";
import { translate } from "./pipeline/translate.mjs";
import { synthesize } from "./pipeline/synthesize.mjs";
import { remix } from "./pipeline/remix.mjs";

const args = process.argv.slice(2);
const opts = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--clip") opts.clip = args[++i];
  else if (args[i] === "--out") opts.out = args[++i];
  else if (args[i] === "--demo") opts.demo = true;
  else if (args[i] === "--clear-logs") opts.clear = true;
}

if (opts.clear) Journal.clear();

log("medelor", "démarrage pipeline", { opts, pid: process.pid });

if (opts.demo) {
  log("medelor", "mode démo T3/T4 — sans clip Podlab");
  const replicas = [
    { id: 1, speaker: "A", text: "Tu sais bien que je ne peux pas te laisser faire ça." },
    { id: 2, speaker: "B", text: "Vous avez tout mon respect, Madame, mais je ne suis pas d'accord." },
    { id: 3, speaker: "A", text: "Arrête de tourner autour du pot, dis-moi ce que tu veux vraiment !" },
    { id: 4, speaker: "B", text: "Ça me fait chaud au coeur de te voir enfin sourire." },
    { id: 5, speaker: "A", text: "On n'a pas gardé les cochons ensemble, alors surveille ton ton." },
  ];
  const ctx = { scene: "dialogue tendu 2 personnages, Podlab podcast en attente" };
  const { result: tr } = await translate(replicas, ctx);
  const translations = tr.translations.map((t, i) => ({ ...t, id: replicas[i].id, speaker: replicas[i].speaker }));
  log("medelor", "traductions demo", { translations });
  // synthèse des 5
  const synth = await synthesize(translations, path.join("logs", "demo_wavs"));
  await remix(synth.result, { out: opts.out || "out/medelor_demo.mp3" });
  log("medelor", "demo terminée", { out: opts.out || "out/medelor_demo.mp3" });
  process.exit(0);
}

if (!opts.clip) {
  log("medelor", "pas de --clip, attente Podlab Media. Lance --demo pour tester le pipeline sans clip.");
  log("medelor", "prochaine étape : dès que le clip arrive, place-le dans clips/ et relance avec --clip");
  process.exit(0);
}

// Pipeline complet avec clip
try {
  const { result: trans } = await transcribe(opts.clip);
  const { result: segments } = await diarize(trans);
  // segments -> replicas
  const replicas = segments.map((s, i) => ({ id: i + 1, speaker: s.speaker, text: s.text, start_ms: s.start_ms, end_ms: s.end_ms }));
  // Si transcription vide (placeholder), on utilise un jeu de test
  const toTranslate = replicas.some((r) => r.text === "—") ? [
    { id: 1, speaker: "A", text: "Tu sais bien que je ne peux pas te laisser faire ça." },
    { id: 2, speaker: "B", text: "Vous avez tout mon respect, Madame, mais je ne suis pas d'accord." },
  ] : replicas;

  const { result: tr } = await translate(toTranslate, { scene: `clip ${opts.clip}` });
  const translations = tr.translations.map((t, i) => ({ ...t, id: toTranslate[i].id, speaker: toTranslate[i].speaker }));
  const { result: synth } = await synthesize(translations, path.join("logs", "wavs"));
  const { result: mixed } = await remix(synth, { out: opts.out || "out/medelor_dubbed.mp3" });
  log("medelor", "pipeline complet OK", { out: mixed.out, duration: mixed.duration_s });
} catch (e) {
  error("medelor", "pipeline échec", { error: e.message, stack: e.stack?.slice(0, 1000) });
  process.exit(1);
}
