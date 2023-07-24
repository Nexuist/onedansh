#!/usr/bin/env -S deno run --ext=ts --allow-net --allow-run
import { parse } from "https://deno.land/std@0.194.0/flags/mod.ts";
import { serve } from "https://deno.land/std@0.195.0/http/server.ts";

const VERSION = "1.0.0";

const flags = parse(Deno.args, {
  string: ["token"],
  boolean: ["help", "version", "raw", "startup"],
  alias: {
    h: "help",
    v: "version",
    r: "raw",
  },
  default: {
    port: 8080,
  },
  unknown: (arg) => {
    if (arg.startsWith("-")) {
      console.error(`Unknown argument: ${arg}`);
      Deno.exit(1);
    }
  },
});

if (flags.help) {
  console.log("Usage: onedansh [OPTIONS] [COMMAND]");
  console.log("Options:");
  console.log("  -h, --help     Show this message");
  console.log("  -v, --version  Show version");
  console.log("  -r, --raw      Return raw output (returns JSON by default)");
  console.log("  --token        Set token");
  console.log("  --port         Set port (default 8080)");
  console.log("  --startup      Run command on startup");
  Deno.exit();
}

if (flags.version) {
  console.log(`onedansh ${VERSION}`);
  Deno.exit();
}

// Exit if port is not a number
if (typeof flags.port !== "number") {
  console.error("Port must be a number");
  Deno.exit(1);
}

// Exit if command does not exist
if (flags._.length == 0) {
  console.error("No command specified");
  Deno.exit(1);
}

const run = async () => {
const SH = String(flags._[0]).split(" ");
  const cmd = new Deno.Command(SH[0], {
    args: [...SH.slice(1)]
  });
  const { code, stdout, stderr } = await cmd.output();
  return { 
      code, 
      stdout: new TextDecoder().decode(stdout), 
      stderr: new TextDecoder().decode(stderr) 
  };
}

//@ts-ignore (request: Request) breaks the Deno AST for some reason?
const handler = async (request) => {
  // Check header for authorization token
  const auth = request.headers.get("authorization");
  if (flags.token && auth !== `Bearer ${flags.token}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const res = await run();
  const body = flags.raw ? res.stdout : JSON.stringify(res);
  return new Response(
      body, 
      { 
        status: res.code == 0 ? 200 : 500,
        headers: { 
          "content-type": flags.raw ? "text/plain" : "application/json" 
        } 
      });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
console.log(`Run command: ${flags._[0]}`);
if (flags.startup) {
  const res = await run();
  console.log(res);
}
await serve(handler, { port: flags.port });