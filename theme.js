// Theme Toggle Functionality
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  
  // Apply theme
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update checkbox state
    if (themeToggle) {
      themeToggle.checked = (theme === 'dark');
    }
  }
  
  // Initialize theme on page load
  const preferredTheme = getPreferredTheme();
  setTheme(preferredTheme);
  
  // Toggle theme on checkbox change
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      const newTheme = this.checked ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();

// Language Selector Functionality
(function() {
  const languageSelector = document.querySelector('.language-selector');
  const languageBtn = document.querySelector('.language-btn');
  const currentLangSpan = document.querySelector('.current-lang');
  const langOptions = document.querySelectorAll('.lang-option');
  
  if (!languageSelector || !languageBtn) return;
  
  // Language codes to display names
  const langCodes = {
    'en': 'EN',
    'es': 'ES',
    'pt': 'PT',
    'fr': 'FR',
    'de': 'DE',
    'it': 'IT',
    'nl': 'NL',
    'pl': 'PL',
    'ro': 'RO',
    'hu': 'HU',
    'cs': 'CS',
    'el': 'EL',
    'sv': 'SV',
    'da': 'DA',
    'no': 'NO',
    'fi': 'FI',
    'bg': 'BG',
    'hr': 'HR',
    'sr': 'SR',
    'sk': 'SK',
    'sl': 'SL',
    'lt': 'LT',
    'lv': 'LV',
    'et': 'ET',
    'sq': 'SQ',
    'mk': 'MK',
    'be': 'BE',
    'uk': 'UK',
    'ru': 'RU',
    'ca': 'CA',
    'gl': 'GL',
    'eu': 'EU',
    'ga': 'GA',
    'cy': 'CY',
    'is': 'IS',
    'mt': 'MT',
    'tr': 'TR',
    'ar': 'AR',
    'fa': 'FA',
    'ur': 'UR',
    'hi': 'HI',
    'bn': 'BN',
    'pa': 'PA',
    'gu': 'GU',
    'mr': 'MR',
    'te': 'TE',
    'ta': 'TA',
    'kn': 'KN',
    'ml': 'ML',
    'si': 'SI',
    'ne': 'NE',
    'zh': 'ZH',
    'ja': 'JA',
    'ko': 'KO',
    'id': 'ID',
    'ms': 'MS',
    'tl': 'TL',
    'ceb': 'CEB',
    'vi': 'VI',
    'th': 'TH',
    'lo': 'LO',
    'my': 'MY',
    'km': 'KM',
    'sw': 'SW',
    'ha': 'HA',
    'yo': 'YO',
    'ig': 'IG',
    'ff': 'FF',
    'am': 'AM',
    'ti': 'TI',
    'om': 'OM',
    'so': 'SO',
    'mg': 'MG',
    'sn': 'SN',
    'zu': 'ZU'
  };
  
  // Translation help messages in each language
  const translationMessages = {
    'es': { title: 'Ayúdanos a traducir', message: 'Necesitamos tu ayuda para traducir esta página al español. ¡Contáctanos para colaborar!' },
    'pt': { title: 'Ajude-nos a traduzir', message: 'Precisamos da sua ajuda para traduzir esta página para português. Entre em contato para colaborar!' },
    'fr': { title: 'Aidez-nous à traduire', message: 'Nous avons besoin de votre aide pour traduire cette page en français. Contactez-nous pour collaborer!' },
    'de': { title: 'Hilf uns beim Übersetzen', message: 'Wir brauchen deine Hilfe, um diese Seite ins Deutsche zu übersetzen. Kontaktiere uns, um mitzuhelfen!' },
    'it': { title: 'Aiutaci a tradurre', message: 'Abbiamo bisogno del tuo aiuto per tradurre questa pagina in italiano. Contattaci per collaborare!' },
    'nl': { title: 'Help ons vertalen', message: 'We hebben je hulp nodig om deze pagina naar het Nederlands te vertalen. Neem contact met ons op om mee te helpen!' },
    'pl': { title: 'Pomóż nam tłumaczyć', message: 'Potrzebujemy twojej pomocy, aby przetłumaczyć tę stronę na polski. Skontaktuj się z nami, aby pomóc!' },
    'ro': { title: 'Ajută-ne să traducem', message: 'Avem nevoie de ajutorul tău pentru a traduce această pagină în română. Contactează-ne pentru a colabora!' },
    'hu': { title: 'Segíts a fordításban', message: 'Szükségünk van a segítségedre, hogy lefordítsuk ezt az oldalt magyarra. Lépj velünk kapcsolatba!' },
    'cs': { title: 'Pomozte nám s překladem', message: 'Potřebujeme vaši pomoc s překladem této stránky do češtiny. Kontaktujte nás a pomozte!' },
    'el': { title: 'Βοηθήστε μας να μεταφράσουμε', message: 'Χρειαζόμαστε τη βοήθειά σας για να μεταφράσουμε αυτή τη σελίδα στα ελληνικά. Επικοινωνήστε μαζί μας!' },
    'sv': { title: 'Hjälp oss översätta', message: 'Vi behöver din hjälp för att översätta denna sida till svenska. Kontakta oss för att hjälpa till!' },
    'da': { title: 'Hjælp os med at oversætte', message: 'Vi har brug for din hjælp til at oversætte denne side til dansk. Kontakt os for at hjælpe!' },
    'no': { title: 'Hjelp oss å oversette', message: 'Vi trenger din hjelp til å oversette denne siden til norsk. Kontakt oss for å hjelpe!' },
    'fi': { title: 'Auta meitä kääntämään', message: 'Tarvitsemme apuasi tämän sivun kääntämiseen suomeksi. Ota yhteyttä auttaaksesi!' },
    'bg': { title: 'Помогнете ни да преведем', message: 'Имаме нужда от вашата помощ за превода на тази страница на български. Свържете се с нас!' },
    'hr': { title: 'Pomozite nam prevesti', message: 'Trebamo vašu pomoć za prevođenje ove stranice na hrvatski. Kontaktirajte nas!' },
    'sr': { title: 'Помозите нам да преведемо', message: 'Потребна нам је ваша помоћ да преведемо ову страницу на српски. Контактирајте нас!' },
    'sk': { title: 'Pomôžte nám preložiť', message: 'Potrebujeme vašu pomoc s prekladom tejto stránky do slovenčiny. Kontaktujte nás!' },
    'sl': { title: 'Pomagajte nam prevesti', message: 'Potrebujemo vašo pomoč pri prevajanju te strani v slovenščino. Kontaktirajte nas!' },
    'lt': { title: 'Padėkite mums išversti', message: 'Mums reikia jūsų pagalbos išversti šį puslapį į lietuvių kalbą. Susisiekite su mumis!' },
    'lv': { title: 'Palīdziet mums tulkot', message: 'Mums ir nepieciešama jūsu palīdzība šīs lapas tulkošanā latviešu valodā. Sazinieties ar mums!' },
    'et': { title: 'Aidake meil tõlkida', message: 'Vajame teie abi selle lehe tõlkimisel eesti keelde. Võtke meiega ühendust!' },
    'sq': { title: 'Na ndihmoni të përkthejmë', message: 'Kemi nevojë për ndihmën tuaj për të përkthyer këtë faqe në shqip. Na kontaktoni!' },
    'mk': { title: 'Помогнете ни да преведеме', message: 'Ни треба вашата помош за превод на оваа страница на македонски. Контактирајте нè!' },
    'be': { title: 'Дапамажыце нам перакласці', message: 'Нам патрэбна ваша дапамога для перакладу гэтай старонкі на беларускую мову. Звяжыцеся з намі!' },
    'uk': { title: 'Допоможіть нам перекласти', message: 'Нам потрібна ваша допомога для перекладу цієї сторінки українською. Зв\'яжіться з нами!' },
    'ru': { title: 'Помогите нам перевести', message: 'Нам нужна ваша помощь для перевода этой страницы на русский. Свяжитесь с нами!' },
    'ca': { title: 'Ajuda\'ns a traduir', message: 'Necessitem la teva ajuda per traduir aquesta pàgina al català. Contacta\'ns per col·laborar!' },
    'gl': { title: 'Axúdanos a traducir', message: 'Necesitamos a túa axuda para traducir esta páxina ao galego. Contacta connosco!' },
    'eu': { title: 'Lagundu itzultzen', message: 'Zure laguntza behar dugu orri hau euskarara itzultzeko. Jarri gurekin harremanetan!' },
    'ga': { title: 'Cabhraigh linn aistriú', message: 'Tá do chabhair ag teastáil uainn chun an leathanach seo a aistriú go Gaeilge. Déan teagmháil linn!' },
    'cy': { title: 'Helpwch ni i gyfieithu', message: 'Mae angen eich help i gyfieithu\'r dudalen hon i\'r Gymraeg. Cysylltwch â ni!' },
    'is': { title: 'Hjálpaðu okkur að þýða', message: 'Við þurfum aðstoð þína við að þýða þessa síðu á íslensku. Hafðu samband!' },
    'mt': { title: 'Għinna nittraduċu', message: 'Għandna bżonn l-għajnuna tiegħek biex nittraduċu din il-paġna bil-Malti. Ikkuntattjana!' },
    'tr': { title: 'Çevirmemize yardım edin', message: 'Bu sayfayı Türkçe\'ye çevirmek için yardımınıza ihtiyacımız var. Bizimle iletişime geçin!' },
    'ar': { title: 'ساعدنا في الترجمة', message: 'نحتاج مساعدتك لترجمة هذه الصفحة إلى العربية. تواصل معنا للمساعدة!' },
    'fa': { title: 'به ما در ترجمه کمک کنید', message: 'ما به کمک شما برای ترجمه این صفحه به فارسی نیاز داریم. با ما تماس بگیرید!' },
    'ur': { title: 'ترجمہ میں ہماری مدد کریں', message: 'ہمیں اس صفحے کو اردو میں ترجمہ کرنے کے لیے آپ کی مدد کی ضرورت ہے۔ ہم سے رابطہ کریں!' },
    'hi': { title: 'अनुवाद में हमारी मदद करें', message: 'हमें इस पेज को हिंदी में अनुवाद करने के लिए आपकी मदद चाहिए। हमसे संपर्क करें!' },
    'bn': { title: 'অনুবাদে আমাদের সাহায্য করুন', message: 'এই পৃষ্ঠাটি বাংলায় অনুবাদ করতে আমাদের আপনার সাহায্য প্রয়োজন। আমাদের সাথে যোগাযোগ করুন!' },
    'pa': { title: 'ਅਨੁਵਾਦ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ', message: 'ਸਾਨੂੰ ਇਸ ਪੰਨੇ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰਨ ਲਈ ਤੁਹਾਡੀ ਮਦਦ ਦੀ ਲੋੜ ਹੈ। ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ!' },
    'gu': { title: 'અનુવાદમાં અમને મદદ કરો', message: 'આ પૃષ્ઠને ગુજરાતીમાં અનુવાદ કરવા માટે અમને તમારી મદદની જરૂર છે. અમારો સંપર્ક કરો!' },
    'mr': { title: 'भाषांतरात आम्हाला मदत करा', message: 'हे पृष्ठ मराठीत भाषांतरित करण्यासाठी आम्हाला तुमच्या मदतीची गरज आहे. आमच्याशी संपर्क साधा!' },
    'te': { title: 'అనువాదంలో మాకు సహాయం చేయండి', message: 'ఈ పేజీని తెలుగులో అనువదించడానికి మాకు మీ సహాయం అవసరం. మమ్మల్ని సంప్రదించండి!' },
    'ta': { title: 'மொழிபெயர்ப்பில் எங்களுக்கு உதவுங்கள்', message: 'இந்த பக்கத்தை தமிழில் மொழிபெயர்க்க உங்கள் உதவி தேவை. எங்களை தொடர்பு கொள்ளுங்கள்!' },
    'kn': { title: 'ಅನುವಾದದಲ್ಲಿ ನಮಗೆ ಸಹಾಯ ಮಾಡಿ', message: 'ಈ ಪುಟವನ್ನು ಕನ್ನಡಕ್ಕೆ ಅನುವಾದಿಸಲು ನಮಗೆ ನಿಮ್ಮ ಸಹಾಯ ಬೇಕು. ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ!' },
    'ml': { title: 'വിവർത്തനത്തിൽ ഞങ്ങളെ സഹായിക്കൂ', message: 'ഈ പേജ് മലയാളത്തിലേക്ക് വിവർത്തനം ചെയ്യാൻ നിങ്ങളുടെ സഹായം ആവശ്യമാണ്. ഞങ്ങളെ ബന്ധപ്പെടുക!' },
    'si': { title: 'පරිවර්තනයට අපට උදව් කරන්න', message: 'මෙම පිටුව සිංහලට පරිවර්තනය කිරීමට ඔබේ සහාය අවශ්‍යයි. අප හා සම්බන්ධ වන්න!' },
    'ne': { title: 'अनुवादमा हामीलाई मद्दत गर्नुहोस्', message: 'यो पृष्ठलाई नेपालीमा अनुवाद गर्न हामीलाई तपाईंको मद्दत चाहिन्छ। हामीलाई सम्पर्क गर्नुहोस्!' },
    'zh': { title: '帮助我们翻译', message: '我们需要您的帮助将此页面翻译成中文。请联系我们！' },
    'ja': { title: '翻訳にご協力ください', message: 'このページを日本語に翻訳するためにあなたの助けが必要です。お問い合わせください！' },
    'ko': { title: '번역을 도와주세요', message: '이 페이지를 한국어로 번역하는 데 도움이 필요합니다. 연락주세요!' },
    'id': { title: 'Bantu kami menerjemahkan', message: 'Kami membutuhkan bantuan Anda untuk menerjemahkan halaman ini ke Bahasa Indonesia. Hubungi kami!' },
    'ms': { title: 'Bantu kami menterjemah', message: 'Kami memerlukan bantuan anda untuk menterjemahkan halaman ini ke Bahasa Melayu. Hubungi kami!' },
    'tl': { title: 'Tulungan kaming magsalin', message: 'Kailangan namin ang iyong tulong para isalin ang pahinang ito sa Tagalog. Makipag-ugnayan sa amin!' },
    'ceb': { title: 'Tabangi kami sa paghubad', message: 'Kinahanglan namo ang imong tabang sa paghubad niini nga panid sa Cebuano. Kontaka kami!' },
    'vi': { title: 'Giúp chúng tôi dịch', message: 'Chúng tôi cần sự giúp đỡ của bạn để dịch trang này sang tiếng Việt. Liên hệ với chúng tôi!' },
    'th': { title: 'ช่วยเราแปล', message: 'เราต้องการความช่วยเหลือของคุณในการแปลหน้านี้เป็นภาษาไทย ติดต่อเรา!' },
    'lo': { title: 'ຊ່ວຍພວກເຮົາແປ', message: 'ພວກເຮົາຕ້ອງການຄວາມຊ່ວຍເຫຼືອຂອງທ່ານເພື່ອແປໜ້ານີ້ເປັນພາສາລາວ. ຕິດຕໍ່ພວກເຮົາ!' },
    'my': { title: 'ဘာသာပြန်ရန် ကူညီပါ', message: 'ဤစာမျက်နှာကို မြန်မာဘာသာသို့ ဘာသာပြန်ရန် သင့်အကူအညီ လိုအပ်ပါသည်။ ဆက်သွယ်ပါ!' },
    'km': { title: 'ជួយយើងបកប្រែ', message: 'យើងត្រូវការជំនួយរបស់អ្នកដើម្បីបកប្រែទំព័រនេះជាភាសាខ្មែរ។ ទាក់ទងមកយើង!' },
    'sw': { title: 'Tusaidie kutafsiri', message: 'Tunahitaji msaada wako kutafsiri ukurasa huu kwa Kiswahili. Wasiliana nasi!' },
    'ha': { title: 'Taimaka mana fassara', message: 'Muna buƙatar taimakonku don fassara wannan shafin zuwa Hausa. Tuntuɓe mu!' },
    'yo': { title: 'Ṣe iranlọwọ lati tumọ', message: 'A nilo iranlọwọ rẹ lati tumọ oju-iwe yii si Yoruba. Kan si wa!' },
    'ig': { title: 'Nyere anyị aka ịsụgharị', message: 'Anyị chọrọ enyemaka gị ịsụgharị ibe a ka ọ bụrụ Igbo. Kpọtụrụ anyị!' },
    'ff': { title: 'Wallu min firde', message: 'Emin sokli wallugol maa ngam firde hello ngo e Pulaar. Jokkondiral amin!' },
    'am': { title: 'እንድንተረጎም እርዱን', message: 'ይህን ገጽ ወደ አማርኛ ለመተርጎም እርስዎ እርዳታ ያስፈልገናል። ያግኙን!' },
    'ti': { title: 'ክንትርጉም ሓግዙና', message: 'እዚ ገጽ ናብ ትግርኛ ንምትርጓም ሓገዝኩም የድልየና። ርኸቡና!' },
    'om': { title: 'Hiikuuf nu gargaaraa', message: 'Fuula kana gara Afaan Oromootti hiikuuf gargaarsa keessan nu barbaachisa. Nu quunnamaa!' },
    'so': { title: 'Naga caawi tarjumaadda', message: 'Waxaan u baahanahay caawimaadaada si aad u tarjunto boggan Soomaaliga. Nala soo xiriir!' },
    'mg': { title: 'Ampio anay handika', message: 'Mila ny fanampianao izahay handika ity pejy ity amin\'ny teny Malagasy. Mifandraisa aminay!' },
    'sn': { title: 'Tibatsirei kushandura', message: 'Tinoda rubatsiro rwenyu kushandura peji iyi kuChiShona. Tibatei!' },
    'zu': { title: 'Sisize ukuhumusha', message: 'Sidinga usizo lwakho ukuhumusha leli khasi ngesiZulu. Xhumana nathi!' }
  };
  
  // Get saved language or default to English
  function getSavedLanguage() {
    return localStorage.getItem('language') || 'en';
  }
  
  // Show translation help modal
  function showTranslationModal(lang) {
    const modal = document.getElementById('translation-modal');
    if (!modal) return;
    
    const msgData = translationMessages[lang];
    if (!msgData) return;
    
    const titleEl = modal.querySelector('.translation-modal-title');
    const messageEl = modal.querySelector('.translation-modal-message');
    
    if (titleEl) titleEl.textContent = msgData.title;
    if (messageEl) messageEl.textContent = msgData.message;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Hide translation modal
  function hideTranslationModal() {
    const modal = document.getElementById('translation-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Set up modal close handlers
  const translationModal = document.getElementById('translation-modal');
  if (translationModal) {
    const closeBtn = translationModal.querySelector('.translation-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideTranslationModal);
    }
    
    translationModal.addEventListener('click', function(e) {
      if (e.target === translationModal) {
        hideTranslationModal();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && translationModal.classList.contains('active')) {
        hideTranslationModal();
      }
    });
  }
  
  // Set language
  function setLanguage(lang, showModal = false) {
    localStorage.setItem('language', lang);
    if (currentLangSpan) {
      currentLangSpan.textContent = langCodes[lang] || 'EN';
    }
    
    // Update active state
    langOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.lang === lang);
    });
    
    // Set HTML lang attribute
    document.documentElement.lang = lang;
    
    // Close dropdown
    languageSelector.classList.remove('open');
    languageBtn.setAttribute('aria-expanded', 'false');
    
    // Show translation modal for non-English languages
    if (showModal && lang !== 'en') {
      setTimeout(() => showTranslationModal(lang), 100);
    }
  }
  
  // Initialize language (don't show modal on page load)
  const savedLang = getSavedLanguage();
  setLanguage(savedLang, false);
  
  // Toggle dropdown
  languageBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = languageSelector.classList.toggle('open');
    this.setAttribute('aria-expanded', isOpen);
  });
  
  // Handle language selection
  langOptions.forEach(option => {
    option.addEventListener('click', function() {
      const lang = this.dataset.lang;
      setLanguage(lang, true); // Show modal when user selects a language
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!languageSelector.contains(e.target)) {
      languageSelector.classList.remove('open');
      languageBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close dropdown on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      languageSelector.classList.remove('open');
      languageBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Legal Disclaimer Modal Functionality
(function() {
  const disclaimerOverlay = document.getElementById('disclaimer-overlay');
  const disclaimerAgree = document.getElementById('disclaimer-agree');
  const disclaimerAccept = document.getElementById('disclaimer-accept');
  
  if (!disclaimerOverlay) return;
  
  const DISCLAIMER_KEY = 'fsf_disclaimer_accepted';
  const DISCLAIMER_VERSION = '1.0'; // Increment this to force re-acceptance
  
  // Check if disclaimer was already accepted
  function isDisclaimerAccepted() {
    const accepted = localStorage.getItem(DISCLAIMER_KEY);
    return accepted === DISCLAIMER_VERSION;
  }
  
  // Show disclaimer modal
  function showDisclaimer() {
    disclaimerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Focus on the modal for accessibility
    setTimeout(() => {
      if (disclaimerAgree) {
        disclaimerAgree.focus();
      }
    }, 100);
  }
  
  // Hide disclaimer modal
  function hideDisclaimer() {
    disclaimerOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Accept disclaimer
  function acceptDisclaimer() {
    localStorage.setItem(DISCLAIMER_KEY, DISCLAIMER_VERSION);
    hideDisclaimer();
  }
  
  // Enable/disable accept button based on checkbox
  if (disclaimerAgree && disclaimerAccept) {
    disclaimerAgree.addEventListener('change', function() {
      disclaimerAccept.disabled = !this.checked;
    });
    
    disclaimerAccept.addEventListener('click', function() {
      if (!disclaimerAgree.checked) return;
      acceptDisclaimer();
    });
  }
  
  // Prevent closing by clicking overlay (must explicitly accept or decline)
  disclaimerOverlay.addEventListener('click', function(e) {
    // Only allow closing if clicking directly on overlay, not modal content
    // But we don't want users to close without accepting, so do nothing
  });
  
  // Trap focus within modal
  disclaimerOverlay.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusableElements = disclaimerOverlay.querySelectorAll(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    // Prevent Escape from closing (must explicitly accept or decline)
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  });
  
  // Show disclaimer on page load if not accepted
  if (!isDisclaimerAccepted()) {
    // Small delay to ensure page is rendered
    setTimeout(showDisclaimer, 300);
  }
})();

// Path Explorer Interactive Functionality
(function() {
  const pillarCards = document.querySelectorAll('.pillar-card');
  const pillarTrees = document.querySelectorAll('.pillar-tree');
  const treeBranches = document.querySelectorAll('.tree-branch');
  const treeDetails = document.querySelectorAll('.tree-detail');
  const treeCloseButtons = document.querySelectorAll('.tree-close');
  
  if (!pillarCards.length) return;
  
  // Handle pillar card clicks
  pillarCards.forEach(card => {
    card.addEventListener('click', function() {
      const pillarId = this.dataset.pillar;
      const targetTree = document.getElementById(`tree-${pillarId}`);
      
      // Check if this pillar is already active
      const isActive = this.classList.contains('active');
      
      // Close all pillars and trees first
      pillarCards.forEach(c => c.classList.remove('active'));
      pillarTrees.forEach(t => t.classList.remove('active'));
      
      // If clicking on a different pillar (or re-opening), activate it
      if (!isActive && targetTree) {
        this.classList.add('active');
        targetTree.classList.add('active');
        
        // Auto-select first branch if none selected
        const branches = targetTree.querySelectorAll('.tree-branch');
        const details = targetTree.querySelectorAll('.tree-detail');
        
        // Reset branch selection
        branches.forEach(b => b.classList.remove('active'));
        details.forEach(d => d.classList.remove('active'));
        
        // Activate first branch and its detail
        if (branches.length > 0) {
          branches[0].classList.add('active');
          const firstBranchId = branches[0].dataset.branch;
          const firstDetail = document.getElementById(`detail-${firstBranchId}`);
          if (firstDetail) {
            firstDetail.classList.add('active');
          }
        }
        
        // Smooth scroll to the tree
        setTimeout(() => {
          targetTree.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
    
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Handle tree branch clicks
  treeBranches.forEach(branch => {
    branch.addEventListener('click', function() {
      const branchId = this.dataset.branch;
      const parentTree = this.closest('.pillar-tree');
      
      // Deactivate all branches and details in this tree
      const siblings = parentTree.querySelectorAll('.tree-branch');
      const details = parentTree.querySelectorAll('.tree-detail');
      
      siblings.forEach(s => s.classList.remove('active'));
      details.forEach(d => d.classList.remove('active'));
      
      // Activate this branch and its detail
      this.classList.add('active');
      const targetDetail = document.getElementById(`detail-${branchId}`);
      if (targetDetail) {
        targetDetail.classList.add('active');
      }
    });
  });
  
  // Handle tree close buttons
  treeCloseButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const parentTree = this.closest('.pillar-tree');
      const treeId = parentTree.dataset.tree;
      
      // Close the tree
      parentTree.classList.remove('active');
      
      // Deactivate the corresponding pillar card
      const pillarCard = document.querySelector(`.pillar-card[data-pillar="${treeId}"]`);
      if (pillarCard) {
        pillarCard.classList.remove('active');
      }
      
      // Smooth scroll back to pillars
      const pathExplorer = document.getElementById('path-explorer');
      if (pathExplorer) {
        setTimeout(() => {
          pathExplorer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  });
  
  // Close tree when clicking outside
  document.addEventListener('click', function(e) {
    // Only process if we have active trees and click is outside
    const activeTree = document.querySelector('.pillar-tree.active');
    if (!activeTree) return;
    
    const isClickInside = e.target.closest('.pillar-tree') || e.target.closest('.pillar-card');
    if (!isClickInside) {
      // Close all trees and deactivate pillars
      pillarTrees.forEach(t => t.classList.remove('active'));
      pillarCards.forEach(c => c.classList.remove('active'));
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeTree = document.querySelector('.pillar-tree.active');
      if (activeTree) {
        pillarTrees.forEach(t => t.classList.remove('active'));
        pillarCards.forEach(c => c.classList.remove('active'));
      }
    }
  });
})();

// LinkedIn Contact Modal (instead of direct navigation)
(function() {
  const LINKEDIN_URL = 'https://www.linkedin.com/in/cozzolinofrancesco/';

  function ensureModal() {
    let overlay = document.querySelector('.linkedin-contact-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'linkedin-contact-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'linkedin-contact-title');

    overlay.innerHTML = `
      <div class="linkedin-contact-modal">
        <button class="linkedin-contact-close" aria-label="Close">&times;</button>
        <div class="linkedin-contact-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </div>
        <h2 class="linkedin-contact-title" id="linkedin-contact-title">Contact me on LinkedIn</h2>
        <p class="linkedin-contact-message">
          Please write me directly on LinkedIn. Send a short message with who you are and what you need help with.
        </p>
        <div class="linkedin-contact-actions">
          <a class="linkedin-contact-open" href="${LINKEDIN_URL}" target="_blank" rel="noopener">Open LinkedIn</a>
          <button class="linkedin-contact-cancel" type="button">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.linkedin-contact-close');
    const cancelBtn = overlay.querySelector('.linkedin-contact-cancel');

    function hide() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function show() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        (closeBtn || cancelBtn || overlay).focus?.();
      }, 50);
    }

    closeBtn?.addEventListener('click', hide);
    cancelBtn?.addEventListener('click', hide);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) hide();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) hide();
    });

    overlay._showLinkedInModal = show;
    overlay._hideLinkedInModal = hide;
    return overlay;
  }

  function attachHandlers() {
    const links = document.querySelectorAll('a.social-icon.linkedin-icon');
    if (!links.length) return;

    const overlay = ensureModal();
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        overlay._showLinkedInModal?.();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  } else {
    attachHandlers();
  }
})();
