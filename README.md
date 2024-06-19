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

You can run the script with Deno directly:

```bash
deno run --allow-net --allow-run https://raw.githubusercontent.com/Nexuist/onedansh/main/onedansh.ts "echo Hello World"
```

Alternatively, you can build executables for any supported platform with `build.sh`. You'll need to have [Deno](https://deno.land) installed.

## Template Strings

New with v1.1, you can now use template strings in your command. A template string looks like `{{this}}`. To fill out the template, send a POST request with a JSON body containing keys corresponding to the template names. Here's an example:

```bash
./onedansh.ts -r "echo Hello {{name}}"
```

```bash
curl -X POST -d '{"name": "World"}' -H "Content-Type: application/json"  localhost:8080

Hello World
```

`onedansh` will reject a request if it doesn't have all the required keys in the JSON body.

> [!CAUTION]
> Template strings are not sanitized and can be used to execute arbitrary code. It's your responsibility to ensure that the input is safe. Use authentication tokens to prevent unauthorized access. You probably don't want to expose `onedansh` to the Internet if you use template strings.

## Authentication

If the `--token` flag is provided, the token will be required to be passed in the `Authorization` header of the request. Here's an example `curl` if the token is "abc":

```bash
curl -H "Authorization: Bearer abc" localhost:8080
```

## Building

Just run `build.sh` to build fresh binaries for all supported platforms. You'll need to have [Deno](https://deno.land/) installed.

## Next Steps

* I'm open to adding additional flags if anyone uses this tool and wants a bit more functionality

* It might be nice to allow the requester to specify what format they want the response in (TXT or JSON)

## License

```txt
MIT License

Copyright (c) 2024 Andi Andreas

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
