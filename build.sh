#!/bin/sh
# Target OS architecture [possible values: x86_64-unknown-linux-gnu, x86_64-pc-windows-msvc, x86_64-apple-darwin, aarch64-apple-darwin]
deno compile --allow-net --allow-run onedansh.ts --target x86_64-unknown-linux-gnu --output "build/onedansh-linux"
deno compile --allow-net --allow-run onedansh.ts --target x86_64-pc-windows-msvc --output "build/onedansh-windows"
deno compile --allow-net --allow-run onedansh.ts --target x86_64-apple-darwin --output "build/onedansh-mac"
deno compile --allow-net --allow-run onedansh.ts --target aarch64-apple-darwin --output "build/onedansh-m1"