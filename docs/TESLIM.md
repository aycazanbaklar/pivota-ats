# Pivota ATS — Teslim Notu

Süre kısıtlı bir Design Engineer case çalışması. Kapsam, brief'te özellikle istenen iki
deneyimle sınırlı tutuldu: **mobil uyumlu aday başvuru akışı** ve **üç iç rol için
farklılaşan işe alım pipeline'ı**. Bunların dışındaki her şey (candidate dashboard, kapsamlı
bilgi mimarisi, gerçek ilan yönetimi, kullanıcı araştırması, geniş edge-case kapsamı)
bilinçli olarak kapsam dışı bırakıldı.

Tasarım tercihleri çalışmanın başında `SKILL.md` içinde bir rehbere yazıldı ve uygulama
boyunca oradan beslendi. Rehberin kendi kuralı gereği **brief gereksinimleri rehberin
varsayılanlarından önce gelir**; aşağıda bunun gerçekleştiği yerleri ayrıca işaretledim.

---

## Ekran bazında tasarım gerekçeleri

**Açık Pozisyonlar (public liste)**
Bilgi hiyerarşisi başlık → arama/filtre → sonuç sayısı → liste olarak kuruldu; filtre çubuğu
ayrı kartlara bölünmeden liste ile aynı content grid'i üzerine oturtuldu, böylece keşif
akışın parçası gibi okunuyor. Altı ilanın hepsinde dolu vurgu butonu kullanmak rehberin
"tek vurgu rengi, ekranın ~%10'u" kuralını ve action hierarchy'yi bozacağı için "Başvur"
konturlu bırakıldı, dolu vurgu ilan detayındaki tek birincil eyleme saklandı.

