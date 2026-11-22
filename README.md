# MagOnline

Marketplace de electronice: frontend Next.js (`client-nextjs`) + backend Spring Boot / MySQL (`server/spring-boot-jdbc-app`).

## Rulare locală

### 1. Backend + baza de date (Docker)

```bash
docker compose up -d --build
```

- API: http://localhost:8080 (ex. http://localhost:8080/products/random/4)
- MySQL: `localhost:3307`, baza `ecommerce`, user `magonline_app` (parolele implicite sunt în `docker-compose.yml`)
- La prima pornire se încarcă `schema.sql` și `server/spring-boot-jdbc-app/db/seed.sql` (27 de produse + un cont demo; datele de login sunt în comentariul de sus din seed).
- Pozele încărcate de vânzători se salvează în volumul `uploads` și se servesc la `http://localhost:8080/uploads/...`.

Comenzi utile:

```bash
docker compose logs -f backend   # loguri
docker compose down              # oprește (datele rămân)
docker compose down -v           # oprește și șterge datele; seed-ul se reîncarcă la următorul up
docker compose up -d --build backend   # reconstruiește doar backend-ul după modificări în Java
```

### 2. Frontend

```bash
cd client-nextjs
npm install
npm run dev
```

În `client-nextjs/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=false   # true = date din src/lib/mock, fără backend
```
