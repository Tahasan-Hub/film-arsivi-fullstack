package com.filmarsivi.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController // Bu sınıfın bir API giriş kapısı olduğunu sisteme bildirir.
@RequestMapping("/api/yorumlar") // Dışarıdan gelen kuryelerin geleceği tam adres
@CrossOrigin(origins = "http://localhost:5173") //React'in bu kapıdan geçmesine izin veren güvenlik pasaportu.
public class YorumController {

    @Value("${proje.gizli.anahtar}")
    private String gercekSifre;

    // Kütüphanecilerimizi bu odaya yetkilendiriyoruz (Bağımlılıklar)
    //final: Değiştirilemezlik Mührü! (Ömürlük Sözleşme)
    //Bu kütüphaneciler odaya ilk girdiğinde ellerine bu mühür vurulur.
    //Proje çalıştığı sürece bu işçiler asla hafızadan silinemez, yerine başka hiçbir nesne transfer edilemez
    //Kodun güvenliği ve çökmemesi için en sağlam güvenlik kilididir.
    private final YorumRepository yorumRepository;
    private final FilmRepository filmRepository;

    // Doğum Odası (Constructor): Controller ilk çalıştığında kütüphanecileri elinden tutup içeri alıyor (Dependency Injection)
    public YorumController(YorumRepository yorumRepository, FilmRepository filmRepository, BackendApplication backendApplication) {
        this.yorumRepository = yorumRepository;
        this.filmRepository = filmRepository;
    }


    @PostMapping("/filme-ekle/{filmId}")
    public Yorum yorumEkle(
        @PathVariable Long filmId, //PathVariable: Adresteki o {filmId} numarasını al, Java'daki bu filmId kutusuna koy.
        @RequestBody Yorum yeniYorum //RequestBody: React'ten gelen mesaj paketini (kullanıcı adı ve yorum) aç, Java'daki 'yeniYorum' kalıbına dök.
    ) {

        //filmRepository'ye Git depodan şu ID'ye sahip filmi getir diyoruz.
        //orElseThrow: Eğer birileri o filmi çoktan silmişse veya bulamazsan, sistemi çökertme, sadece 'Film bulunamadı' diye isyan et (Hata fırlat).
        Film aitOlduguFilm = filmRepository.findById(filmId)
            .orElseThrow(() -> new RuntimeException("Hata: Böyle bir film veritabanında bulunamadı"));
        
        //Havada asılı duran o 'yeniYorum'a, az önce depodan bulduğumuz filmi sahibesi olarak atıyoruz. Çelik Halat burada bağlanıyor.    
        yeniYorum.setFilm(aitOlduguFilm);
        
        //yorumRepository'ye son emri veriyoruz: Kancası takılmış, her şeyi hazır olan bu yorumu al ve PostgreSQL'e kaydet.
        //return: Kayıt işlemi bittikten sonra, o taptaze yorumu React'e (Ön Yüze) geri gönderki ekranda anında görünsün.
        return yorumRepository.save(yeniYorum);
    }

    @PutMapping("/{id}/begen")
    public Yorum yorumBegen(@PathVariable Long id) {
        //Yorumu bul, beğeni sayısını 1 artır ve tekrar kaydet 
        Yorum yorum = yorumRepository.findById(id).orElseThrow(() -> new RuntimeException("Yorum bulunamadı!"));
        yorum.setBegeniSayisi(yorum.getBegeniSayisi() + 1);
        return yorumRepository.save(yorum);
    }

    @PutMapping("/{id}/begeni-kaldir")
    public Yorum yorumBegeniKaldir(@PathVariable Long id) {
        Yorum yorum = yorumRepository.findById(id).orElseThrow(() -> new RuntimeException("Yorum bulunamadı!"));

        //Eğer beğeni sayısı sıfırdan büyükse 1 eksilt (Eksi sayılara düşmesini engelle)
        if(yorum.getBegeniSayisi() > 0) {
            yorum.setBegeniSayisi(yorum.getBegeniSayisi() - 1);
        }
        
        return yorumRepository.save(yorum);
    }

    @DeleteMapping("/{id}")
    public void yorumSil(@PathVariable Long id, @RequestHeader(value = "Gizli-Anahtar", required = false) String gizliAnahtar){
        //Gelen kuryenin pasaportu yoksa veya şifre yanlışsa kapıdan kov!
        if(gizliAnahtar == null || !gizliAnahtar.equals(gercekSifre)) {
            throw new RuntimeException("Erişim reddedildi! Yorumu silmek için yetkiniz yok.");
        }
        
        //Şifre doğruysa yorumu veritabanından kalıcı olarak sil
        yorumRepository.deleteById(id);
    }
}
