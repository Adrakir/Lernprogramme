$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$edge = Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) { $edge = Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe' }
if (-not (Test-Path $edge)) { throw 'Microsoft Edge fehlt. lernheft.html öffnen und Drucken / als PDF speichern wählen.' }
& node (Join-Path $PSScriptRoot 'build-offline.js')
if ($LASTEXITCODE -ne 0) { throw 'HTML-Erstellung fehlgeschlagen.' }
$pdf = Join-Path $root 'Erdkunde_Lernheft_Klasse5_final.pdf'
$profile = Join-Path $PSScriptRoot '.pdf-render-profile'
$url = ([System.Uri](Join-Path $root 'lernheft.html')).AbsoluteUri
$args = @('--headless=new','--disable-gpu','--no-first-run','--no-pdf-header-footer',"`"--user-data-dir=$profile`"","`"--print-to-pdf=$pdf`"",'--virtual-time-budget=3000',$url)
$started = Get-Date
$process = Start-Process -FilePath $edge -ArgumentList $args -PassThru -Wait
if ($process.ExitCode -ne 0 -or -not (Test-Path $pdf) -or (Get-Item $pdf).LastWriteTime -lt $started) { throw 'PDF wurde nicht aktualisiert. Eventuell ist es noch in einer PDF-Anzeige geöffnet.' }
# Das alte PDF bleibt unveraendert, da es in einer Anzeige gesperrt sein kann.
if (Test-Path $profile) { Remove-Item $profile -Recurse -Force }
Write-Output "Fertig: $pdf"
