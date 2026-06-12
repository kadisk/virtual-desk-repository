#!/usr/bin/env bash
#
# limpar-docker.sh
#
# Para e remove TODOS os containers Docker e remove as imagens do ecossistema
# (ecosystem_virtualdeskrepo:*) para facilitar os testes — força um rebuild limpo
# (sem reuso de cache de imagem antiga).
#
# Uso:
#   ./limpar-docker.sh            # remove containers + imagens do ecossistema
#   ./limpar-docker.sh --all-images   # também remove TODAS as imagens
#
set -uo pipefail

IMAGE_REF="ecosystem_virtualdeskrepo"

echo "==> Parando todos os containers em execução..."
running="$(docker ps -q)"
if [ -n "$running" ]; then
    docker stop $running
else
    echo "    (nenhum container em execução)"
fi

echo "==> Removendo todos os containers..."
all="$(docker ps -aq)"
if [ -n "$all" ]; then
    docker rm -f $all
else
    echo "    (nenhum container)"
fi

if [ "${1:-}" = "--all-images" ]; then
    echo "==> Removendo TODAS as imagens..."
    images="$(docker images -q | sort -u)"
else
    echo "==> Removendo imagens do ecossistema (${IMAGE_REF}:*)..."
    images="$(docker images --filter=reference="${IMAGE_REF}:*" -q | sort -u)"
fi

if [ -n "$images" ]; then
    docker rmi -f $images
else
    echo "    (nenhuma imagem para remover)"
fi

echo "==> Concluído."
