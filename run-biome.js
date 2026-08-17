import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBiome() {
  const scratchDir = path.join(__dirname, "scratch_test");
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const biomeExe = path.join(scratchDir, "package", "biome.exe");

  if (!fs.existsSync(biomeExe)) {
    console.log("⚡ Downloading official Biome binary...");
    const url =
      "https://registry.npmjs.org/@biomejs/cli-win32-x64/-/cli-win32-x64-1.9.4.tgz";
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download Biome binary: ${res.statusText}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const tgzPath = path.join(scratchDir, "biome.tgz");
    fs.writeFileSync(tgzPath, buffer);

    console.log("📦 Extracting Biome binary...");
    const systemPath = process.env.SystemRoot
      ? `${process.env.SystemRoot}\\system32;${process.env.SystemRoot}`
      : "C:\\Windows\\system32;C:\\Windows";
    cp.execSync("tar -xzf biome.tgz", {
      cwd: scratchDir,
      env: { PATH: systemPath },
    });
  }

  console.log("🚀 Running Biome check and auto-fix across project...");
  try {
    const systemPath = process.env.SystemRoot
      ? `${process.env.SystemRoot}\\system32;${process.env.SystemRoot}`
      : "C:\\Windows\\system32;C:\\Windows";
    const output = cp.execSync(`"${biomeExe}" check --write "${__dirname}"`, {
      encoding: "utf8",
      env: { PATH: systemPath },
    });
    console.log(output);
    console.log("✅ Biome check complete!");
  } catch (err) {
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
  }
}

try {
  await runBiome();
} catch (err) {
  console.error("Error running Biome:", err.message);
}