**İlan detayı**
Okuma genişliği 760px'e sabitlendi ve birincil eylem mobilde ekranın alt/başparmak
bölgesinde sabit duruyor — rehberin mobil eylem kuralı. *(Brief önceliği: rehber okuma
içeriği için 640–720px öneriyor; gereksinim listeleri bu genişlikte daralıp okunmaz hale
geldiği için 760px'e çıkıldı.)*

**Başvuru akışı — 5 adım**
Brief'in adım listesi birebir korundu. Rehberin çok adımlı form yönlendirmesi uygulandı:
tek sütun, ilerleme yalnız renkle değil "Adım 3 / 5" metniyle de, blur'da satır içi
doğrulama, zorunlu alan için `*` yerine opsiyonelleri etiketleme, her adımda "kaydet ve
sonra devam et". Hata metinleri [ne yanlış] + [nasıl düzeltilir] kalıbında.

**Başvuru akışı — eylem hiyerarşisi ve geri navigasyonu**
İlk üretimde üç ayrı eylem katmanı oluşmuştu (kart içinde geri, ortada tek başına duran
ikincil buton, sağda birincil). Gözlem sonrası tekilleştirildi: geri navigasyonu kartın
dışına, adım bağlamının üstüne alındı; ikincil ve birincil eylem tek satırda, solda outline
/ sağda dolu olarak konumlandı. Dar ekranda etiketler iki satıra sarmasın diye 640px altında
kısalıyor ("Taslağı kaydet", "Başla", "Gönder").

**Başvuru akışı — LinkedIn autofill geri bildirimi**
Başlangıçta hem global bir başarı kutusu hem de her alanın yanında tekrar eden bir durum
etiketi vardı; bu hem görsel gürültü yaratıyor hem de etiket yüksekliğini değiştirerek aynı
satırdaki input'ları farklı y ekseninden başlatıyordu. Alan başına geri bildirim tamamen
kaldırıldı, tek global bildirim bırakıldı ve form grid'i yeniden hizalandı.

**Başarı ekranı**
Rehberin başarı formülü ([ne oldu] + [şimdi ne olacak]) uygulandı: kopyalanabilir başvuru
numarası, tek cümlelik sonraki adım ve listeye dönüş yolu. Kullanıcı çıkmazda bırakılmıyor.

**Pipeline board (İK Uzmanı)**
Kart bilgi sırası her kartta sabit: aday adı (birincil) → pozisyon → kaynak + son aktivite.
AI uyum skoru küçük bir pill olarak sağ üstte; rehberin "yardımcı sinyal ana bilgiyi görsel
olarak bastırmasın" kuralı gereği isimden küçük ve daha az ağırlıkta. Boş aşama tamamen boş
bırakılmıyor, ikon + tek cümle ile durum gösteriliyor. Board kendi kabı içinde yatay
kayıyor; sayfanın kendisi hiçbir genişlikte yatay kaymıyor.

**Pipeline — aşama ayrımı**
Aşamalar ölçülü bir semantik tonla ayrıştırıldı (nötr → indigo → amber → yeşil) ama renk
yalnızca sütun başlığındaki 8px'lik noktada; kartlar renksiz kaldı. Aşama adı her yerde
metin olarak duruyor, anlam yalnız renge bırakılmadı. *(Brief önceliği: rehber tek vurgu
rengi diyor; brief aşama ayrımı istediği için çok tonlu bir sinyal eklendi, kapsamı sütun
başlığıyla sınırlandırıldı.)*

**Aday detay paneli**
Karta tıklayınca sayfa değişmeden sağdan açılıyor — rehberin context preservation kuralı;
kapanış X / Esc / dış tıklama ile net. Paneldeki aşama seçici sürükle-bırağın klavye
erişilebilir karşılığı. Uyum skoru "beta" etiketi ve "değerlendirme yerine geçmez" notuyla
sunuluyor; rehberin "kurgu veriyi gerçek değerlendirme gibi sunma" kuralı.

**Bekleyen Aksiyonlar (Hiring Manager)**
Bu rol sisteme seyrek girdiği için varsayılan görünüm tam board değil, yalnızca kendisinden
beklenen adayların kısa listesi — task flow, feature parity'nin önüne alındı. Scorecard
serbest metin yerine 1–5 segmentli derecelendirme ve ön dolu bağlam (ad / pozisyon / tarih)
ile açılıyor. Tam board'a ikincil bir bağlantıyla ulaşılabiliyor, görünüm keşfedilebilir
kalıyor.

**KPI şeridi (İK Yöneticisi)**
Üç metrik aynı ekranın üstünde kompakt bir şerit olarak duruyor ve her biri alttaki board'u
o filtreyle açıyor; ayrı bir dashboard sayfası üretilmedi. Üç rol de aynı sayfanın/bileşenin
role göre değişen hâli.

**Shell / navigasyon**
Hesap kontrolü public alan, giriş ekranı ve üç rol görünümünün hepsinde üst navigasyonun
aynı noktasında (sağ üst) duruyor; "Açık pozisyonlar" bu slotu işgal etmesin diye sola
alındı. Kapsam dışı nav öğeleri sessiz ölü tıklama bırakmak yerine durumu açıkça söyleyen
bir hedefe gidiyor — rehberin dead-button kuralı. Çıkış girişe, giriş ise her rolü kendi
varsayılan ekranına götürüyor.

**Pipeline — state continuity ve geri bildirim**
Aşama değişimi tek bir state güncellemesi olarak ele alındı: adayın aşaması, sütun sayıları,
açık detay paneli ve aktivite geçmişi aynı kaynaktan türüyor, ardından Postgres'e yazılıyor.
Taşıma sonrası kesintiye uğratmayan bir toast çıkıyor; kullanıcı sayfa değiştirmiyor, board
sıfırlanmıyor, mevcut filtre ve açık panel korunuyor.

---

## Kontrol edilen etkileşimler

Aşağıdakiler tarayıcıda gerçekten çalıştırıldı; kontrast ve dokunma hedefi ölçümleri
otomatik hesaplandı.

**Aday başvurusu (masaüstü + 375px)**
Boş alanla ilerleme → 3 hata + ilk hatalı alana odak · LinkedIn ile doldurma ve alanların
düzenlenebilir kalması · CV yükleme: yanlış tür, 5 MB üstü ve geçerli dosya; uzun dosya adı
ellipsis · CV/LinkedIn olmadan ilerlemenin engellenmesi · 4. adımda eksik yanıtla ilerleme →
4 hata · 5. adımda KVKK onayı olmadan gönderimin engellenmesi · gönderim → başvuru numarası ·
taslak kaydetme ve sayfayı yenileyince "kaldığınız yerden devam" · KVKK modalının X / Esc /
dış tıklama / "Anladım" ile kapanması.

**Pipeline (masaüstü)**
Üç ayrı aday için sürükle-bırak; her seferinde sütun sayıları, toast, panel aşaması ve
aktivite geçmişi birlikte güncellendi · panel kapatılıp açılınca eski geçmişin dönmemesi ·
panelden aşama değiştirmenin aynı zinciri tetiklemesi · filtre, board pozisyonu ve URL'in
taşıma sonrası korunması · arama ve pozisyon filtresi · müdür KPI'larından board'a filtre
inişi · yönetici scorecard gönderimi.

**Gerçek veritabanı**
Dört rolün dördüyle e-posta/parola girişi · sürükle-bırak sonrası `candidates.stage_id` ve
aktivite kaydının Postgres'te doğrulanması · scorecard sonrası `pending_action` temizlenmesi
ve bunun müdür KPI'sına yansıması · başvuru gönderiminin `applications` tablosuna uygunluk
skoruyla yazılması.

**Ölçüm**
1280px ve 375px'te ana ekranlarda WCAG kontrast oranı, 44px dokunma hedefi ve yatay taşma
kontrolü — kontrast hatası ve yatay kaydırma yok. Production build (23 sayfa) hatasız,
`tsc` temiz, ESLint 0 hata.

---

## Prototype davranışları (gerçek entegrasyon değil)

- **Giriş / rol seçimi gerçek ürün UX'i değil.** Supabase Auth ile gerçek e-posta/parola
  girişi kuruldu, ancak dört demo hesabın amacı aday, İK Uzmanı, Hiring Manager ve İK
  Yöneticisi görünümlerine test sırasında hızlı geçebilmek. Gerçek üründe kayıt, davet,
  parola sıfırlama ve hesap yönetimi ayrıca tasarlanır.
- **LinkedIn ile doldur** gerçek OAuth değil. Ortam değişkenleri bilinçli olarak boş; buton
  görsel olarak duruyor ve tıklanınca bilinen profil verisiyle doldurma davranışına düşüyor.
- **Uyum skoru** bir değerlendirme sistemi değil. `fastest-levenshtein` üzerine kurulu hafif
  bir anahtar kelime kapsama hesabı; arayüzde "beta" etiketi ve karar yerine geçmediğini
  söyleyen bir notla sunuluyor.
- **Aday ve ilan verisi** kurgu. Supabase'e seed edildi, gerçek başvurulardan gelmiyor.
- **Kapsam dışı nav sayfaları** (İlanlar, Adaylar, Raporlar, Hesap ayarları) özellik değil;
  yalnızca kapsam dışı olduğunu söyleyen ve geri dönüş veren sayfalar.

---

## Kalan eksikler

- Public ilan listesi ve ilan detayı hâlâ yereldeki seed dosyasından render ediliyor;
  `job_postings` tablosu doldurulmuş ve `candidates`/`applications` için FK kaynağı olsa da
  sayfalar Supabase'ten okumuyor.
- Uygunluk skoru yalnızca form alanlarından hesaplanıyor. Yüklenen CV dosyası sunucuya
  gitmediği ve içeriği ayrıştırılmadığı için skor düşük çıkıyor (test başvurusunda 21/100) —
  bu algoritmanın değil, girdi eksikliğinin sonucu.
- İç uygulama masaüstü öncelikli. 375px'te çalışıyor ve yatay taşma yok, ancak Kanban 264px
  sütunlarla yatay kayıyor; mobil için ayrı bir tasarım geçişi yapılmadı (bilinçli karar).
- Dokunmatik sürükle-bırak (basılı tut → sürükle) yapılandırıldı ama gerçek bir dokunmatik
  cihazda denenmedi.
- Oturum koruması istemci tarafında; sunucu tarafı middleware yok. İç rotalar bir an
  "Workspace açılıyor…" gösterip yönlendiriyor. Verinin asıl koruması RLS politikaları.
- 375px'te KVKK aydınlatma metni bağlantısı 276×23px — cümle içi satır içi bağlantı olduğu
  için WCAG hedef boyutu istisnasına giriyor, yine de mobilde dokunması zor. Aynı durum ilan
  listesindeki başlık bağlantıları için de geçerli (25–30px); her kartta 44px'lik
  Detay/Başvur butonları alternatif olarak duruyor.
- Başvuru taslağı hesaba değil tarayıcıya bağlı (localStorage); farklı cihazdan devam
  edilemiyor.
- `applications` tablosuna anonim ekleme açık (public başvuru için gerekli) ancak spam/rate
  limit koruması yok.
- Supabase güvenlik denetçisinde "leaked password protection" kapalı görünüyor; panelden
  açılabilir.

---

## Deploy hazırlığı

Production build hatasız geçiyor, bu haliyle Netlify'a alınabilir. Deploy öncesi
halledilmesi gerekenler:

1. **Ortam değişkenleri.** `.env.local` git'e girmiyor. Netlify'da
   `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` tanımlanmalı; bunlar
   olmadan giriş ve pipeline verisi çalışmaz. (Anahtar publishable, istemciye açılması
   tasarım gereği; veriyi RLS koruyor.)
2. **Base directory.** Uygulama deponun kökünde değil, `pivota-ats/` altında. Netlify'da
   base directory bu klasör olarak ayarlanmalı.
3. **Git durumu.** `pivota-ats/` bir git deposu; `SKILL.md`, case brief PDF'i ve workflow
   dokümanı bir üst klasörde duruyor. Hepsi tek depoda toplanacaksa dizin yapısına karar
   verilmeli.
4. **Netlify Next.js runtime.** Next.js 16 App Router için Netlify'ın Next eklentisi gerekli
   (genelde otomatik algılanır, doğrulanmalı).

Bilinen blocker yok; yukarıdakiler yapılandırma adımları.

---

## Saklanacak artefact'lar

- Bu teslim notu ve ekran görüntüleri (`docs/`)
- `SKILL.md` — çalışmanın başında yazılan tasarım rehberi (`.claude/skills/my-ui-style/`)
- Case brief PDF'i ve workflow/prompt dokümanı (proje kök klasöründe)
- Çalışan prototip kaynağı (`pivota-ats/`)
- Supabase şema migration'ları (proje panelinde, migration geçmişi olarak)
- AI konuşma / iterasyon geçmişi — oturum kaydı olarak dışarıdan saklanmalı; bu depodan
  erişilebilir bir kopyası yok.

## Ekran görüntüleri

| Dosya | İçerik |
| --- | --- |
| `01-mobil-basvuru-ilan-ozeti.png` | 375px — başvuru 1. adım, sabit alt eylem satırı |
| `02-mobil-basvuru-kisisel-bilgiler.png` | 375px — 2. adım, LinkedIn doldurma sonrası |
| `03-mobil-basvuru-cv-ve-profil.png` | 375px — 3. adım, tek global autofill bildirimi |
| `04-pipeline-ik-uzmani-board.png` | Tam Kanban board, aşama noktaları, sütun sayıları |
| `05-aday-detay-paneli.png` | Board bağlamı korunurken açılan aday detay paneli |
| `06-pipeline-hiring-manager-bekleyen-aksiyonlar.png` | Rol bazlı varsayılan görünüm |
| `07-hiring-manager-scorecard-paneli.png` | Ön dolu, segmentli scorecard |
| `08-pipeline-ik-yoneticisi-kpi.png` | KPI şeridi + aynı board |
