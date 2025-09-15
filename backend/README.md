# 1. Khởi động database
npm run mysql:up    

# 2. Apply migration từ Prisma schema
npm run migration:generate    

# 3. Seed dữ liệu ban đầu (nếu có init.sql)
npm run db:seed    

# 4. Kiểm tra DB đã có bảng và dữ liệu
npx prisma studio   # mở giao diện web của Prisma
