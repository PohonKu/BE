
## docker container:
docker run -d \
  --name pohonku-db \
  -e POSTGRES_DB=pohonku_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5435:5432 \
  postgres:15

## cek schema
npx prisma migrate dev --name init

npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > init.sql

npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script > update.sql

npx prisma generate
