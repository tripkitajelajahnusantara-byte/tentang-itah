import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---

export interface Admin {
  id: string;
  username: string;
  password?: string;
  created_at?: string;
}

export interface Homepage {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  logo_1: string;
  logo_2: string;
  logo_3: string;
  cta_text: string;
}

export interface About {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

export interface Language {
  id: string; // e.g. 'ngaju'
  name: string;
  description: string;
  region: string;
}

export interface Vocabulary {
  id: string;
  language_id: string;
  word: string;
  meaning: string;
  audio_url?: string;
  created_at?: string;
}

export interface ArtsCulture {
  id: string;
  category: string; // Tari, Musik, Alat Musik, Pakaian Adat, Kerajinan, Kesenian Lainnya
  name: string;
  description: string;
  origin_region: string;
  meaning: string;
  image_url?: string;
  created_at?: string;
}

export interface Tradition {
  id: string;
  name: string;
  description: string;
  location: string;
  purpose: string;
  meaning: string;
  image_url?: string;
  created_at?: string;
}

export interface Folklore {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  audio_url?: string;
  region: string;
  created_at?: string;
}

export interface Region {
  id: string; // e.g. 'palangkaraya'
  name: string;
  description: string;
  image_url?: string;
  location_info: string;
}

export interface WordOfTheDay {
  id: string;
  word: string;
  meaning: string;
  language_name: string;
  audio_url?: string;
  display_date: string; // YYYY-MM-DD
  created_at?: string;
}

export interface Quiz {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  score: number;
  explanation?: string;
  category?: string;
  created_at?: string;
}

export interface Contribution {
  id: string;
  sender_name: string;
  sender_email: string;
  category: string;
  title: string;
  description: string;
  image_url?: string;
  audio_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface Gallery {
  id: string;
  title: string;
  type: 'image' | 'video';
  media_url: string;
  description?: string;
  created_at?: string;
}

export interface Contact {
  id: number;
  email: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  dekranasda_kalteng?: string;
  address?: string;
  phone?: string;
  about_us?: string;
}

export interface ActiveSession {
  id: string;
  username: string;
  created_at: string;
  expires_at: string;
}

export interface DatabaseSchema {
  admins: Admin[];
  homepage: Homepage;
  about: About;
  languages: Language[];
  vocabularies: Vocabulary[];
  arts_culture: ArtsCulture[];
  traditions: Tradition[];
  folklore: Folklore[];
  regions: Region[];
  word_of_the_day: WordOfTheDay[];
  quizzes: Quiz[];
  contributions: Contribution[];
  gallery: Gallery[];
  contact: Contact;
  active_sessions?: ActiveSession[];
}

// --- DUAL MODE CONFIGURATION ---

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// File database path
const LOCAL_DB_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_PATH = path.join(LOCAL_DB_DIR, 'db.json');

// --- SEED DATA ---

const initialSeedData: DatabaseSchema = {
  admins: [
    {
      id: 'admin-id-1',
      username: 'admin@tentangitah.id',
      password: 'Kalimantancerah123#',
    },
  ],
  homepage: {
    id: 1,
    hero_title: 'Jelajahi Pesona Budaya Kalimantan Tengah',
    hero_subtitle: 'Platform edukasi digital untuk mengenal, mempelajari, dan melestarikan ragam bahasa, tradisi, seni, serta cerita rakyat Kalimantan Tengah.',
    hero_image: '/images/hero-banner.jpg',
    logo_1: '/images/logo-kalteng.png',
    logo_2: '/images/logo-itah.png',
    logo_3: '/images/logo-tutwuri.png',
    cta_text: 'Jelajahi Budaya',
  },
  about: {
    id: 1,
    title: 'Mengenal Tentang Itah',
    content: 'Tentang Itah (berarti "Tentang Kita" dalam Bahasa Dayak Ngaju) adalah wadah pelestarian warisan leluhur Kalimantan Tengah secara digital. Berawal dari keprihatinan atas mulai memudarnya pengetahuan generasi muda terhadap budaya daerah, website ini dirancang untuk mendokumentasikan serta mengedukasi masyarakat luas mengenai keragaman bahasa, tari-tarian, cerita rakyat, adat istiadat, dan nilai filosofis luhur seperti "Falsafah Huma Betang" (hidup rukun berdampingan dalam perbedaan). Kami berharap platform ini dapat menjembatani nilai masa lalu dengan teknologi masa kini agar keunikan budaya Bumi Tambun Bungai tidak lekang oleh waktu.',
    image_url: '/images/about-illustration.jpg',
  },
  languages: [
    {
      id: 'ngaju',
      name: 'Dayak Ngaju',
      description: 'Bahasa Dayak Ngaju merupakan salah satu bahasa daerah yang paling luas dituturkan di sepanjang aliran sungai besar di Kalimantan Tengah, seperti Sungai Kahayan dan Kapuas. Bahasa ini menjadi lingua franca di kalangan berbagai sub-suku Dayak di wilayah ini.',
      region: 'Hampir seluruh wilayah Kalimantan Tengah, khususnya sepanjang Sungai Kahayan, Kapuas, dan Rungan',
    },
    {
      id: 'bakumpai',
      name: 'Dayak Bakumpai',
      description: 'Bahasa Bakumpai dituturkan oleh suku Dayak Bakumpai yang mayoritas beragama Islam. Secara linguistik, bahasa ini berkerabat dekat dengan Bahasa Ngaju namun memiliki serapan kosakata bahasa Banjar dan Arab yang lebih menonjol.',
      region: 'Kabupaten Barito Kuala (Kalsel), Barito Selatan, Barito Utara, Murung Raya, dan Kapuas (Kalteng)',
    },
    {
      id: 'maanyan',
      name: 'Dayak Ma’anyan',
      description: 'Bahasa Ma’anyan dituturkan oleh Suku Dayak Ma’anyan di bagian timur Kalimantan Tengah. Bahasa ini memiliki keunikan sejarah karena para ahli bahasa menemukan bahwa kosakata dasarnya berkerabat dekat dengan Bahasa Malagasi yang dituturkan di Madagaskar.',
      region: 'Kabupaten Barito Timur dan Barito Selatan',
    },
  ],
  vocabularies: [
    { id: 'v1', language_id: 'ngaju', word: 'Itah', meaning: 'Kita', audio_url: '/audio/itah.mp3' },
    { id: 'v2', language_id: 'ngaju', word: 'Kueh', meaning: 'Mana', audio_url: '/audio/kueh.mp3' },
    { id: 'v3', language_id: 'ngaju', word: 'Danum', meaning: 'Air', audio_url: '/audio/danum.mp3' },
    { id: 'v4', language_id: 'ngaju', word: 'Kuman', meaning: 'Makan', audio_url: '/audio/kuman.mp3' },
    { id: 'v5', language_id: 'ngaju', word: 'Mihop', meaning: 'Minum', audio_url: '/audio/mihop.mp3' },
    { id: 'v6', language_id: 'bakumpai', word: 'Penda', meaning: 'Bawah', audio_url: '/audio/penda.mp3' },
    { id: 'v7', language_id: 'bakumpai', word: 'Danum', meaning: 'Air', audio_url: '/audio/danum-bakumpai.mp3' },
    { id: 'v8', language_id: 'maanyan', word: 'Kakah', meaning: 'Kakek', audio_url: '/audio/kakah.mp3' },
    { id: 'v9', language_id: 'maanyan', word: 'Nupi', meaning: 'Mimpi', audio_url: '/audio/nupi.mp3' },
  ],
  arts_culture: [
    {
      id: 'art-1',
      category: 'Tari',
      name: 'Tari Mandau',
      description: 'Tari Mandau merupakan tarian teatrikal yang menggambarkan kegagahan prajurit Dayak dalam mempertahankan tanah air mereka. Tari ini menggunakan senjata tradisional Mandau (pedang khas Dayak) dan Talawang (perisai kayu), diperagakan dengan gerakan yang dinamis, akrobatis, dan penuh konsentrasi tinggi.',
      origin_region: 'Kabupaten Gunung Mas & Barito',
      meaning: 'Melambangkan simbol keberanian, kehormatan, patriotisme, serta kesiapan dalam melindungi komunitas dari ancaman marabahaya.',
      image_url: '/images/tari-mandau.jpg',
    },
    {
      id: 'art-2',
      category: 'Tari',
      name: 'Tari Tambun dan Bungai',
      description: 'Tari kelompok yang ditarikan oleh penari wanita dengan gerakan gemulai namun tegas. Tarian ini mengangkat kisah kepahlawanan Tambun dan Bungai, dua bersaudara yang gagah berani di daerah Gunung Mas yang sangat berjasa melawan musuh dan melindungi warga.',
      origin_region: 'Kabupaten Gunung Mas',
      meaning: 'Melambangkan persatuan, rasa terima kasih, kepahlawanan, serta gotong royong dalam kedamaian.',
      image_url: '/images/tari-tambun.jpg',
    },
    {
      id: 'art-3',
      category: 'Alat Musik',
      name: 'Garantung',
      description: 'Garantung adalah alat musik pukul tradisional sejenis gong kuningan khas Kalimantan Tengah. Musik Garantung mendominasi instrumen gamelan Dayak (Kangkanung) dan sangat penting dalam mengiringi ritual adat serta menyambut tamu agung.',
      origin_region: 'Hampir seluruh wilayah Kalimantan Tengah',
      meaning: 'Garantung tidak sekadar alat musik, namun juga benda sakral bernilai adat tinggi yang melambangkan status sosial dan sarana komunikasi spiritual dengan leluhur.',
      image_url: '/images/garantung.jpg',
    },
    {
      id: 'art-4',
      category: 'Pakaian Adat',
      name: 'Sangkarut',
      description: 'Rompi tradisional suku Dayak Ngaju yang terbuat dari serat kulit kayu tanaman nyamu (Siren). Rompi ini biasanya dihiasi dengan lukisan motif tradisional Dayak (seperti naga atau burung enggang) serta ornamen kerang, gigi binatang hutan, atau manik-manik.',
      origin_region: 'Katingan & Kapuas',
      meaning: 'Melambangkan perlindungan fisik maupun spiritual bagi pemakainya. Secara historis digunakan sebagai baju perang yang dipercaya memiliki kekuatan magis kekebalan.',
      image_url: '/images/sangkarut.jpg',
    },
  ],
  traditions: [
    {
      id: 'trad-1',
      name: 'Upacara Tiwah',
      description: 'Tiwah adalah upacara kematian tingkat akhir pemeluk kepercayaan Kaharingan pada suku Dayak Ngaju. Ritual ini dilakukan untuk mengantarkan tulang-belulang orang yang telah meninggal dari kuburan sementara menuju Sandung (rumah kecil berukir di atas tiang kayu ulin) agar jiwanya mencapai Lewu Tatau (surga).',
      location: 'Kabupaten Gunung Mas, Kapuas, Katingan',
      purpose: 'Menyucikan jiwa orang yang telah mati agar terbebas dari sisa keduniawian dan dapat bersatu dengan Sang Pencipta di Lewu Tatau, sekaligus melepaskan keluarga dari masa berkabung.',
      meaning: 'Simbol bakti anak/keluarga kepada leluhur, gotong royong (karena ritual ini membutuhkan biaya besar dan bantuan seluruh desa), serta kerukunan antar umat manusia.',
      image_url: '/images/tiwah.jpg',
    },
    {
      id: 'trad-2',
      name: 'Manyipet',
      description: 'Manyipet adalah tradisi atau keahlian berburu menggunakan Sipet (sumpit tradisional). Sipet terbuat dari kayu ulin bulat sepanjang 1.5 - 2.5 meter dengan lubang di tengahnya. Senjatanya berupa anak sumpit kecil (damek) yang ujungnya dibubuhi racun getah pohon ipuh.',
      location: 'Hampir seluruh wilayah pedalaman Kalimantan Tengah',
      purpose: 'Dahulu digunakan sebagai alat berburu hewan hutan serta senjata senyap dalam pertempuran. Saat ini dilestarikan sebagai cabang olahraga tradisional utama di festival budaya.',
      meaning: 'Melambangkan keakuratan, ketenangan, fokus pikiran, kesabaran, serta kemandirian bertahan hidup selaras dengan alam hutan belantara.',
      image_url: '/images/manyipet.jpg',
    },
  ],
  folklore: [
    {
      id: 'folk-1',
      title: 'Legenda Bukit Tangkiling',
      content: 'Dahulu kala di tepi Sungai Kahayan, hiduplah seorang pemuda tampan bernama Tangkiling. Ia bertualang ke daerah pesisir dan bekerja pada saudagar kaya. Di sana ia jatuh cinta dan menikahi seorang wanita cantik jelita tanpa mengetahui bahwa wanita tersebut sebenarnya adalah ibunya kandung yang telah lama berpisah sejak ia kecil. Sang ibu akhirnya mengenali bekas luka di kepala Tangkiling, namun Tangkiling keras kepala tidak mempercayainya dan tetap memaksa melaksanakan perkawinan. Dewa murka atas pelanggaran adat pamali besar tersebut. Petir menyambar hebat dan hujan badai turun berhari-hari. Tangkiling, sang istri/ibu, dan seluruh kapal perkawinan mereka perlahan mengeras dan berubah menjadi gugusan perbukitan batu raksasa. Bukit itulah yang kini dikenal dengan nama Bukit Tangkiling, pengingat bagi generasi berikutnya agar senantiasa menghormati orang tua dan adat perkawinan leluhur.',
      image_url: '/images/bukit-tangkiling.jpg',
      audio_url: '/audio/legenda-tangkiling.mp3',
      region: 'Kota Palangka Raya',
    },
    {
      id: 'folk-2',
      title: 'Legenda Danau Malawen',
      content: 'Kisah di daerah Barito tentang seorang pemuda bernama Kumbang Banaung yang memiliki piring Malawen sakral. Piring keramik Tiongkok kuno ini didapatkan dari pertapaan di hutan. Piring ini memiliki kesaktian luar biasa, mampu menyembuhkan berbagai penyakit dan menghasilkan padi berlimpah jika diletakkan di dalam lumbung. Karena sifat kikir dan kesombongannya yang enggan meminjamkan piring tersebut kepada tetangga yang sakit, piring itu terlempar ke udara karena kemarahan alam dan jatuh menghunjam ke tanah. Seketika lubang tempat jatuhnya piring menyemburkan air bah yang sangat deras tanpa henti, menenggelamkan desa Kumbang Banaung. Danau luas yang terbentuk dari luapan air itu kini dinamai Danau Malawen, sebuah danau mistis dan indah di pedalaman Barito.',
      image_url: '/images/danau-malawen.jpg',
      audio_url: '/audio/legenda-malawen.mp3',
      region: 'Kabupaten Barito Selatan',
    },
  ],
  regions: [
    { id: 'palangkaraya', name: 'Kota Palangka Raya', description: 'Ibu kota Provinsi Kalimantan Tengah, dikenal dengan desain kota tata ruang rancangan Presiden Soekarno yang sempat diwacanakan menjadi ibu kota Indonesia. Memiliki cagar alam Bukit Tangkiling dan Sungai Kahayan yang membelah kota.', image_url: '/images/palangkaraya.jpg', location_info: 'Pusat Provinsi Kalteng' },
    { id: 'kapuas', name: 'Kabupaten Kapuas', description: 'Kuala Kapuas terkenal sebagai kota air dan pusat anyaman rotan berkualitas ekspor. Daerah ini memiliki keragaman budaya yang kaya berkat pencampuran etnis Dayak Ngaju, Banjar, dan Jawa transmigrasi.', image_url: '/images/kapuas.jpg', location_info: 'Bagian Selatan/Timur Kalteng' },
    { id: 'gunungmas', name: 'Kabupaten Gunung Mas', description: 'Daerah berbukit di hulu sungai Kahayan. Gunung Mas merupakan pusat peradaban Dayak kuno Kaharingan, tempat lahirnya pahlawan Tambun dan Bungai, serta menjadi pusat penyelenggaraan ritual adat Tiwah sakral.', image_url: '/images/gunungmas.jpg', location_info: 'Bagian Tengah/Utara Kalteng' },
    { id: 'kotawaringinbarat', name: 'Kabupaten Kotawaringin Barat', description: 'Pangkalan Bun adalah gerbang utama menuju Taman Nasional Tanjung Puting, pusat konservasi Orangutan terbesar di dunia. Kaya akan jejak Kesultanan Kutaringin (satu-satunya kerajaan Islam di Kalteng).', image_url: '/images/kotawaringinbarat.jpg', location_info: 'Bagian Barat Kalteng' },
    { id: 'kotawaringintimur', name: 'Kabupaten Kotawaringin Timur', description: 'Sampit merupakan pusat pelabuhan laut utama dan perekonomian industri kayu kelapa sawit terbesar di provinsi ini. Memiliki pesona pantai Ujung Pandaran di pesisir selatannya.', image_url: '/images/kotawaringintimur.jpg', location_info: 'Bagian Barat/Tengah Kalteng' },
    { id: 'baritoselatan', name: 'Kabupaten Barito Selatan', description: 'Beribu kota di Buntok, daerah aliran sungai Barito ini kental dengan budaya air, perikanan rawa, pertunjukan lagu daerah (Karungut), dan sentra kerajinan rotan dan enceng gondok.', image_url: '/images/baritoselatan.jpg', location_info: 'Bagian Timur Kalteng' },
    { id: 'baritotimur', name: 'Kabupaten Barito Timur', description: 'Tamiang Layang dihuni oleh sub-suku Dayak Ma’anyan yang mempertahankan adat agraris menanam padi gunung. Memiliki kekayaan arkeologi dan keterkaitan linguistik erat dengan Madagaskar.', image_url: '/images/baritotimur.jpg', location_info: 'Bagian Timur Kalteng' },
    { id: 'baritoutara', name: 'Kabupaten Barito Utara', description: 'Muara Teweh dikelilingi hutan hujan dan tebing batu karst yang eksotis. Terkenal dengan potensi batu bara melimpah dan wisata air terjun pedalaman.', image_url: '/images/baritoutara.jpg', location_info: 'Bagian Timur Kalteng' },
    { id: 'katingan', name: 'Kabupaten Katingan', description: 'Kasongan terkenal dengan kerajinan keramik tanah liat bermotif Dayak. Wilayah ini dialiri Sungai Katingan dengan hutan Taman Nasional Sebangau yang menawan.', image_url: '/images/katingan.jpg', location_info: 'Bagian Tengah Kalteng' },
    { id: 'pulangpisau', name: 'Kabupaten Pulang Pisau', description: 'Kawasan konservasi lahan gambut luas dan pelabuhan feri Bahaur. Memiliki Jembatan Tumbang Nusa yang membentang di atas rawa gambut sebagai rute vital trans-Kalimantan.', image_url: '/images/pulangpisau.jpg', location_info: 'Bagian Selatan Kalteng' },
    { id: 'seruyan', name: 'Kabupaten Seruyan', description: 'Kuala Pembuang memiliki Danau Sembuluh, danau terbesar di Kalimantan dengan luas lebih dari 7.000 hektar yang kaya keanekaragaman hayati ikan tawar.', image_url: '/images/seruyan.jpg', location_info: 'Bagian Barat Kalteng' },
    { id: 'lamandau', name: 'Kabupaten Lamandau', description: 'Nanga Bulik menyimpan keindahan alam riam sungai jernih dan pegunungan rimbun yang cocok untuk wisata petualangan arung jeram dan eksplorasi adat bukit.', image_url: '/images/lamandau.jpg', location_info: 'Bagian Barat Kalteng' },
    { id: 'sukamara', name: 'Kabupaten Sukamara', description: 'Daerah pesisir pantai barat yang terkenal dengan budidaya udang vaname dan pantai pasir putih yang asri menghadap Laut Jawa.', image_url: '/images/sukamara.jpg', location_info: 'Bagian Barat Daya Kalteng' },
    { id: 'murungraya', name: 'Kabupaten Murung Raya', description: 'Kabupaten paling utara dengan Puruk Cahu sebagai ibu kotanya. Berada di jantung pegunungan Muller-Schwaner, menjadikannya daerah tertinggi dengan riam sungai Barito terganas.', image_url: '/images/murungraya.jpg', location_info: 'Bagian Hulu Barito / Paling Utara' },
  ],
  word_of_the_day: [
    { id: 'wotd-1', word: 'Itah', meaning: 'Kita (atau orang/masyarakat kami)', language_name: 'Dayak Ngaju', audio_url: '/audio/itah.mp3', display_date: new Date().toISOString().split('T')[0] },
  ],
  quizzes: [
    {
      id: 'q-1',
      question: 'Apakah nama upacara ritual kematian suku Dayak penganut Kaharingan di Kalimantan Tengah untuk mengantarkan roh leluhur ke surga?',
      option_a: 'Tiwah',
      option_b: 'Manyipet',
      option_c: 'Mamapas Lewu',
      option_d: 'Wahyu',
      correct_answer: 'A',
      score: 10,
      explanation: 'Upacara Tiwah merupakan ritual penyucian tulang-belulang orang mati agar jiwanya sampai di Lewu Tatau (surga).',
    },
    {
      id: 'q-2',
      question: 'Alat musik tradisional Kalimantan Tengah berbentuk sejenis gong perunggu kuningan bermotif ukiran adat dinamakan...',
      option_a: 'Japen',
      option_b: 'Kangkanung',
      option_c: 'Garantung',
      option_d: 'Tuma',
      correct_answer: 'C',
      score: 10,
      explanation: 'Garantung adalah alat musik gong khas Dayak Kalimantan Tengah yang digunakan dalam upacara adat dan bernilai mas kawin/denda adat tinggi.',
    },
    {
      id: 'q-3',
      question: 'Taman Nasional di Kalimantan Tengah yang terkenal di dunia sebagai tempat riset dan konservasi Orangutan terbesar adalah...',
      option_a: 'Taman Nasional Sebangau',
      option_b: 'Taman Nasional Tanjung Puting',
      option_c: 'Taman Nasional Bukit Baka Bukit Raya',
      option_d: 'Taman Nasional Kutai',
      correct_answer: 'B',
      score: 10,
      explanation: 'Taman Nasional Tanjung Puting yang berlokasi di Kotawaringin Barat merupakan habitat perlindungan Orangutan liar dengan pusat riset Camp Leakey.',
    },
    {
      id: 'q-4',
      question: 'Falsafah hidup bersatu padu, rukun berdampingan dalam perbedaan keyakinan suku Dayak di Kalimantan Tengah diambil dari rumah adat tradisional...',
      option_a: 'Rumah Baanjung',
      option_b: 'Rumah Joglo',
      option_c: 'Huma Betang',
      option_d: 'Rumah Gadang',
      correct_answer: 'C',
      score: 10,
      explanation: 'Falsafah Huma Betang melambangkan toleransi kebersamaan karena puluhan keluarga dari berbagai agama tinggal rukun dalam satu rumah panjang.',
    },
  ],
  contributions: [
    {
      id: 'c-1',
      sender_name: 'Budi Santoso',
      sender_email: 'budi@gmail.com',
      category: 'Seni & Budaya',
      title: 'Tari Kinyah Mandau',
      description: 'Saya ingin melampirkan informasi tari Kinyah Mandau yang merupakan variasi tarian perang bela diri sebelum menari tari mandau asli. Sangat sarat dengan gerakan beladiri pencak silat kuno.',
      image_url: '/uploads/kinyah-mandau.jpg',
      status: 'pending',
      created_at: new Date().toISOString(),
    },
  ],
  gallery: [
    { id: 'g-1', title: 'Penari Mandau Tradisional', type: 'image', media_url: '/images/tari-mandau.jpg', description: 'Seorang pemuda Dayak memperagakan tari Mandau dengan tameng kayu ulin berhias bulu burung enggang.' },
    { id: 'g-2', title: 'Upacara Adat Tiwah di Kurun', type: 'image', media_url: '/images/tiwah.jpg', description: 'Prosesi pendirian sandung berukir tempat peristirahatan tulang leluhur.' },
    { id: 'g-3', title: 'Taman Nasional Sebangau', type: 'image', media_url: '/images/sebangau.jpg', description: 'Ekosistem rawa gambut dan air hitam di Kabupaten Katingan.' },
  ],
  contact: {
    id: 1,
    email: 'tentangitah@gmail.com',
    instagram: '@tentangitah',
    facebook: 'Tentang Itah',
    dekranasda_kalteng: '@dekranasdaprovkalteng',
    phone: '082274595638',
    about_us: 'Platform edukasi budaya independen yang dikembangkan oleh putra-putri daerah Kalimantan Tengah untuk melestarikan identitas lokal di era globalisasi.',
  },
  active_sessions: [],
};

// --- CORE READ/WRITE INTERFACE ---

// Ensure local db directory exists and has files
function initializeLocalDb() {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialSeedData, null, 2), 'utf-8');
  } else {
    // Basic verification that the file is valid JSON
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      JSON.parse(data);
    } catch {
      // Recreate if corrupted
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialSeedData, null, 2), 'utf-8');
    }
  }
}

