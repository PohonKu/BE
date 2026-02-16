
## docker container:
docker run -d \
  --name pohonku-fkt \
  -e POSTGRES_DB=pohonku_fkt \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=pohonku \
  -p 5433:5432 \
  postgres:15

## cek schema
npx prisma migrate dev --name init

npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > init.sql

npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script > update.sql

npx prisma generate

npx prisma push 

npx prisma migrate dev --name add_description_stock_category