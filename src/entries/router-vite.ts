import { fileURLToPath } from "node:url";
import * as fs from "node:fs/promises";
import { resolve } from "node:path";
import { watch } from "chokidar";
import { Generator, type GeneratorEvent } from "@tanstack/router-generator";
import { getConfig, tanStackRouterCodeSplitter, type Config, type RouterPluginContext } from "@tanstack/router-plugin/vite";
import type { PluginOption } from "vite";

export { tanstackRouter, tanstackRouterGenerator, tanStackRouterCodeSplitter } from "@tanstack/router-plugin/vite";
export type { Config, CodeSplittingOptions } from "@tanstack/router-plugin/vite";

const publicRouter = "@organizacaox/lai-design-system/router";
const upstreamRouter = "@tanstack/react-router";
function replaceModule(source: string, from: string, to: string) {
  return source.replaceAll(`"${from}"`, `"${to}"`).replaceAll(`'${from}'`, `'${to}'`);
}

/** File routes and generated types import LAI. Place before React's plugin. */
export function laiRouter(options: Partial<Omit<Config, "target">> = {}): PluginOption {
  const context: RouterPluginContext = { routesByFile: new Map() };
  let generator: Generator;
  let routesDirectory: string;
  let config: Config;
  let routeWatcher: ReturnType<typeof watch> | undefined;
  let serving = false;
  async function generate(event?: GeneratorEvent) {
    if (config.enableRouteGeneration === false) return;
    await generator.run(event);
    context.routesByFile = generator.getRoutesByFileMap();
  }
  return [
    {
      name: "lai-router-generator",
      enforce: "pre",
      config() {
        return { resolve: { alias: [{
          find: /^@tanstack\/react-router$/,
          // Split chunks use upstream imports, resolved from LAI's own installation.
          replacement: fileURLToPath(import.meta.resolve(upstreamRouter)),
        }] } };
      },
      async configResolved(viteConfig) {
        config = getConfig({ autoCodeSplitting: true, ...options, target: "react" }, viteConfig.root);
        routesDirectory = resolve(viteConfig.root, config.routesDirectory);
        generator = new Generator({
          root: viteConfig.root,
          config,
          // Adapt at the public filesystem boundary. The native transformer sees
          // its own imports; authored and generated files on disk always use LAI.
          fs: {
            stat: async (file) => {
              const stat = await fs.stat(file, { bigint: true });
              return { mtimeMs: stat.mtimeMs, mode: Number(stat.mode), uid: Number(stat.uid), gid: Number(stat.gid) };
            },
            readFile: async (file) => {
              try {
                const handle = await fs.open(file, "r");
                try {
                  return { stat: await handle.stat({ bigint: true }), fileContent: replaceModule(await handle.readFile("utf8"), publicRouter, upstreamRouter) };
                } finally { await handle.close(); }
              } catch (error) {
                if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return "file-not-existing";
                throw error;
              }
            },
            writeFile: (file, content) => fs.writeFile(file, replaceModule(content, upstreamRouter, publicRouter)),
            rename: fs.rename,
            chmod: fs.chmod,
            chown: fs.chown,
          },
        });
        await generate();
      },
      async watchChange(path, { event }) {
        if (!serving) await generate({ path, type: event });
      },
      async configureServer(server) {
        serving = true;
        if (server.config.server.watch === null || config.enableRouteGeneration === false) return;
        // Own the route-directory watch so newly created files are observed even
        // before they enter Vite's module graph.
        routeWatcher = watch(routesDirectory, {
          ignoreInitial: true,
          usePolling: server.config.server.watch?.usePolling,
          interval: server.config.server.watch?.interval,
        });
        const report = (error: unknown) => server.config.logger.error(String(error));
        for (const [event, type] of [["add", "create"], ["change", "update"], ["unlink", "delete"]] as const) {
          routeWatcher.on(event, (path) => void generate({ path, type }).catch(report));
        }
        routeWatcher.on("error", report);
        await new Promise<void>((done, reject) => {
          routeWatcher!.once("ready", done);
          routeWatcher!.once("error", reject);
        });
        await generate();
      },
      async closeBundle() {
        await routeWatcher?.close();
      },
    },
    tanStackRouterCodeSplitter({ autoCodeSplitting: true, ...options, target: "react" }, context),
  ];
}