// Read whole DB
export function readLocalDb(): DatabaseSchema {
  initializeLocalDb();
  const fileContent = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
  return JSON.parse(fileContent);
}

// Write whole DB
export function writeLocalDb(data: DatabaseSchema): void {
  initializeLocalDb();
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// --- DUAL MODE DYNAMIC API HANDLERS ---

export async function getHomepage(): Promise<Homepage> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('homepage').select('*').eq('id', 1).single();
    if (!error && data) return data as Homepage;
  }
  return readLocalDb().homepage;
}

export async function updateHomepage(homepage: Partial<Homepage>): Promise<Homepage> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('homepage').update(homepage).eq('id', 1).select().single();
    if (!error && data) return data as Homepage;
  }
  const db = readLocalDb();
  db.homepage = { ...db.homepage, ...homepage };
  writeLocalDb(db);
  return db.homepage;
}

export async function getAbout(): Promise<About> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('about').select('*').eq('id', 1).single();
    if (!error && data) return data as About;
  }
  return readLocalDb().about;
}

export async function updateAbout(about: Partial<About>): Promise<About> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('about').update(about).eq('id', 1).select().single();
    if (!error && data) return data as About;
  }
  const db = readLocalDb();
  db.about = { ...db.about, ...about };
  writeLocalDb(db);
  return db.about;
}

