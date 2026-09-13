# 🎬 Film Arşivi (Full-Stack Web Uygulaması)

Bu proje, kullanıcıların filmleri listeleyebildiği, filmlere yorum yapabildiği ve yöneticilerin arşivi kontrol edebildiği kapsamlı bir Full-Stack web uygulamasıdır. Frontend tarafında modern **React (Vite)** mimarisi, backend tarafında ise güçlü **Spring Boot** ve **PostgreSQL** kullanılarak geliştirilmiştir.

## ✨ Öne Çıkan Özellikler

* **🔒 Şifreli Yönetici Paneli:** Sadece yetkili kişilerin (Gizli Anahtar ile) film ekleme, düzenleme ve silme işlemlerini yapabildiği güvenli arayüz.
* **💬 Instagram Tarzı Yorum Çekmecesi:** Filmlere yapılan yorumların, sayfa düzenini bozmadan sağ taraftan süzülerek açılan şık bir panelde (Offcanvas/Drawer) gösterilmesi.
* **❤️ Dinamik Beğeni Sistemi:** Kullanıcıların yorumlara anlık olarak kalp atabilmesi ve beğenilerini geri alabilmesi (React State & Toggle mantığı).
* **⏱️ Akıllı Zaman Motoru:** Yorum tarihlerinin "Az Önce", "5 dakika önce", "2 gün önce" gibi insan okumasına uygun formatta dinamik olarak hesaplanması.
* **🔍 Canlı Arama:** Arşivdeki filmler arasında anında filtreleme yapabilen arama motoru.

## 🛠️ Kullanılan Teknolojiler

**Frontend (Ön Yüz):**
* React 18+ (Vite ile oluşturuldu)
* Saf CSS (Özel animasyonlar ve Flexbox mimarisi)

**Backend (Arka Yüz):**
* Java 21 & Spring Boot 3
* Spring Data JPA (Hibernate)
* PostgreSQL (İlişkisel Veritabanı)
* Maven

---

## 🚀 Projeyi Bilgisayarınızda Çalıştırma

Projeyi kendi bilgisayarınızda test etmek için aşağıdaki adımları izleyebilirsiniz:

### 1. Veritabanı Kurulumu (PostgreSQL)
PostgreSQL üzerinde `film_arsivi` adında boş bir veritabanı oluşturun:
```sql
CREATE DATABASE film_arsivi;
```
`backend/src/main/resources/application.properties` dosyasındaki kullanıcı adı/şifre alanlarını kendi bilgilerinize göre güncelleyin:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/film_arsivi
spring.datasource.username=postgres
spring.datasource.password=KENDI_SIFRENIZ
proje.gizli.anahtar=1234
```

### 2. Backend'i Başlatma (Spring Boot)
Terminalde backend dizinine geçin ve sunucuyu başlatın:
```bash
cd backend
./mvnw spring-boot:run
```
> Backend sunucusu varsayılan olarak **`http://localhost:8080`** adresinde ayağa kalkacaktır.

### 3. Frontend'i Başlatma (React + Vite)
Yeni bir terminal sekmesi açıp ana proje dizininde çalıştırın:
```bash
npm install
npm run dev
```
> Kullanıcı arayüzü **`http://localhost:5173`** adresinde açılacaktır.

---

## 🔑 Yönetici Girişi
* Film ekleme, düzenleme ve silme işlemleri için varsayılan yönetici şifresi: **`1234`**
* Bu şifre `backend/src/main/resources/application.properties` dosyasındaki `proje.gizli.anahtar` parametresinden değiştirilebilir.

## 📡 REST API Uç Noktaları

| Metot | Yol | Açıklama | Güvenlik |
|---|---|---|---|
| `GET` | `/filmler` | Tüm filmleri ve yorumlarını listele | Herkese açık |
| `POST` | `/filmler` | Yeni film ekle | `Gizli-Anahtar` Header zorunlu |
| `PUT` | `/filmler/{id}` | Film bilgilerini güncelle | `Gizli-Anahtar` Header zorunlu |
| `DELETE` | `/filmler/{id}` | Filmi sil | `Gizli-Anahtar` Header zorunlu |
| `POST` | `/yorumlar` | Filme yeni yorum ekle | Herkese açık |
| `PUT` | `/yorumlar/{id}/begen` | Yorumu beğen / beğeniyi geri al | Herkese açık |