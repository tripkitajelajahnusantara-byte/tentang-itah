'use server';

import { revalidatePath } from 'next/cache';
import * as db from '@/lib/db';
import * as auth from '@/lib/auth';

// --- AUTHENTICATION ACTIONS ---

export async function loginAdminAction(prevState: any, formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return { success: false, error: 'Username dan password wajib diisi' };
    }

    const result = await auth.loginAdmin(username, password);
    return result;
  } catch (error: any) {
    console.error('Error during login action:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan sistem saat masuk.'
    };
  }
}

export async function logoutAdminAction() {
  await auth.logoutAdmin();
  return { success: true };
}

export async function checkAdminAuthAction() {
  return await auth.isAdminAuthenticated();
}

// --- HOMEPAGE ACTIONS ---

export async function updateHomepageAction(data: Partial<db.Homepage>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateHomepage(data);
  revalidatePath('/');
  return result;
}

// --- ABOUT ACTIONS ---

export async function updateAboutAction(data: Partial<db.About>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateAbout(data);
  revalidatePath('/tentang');
  return result;
}

// --- LANGUAGES ACTIONS ---

export async function getLanguagesAction() {
  return await db.getLanguages();
}

export async function addLanguageAction(lang: db.Language) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addLanguage(lang);
  revalidatePath('/bahasa');
  return result;
}

export async function updateLanguageAction(id: string, updates: Partial<db.Language>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateLanguage(id, updates);
  revalidatePath('/bahasa');
  return result;
}

export async function deleteLanguageAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteLanguage(id);
  revalidatePath('/bahasa');
  return result;
}

// --- VOCABULARIES ACTIONS ---

export async function getVocabulariesAction() {
  return await db.getVocabularies();
}

export async function addVocabularyAction(vocab: Omit<db.Vocabulary, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addVocabulary(vocab);
  revalidatePath('/bahasa');
  revalidatePath('/kata-hari-ini');
  return result;
}

export async function updateVocabularyAction(id: string, updates: Partial<db.Vocabulary>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateVocabulary(id, updates);
  revalidatePath('/bahasa');
  revalidatePath('/kata-hari-ini');
  return result;
}

export async function deleteVocabularyAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteVocabulary(id);
  revalidatePath('/bahasa');
  revalidatePath('/kata-hari-ini');
  return result;
}

// --- ARTS & CULTURE ACTIONS ---

export async function getArtsCultureAction() {
  return await db.getArtsCulture();
}

export async function addArtsCultureAction(art: Omit<db.ArtsCulture, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addArtsCulture(art);
  revalidatePath('/seni-budaya');
  return result;
}

export async function updateArtsCultureAction(id: string, updates: Partial<db.ArtsCulture>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateArtsCulture(id, updates);
  revalidatePath('/seni-budaya');
  return result;
}

export async function deleteArtsCultureAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteArtsCulture(id);
  revalidatePath('/seni-budaya');
  return result;
}

// --- TRADITIONS ACTIONS ---

export async function getTraditionsAction() {
  return await db.getTraditions();
}

export async function addTraditionAction(trad: Omit<db.Tradition, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addTradition(trad);
  revalidatePath('/tradisi');
  return result;
}

export async function updateTraditionAction(id: string, updates: Partial<db.Tradition>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateTradition(id, updates);
  revalidatePath('/tradisi');
  return result;
}

export async function deleteTraditionAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteTradition(id);
  revalidatePath('/tradisi');
  return result;
}

// --- FOLKLORE ACTIONS ---

export async function getFolkloreAction() {
  return await db.getFolklore();
}

export async function addFolkloreAction(folk: Omit<db.Folklore, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addFolklore(folk);
  revalidatePath('/cerita-rakyat');
  return result;
}

export async function updateFolkloreAction(id: string, updates: Partial<db.Folklore>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateFolklore(id, updates);
  revalidatePath('/cerita-rakyat');
  return result;
}

export async function deleteFolkloreAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteFolklore(id);
  revalidatePath('/cerita-rakyat');
  return result;
}

// --- REGIONS ACTIONS ---

export async function getRegionsAction() {
  return await db.getRegions();
}

export async function addRegionAction(reg: db.Region) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addRegion(reg);
  revalidatePath('/jelajah');
  return result;
}

export async function updateRegionAction(id: string, updates: Partial<db.Region>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateRegion(id, updates);
  revalidatePath('/jelajah');
  return result;
}

export async function deleteRegionAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteRegion(id);
  revalidatePath('/jelajah');
  return result;
}

// --- WORD OF THE DAY ACTIONS ---

export async function getWordOfTheDaysAction() {
  return await db.getWordOfTheDays();
}

export async function addWordOfTheDayAction(wotd: Omit<db.WordOfTheDay, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addWordOfTheDay(wotd);
  revalidatePath('/kata-hari-ini');
  return result;
}