// Languages CRUD
export async function getLanguages(): Promise<Language[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('languages').select('*');
    if (!error && data) return data as Language[];
  }
  return readLocalDb().languages;
}

export async function addLanguage(lang: Language): Promise<Language> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('languages').insert(lang).select().single();
    if (!error && data) return data as Language;
  }
  const db = readLocalDb();
  db.languages.push(lang);
  writeLocalDb(db);
  return lang;
}

export async function updateLanguage(id: string, updates: Partial<Language>): Promise<Language> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('languages').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Language;
  }
  const db = readLocalDb();
  db.languages = db.languages.map((l) => (l.id === id ? { ...l, ...updates } : l));
  writeLocalDb(db);
  return db.languages.find((l) => l.id === id)!;
}

export async function deleteLanguage(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('languages').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.languages = db.languages.filter((l) => l.id !== id);
  db.vocabularies = db.vocabularies.filter((v) => v.language_id !== id); // Cascade delete
  writeLocalDb(db);
  return true;
}

// Vocabularies CRUD
export async function getVocabularies(): Promise<Vocabulary[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('vocabularies').select('*');
    if (!error && data) return data as Vocabulary[];
  }
  return readLocalDb().vocabularies;
}

export async function addVocabulary(vocab: Omit<Vocabulary, 'id'> & { id?: string }): Promise<Vocabulary> {
  const newVocab = {
    ...vocab,
    id: vocab.id || `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as Vocabulary;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('vocabularies').insert(vocab).select().single();
    if (!error && data) return data as Vocabulary;
  }
  const db = readLocalDb();
  db.vocabularies.push(newVocab);
  writeLocalDb(db);
  return newVocab;
}

export async function updateVocabulary(id: string, updates: Partial<Vocabulary>): Promise<Vocabulary> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('vocabularies').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Vocabulary;
  }
  const db = readLocalDb();
  db.vocabularies = db.vocabularies.map((v) => (v.id === id ? { ...v, ...updates } : v));
  writeLocalDb(db);
  return db.vocabularies.find((v) => v.id === id)!;
}

export async function deleteVocabulary(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('vocabularies').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.vocabularies = db.vocabularies.filter((v) => v.id !== id);
  writeLocalDb(db);
  return true;
}

// Arts & Culture CRUD
export async function getArtsCulture(): Promise<ArtsCulture[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('arts_culture').select('*');
    if (!error && data) return data as ArtsCulture[];
  }
  return readLocalDb().arts_culture;
}

export async function addArtsCulture(art: Omit<ArtsCulture, 'id'> & { id?: string }): Promise<ArtsCulture> {
  const newArt = {
    ...art,
    id: art.id || `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as ArtsCulture;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('arts_culture').insert(art).select().single();
    if (!error && data) return data as ArtsCulture;
  }
  const db = readLocalDb();
  db.arts_culture.push(newArt);
  writeLocalDb(db);
  return newArt;
}

