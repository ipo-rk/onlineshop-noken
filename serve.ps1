# try to serve the current directory on localhost:8000
# PowerShell script: tries Python's http.server first, then falls back to Node's http-server if installed.
# Usage: .\serve.ps1

$port = 8000
Write-Host "Serving $(Get-Location) on http://localhost:$port"

# Check for python
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "Starting Python http.server on port $port... (Press Ctrl+C to stop)"
    & python -m http.server $port
    exit
}

# Check for node + http-server
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    # check for http-server
    $httpServer = & npm list -g http-server --depth=0 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Starting http-server on port $port... (Press Ctrl+C to stop)"
        & npx http-server -p $port
        exit
    }
}

Write-Host "No Python or Node/http-server detected. Install Python or Node, or run a static server via your editor (Live Server)." -ForegroundColor Yellow
Write-Host "Or run: python -m http.server 8000" -ForegroundColor Gray