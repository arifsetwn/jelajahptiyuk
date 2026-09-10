# Cara Berkontribusi

Terima kasih telah tertarik membantu mengembangkan **Jelajah PTI UMS**. Kontribusi dapat berupa perbaikan bug, peningkatan aksesibilitas, optimasi performa, penambahan informasi lokasi, penyempurnaan lingkungan 3D, dokumentasi, maupun pengujian.

## Persiapan

Pastikan perangkat sudah memiliki:

- Git
- Node.js versi yang didukung oleh Vite
- npm
- Browser modern dengan dukungan WebGL

Repositori proyek tersedia di:

<https://github.com/arifsetwn/jelajahptiyuk>

## Menyiapkan proyek

1. Fork repositori melalui GitHub.
2. Clone hasil fork ke perangkat:

   ```bash
   git clone https://github.com/USERNAME_ANDA/jelajahptiyuk.git
   cd jelajahptiyuk
   ```

3. Tambahkan repositori utama sebagai upstream:

   ```bash
   git remote add upstream https://github.com/arifsetwn/jelajahptiyuk.git
   ```

4. Instal dependensi:

   ```bash
   npm install
   ```

5. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

## Membuat perubahan

Sinkronkan branch utama sebelum mulai bekerja:

```bash
git checkout main
git pull upstream main
```

Buat branch baru dengan nama yang menjelaskan perubahan:

```bash
git checkout -b fitur/nama-fitur
```

Contoh nama branch:

- `fitur/lokasi-baru`
- `perbaikan/kontrol-mobile`
- `dokumentasi/panduan-deploy`

Usahakan satu branch hanya menangani satu fitur atau perbaikan agar perubahan mudah diperiksa.

## Panduan kode dan aset

- Gunakan TypeScript dan ikuti struktur komponen yang sudah ada.
- Pertahankan tampilan responsif untuk desktop dan perangkat mobile.
- Pastikan perubahan 3D tidak mengganggu collision, kontrol pemain, dan performa.
- Simpan aset publik di dalam folder `public` dengan nama file yang jelas.
- Optimalkan ukuran gambar dan audio sebelum menambahkannya ke repositori.
- Gunakan aset buatan sendiri, berlisensi terbuka, atau aset yang telah memperoleh izin penggunaan.
- Cantumkan sumber dan lisensi aset pihak ketiga di dokumentasi bila lisensinya mewajibkan atribusi.
- Jangan memasukkan data pribadi, kredensial, API key, atau file rahasia.

Untuk perubahan informasi gedung atau fasilitas, sertakan sumber yang dapat diverifikasi. Foto sebaiknya memiliki izin publikasi dari pemilik atau unit terkait.

## Pemeriksaan sebelum pull request

Jalankan pengujian:

```bash
npm test
```

Buat production build:

```bash
npm run build
```

Periksa perubahan secara manual pada desktop dan mobile, terutama:

- Kontrol keyboard dan tombol arah sentuh
- Kamera follow dan overview
- Collision pemain, gedung, sungai, dan kendaraan
- Popup informasi dan carousel foto
- Tombol suara dan backsound
- Peta serta progres kunjungan
- Tampilan pada URL berbasis subfolder `/jelajah/`

## Commit dan pull request

Buat pesan commit yang singkat dan spesifik:

```bash
git add .
git commit -m "Perbaiki kontrol arah pada perangkat mobile"
git push origin fitur/nama-fitur
```

Kemudian buat pull request menuju branch `main` pada repositori utama. Deskripsi pull request sebaiknya menjelaskan:

- Masalah atau kebutuhan yang ditangani
- Perubahan yang dibuat
- Cara menguji perubahan
- Screenshot atau rekaman untuk perubahan visual
- Sumber dan lisensi untuk aset baru

Pengelola proyek dapat meminta revisi sebelum kontribusi digabungkan.

## Melaporkan bug atau mengusulkan fitur

Buat issue di GitHub dan sertakan informasi berikut:

- Ringkasan masalah atau usulan
- Langkah untuk memunculkan bug
- Perilaku yang diharapkan dan yang terjadi
- Jenis perangkat, sistem operasi, dan browser
- Screenshot atau rekaman layar bila tersedia
- Pesan error dari browser console bila ada

Hindari memasukkan beberapa masalah yang tidak berkaitan ke dalam satu issue.
