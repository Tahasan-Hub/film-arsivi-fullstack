package com.filmarsivi.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/filmler")
@CrossOrigin(origins = "http://localhost:5173")
public class FilmController {
    
    private final FilmRepository filmRepository;

    public  FilmController(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    @GetMapping
    public List<Film> tumFilmleriGetir() {
        return filmRepository.findAll();
    }
    
    @PostMapping
    public List<Film> filmiEkle(@RequestBody Film yeniFilm, @RequestHeader(value = "Gizli-Anahtar", required = false) String gizliAnahtar) {
        
        if(gizliAnahtar == null || !gizliAnahtar.equals("1234")) {
            throw new RuntimeException("Erişim reddedildi! Geçersiz güvenlik anahtarı.");
        }
        filmRepository.save(yeniFilm);
        return filmRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public List<Film> filmiSil(@PathVariable Long id, @RequestHeader(value = "Gizli-Anahtar", required = false) String gizliAnahtar) {
        
        if(gizliAnahtar == null || !gizliAnahtar.equals("1234")) {
            //Eğer anahtar yoksa veya şifre yanlışsa, işlemi iptal et ve suratına hatayı çarp!
            throw new RuntimeException("Erişim reddedildi! Geçersiz veya eksik güvenlik anahtarı.");
        }
        filmRepository.deleteById(id);
        return filmRepository.findAll();
    }

    @PutMapping("/{id}")
    public List<Film> filmiGuncelle(@PathVariable Long id, @RequestBody Film guncelBilgiler, @RequestHeader(value = "Gizli-Anahtar", required = false) String gizliAnahtar) {
        if(gizliAnahtar == null || !gizliAnahtar.equals("1234")) {
            throw new RuntimeException("Erişim reddedildi! Geçersiz güvenlik anahtarı.");
        }

        Film guncellenecekFilm = filmRepository.findById(id).orElseThrow(() -> new RuntimeException("Film bulunamadı!"));
        guncellenecekFilm.setAd(guncelBilgiler.getAd());
        guncellenecekFilm.setYil(guncelBilgiler.getYil());
        guncellenecekFilm.setAfis(guncelBilgiler.getAfis());
        
        filmRepository.save(guncellenecekFilm);
        return filmRepository.findAll();
    }
}