export async function updateArtsCulture(id: string, updates: Partial<ArtsCulture>): Promise<ArtsCulture> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('arts_culture').update(updates).eq('id', id).select().single();
    if (!error && data) return data as ArtsCulture;
  }
  const db = readLocalDb();
  db.arts_culture = db.arts_culture.map((a) => (a.id === id ? { ...a, ...updates } : a));
  writeLocalDb(db);
  return db.arts_culture.find((a) => a.id === id)!;
}

export async function deleteArtsCulture(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('arts_culture').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.arts_culture = db.arts_culture.filter((a) => a.id !== id);
  writeLocalDb(db);
  return true;
}

// Traditions CRUD
export async function getTraditions(): Promise<Tradition[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('traditions').select('*');
    if (!error && data) return data as Tradition[];
  }
  return readLocalDb().traditions;
}

export async function addTradition(trad: Omit<Tradition, 'id'> & { id?: string }): Promise<Tradition> {
  const newTrad = {
    ...trad,
    id: trad.id || `trad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as Tradition;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('traditions').insert(trad).select().single();
    if (!error && data) return data as Tradition;
  }
  const db = readLocalDb();
  db.traditions.push(newTrad);
  writeLocalDb(db);
  return newTrad;
}

export async function updateTradition(id: string, updates: Partial<Tradition>): Promise<Tradition> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('traditions').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Tradition;
  }
  const db = readLocalDb();
  db.traditions = db.traditions.map((t) => (t.id === id ? { ...t, ...updates } : t));
  writeLocalDb(db);
  return db.traditions.find((t) => t.id === id)!;
}

export async function deleteTradition(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('traditions').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.traditions = db.traditions.filter((t) => t.id !== id);
  writeLocalDb(db);
  return true;
}

// Folklore CRUD
export async function getFolklore(): Promise<Folklore[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('folklore').select('*');
    if (!error && data) return data as Folklore[];
  }
  return readLocalDb().folklore;
}

export async function addFolklore(folk: Omit<Folklore, 'id'> & { id?: string }): Promise<Folklore> {
  const newFolk = {
    ...folk,
    id: folk.id || `folk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as Folklore;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('folklore').insert(folk).select().single();
    if (!error && data) return data as Folklore;
  }
  const db = readLocalDb();
  db.folklore.push(newFolk);
  writeLocalDb(db);
  return newFolk;
}

