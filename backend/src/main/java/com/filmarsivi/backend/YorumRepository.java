package com.filmarsivi.backend;

// JPA sekreterinin (veritabanı yöneticisinin) alet çantasını getir
import org.springframework.data.jpa.repository.JpaRepository;

//interface: Bu normal bir sınıf değil, sadece kuralları belirten bir "Sözleşme" dosyasıdır.
//extends: "Miras al" demektir. JpaRepository'nin içindeki tüm yetenekleri (kaydetme, silme, bulma) hazıra konarak bu dosyaya aktarır.
//<Yorum, Long>: JPA'ya şunu der: Sen Yorum tablosunun sekreterisin ve o tablonun kimlik (ID) numaraları Long formatındadır.
public interface YorumRepository extends JpaRepository<Yorum, Long> {
    
}
