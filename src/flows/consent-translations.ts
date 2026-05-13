// DEMO TRANSLATIONS — review with Perfios legal team before production use.
//
// Source of truth for ConsenTick consent-notice text in all 22 DPDP §6(7)
// scheduled languages + English. Currently fully translated for:
//   - English
//   - हिन्दी (Hindi)
//   - தமிழ் (Tamil)
// Other languages fall back to English with a visible "translation pending" hint.
//
// Translations were drafted by Opus and need a native-speaker QA pass.

export interface ConsentI18n {
  welcome: string                  // "Welcome {name},"
  privacyHeading: string           // Long privacy paragraph
  reviewRights: string             // "You have the right to review, change, or withdraw..."
  purposeAccessHint: string        // "To access the detailed purpose(s)..."
  essentialTab: string             // "Essential Terms*"
  optionalTab: string              // "Optional Terms"
  essentialSubtitle: string        // "Required for compliance, security, and essential business operations"
  optionalSubtitle: string         // "Collected only with explicit user consent..."
  expiryLabel: string              // "Consent Expiry Date:"
  confirmCheckbox: string          // 'I hereby confirm that by selecting "Agree to All Terms"...'
  knowPartners: string             // "To know about our data partners, Kindly"
  viewRights: string               // "To view your rights,"
  contactSupport: string           // "To exercise any of these rights, please contact us at"
  clickHere: string                // "Click Here"
  agreeEssentials: string          // "Agree Essentials"
  agreeAll: string                 // "Agree All Terms"
  vendorListLabel: string          // "To be used by following vendors:"
  exitDialogTitle: string          // "Are you sure?"
  exitDialogBody: string           // "Exiting without mandatory consent will halt the journey."
  exitConfirm: string              // "Yes, Exit"
  exitCancel: string               // "Go Back"
  essentialDialogTitle: string     // "Agree to Essential Terms?"
  essentialDialogBody: string      // "By agreeing to only essential terms..."
  essentialDialogQuestion: string  // "Are you sure you want to go ahead with Essential terms only?"
  yes: string                      // "Yes"
  no: string                       // "No"
  poweredBy: string                // "Powered by"
  consentIdLabel: string           // "Consent ID"
  selectLanguage: string           // "Select Language"
  languageHint: string             // "22 scheduled languages (DPDP §6(7))"
  thankYouTitle: string            // "Thank You"
  thankYouBody: string             // "Your consent is taken and consent ID is {id}"
  redirecting: string              // "We are redirecting you ...."
  translationPending: string       // "Translation pending — showing English"
}

const ENGLISH: ConsentI18n = {
  welcome: 'Welcome {name},',
  privacyHeading:
    'We value your privacy and are committed to being transparent about how we handle your data. As per data protection laws, we need your consent to collect, process, and use your personal data for the purposes mentioned below.',
  reviewRights:
    'You have the right to review, change, or withdraw your consent anytime, as per legal guidelines.',
  purposeAccessHint:
    'To access the detailed purpose(s) associated with each data point, please click on the respective data point provided below.',
  essentialTab: 'Essential Terms*',
  optionalTab: 'Optional Terms',
  essentialSubtitle: 'Required for compliance, security, and essential business operations',
  optionalSubtitle:
    'Collected only with explicit user consent for personalisation, analytics, and optional services',
  expiryLabel: 'Consent Expiry Date:',
  confirmCheckbox:
    'I hereby confirm that by selecting "Agree to All Terms", I accept both essential and optional terms.',
  knowPartners: 'To know about our data partners, Kindly',
  viewRights: 'To view your rights,',
  contactSupport: 'To exercise any of these rights, please contact us at',
  clickHere: 'Click Here',
  agreeEssentials: 'Agree Essentials',
  agreeAll: 'Agree All Terms',
  vendorListLabel: 'To be used by following vendors:',
  exitDialogTitle: 'Are you sure?',
  exitDialogBody: 'Exiting without mandatory consent will halt the journey.',
  exitConfirm: 'Yes, Exit',
  exitCancel: 'Go Back',
  essentialDialogTitle: 'Agree to Essential Terms?',
  essentialDialogBody:
    'By agreeing to only essential terms, you may lose access to certain features, services, or benefits. Ensure you understand the implications before proceeding.',
  essentialDialogQuestion: 'Are you sure you want to go ahead with Essential terms only?',
  yes: 'Yes',
  no: 'No',
  poweredBy: 'Powered by',
  consentIdLabel: 'Consent ID',
  selectLanguage: 'Select Language',
  languageHint: '22 scheduled languages (DPDP §6(7))',
  thankYouTitle: 'Thank You',
  thankYouBody: 'Your consent is taken and consent ID is {id}',
  redirecting: 'We are redirecting you ....',
  translationPending: '',  // English never shows this hint
}

