export interface LanguageStrings {
    email: string;
    genderAndBirthDate: string;
    country: string;
    region: string;
    saveProfile: string;
    cancel: string;
    editProfileTitle: string;
    yourPlan: string;
    account: string;
    manageSubscription: string;
    europe: string;
    northAmerica: string;
  }
  
 export  interface Languages {
    uk: LanguageStrings;
    en: LanguageStrings;
    cz: LanguageStrings;
    de: LanguageStrings;
  }

export const languages = {
    uk: {
        email: 'Електронна пошта',
        genderAndBirthDate: 'Стать та дата народження',
        country: 'Країна',
        region: 'Регіон',
        saveProfile: 'Зберегти профіль',
        cancel: 'Скасувати',
        editProfileTitle: 'Редагувати профіль',
        yourPlan: 'Ваш план',
        account: 'Акаунт',
        manageSubscription: 'Керуйте своєю підпискою',
        editProfile: 'Редагувати профіль',
        restorePlaylists: 'Відновлення списків відтворення',
        payment: 'Оплата',
        orderHistory: 'Історія замовлень',
        savedCards: 'Збережені платіжні картки',
        redeem: 'Викупити',
        securityPrivacy: 'Безпека та конфіденційність',
        changePassword: 'Змінити пароль',
        manageApps: 'Керувати програмами',
        notificationSettings: 'Налаштування сповіщень',
        privacySettings: 'Налаштування конфіденційності',
        editLoginMethods: 'Редагувати методи входу',
        logOutEverywhere: 'Вийдіть скрізь',
        help: 'Довідка',
        support: 'Підтримка SymphoNix',
        appearance: 'Вигляд: Темна тема',
        performer: 'Виконавець',
        listeners: 'Слухачів',
        subscribed: 'Підписаний',
        subscribe: 'Підписатися',
        topTracks: 'Топ треки виконавця',
        singles: 'Сингли',
        subscribedArtists: 'Підписані артисти',
        similarArtists: 'Схожі артисти',
        company: 'Компанія',
        aboutUs: 'Про нас',
        careers: 'Вакансії',
        forArtists: 'Для запису',
        forListeners: 'Для слухачів',
        getStarted: 'Початок роботи',
        faq: 'Часті запитання (FAQ)',
        updatesNews: 'Оновлення та новини',
        usefulLinks: 'Корисні посилання',
        mobileApp: 'Безкоштовний мобільний додаток',
        symphoNixSubscriptions: 'Підписки SymphoNix',
        premiumIndividual: 'Premium Individual',
        premiumDuo: 'Premium Duo',
        premiumFamily: 'Premium Family',
        premiumStudent: 'Premium Student',
        symphoNixFree: 'SymphoNix Free',
        showsToWatch: 'Шоу, які варто переглянути',
        topCharts: 'Топ-чарти',
        all: 'Усе',
        music: 'Музика',
        profile: 'Профіль',
        logout: 'Вийти',
        allCatalog: 'Весь каталог',
        search: 'Пошук',
        bestMatch: 'Найкращий результат',
        songs: 'Пісні',
        artists: 'Артисти',
        albums: 'Альбоми',
        tracks: 'Треки',
        home: 'Головна',
        library: 'Бібліотека',
        playlists: 'Плейлісти',
        likedTracks: 'Треки, які сподобалися',
        playlist: 'Плейліст',
        quantity: 'Кількість',
        addTracks: 'Додати треки',
        removeSelectedTracks: 'Видалити вибрані треки',
        recommendedTracks: 'Рекомендовані треки',
        popularRecommendedTracks: 'Запропоновані популярні треки',
        recommendationsBasedOnAlbum: 'Рекомендації на основі альбому',
        track: 'Трек',
        recommendationsBasedOnTrack: 'Рекомендації на основі треку',
        addToPlaylist: 'Додати до плейлиста',
        goToAlbum: 'Перейти до альбому',
        popularTracks: 'Популярні треки',
        removeFromFavorites: 'Видалити з улюблених',
        addToFavorites: 'Додати до улюблених',
        newForYou: 'Новинки для вас',
        newTracksForYou: 'Нові треки для вас',
        popularAlbums: 'Популярні альбоми',
        popularRadio: 'Популярні радіо',
        publicPlaylists: 'Публічні плейлисти',
        rockTracks: 'Рок треки',
        viral: 'Вірусні',
        rapTop: 'Реп топ',
        hipHopTop: 'Хіп-хоп топ',
        top50Ukraine: 'Топ 50 Україна',
        top100World: 'Топ 100 Весь світ',
        top50World: 'Топ 50 Весь світ',
        topSongsWorld: 'Топ пісень Весь світ',
        popularArtists: 'Популярні артисти',
        woman: 'Жінка',
        man: 'Чоловік',
        nonBinary: 'Небінарний',
        preferNotToSay: 'Краще не говорити',
        other: 'Інше',

        // Month options
        january: 'Січень',
        february: 'Лютий',
        march: 'Березень',
        april: 'Квітень',
        may: 'Травень',
        june: 'Червень',
        july: 'Липень',
        august: 'Серпень',
        september: 'Вересень',
        october: 'Жовтень',
        november: 'Листопад',
        december: 'Грудень',

        // Country options
        ukraine: 'Україна',
        usa: 'США',
        canada: 'Канада',
        mexico: 'Мексика',
        czechRepublic: 'Чехія',
        germany: 'Німеччина',
        topTracksThisMonth: 'Топ треки цього місяця',
        onlyVisibleToYou: 'Бачите лише ви',
        northAmerica: 'Північна Америка',
        europe: 'Європа',
    },
    en: {
        email: 'Email',
        genderAndBirthDate: 'Gender and Birth Date',
        country: 'Country',
        region: 'Region',
        saveProfile: 'Save Profile',
        cancel: 'Cancel',
        editProfileTitle: 'Edit Profile',
        yourPlan: 'Your Plan',
        account: 'Account',
        manageSubscription: 'Manage Subscription',
        editProfile: 'Edit Profile',
        restorePlaylists: 'Restore Playlists',
        payment: 'Payment',
        orderHistory: 'Order History',
        savedCards: 'Saved Payment Cards',
        redeem: 'Redeem',
        securityPrivacy: 'Security and Privacy',
        changePassword: 'Change Password',
        manageApps: 'Manage Apps',
        notificationSettings: 'Notification Settings',
        privacySettings: 'Privacy Settings',
        editLoginMethods: 'Edit Login Methods',
        logOutEverywhere: 'Log Out Everywhere',
        help: 'Help',
        support: 'SymphoNix Support',
        appearance: 'Appearance: Dark Theme',
        performer: 'Performer',
        listeners: 'Listeners',
        subscribed: 'Subscribed',
        subscribe: 'Subscribe',
        topTracks: 'Top Tracks',
        singles: 'Singles',
        subscribedArtists: 'Subscribed Artists',
        similarArtists: 'Similar Artists',
        company: 'Company',
        aboutUs: 'About Us',
        careers: 'Careers',
        forArtists: 'For Artists',
        forListeners: 'For Listeners',
        getStarted: 'Get Started',
        faq: 'FAQ',
        updatesNews: 'Updates & News',
        usefulLinks: 'Useful Links',
        mobileApp: 'Free Mobile App',
        symphoNixSubscriptions: 'SymphoNix Subscriptions',
        premiumIndividual: 'Premium Individual',
        premiumDuo: 'Premium Duo',
        premiumFamily: 'Premium Family',
        premiumStudent: 'Premium Student',
        symphoNixFree: 'SymphoNix Free',
        showsToWatch: 'Shows to Watch',
        topCharts: 'Top Charts',
        all: 'All',
        music: 'Music',
        profile: 'Profile',
        logout: 'Logout',
        allCatalog: 'All Catalog',
        search: 'Search',
        bestMatch: 'Best Match',
        songs: 'Songs',
        artists: 'Artists',
        albums: 'Albums',
        tracks: 'Tracks',
        home: 'Home',
        library: 'Library',
        playlists: 'Playlists',
        likedTracks: 'Liked Tracks',
        playlist: 'Playlist',
        quantity: 'Quantity',
        addTracks: 'Add Tracks',
        removeSelectedTracks: 'Remove Selected Tracks',
        recommendedTracks: 'Recommended Tracks',
        popularRecommendedTracks: 'Popular Recommended Tracks',
        recommendationsBasedOnAlbum: 'Recommendations Based on Album',
        track: 'Track',
        recommendationsBasedOnTrack: 'Recommendations Based on Track',
        addToPlaylist: 'Add to Playlist',
        goToAlbum: 'Go to Album',
        popularTracks: 'Popular Tracks',
        removeFromFavorites: 'Remove from Favorites',
        addToFavorites: 'Add to Favorites',
        newForYou: 'New for You',
        newTracksForYou: 'New Tracks for You',
        popularAlbums: 'Popular Albums',
        popularRadio: 'Popular Radio',
        publicPlaylists: 'Public Playlists',
        rockTracks: 'Rock Tracks',
        viral: 'Viral',
        rapTop: 'Rap Top',
        hipHopTop: 'Hip-hop Top',
        top50Ukraine: 'Top 50 Ukraine',
        top100World: 'Top 100 Worldwide',
        top50World: 'Top 50 Worldwide',
        topSongsWorld: 'Top Songs Worldwide',
        popularArtists: 'Popular Artists',
        woman: 'Woman',
        man: 'Man',
        nonBinary: 'Non-binary',
        preferNotToSay: 'Prefer not to say',
        other: 'Other',

        // Month options
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',

        // Country options
        ukraine: 'Ukraine',
        usa: 'USA',
        canada: 'Canada',
        mexico: 'Mexico',
        czechRepublic: 'Czech Republic',
        germany: 'Germany',
        topTracksThisMonth: 'Top tracks this month',
        onlyVisibleToYou: 'Only visible to you',
        northAmerica: 'North America',
        europe: 'Europe',
    },
    cz: {
        email: 'Email',
        genderAndBirthDate: 'Pohlaví a Datum Narození',
        country: 'Země',
        region: 'Region',
        saveProfile: 'Uložit Profil',
        cancel: 'Zrušit',
        editProfileTitle: 'Upravit Profil',
        yourPlan: 'Váš Plán',
        account: 'Účet',
        manageSubscription: 'Spravujte Předplatné',
        editProfile: 'Upravit Profil',
        restorePlaylists: 'Obnovit Seznamy Skladeb',
        payment: 'Platba',
        orderHistory: 'Historie Objednávek',
        savedCards: 'Uložené Platební Karty',
        redeem: 'Uplatnit',
        securityPrivacy: 'Bezpečnost a Soukromí',
        changePassword: 'Změnit Heslo',
        manageApps: 'Spravovat Aplikace',
        notificationSettings: 'Nastavení Oznámení',
        privacySettings: 'Nastavení Soukromí',
        editLoginMethods: 'Upravit Způsoby Přihlášení',
        logOutEverywhere: 'Odhlásit se Všude',
        help: 'Pomoc',
        support: 'Podpora SymphoNix',
        appearance: 'Vzhled: Tmavý Režim',
        performer: 'Umělec',
        listeners: 'Posluchačů',
        subscribed: 'Odběr',
        subscribe: 'Přihlásit se k odběru',
        topTracks: 'Nejlepší Skladby',
        singles: 'Singly',
        subscribedArtists: 'Předplacení Umělci',
        similarArtists: 'Podobní Umělci',
        company: 'Společnost',
        aboutUs: 'O nás',
        careers: 'Kariéra',
        forArtists: 'Pro umělce',
        forListeners: 'Pro posluchače',
        getStarted: 'Začít',
        faq: 'Často kladené otázky (FAQ)',
        updatesNews: 'Aktualizace a novinky',
        usefulLinks: 'Užitečné odkazy',
        mobileApp: 'Bezplatná mobilní aplikace',
        symphoNixSubscriptions: 'Předplatné SymphoNix',
        premiumIndividual: 'Premium Individual',
        premiumDuo: 'Premium Duo',
        premiumFamily: 'Premium Family',
        premiumStudent: 'Premium Student',
        symphoNixFree: 'SymphoNix Free',
        showsToWatch: 'Pořady, které stojí za zhlédnutí',
        topCharts: 'Top žebříčky',
        all: 'Vše',
        music: 'Hudba',
        profile: 'Profil',
        logout: 'Odhlásit se',
        allCatalog: 'Celý katalog',
        search: 'Hledání',
        bestMatch: 'Nejlepší shoda',
        songs: 'Písně',
        artists: 'Umělci',
        albums: 'Alba',
        tracks: 'Skladby',
        home: 'Domov',
        library: 'Knihovna',
        playlists: 'Seznamy skladeb',
        likedTracks: 'Oblíbené skladby',
        playlist: 'Seznam skladeb',
        quantity: 'Počet',
        addTracks: 'Přidat skladby',
        removeSelectedTracks: 'Odstranit vybrané skladby',
        recommendedTracks: 'Doporučené skladby',
        popularRecommendedTracks: 'Doporučené populární skladby',
        recommendationsBasedOnAlbum: 'Doporučení na základě alba',
        track: 'Skladba',
        recommendationsBasedOnTrack: 'Doporučení na základě skladby',
        addToPlaylist: 'Přidat do seznamu skladeb',
        goToAlbum: 'Přejít na album',
        popularTracks: 'Populární skladby',
        removeFromFavorites: 'Odstranit z oblíbených',
        addToFavorites: 'Přidat do oblíbených',
        newForYou: 'Novinky pro vás',
        newTracksForYou: 'Nové skladby pro vás',
        popularAlbums: 'Populární alba',
        popularRadio: 'Populární rádio',
        publicPlaylists: 'Veřejné playlisty',
        rockTracks: 'Rockové skladby',
        viral: 'Virální',
        rapTop: 'Rap top',
        hipHopTop: 'Hip-hop top',
        top50Ukraine: 'Top 50 Ukrajina',
        top100World: 'Top 100 Svět',
        top50World: 'Top 50 Svět',
        topSongsWorld: 'Top skladby Svět',
        popularArtists: 'Populární umělci',
        woman: 'Žena',
        man: 'Muž',
        nonBinary: 'Ne-binární',
        preferNotToSay: 'Raději neřeknu',
        other: 'Jiné',

        // Month options
        january: 'Leden',
        february: 'Únor',
        march: 'Březen',
        april: 'Duben',
        may: 'Květen',
        june: 'Červen',
        july: 'Červenec',
        august: 'Srpen',
        september: 'Září',
        october: 'Říjen',
        november: 'Listopad',
        december: 'Prosinec',

        // Country options
        ukraine: 'Ukrajina',
        usa: 'USA',
        canada: 'Kanada',
        mexico: 'Mexiko',
        czechRepublic: 'Česká republika',
        germany: 'Německo',
        topTracksThisMonth: 'Top skladby tohoto měsíce',
        onlyVisibleToYou: 'Vidíte pouze vy',
        northAmerica: 'Severní Amerika',
        europe: 'Evropa',

    },
    de: {
        email: 'E-Mail',
        genderAndBirthDate: 'Geschlecht und Geburtsdatum',
        country: 'Land',
        region: 'Region',
        saveProfile: 'Profil Speichern',
        cancel: 'Abbrechen',
        editProfileTitle: 'Profil Bearbeiten',
        yourPlan: 'Ihr Plan',
        account: 'Konto',
        manageSubscription: 'Abonnement Verwalten',
        editProfile: 'Profil Bearbeiten',
        restorePlaylists: 'Wiedergabelisten Wiederherstellen',
        payment: 'Bezahlung',
        orderHistory: 'Bestellverlauf',
        savedCards: 'Gespeicherte Zahlungsmethoden',
        redeem: 'Einlösen',
        securityPrivacy: 'Sicherheit und Datenschutz',
        changePassword: 'Passwort Ändern',
        manageApps: 'Apps Verwalten',
        notificationSettings: 'Benachrichtigungseinstellungen',
        privacySettings: 'Datenschutzeinstellungen',
        editLoginMethods: 'Anmeldemethoden Bearbeiten',
        logOutEverywhere: 'Überall Abmelden',
        help: 'Hilfe',
        support: 'SymphoNix Unterstützung',
        appearance: 'Aussehen: Dunkles Thema',
        performer: 'Künstler',
        listeners: 'Hörer',
        subscribed: 'Abonniert',
        subscribe: 'Abonnieren',
        topTracks: 'Top Tracks',
        singles: 'Singles',
        subscribedArtists: 'Abonnierte Künstler',
        similarArtists: 'Ähnliche Künstler',
        company: 'Unternehmen',
        aboutUs: 'Über uns',
        careers: 'Karriere',
        forArtists: 'Für Künstler',
        forListeners: 'Für Zuhörer',
        getStarted: 'Loslegen',
        faq: 'Häufig gestellte Fragen (FAQ)',
        updatesNews: 'Aktualisierungen & Nachrichten',
        usefulLinks: 'Nützliche Links',
        mobileApp: 'Kostenlose mobile App',
        symphoNixSubscriptions: 'SymphoNix Abonnements',
        premiumIndividual: 'Premium Individual',
        premiumDuo: 'Premium Duo',
        premiumFamily: 'Premium Family',
        premiumStudent: 'Premium Student',
        symphoNixFree: 'SymphoNix Free',
        showsToWatch: 'Sehenswerte Shows',
        topCharts: 'Top-Charts',
        all: 'Alles',
        music: 'Musik',
        profile: 'Profil',
        logout: 'Abmelden',
        allCatalog: 'Gesamter Katalog',
        search: 'Suche',
        bestMatch: 'Beste Übereinstimmung',
        songs: 'Lieder',
        artists: 'Künstler',
        albums: 'Alben',
        tracks: 'Titel',
        home: 'Startseite',
        library: 'Bibliothek',
        playlists: 'Wiederga...',
        likedTracks: 'Gefällte Titel',
        playlist: 'Wiedergabeliste',
        quantity: 'Anzahl',
        addTracks: 'Titel hinzufügen',
        removeSelectedTracks: 'Ausgewählte Titel entfernen',
        recommendedTracks: 'Empfohlene Titel',
        popularRecommendedTracks: 'Beliebte empfohlene Titel',
        recommendationsBasedOnAlbum: 'Empfehlungen basierend auf dem Album',
        track: 'Titel',
        recommendationsBasedOnTrack: 'Empfehlungen basierend auf dem Titel',
        addToPlaylist: 'Zur Playlist hinzufügen',
        goToAlbum: 'Zum Album gehen',
        popularTracks: 'Beliebte Titel',
        removeFromFavorites: 'Aus Favoriten entfernen',
        addToFavorites: 'Zu Favoriten hinzufügen',
        newForYou: 'Neu für Sie',
        newTracksForYou: 'Neue Titel für Sie',
        popularAlbums: 'Beliebte Alben',
        popularRadio: 'Beliebtes Radio',
        publicPlaylists: 'Öffentliche Playlists',
        rockTracks: 'Rock Titel',
        viral: 'Viral',
        rapTop: 'Rap Top',
        hipHopTop: 'Hip-hop Top',
        top50Ukraine: 'Top 50 Ukraine',
        top100World: 'Top 100 Weltweit',
        top50World: 'Top 50 Weltweit',
        topSongsWorld: 'Top Songs Weltweit',
        popularArtists: 'Beliebte Künstler',
        woman: 'Frau',
        man: 'Mann',
        nonBinary: 'Nicht-binär',
        preferNotToSay: 'Bevorzuge keine Angabe',
        other: 'Andere',

        // Month options
        january: 'Januar',
        february: 'Februar',
        march: 'März',
        april: 'April',
        may: 'Mai',
        june: 'Juni',
        july: 'Juli',
        august: 'August',
        september: 'September',
        october: 'Oktober',
        november: 'November',
        december: 'Dezember',

        // Country options
        ukraine: 'Ukraine',
        usa: 'USA',
        canada: 'Kanada',
        mexico: 'Mexiko',
        czechRepublic: 'Tschechische Republik',
        germany: 'Deutschland',
        topTracksThisMonth: 'Top-Tracks diesen Monat',
        onlyVisibleToYou: 'Nur für Sie sichtbar',
        northAmerica: 'Nordamerika',
        europe: 'Europa',



    }
};



export const getLanguageByCountry = (country: string) => {
    switch (country) {
        case 'США':
        case 'Канада':
        case 'Мексика':
            return 'en';
        case 'Чехія':
            return 'cz';
        case 'Німеччина':
            return 'de';
        default:
            return 'uk';
    }
};
