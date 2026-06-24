package com.filmarsivi.backend;

import jakarta.persistence.*; // Bütün veritabanı mühürlerini getir(@Entity, @Table, @Id fln)
import com.fasterxml.jackson.annotation.JsonIgnore; // Sonsuz döngü kırıcının alet çantası
import java.time.LocalDateTime;

@Entity // JPA sekreterine kesin emir verir: "Bu sınıf geçici bir kalıp değil, veritabanında kalıcı bir TABLODUR!"
@Table(name = "yorumlar")
public class Yorum {

    @Id // Bu değişken kimlik numarasıdır.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Numaraları sen ver ben vermeyeceğim(1,2,3,...)
    private Long id;

    private String kullaniciAdi;

    @Column(columnDefinition = "TEXT") // 255 karakter sınırını kaldır, sınırsız yap.
    private String icerik;

    @ManyToOne // Çok (Many) yorum, Bir (One) filme aittir.
    @JoinColumn(name = "film_id") // Veritabanındaki tabloya "film_id" adında gizli bir sütun ekle
    @JsonIgnore // Kurye React'e giderken paketi burada kessin, sonsuz döngüye girmesin
    private Film film;

    private int begeniSayisi = 0; //Yeni eklenen yorumun beğenisi 0'dan başlar.
    private LocalDateTime tarih = LocalDateTime.now(); //Yorum atıldığı anki tarihi (sunucu saatiyle) otomatik kaydeder.

    // Boş Doğum Odası (JPA'nın arka planda çalışabilmesi için şarttır)
    public Yorum(){

    }

    // Dolu Doğum Odası (Yeni yorum yaratırken ID'yi biz vermiyoruz, o yüzden o yok)
    public Yorum(String kullaniciAdi, String icerik, Film film){
        this.kullaniciAdi = kullaniciAdi;
        this.icerik = icerik;
        this.film = film; // Dışarıdan gelen filmi al, kasadaki bu yoruma zimmetle
    }

    // Neden varlar? Kilitli kasadaki (private yani) verilere dışarıdan kimse kafasına göre elini sokamaz.
    // Okumak isteyen 'Get' veznedarından ister, değiştirmek isteyen 'Set' veznedarına yeni veriyi verir.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getKullaniciAdi() { return kullaniciAdi; }
    public void setKullaniciAdi(String kullaniciAdi) { this.kullaniciAdi = kullaniciAdi; }

    public String getIcerik() { return icerik; }
    public void setIcerik(String icerik) { this.icerik = icerik; }

    public Film getFilm() { return film; }
    public void setFilm(Film film) { this.film = film; }

    public int getBegeniSayisi() { return begeniSayisi; }
    public void setBegeniSayisi(int begeniSayisi) { this.begeniSayisi = begeniSayisi; }

    public LocalDateTime getTarih() { return tarih; }
    public void setTarih(LocalDateTime tarih) { this.tarih = tarih; }
}
