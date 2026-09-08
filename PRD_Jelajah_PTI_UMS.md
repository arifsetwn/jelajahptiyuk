# Product Requirement Document (PRD)

## Jelajah PTI–UMS

| Atribut | Nilai |
|---|---|
| Nama produk | Jelajah PTI–UMS |
| Jenis produk | Website eksplorasi kampus 3D interaktif |
| Pemilik produk | Program Studi Pendidikan Teknik Informatika, Universitas Muhammadiyah Surakarta |
| Status dokumen | Draft siap validasi stakeholder |
| Versi | 1.1 |
| Tanggal | 7 September 2026 |
| Platform utama | Web desktop dan mobile |
| Bahasa awal | Bahasa Indonesia |
| Inspirasi pengalaman | Diorama kota 3D interaktif seperti Jalan KL, dengan identitas dan aset orisinal UMS |

---

## 1. Ringkasan Eksekutif

Jelajah PTI–UMS adalah website eksplorasi kampus berbasis 3D yang dirancang sebagai media promosi Program Studi Pendidikan Teknik Informatika (PTI) Universitas Muhammadiyah Surakarta. Pengunjung mengendalikan karakter di dalam miniatur lingkungan kampus, mendatangi sebelas lokasi, dan memperoleh informasi melalui pop-up ketika tiba di setiap lokasi. Dunia low-poly dibangun secara procedural melalui Three.js dan React Three Fiber tanpa ketergantungan pada Blender untuk MVP.

Produk menggabungkan dua konteks promosi:

1. **Pengalaman calon mahasiswa PTI**, melalui Bookstore UMS, Gedung E, Gedung B, dan Gedung C.
2. **Identitas dan ekosistem UMS**, melalui tujuh landmark utama kampus.

Interaksi sengaja dibuat sederhana. Produk tidak memiliki mini-game, kuis, pengumpulan benda, percakapan bercabang, atau simulasi administrasi. Tujuannya adalah menciptakan pengalaman visual yang menarik, ringan, mudah digunakan, dan langsung mengarahkan pengunjung untuk mengenal PTI UMS.

