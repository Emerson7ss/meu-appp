# Deploy em producao (Docker)

Este projeto e um app Next.js com Supabase. O caminho mais simples para colocar no ar e via Docker + Nginx.

## 1) Preparar variaveis de ambiente

No servidor, dentro da pasta do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores reais:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (URL publica do site)

## 2) Subir aplicacao

```bash
docker compose up -d --build
```

## 3) Verificar se esta online

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f nginx
```

Abra no navegador: `http://IP_DO_SERVIDOR`

## 4) SSL (HTTPS)

Para HTTPS, use um proxy com certificado (ex.: Nginx Proxy Manager, Traefik ou Caddy) na frente do container `nginx`.

## 5) Atualizar versao no ar

```bash
git pull
docker compose up -d --build
```
