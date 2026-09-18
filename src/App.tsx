import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { firestoreService } from './services/firestoreService';
import {
  Profile,
  Project,
  Skill,
  Experience as ExperienceType,
  Education,
  Service,
  GalleryItem,
  BlogPost,
  SiteSettings,
  Message
} from './types';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_EXPERIENCE,
  INITIAL_EDUCATION,
  INITIAL_SERVICES,
  INITIAL_GALLERY,
  INITIAL_BLOG_POSTS,
  INITIAL_SETTINGS
} from './data/initialData';

// Public Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Skills } from './pages/Skills';
import { Experience } from './pages/Experience';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { Blog } from './pages/Blog';
import { BlogPostView } from './pages/BlogPost';
import { Contact } from './pages/Contact';

// Admin Components
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { DashboardOverview } from './admin/DashboardOverview';
import { ProjectsManager } from './admin/ProjectsManager';
import { BlogManager } from './admin/BlogManager';
import { SkillsManager } from './admin/SkillsManager';
import { ExperienceManager } from './admin/ExperienceManager';
import { ServicesManager } from './admin/ServicesManager';
import { GalleryManager } from './admin/GalleryManager';
import { ProfileManager } from './admin/ProfileManager';
import { MessagesManager } from './admin/MessagesManager';
import { SettingsManager } from './admin/SettingsManager';

const PortfolioApp: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  // App Navigation View
  const [currentView, setCurrentView] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [blogSearchTerm, setBlogSearchTerm] = useState<string>('');

  // Data Store
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [experience, setExperience] = useState<ExperienceType[]>(INITIAL_EXPERIENCE);
  const [education, setEducation] = useState<Education[]>(INITIAL_EDUCATION);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Fetch all Firestore content
  const loadAllPortfolioData = useCallback(async () => {
    try {
      const data = await firestoreService.getAllData();
      if (data.profile) setProfile(data.profile);
      if (data.projects && data.projects.length > 0) setProjects(data.projects);
      if (data.skills && data.skills.length > 0) setSkills(data.skills);
      if (data.experience && data.experience.length > 0) setExperience(data.experience);
      if (data.education && data.education.length > 0) setEducation(data.education);
      if (data.services && data.services.length > 0) setServices(data.services);
      if (data.gallery && data.gallery.length > 0) setGallery(data.gallery);
      if (data.blogPosts && data.blogPosts.length > 0) setBlogPosts(data.blogPosts);
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.warn('Using local bootstrap fallback for initial render:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllPortfolioData();
  }, [loadAllPortfolioData]);

  // Load messages if user is admin
  useEffect(() => {
    if (isAdmin) {
      firestoreService
        .getMessages()
        .then((msgs) => setMessages(msgs))
        .catch((err) => console.error('Error loading messages:', err));
    }
  }, [isAdmin, adminTab]);

  // Seed database handler
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await firestoreService.seedDatabase();
      showToast('Firestore collections seeded successfully!', 'success');
      await loadAllPortfolioData();
      if (isAdmin) {
        const msgs = await firestoreService.getMessages();
        setMessages(msgs);
      }
    } catch (err: any) {
      console.error('Seed error:', err);
      showToast(err.message || 'Error seeding database.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Scroll to top on navigation
  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'project-detail' && param) {
      setSelectedProjectSlug(param);
      setCurrentView('project-detail');
      return;
    }
    if (tab === 'blog-post' && param) {
      setSelectedPostSlug(param);
      setCurrentView('blog-post');
      return;
    }
    if (tab === 'projects') {
      setSelectedProjectSlug(null);
    }
    if (tab === 'blog') {
      setSelectedPostSlug(null);
      if (param !== undefined) {
        setBlogSearchTerm(param);
      }
    }
    setCurrentView(tab);
  };

  const handleSelectProject = (slugOrId: string) => {
    setSelectedProjectSlug(slugOrId);
    setCurrentView('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slugOrId: string) => {
    setSelectedPostSlug(slugOrId);
    setCurrentView('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selected project for detail view
  const currentProject = projects.find(
    (p) => p.slug === selectedProjectSlug || p.id === selectedProjectSlug
  ) || projects[0];

  // Selected blog post for reading view
  const currentBlogPost = blogPosts.find(
    (b) => b.slug === selectedPostSlug || b.id === selectedPostSlug
  ) || blogPosts[0];

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  // Render Admin View
  if (currentView === 'admin') {
    if (!isAdmin) {
      return (
        <AdminLogin
          onBackToPublic={() => handleNavigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
        onViewPublicSite={() => handleNavigate('home')}
        unreadMessagesCount={unreadCount}
      >
        {adminTab === 'dashboard' && (
          <DashboardOverview
            projects={projects}
            blogPosts={blogPosts}
            skills={skills}
            gallery={gallery}
            messages={messages}
            profile={profile}
            onNavigateTab={(tab) => setAdminTab(tab)}
            onSeedDatabase={handleSeedDatabase}
            isSeeding={isSeeding}
          />
        )}

        {adminTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'blog' && (
          <BlogManager
            posts={blogPosts}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'skills' && (
          <SkillsManager
            skills={skills}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'experience' && (
          <ExperienceManager
            experience={experience}
            education={education}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'services' && (
          <ServicesManager
            services={services}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'gallery' && (
          <GalleryManager
            gallery={gallery}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'profile' && (
          <ProfileManager
            profile={profile}
            onRefresh={loadAllPortfolioData}
          />
        )}

        {adminTab === 'messages' && (
          <MessagesManager
            messages={messages}
            onRefresh={async () => {
              const msgs = await firestoreService.getMessages();
              setMessages(msgs);
            }}
          />
        )}

        {adminTab === 'settings' && (
          <SettingsManager
            settings={settings}
            onRefresh={loadAllPortfolioData}
            onSeedDatabase={handleSeedDatabase}
            isSeeding={isSeeding}
          />
        )}
      </AdminLayout>
    );
  }

  // Render Public Website
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        currentTab={currentView}
        onNavigate={handleNavigate}
        resumeUrl={profile.resumeUrl}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            profile={profile}
            projects={projects}
            skills={skills}
            blogPosts={blogPosts}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <About
            profile={profile}
            education={education}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'projects' && (
          <Projects
            projects={projects.filter((p) => p.status === 'published')}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'project-detail' && currentProject && (
          <ProjectDetail
            project={currentProject}
            onBack={() => handleNavigate('projects')}
          />
        )}

        {currentView === 'skills' && (
          <Skills skills={skills} />
        )}

        {currentView === 'experience' && (
          <Experience
            experience={experience}
            education={education}
          />
        )}

        {currentView === 'services' && (
          <Services
            services={services}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'gallery' && (
          <Gallery items={gallery} />
        )}

        {currentView === 'blog' && (
          <Blog
            posts={blogPosts.filter((b) => b.status === 'published')}
            onSelectPost={handleSelectPost}
            initialSearch={blogSearchTerm}
          />
        )}

        {currentView === 'blog-post' && currentBlogPost && (
          <BlogPostView
            post={currentBlogPost}
            allPosts={blogPosts.filter((b) => b.status === 'published')}
            onBack={(searchTag) => handleNavigate('blog', searchTag)}
            onSelectPost={handleSelectPost}
          />
        )}

        {currentView === 'contact' && (
          <Contact profile={profile} />
        )}
      </main>

      <Footer
        profile={profile}
        settings={settings}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <PortfolioApp />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