const HINDI: ConsentI18n = {
  welcome: 'स्वागत है {name},',
  privacyHeading:
    'हम आपकी निजता का सम्मान करते हैं और आपके डेटा के उपयोग के बारे में पारदर्शी रहने के लिए प्रतिबद्ध हैं। डेटा सुरक्षा कानूनों के अनुसार, नीचे उल्लेखित उद्देश्यों के लिए आपके व्यक्तिगत डेटा को एकत्र करने, संसाधित करने और उपयोग करने हेतु हमें आपकी सहमति की आवश्यकता है।',
  reviewRights:
    'कानूनी दिशानिर्देशों के अनुसार, आप किसी भी समय अपनी सहमति की समीक्षा कर सकते हैं, बदल सकते हैं, या वापस ले सकते हैं।',
  purposeAccessHint:
    'प्रत्येक डेटा बिंदु से जुड़े विस्तृत उद्देश्य(उद्देश्यों) तक पहुँचने के लिए, कृपया नीचे दिए गए संबंधित डेटा बिंदु पर क्लिक करें।',
  essentialTab: 'आवश्यक शर्तें*',
  optionalTab: 'वैकल्पिक शर्तें',
  essentialSubtitle: 'अनुपालन, सुरक्षा और आवश्यक व्यावसायिक संचालन के लिए आवश्यक',
  optionalSubtitle:
    'केवल स्पष्ट उपयोगकर्ता सहमति से वैयक्तिकरण, विश्लेषण और वैकल्पिक सेवाओं के लिए संग्रहित',
  expiryLabel: 'सहमति समाप्ति तिथि:',
  confirmCheckbox:
    'मैं पुष्टि करता हूँ कि "सभी शर्तें स्वीकारें" का चयन करके, मैं आवश्यक और वैकल्पिक दोनों शर्तों को स्वीकार करता हूँ।',
  knowPartners: 'हमारे डेटा पार्टनरों के बारे में जानने के लिए, कृपया',
  viewRights: 'अपने अधिकारों को देखने के लिए,',
  contactSupport: 'इन अधिकारों का प्रयोग करने के लिए, कृपया हमसे संपर्क करें:',
  clickHere: 'यहाँ क्लिक करें',
  agreeEssentials: 'आवश्यक स्वीकारें',
  agreeAll: 'सभी शर्तें स्वीकारें',
  vendorListLabel: 'इन विक्रेताओं द्वारा उपयोग किया जाएगा:',
  exitDialogTitle: 'क्या आप सुनिश्चित हैं?',
  exitDialogBody: 'अनिवार्य सहमति के बिना बाहर निकलने से यात्रा रुक जाएगी।',
  exitConfirm: 'हाँ, बाहर निकलें',
  exitCancel: 'वापस जाएं',
  essentialDialogTitle: 'आवश्यक शर्तें स्वीकारें?',
  essentialDialogBody:
    'केवल आवश्यक शर्तों को स्वीकार करने से, आप कुछ सुविधाओं, सेवाओं या लाभों तक पहुँच खो सकते हैं। आगे बढ़ने से पहले निहितार्थ समझ लें।',
  essentialDialogQuestion: 'क्या आप वाकई केवल आवश्यक शर्तों के साथ आगे बढ़ना चाहते हैं?',
  yes: 'हाँ',
  no: 'नहीं',
  poweredBy: 'द्वारा संचालित',
  consentIdLabel: 'सहमति आईडी',
  selectLanguage: 'भाषा चुनें',
  languageHint: '22 अनुसूचित भाषाएँ (DPDP §6(7))',
  thankYouTitle: 'धन्यवाद',
  thankYouBody: 'आपकी सहमति प्राप्त हो गई है और सहमति आईडी है {id}',
  redirecting: 'आपको रीडायरेक्ट किया जा रहा है ....',
  translationPending: 'अनुवाद लंबित — अंग्रेज़ी दिखाई जा रही है',
}

