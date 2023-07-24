# Introduction

`onedansh` is a CLI utility built in Deno that allows you to instantly create an HTTP endpoint that runs a bash command on your server. It's great for running one-off commands without having to SSH into your server. I personally use it to run `pm2 status` to check the status of my long running processes. `onedansh` supports basic token authentication and can return output in JSON or raw text format.

Here's the output of `onedansh --help`:

```txt
Usage: onedansh [OPTIONS] [COMMAND]
Options:
  -h, --help     Show this message
  -v, --version  Show version
  -r, --raw      Return raw output (returns JSON by default)
  --token        Set authentication token
  --port         Set port (default 8080)
  --startup      Run command on startup
```

## Installation

Onedansh ships with prebuilt executables. Just pick the right one for your platform from the `builds` folder.

Alternatively, you can run the script with Deno directly:

```bash
deno run --allow-net --allow-run onedansh.ts
```

## Authentication

If the `--token` flag is provided, the token will be required to be passed in the `Authorization` header of the request. Here's an example `curl` if the token is "abc":

```bash
curl -H "Authorization: Bearer abc" localhost:8080
```

## Building

Just run `build.sh` to build fresh binaries for all supported platforms. You'll need to have [Deno](https://deno.land/) installed.

## Next Steps

* I'm open to adding additional flags if anyone uses this tool and wants a bit more functionality.

* It might be nice to allow the requester to specify what format they want the response in (TXT or JSON).

## License

```txt
MIT License

Copyright (c) 2023 Andi Andreas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
