import { resolve } from "path";
import { build } from "esbuild";

const buildPath = resolve(__dirname, "build");

async function runBuild() {
    try {
        await build({
            entryPoints: ["./server/*.ts"],
            outdir: buildPath,
            format: "cjs",
            platform: "node",
            target: "node14",
            bundle: true,
            external: ["cpu-features", "ssh2"],
        });
    } catch (err) {
        process.exit(1);
    }
}

runBuild();