import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Service,
  GalleryItem,
  BlogPost,
  Message,
  SiteSettings
} from '../types';
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialExperience,
  initialEducation,
  initialServices,
  initialGallery,
  initialBlogPosts,
  initialSiteSettings
} from '../data/initialData';

// Firestore collection names
export const COLLECTIONS = {
  PROFILE: 'profile',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SERVICES: 'services',
  GALLERY: 'gallery',
  BLOG_POSTS: 'blogPosts',
  MESSAGES: 'messages',
  SETTINGS: 'settings'
};

class FirestoreService {
  private isFirebaseAccessible: boolean = true;

  // ==================== PROFILE ====================
  async getProfile(): Promise<Profile> {
    try {
      const docRef = doc(db, COLLECTIONS.PROFILE, 'main');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Profile;
      }
      return initialProfile;
    } catch (err) {
      console.warn('Firestore getProfile fallback to initial data:', err);
      return initialProfile;
    }
  }

  async updateProfile(data: Partial<Profile>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROFILE, 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  // ==================== PROJECTS ====================
  async getProjects(includeDrafts: boolean = false): Promise<Project[]> {
    try {
      const colRef = collection(db, COLLECTIONS.PROJECTS);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        if (!includeDrafts) {
          items = items.filter(p => p.status === 'published');
        }
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return items;
      }
      // Fallback
      return includeDrafts
        ? initialProjects
        : initialProjects.filter(p => p.status === 'published');
    } catch (err) {
      console.warn('Firestore getProjects fallback to initial data:', err);
      return includeDrafts
        ? initialProjects
        : initialProjects.filter(p => p.status === 'published');
    }
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const all = await this.getProjects(true);
    return all.find(p => p.slug === slug || p.id === slug) || null;
  }

  async saveProject(project: Partial<Project>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.PROJECTS);
    if (project.id) {
      const { id, ...rest } = project;
      const docRef = doc(db, COLLECTIONS.PROJECTS, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...project,
        status: project.status || 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
  }

  // ==================== SKILLS ====================
  async getSkills(): Promise<Skill[]> {
    try {
      const colRef = collection(db, COLLECTIONS.SKILLS);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return items;
      }
      return initialSkills;
    } catch (err) {
      console.warn('Firestore getSkills fallback:', err);
      return initialSkills;
    }
  }

  async saveSkill(skill: Partial<Skill>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.SKILLS);
    if (skill.id) {
      const { id, ...rest } = skill;
      const docRef = doc(db, COLLECTIONS.SKILLS, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...skill,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteSkill(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.SKILLS, id));
  }

  // ==================== EXPERIENCE ====================
  async getExperience(): Promise<Experience[]> {
    try {
      const colRef = collection(db, COLLECTIONS.EXPERIENCE);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Experience));
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return items;
      }
      return initialExperience;
    } catch (err) {
      console.warn('Firestore getExperience fallback:', err);
      return initialExperience;
    }
  }

  async saveExperience(exp: Partial<Experience>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.EXPERIENCE);
    if (exp.id) {
      const { id, ...rest } = exp;
      const docRef = doc(db, COLLECTIONS.EXPERIENCE, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...exp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteExperience(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.EXPERIENCE, id));
  }

  // ==================== EDUCATION ====================
  async getEducation(): Promise<Education[]> {
    try {
      const colRef = collection(db, COLLECTIONS.EDUCATION);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Education));
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return items;
      }
      return initialEducation;
    } catch (err) {
      console.warn('Firestore getEducation fallback:', err);
      return initialEducation;
    }
  }

  async saveEducation(edu: Partial<Education>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.EDUCATION);
    if (edu.id) {
      const { id, ...rest } = edu;
      const docRef = doc(db, COLLECTIONS.EDUCATION, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...edu,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteEducation(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.EDUCATION, id));
  }

  // ==================== SERVICES ====================
  async getServices(): Promise<Service[]> {
    try {
      const colRef = collection(db, COLLECTIONS.SERVICES);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return items;
      }
      return initialServices;
    } catch (err) {
      console.warn('Firestore getServices fallback:', err);
      return initialServices;
    }
  }

  async saveService(srv: Partial<Service>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.SERVICES);
    if (srv.id) {
      const { id, ...rest } = srv;
      const docRef = doc(db, COLLECTIONS.SERVICES, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...srv,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteService(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
  }

  // ==================== GALLERY ====================
  async getGallery(): Promise<GalleryItem[]> {
    try {
      const colRef = collection(db, COLLECTIONS.GALLERY);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
        items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return items;
      }
      return initialGallery;
    } catch (err) {
      console.warn('Firestore getGallery fallback:', err);
      return initialGallery;
    }
  }

  async saveGalleryItem(item: Partial<GalleryItem>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.GALLERY);
    if (item.id) {
      const { id, ...rest } = item;
      const docRef = doc(db, COLLECTIONS.GALLERY, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteGalleryItem(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
  }

  // ==================== BLOG POSTS ====================
  async getBlogPosts(includeDrafts: boolean = false): Promise<BlogPost[]> {
    try {
      const colRef = collection(db, COLLECTIONS.BLOG_POSTS);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
        if (!includeDrafts) {
          items = items.filter(p => p.status === 'published');
        }
        items.sort((a, b) => {
          const dateA = new Date(a.publishedAt || 0).getTime();
          const dateB = new Date(b.publishedAt || 0).getTime();
          return dateB - dateA;
        });
        return items;
      }
      return includeDrafts
        ? initialBlogPosts
        : initialBlogPosts.filter(p => p.status === 'published');
    } catch (err) {
      console.warn('Firestore getBlogPosts fallback:', err);
      return includeDrafts
        ? initialBlogPosts
        : initialBlogPosts.filter(p => p.status === 'published');
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const all = await this.getBlogPosts(true);
    return all.find(p => p.slug === slug || p.id === slug) || null;
  }

  async saveBlogPost(post: Partial<BlogPost>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.BLOG_POSTS);
    if (post.id) {
      const { id, ...rest } = post;
      const docRef = doc(db, COLLECTIONS.BLOG_POSTS, id);
      await setDoc(docRef, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
      return id;
    } else {
      const newDoc = await addDoc(colRef, {
        ...post,
        viewsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return newDoc.id;
    }
  }

  async deleteBlogPost(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.BLOG_POSTS, id));
  }

  // ==================== MESSAGES ====================
  async submitMessage(message: Omit<Message, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const colRef = collection(db, COLLECTIONS.MESSAGES);
    const newDoc = await addDoc(colRef, {
      ...message,
      status: 'unread',
      createdAt: serverTimestamp()
    });
    return newDoc.id;
  }

  async getMessages(): Promise<Message[]> {
    try {
      const colRef = collection(db, COLLECTIONS.MESSAGES);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
        items.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
          return timeB - timeA;
        });
        return items;
      }
      return [];
    } catch (err) {
      console.warn('Firestore getMessages error:', err);
      return [];
    }
  }

  async updateMessageStatus(id: string, status: 'unread' | 'read' | 'archived' | 'replied'): Promise<void> {
    const docRef = doc(db, COLLECTIONS.MESSAGES, id);
    await updateDoc(docRef, { status });
  }

  async deleteMessage(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
  }

  // ==================== SETTINGS ====================
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...snap.data() } as SiteSettings;
      }
      return initialSiteSettings;
    } catch (err) {
      return initialSiteSettings;
    }
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
    await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
  }

  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    return this.updateSiteSettings(settings);
  }

  // ==================== AGGREGATE OPERATIONS ====================
  async getAllData(): Promise<{
    profile: Profile;
    projects: Project[];
    skills: Skill[];
    experience: Experience[];
    education: Education[];
    services: Service[];
    gallery: GalleryItem[];
    blogPosts: BlogPost[];
    settings: SiteSettings;
  }> {
    const [profile, projects, skills, experience, education, services, gallery, blogPosts, settings] = await Promise.all([
      this.getProfile(),
      this.getProjects(),
      this.getSkills(),
      this.getExperience(),
      this.getEducation(),
      this.getServices(),
      this.getGallery(),
      this.getBlogPosts(),
      this.getSiteSettings()
    ]);
    return { profile, projects, skills, experience, education, services, gallery, blogPosts, settings };
  }

  async exportAllData(): Promise<any> {
    const allData = await this.getAllData();
    const messages = await this.getMessages();
    return {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        author: allData.profile.fullName
      },
      ...allData,
      messages
    };
  }

  // ==================== DATABASE SEEDER ====================
  /**
   * Seeds Firestore with the initial rich dataset if the user requests it or on first admin setup.
   */
  async seedDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Profile
      await setDoc(doc(db, COLLECTIONS.PROFILE, 'main'), {
        ...initialProfile,
        updatedAt: serverTimestamp()
      });

      // 2. Settings
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'global'), {
        ...initialSiteSettings,
        updatedAt: serverTimestamp()
      });

      // 3. Projects
      for (const p of initialProjects) {
        await setDoc(doc(db, COLLECTIONS.PROJECTS, p.id || p.slug), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 4. Skills
      for (const s of initialSkills) {
        await setDoc(doc(db, COLLECTIONS.SKILLS, s.id!), {
          ...s,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 5. Experience
      for (const e of initialExperience) {
        await setDoc(doc(db, COLLECTIONS.EXPERIENCE, e.id!), {
          ...e,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 6. Education
      for (const ed of initialEducation) {
        await setDoc(doc(db, COLLECTIONS.EDUCATION, ed.id!), {
          ...ed,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 7. Services
      for (const s of initialServices) {
        await setDoc(doc(db, COLLECTIONS.SERVICES, s.id!), {
          ...s,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 8. Gallery
      for (const g of initialGallery) {
        await setDoc(doc(db, COLLECTIONS.GALLERY, g.id!), {
          ...g,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 9. Blog Posts
      for (const b of initialBlogPosts) {
        await setDoc(doc(db, COLLECTIONS.BLOG_POSTS, b.id || b.slug), {
          ...b,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      return { success: true, message: 'Firestore database successfully populated with all portfolio modules!' };
    } catch (error: any) {
      console.error('Error seeding database:', error);
      return { success: false, message: error.message || 'Failed to seed database.' };
    }
  }
}

export const firestoreService = new FirestoreService();
