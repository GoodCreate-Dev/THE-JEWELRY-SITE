// All copy for the site, per language. Pages and components read from here only.
// Based on the 2026-10-16 hearing sheet: museum + event venue, official bookings from 1 Nov 2026.

export type Lang = "ja" | "en";
export type PageKey = "home" | "about" | "spaces" | "events" | "visit" | "news" | "contact";

export const PAGES: PageKey[] = ["home", "about", "spaces", "events", "visit", "news", "contact"];

/** Path of a page in a language, e.g. path("en", "about") → "/en/about/". */
export function path(lang: Lang, page: PageKey): string {
  const root = lang === "ja" ? "/" : "/en/";
  return page === "home" ? root : `${root}${page}/`;
}

// Set when the site is served from a sub-path (GitHub Pages: /the-jewelry).
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE}${p}`;

export const IG_URL = "https://www.instagram.com/thejewelry_official/";
export const COMPANY_URL = "https://symphonicsourire.com/";
export const PRIVACY_URL = "https://symphonicsourire.com/privacypolicy.html";
export const MAP_EMBED = "https://www.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%B8%82%E4%BD%8F%E4%B9%8B%E6%B1%9F%E5%8C%BA%E5%8D%97%E6%B8%AF%E5%8C%972-5-20&z=15&output=embed";

type Hero = { kicker: string; title: string; lead: string; image: string };
type Space = { no: string; name: string; en: string; capacity: string; body: string; uses: string[]; image: string };

/** One train route chart: each path runs from `from` through its legs to Cosmosquare Station. */
export type Route = { caption: string; paths: { from: string; legs: { line: string; min: string; color: string; to?: string }[] }[] };

const LINE = { midosuji: "#e5171f", chuo: "#029a4a", nankai: "#5b4aae", jr: "#1b1b1b" };
export const PARKING_URL = "https://times-info.net/P27-osaka/C125/park-detail-BUK0078037/";

export type Content = {
  meta: Record<PageKey, { title: string; description: string }>;
  nav: { labels: Record<PageKey, string>; cta: string; menu: string; close: string };
  notice: { text: string; link: string };
  common: { guests: string; more: string; pending: string };
  footer: { address: string; tagline: string; company: string; privacy: string; rights: string };
  home: {
    kicker: string;
    title: [string, string];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    caption: string;
    statementLabel: string;
    statement: string;
    statementBody: string;
    figures: { value: string; unit: string; label: string }[];
    spacesTitle: string;
    spacesLead: string;
    window: { kicker: string; title: string; body: string };
    relaunch: { date: string; title: string; body: string; cta: string };
    programmeTitle: string;
    visitTitle: string;
    visitBody: string;
    newsTitle: string;
    contactTitle: string;
    contactBody: string;
  };
  about: { hero: Hero; chapters: { no: string; title: string; body: string; image: string }[]; quote: string };
  spaces: { hero: Hero; spaces: Space[]; combineTitle: string; combineBody: string; usesLabel: string; capacityLabel: string };
  events: {
    hero: Hero;
    types: { no: string; title: string; en: string; body: string }[];
    flowTitle: string;
    flow: { no: string; title: string; body: string }[];
  };
  visit: {
    hero: Hero;
    hoursTitle: string;
    hours: string;
    hoursNote: string;
    addressTitle: string;
    address: string[];
    trainsTitle: string;
    trains: string[];
    timesTitle: string;
    times: { from: string; time: string }[];
    parkingTitle: string;
    parking: string;
    parkingLink: string;
    parkingAtc: string;
    routesTitle: string;
    window: { title: string; body: string };
    routes: Route[];
    routeEnd: { station: string; walk: string; note: string };
  };
  news: { hero: Hero; items: { date: string; tag: string; title: string; body: string }[]; igTitle: string; igNote: string; follow: string };
  contact: {
    hero: Hero;
    intro: string;
    dmTitle: string;
    dmBody: string;
    form: {
      type: string;
      types: string[];
      company: string;
      name: string;
      email: string;
      tel: string;
      date: string;
      datePh: string;
      guests: string;
      guestsPh: string;
      message: string;
      agree: [string, string, string];
      submit: string;
      required: string;
      sending: string;
      sent: string;
      failed: string;
    };
  };
};

const IMG = (n: string) => asset(`/images/${n}`);

const ja: Content = {
  meta: {
    home: { title: "THE JEWELRY｜大阪ベイエリアのミュージアム＆イベントスペース", description: "博物館として生まれたドーム型の展示施設。2026年11月1日より、催事・展示のご依頼を正式に受け付けます。" },
    about: { title: "施設について｜THE JEWELRY", description: "博物館として誕生した、大阪ベイエリアのドーム型展示施設 THE JEWELRY について。" },
    spaces: { title: "スペース｜THE JEWELRY", description: "ドーム、外周部、エントランス館内。目的と規模にあわせた三つの空間。" },
    events: { title: "催事・展示｜THE JEWELRY", description: "展覧会、ブランドイベント、レセプション、催事。ご利用の流れ。" },
    visit: { title: "ご来館案内｜THE JEWELRY", description: "開館時間、アクセス、所要時間、駐車場のご案内。" },
    news: { title: "お知らせ｜THE JEWELRY", description: "THE JEWELRY からのお知らせと公式Instagram。" },
    contact: { title: "お問い合わせ｜THE JEWELRY", description: "催事・展示のご相談は、フォームまたは公式InstagramのDMで承ります。" },
  },
  nav: {
    labels: { home: "トップ", about: "施設について", spaces: "スペース", events: "催事・展示", visit: "ご来館", news: "お知らせ", contact: "お問い合わせ" },
    cta: "催事・展示のご相談",
    menu: "メニュー",
    close: "閉じる",
  },
  notice: { text: "2026年11月1日より、催事・展示のご依頼を正式に受け付けます。", link: "ご相談はこちら" },
  common: { guests: "名", more: "詳しく見る", pending: "※ 詳細は確認中（仮）" },
  footer: {
    address: "〒559-0034 大阪市住之江区南港北2-5-20",
    tagline: "Museum & Event Space, Osaka Bay",
    company: "運営会社",
    privacy: "プライバシーポリシー",
    rights: "© Symphonic Sourire Co., Ltd.",
  },
  home: {
    kicker: "Museum & Event Space ・ Osaka Bay",
    title: ["ジュエリー、", "再起動。"],
    lead: "博物館として生まれたドームが、あなたの展示と催事のために、扉をひらきます。",
    ctaPrimary: "催事・展示のご相談",
    ctaSecondary: "スペースを見る",
    caption: "THE JEWELRY ― 光をまとうドーム。大阪ベイエリア。",
    statementLabel: "Our Story",
    statement: "ミュージアムとして生まれたこの場所は、表現と出会いのための、新しい舞台へ。",
    statementBody: "大阪ベイエリアに建つドーム型の展示施設。展覧会、アートインスタレーションから、ブランド発表会、レセプションまで。光をまとう空間が、特別な一日を演出します。",
    figures: [
      { value: "10,000", unit: "名", label: "最大収容人数" },
      { value: "3", unit: "空間", label: "目的に合わせたスペース" },
      { value: "30", unit: "分", label: "大阪駅・新大阪駅から" },
    ],
    spacesTitle: "三つの空間",
    spacesLead: "単独でも、組み合わせても。催事の規模と目的にあわせてお選びいただけます。",
    window: {
      kicker: "Osaka Bay",
      title: "海に浮かぶ、光のドーム。",
      body: "大阪湾の水辺に佇むTHE JEWELRY。昼は空を映し、夜は光をまとう、ベイエリアの新しいランドマークです。",
    },
    relaunch: {
      date: "11.01",
      title: "催事・展示のご依頼、正式受付を開始します。",
      body: "日程・規模・内容がまだ決まっていなくても大丈夫です。会場のご見学を含め、まずはお気軽にご相談ください。",
      cta: "ご相談フォームへ",
    },
    programmeTitle: "ご利用いただける催事",
    visitTitle: "ご来館案内",
    visitBody: "コスモスクエア駅から徒歩約10分。大阪駅・新大阪駅から約30分、関西国際空港から約40分。",
    newsTitle: "お知らせ",
    contactTitle: "特別な一日の、ご相談を。",
    contactBody: "主催者さま・出展者さまからのご相談は、フォームまたは公式InstagramのDMで承ります。",
  },
  about: {
    hero: { kicker: "About", title: "施設について", lead: "博物館として生まれた、光のドーム。", image: IMG("dome-1.jpg") },
    chapters: [
      { no: "I", title: "博物館として生まれた建築", body: "THE JEWELRY は、建築上は博物館として誕生したドーム型の展示施設です。展示のために設計された空間は、作品や商品を美しく見せ、訪れる人の記憶に残る体験をつくります。", image: IMG("dome-3.jpg") },
      { no: "II", title: "光をまとうドーム", body: "日が沈むと、ドームはゆっくりと輝きはじめます。ライトアップによる演出は、展示やレセプションに、ここでしか生まれない特別な雰囲気をもたらします。", image: IMG("dome-2.jpg") },
      { no: "III", title: "世界へひらかれた大阪ベイエリア", body: "大阪IRをはじめ、数々のエンターテイメントが予定されている大阪ベイエリア。THE JEWELRYは、このエリアを盛り上げるイベント会場＆ミュージアムです。国内外から人が集まるこの場所で、新しい表現と出会いが始まります。", image: IMG("dome-5.jpg") },
    ],
    quote: "表現と出会いのための、新しい舞台へ。",
  },
  spaces: {
    hero: { kicker: "Spaces", title: "スペース", lead: "目的と規模にあわせて選べる、三つの空間。", image: IMG("dome-3.jpg") },
    usesLabel: "主な用途",
    capacityLabel: "収容人数",
    spaces: [
      { no: "Pl. 01", name: "ドーム", en: "The Dome", capacity: "3,000", body: "施設の象徴である円形の展示空間。光の演出とともに、没入型の展示や発表会に。", uses: ["展覧会・インスタレーション", "ブランド発表会", "ライブ・パフォーマンス"], image: IMG("dome-3.jpg") },
      { no: "Pl. 02", name: "外周部", en: "Outer Area", capacity: "10,000", body: "海へひらけた広大な屋外空間。夜景を背景に、大規模な催事やマーケットに。", uses: ["催事・マーケット", "フェスティバル", "野外展示"], image: IMG("dome-4.jpg") },
      { no: "Pl. 03", name: "エントランス館内", en: "Entrance Hall", capacity: "300", body: "落ち着いた館内空間。小規模な展示、レセプション、プライベートイベントに。", uses: ["小規模展示", "レセプション", "記者発表"], image: IMG("f-entrance.jpg") },
    ],
    combineTitle: "空間を組み合わせて",
    combineBody: "ドームでの展示と外周部でのレセプションなど、複数の空間を組み合わせたご利用も可能です。内容に合わせてご提案いたします。",
  },
  events: {
    hero: { kicker: "Exhibitions & Events", title: "催事・展示", lead: "ミュージアムとしての空間で、表現を、特別な体験に。", image: IMG("f-concert.jpg") },
    types: [
      { no: "01", title: "展覧会・アート展示", en: "Exhibitions", body: "企画展、アートインスタレーション、写真展。ミュージアムとして設計された空間を活かした展示に。" },
      { no: "02", title: "ブランドイベント", en: "Brand events", body: "新作発表会、ポップアップ、メディア向け内覧会。ブランドの世界観を、印象に残る舞台で。" },
      { no: "03", title: "レセプション・パーティー", en: "Receptions", body: "周年記念、企業パーティー、ガラディナー。ライトアップされた夜のドームを貸切で。" },
      { no: "04", title: "催事・マーケット", en: "Fairs & markets", body: "物産展、見本市、マルシェ。最大10,000名規模の屋外空間に対応します。" },
    ],
    flowTitle: "ご利用の流れ",
    flow: [
      { no: "01", title: "ご相談", body: "フォームまたはInstagramのDMより、催事の内容をお知らせください。" },
      { no: "02", title: "ご連絡", body: "担当者よりご連絡し、日程・規模・ご要望を伺います。" },
      { no: "03", title: "ご見学・お打ち合わせ", body: "会場をご案内し、空間の使い方や条件をご相談します。" },
      { no: "04", title: "ご契約・開催", body: "内容が決まりましたら、開催に向けて準備を進めます。" },
    ],
  },
  visit: {
    hero: { kicker: "Visit", title: "ご来館案内", lead: "大阪ベイエリアを盛り上げる、イベント会場＆ミュージアム。", image: IMG("dome-5.jpg") },
    hoursTitle: "開館時間",
    hours: "催事・展示の開催時に開館",
    hoursNote: "開館日・時間は、各催事のお知らせをご確認ください。",
    addressTitle: "所在地",
    address: ["〒559-0034", "大阪市住之江区南港北2-5-20"],
    trainsTitle: "最寄り駅",
    trains: ["Osaka Metro 中央線「コスモスクエア駅」徒歩約10分", "ニュートラム「トレードセンター前駅」徒歩約10分"],
    timesTitle: "所要時間",
    times: [
      { from: "大阪駅・新大阪駅", time: "約30分" },
      { from: "ユニバーサル・スタジオ・ジャパン", time: "約25分" },
      { from: "関西国際空港", time: "約40分" },
    ],
    parkingTitle: "駐車場",
    parking: "最寄りの駐車場（タイムズ）をご利用ください。混雑時はATC駐車場もご利用いただけます。",
    parkingLink: "最寄りの駐車場情報（タイムズ）",
    parkingAtc: "ATC駐車場から THE JEWELRY（徒歩約8分）",
    routesTitle: "電車でのアクセス",
    window: { title: "大阪湾のほとり、南港へ。", body: "コスモスクエア駅から徒歩約10分。大阪IRをはじめ、数々のエンターテイメントが予定されている大阪ベイエリアにあります。" },
    routes: [
      {
        caption: "大阪駅・新大阪駅から",
        paths: [
          { from: "新大阪駅", legs: [{ line: "大阪メトロ御堂筋線", min: "10分", color: LINE.midosuji, to: "本町駅" }, { line: "大阪メトロ中央線", min: "14分", color: LINE.chuo }] },
          { from: "大阪駅", legs: [{ line: "JR環状線", min: "8分", color: LINE.jr, to: "弁天町駅" }, { line: "大阪メトロ中央線", min: "8分", color: LINE.chuo }] },
        ],
      },
      {
        caption: "関西国際空港から",
        paths: [
          { from: "関西空港", legs: [{ line: "南海特急ラピート", min: "40分", color: LINE.nankai, to: "なんば駅" }, { line: "大阪メトロ御堂筋線", min: "4分", color: LINE.midosuji, to: "本町駅" }, { line: "大阪メトロ中央線", min: "14分", color: LINE.chuo }] },
          { from: "関西空港", legs: [{ line: "JR関空快速", min: "69分", color: LINE.jr, to: "弁天町駅" }, { line: "大阪メトロ中央線", min: "8分", color: LINE.chuo }] },
        ],
      },
    ],
    routeEnd: { station: "コスモスクエア駅", walk: "徒歩 約10分", note: "コスモスクエア駅から夢洲駅（大阪IR予定地）へは1駅・約5分です。" },
  },
  news: {
    hero: { kicker: "News", title: "お知らせ", lead: "THE JEWELRY からの最新情報。", image: IMG("dome-2.jpg") },
    items: [
      { date: "2026.11.01", tag: "Info", title: "催事・展示のご依頼の受付を開始しました", body: "本日より、催事・展示の主催者さまからのご依頼を正式に受け付けます。" },
      { date: "2026.10.31", tag: "Info", title: "公式サイトをリニューアルしました", body: "THE JEWELRY 公式サイトを全面リニューアルしました。" },
    ],
    igTitle: "Instagram",
    igNote: "催事・展示の最新の様子は、公式Instagramでご覧いただけます。",
    follow: "フォローする",
  },
  contact: {
    hero: { kicker: "Contact", title: "お問い合わせ", lead: "催事・展示のご相談をお待ちしています。", image: IMG("dome-1.jpg") },
    intro: "主催者さま・出展者さまからのご相談を承ります。日程や内容が未定でもお気軽にご連絡ください。担当者よりご連絡いたします。",
    dmTitle: "InstagramのDMでも",
    dmBody: "公式Instagramのダイレクトメッセージでも、ご相談を受け付けています。",
    form: {
      type: "ご相談内容",
      types: ["催事・イベント", "展示・展覧会", "取材・メディア", "その他"],
      company: "会社名・団体名",
      name: "お名前",
      email: "メールアドレス",
      tel: "電話番号",
      date: "ご希望時期",
      datePh: "例）2027年春ごろ",
      guests: "想定人数",
      guestsPh: "例）500名",
      message: "ご相談内容",
      agree: ["", "プライバシーポリシー", "に同意する"],
      submit: "送信する",
      required: "必須",
      sending: "送信しています…",
      sent: "お問い合わせありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。",
      failed: "送信できませんでした。時間をおいて再度お試しいただくか、Instagram DMでご連絡ください。",
    },
  },
};

const en: Content = {
  meta: {
    home: { title: "THE JEWELRY | Museum & Event Space, Osaka Bay", description: "A dome-shaped exhibition hall built as a museum. From 1 November 2026, officially accepting proposals for events and exhibitions." },
    about: { title: "About | THE JEWELRY", description: "About THE JEWELRY, a dome-shaped exhibition hall on Osaka Bay, built as a museum." },
    spaces: { title: "Spaces | THE JEWELRY", description: "The Dome, the Outer Area and the Entrance Hall: three spaces for every scale." },
    events: { title: "Exhibitions & Events | THE JEWELRY", description: "Exhibitions, brand events, receptions and fairs, and how to book." },
    visit: { title: "Visit | THE JEWELRY", description: "Opening hours, address, travel times and parking." },
    news: { title: "News | THE JEWELRY", description: "News from THE JEWELRY and our official Instagram." },
    contact: { title: "Contact | THE JEWELRY", description: "Propose an event or exhibition via the form or Instagram DM." },
  },
  nav: {
    labels: { home: "Home", about: "About", spaces: "Spaces", events: "Exhibitions & Events", visit: "Visit", news: "News", contact: "Contact" },
    cta: "Host an event",
    menu: "Menu",
    close: "Close",
  },
  notice: { text: "From 1 November 2026, we officially welcome proposals for events and exhibitions.", link: "Get in touch" },
  common: { guests: "guests", more: "Discover", pending: "* Details being confirmed" },
  footer: {
    address: "2-5-20 Nanko-kita, Suminoe-ku, Osaka 559-0034",
    tagline: "Museum & Event Space, Osaka Bay",
    company: "Company",
    privacy: "Privacy policy",
    rights: "© Symphonic Sourire Co., Ltd.",
  },
  home: {
    kicker: "Museum & Event Space · Osaka Bay",
    title: ["The Jewelry,", "restarted."],
    lead: "A dome born as a museum now opens its doors to your exhibitions and events.",
    ctaPrimary: "Host an event",
    ctaSecondary: "Explore the spaces",
    caption: "THE JEWELRY — a dome wrapped in light. Osaka Bay Area.",
    statementLabel: "Our Story",
    statement: "Born as a museum, now a new stage for expression and encounters.",
    statementBody: "A dome-shaped exhibition hall on the Osaka Bay Area. From exhibitions and art installations to brand launches and receptions, a space wrapped in light sets the scene for a special day.",
    figures: [
      { value: "10,000", unit: "", label: "Maximum capacity" },
      { value: "3", unit: "", label: "Distinct spaces" },
      { value: "30", unit: "min", label: "From Osaka / Shin-Osaka" },
    ],
    spacesTitle: "Three spaces",
    spacesLead: "Used alone or together, chosen to suit the scale and purpose of your event.",
    window: {
      kicker: "Osaka Bay",
      title: "A dome of light on the water.",
      body: "Set on the edge of Osaka Bay, THE JEWELRY reflects the sky by day and glows by night: a new landmark for the Bay Area.",
    },
    relaunch: {
      date: "11.01",
      title: "We now officially welcome events and exhibitions.",
      body: "No need to have dates, size or details fixed yet. Get in touch, and we can arrange a site visit too.",
      cta: "Go to the enquiry form",
    },
    programmeTitle: "What you can host",
    visitTitle: "Plan your visit",
    visitBody: "A 10-minute walk from Cosmosquare Station. About 30 minutes from Osaka and Shin-Osaka stations, 40 minutes from Kansai International Airport.",
    newsTitle: "News",
    contactTitle: "Let’s plan your special day.",
    contactBody: "Organisers and exhibitors can reach us through the form or by Instagram DM.",
  },
  about: {
    hero: { kicker: "About", title: "About", lead: "A dome of light, born as a museum.", image: IMG("dome-1.jpg") },
    chapters: [
      { no: "I", title: "Architecture built as a museum", body: "THE JEWELRY is a dome-shaped exhibition hall registered as a museum. Designed for display, its spaces present works and products at their best and create experiences people remember.", image: IMG("dome-3.jpg") },
      { no: "II", title: "A dome wrapped in light", body: "As the sun sets, the dome slowly begins to glow. The illumination gives exhibitions and receptions an atmosphere found nowhere else.", image: IMG("dome-2.jpg") },
      { no: "III", title: "Osaka Bay, open to the world", body: "The Osaka Bay Area is where Osaka IR and many other entertainment projects are planned. THE JEWELRY is an event venue and museum bringing this area to life, a place where people from Japan and abroad meet new expression.", image: IMG("dome-5.jpg") },
    ],
    quote: "A new stage for expression and encounters.",
  },
  spaces: {
    hero: { kicker: "Spaces", title: "Spaces", lead: "Three spaces for every scale and purpose.", image: IMG("dome-3.jpg") },
    usesLabel: "Ideal for",
    capacityLabel: "Capacity",
    spaces: [
      { no: "Pl. 01", name: "The Dome", en: "The Dome", capacity: "3,000", body: "Our signature circular hall. With lighting effects, ideal for immersive exhibitions and launches.", uses: ["Exhibitions & installations", "Brand launches", "Live performances"], image: IMG("dome-3.jpg") },
      { no: "Pl. 02", name: "Outer Area", en: "Outer Area", capacity: "10,000", body: "A vast open-air space facing the sea, with the night view as a backdrop for large-scale events and markets.", uses: ["Fairs & markets", "Festivals", "Outdoor exhibitions"], image: IMG("dome-4.jpg") },
      { no: "Pl. 03", name: "Entrance Hall", en: "Entrance Hall", capacity: "300", body: "A calm indoor space for small exhibitions, receptions and private events.", uses: ["Small exhibitions", "Receptions", "Press events"], image: IMG("f-entrance.jpg") },
    ],
    combineTitle: "Combine the spaces",
    combineBody: "Spaces can be combined, for example an exhibition in the Dome with a reception in the Outer Area. We will propose the best layout for your event.",
  },
  events: {
    hero: { kicker: "Exhibitions & Events", title: "Exhibitions & Events", lead: "Turn your work into an unforgettable experience, in a space built as a museum.", image: IMG("f-concert.jpg") },
    types: [
      { no: "01", title: "Exhibitions", en: "Art & culture", body: "Curated shows, art installations and photography exhibitions, in a space designed as a museum." },
      { no: "02", title: "Brand events", en: "Launches & pop-ups", body: "Product launches, pop-up stores and press previews: your brand’s world on a stage people remember." },
      { no: "03", title: "Receptions", en: "Parties & galas", body: "Anniversaries, corporate parties and gala dinners, with the illuminated dome to yourselves at night." },
      { no: "04", title: "Fairs & markets", en: "Large-scale events", body: "Regional fairs, trade shows and markets, with outdoor space for up to 10,000 guests." },
    ],
    flowTitle: "How it works",
    flow: [
      { no: "01", title: "Enquire", body: "Tell us about your event through the form or Instagram DM." },
      { no: "02", title: "We reply", body: "Our team contacts you to discuss dates, scale and requirements." },
      { no: "03", title: "Site visit", body: "We show you around and talk through layouts and terms." },
      { no: "04", title: "Confirm & host", body: "Once everything is agreed, we prepare together for the day." },
    ],
  },
  visit: {
    hero: { kicker: "Visit", title: "Plan your visit", lead: "An event venue and museum bringing the Osaka Bay Area to life.", image: IMG("dome-5.jpg") },
    hoursTitle: "Opening hours",
    hours: "Open during events and exhibitions",
    hoursNote: "Please check each event’s announcement for dates and times.",
    addressTitle: "Address",
    address: ["2-5-20 Nanko-kita, Suminoe-ku,", "Osaka 559-0034, Japan"],
    trainsTitle: "Nearest stations",
    trains: ["10 min walk from Cosmosquare Station (Osaka Metro Chuo Line)", "10 min walk from Trade Center-mae Station (New Tram)"],
    timesTitle: "Travel times",
    times: [
      { from: "Osaka / Shin-Osaka Station", time: "approx. 30 min" },
      { from: "Universal Studios Japan", time: "approx. 25 min" },
      { from: "Kansai International Airport", time: "approx. 40 min" },
    ],
    parkingTitle: "Parking",
    parking: "Please use the nearest car park (Times). When busy, the ATC car park is also available.",
    parkingLink: "Nearest car park (Times)",
    parkingAtc: "From the ATC car park to THE JEWELRY (approx. 8 min walk)",
    routesTitle: "By train",
    window: { title: "On the waterfront at Nanko, Osaka Bay.", body: "A 10-minute walk from Cosmosquare Station, in the Osaka Bay Area, where Osaka IR and many other entertainment projects are planned." },
    routes: [
      {
        caption: "From Osaka / Shin-Osaka Station",
        paths: [
          { from: "Shin-Osaka Sta.", legs: [{ line: "Osaka Metro Midosuji Line", min: "10 min", color: LINE.midosuji, to: "Hommachi Sta." }, { line: "Osaka Metro Chuo Line", min: "14 min", color: LINE.chuo }] },
          { from: "Osaka Sta.", legs: [{ line: "JR Loop Line", min: "8 min", color: LINE.jr, to: "Bentencho Sta." }, { line: "Osaka Metro Chuo Line", min: "8 min", color: LINE.chuo }] },
        ],
      },
      {
        caption: "From Kansai International Airport",
        paths: [
          { from: "Kansai Airport", legs: [{ line: "Nankai Limited Express Rapi:t", min: "40 min", color: LINE.nankai, to: "Namba Sta." }, { line: "Osaka Metro Midosuji Line", min: "4 min", color: LINE.midosuji, to: "Hommachi Sta." }, { line: "Osaka Metro Chuo Line", min: "14 min", color: LINE.chuo }] },
          { from: "Kansai Airport", legs: [{ line: "JR Kansai Airport Rapid", min: "69 min", color: LINE.jr, to: "Bentencho Sta." }, { line: "Osaka Metro Chuo Line", min: "8 min", color: LINE.chuo }] },
        ],
      },
    ],
    routeEnd: { station: "Cosmosquare Sta.", walk: "approx. 10 min walk", note: "Yumeshima Station (planned site of Osaka IR) is one stop, about 5 minutes, from Cosmosquare." },
  },
  news: {
    hero: { kicker: "News", title: "News", lead: "The latest from THE JEWELRY.", image: IMG("dome-2.jpg") },
    items: [
      { date: "2026.11.01", tag: "Info", title: "We are now accepting event and exhibition proposals", body: "From today, we officially welcome proposals from event and exhibition organisers." },
      { date: "2026.10.31", tag: "Info", title: "Our website has been renewed", body: "The official THE JEWELRY website has been fully renewed." },
    ],
    igTitle: "Instagram",
    igNote: "See our latest events and exhibitions on our official Instagram.",
    follow: "Follow",
  },
  contact: {
    hero: { kicker: "Contact", title: "Contact", lead: "We look forward to hearing about your event.", image: IMG("dome-1.jpg") },
    intro: "We welcome enquiries from organisers and exhibitors, even if your dates or details are not fixed yet. Our team will get back to you.",
    dmTitle: "Or message us on Instagram",
    dmBody: "We also accept enquiries by direct message on our official Instagram.",
    form: {
      type: "Enquiry type",
      types: ["Event", "Exhibition", "Press & media", "Other"],
      company: "Company / organisation",
      name: "Name",
      email: "Email",
      tel: "Phone",
      date: "Preferred timing",
      datePh: "e.g. spring 2027",
      guests: "Expected guests",
      guestsPh: "e.g. 500",
      message: "Message",
      agree: ["I agree to the ", "privacy policy", ""],
      submit: "Send",
      required: "Required",
      sending: "Sending…",
      sent: "Thank you for your enquiry. Our team will review it and get back to you.",
      failed: "Your message could not be sent. Please try again later, or reach us by Instagram DM.",
    },
  },
};

export const content: Record<Lang, Content> = { ja, en };
