package com.filmarsivi.backend;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="filmler")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ad;
    private int yil;

    @Column(columnDefinition = "TEXT")
    private String afis;
    
    private boolean begenildiMi;

    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL) // Bir filmin, alt alta dizilmiş ÇOK (Many) yorumu olur.
    private List<Yorum> yorumlar; // Bu filmin altına yapılan tüm yorumları bu kutuda (listede) topla.


    public Film() {

    }

    public Film(String ad, int yil, String afis, boolean begenildiMi) {
        this.ad = ad;
        this.yil = yil;
        this.afis = afis;
        this.begenildiMi = begenildiMi;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAd() { return ad; }
    public void setAd(String ad) { this.ad = ad; }

    public int getYil() { return yil; }
    public void setYil(int yil) { this.yil = yil; }

    public String getAfis() { return afis; }
    public void setAfis(String afis) { this.afis = afis; }

    public boolean isBegenildiMi() { return begenildiMi; }
    public void setBegenildiMi(boolean begenildiMi) { this.begenildiMi = begenildiMi; }

    public List<Yorum> getYorumlar() { return yorumlar; }
    public void setYorumlar(List<Yorum> yorumlar) { this.yorumlar = yorumlar; }
}