Setelah seluruh lokasi dikunjungi, pengguna memperoleh halaman penyelesaian dan tombol **“Kunjungi Website PTI UMS”** menuju [https://pti.ums.ac.id/](https://pti.ums.ac.id/) yang dibuka di tab baru.

---

## 2. Latar Belakang

Informasi program studi dan fasilitas kampus umumnya disajikan melalui halaman teks, foto, video, atau brosur. Format tersebut informatif, tetapi belum selalu memberi gambaran spasial mengenai hubungan antara ruang belajar PTI dan fasilitas UMS secara keseluruhan.

Jelajah PTI–UMS menawarkan pengalaman pengenalan kampus yang:

- Lebih menarik dibandingkan daftar fasilitas statis.
- Memperlihatkan konteks kehidupan mahasiswa PTI di lingkungan UMS.
- Dapat digunakan dalam kegiatan promosi, pameran pendidikan, penerimaan mahasiswa baru, kunjungan sekolah, dan orientasi daring.
- Dapat diakses tanpa pemasangan aplikasi khusus.
- Memiliki identitas visual yang mudah dibagikan melalui media sosial dan kanal promosi kampus.

UMS juga pernah memperkenalkan UMSVerse yang memuat Gedung Induk Siti Walidah dan Edutorium. Keberadaan inisiatif tersebut menunjukkan bahwa eksplorasi kampus virtual relevan dengan kebutuhan institusi. Jelajah PTI–UMS mengambil pendekatan yang lebih ringan dan berorientasi web, dengan fokus utama pada promosi PTI dan perjalanan singkat calon mahasiswa.

---

## 3. Pernyataan Masalah

Calon mahasiswa dan orang tua membutuhkan cara yang cepat dan menarik untuk memahami:

- Seperti apa lingkungan belajar mahasiswa PTI.
- Lokasi dan fungsi ruang kelas, laboratorium komputer, Tata Usaha, serta fasilitas pendukung.
- Hubungan PTI dengan lingkungan FKIP dan ekosistem UMS.
- Landmark yang membentuk identitas kampus.
- Cara memperoleh informasi resmi lebih lanjut mengenai PTI.

Media promosi yang hanya berisi teks dan foto belum memberikan pengalaman eksplorasi yang imersif. Sebaliknya, pengalaman 3D yang terlalu kompleks berisiko berat, sulit digunakan, dan mahal diproduksi. Produk ini harus menemukan titik tengah: visual yang berkesan, interaksi yang sederhana, dan konten yang jelas.

---

## 4. Visi Produk

Menjadi pintu masuk digital yang menyenangkan bagi calon mahasiswa untuk mengenal pengalaman belajar di PTI serta lingkungan ikonik Universitas Muhammadiyah Surakarta.

### 4.1 Nilai Utama

- **Mudah dijelajahi:** pengguna dapat memahami kontrol tanpa tutorial panjang.
- **Informatif:** setiap lokasi menjelaskan fungsi dan relevansinya secara ringkas.
- **Berkarakter UMS:** visual, bahasa, dan narasi mencerminkan identitas UMS dan Muhammadiyah.
- **Berfokus pada PTI:** landmark UMS memperkuat konteks, sedangkan tujuan akhirnya tetap mengarahkan minat kepada PTI.
- **Ringan dan inklusif:** dapat digunakan pada perangkat dengan kemampuan berbeda.

---

## 5. Tujuan Produk

### 5.1 Tujuan Bisnis dan Institusi

1. Meningkatkan daya tarik materi promosi PTI UMS.
2. Meningkatkan kunjungan berkualitas ke website resmi PTI.
3. Memperkenalkan fasilitas akademik PTI dan FKIP.
4. Memperkuat persepsi bahwa mahasiswa PTI belajar dalam ekosistem kampus yang lengkap.
5. Menyediakan media demonstrasi untuk kegiatan promosi luring dan daring.

### 5.2 Tujuan Pengguna

1. Memahami gambaran lingkungan PTI dan UMS dalam beberapa menit.
2. Mengetahui fungsi sebelas lokasi utama.
3. Menjelajahi kampus tanpa harus memahami mekanisme permainan kompleks.
4. Menemukan tautan resmi untuk mempelajari PTI lebih lanjut.

### 5.3 Bukan Tujuan Produk

Produk versi awal tidak ditujukan untuk:

- Menggantikan peta navigasi kampus yang presisi.
- Menjadi sistem penerimaan mahasiswa baru.
- Menjadi tur interior lengkap setiap lantai.
- Menjadi simulasi akademik atau administrasi.
- Menjadi gim dengan tantangan, skor, kompetisi, atau hadiah material.
- Menampilkan seluruh gedung dan program studi UMS.
- Menyediakan pengalaman virtual reality khusus headset.

---

## 6. Target Pengguna

### 6.1 Persona Utama: Calon Mahasiswa

- Siswa SMA/SMK/MA yang sedang memilih program studi.
- Menggunakan ponsel sebagai perangkat utama.
- Tertarik pada teknologi, pendidikan, komputer, multimedia, atau pemrograman.
- Membutuhkan informasi visual yang singkat dan mudah dibagikan.

**Kebutuhan:** mengetahui fasilitas PTI, suasana kampus, dan jalur informasi resmi.

### 6.2 Persona Sekunder: Orang Tua atau Wali

- Ingin memahami lingkungan belajar dan fasilitas kampus.
- Lebih membutuhkan kejelasan informasi daripada mekanisme eksplorasi yang rumit.

**Kebutuhan:** keyakinan bahwa PTI berada dalam lingkungan kampus yang lengkap, aman, dan mendukung pembelajaran.

### 6.3 Persona Sekunder: Tim Promosi PTI

- Menggunakan produk pada pameran pendidikan, kunjungan sekolah, media sosial, dan presentasi.
- Membutuhkan pengalaman yang dapat dimulai ulang dengan cepat dan stabil.

**Kebutuhan:** media promosi yang menarik, mudah didemonstrasikan, dan memiliki ajakan bertindak yang jelas.

### 6.4 Persona Tambahan: Mahasiswa Baru

- Membutuhkan pengenalan awal terhadap lokasi dan fungsi fasilitas kampus.
- Dapat menggunakan website sebelum kunjungan atau orientasi kampus.

---

## 7. Prinsip Pengalaman

1. **Jelajah dahulu, baca seperlunya.** Dunia 3D menjadi daya tarik utama; teks pop-up tetap ringkas.
2. **Satu pola interaksi.** Semua lokasi menggunakan cara yang sama untuk membuka dan menutup informasi.
3. **Tidak ada kegagalan.** Pengguna tidak dapat kalah, kehilangan progres, atau terjebak.
4. **Progres terlihat.** Jumlah lokasi yang telah dikunjungi selalu dapat diketahui.
5. **Kontrol fleksibel.** Keyboard untuk desktop dan joystick sentuh untuk mobile.
6. **Identitas orisinal.** Tidak menyalin merek, kode, model, audio, karakter, atau antarmuka Jalan KL.
7. **Informasi terverifikasi.** Konten lokasi harus disetujui oleh PTI dan unit terkait sebelum publikasi.

---

## 8. Ruang Lingkup MVP

### 8.1 Termasuk dalam MVP

- Landing screen dengan identitas Jelajah PTI–UMS.
- Dunia kampus 3D bergaya low-poly.
- Karakter pemain sederhana.
- Navigasi berjalan pada desktop dan mobile.
- Sebelas lokasi yang dapat dikunjungi.
- Penanda interaktif pada setiap lokasi.
- Pop-up informasi untuk setiap lokasi.
- Status lokasi telah dikunjungi.
- Penghitung progres `x dari 11 lokasi`.
- Peta ringkas untuk melihat posisi lokasi.
- Tombol kembali ke titik awal.
- Kontrol kamera dasar.
- Pengaturan suara dan kualitas grafis.
- Halaman penyelesaian.
- Tombol menuju website PTI UMS di tab baru.
- Analitik dasar tanpa mengumpulkan data pribadi sensitif.

### 8.2 Tidak Termasuk dalam MVP

- Mini-game.
- Kuis dan penilaian.
- Sistem akun atau login.
- Penyimpanan progres lintas perangkat.
- Chatbot.
- Multiplayer.
- Percakapan NPC bercabang.
- Interior gedung yang dapat dijelajahi penuh.
- Integrasi sistem akademik UMS.
- Integrasi formulir pendaftaran mahasiswa baru.
- Augmented reality atau virtual reality.
- Kendaraan yang dapat dikendalikan.

---

## 9. Daftar Lokasi

Produk memiliki sebelas lokasi. Empat lokasi mempromosikan pengalaman mahasiswa PTI, sedangkan tujuh lokasi memperlihatkan fasilitas dan identitas UMS.

### 9.1 Lokasi PTI dan FKIP

#### L01 — Bookstore UMS

- **Tujuan komunikasi:** memperkenalkan fasilitas pendukung mahasiswa baru.
- **Judul pop-up:** Bookstore UMS
- **Ringkasan konten:** Mahasiswa baru dapat mengunjungi Bookstore UMS untuk menukarkan voucher buku dan memperoleh kebutuhan penunjang perkuliahan.
- **Media:** satu ilustrasi atau foto yang telah memiliki izin penggunaan.
- **Label penanda:** Bookstore

#### L02 — Gedung E

- **Tujuan komunikasi:** memperlihatkan suasana ruang kelas mahasiswa.
- **Judul pop-up:** Ruang Kuliah Mahasiswa
- **Ringkasan konten:** Gedung E menjadi salah satu lokasi kegiatan perkuliahan. Informasi menampilkan gambaran ruang kelas, fasilitas pembelajaran, dan suasana perkuliahan mahasiswa PTI.
- **Media:** foto ruang kelas atau visualisasi interior sederhana.
- **Label penanda:** Ruang Kelas

#### L03 — Gedung B

- **Tujuan komunikasi:** menonjolkan fasilitas praktik teknologi.
- **Judul pop-up:** Laboratorium Komputer
- **Ringkasan konten:** Laboratorium komputer mendukung kegiatan praktikum mahasiswa PTI, termasuk pemrograman, multimedia, jaringan komputer, dan pengembangan media pembelajaran.
- **Media:** foto laboratorium dan perangkat utama.
- **Label penanda:** Lab Komputer

#### L04 — Gedung C

- **Tujuan komunikasi:** memperkenalkan lingkungan FKIP dan layanan administrasi.
- **Judul pop-up:** Lingkungan FKIP dan Tata Usaha
- **Ringkasan konten:** Area Gedung C memiliki landmark “I Love FKIP” serta ruang Tata Usaha yang mendukung berbagai kebutuhan administrasi akademik mahasiswa.
- **Media:** foto landmark dan/atau ruang Tata Usaha.
- **Label penanda:** FKIP dan Tata Usaha

### 9.2 Landmark UMS

#### L05 — Gedung Induk Siti Walidah

- **Tujuan komunikasi:** memperkenalkan pusat layanan dan identitas arsitektur UMS.
- **Judul pop-up:** Gedung Induk Siti Walidah
- **Ringkasan konten:** Gedung Induk Siti Walidah merupakan pusat administrasi dan pelayanan terpadu UMS. Arsitekturnya memiliki filosofi yang berkaitan dengan matahari Muhammadiyah.
- **Media:** foto eksterior utama.
- **Label penanda:** Siti Walidah

#### L06 — Edutorium KH Ahmad Dahlan

- **Tujuan komunikasi:** memperlihatkan skala kegiatan akademik dan publik UMS.
- **Judul pop-up:** Edutorium KH Ahmad Dahlan
- **Ringkasan konten:** Edutorium digunakan untuk wisuda, seminar, pertunjukan, dan berbagai kegiatan akademik maupun umum berskala besar.
- **Media:** foto fasad atau interior utama.
- **Label penanda:** Edutorium

#### L07 — Masjid Hj. Sudalmiyah Rais

- **Tujuan komunikasi:** memperkenalkan kehidupan Islami dan arsitektur kampus.
- **Judul pop-up:** Masjid Hj. Sudalmiyah Rais
- **Ringkasan konten:** Masjid Hj. Sudalmiyah Rais merupakan salah satu pusat kegiatan ibadah dan keislaman di Kampus 2 UMS, dengan arsitektur terbuka dan identitas visual Muhammadiyah.
- **Media:** foto eksterior dengan sudut yang representatif.
- **Label penanda:** Masjid Sudalmiyah Rais
- **Catatan pengalaman:** animasi, suara, dan penempatan karakter harus menjaga kepantasan area ibadah.

#### L08 — Perpustakaan Pusat

- **Tujuan komunikasi:** memperkenalkan dukungan pembelajaran dan penelitian.
- **Judul pop-up:** Perpustakaan Pusat UMS
- **Ringkasan konten:** Perpustakaan menyediakan koleksi buku, sumber digital, ruang diskusi, serta layanan yang mendukung pembelajaran dan penelitian mahasiswa.
- **Media:** foto eksterior atau ruang layanan utama.
- **Label penanda:** Perpustakaan

#### L09 — Danau UMS dan Kantin Tepi Danau

- **Tujuan komunikasi:** memperlihatkan kehidupan sosial dan ruang terbuka kampus.
- **Judul pop-up:** Danau UMS dan Kantin Tepi Danau
- **Ringkasan konten:** Area danau dan kantin menjadi tempat mahasiswa beristirahat, makan, bertemu, serta berdiskusi dalam suasana ruang terbuka.
- **Media:** foto danau atau area kantin.
- **Label penanda:** Danau dan Kantin

#### L10 — Auditorium M. Djazman

- **Tujuan komunikasi:** memperkenalkan ruang kegiatan akademik dan kemahasiswaan.
- **Judul pop-up:** Auditorium M. Djazman
- **Ringkasan konten:** Auditorium M. Djazman digunakan untuk seminar, pertemuan, presentasi, dan berbagai kegiatan kemahasiswaan di Kampus 1.
- **Media:** foto gedung atau ruang auditorium.
- **Label penanda:** Auditorium M. Djazman

#### L11 — Masjid Fadhlurrahman

- **Tujuan komunikasi:** memperkenalkan pusat ibadah di Kampus 1.
- **Judul pop-up:** Masjid Fadhlurrahman
- **Ringkasan konten:** Masjid Fadhlurrahman menjadi salah satu pusat kegiatan ibadah dan pembinaan keislaman bagi sivitas akademika UMS di Kampus 1.
- **Media:** foto eksterior utama.
- **Label penanda:** Masjid Fadhlurrahman
- **Catatan pengalaman:** animasi, suara, dan penempatan karakter harus menjaga kepantasan area ibadah.

---

## 10. Arsitektur Informasi

### 10.1 Layar Utama

1. Landing screen.
2. Panduan kontrol singkat.
3. Dunia eksplorasi 3D.
4. Pop-up informasi lokasi.
5. Peta lokasi.
6. Panel daftar lokasi dan progres.
7. Panel pengaturan.
8. Layar penyelesaian.

### 10.2 Navigasi Global

- Logo Jelajah PTI–UMS.
- Tombol suara aktif/nonaktif.
- Tombol pengaturan grafis.
- Tombol peta.
- Tombol daftar lokasi.
- Tombol bantuan.
- Penghitung progres.

---

## 11. Perjalanan Pengguna

### 11.1 Kunjungan Pertama

1. Pengguna membuka URL produk.
2. Landing screen tampil sambil aset inti dimuat.
3. Pengguna melihat judul, deskripsi singkat, dan tombol **“Mulai Jelajah”**.
4. Setelah aset minimum siap, tombol dapat digunakan.
5. Panduan kontrol singkat muncul pada penggunaan pertama.
6. Pengguna menutup panduan dan mulai menjelajah.

### 11.2 Mengunjungi Lokasi

1. Pengguna melihat penanda di dekat lokasi.
2. Nama lokasi muncul ketika karakter berada dalam radius interaksi.
3. Tombol **“Lihat Informasi”** muncul.
4. Pengguna menekan tombol atau tombol interaksi keyboard.
5. Dunia 3D berhenti sementara.
6. Pop-up menampilkan nama, gambar, deskripsi, fungsi, dan fakta menarik.
7. Lokasi otomatis ditandai telah dikunjungi ketika pop-up berhasil terbuka.
8. Pengguna memilih **“Tutup dan Lanjut Jelajah”**.
9. Dunia 3D aktif kembali dan progres diperbarui.

### 11.3 Menggunakan Peta

1. Pengguna membuka peta.
2. Peta menampilkan posisi pemain dan sebelas lokasi.
3. Lokasi yang telah dikunjungi memiliki tanda centang.
4. Lokasi yang belum dikunjungi tetap memiliki penanda aktif.
5. Pengguna menutup peta dan melanjutkan perjalanan.

Peta MVP tidak wajib menyediakan teleportasi. Jika teleportasi disediakan, pengguna harus dipindahkan ke titik aman di luar bangunan dan tidak boleh muncul di dalam objek 3D.

### 11.4 Menyelesaikan Jelajah

1. Sistem mendeteksi progres `11 dari 11`.
2. Notifikasi penyelesaian muncul tanpa memaksa perpindahan layar.
3. Pengguna dapat membuka layar penyelesaian.
4. Layar menampilkan pesan:

   > Selamat! Kamu telah menyelesaikan Jelajah PTI–UMS dan mengenal lingkungan belajar mahasiswa Pendidikan Teknik Informatika.

5. Pengguna dapat memilih **“Kunjungi Website PTI UMS”**.
6. Website [https://pti.ums.ac.id/](https://pti.ums.ac.id/) terbuka di tab baru.
7. Tab Jelajah PTI–UMS tetap terbuka agar progres tidak hilang.

---

## 12. Spesifikasi Pop-up Informasi

### 12.1 Komponen Wajib

Setiap pop-up memuat:

- Kode dan nama lokasi.
- Satu gambar utama dengan teks alternatif.
- Deskripsi maksimal 80 kata.
- Fungsi utama lokasi.
- Satu fakta menarik maksimal 30 kata.
- Status **“Lokasi dikunjungi”**.
- Tombol **“Tutup dan Lanjut Jelajah”**.
- Tombol tutup berbentuk ikon dengan label aksesibel.

### 12.2 Perilaku

- Pop-up berada di atas dunia 3D dengan overlay yang cukup kontras.
- Gerakan karakter dan kamera dihentikan ketika pop-up terbuka.
- Tombol Escape menutup pop-up pada desktop.
- Fokus keyboard berpindah ke pop-up saat dibuka dan kembali ke pemicu saat ditutup.
- Pop-up dapat digulir jika tinggi layar terbatas.
- Membuka ulang pop-up tidak menambah hitungan progres dua kali.
- Gambar memiliki fallback jika gagal dimuat.

### 12.3 Template Konten

| Field | Tipe | Batas |
|---|---|---|
| `id` | String | Unik, format `L01`–`L11` |
| `slug` | String | Unik dan ramah URL |
| `title` | String | Maksimal 60 karakter |
| `category` | Enum | `pti_fkip` atau `landmark_ums` |
| `short_description` | String | Maksimal 80 kata |
| `primary_function` | String | Maksimal 25 kata |
| `interesting_fact` | String | Maksimal 30 kata |
| `image_url` | String | Aset lokal/CDN yang disetujui |
| `image_alt` | String | Maksimal 140 karakter |
| `map_label` | String | Maksimal 24 karakter |
| `position` | Object | Koordinat dunia 3D |
| `interaction_radius` | Number | Satuan dunia 3D |
| `published` | Boolean | Mengatur visibilitas lokasi |

---

## 13. Persyaratan Fungsional

### 13.1 Landing dan Loading

- **FR-001:** Sistem harus menampilkan identitas Jelajah PTI–UMS saat halaman dibuka.
- **FR-002:** Sistem harus menampilkan indikator progres pemuatan aset.
- **FR-003:** Tombol **“Mulai Jelajah”** hanya aktif setelah aset minimum siap.
- **FR-004:** Sistem harus menyediakan penjelasan singkat mengenai tujuan pengalaman.
- **FR-005:** Sistem harus dapat menampilkan pesan pemulihan jika aset 3D gagal dimuat.

### 13.2 Kontrol Pemain

- **FR-006:** Pengguna desktop harus dapat bergerak menggunakan WASD dan tombol panah.
- **FR-007:** Pengguna mobile harus dapat bergerak menggunakan joystick virtual.
- **FR-008:** Sistem harus mencegah pemain berjalan menembus bangunan utama.
- **FR-009:** Sistem harus menyediakan tombol untuk kembali ke titik awal.
- **FR-010:** Sistem harus memulihkan pemain ke titik aman jika keluar dari batas dunia.

### 13.3 Kamera

- **FR-011:** Kamera harus mengikuti karakter secara otomatis.
- **FR-012:** Sistem harus menyediakan tampilan overview kampus.
- **FR-013:** Kamera tidak boleh masuk ke dalam model bangunan atau berada di bawah permukaan tanah.
- **FR-014:** Perubahan kamera harus tersedia melalui tombol yang dapat diakses pada desktop dan mobile.

### 13.4 Lokasi dan Interaksi

- **FR-015:** Sistem harus menampilkan sebelas lokasi yang ditentukan dalam PRD.
- **FR-016:** Setiap lokasi harus memiliki penanda yang dapat dikenali.
- **FR-017:** Nama lokasi harus muncul ketika pemain memasuki radius interaksi.
- **FR-018:** Sistem harus menampilkan kontrol **“Lihat Informasi”** saat pemain berada dalam radius.
- **FR-019:** Pengguna desktop harus dapat membuka informasi dengan keyboard.
- **FR-020:** Pengguna mobile harus dapat membuka informasi dengan tombol sentuh.
- **FR-021:** Sistem harus menghentikan simulasi gerakan saat pop-up terbuka.
- **FR-022:** Lokasi harus ditandai telah dikunjungi ketika pop-up berhasil dibuka.
- **FR-023:** Sistem tidak boleh menghitung kunjungan berulang sebagai lokasi baru.

### 13.5 Progres

- **FR-024:** Sistem harus menampilkan progres dalam format `x dari 11 lokasi`.
- **FR-025:** Sistem harus membedakan lokasi yang sudah dan belum dikunjungi.
- **FR-026:** Progres harus bertahan jika halaman dimuat ulang pada browser yang sama, menggunakan penyimpanan lokal.
- **FR-027:** Pengguna harus dapat menghapus progres melalui pengaturan.
- **FR-028:** Penghapusan progres harus meminta konfirmasi karena menghilangkan status kunjungan lokal.

### 13.6 Peta dan Daftar Lokasi

- **FR-029:** Peta harus menampilkan posisi relatif seluruh lokasi.
- **FR-030:** Peta harus menampilkan posisi pemain.
- **FR-031:** Lokasi yang telah dikunjungi harus memiliki tanda centang.
- **FR-032:** Daftar lokasi harus dapat difilter berdasarkan kategori PTI/FKIP dan landmark UMS.
- **FR-033:** Memilih lokasi pada daftar harus menyorot lokasinya pada peta.

### 13.7 Pengaturan

- **FR-034:** Pengguna harus dapat mengaktifkan atau menonaktifkan suara.
- **FR-035:** Suara tidak boleh diputar otomatis sebelum interaksi pengguna.
- **FR-036:** Pengguna harus dapat memilih kualitas grafis ringan atau detail.
- **FR-037:** Sistem harus memilih kualitas awal berdasarkan kemampuan perangkat dengan opsi perubahan manual.
- **FR-038:** Preferensi suara dan grafis harus disimpan secara lokal.

### 13.8 Penyelesaian dan Ajakan Bertindak

- **FR-039:** Sistem harus mendeteksi ketika seluruh sebelas lokasi telah dikunjungi.
- **FR-040:** Sistem harus menampilkan layar penyelesaian.
- **FR-041:** Layar penyelesaian harus memiliki tombol **“Kunjungi Website PTI UMS”**.
- **FR-042:** Tombol harus menuju `https://pti.ums.ac.id/`.
- **FR-043:** Tautan harus terbuka di tab baru dengan atribut keamanan yang sesuai.
- **FR-044:** Sistem harus mencatat klik tombol sebagai peristiwa analitik.

---

## 14. Persyaratan Nonfungsional

### 14.1 Performa

- Pengalaman harus tetap responsif pada laptop kelas menengah dan ponsel modern.
- Target frame rate adalah 30 FPS pada mode ringan dan 45–60 FPS pada perangkat yang mendukung.
- Input harus terasa responsif tanpa jeda yang mengganggu.
- Aset utama harus dikompresi dan dimuat bertahap.
- Geometri procedural menggunakan tingkat detail yang proporsional terhadap jarak kamera.
- Tekstur menggunakan ukuran dan format terkompresi yang sesuai untuk web.
- Objek berulang seperti pohon, lampu, dan bangku menggunakan instancing jika teknologi mendukung.
- Dunia harus berhenti atau mengurangi proses render ketika tab tidak aktif.

### 14.2 Target Pemuatan

Target berikut digunakan sebagai sasaran, kemudian divalidasi melalui pengujian perangkat nyata:

- Landing UI terlihat dalam 2,5 detik pada koneksi 4G yang stabil.
- Pengguna dapat memulai versi ringan dalam 8 detik pada koneksi 4G yang stabil.
- Tersedia feedback pemuatan selama aset tambahan diunduh.
- Gambar pop-up dimuat saat mendekati lokasi atau saat diperlukan.

### 14.3 Responsivitas

- Mendukung viewport mulai lebar 360 piksel.
- Kontrol tidak menutupi karakter atau penanda utama.
- Pop-up dapat digunakan dalam orientasi portrait dan landscape.
- Mode landscape direkomendasikan pada mobile, tetapi bukan persyaratan wajib.
- Tombol sentuh memiliki target interaksi minimum 44 × 44 piksel.

### 14.4 Aksesibilitas

- Antarmuka UI menargetkan WCAG 2.2 Level AA sejauh berlaku untuk pengalaman WebGL.
- Semua tombol memiliki label yang dapat dibaca teknologi bantu.
- Informasi lokasi tersedia dalam bentuk teks HTML, bukan hanya tekstur di dunia 3D.
- Gambar memiliki teks alternatif.
- Fokus keyboard terlihat jelas.
- Pop-up mendukung focus trap dan navigasi keyboard.
- Kontras teks dan kontrol memenuhi standar aksesibilitas.
- Informasi tidak hanya dibedakan melalui warna.
- Pengguna dapat menonaktifkan atau mengurangi animasi dekoratif.
- Produk menyediakan daftar lokasi berbasis HTML sebagai alternatif navigasi informasi.

### 14.5 Keamanan dan Privasi

- MVP tidak meminta nama, nomor telepon, email, NIM, lokasi presisi, atau data sensitif.
- Tidak ada akun pengguna.
- Penyimpanan lokal hanya berisi progres dan preferensi.
- Semua sumber daya disajikan melalui HTTPS.
- Dependensi pihak ketiga harus diaudit dan diperbarui secara berkala.
- Content Security Policy diterapkan jika kompatibel dengan hosting.
- Tautan eksternal yang dibuka di tab baru menggunakan `noopener` dan `noreferrer` sesuai kebutuhan.
- Analitik menggunakan konfigurasi yang meminimalkan identifikasi pengguna.

### 14.6 Kompatibilitas

Versi rilis harus diuji pada:

- Chrome dua versi stabil terakhir.
- Edge dua versi stabil terakhir.
- Firefox dua versi stabil terakhir.
- Safari versi stabil terbaru.
- Chrome Android versi stabil terbaru.
- Safari iOS versi stabil terbaru.

Jika WebGL tidak tersedia, sistem harus menampilkan versi fallback berisi daftar lokasi dan pop-up informasi berbasis HTML.

### 14.7 Reliabilitas

- Kegagalan satu gambar pop-up tidak boleh menghentikan dunia 3D.
- Kesalahan analitik tidak boleh menghalangi interaksi pengguna.
- Sistem harus dapat kembali ke titik aman dari kondisi posisi pemain yang tidak valid.
- Pengalaman inti harus tetap berjalan ketika suara tidak tersedia.

---

## 15. Arah Desain Visual

### 15.1 Karakter Visual

- Diorama kampus bergaya low-poly yang hangat dan ramah.
- Bentuk setiap bangunan tetap mudah dikenali dari siluet dan elemen fasad utama.
- Palet mengadaptasi identitas UMS/PTI tanpa meniru komposisi visual Jalan KL.
- Biru dapat menjadi warna utama, dengan aksen kuning atau warna pendukung yang telah disetujui unit branding.
- Lingkungan menampilkan pohon, jalur pejalan kaki, jalan, danau, papan penunjuk, serta aktivitas kampus secukupnya.

### 15.2 Antarmuka

- Panel informasi menggunakan bentuk sederhana dan kontras tinggi.
- Tipografi mengutamakan keterbacaan.
- Elemen dekoratif tidak boleh mengurangi fokus pada bangunan.
- Ikon menggunakan satu sistem visual yang konsisten.
- Identitas resmi UMS dan PTI hanya digunakan setelah persetujuan dan sesuai pedoman merek.

### 15.3 Model 3D

- Seluruh bentuk 3D MVP dibangun secara procedural langsung melalui kode Three.js/React Three Fiber.
- Blender bukan bagian dari pipeline produksi MVP.
- Bangunan disusun dari primitive geometry seperti box, plane, cylinder, cone, sphere, shape, dan extrude geometry.
- Bentuk khusus dapat menggunakan `BufferGeometry` yang dibuat melalui kode.
- Fokus pada bentuk eksterior dan ciri pembeda, bukan detail fotorealistik.
- Interior hanya diwakili melalui gambar dalam pop-up pada MVP.
- Collision menggunakan collider sederhana yang terpisah dari geometri visual.
- Elemen berulang seperti pohon, lampu, kursi, jendela, dan pagar menggunakan komponen reusable serta instancing.
- Detail logo, tulisan gedung, dan ornamen kompleks dapat menggunakan SVG, decal, atau tekstur transparan berizin.
- Setiap landmark harus dapat dikenali melalui siluet, proporsi, warna, bentuk atap, dan elemen fasad utamanya.

### 15.4 Tingkat Abstraksi Bangunan

- Gedung tidak ditargetkan sebagai rekonstruksi arsitektur presisi.
- Proporsi dapat disederhanakan selama ciri visual utama tetap dapat dikenali.
- Bookstore, Gedung B, Gedung C, Gedung E, kantin, jalan, dan fasilitas pendukung menggunakan sistem komponen modular.
- Gedung Induk Siti Walidah, Edutorium KH Ahmad Dahlan, Masjid Hj. Sudalmiyah Rais, dan Masjid Fadhlurrahman memperoleh geometri procedural khusus karena memiliki siluet lebih khas.
- Detail yang tidak terlihat dari kamera permainan tidak perlu dimodelkan.
- Stakeholder memvalidasi keterkenalan bangunan dari sudut kamera utama sebelum implementasi detail lanjutan.

---

## 16. Suara dan Gerak

### 16.1 Suara

- Musik latar bersifat opsional dan nonintrusif.
- Suara langkah, ambience kampus, dan feedback UI digunakan secara ringan.
- Audio dimulai hanya setelah pengguna menekan **“Mulai Jelajah”** atau mengaktifkan suara.
- Kontrol mute selalu tersedia.
- Audio harus memiliki lisensi yang jelas atau dibuat secara orisinal.

### 16.2 Animasi

- Pohon dapat bergerak ringan.
- Penanda lokasi memiliki animasi lembut.
- NPC dekoratif diperbolehkan, tetapi tidak wajib untuk MVP.
- Animasi tidak boleh menghalangi pembacaan informasi.
- Mode reduced motion mengurangi gerak kamera dan animasi dekoratif.

---

## 17. Arsitektur Teknis yang Direkomendasikan

Stack teknis MVP yang dikunci:

- Bahasa menggunakan TypeScript.
- Build tool menggunakan Vite.
- Frontend menggunakan React.
- Rendering 3D menggunakan Three.js melalui React Three Fiber.
- Helper scene dan kontrol menggunakan `@react-three/drei` seperlunya.
- Collision dan sensor radius interaksi menggunakan `@react-three/rapier`.
- State management menggunakan Zustand.
- Styling antarmuka menggunakan Tailwind CSS.
- Geometri lingkungan dan sebelas bangunan dibuat langsung melalui kode, bukan diimpor dari Blender.
- Format GLB/GLTF tidak menjadi dependensi untuk bangunan MVP.
- SVG, gambar, dan tekstur terkompresi dapat digunakan untuk papan nama, logo berizin, foto pop-up, dan detail fasad.
- Konten lokasi dikelola melalui berkas JSON atau CMS ringan.
- Progres dan preferensi disimpan melalui `localStorage`.
- Hosting menggunakan CDN dengan cache aset statis.
- Analitik menggunakan platform yang disetujui UMS.

### 17.1 Susunan Stack

```text
Vite
└── React + TypeScript
    ├── Tailwind CSS
    ├── Zustand
    ├── UI HTML yang aksesibel
    └── React Three Fiber
        ├── Three.js
        ├── Drei
        ├── React Three Rapier
        └── Geometri procedural berbasis komponen
```

### 17.2 Pemisahan Sistem

1. **Presentation layer:** landing, HUD, peta, daftar lokasi, pop-up, pengaturan, dan layar penyelesaian.
2. **World layer:** scene, pencahayaan, kamera, karakter, collision, dan penanda lokasi.
3. **Content layer:** teks, gambar, koordinat, kategori, dan status publikasi lokasi.
4. **State layer:** progres kunjungan, preferensi grafis, suara, serta status tutorial.
5. **Analytics layer:** peristiwa penggunaan tanpa data pribadi sensitif.

### 17.3 Library Komponen Dunia

Implementasi harus menyediakan komponen reusable untuk menghindari duplikasi geometri dan material:

- `ProceduralBuilding` untuk massa bangunan modular.
- `FacadeModule` untuk jendela, kolom, pintu, dan panel.
- `RoofModule` untuk atap datar, miring, kubah sederhana, dan kanopi.
- `CampusRoad` untuk jalan dan jalur pejalan kaki.
- `TreeCluster` untuk vegetasi berbasis instancing.
- `LocationMarker` untuk penanda serta sensor interaksi.
- `CollisionBoundary` untuk batas bangunan dan dunia.
- Komponen khusus bagi landmark dengan siluet unik.

Material, warna, ukuran primitive, dan tingkat detail disimpan sebagai parameter agar perubahan visual tidak memerlukan penulisan ulang seluruh komponen.

---

## 18. Model Data Progres

Contoh struktur penyimpanan lokal:

```json
{
  "schemaVersion": 1,
  "visitedLocationIds": ["L01", "L02"],
  "graphicsQuality": "light",
  "soundEnabled": false,
  "tutorialSeen": true,
  "completionSeen": false
}
```

Aturan:

- ID yang tidak dikenal harus diabaikan.
- Perubahan versi skema harus memiliki strategi migrasi atau reset yang aman.
- Tidak ada informasi identitas pengguna dalam data progres.

---

## 19. Analitik dan Pengukuran

### 19.1 North Star Metric

Persentase sesi yang membuka sedikitnya satu pop-up PTI dan satu pop-up landmark UMS.

### 19.2 Indikator Utama

- Rasio klik **“Mulai Jelajah”** dari landing screen.
- Persentase sesi yang mengunjungi minimal satu lokasi.
- Rata-rata jumlah lokasi yang dikunjungi per sesi.
- Persentase penyelesaian 11 lokasi.
- Rasio klik **“Kunjungi Website PTI UMS”**.
- Waktu rata-rata menuju pop-up pertama.
- Lokasi paling sering dan paling jarang dibuka.
- Distribusi perangkat dan mode kualitas grafis.
- Rasio kegagalan pemuatan pengalaman 3D.

### 19.3 Daftar Peristiwa

| Event | Dipicu ketika | Properti nonpribadi |
|---|---|---|
| `experience_loaded` | Aset minimum siap | device_class, quality_mode, load_time_bucket |
| `exploration_started` | Tombol mulai dipilih | input_type |
| `location_prompt_seen` | Pemain memasuki radius | location_id |
| `location_popup_opened` | Pop-up terbuka | location_id, category, visited_before |
| `map_opened` | Peta dibuka | visited_count |
| `quality_changed` | Mode grafis diubah | from, to |
| `experience_completed` | Progres mencapai 11 | session_duration_bucket |
| `pti_website_clicked` | CTA website PTI dipilih | visited_count, completed |
| `fallback_shown` | WebGL tidak tersedia/gagal | reason_category |

Analitik tidak boleh merekam teks bebas, alamat IP mentah jika dapat dihindari, koordinat GPS, atau identitas calon mahasiswa.

---

## 20. Acceptance Criteria

### AC-01 — Memulai Pengalaman

**Given** aset minimum berhasil dimuat  
**When** pengguna memilih **“Mulai Jelajah”**  
**Then** dunia 3D tampil, karakter dapat dikendalikan, dan panduan singkat tersedia.

### AC-02 — Membuka Informasi Lokasi

**Given** karakter berada di luar radius interaksi  
**When** karakter memasuki radius lokasi  
**Then** nama lokasi dan kontrol **“Lihat Informasi”** muncul.

### AC-03 — Pencatatan Kunjungan

**Given** lokasi belum pernah dikunjungi  
**When** pop-up lokasi berhasil dibuka  
**Then** lokasi ditandai telah dikunjungi dan progres bertambah satu.

### AC-04 — Kunjungan Berulang

**Given** lokasi sudah pernah dikunjungi  
**When** pengguna membuka pop-up lokasi kembali  
**Then** informasi tetap tampil tetapi progres tidak bertambah.

### AC-05 — Pop-up Menghentikan Dunia

**Given** dunia 3D sedang aktif  
**When** pop-up dibuka  
**Then** karakter berhenti bergerak dan input gerakan tidak memindahkan karakter.

### AC-06 — Menutup Pop-up

**Given** pop-up sedang terbuka  
**When** pengguna memilih **“Tutup dan Lanjut Jelajah”**, ikon tutup, atau Escape pada desktop  
**Then** pop-up tertutup, fokus kembali dengan benar, dan dunia dapat dijelajahi.

### AC-07 — Peta dan Status

**Given** beberapa lokasi telah dikunjungi  
**When** pengguna membuka peta  
**Then** posisi pemain terlihat dan lokasi yang dikunjungi memiliki tanda berbeda.

### AC-08 — Penyimpanan Progres

**Given** pengguna telah mengunjungi beberapa lokasi  
**When** halaman dimuat ulang pada browser yang sama  
**Then** status kunjungan dan preferensi dipulihkan.

### AC-09 — Penyelesaian

**Given** sepuluh lokasi telah dikunjungi  
**When** pengguna membuka pop-up lokasi terakhir  
**Then** progres menjadi `11 dari 11` dan notifikasi penyelesaian tersedia.

### AC-10 — CTA PTI

**Given** layar penyelesaian terbuka  
**When** pengguna memilih **“Kunjungi Website PTI UMS”**  
**Then** `https://pti.ums.ac.id/` terbuka di tab baru dan pengalaman tetap terbuka di tab sebelumnya.

### AC-11 — Mobile

**Given** pengguna membuka produk pada viewport 360 piksel  
**When** pengguna memulai jelajah  
**Then** joystick, kontrol interaksi, progres, dan pop-up dapat digunakan tanpa tumpang tindih kritis.

### AC-12 — Fallback

**Given** WebGL tidak tersedia atau gagal dimulai  
**When** halaman melakukan pemeriksaan kemampuan  
**Then** daftar sebelas lokasi dan informasi tetap dapat diakses dalam tampilan HTML.

---

## 21. Strategi Konten

### 21.1 Gaya Bahasa

- Ramah, informatif, dan sesuai calon mahasiswa.
- Menggunakan Bahasa Indonesia yang jelas.
- Menghindari bahasa administratif yang sulit dipahami.
- Tidak membuat klaim keunggulan tanpa sumber atau persetujuan.
- Nama resmi gedung, unit, dan fasilitas harus konsisten.

### 21.2 Proses Persetujuan Konten

1. Tim produk menyusun draf.
2. PTI memeriksa konten akademik dan fasilitas PTI.
3. FKIP memeriksa penyebutan Gedung B, C, E, “I Love FKIP”, dan Tata Usaha.
4. Unit UMS terkait memeriksa landmark dan fungsi fasilitas.
5. Humas atau unit branding memeriksa penggunaan identitas.
6. Konten yang disetujui diberi versi dan tanggal berlaku.

### 21.3 Kebutuhan Aset per Lokasi

- Foto referensi fasad dari beberapa sudut.
- Foto utama untuk pop-up.
- Nama resmi lokasi.
- Deskripsi fungsi.
- Fakta menarik yang telah diverifikasi.
- Persetujuan penggunaan foto dan logo.
- Denah atau koordinat relatif untuk penempatan model.

---

## 22. Produksi Aset 3D

### 22.1 Tahapan

1. Survei dan dokumentasi lokasi.
2. Pengumpulan foto referensi berizin.
3. Identifikasi primitive geometry dan ciri visual utama setiap bangunan.
4. Penyusunan blockout procedural seluruh dunia melalui Three.js.
5. Validasi posisi relatif, proporsi, dan keterbacaan siluet.
6. Pembuatan komponen modular untuk gedung, fasad, atap, jalan, vegetasi, dan street furniture.
7. Implementasi geometri khusus untuk landmark ikonik.
8. Pembuatan material low-poly dan detail SVG/tekstur seperlunya.
9. Pembuatan collider sederhana serta sensor lokasi.
10. Optimasi draw call, instancing, material, bayangan, dan jumlah segmen geometri.
11. Pengujian visual serta performa di desktop dan mobile.

### 22.2 Prioritas Detail

Detail tertinggi diberikan kepada:

1. Gedung Induk Siti Walidah.
2. Edutorium KH Ahmad Dahlan.
3. Gedung B, C, dan E.
4. Masjid Hj. Sudalmiyah Rais.
5. Landmark lainnya sesuai jarak pandang dan kebutuhan pengenalan.

### 22.3 Hak Aset

- Semua geometri procedural harus ditulis secara orisinal untuk proyek.
- Foto referensi tidak otomatis boleh ditampilkan sebagai konten publik.
- Logo UMS, PTI, FKIP, dan elemen merek hanya digunakan setelah persetujuan.
- Aset dari Jalan KL tidak digunakan dalam produk.
- Model 3D UMSVerse tidak menjadi dependensi implementasi MVP.
- UMSVerse dapat dipelajari sebagai referensi internal hanya jika akses dan penggunaannya telah diizinkan.

### 22.4 Batasan Pipeline Tanpa Blender

- Tidak ada tahap modeling, UV unwrapping, rigging, baking, atau ekspor model melalui Blender.
- Tidak ada kewajiban memuat file GLB/GLTF untuk sebelas bangunan utama.
- Bentuk lengkung harus menggunakan jumlah segmen yang dibatasi agar tetap low-poly.
- Tekstur unik dibatasi; warna material dan geometri digunakan sebagai pembentuk visual utama.
- Perubahan bentuk bangunan dilakukan melalui parameter TypeScript atau komponen geometri.
- Review visual dilakukan pada build web karena scene merupakan sumber utama model.
- Jika sebuah bentuk tidak dapat direpresentasikan secara wajar dengan primitive dan geometri kode, penyederhanaan desain harus disetujui product owner tanpa otomatis menambah Blender ke dalam scope.

---

## 23. QA dan Strategi Pengujian

### 23.1 Pengujian Fungsional

- Semua lokasi dapat didekati.
- Semua penanda muncul pada posisi yang benar.
- Semua pop-up dapat dibuka dan ditutup.
- Progres tidak ganda.
- Status peta sesuai progres.
- Tombol kembali ke titik awal bekerja.
- Layar penyelesaian muncul tepat setelah lokasi terakhir.
- CTA PTI menuju URL yang benar dan dibuka di tab baru.

### 23.2 Pengujian Visual

- Model dapat dikenali oleh stakeholder lokasi.
- Tidak ada objek melayang, tenggelam, atau saling menembus secara mencolok.
- Kamera tidak terhalang bangunan pada jalur utama.
- Teks dapat dibaca pada seluruh breakpoint target.
- Pop-up tidak terpotong pada layar kecil.
- Warna dan logo sesuai pedoman identitas.

### 23.3 Pengujian Performa

- Uji mode ringan dan detail.
- Uji waktu muat pada koneksi yang dibatasi menyerupai 4G.
- Uji penggunaan memori setelah eksplorasi seluruh lokasi.
- Uji kestabilan frame rate pada perangkat target.
- Uji perpindahan tab dan pemulihan render.
- Uji pemuatan gambar pop-up secara bertahap.

### 23.4 Pengujian Aksesibilitas

- Navigasi keyboard untuk seluruh elemen HTML.
- Focus trap dan pemulihan fokus pada pop-up.
- Pembacaan label tombol dengan screen reader.
- Kontras warna.
- Reduced motion.
- Alternatif HTML ketika WebGL tidak dapat digunakan.

### 23.5 User Acceptance Test

Kelompok penguji minimum:

- Calon mahasiswa atau siswa SMA/SMK/MA.
- Mahasiswa aktif PTI.
- Dosen atau pengelola PTI.
- Staf promosi atau penerimaan mahasiswa.
- Perwakilan FKIP dan pengelola fasilitas terkait.

Skenario keberhasilan UAT:

- Pengguna dapat mulai tanpa bantuan fasilitator.
- Pengguna dapat membuka informasi lokasi pertama dalam waktu dua menit.
- Pengguna memahami hubungan antara PTI, FKIP, dan UMS.
- Pengguna menemukan CTA website PTI.
- Tidak ada kekeliruan faktual atau visual yang dianggap material oleh stakeholder.

---

## 24. Tahapan Pengembangan

### Fase 0 — Validasi dan Pra-produksi

- Validasi sebelas lokasi.
- Validasi fungsi Gedung B, C, dan E.
- Konfirmasi nama resmi lokasi.
- Tinjau UMSVerse sebagai referensi internal apabila aksesnya telah diizinkan, tanpa menjadikannya sumber model MVP.
- Survei dan foto lokasi.
- Persetujuan arah visual dan penggunaan merek.
- Penetapan perangkat target.

### Fase 1 — Prototype

- Blockout lingkungan.
- Satu karakter dan kontrol dasar.
- Kamera follow dan overview.
- Dua lokasi percontohan: satu lokasi PTI dan satu landmark UMS.
- Satu template pop-up.
- Pengujian performa awal desktop dan mobile.

### Fase 2 — MVP Internal

- Sebelas lokasi dalam bentuk model teroptimasi.
- Seluruh pop-up informasi.
- Peta dan progres.
- Pengaturan grafis dan suara.
- Penyimpanan lokal.
- Fallback HTML.
- Analitik di lingkungan pengujian.

### Fase 3 — Pilot Promosi

- UAT bersama PTI dan calon pengguna.
- Penyempurnaan konten dan visual.
- Uji penggunaan pada perangkat pameran.
- Perbaikan bug prioritas tinggi.
- Validasi aksesibilitas dan performa.

### Fase 4 — Rilis Publik

- Deployment produksi.
- Aktivasi analitik yang disetujui.
- Pemeriksaan URL dan metadata berbagi.
- Dokumentasi operasional.
- Monitoring performa dan error.

---

## 25. Estimasi Tingkat Tinggi

Estimasi awal untuk tim kecil setelah aset dan keputusan stakeholder tersedia:

| Tahap | Perkiraan |
|---|---:|
| Validasi, survei, dan konsep | 2–3 minggu |
| Prototype teknis dan visual | 2–3 minggu |
| Produksi geometri procedural dan konten | 5–8 minggu |
| Implementasi MVP | 5–8 minggu, dapat berjalan paralel dengan produksi aset |
| QA, UAT, dan optimasi | 2–4 minggu |
| Total kalender | Sekitar 12–18 minggu |

Estimasi berubah berdasarkan kompleksitas geometri procedural, tingkat penyederhanaan bangunan, jumlah revisi stakeholder, dan target perangkat minimum.

### 25.1 Peran Tim Minimum

- Product owner dari PTI.
- Project manager atau product designer.
- UI/UX designer.
- Frontend/WebGL developer.
- Creative developer atau technical artist yang mampu menyusun geometri procedural melalui Three.js.
- Content writer atau editor.
- QA tester.
- Perwakilan Humas/branding dan unit fasilitas sebagai reviewer.

---

## 26. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Scene procedural terlalu berat | Waktu muat lama dan frame rate rendah | Tetapkan budget draw call, material, segmen geometri, bayangan, instancing, dan mode ringan sejak awal |
| Tampilan baik di desktop tetapi buruk di mobile | Pengguna utama gagal menikmati produk | Prototype mobile lebih awal dan uji perangkat nyata |
| Informasi gedung tidak akurat | Menurunkan kredibilitas | Terapkan persetujuan konten oleh PTI, FKIP, dan unit terkait |
| Nama atau fungsi gedung berubah | Konten cepat usang | Pisahkan konten dari kode dan simpan versi/tanggal validasi |
| Geometri primitive tidak cukup menyerupai gedung | Landmark sulit dikenali | Prioritaskan siluet, proporsi, warna, dan fasad khas; validasi blockout pada kamera utama sebelum detail produksi |
| Kode geometri menjadi panjang dan sulit dirawat | Perubahan visual lambat dan rawan regresi | Gunakan komponen modular, parameter terpusat, katalog material, dan pemisahan satu landmark per modul |
| Developer menjadi bottleneck produksi 3D | Jadwal implementasi melambat | Pisahkan pemilik sistem dunia dan pemilik komponen landmark; lakukan produksi beberapa gedung secara paralel bila tim memungkinkan |
| Scope berkembang menjadi tur kampus penuh | Waktu dan biaya meningkat | Kunci MVP pada sebelas lokasi dan pop-up informasi |
| Hak penggunaan foto/model tidak jelas | Risiko hukum dan penundaan publikasi | Gunakan aset orisinal atau izin tertulis |
| Pengguna tersesat | Penyelesaian rendah | Gunakan peta, label jarak, penanda jelas, dan tombol kembali |
| Pengunjung tidak menuju website PTI | Tujuan promosi tidak tercapai | CTA jelas pada penyelesaian dan tersedia secara tidak mengganggu di menu informasi |
| Dunia 3D tidak dapat digunakan pada perangkat tertentu | Sebagian pengguna kehilangan akses | Sediakan fallback daftar lokasi berbasis HTML |
| Area ibadah digambarkan kurang pantas | Risiko reputasi | Review representasi, suara, animasi, dan penempatan karakter bersama stakeholder |

---

## 27. Dependensi

- Persetujuan resmi proyek dari PTI dan pihak UMS terkait.
- Akses survei atau dokumentasi visual lokasi.
- Validasi fungsi dan nama Gedung B, C, dan E.
- Pedoman merek UMS, FKIP, dan PTI.
- Hak penggunaan foto, logo, SVG, dan tekstur.
- Keputusan hosting dan domain.
- Platform analitik yang disetujui.
- Kontak reviewer untuk setiap kelompok lokasi.
- Dokumentasi visual bangunan yang cukup untuk menyusun geometri procedural.

---

## 28. Keputusan Produk yang Telah Dikunci

1. Produk mempromosikan Prodi Pendidikan Teknik Informatika.
2. Tujuh gedung atau fasilitas ikonik UMS tetap dipertahankan.
3. Total lokasi MVP adalah sebelas.
4. Interaksi utama hanya mendekati lokasi dan membuka pop-up informasi.
5. Tidak ada mini-game atau misi kompleks dalam MVP.
6. Progres dihitung berdasarkan pop-up lokasi yang telah dibuka.
7. CTA akhir menuju [https://pti.ums.ac.id/](https://pti.ums.ac.id/).
8. CTA dibuka di tab baru.
9. Aset dan identitas dibuat atau dilisensikan secara orisinal, bukan disalin dari Jalan KL.
10. Seluruh lingkungan dan bangunan low-poly MVP dibuat secara procedural melalui Three.js/React Three Fiber.
11. Blender tidak digunakan dalam pipeline MVP.
12. Model GLB/GLTF eksternal tidak menjadi kebutuhan bagi sebelas bangunan utama.

---

## 29. Keputusan yang Memerlukan Validasi Stakeholder

Sebelum pengembangan penuh dimulai, stakeholder perlu mengesahkan:

1. Nama final produk.
2. Domain atau subdomain publik.
3. Nama dan fungsi terkini Gedung B, Gedung C, dan Gedung E.
4. Mekanisme voucher buku dan redaksi Bookstore UMS.
5. Daftar fasilitas laboratorium komputer yang boleh dipublikasikan.
6. Foto yang dapat digunakan pada setiap pop-up.
7. Urutan dan posisi relatif gedung pada dunia 3D.
8. Apakah peta menggunakan geografi relatif atau representasi kreatif.
9. Pedoman warna, logo, dan tipografi resmi.
10. Perangkat minimum yang menjadi target.
11. Platform hosting dan analitik.
12. Tingkat penyederhanaan visual yang dapat diterima untuk setiap landmark procedural.

---

## 30. Definition of Done MVP

MVP dinyatakan selesai apabila:

- Sebelas lokasi telah tersedia dan dapat dikunjungi.
- Sebelas bangunan/lokasi utama dibangun melalui geometri procedural tanpa Blender.
- Komponen gedung modular dan landmark khusus memiliki struktur kode yang dapat dirawat.
- Setiap lokasi mempunyai pop-up dengan konten yang telah disetujui.
- Kontrol desktop dan mobile berfungsi.
- Collision utama mencegah karakter melewati bangunan.
- Peta dan progres menunjukkan status yang benar.
- Progres dapat dipulihkan setelah reload.
- Layar penyelesaian muncul pada progres penuh.
- CTA membuka website PTI UMS di tab baru.
- Mode ringan bekerja pada perangkat target.
- Fallback HTML tersedia jika WebGL gagal.
- Tidak terdapat bug severity blocker atau critical.
- Audit aksesibilitas inti selesai.
- Audit hak penggunaan aset selesai.
- UAT ditandatangani oleh product owner PTI.
- Deployment produksi menggunakan HTTPS dan memiliki monitoring error dasar.

---

## 31. Referensi Awal

- Website PTI UMS: [https://pti.ums.ac.id/](https://pti.ums.ac.id/)
- Kampus dan lokasi UMS: [https://www.ums.ac.id/lokasi](https://www.ums.ac.id/lokasi)
- Informasi UMSVerse: [https://www.ums.ac.id/berita/karya-mahasiswa/jelajah-virtual-lewat-umsverse](https://www.ums.ac.id/berita/karya-mahasiswa/jelajah-virtual-lewat-umsverse)
- Referensi pengalaman interaktif: [https://jalankl.themasterofnone.xyz/](https://jalankl.themasterofnone.xyz/)

Referensi tersebut digunakan untuk orientasi awal. Seluruh fakta, nama fasilitas, foto, kapasitas, fungsi ruang, dan narasi yang tampil pada produk harus melalui validasi resmi sebelum publikasi.
