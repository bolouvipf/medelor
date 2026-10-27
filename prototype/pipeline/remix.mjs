// remix.mjs — Étape 5 : Remixage avec ffmpeg (musique + effets)
// Cf PLAN-API-META.md : ffmpeg en local, simple
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { log, error, measure } from "../lib/logger.mjs";

export async function remix(synthesized, opts = {}) {
  const scope = "remix";
  return measure(scope, "remixage ffmpeg", async () => {
    const out = opts.out || path.join("out", "medelor_dubbed.mp3");
    if (!fs.existsSync(path.dirname(out))) fs.mkdirSync(path.dirname(out), { recursive: true });

    if (!synthesized.length) {
      log(scope, "aucune piste synthétisée — remix vide");
      return { out, duration_ms: 0 };
    }

    // Concat simple des MP3 synthétisés (proto) — le calage fin par horodatage viendra avec le clip Podlab
    const list = path.join("logs", "concat.txt");
    fs.writeFileSync(list, synthesized.map((s) => `file '${path.resolve(s.file).replace(/'/g, "'\\''")}'`).join("\n"), "utf8");
    log(scope, `concat list ${synthesized.length} fichiers`, { list });

    const r = spawnSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out], {
      encoding: "utf8",
      timeout: 20000,
    });

    if (r.status !== 0) {
      error(scope, "ffmpeg concat échec", { stderr: r.stderr?.slice(0, 800) });
      // fallback : copie du premier fichier
      fs.copyFileSync(synthesized[0].file, out);
      log(scope, "fallback copie premier fichier");
    } else {
      log(scope, "remix OK", { out, bytes: fs.statSync(out).size });
    }

    // mesure durée pour GRILLE-EVALUATION.md critère Durée (<15% écart)
    const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", out], { encoding: "utf8" });
    const duration = parseFloat(probe.stdout || "0");
    log(scope, "durée finale", { duration_s: duration });

    return { out, duration_s: duration, files: synthesized.length };
  });
}
