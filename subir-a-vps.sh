#!/bin/bash
# Script bash para Linux/Mac: "subir-a-vps.sh"

read -p "Mensaje de commit (ENTER para 'deploy: cambios automáticos'): " mensaje
if [ -z "$mensaje" ]; then
  mensaje="deploy: cambios automáticos"
fi

echo "Agregando cambios..."
git add .
echo "Haciendo commit..."
git commit -m "$mensaje"
echo "Pusheando a main..."
git push origin main
echo "¡Listo! Esperá 1-2 minutos y tu VPS se actualizará solo vía Watchtower."
