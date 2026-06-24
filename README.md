# 🎬 Film Arşivi (Full-Stack Web Uygulaması)

Bu proje, kullanıcıların filmleri listeleyebildiği, filmlere yorum yapabildiği ve yöneticilerin arşivi kontrol edebildiği kapsamlı bir Full-Stack web uygulamasıdır. Frontend tarafında modern **React (Vite)** mimarisi, backend tarafında ise güçlü **Spring Boot** ve **PostgreSQL** kullanılarak geliştirilmiştir.

## ✨ Öne Çıkan Özellikler

* **🔒 Şifreli Yönetici Paneli:** Sadece yetkili kişilerin (Gizli Anahtar ile) film ekleme, düzenleme ve silme işlemlerini yapabildiği güvenli arayüz.
* **💬 İnstagram Tarzı Yorum Çekmecesi:** Filmlere yapılan yorumların, sayfa düzenini bozmadan sağ taraftan süzülerek açılan şık bir panelde (Offcanvas/Drawer) gösterilmesi.
* **❤️ Dinamik Beğeni Sistemi:** Kullanıcıların yorumlara anlık olarak kalp atabilmesi ve beğenilerini geri alabilmesi (React State & Toggle mantığı).
* **⏱️ Akıllı Zaman Motoru:** Yorum tarihlerinin "Az Önce", "5 dakika önce", "2 gün önce" gibi insan okumasına uygun formatta dinamik olarak hesaplanması.
* **🔍 Canlı Arama:** Arşivdeki filmler arasında anında filtreleme yapabilen arama motoru.

## 🛠️ Kullanılan Teknolojiler

**Frontend (Ön Yüz):**
* React.js (Vite ile oluşturuldu)
* Saf CSS (Özel animasyonlar ve Flexbox mimarisi)

**Backend (Arka Yüz):**
* Java 21 & Spring Boot
* Spring Data JPA (Hibernate)
* PostgreSQL (İlişkisel Veritabanı)

## 🚀 Projeyi Bilgisayarınızda Çalıştırma

Projeyi kendi bilgisayarınızda test etmek için aşağıdaki adımları izleyebilirsiniz.

### 1. Veritabanı Kurulumu (PostgreSQL)
`film_arsivi` adında boş bir PostgreSQL veritabanı oluşturun ve `backend/src/main/resources/application.properties` dosyasındaki kullanıcı adı/şifre alanlarını kendi bilgilerinize göre güncelleyin.

### 2. Backend'i Başlatma
```bash
cd backend
./mvnw spring-boot:run