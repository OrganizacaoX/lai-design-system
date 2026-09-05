import assert from "node:assert/strict";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { createServer } from "vite";

const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
try {
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const waitForRoute = async (present) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const tree = await readFile("src/routeTree.gen.ts", "utf8");
      if (tree.includes("/dev-check") === present) return;
      await setTimeout(100);
    }
    throw new Error(`Dev route ${present ? "creation" : "removal"} was not generated`);
  };
  await writeFile("src/routes/dev-check.tsx", "");
  await waitForRoute(true);
  const source = await readFile("src/routes/dev-check.tsx", "utf8");
  assert(source.includes("@organizacaox/lai-design-system/router"));
  assert(!source.includes("@tanstack/react-router"));
  const response = await fetch(`${origin}/src/routes/dev-check.tsx`);
  assert.equal(response.status, 200);
  await unlink("src/routes/dev-check.tsx");
  await waitForRoute(false);
  console.log("Vite dev: new routes scaffold and removed routes disappear from generated types.");
} finally {
  await server.close();
}