const TAMIL: ConsentI18n = {
  welcome: 'வரவேற்கிறோம் {name},',
  privacyHeading:
    'உங்கள் தனியுரிமையை நாங்கள் மதிக்கிறோம் மற்றும் உங்கள் தரவை எவ்வாறு கையாள்கிறோம் என்பதில் வெளிப்படையாக இருக்க உறுதியளிக்கிறோம். தரவுப் பாதுகாப்புச் சட்டங்களின்படி, கீழே குறிப்பிடப்பட்டுள்ள நோக்கங்களுக்காக உங்கள் தனிப்பட்ட தரவை சேகரிக்க, செயலாக்க, மற்றும் பயன்படுத்த உங்கள் ஒப்புதல் தேவை.',
  reviewRights:
    'சட்ட வழிகாட்டுதல்களின்படி, நீங்கள் எந்த நேரத்திலும் உங்கள் ஒப்புதலை மறுபரிசீலனை செய்ய, மாற்ற, அல்லது திரும்பப் பெற உரிமை உள்ளது.',
  purposeAccessHint:
    'ஒவ்வொரு தரவுப் புள்ளியுடன் தொடர்புடைய விரிவான நோக்கம்(ங்கள்) காண, கீழே வழங்கப்பட்ட சம்பந்தப்பட்ட தரவு புள்ளியில் சொடுக்கவும்.',
  essentialTab: 'அத்தியாவசிய நிபந்தனைகள்*',
  optionalTab: 'விருப்ப நிபந்தனைகள்',
  essentialSubtitle: 'இணக்கம், பாதுகாப்பு மற்றும் அத்தியாவசிய வணிக நடவடிக்கைகளுக்குத் தேவை',
  optionalSubtitle:
    'தனிப்பயனாக்கம், பகுப்பாய்வு மற்றும் விருப்ப சேவைகளுக்கு வெளிப்படையான பயனர் ஒப்புதலுடன் மட்டுமே சேகரிக்கப்படுகிறது',
  expiryLabel: 'ஒப்புதல் காலாவதி தேதி:',
  confirmCheckbox:
    '"அனைத்து நிபந்தனைகளையும் ஏற்கிறேன்" என்பதைத் தேர்வு செய்வதன் மூலம், அத்தியாவசிய மற்றும் விருப்ப நிபந்தனைகள் இரண்டையும் ஏற்றுக்கொள்கிறேன் என உறுதிசெய்கிறேன்.',
  knowPartners: 'எங்கள் தரவுப் பங்காளர்களைப் பற்றி அறிய,',
  viewRights: 'உங்கள் உரிமைகளைக் காண,',
  contactSupport: 'இந்த உரிமைகளில் எதையும் பயன்படுத்த, தயவுசெய்து எங்களைத் தொடர்பு கொள்ளவும்:',
  clickHere: 'இங்கே சொடுக்கவும்',
  agreeEssentials: 'அத்தியாவசியங்களை ஏற்க',
  agreeAll: 'அனைத்து நிபந்தனைகளையும் ஏற்க',
  vendorListLabel: 'பின்வரும் விற்பனையாளர்களால் பயன்படுத்தப்படும்:',
  exitDialogTitle: 'உறுதியாக உள்ளீர்களா?',
  exitDialogBody: 'கட்டாய ஒப்புதல் இல்லாமல் வெளியேறுவது பயணத்தை நிறுத்தும்.',
  exitConfirm: 'ஆம், வெளியேறு',
  exitCancel: 'திரும்பு',
  essentialDialogTitle: 'அத்தியாவசிய நிபந்தனைகளை ஏற்கிறீர்களா?',
  essentialDialogBody:
    'அத்தியாவசிய நிபந்தனைகளை மட்டும் ஏற்றுக்கொள்வதன் மூலம், சில அம்சங்கள், சேவைகள், அல்லது நன்மைகள் கிடைக்காமல் போகலாம். தொடர்வதற்கு முன் தாக்கங்களைப் புரிந்து கொள்ளுங்கள்.',
  essentialDialogQuestion: 'அத்தியாவசிய நிபந்தனைகளுடன் மட்டும் தொடர விரும்புகிறீர்கள் என்பது உறுதியா?',
  yes: 'ஆம்',
  no: 'இல்லை',
  poweredBy: 'இயக்குபவர்',
  consentIdLabel: 'ஒப்புதல் ஐடி',
  selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  languageHint: '22 அட்டவணைப்படுத்தப்பட்ட மொழிகள் (DPDP §6(7))',
  thankYouTitle: 'நன்றி',
  thankYouBody: 'உங்கள் ஒப்புதல் பெறப்பட்டது மற்றும் ஒப்புதல் ஐடி {id}',
  redirecting: 'நீங்கள் திருப்பி அனுப்பப்படுகிறீர்கள் ....',
  translationPending: 'மொழிபெயர்ப்பு நிலுவையில் — ஆங்கிலம் காட்டப்படுகிறது',
}