export async function updateWordOfTheDayAction(id: string, updates: Partial<db.WordOfTheDay>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateWordOfTheDay(id, updates);
  revalidatePath('/kata-hari-ini');
  return result;
}

export async function deleteWordOfTheDayAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteWordOfTheDay(id);
  revalidatePath('/kata-hari-ini');
  return result;
}

// --- QUIZZES ACTIONS ---

export async function getQuizzesAction() {
  return await db.getQuizzes();
}

export async function addQuizAction(quiz: Omit<db.Quiz, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addQuiz(quiz);
  revalidatePath('/kuis');
  return result;
}

export async function updateQuizAction(id: string, updates: Partial<db.Quiz>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateQuiz(id, updates);
  revalidatePath('/kuis');
  return result;
}

export async function deleteQuizAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteQuiz(id);
  revalidatePath('/kuis');
  return result;
}

// --- CONTRIBUTIONS ACTIONS ---

export async function getContributionsAction() {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  return await db.getContributions();
}

export async function submitContributionAction(contrib: Omit<db.Contribution, 'id' | 'status'>) {
  // Public action - anyone can submit!
  const result = await db.addContribution(contrib);
  revalidatePath('/admin/dashboard'); // update pending count in dashboard
  return result;
}

export async function verifyContributionAction(id: string, status: 'approved' | 'rejected') {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const contrib = await db.updateContributionStatus(id, status);
  
  // If approved, dynamically insert into the correct content table based on contribution type!
  if (status === 'approved') {
    if (contrib.category === 'Cerita Rakyat') {
      await db.addFolklore({
        title: contrib.title,
        content: contrib.description,
        image_url: contrib.image_url,
        audio_url: contrib.audio_url,
        region: 'Kalimantan Tengah',
      });
      revalidatePath('/cerita-rakyat');
    } else if (contrib.category === 'Seni & Budaya') {
      await db.addArtsCulture({
        category: 'Kesenian Lainnya',
        name: contrib.title,
        description: contrib.description,
        origin_region: 'Kalimantan Tengah',
        meaning: 'Kontribusi Masyarakat',
        image_url: contrib.image_url,
      });
      revalidatePath('/seni-budaya');
    } else if (contrib.category === 'Tradisi') {
      await db.addTradition({
        name: contrib.title,
        description: contrib.description,
        location: 'Kalimantan Tengah',
        purpose: 'Kontribusi Masyarakat',
        meaning: 'Kontribusi Masyarakat',
        image_url: contrib.image_url,
      });
      revalidatePath('/tradisi');
    }
  }

  revalidatePath('/admin/dashboard');
  return contrib;
}

export async function deleteContributionAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteContribution(id);
  revalidatePath('/admin/dashboard');
  return result;
}

// --- GALLERY ACTIONS ---

export async function getGalleryAction() {
  return await db.getGallery();
}

export async function addGalleryAction(item: Omit<db.Gallery, 'id'>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.addGallery(item);
  revalidatePath('/galeri');
  return result;
}

export async function updateGalleryAction(id: string, updates: Partial<db.Gallery>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateGallery(id, updates);
  revalidatePath('/galeri');
  return result;
}

export async function deleteGalleryAction(id: string) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.deleteGallery(id);
  revalidatePath('/galeri');
  return result;
}

// --- CONTACT ACTIONS ---

export async function updateContactAction(data: Partial<db.Contact>) {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }
  const result = await db.updateContact(data);
  revalidatePath('/kontak');
  return result;
}

// --- ADMIN DASHBOARD OVERVIEW STATS ---

export async function getDashboardStatsAction() {
  if (!(await auth.isAdminAuthenticated())) {
    throw new Error('Unauthorized');
  }

  const dbData = db.readLocalDb();
  
  const languagesCount = dbData.languages.length;
  const vocabulariesCount = dbData.vocabularies.length;
  const artsCount = dbData.arts_culture.length;
  const traditionsCount = dbData.traditions.length;
  const folkloreCount = dbData.folklore.length;
  const regionsCount = dbData.regions.length;
  const galleryCount = dbData.gallery.length;
  const quizzesCount = dbData.quizzes.length;
  
  const pendingContributions = dbData.contributions.filter(c => c.status === 'pending').length;
  const approvedContributions = dbData.contributions.filter(c => c.status === 'approved').length;

  const totalContentActive = 
    languagesCount + 
    vocabulariesCount + 
    artsCount + 
    traditionsCount + 
    folkloreCount + 
    regionsCount + 
    galleryCount + 
    quizzesCount;

  return {
    languagesCount,
    vocabulariesCount,
    artsCount,
    traditionsCount,
    folkloreCount,
    regionsCount,
    galleryCount,
    quizzesCount,
    pendingContributions,
    approvedContributions,
    totalContentActive
  };
}
