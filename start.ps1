Set-Location $PSScriptRoot
if (git status --porcelain) { git add -A; git commit -m "wip: autosave before pull" }
git pull --rebase origin main
if ($LASTEXITCODE -ne 0) { Write-Host "CONFLICT - stop, ask Claude" -ForegroundColor Red; exit 1 }
npm install
if (-not (Test-Path ".env.local")) { Write-Host "MISSING .env.local - blog will be empty" -ForegroundColor Red }
Write-Host "Ready." -ForegroundColor Green