/** Languages with full translations. Picker shows all 23 but only these render natively. */
export const FULLY_TRANSLATED_LANGUAGES = ['English', 'हिन्दी', 'தமிழ்'] as const

/**
 * All 22 DPDP §6(7) Eighth Schedule languages + English.
 * Display name on the left (script-native), language code on the right.
 * Languages not in FULLY_TRANSLATED_LANGUAGES fall back to English at runtime.
 */
export const ALL_LANGUAGES: { name: string; code: string }[] = [
  { name: 'English',      code: 'en' },
  { name: 'हिन्दी',         code: 'hi' },
  { name: 'தமிழ்',          code: 'ta' },
  { name: 'తెలుగు',         code: 'te' },
  { name: 'বাংলা',          code: 'bn' },
  { name: 'मराठी',          code: 'mr' },
  { name: 'ಕನ್ನಡ',           code: 'kn' },
  { name: 'മലയാളം',         code: 'ml' },
  { name: 'ਪੰਜਾਬੀ',          code: 'pa' },
  { name: 'ગુજરાતી',         code: 'gu' },
  { name: 'ଓଡ଼ିଆ',           code: 'or' },
  { name: 'اردو',           code: 'ur' },
  { name: 'অসমীয়া',         code: 'as' },
  { name: 'मैथिली',         code: 'mai' },
  { name: 'डोगरी',          code: 'doi' },
  { name: 'कोंकणी',         code: 'kok' },
  { name: 'سنڌي',           code: 'sd' },
  { name: 'ᱥᱟᱱᱛᱟᱲᱤ',        code: 'sat' },
  { name: 'कॉशुर',          code: 'ks' },
  { name: 'नेपाली',         code: 'ne' },
  { name: 'ꯃꯩꯇꯩ ꯂꯣꯟ',        code: 'mni' },
  { name: 'बर\'',            code: 'brx' },
  { name: 'संस्कृतम्',       code: 'sa' },
]

const TRANSLATIONS: Record<string, ConsentI18n> = {
  English: ENGLISH,
  'हिन्दी': HINDI,
  'தமிழ்': TAMIL,
}

/** Returns the full translation dictionary for a language. Falls back to English. */
export function getLanguage(name: string): ConsentI18n {
  return TRANSLATIONS[name] ?? ENGLISH
}

/** Returns whether a language has a real translation (not a fallback). */
export function isFullyTranslated(name: string): boolean {
  return name in TRANSLATIONS
}

/**
 * Translate a key with optional variable interpolation (e.g. {name}, {id}).
 *
 * Example:
 *   t('हिन्दी', 'welcome', { name: 'रोमेश' }) → 'स्वागत है रोमेश,'
 */
export function t(lang: string, key: keyof ConsentI18n, vars: Record<string, string> = {}): string {
  const dict = getLanguage(lang)
  let text = dict[key]
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
  }
  return text
}
