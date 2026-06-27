Set-Location $PSScriptRoot
Write-Host "CodeRetos disponible en http://localhost:5500" -ForegroundColor Cyan
python -m http.server 5500