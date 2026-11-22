# MagOnline

Electronics marketplace: Next.js frontend (`client-nextjs`) + Spring Boot / MySQL backend (`server/spring-boot-jdbc-app`).

## Running locally

### 1. Backend + database (Docker)

```bash
docker compose up -d --build
```

- API: http://localhost:8088 (e.g. http://localhost:8088/products/random/4)
- MySQL: `localhost:3307`, database `ecommerce`, user `magonline_app` (default passwords are in `docker-compose.yml`)
- On first start, `schema.sql` and `server/spring-boot-jdbc-app/db/seed.sql` are loaded (27 products + a demo account; its login is in the header comment of the seed file).
- Images uploaded by sellers are stored in the `uploads` volume and served at `http://localhost:8088/uploads/...`.

Useful commands:

```bash
docker compose logs -f backend          # logs
docker compose down                     # stop (data is kept)
docker compose down -v                  # stop and wipe data; the seed is reloaded on the next up
docker compose up -d --build backend    # rebuild only the backend after Java changes
```

### 2. Frontend

```bash
cd client-nextjs
npm install
npm run dev
```

In `client-nextjs/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8088
NEXT_PUBLIC_USE_MOCK=false   # true = use the data in src/lib/mock, no backend needed
```

`NEXT_PUBLIC_*` values are baked in when the dev server starts, so restart `npm run dev` after changing them.

## Notes

- Cart and favorites are stored in the browser (`localStorage`) for now; the `cart` and `favorites` tables exist in the schema but have no API endpoints yet.
- Account endpoints (JWT required): `GET/PUT /users/me` (profile + delivery address) and `GET /orders/me`. The demo account has 4 seeded orders.
- Checkout: `POST /orders` (JWT required) places an order from the cart. The backend uses current DB prices, locks the product rows and checks stock (409 with a readable message if there isn't enough), decrements stock, and stores a delivery/payment snapshot on the order. Shipping is 19.99 lei (courier) or 12.99 lei (locker), free from 250 lei; keep `model/Shipping.java` and `client-nextjs/src/lib/shipping.ts` in sync. Payment is on delivery only (cash or card) for now.
- Admin panel at `/admin` (users listed in the `admins` table; the demo account is one). Backend routes under `/admin/**` require `ROLE_ADMIN`, which is read from the DB on every request:
  - `GET /admin/stats?days=7|30|90|365`: revenue, orders, top products, low stock (cancelled orders excluded).
  - `GET /admin/orders`, `PATCH /admin/orders/{id}`: change status or delivery details. Cancelling returns the items to stock; reactivating takes them out again (409 if stock is short).
  - `GET /admin/products`, `PUT/DELETE /admin/products/{id}`: products that appear in orders can't be deleted (set stock to 0 instead).
  - `GET/PUT /admin/offers`: the home page "Ofertele săptămânii" carousel (`weekly_offers` table, public `GET /offers`; random products when empty).
  - `GET /admin/db/tables[/{name}]`, `POST /admin/db/query`: table browser and SQL console. The console is read-only by design: one SELECT/SHOW/DESCRIBE/EXPLAIN statement, run in a read-only transaction, max 500 rows, 10 s timeout, password columns masked.
  - To make another account admin: `INSERT INTO admins (user_id) VALUES (<id>);`
  - `PUT/DELETE /products/**` and `GET/PUT/DELETE /users[/{id}]` are now admin-only (they were open before).
- `POST /contact` (public) stores contact-form messages in the `contact_messages` table.
