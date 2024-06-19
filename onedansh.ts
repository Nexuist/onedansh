#!/usr/bin/env -S deno run --ext=ts --allow-net --allow-run
import { parse } from "https://deno.land/std@0.194.0/flags/mod.ts";
import { serve } from "https://deno.land/std@0.195.0/http/server.ts";

const VERSION = "1.1.0";

const flags = parse(Deno.args, {
  string: ["token", "port"],
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
if (flags.port && isNaN(Number(flags.port))) {
  console.error("Port must be a number");
  Deno.exit(1);
}

// Exit if command does not exist
if (flags._.length == 0) {
  console.error("No command specified");
  Deno.exit(1);
}

const run = async (command: string, args: string[]) => {
  const cmd = new Deno.Command(command, {
    args,
    stdout: "piped",
    stderr: "piped"
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
  const cmdParts = String(flags._[0]).split(" ");
  let res = { stdout: "", stderr: "", code: 0 };
  if (request.method == "POST" && request.headers.get("content-type") == "application/json") {
    const templateNames: string[] = [];
    for (const part of cmdParts) {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        templateNames.push(part.slice(2, -2));
      }
    }
    const body = await request.json();
    for (const name of templateNames) {
      if (body[name] == undefined) {
        return new Response(`Missing template variable: ${name}`, { status: 400 });
      }
      cmdParts[cmdParts.indexOf(`{{${name}}}`)] = body[name];
    }
    console.log(cmdParts);
    res = await run(cmdParts[0], cmdParts.slice(1));
  }
  else {
    res = await run(cmdParts[0], cmdParts.slice(1));
  }
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

console.log(`HTTP webserver running. Access it at: http://localhost:${flags.port}/`);
console.log(`Run command: ${flags._[0]}`);
if (flags.startup) {
  const cmdParts = String(flags._[0]).split(" ");
  const res = await run(cmdParts[0], cmdParts.slice(1));
  console.log(res);
}
await serve(handler, { port: Number(flags.port) });