export async function updateFolklore(id: string, updates: Partial<Folklore>): Promise<Folklore> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('folklore').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Folklore;
  }
  const db = readLocalDb();
  db.folklore = db.folklore.map((f) => (f.id === id ? { ...f, ...updates } : f));
  writeLocalDb(db);
  return db.folklore.find((f) => f.id === id)!;
}

export async function deleteFolklore(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('folklore').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.folklore = db.folklore.filter((f) => f.id !== id);
  writeLocalDb(db);
  return true;
}

// Regions CRUD
export async function getRegions(): Promise<Region[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('regions').select('*');
    if (!error && data) return data as Region[];
  }
  return readLocalDb().regions;
}

export async function addRegion(reg: Region): Promise<Region> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('regions').insert(reg).select().single();
    if (!error && data) return data as Region;
  }
  const db = readLocalDb();
  db.regions.push(reg);
  writeLocalDb(db);
  return reg;
}

export async function updateRegion(id: string, updates: Partial<Region>): Promise<Region> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('regions').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Region;
  }
  const db = readLocalDb();
  db.regions = db.regions.map((r) => (r.id === id ? { ...r, ...updates } : r));
  writeLocalDb(db);
  return db.regions.find((r) => r.id === id)!;
}

export async function deleteRegion(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('regions').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.regions = db.regions.filter((r) => r.id !== id);
  writeLocalDb(db);
  return true;
}

