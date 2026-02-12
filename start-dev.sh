#!/bin/bash

# Script para ejecutar Store (Astro) y Admin (Vue) en paralelo
# Provifood E-commerce Frontend

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Iniciando Provifood Frontend${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📦 Store (Astro):${NC}  http://localhost:4321"
echo -e "${YELLOW}⚙️  Admin (Vue):${NC}   http://localhost:5173"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar que pnpm esté instalado
if ! command -v pnpm &> /dev/null
then
    echo -e "${YELLOW}⚠️  pnpm no está instalado${NC}"
    echo "Instalando pnpm..."
    npm install -g pnpm
fi

# Ejecutar ambas apps en paralelo usando pnpm
pnpm dev

# Si prefieres ejecutarlas en procesos separados y ver logs individuales:
# Descomentar las siguientes líneas y comentar 'pnpm dev' de arriba

# trap 'kill 0' EXIT

# echo -e "${GREEN}Iniciando Store...${NC}"
# pnpm dev:store &
# STORE_PID=$!

# sleep 2

# echo -e "${GREEN}Iniciando Admin...${NC}"
# pnpm dev:admin &
# ADMIN_PID=$!

# echo ""
# echo -e "${GREEN}✓ Ambas aplicaciones iniciadas${NC}"
# echo -e "${YELLOW}Presiona Ctrl+C para detener ambas${NC}"
# echo ""

# wait
