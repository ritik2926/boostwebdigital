Set-Location $PSScriptRoot
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "BUILD FAILED - not committing" -ForegroundColor Red; exit 1 }
if (git status --porcelain) {
  $msg = Read-Host "Commit message"
  if (-not $msg) { exit }
  git add -A
  git commit -m $msg
}
git pull --rebase origin main
if ($LASTEXITCODE -ne 0) { Write-Host "CONFLICT - stop, ask Claude" -ForegroundColor Red; exit 1 }
git push origin main
Write-Host "Pushed. Safe to switch machines." -ForegroundColor Green