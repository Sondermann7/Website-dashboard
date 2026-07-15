# Trusted launcher invoked by server/server.js's launchCowork(). This file's content is fixed
# and checked into the repo — it is NEVER constructed from task data. The only external input is
# -BriefFile, a path to a server-generated temp file (see launchCowork() for how that path itself
# is built from a fresh crypto.randomUUID(), never from task-controlled fields).
#
# Reading the brief from a file and handing it to Start-Process as a real -ArgumentList value
# (a .NET parameter value, not text re-parsed by any shell) means task-controlled content (title,
# notes, exec steps) never has to appear on a cmd.exe/PowerShell command line as parsed syntax —
# this is what closes the command-injection surface flagged in security review.
param(
  [Parameter(Mandatory = $true)]
  [string]$BriefFile
)

$brief = Get-Content -Raw -LiteralPath $BriefFile
Remove-Item -LiteralPath $BriefFile -Force -ErrorAction SilentlyContinue
Start-Process -FilePath "claude" -ArgumentList @("--permission-mode", "plan", $brief)
