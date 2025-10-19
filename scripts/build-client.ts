/**
 * Script para compilar los archivos del cliente
 * Ejecutar con: bun run scripts/build-client.ts
 */

import { readdirSync } from "fs";
import { join } from "path";

const PAGES_DIR = "./src/client/pages";
const OUTPUT_DIR = "./public/static/js";

async function buildClientPages() {
  console.log("🔨 Compilando páginas del cliente...\n");

  try {
    // Obtener todos los archivos .ts de pages
    const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".ts"));

    if (files.length === 0) {
      console.log("⚠️  No se encontraron archivos en src/client/pages/");
      return;
    }

    // Compilar cada archivo
    for (const file of files) {
      const inputPath = join(PAGES_DIR, file);
      const outputName = file.replace(".ts", ".js");
      const outputPath = join(OUTPUT_DIR, outputName);

      console.log(`📦 Compilando: ${file} → ${outputName}`);

      const result = await Bun.build({
        entrypoints: [inputPath],
        outdir: OUTPUT_DIR,
        naming: outputName,
        minify: false, // Cambiar a true en producción
        sourcemap: "external",
        target: "browser",
      });

      if (result.success) {
        console.log(`   ✅ Compilado exitosamente`);
      } else {
        console.error(`   ❌ Error compilando ${file}:`);
        result.logs.forEach((log) => console.error(`      ${log}`));
      }
    }

    console.log("\n✨ Compilación completada!\n");
  } catch (error) {
    console.error("❌ Error durante la compilación:", error);
    process.exit(1);
  }
}

// Ejecutar build
buildClientPages();
