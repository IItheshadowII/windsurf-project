# Script PowerShell para Windows: "subir-a-vps.ps1"

$mensaje = Read-Host "Mensaje de commit (ENTER para 'deploy: cambios automáticos')"
if ([string]::IsNullOrWhiteSpace($mensaje)) {
  $mensaje = "deploy: cambios automáticos"
}

Write-Host "Agregando cambios..."
git add .
Write-Host "Haciendo commit..."
git commit -m "$mensaje"
Write-Host "Pusheando a main..."
git push origin main
Write-Host "¡Listo! Esperá 1-2 minutos y tu VPS se actualizará solo vía Watchtower."
