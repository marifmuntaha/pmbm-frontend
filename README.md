# Deployment Guide - Frontend (React + Vite)

Dokumen ini berisi langkah-langkah untuk melakukan *deployment* aplikasi *frontend* PPDB v2. Aplikasi ini dibangun dengan React, TypeScript, dan Vite. Hasil *build* aplikasi berupa sistem file statis yang siap disajikan menggunakan *web server* seperti Nginx atau Apache.

## 1. Persiapan Server
1. Server bersih berbasis Linux (Ubuntu, Debian, CentOS, dll).
2. Terdapat **Node.js** (Minimal v18 LTS) dan **Yarn** atau **NPM**.
3. Terdapat **Nginx** atau *web server* statis lainnya.

## 2. Kloning dan Instalasi
1. *Clone* repository atau pindahkan *source code frontend* ke server (misal ke direktori `/var/www/ppdbv2/frontend`).
2. Masuk ke direktori aplikasi:
   ```bash
   cd /var/www/ppdbv2/frontend
   ```
3. Install dependensi (disarankan menggunakan Yarn):
   ```bash
   yarn install
   # atau `npm install`
   ```

## 3. Konfigurasi Lingkungan (.env)
1. Buat atau ubah file `.env` di *root frontend*.
   ```bash
   cp .env.example .env
   ```
2. Pastikan file `.env` berisi *endpoint* atau URL dari API (backend) *production* Anda, contoh:
   ```env
   VITE_API_URL=https://api-domain-anda.com/api/v1
   ```

## 4. Melakukan Build (Compile) Aplikasi
Jalankan skrip *build* Vite yang akan mengkompilasi *source code* React dan TypeScript menjadi aset statis murni:
```bash
yarn build
# atau `npm run build`
```
Hasil dari *build* ini akan muncul di folder `dist`. Folder inilah yang akan kita ekspos ke *web server*.

## 5. Konfigurasi Web Server (Nginx)
Setelah folder `dist` terbuat, Anda harus mengatur *virtual host* pada Nginx untuk mengarahkan pengguna ke folder statis tersebut. Karena ini merupakan struktur *Single Page Application* (SPA), kita perlu memastikan *routing fallback* menuju `index.html`.

Berikut adalah contoh konfigurasi *Server Block* / *Virtual Host* Nginx untuk frontend:
```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;
    
    # Arahkan root ke folder dist hasil build
    root /var/www/ppdbv2/frontend/dist;
    index index.html index.htm;

    location / {
        # Sangat Penting untuk React Router / SPA!
        try_files $uri $uri/ /index.html;
    }

    # Optimasi untuk aset statis agar di-cache oleh browser
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }
}
```

Terapkan *restart/reload* pada layanan Nginx Anda setelah konfigurasi tersimpan:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Selesai
*Frontend* aplikasi kini dapat diakses melalui *browser*. Selamat mencoba!

