import { useState, useEffect } from "react";
import './App.css';

function FilmKarti({ filmBilgisi, telsiz, telsizGuncelle, adminMi}) {
  const [begeni, setBegeni] = useState(0);
  const [begenildiMi, setBegenildiMi] = useState(false);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [guncelAd, setGuncelAd] = useState(filmBilgisi.ad);
  const [guncelYil, setGuncelYil] = useState(filmBilgisi.yil);
  const [guncelAfis, setGuncelAfis] = useState(filmBilgisi.afis);

  //Yorum paneli açık mı kapalı mı? Başlangıçta kapalı (false).
  const [panelAcik, setPanelAcik] = useState(false);
  
  //Kullanıcının bu oturumda beğendiği yorumların ID'lerini tutan hafıza
  const [begenilenYorumlar, setBegenilenYorumlar] = useState([]);
  
  function begeniyiAyarla() {
    if (begenildiMi === false) {
      setBegeni(begeni + 1);
      setBegenildiMi(true);
    } else {
      setBegeni(begeni - 1);
      setBegenildiMi(false);
    }
  }

  function kaydet() {
    telsizGuncelle(filmBilgisi.id, { ad: guncelAd, yil: guncelYil, afis: guncelAfis});
    setDuzenlemeModu(false);
  }

  //Kullanıcının kutulara yazdığı adını ve yorumunu burada tutacağız.
  const [yeniKullanici, setYeniKullanici] = useState("");
  const [yeniYorumMetni, setYeniYorumMetni] = useState("");

  //Arka plandan gelen mevcut yorumları ekranda anında göstermek için bir sepet.
  //(Eğer backend'den yorum gelmediyse boş sepet [] açar)
  const [yorumListesi, setYorumListesi] = useState(filmBilgisi.yorumlar || []);

  const yorumGonder = () => {
    //Kutular boşsa işlem yapma, adamı uyar
    if (yeniKullanici === "" || yeniYorumMetni === "") {
      alert("Lütfen adınızı ve yorumunuzu girin!");
      return;
    }

    //Backend'in beklediği JSON paketini hazırlıyoruz
    const eklenecekYorum = {
      kullaniciAdi: yeniKullanici,
      icerik: yeniYorumMetni
    };

    //Kuryeyi yola çıkarıyoruz! Adresin sonuna filmBilgisi.id'yi dinamik olarak ekliyoruz
    fetch(`http://localhost:8080/api/yorumlar/filme-ekle/${filmBilgisi.id}`, {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eklenecekYorum)
    })
    .then((cevap) => cevap.json())
    .then((kaydedilenYorum) => {
      // Yeni yorumu sayfa yenilenmeden anında ekranda göstermek için listeye ekle
      setYorumListesi([...yorumListesi, kaydedilenYorum]);

      //Yorum gönderildikten sonra metin kutularının içini temizle
      setYeniKullanici("");
      setYeniYorumMetni("");
    });
  };

  const zamanFormatla = (dbTarihi) => {
    //Eğer eski yorumlarda tarih yoksa hata vermemesi için koruma
    if(!dbTarihi) return "Tarih bilinmiyor";

    const tarih = new Date(dbTarihi);
    const simdi = new Date();

    //Şuanki zaman ile yorumun atıldığı zaman arasındaki farkı saniye cinsinden buluyoruz
    const farkSaniye = Math.floor((simdi - tarih) / 1000);
    const farkDakika = Math.floor(farkSaniye / 60);
    const farkSaat = Math.floor(farkDakika / 60);

    //Tarihi tam olarak yazabilmek için ay isimleri
    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const tamTarih = `${tarih.getDate()} ${aylar[tarih.getMonth()]} ${tarih.getFullYear()}`;

    //Farklara göre ekrana ne yazılacağına karar veriyoruz
    if(farkDakika < 1) return `${tamTarih} - Az Önce`;
    if(farkDakika < 60) return `${tamTarih} - ${farkDakika} dakika önce`;
    if(farkSaat < 24) return `${tamTarih} - ${farkSaat} saat önce`;

    //Eğer  1 günü (24 saati) geçtiyse gün farkını hesapla
    const farkGun = Math.floor(farkSaat / 24);
    return `${tamTarih} - ${farkGun} gün önce`;
  };

  const yorumuBegenToggle = (yorumId) => {
    //Hafızamızda bu ID var mı diye soruyoruz (True veya False döner)
    const zatenBegendinMi = begenilenYorumlar.includes(yorumId);

    //Şartlı adres: Beğendiysek 'begeni-kaldir' adresine, beğenmediysek beğen adresine git
    const adres = zatenBegendinMi
    ? `http://localhost:8080/api/yorumlar/${yorumId}/begeni-kaldir`
    : `http://localhost:8080/api/yorumlar/${yorumId}/begen`;

    fetch(adres, { method: "PUT" })
      .then((cevap) => cevap.json())
      .then((guncelYorum) => {
        //Ekrandaki yorum listesini yeni beğeni sayısıyla güncelle
        const guncellenmisListe = yorumListesi.map((y) => y.id === yorumId ? guncelYorum : y);
        setYorumListesi(guncellenmisListe);

        //Kendi hafızamızı güncelle
        if(zatenBegendinMi) {
          //Geri aldık: Bu yorumun ID'sini hafızadan sil (filter ile ayıkla)
          setBegenilenYorumlar(begenilenYorumlar.filter(id => id !== yorumId));
        } else {
          //Yeni beğendik: Bu yorumun ID'sini hafızadaki listeye ekle
          setBegenilenYorumlar([...begenilenYorumlar, yorumId]);
        }
      })
      .catch((hata) => console.error("Beğeni işlemi başarısız:", hata));
  }

  const yorumuSil = (silinecekYorumId) => {
    fetch(`http://localhost:8080/api/yorumlar/${silinecekYorumId}`, {
      method: "DELETE",
      headers: {
        "Gizli-Anahtar": import.meta.env.VITE_GIZLI_SIFRE
      }
    })
    .then(() => {
      //"filter" komutu süzgeç görevi görür: Tüm yorumları tarar ve
      //sadece bizim sildiğimiz ID'ye EŞİT OLMAYANLARI alıp yeni bir liste yapar.
      const temizListe = yorumListesi.filter((yorum) => yorum.id !== silinecekYorumId);

      //İçinden silinen yorumu ayıkladığımız bu tertemiz listeyi ekrana çiziyoruz.
      setYorumListesi(temizListe);
    })
    .catch((hata) => console.error("Silme işlemi başarısız:", hata)); // Olası çökmelere karşı önlem
  }

  return (
    <div className="film-kutu">     
      <p>{filmBilgisi.ad} - {filmBilgisi.yil}</p>
      <img src={filmBilgisi.afis} className="film-afis" alt={filmBilgisi.ad} />
      <br/>
      
      {/* Beğen, Düzenle ve Sil butonların burada durmaya devam ediyor */}
      <div className="buton-grubu">
        <button onClick={begeniyiAyarla} className={begenildiMi ? "begeni-butonu begenildi" : "begeni-butonu"}>
          {begenildiMi ? "❤️ Beğendin " : "🤍 Beğen "} {begeni > 0 ? begeni : ""}
        </button>

        {/* Sadece Adminse (şifre girildiyse) bu butonları ekrana çiz */}
        {adminMi && (
          <>
            <button onClick={() => setDuzenlemeModu(true)} className="duzenle-butonu">
              Düzenle
            </button>

            <button onClick={() => { 
              if (window.confirm("Emin misin?")) {
                telsiz(filmBilgisi.id);
              } 
            }} className="sil-butonu">
              Sil
            </button>
          </>
        )}
      </div>
      
      {/* ŞART BAŞLIYOR: Düzenleme modu true ve (&&) popup kutusu */}
      {duzenlemeModu && (
        <>
          <div className="karanlik-perde" onClick={() => setDuzenlemeModu(false)}></div>
          <div className="popup-kutu">
            <h3>Filmi Düzenle</h3>

            <input type="text" value={guncelAd} onChange={(e) => setGuncelAd(e.target.value)}/>
            <input type="number" value={guncelYil} onChange={(e) => setGuncelYil(e.target.value)}/>
            <input type="text" value={guncelAfis} onChange={(e) => setGuncelAfis(e.target.value)}/>

            <div className="popup-butonlar">
              <button onClick={kaydet} className="ekle-butonu">Kaydet</button>
              <button onClick={() => setDuzenlemeModu(false)} className="iptal-butonu">İptal</button>
            </div>
          </div>
        </>
      )}

      <div className="yorum-alani">
        <h4>💬 Yorumlar</h4>

        <button onClick={() => setPanelAcik(true)} className="yorum-tetikleyici-buton">
          💬 Yorumları Gör
        </button>
        
        {/* Kapı kilidi. Eğer panelAcik true ise bu siyah perdeyi ekrana çiz */}
        {panelAcik === true && (
          <div className="yorum-perdesi">
            {/* Siyah perdenin içindeki beyaz çekmecemiz */}
            <div className="yorum-cekmece">
              {/* Çekmecenin başlığı ve kapatma butonu */}
              <div className="yorum-cekmece-baslik">
                <h3>Yorumlar</h3>
                {/* Basınca hafızayı false yapar ve çekmeceyi yok eder */}
                <button onClick={() => setPanelAcik(false)}>x</button>
              </div>

              {/* Yorumların listeleneceği orta alan */}
              <div className="yorum-cekmece-liste-alani">
                        {/* Mevcut yorumları ekrana bastığımız yer */}
                <ul className="yorum-listesi">
                  {/* yorumListesi içindeki her bir yorum için döngü kur (map) ve ekrana liste maddesi (li) olarak bas */}
                  {yorumListesi.map((yorum, index) => (
                    <li key={yorum.id || index} className="yorum-maddesi">

                      {/* Kullanıcı Adı ve Sağda Tarih */}
                      <div className="yorum-ust-kisi">
                        <strong>👤 {yorum.kullaniciAdi}</strong>
                        <span className="yorum-tarih">
                          {zamanFormatla(yorum.tarih)} {/* Zaman motorunu burada çalıştırıyoruz */}  
                        </span> 
                      </div>

                      {/* Yorumun Kendisi */}
                      <p className="yorum-metni">{yorum.icerik}</p>

                      {/* Kalp ve Çöp Butonu */}
                      <div className="yorum-alt-etkilesim">
                        {/* Kalp Butonu (HERKESE AÇIK) */}
                        {/* Ziyaretçi veya admin fark etmeksizin herkes bu butonu görür ve tıklayabilir */}
                        <button 
                          onClick={() => yorumuBegenToggle(yorum.id)} 
                          className={`yorum-kalp-butonu ${begenilenYorumlar.includes(yorum.id) ? 'kalp-aktif' : ''}`}
                        >
                          {begenilenYorumlar.includes(yorum.id) ? "💔 Geri Al" : "❤️ Beğen"} ({yorum.begeniSayisi})
                        </button>

                        {/* Sil Butonu (SADECE ADMİNE ÖZEL) */}
                        {/* 'adminMi === true' şartı sayesinde, normal kullanıcılar bu butonu ASLA göremez. */}
                        {/* Sadece sen şifreyle giriş yaptığında React bu kısmı ekrana çizer */}
                        {adminMi === true && (
                          <button onClick={() => yorumuSil(yorum.id)} className="yorum-sil-butonu">
                            🗑️ Sil
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Yorum yazma kutusunun duracağı en alt alan */}
              <div className="yorum-cekmece-alt-kisim">
                   {/* Yeni yorum yazma kutuları */}
                <div className="yorum-yazma-kutusu">
                  <input
                    type="text"
                    placeholder="Adınız..."
                    value={yeniKullanici}
                    onChange={(e) => setYeniKullanici(e.target.value)} //Kumanda: Klavyeye basıldıkça 'yeniKullanici' hafızasını güncelle
                    className="yorum-input"
                  />
                  <textarea
                    placeholder="Yorumunuz..."
                    value={yeniYorumMetni}
                    onChange={(e) => setYeniYorumMetni(e.target.value)} //Kumanda: Klavyeye basıldıkça 'yeniYorumMetni' hafızasını güncelle
                    className="yorum-textarea"
                  />
                  <button onClick={yorumGonder} className="yorum-gonder-butonu">
                    Yorum Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function App() {
  const [popupAcik, setPopupAcik] = useState(false);
  const [yeniAd, setYeniAd] = useState("");
  const [yeniYil, setYeniYil] = useState("");
  const [yeniAfis, setYeniAfis] = useState("");
  const [aramaMetni, setAramaMetni] = useState("");
  const [adminMi, setAdminMi] = useState(false);
  const [filmler, setFilmler]= useState([]);
  const [sifreKutusuAcik, setSifreKutusuAcik] = useState(false);
  const [sifreDenemesi, setSifreDenemesi] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/filmler")
      .then((cevap) => cevap.json())
      .then((gercekFilmler) => setFilmler(gercekFilmler));
  }, []);

  
  const filmiGuncelle = (guncellenecekId, yeniBilgiler) => {
    fetch(`http://localhost:8080/api/filmler/${guncellenecekId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Gizli-Anahtar": import.meta.env.VITE_GIZLI_SIFRE
      },
      body: JSON.stringify(yeniBilgiler)
    })
    .then((cevap) => cevap.json())
    .then((guncelListe) => {
      setFilmler(guncelListe);
    });
  };

  
  const filmiSil = (silinecekId) => {
    fetch(`http://localhost:8080/api/filmler/${silinecekId}`, {
      method: "DELETE",
      headers: {
      "Gizli-Anahtar": import.meta.env.VITE_GIZLI_SIFRE
      }
    })
    .then((cevap) => cevap.json())
    .then((guncelListe) => setFilmler(guncelListe));
  };
  
  
  const filmiEkle = () => {
    const eklenecekFilm = {
      ad: yeniAd,
      yil: Number(yeniYil),
      afis: yeniAfis,
      begenildiMi: false
    };
    
  fetch("http://localhost:8080/api/filmler", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Gizli-Anahtar": import.meta.env.VITE_GIZLI_SIFRE
    },
    body: JSON.stringify(eklenecekFilm)
  })
  .then((cevap) => cevap.json())
  .then((guncelListe) => {
  setFilmler(guncelListe);
  setYeniAd("");
  setYeniYil("");
  setYeniAfis("");
  setPopupAcik(false);
  });
}; 

// --- YÖNETİCİ GİRİŞ / ÇIKIŞ SİSTEMİ ---
const adminGirisiTetikle = () => {
  //Eğer zaten adminsek, butona basınca çıkış yapsın (kilidi kapatsın)
  if(adminMi === true) {
    setAdminMi(false);
  } else {
    setSifreKutusuAcik(true); //Değilsek şifre sorma kutumuzu ekranda göster
  }
};

const sifreKontrolEt = () => {
  if(sifreDenemesi === import.meta.env.VITE_GIZLI_SIFRE) {
    setAdminMi(true);    //Şifre doğruysa kilidi aç!
    setSifreKutusuAcik(false);  //İşlem bitince kutuyu kapat
    setSifreDenemesi("");  //Kutunun içindeki yazıyı temizle
  } else {
    alert("Hatalı şifre girdiniz!");
    setSifreDenemesi("");   //Yanlış girerse de kutuyu temizle ki kişi tekrar silemesin
  }
}

  return(
    <div>
      <div className="ust-menu">
        <h1 className="site-logo">🎬 Film Arşivi</h1>

        <div className="arama-alani">
          <input
            type="text"
            placeholder="Film Ara..."
            value={aramaMetni}
            onChange={(olay) => setAramaMetni(olay.target.value)}
            className="arama-kutusu"
          />

          {/* YÖNETİCİ BUTONUMUZ */}
          <button onClick={adminGirisiTetikle} className="admin-giris-butonu">
            {adminMi ? "🔓 Çıkış Yap" : "🔒 Yönetici Girişi"}
          </button>  
        </div>
      </div>  
        {/* --- YENİ EKLENEN ÖZEL ŞİFRE KUTUSU --- */}
        {sifreKutusuAcik && (
          <div className="popup-kutu">
            <h3>Yönetici Girişi</h3>
            <input
              type="password" /* Şifre yazarken yıldızlı (****) görünmesi için password yaptık */
              placeholder="Şifreyi girin..."
              value={sifreDenemesi}
              onChange={(e) => setSifreDenemesi(e.target.value)} // Kumanda: Adam klavyeye bastıkça hafızayı güncelle 
            />
            <div className="popup-butonlar">
              <button onClick={sifreKontrolEt} className="ekle-butonu">Giriş Yap</button>
              <button onClick={() => {
                setSifreKutusuAcik(false); //İptale basarsa kutuyu kapat
                setSifreDenemesi(""); //Ve içini temizle
              }} className="iptal-butonu">İptal</button>
            </div>
          </div>    
        )}
      {adminMi && !popupAcik && (
        <button onClick={() => setPopupAcik(true)} className="yeni-film-ac-butonu"> + Yeni Film Ekle</button>
      )}
      {adminMi && popupAcik &&(
        <div className="popup-kutu">
          <h3>Film Bilgilerini Girin</h3>
          <input
            type="text" placeholder="Film Adı" value={yeniAd}
            onChange={(olay) => setYeniAd(olay.target.value)}
          />
          <input
            type="number" placeholder="Çıkış Yılı" value={yeniYil}
            onChange={(olay) => setYeniYil(olay.target.value)}
          />
          <input
            type="text" placeholder="Afiş Linki (URL)" value={yeniAfis}
            onChange={(olay) => setYeniAfis(olay.target.value)}
          />
          <div className="popup-butonlar">
              <button onClick={filmiEkle} className="ekle-butonu">Kaydet</button>
              <button onClick={() => setPopupAcik(false)} className="iptal-butonu">İptal</button>
          </div>
        </div>  
      )}
      
      <div className="film-listesi">
        {filmler
          .filter((film) => (film.ad || "").toLowerCase().includes(aramaMetni.toLowerCase()))
          .map((film) => (
            <FilmKarti
              key={film.id}
              filmBilgisi={film}
              telsiz={filmiSil}
              telsizGuncelle={filmiGuncelle}
              adminMi={adminMi}
            />
          ))}
      </div>
    </div>
  )
}

export default App;