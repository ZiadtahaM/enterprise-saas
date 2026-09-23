import app from "./app";
import { logger } from "./lib/logger";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
// dist/index.mjs lives at artifacts/api-server/dist/
// frontend lives at artifacts/frontend/
const frontendRoot = path.resolve(buildDir, "../../frontend");
const frontendDist = path.resolve(frontendRoot, "dist/public");

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  process.env.BASE_PATH = process.env.BASE_PATH ?? "/";
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root: frontendRoot,
    server: { middlewareMode: true },
    appType: "spa",
    base: "/",
  });
  app.use(vite.middlewares);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
