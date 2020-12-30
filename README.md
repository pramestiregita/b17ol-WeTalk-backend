# **WeTalk API**

Sistem aplikasi untuk melakukan proses pengiriman pesan secara real-time

## **Persyaratan Aplikasi Backend**
---
1. Node v12.18.3
2. PM2 v4.5.1

## **Instalasi**
---
1. Clone repo https://github.com/pramestiregita/b17ol-WeTalk-backend.git
2. Masuk ke direktori hasil clone
3. Jalankan `npm install`
4. Buat file `.env` dari file `.env.example`
5. Buat folder `assets/uploads` untuk menyimpan file yang diupload
6. Jalankan instalasi database (lihat point Instalasi Database)
7. Jalankan server dengan perintah :
   - `pm2 start index.js --name 'wetalk'` : untuk menjalankan server
   - `pm2 logs wetalk` : untuk melihat console

## **Instalasi Database**
---
1. Buka file `database.json`
2. Ganti `username` dan `password` sesuai dengan username dan password dari database anda
3. Jalankan `npx sequelize-cli db:create` untuk membuat database baru
4. Kemudian jalankan `npx sequelize-cli db:migrate` untuk memigrasi tabel yang dibutuhkan 

## **Dokumentasi API**
---
1. Masuk ke folder `documentation`
2. Import file `WeTalk.postman_collection.json` ke dalam Postman
3. Pastikan Anda menggunakan Postman tipe desktop dengan versi terbaru