// Word of the Day CRUD
export async function getWordOfTheDays(): Promise<WordOfTheDay[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('word_of_the_day').select('*');
    if (!error && data) return data as WordOfTheDay[];
  }
  return readLocalDb().word_of_the_day;
}

export async function addWordOfTheDay(wotd: Omit<WordOfTheDay, 'id'> & { id?: string }): Promise<WordOfTheDay> {
  const newWotd = {
    ...wotd,
    id: wotd.id || `wotd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as WordOfTheDay;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('word_of_the_day').insert(wotd).select().single();
    if (!error && data) return data as WordOfTheDay;
  }
  const db = readLocalDb();
  db.word_of_the_day.push(newWotd);
  writeLocalDb(db);
  return newWotd;
}

export async function updateWordOfTheDay(id: string, updates: Partial<WordOfTheDay>): Promise<WordOfTheDay> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('word_of_the_day').update(updates).eq('id', id).select().single();
    if (!error && data) return data as WordOfTheDay;
  }
  const db = readLocalDb();
  db.word_of_the_day = db.word_of_the_day.map((w) => (w.id === id ? { ...w, ...updates } : w));
  writeLocalDb(db);
  return db.word_of_the_day.find((w) => w.id === id)!;
}

export async function deleteWordOfTheDay(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('word_of_the_day').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.word_of_the_day = db.word_of_the_day.filter((w) => w.id !== id);
  writeLocalDb(db);
  return true;
}

// Quizzes CRUD
export async function getQuizzes(): Promise<Quiz[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('quizzes').select('*');
    if (!error && data) return data as Quiz[];
  }
  return readLocalDb().quizzes;
}

export async function addQuiz(quiz: Omit<Quiz, 'id'> & { id?: string }): Promise<Quiz> {
  const newQuiz = {
    ...quiz,
    id: quiz.id || `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as Quiz;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('quizzes').insert(quiz).select().single();
    if (!error && data) return data as Quiz;
  }
  const db = readLocalDb();
  db.quizzes.push(newQuiz);
  writeLocalDb(db);
  return newQuiz;
}

