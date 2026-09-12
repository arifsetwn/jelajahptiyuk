# CI/CD GitHub Actions ke Hostinger

Panduan ini menyiapkan deployment otomatis proyek **Jelajah PTI UMS** dari branch `main` GitHub ke:

<https://ptiums.id/jelajah/>

Workflow proyek berada di [`.github/workflows/deploy-hostinger.yml`](./.github/workflows/deploy-hostinger.yml). Setiap push ke `main` akan menjalankan `npm ci`, pengujian, production build, lalu mengunggah isi folder `dist` ke Hostinger melalui FTPS.

## 1. Pastikan proyek tersedia di GitHub

Repositori tujuan:

<https://github.com/arifsetwn/jelajahptiyuk>

Pastikan branch produksi bernama `main` dan berkas berikut sudah masuk ke repositori:

```text
.github/workflows/deploy-hostinger.yml
public/.htaccess
vite.config.ts
package-lock.json
```

Konfigurasi Vite proyek sudah menggunakan base URL `/jelajah/`. Berkas `.htaccess` juga akan ikut disalin ke `dist` ketika build berlangsung.

## 2. Siapkan direktori deployment di Hostinger

1. Masuk ke **hPanel Hostinger**.
2. Buka **Websites**, pilih `ptiums.id`, lalu buka **Dashboard**.
3. Buka **File Manager**.
4. Pastikan direktori berikut tersedia:

   ```text
   public_html/jelajah
   ```

5. Jika website pernah diunggah secara manual, buat cadangan isi folder tersebut sebelum deployment otomatis pertama.

Jika instalasi domain menggunakan struktur multiwebsite Hostinger, lokasi fisiknya dapat terlihat seperti:

```text
/home/u123456789/domains/ptiums.id/public_html/jelajah
```

Gunakan direktori yang ditampilkan hPanel untuk website `ptiums.id`.

## 3. Buat akun FTP khusus deployment

Gunakan akun FTP tambahan dengan akses terbatas agar GitHub Actions hanya dapat mengubah aplikasi Jelajah PTI.

1. Dari Dashboard website, buka **FTP Accounts**.
2. Pilih **Create a New FTP Account**.
3. Isi username dan password yang kuat.
4. Atur direktori akun ke folder `public_html/jelajah` milik `ptiums.id`.
5. Simpan informasi berikut:

   - FTP hostname atau IP
   - FTP username lengkap
   - FTP password
   - Port `21`

Karena root akun FTP sudah diarahkan ke folder `jelajah`, workflow memakai:

```yaml
server-dir: ./
```

Jangan menggunakan kredensial akun utama hosting jika akun FTP terbatas dapat dibuat.

## 4. Tambahkan GitHub Actions Secrets

Buka repositori GitHub, lalu masuk ke:

**Settings → Secrets and variables → Actions → Secrets → New repository secret**

Buat tiga secret berikut:

| Nama secret | Nilai |
| --- | --- |
| `HOSTINGER_FTP_SERVER` | Hostname atau IP FTP dari hPanel |
| `HOSTINGER_FTP_USERNAME` | Username FTP lengkap |
| `HOSTINGER_FTP_PASSWORD` | Password akun FTP |

Jangan menaruh password langsung di YAML, README, issue, commit, atau screenshot.

## 5. Aktifkan environment production

Workflow menggunakan environment bernama `production`.

1. Buka **Settings → Environments** di repositori GitHub.
2. Pilih **New environment**.
3. Masukkan nama `production`.
4. Simpan environment.
5. Jika ingin deployment memerlukan persetujuan, aktifkan **Required reviewers** pada environment tersebut.

Langkah ini opsional untuk repositori yang paket GitHub-nya tidak menyediakan aturan environment. Jika environment belum dibuat, GitHub akan membuat referensinya ketika workflow pertama dijalankan.

## 6. Jalankan deployment pertama

Commit dan push workflow:

```bash
git add .github/workflows/deploy-hostinger.yml CICD_HOSTINGER.md
git commit -m "Tambahkan CI/CD deployment Hostinger"
git push origin main
```

Kemudian:

1. Buka tab **Actions** pada repositori.
2. Pilih **Test, Build, and Deploy to Hostinger**.
3. Buka proses yang sedang berjalan.
4. Pastikan tahap install, test, build, dan deploy berwarna hijau.
5. Buka <https://ptiums.id/jelajah/> dan lakukan hard refresh.

Workflow juga dapat dijalankan manual melalui tombol **Run workflow** karena memiliki trigger `workflow_dispatch`.

## 7. Alur deployment berikutnya

Setelah konfigurasi selesai, alurnya menjadi:

```text
Perubahan kode
      ↓
Pull request dan review
      ↓
Merge ke main
      ↓
npm ci → npm test → npm run build
      ↓
Isi dist disinkronkan ke Hostinger
      ↓
https://ptiums.id/jelajah/
```

Deployment tidak dilanjutkan apabila instalasi dependensi, pengujian, atau build gagal. Kredensial FTP juga tidak diberikan kepada workflow pull request dari fork.

## 8. Pemeriksaan setelah deployment

Periksa hal berikut:

- Halaman dapat dibuka melalui HTTPS.
- CSS dan JavaScript dimuat dari `/jelajah/assets/`.
- Foto dimuat dari `/jelajah/photos/`.
- Favicon tampil.
- Backsound dapat dimainkan melalui tombol suara.
- Popup lokasi dapat di-scroll pada mobile.
- URL langsung dan refresh tidak menghasilkan error 404.

## Pemecahan masalah

### `530 Login incorrect`

Periksa kembali hostname, username lengkap, dan password FTP. Pastikan password FTP yang digunakan, bukan password akun Hostinger.

### Gagal terhubung melalui FTPS

Pastikan hostname sesuai dengan akun hosting dan port menggunakan `21`. Periksa detail FTP di hPanel. Hindari mengganti ke FTP tanpa enkripsi kecuali dukungan Hostinger meminta langkah diagnostik tersebut.

### File masuk ke folder yang salah

Pastikan akun FTP tambahan diarahkan langsung ke `public_html/jelajah`. Jika akun FTP membuka `public_html` sebagai root, ubah workflow menjadi:

```yaml
server-dir: ./jelajah/
```

### Website menampilkan halaman kosong

Periksa DevTools browser dan pastikan berkas menggunakan URL `/jelajah/assets/...`. Konfigurasi proyek yang benar adalah:

```ts
base: "/jelajah/"
```

### Perubahan lama masih terlihat

Lakukan hard refresh, bersihkan cache browser, dan hapus cache CDN Hostinger jika fitur cache diaktifkan.

## Referensi

- [Hostinger: menemukan detail paket dan FTP](https://support.hostinger.com/en/articles/1583276-how-to-find-the-details-of-your-hosting-plan)
- [Hostinger: membuat akun FTP tambahan](https://support.hostinger.com/en/articles/1583246-how-to-create-additional-ftp-accounts)
- [GitHub: menggunakan Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [GitHub: build dan test proyek Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
