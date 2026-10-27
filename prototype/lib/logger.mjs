#!/usr/bin/env node
// logger.mjs — inspiré de C:\houetorwasm\prototype\host\host.mjs
// Principes : (1) preuve brute avant conclusion, (2) tout est daté + sourcé, (3) JSONL + log texte + erreurs séparées
// Usage: import { log, error, measure, Journal } from "./lib/logger.mjs"

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LOGS = path.join(ROOT, "logs");
if (!fs.existsSync(LOGS)) fs.mkdirSync(LOGS, { recursive: true });

const LOG_FILE = path.join(LOGS, "medelor.log");
const ERR_FILE = path.join(LOGS, "errors.log");
const JOURNAL_FILE = path.join(LOGS, "journal.jsonl");

function ts() {
  return new Date().toISOString();
}

function append(file, line) {
  fs.appendFileSync(file, line + "\n", "utf8");
}

function fmt(level, scope, msg, extra = {}) {
  const base = { ts: ts(), level, scope, msg, ...extra };
  return base;
}

export function log(scope, msg, extra = {}) {
  const entry = fmt("INFO", scope, msg, extra);
  const line = `[${entry.ts}] [${entry.level}] [${entry.scope}] ${entry.msg}${Object.keys(extra).length ? " " + JSON.stringify(extra) : ""}`;
  console.log(line);
  append(LOG_FILE, line);
  append(JOURNAL_FILE, JSON.stringify(entry));
}

export function warn(scope, msg, extra = {}) {
  const entry = fmt("WARN", scope, msg, extra);
  const line = `[${entry.ts}] [${entry.level}] [${entry.scope}] ${entry.msg}${Object.keys(extra).length ? " " + JSON.stringify(extra) : ""}`;
  console.warn(line);
  append(LOG_FILE, line);
  append(ERR_FILE, line);
  append(JOURNAL_FILE, JSON.stringify(entry));
}

export function error(scope, msg, extra = {}) {
  const entry = fmt("ERROR", scope, msg, extra);
  const line = `[${entry.ts}] [${entry.level}] [${entry.scope}] ${entry.msg}${Object.keys(extra).length ? " " + JSON.stringify(extra) : ""}`;
  console.error(line);
  append(LOG_FILE, line);
  append(ERR_FILE, line);
  append(JOURNAL_FILE, JSON.stringify(entry));
}

export function die(scope, msg, extra = {}, code = 1) {
  error(scope, msg, extra);
  process.exit(code);
}

// Mesure d'une étape — comme phase3_measures.md / lifecycle.json
export async function measure(scope, label, fn) {
  const start = performance.now();
  log(scope, `début ${label}`);
  try {
    const result = await fn();
    const ms = performance.now() - start;
    log(scope, `fin ${label}`, { duration_ms: Number(ms.toFixed(2)), status: "ok" });
    return { result, duration_ms: ms };
  } catch (e) {
    const ms = performance.now() - start;
    error(scope, `échec ${label}`, { duration_ms: Number(ms.toFixed(2)), error: e.message, stack: e.stack?.slice(0, 800) });
    throw e;
  }
}

// Journal haut niveau pour STATUT.md — comme EXPERIMENTS_LOG.md
export const Journal = {
  path: JOURNAL_FILE,
  logFile: LOG_FILE,
  errFile: ERR_FILE,
  clear() {
    for (const f of [LOG_FILE, ERR_FILE, JOURNAL_FILE]) if (fs.existsSync(f)) fs.writeFileSync(f, "", "utf8");
    log("journal", "logs vidés");
  },
};