export async function updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('quizzes').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Quiz;
  }
  const db = readLocalDb();
  db.quizzes = db.quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q));
  writeLocalDb(db);
  return db.quizzes.find((q) => q.id === id)!;
}

export async function deleteQuiz(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('quizzes').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.quizzes = db.quizzes.filter((q) => q.id !== id);
  writeLocalDb(db);
  return true;
}

// Contributions CRUD
export async function getContributions(): Promise<Contribution[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('contributions').select('*').order('created_at', { ascending: false });
    if (!error && data) return data as Contribution[];
  }
  return [...readLocalDb().contributions].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
}

export async function addContribution(contrib: Omit<Contribution, 'id' | 'status'> & { id?: string; status?: 'pending' | 'approved' | 'rejected' }): Promise<Contribution> {
  const newContrib = {
    ...contrib,
    id: contrib.id || `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: contrib.status || 'pending',
    created_at: new Date().toISOString(),
  } as Contribution;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('contributions').insert(newContrib).select().single();
    if (!error && data) return data as Contribution;
  }
  const db = readLocalDb();
  db.contributions.push(newContrib);
  writeLocalDb(db);
  return newContrib;
}

export async function updateContributionStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Contribution> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('contributions').update({ status }).eq('id', id).select().single();
    if (!error && data) return data as Contribution;
  }
  const db = readLocalDb();
  db.contributions = db.contributions.map((c) => (c.id === id ? { ...c, status } : c));
  writeLocalDb(db);
  return db.contributions.find((c) => c.id === id)!;
}

export async function deleteContribution(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contributions').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.contributions = db.contributions.filter((c) => c.id !== id);
  writeLocalDb(db);
  return true;
}

// Gallery CRUD
export async function getGallery(): Promise<Gallery[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('gallery').select('*');
    if (!error && data) return data as Gallery[];
  }
  return readLocalDb().gallery;
}

export async function addGallery(item: Omit<Gallery, 'id'> & { id?: string }): Promise<Gallery> {
  const newItem = {
    ...item,
    id: item.id || `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  } as Gallery;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('gallery').insert(item).select().single();
    if (!error && data) return data as Gallery;
  }
  const db = readLocalDb();
  db.gallery.push(newItem);
  writeLocalDb(db);
  return newItem;
}

