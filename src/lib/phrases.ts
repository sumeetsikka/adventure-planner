// Pre-translated common travel phrases keyed by country name.
// Each pack contains 12 essential phrases grouped into hello/food/navigation/emergency.

export interface Phrase {
  english: string;
  local: string;
  pronunciation?: string;
}

export interface PhrasePack {
  language: string;
  hello: Phrase[];      // 4 phrases: hello, goodbye, please, thanks
  food: Phrase[];       // 3 phrases: menu, water, bill
  navigation: Phrase[]; // 3 phrases: where is, how much, help
  emergency: Phrase[];  // 2 phrases: doctor, police
}

const PACKS: Record<string, PhrasePack> = {
  vietnam: {
    language: 'Vietnamese',
    hello: [
      { english: 'Hello', local: 'Xin chào', pronunciation: 'sin chow' },
      { english: 'Goodbye', local: 'Tạm biệt', pronunciation: 'tam byet' },
      { english: 'Please', local: 'Làm ơn', pronunciation: 'lam un' },
      { english: 'Thank you', local: 'Cảm ơn', pronunciation: 'kam un' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Cho tôi xem thực đơn', pronunciation: 'cho toy sem thuk dun' },
      { english: 'Water, please', local: 'Cho tôi nước', pronunciation: 'cho toy nook' },
      { english: 'The bill, please', local: 'Tính tiền', pronunciation: 'tin tien' },
    ],
    navigation: [
      { english: 'Where is…?', local: '… ở đâu?', pronunciation: 'uh dow' },
      { english: 'How much?', local: 'Bao nhiêu?', pronunciation: 'bow nyew' },
      { english: 'Help!', local: 'Cứu tôi!', pronunciation: 'koo toy' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Tôi cần bác sĩ', pronunciation: 'toy kun bak see' },
      { english: 'Call the police', local: 'Gọi cảnh sát', pronunciation: 'goy kanh sat' },
    ],
  },
  thailand: {
    language: 'Thai',
    hello: [
      { english: 'Hello', local: 'สวัสดี', pronunciation: 'sa-wat-dee' },
      { english: 'Goodbye', local: 'ลาก่อน', pronunciation: 'la-gawn' },
      { english: 'Please', local: 'กรุณา', pronunciation: 'ga-ru-na' },
      { english: 'Thank you', local: 'ขอบคุณ', pronunciation: 'kop-kun' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'ขอเมนูหน่อย', pronunciation: 'kor menu noi' },
      { english: 'Water, please', local: 'ขอน้ำ', pronunciation: 'kor nam' },
      { english: 'The bill, please', local: 'เช็คบิล', pronunciation: 'check bin' },
    ],
    navigation: [
      { english: 'Where is…?', local: '…อยู่ที่ไหน?', pronunciation: 'yu tee nai' },
      { english: 'How much?', local: 'เท่าไหร่?', pronunciation: 'tao-rai' },
      { english: 'Help!', local: 'ช่วยด้วย!', pronunciation: 'chuay duay' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'ผมต้องการหมอ', pronunciation: 'pom tong-gan mor' },
      { english: 'Call the police', local: 'เรียกตำรวจ', pronunciation: 'riak tam-ruat' },
    ],
  },
  japan: {
    language: 'Japanese',
    hello: [
      { english: 'Hello', local: 'こんにちは', pronunciation: 'konnichiwa' },
      { english: 'Goodbye', local: 'さようなら', pronunciation: 'sayonara' },
      { english: 'Please', local: 'お願いします', pronunciation: 'onegaishimasu' },
      { english: 'Thank you', local: 'ありがとう', pronunciation: 'arigatou' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'メニューをください', pronunciation: 'menyuu o kudasai' },
      { english: 'Water, please', local: 'お水をください', pronunciation: 'omizu o kudasai' },
      { english: 'The bill, please', local: 'お会計お願いします', pronunciation: 'okaikei onegaishimasu' },
    ],
    navigation: [
      { english: 'Where is…?', local: '…はどこですか?', pronunciation: 'wa doko desu ka' },
      { english: 'How much?', local: 'いくらですか?', pronunciation: 'ikura desu ka' },
      { english: 'Help!', local: '助けて!', pronunciation: 'tasukete' },
    ],
    emergency: [
      { english: 'I need a doctor', local: '医者が必要です', pronunciation: 'isha ga hitsuyou desu' },
      { english: 'Call the police', local: '警察を呼んでください', pronunciation: 'keisatsu o yonde kudasai' },
    ],
  },
  france: {
    language: 'French',
    hello: [
      { english: 'Hello', local: 'Bonjour', pronunciation: 'bon-zhoor' },
      { english: 'Goodbye', local: 'Au revoir', pronunciation: 'oh ruh-vwah' },
      { english: 'Please', local: "S'il vous plaît", pronunciation: 'seel voo play' },
      { english: 'Thank you', local: 'Merci', pronunciation: 'mehr-see' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'La carte, s’il vous plaît', pronunciation: 'la kart seel voo play' },
      { english: 'Water, please', local: 'De l’eau, s’il vous plaît', pronunciation: 'duh loh seel voo play' },
      { english: 'The bill, please', local: 'L’addition, s’il vous plaît', pronunciation: 'lah-dee-syon seel voo play' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Où est…?', pronunciation: 'oo ay' },
      { english: 'How much?', local: 'Combien?', pronunciation: 'kom-byan' },
      { english: 'Help!', local: 'Au secours!', pronunciation: 'oh suh-koor' },
    ],
    emergency: [
      { english: 'I need a doctor', local: "J'ai besoin d'un médecin", pronunciation: 'zhay buh-zwan dun med-san' },
      { english: 'Call the police', local: 'Appelez la police', pronunciation: 'ah-play la po-lees' },
    ],
  },
  italy: {
    language: 'Italian',
    hello: [
      { english: 'Hello', local: 'Ciao', pronunciation: 'chow' },
      { english: 'Goodbye', local: 'Arrivederci', pronunciation: 'ah-ree-veh-dehr-chee' },
      { english: 'Please', local: 'Per favore', pronunciation: 'pehr fa-voh-reh' },
      { english: 'Thank you', local: 'Grazie', pronunciation: 'grah-tsyeh' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Il menù, per favore', pronunciation: 'eel meh-noo pehr fa-voh-reh' },
      { english: 'Water, please', local: 'Acqua, per favore', pronunciation: 'ah-kwa pehr fa-voh-reh' },
      { english: 'The bill, please', local: 'Il conto, per favore', pronunciation: 'eel kon-toh pehr fa-voh-reh' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Dov’è…?', pronunciation: 'doh-veh' },
      { english: 'How much?', local: 'Quanto costa?', pronunciation: 'kwan-toh kos-ta' },
      { english: 'Help!', local: 'Aiuto!', pronunciation: 'ah-yoo-toh' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Ho bisogno di un medico', pronunciation: 'oh bee-zon-yo dee oon meh-dee-koh' },
      { english: 'Call the police', local: 'Chiamate la polizia', pronunciation: 'kya-ma-teh la po-lee-tsee-ah' },
    ],
  },
  spain: {
    language: 'Spanish',
    hello: [
      { english: 'Hello', local: 'Hola', pronunciation: 'oh-lah' },
      { english: 'Goodbye', local: 'Adiós', pronunciation: 'ah-dyos' },
      { english: 'Please', local: 'Por favor', pronunciation: 'por fa-vor' },
      { english: 'Thank you', local: 'Gracias', pronunciation: 'gra-syas' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'La carta, por favor', pronunciation: 'la kar-ta por fa-vor' },
      { english: 'Water, please', local: 'Agua, por favor', pronunciation: 'ah-gwa por fa-vor' },
      { english: 'The bill, please', local: 'La cuenta, por favor', pronunciation: 'la kwen-ta por fa-vor' },
    ],
    navigation: [
      { english: 'Where is…?', local: '¿Dónde está…?', pronunciation: 'don-deh es-ta' },
      { english: 'How much?', local: '¿Cuánto cuesta?', pronunciation: 'kwan-toh kwes-ta' },
      { english: 'Help!', local: '¡Ayuda!', pronunciation: 'ah-yoo-da' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Necesito un médico', pronunciation: 'neh-seh-see-toh oon meh-dee-koh' },
      { english: 'Call the police', local: 'Llame a la policía', pronunciation: 'ya-meh ah la po-lee-see-ah' },
    ],
  },
  mexico: {
    language: 'Spanish',
    hello: [
      { english: 'Hello', local: 'Hola', pronunciation: 'oh-lah' },
      { english: 'Goodbye', local: 'Adiós', pronunciation: 'ah-dyos' },
      { english: 'Please', local: 'Por favor', pronunciation: 'por fa-vor' },
      { english: 'Thank you', local: 'Gracias', pronunciation: 'gra-syas' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'El menú, por favor', pronunciation: 'el meh-noo por fa-vor' },
      { english: 'Water, please', local: 'Agua, por favor', pronunciation: 'ah-gwa por fa-vor' },
      { english: 'The bill, please', local: 'La cuenta, por favor', pronunciation: 'la kwen-ta por fa-vor' },
    ],
    navigation: [
      { english: 'Where is…?', local: '¿Dónde está…?', pronunciation: 'don-deh es-ta' },
      { english: 'How much?', local: '¿Cuánto cuesta?', pronunciation: 'kwan-toh kwes-ta' },
      { english: 'Help!', local: '¡Ayuda!', pronunciation: 'ah-yoo-da' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Necesito un doctor', pronunciation: 'neh-seh-see-toh oon dok-tor' },
      { english: 'Call the police', local: 'Llame a la policía', pronunciation: 'ya-meh ah la po-lee-see-ah' },
    ],
  },
  portugal: {
    language: 'Portuguese',
    hello: [
      { english: 'Hello', local: 'Olá', pronunciation: 'oh-lah' },
      { english: 'Goodbye', local: 'Adeus', pronunciation: 'ah-deush' },
      { english: 'Please', local: 'Por favor', pronunciation: 'poor fa-vor' },
      { english: 'Thank you', local: 'Obrigado', pronunciation: 'oh-bree-gah-doo' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'A ementa, por favor', pronunciation: 'ah eh-men-ta poor fa-vor' },
      { english: 'Water, please', local: 'Água, por favor', pronunciation: 'ah-gwa poor fa-vor' },
      { english: 'The bill, please', local: 'A conta, por favor', pronunciation: 'ah kon-ta poor fa-vor' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Onde fica…?', pronunciation: 'on-deh fee-ka' },
      { english: 'How much?', local: 'Quanto custa?', pronunciation: 'kwan-too koosh-ta' },
      { english: 'Help!', local: 'Socorro!', pronunciation: 'soo-koh-hoo' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Preciso de um médico', pronunciation: 'preh-see-zoo deh oom meh-dee-koo' },
      { english: 'Call the police', local: 'Chame a polícia', pronunciation: 'sha-meh ah po-lee-see-ah' },
    ],
  },
  germany: {
    language: 'German',
    hello: [
      { english: 'Hello', local: 'Hallo', pronunciation: 'hah-loh' },
      { english: 'Goodbye', local: 'Auf Wiedersehen', pronunciation: 'owf vee-der-zayn' },
      { english: 'Please', local: 'Bitte', pronunciation: 'bit-tuh' },
      { english: 'Thank you', local: 'Danke', pronunciation: 'dahn-kuh' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Die Speisekarte, bitte', pronunciation: 'dee shpai-zeh-kar-tuh bit-tuh' },
      { english: 'Water, please', local: 'Wasser, bitte', pronunciation: 'vah-ser bit-tuh' },
      { english: 'The bill, please', local: 'Die Rechnung, bitte', pronunciation: 'dee rekh-nung bit-tuh' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Wo ist…?', pronunciation: 'voh ist' },
      { english: 'How much?', local: 'Wie viel kostet das?', pronunciation: 'vee feel kos-tet das' },
      { english: 'Help!', local: 'Hilfe!', pronunciation: 'hil-fuh' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Ich brauche einen Arzt', pronunciation: 'ikh brow-khuh ai-nen artst' },
      { english: 'Call the police', local: 'Rufen Sie die Polizei', pronunciation: 'roo-fen zee dee po-li-tsai' },
    ],
  },
  netherlands: {
    language: 'Dutch',
    hello: [
      { english: 'Hello', local: 'Hallo', pronunciation: 'hah-loh' },
      { english: 'Goodbye', local: 'Tot ziens', pronunciation: 'tot zeens' },
      { english: 'Please', local: 'Alstublieft', pronunciation: 'als-too-bleeft' },
      { english: 'Thank you', local: 'Dank u wel', pronunciation: 'dank oo vel' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'De menukaart, alstublieft', pronunciation: 'duh meh-noo-kart als-too-bleeft' },
      { english: 'Water, please', local: 'Water, alstublieft', pronunciation: 'vah-ter als-too-bleeft' },
      { english: 'The bill, please', local: 'De rekening, alstublieft', pronunciation: 'duh ray-keh-ning als-too-bleeft' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Waar is…?', pronunciation: 'vahr is' },
      { english: 'How much?', local: 'Hoeveel kost het?', pronunciation: 'hoo-veyl kost het' },
      { english: 'Help!', local: 'Help!', pronunciation: 'help' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Ik heb een dokter nodig', pronunciation: 'ik hep en dok-ter no-dikh' },
      { english: 'Call the police', local: 'Bel de politie', pronunciation: 'bel duh po-lee-tsee' },
    ],
  },
  greece: {
    language: 'Greek',
    hello: [
      { english: 'Hello', local: 'Γειά σου', pronunciation: 'yah soo' },
      { english: 'Goodbye', local: 'Αντίο', pronunciation: 'an-dee-oh' },
      { english: 'Please', local: 'Παρακαλώ', pronunciation: 'pa-ra-ka-lo' },
      { english: 'Thank you', local: 'Ευχαριστώ', pronunciation: 'ef-ha-ris-toh' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Τον κατάλογο, παρακαλώ', pronunciation: 'ton ka-ta-lo-go pa-ra-ka-lo' },
      { english: 'Water, please', local: 'Νερό, παρακαλώ', pronunciation: 'neh-ro pa-ra-ka-lo' },
      { english: 'The bill, please', local: 'Τον λογαριασμό, παρακαλώ', pronunciation: 'ton lo-ga-ria-zmo pa-ra-ka-lo' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Πού είναι…?', pronunciation: 'poo ee-neh' },
      { english: 'How much?', local: 'Πόσο κάνει;', pronunciation: 'po-so ka-nee' },
      { english: 'Help!', local: 'Βοήθεια!', pronunciation: 'vo-ee-thya' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Χρειάζομαι γιατρό', pronunciation: 'hri-a-zo-meh ya-tro' },
      { english: 'Call the police', local: 'Καλέστε την αστυνομία', pronunciation: 'ka-le-steh teen as-tee-no-mee-a' },
    ],
  },
  indonesia: {
    language: 'Indonesian',
    hello: [
      { english: 'Hello', local: 'Halo', pronunciation: 'hah-loh' },
      { english: 'Goodbye', local: 'Selamat tinggal', pronunciation: 'seh-la-mat ting-gal' },
      { english: 'Please', local: 'Tolong', pronunciation: 'toh-long' },
      { english: 'Thank you', local: 'Terima kasih', pronunciation: 'teh-ree-ma ka-see' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Tolong menunya', pronunciation: 'toh-long meh-noo-nya' },
      { english: 'Water, please', local: 'Tolong air', pronunciation: 'toh-long ah-eer' },
      { english: 'The bill, please', local: 'Minta bon', pronunciation: 'min-ta bon' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Di mana…?', pronunciation: 'dee ma-na' },
      { english: 'How much?', local: 'Berapa harganya?', pronunciation: 'beh-ra-pa har-ga-nya' },
      { english: 'Help!', local: 'Tolong!', pronunciation: 'toh-long' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Saya butuh dokter', pronunciation: 'sa-ya boo-tooh dok-ter' },
      { english: 'Call the police', local: 'Panggil polisi', pronunciation: 'pang-gil po-lee-see' },
    ],
  },
  egypt: {
    language: 'Arabic',
    hello: [
      { english: 'Hello', local: 'مرحبا', pronunciation: 'marhaba' },
      { english: 'Goodbye', local: 'مع السلامة', pronunciation: "ma'a as-salama" },
      { english: 'Please', local: 'من فضلك', pronunciation: 'min fadlak' },
      { english: 'Thank you', local: 'شكرا', pronunciation: 'shukran' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'القائمة من فضلك', pronunciation: "al-qa'ima min fadlak" },
      { english: 'Water, please', local: 'ماء من فضلك', pronunciation: "ma'a min fadlak" },
      { english: 'The bill, please', local: 'الحساب من فضلك', pronunciation: 'al-hisab min fadlak' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'أين…؟', pronunciation: 'ayna' },
      { english: 'How much?', local: 'بكام؟', pronunciation: 'bi-kam' },
      { english: 'Help!', local: 'النجدة!', pronunciation: 'an-najda' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'أحتاج طبيب', pronunciation: 'ahtaj tabib' },
      { english: 'Call the police', local: 'اتصل بالشرطة', pronunciation: 'ittasil bish-shurta' },
    ],
  },
  morocco: {
    language: 'Arabic',
    hello: [
      { english: 'Hello', local: 'السلام عليكم', pronunciation: 'as-salamu alaykum' },
      { english: 'Goodbye', local: 'بسلامة', pronunciation: 'bislama' },
      { english: 'Please', local: 'عافاك', pronunciation: 'afak' },
      { english: 'Thank you', local: 'شكرا', pronunciation: 'shukran' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'القائمة عافاك', pronunciation: "al-qa'ima afak" },
      { english: 'Water, please', local: 'الماء عافاك', pronunciation: "al-ma'a afak" },
      { english: 'The bill, please', local: 'الحساب عافاك', pronunciation: 'al-hisab afak' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'فين…؟', pronunciation: 'feen' },
      { english: 'How much?', local: 'بشحال؟', pronunciation: 'beshhal' },
      { english: 'Help!', local: 'عتقوني!', pronunciation: 'atquni' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'كنحتاج طبيب', pronunciation: 'kanahtaj tabib' },
      { english: 'Call the police', local: 'عيط للبوليس', pronunciation: 'ayyit lal-bulis' },
    ],
  },
  turkey: {
    language: 'Turkish',
    hello: [
      { english: 'Hello', local: 'Merhaba', pronunciation: 'mer-ha-ba' },
      { english: 'Goodbye', local: 'Hoşça kal', pronunciation: 'hosh-cha kal' },
      { english: 'Please', local: 'Lütfen', pronunciation: 'loot-fen' },
      { english: 'Thank you', local: 'Teşekkür ederim', pronunciation: 'teh-shek-koor eh-deh-rim' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Menü, lütfen', pronunciation: 'meh-noo loot-fen' },
      { english: 'Water, please', local: 'Su, lütfen', pronunciation: 'soo loot-fen' },
      { english: 'The bill, please', local: 'Hesap, lütfen', pronunciation: 'heh-sap loot-fen' },
    ],
    navigation: [
      { english: 'Where is…?', local: '… nerede?', pronunciation: 'neh-reh-deh' },
      { english: 'How much?', local: 'Ne kadar?', pronunciation: 'neh ka-dar' },
      { english: 'Help!', local: 'İmdat!', pronunciation: 'im-dat' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Doktora ihtiyacım var', pronunciation: 'dok-to-ra ih-tee-ya-jum var' },
      { english: 'Call the police', local: 'Polis çağırın', pronunciation: 'po-lis cha-uh-run' },
    ],
  },
  iceland: {
    language: 'Icelandic',
    hello: [
      { english: 'Hello', local: 'Halló', pronunciation: 'hal-loh' },
      { english: 'Goodbye', local: 'Bless', pronunciation: 'bless' },
      { english: 'Please', local: 'Vinsamlegast', pronunciation: 'vin-sam-leh-gast' },
      { english: 'Thank you', local: 'Takk', pronunciation: 'tahk' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Matseðilinn, takk', pronunciation: 'mat-se-thil-in tahk' },
      { english: 'Water, please', local: 'Vatn, takk', pronunciation: 'vatn tahk' },
      { english: 'The bill, please', local: 'Reikninginn, takk', pronunciation: 'rake-ning-in tahk' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Hvar er…?', pronunciation: 'kvar ehr' },
      { english: 'How much?', local: 'Hvað kostar þetta?', pronunciation: 'kvath kos-tar theh-ta' },
      { english: 'Help!', local: 'Hjálp!', pronunciation: 'hyalp' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Ég þarf lækni', pronunciation: 'yeg tharf lake-nee' },
      { english: 'Call the police', local: 'Hringdu á lögregluna', pronunciation: 'hring-du ow lurg-reg-lu-na' },
    ],
  },
  norway: {
    language: 'Norwegian',
    hello: [
      { english: 'Hello', local: 'Hei', pronunciation: 'hay' },
      { english: 'Goodbye', local: 'Ha det', pronunciation: 'ha deh' },
      { english: 'Please', local: 'Vær så snill', pronunciation: 'vair sho snil' },
      { english: 'Thank you', local: 'Takk', pronunciation: 'tahk' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Menyen, takk', pronunciation: 'meh-noo-en tahk' },
      { english: 'Water, please', local: 'Vann, takk', pronunciation: 'vahn tahk' },
      { english: 'The bill, please', local: 'Regningen, takk', pronunciation: 'rye-ning-en tahk' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Hvor er…?', pronunciation: 'voor air' },
      { english: 'How much?', local: 'Hvor mye koster det?', pronunciation: 'voor mee-eh kos-ter deh' },
      { english: 'Help!', local: 'Hjelp!', pronunciation: 'yelp' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Jeg trenger en lege', pronunciation: 'yai treng-er en leh-geh' },
      { english: 'Call the police', local: 'Ring politiet', pronunciation: 'ring po-li-tee-eh' },
    ],
  },
  sweden: {
    language: 'Swedish',
    hello: [
      { english: 'Hello', local: 'Hej', pronunciation: 'hay' },
      { english: 'Goodbye', local: 'Hej då', pronunciation: 'hay doh' },
      { english: 'Please', local: 'Snälla', pronunciation: 'snel-la' },
      { english: 'Thank you', local: 'Tack', pronunciation: 'tahk' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Menyn, tack', pronunciation: 'meh-noon tahk' },
      { english: 'Water, please', local: 'Vatten, tack', pronunciation: 'vat-ten tahk' },
      { english: 'The bill, please', local: 'Notan, tack', pronunciation: 'noh-tan tahk' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Var är…?', pronunciation: 'var air' },
      { english: 'How much?', local: 'Hur mycket kostar det?', pronunciation: 'hoor mee-keh kos-tar deh' },
      { english: 'Help!', local: 'Hjälp!', pronunciation: 'yelp' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Jag behöver en läkare', pronunciation: 'yag beh-her-ver en lay-ka-reh' },
      { english: 'Call the police', local: 'Ring polisen', pronunciation: 'ring po-lee-sen' },
    ],
  },
  croatia: {
    language: 'Croatian',
    hello: [
      { english: 'Hello', local: 'Bok', pronunciation: 'bohk' },
      { english: 'Goodbye', local: 'Doviđenja', pronunciation: 'do-vee-jen-ya' },
      { english: 'Please', local: 'Molim', pronunciation: 'mo-leem' },
      { english: 'Thank you', local: 'Hvala', pronunciation: 'hva-la' },
    ],
    food: [
      { english: "I'd like the menu, please", local: 'Jelovnik, molim', pronunciation: 'yeh-lov-nik mo-leem' },
      { english: 'Water, please', local: 'Vodu, molim', pronunciation: 'vo-doo mo-leem' },
      { english: 'The bill, please', local: 'Račun, molim', pronunciation: 'ra-choon mo-leem' },
    ],
    navigation: [
      { english: 'Where is…?', local: 'Gdje je…?', pronunciation: 'gdyeh yeh' },
      { english: 'How much?', local: 'Koliko košta?', pronunciation: 'ko-lee-ko kosh-ta' },
      { english: 'Help!', local: 'Upomoć!', pronunciation: 'oo-po-moch' },
    ],
    emergency: [
      { english: 'I need a doctor', local: 'Trebam liječnika', pronunciation: 'treh-bam lyech-nee-ka' },
      { english: 'Call the police', local: 'Zovite policiju', pronunciation: 'zo-vee-teh po-li-tsee-yu' },
    ],
  },
};

function normalize(country: string): string {
  return country
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ');
}

export function getPhrases(country: string): PhrasePack | null {
  if (!country) return null;
  const norm = normalize(country);

  // Try direct lookup
  if (PACKS[norm]) return PACKS[norm];

  // Aliases / partial matches
  const aliases: Record<string, string> = {
    'the netherlands': 'netherlands',
    holland: 'netherlands',
    'czech republic': '', // skip
    nippon: 'japan',
    hellas: 'greece',
  };
  if (aliases[norm] && PACKS[aliases[norm]]) return PACKS[aliases[norm]];

  // Substring match (e.g. "Vietnam, Hanoi")
  for (const key of Object.keys(PACKS)) {
    if (norm.includes(key)) return PACKS[key];
  }

  return null;
}