export async function updateGallery(id: string, updates: Partial<Gallery>): Promise<Gallery> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('gallery').update(updates).eq('id', id).select().single();
    if (!error && data) return data as Gallery;
  }
  const db = readLocalDb();
  db.gallery = db.gallery.map((g) => (g.id === id ? { ...g, ...updates } : g));
  writeLocalDb(db);
  return db.gallery.find((g) => g.id === id)!;
}

export async function deleteGallery(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    return !error;
  }
  const db = readLocalDb();
  db.gallery = db.gallery.filter((g) => g.id !== id);
  writeLocalDb(db);
  return true;
}

// Contact CRUD
export async function getContact(): Promise<Contact> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('contact').select('*').eq('id', 1).single();
    if (!error && data) return data as Contact;
  }
  return readLocalDb().contact;
}

export async function updateContact(contact: Partial<Contact>): Promise<Contact> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('contact').update(contact).eq('id', 1).select().single();
    if (!error && data) return data as Contact;
  }
  const db = readLocalDb();
  db.contact = { ...db.contact, ...contact };
  writeLocalDb(db);
  return db.contact;
}

// Admin Authentication (Helper for Dashboard)
export async function authenticateAdmin(username: string, passwordSecret: string): Promise<Admin | null> {
  if (isSupabaseConfigured && supabase) {
    // If using Supabase, you would use supabase.auth, but for custom credentials:
    const { data, error } = await supabase.from('admins').select('*').eq('username', username).eq('password', passwordSecret).single();
    if (!error && data) return data as Admin;
  }
  const db = readLocalDb();
  const matched = db.admins.find((a) => a.username === username && a.password === passwordSecret);
  if (matched) {
    return { id: matched.id, username: matched.username };
  }
  return null;
}

// --- ACTIVE SESSIONS CRUD ---

export async function cleanExpiredSessions(): Promise<void> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('active_sessions').delete().lt('expires_at', now);
    } catch (e) {
      console.error('Supabase session cleanup error:', e);
    }
    return;
  }
  const db = readLocalDb();
  if (!db.active_sessions) db.active_sessions = [];
  const initialCount = db.active_sessions.length;
  db.active_sessions = db.active_sessions.filter((s) => new Date(s.expires_at).getTime() > Date.now());
  if (db.active_sessions.length !== initialCount) {
    writeLocalDb(db);
  }
}

export async function getActiveSessionsCount(): Promise<number> {
  await cleanExpiredSessions();
  if (isSupabaseConfigured && supabase) {
    try {
      const { count, error } = await supabase.from('active_sessions').select('*', { count: 'exact', head: true });
      if (!error && count !== null) return count;
    } catch (e) {
      console.error('Supabase session count error:', e);
    }
  }
  const db = readLocalDb();
  if (!db.active_sessions) db.active_sessions = [];
  return db.active_sessions.length;
}

export async function addActiveSession(id: string, username: string, expiresAt: string): Promise<void> {
  await cleanExpiredSessions();
  const session = { id, username, expires_at: expiresAt, created_at: new Date().toISOString() };
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('active_sessions').insert(session);
    } catch (e) {
      console.error('Supabase add session error:', e);
    }
    return;
  }
  const db = readLocalDb();
  if (!db.active_sessions) db.active_sessions = [];
  db.active_sessions.push(session);
  writeLocalDb(db);
}

export async function removeActiveSession(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('active_sessions').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase remove session error:', e);
    }
    return;
  }
  const db = readLocalDb();
  if (!db.active_sessions) db.active_sessions = [];
  db.active_sessions = db.active_sessions.filter((s) => s.id !== id);
  writeLocalDb(db);
}

export async function isSessionActive(id: string): Promise<boolean> {
  await cleanExpiredSessions();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('active_sessions').select('*').eq('id', id);
      return !error && data && data.length > 0;
    } catch (e) {
      console.error('Supabase check session error:', e);
    }
  }
  const db = readLocalDb();
  if (!db.active_sessions) db.active_sessions = [];
  return db.active_sessions.some((s) => s.id === id);
}
