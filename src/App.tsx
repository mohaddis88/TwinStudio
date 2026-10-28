import { useState, useEffect } from 'react';
import { PageId, Model, ModelFilters, UserSession, ThemeMode } from './types';
import { api } from './services/twinStudioApi';
import { auth } from './services/auth';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { CursorGlow } from './components/common/CursorGlow';
import { Toast, ToastMessage } from './components/common/Toast';
import { PageOverlayScrollbar } from './components/common/OverlayScrollbar';
import { HomePage } from './components/home/HomePage';
import { GalleryPage } from './components/gallery/GalleryPage';
import { ModelDetailPage } from './components/detail/ModelDetailPage';
import { StudioPage } from './components/studio/StudioPage';
import { CreateTwinPage } from './components/twin/CreateTwinPage';
import { AboutPage } from './components/about/AboutPage';
import { ContactPage } from './components/contact/ContactPage';
import { AuthPage } from './components/auth/AuthPage';
import { Admin } from './pages/Admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'gallery', 'studio', 'create-twin', 'about', 'contact', 'admin', 'auth'].includes(hash)) {
        return hash as PageId;
      }
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam && ['home', 'gallery', 'studio', 'create-twin', 'about', 'contact', 'admin', 'auth'].includes(pageParam)) {
        return pageParam as PageId;
      }
      if (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#/admin' ||
        window.location.search.includes('admin')
      ) {
        return 'admin';
      }
      if (
        window.location.pathname.startsWith('/auth') ||
        window.location.hash === '#/auth' ||
        window.location.search.includes('auth')
      ) {
        return 'auth';
      }
    }
    return 'home';
  });
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Theme State: CSS variables, data-theme="light|dark", default = system, saved
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('twinstudio_theme_v3');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('twinstudio_theme_v3', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User Auth Session
  const [user, setUser] = useState<UserSession | null>(() => {
    const current = auth.getCurrentUser();
    if (current) return current;
    return {
      id: 'usr_adamsanders',
      name: 'Adamsanders8',
      email: 'adamsanders8@twinstudio.ai',
      role: 'Creator Lead',
      company: 'TwinStudio',
    };
  });
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<PageId | null>(null);

  // Filters for Meet the Models
  const [filters, setFilters] = useState<ModelFilters>({
    search: '',
    gender: 'All',
    niche: 'All',
    language: 'All',
  });

  // Global Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success', actionLabel?: string, onAction?: () => void) => {
    setToast({
      id: `toast-${Date.now()}`,
      type,
      message,
      actionLabel,
      onAction,
    });
  };

  // Load models from service
  useEffect(() => {
    let isMounted = true;
    setIsLoadingModels(true);
    api.getModels(filters).then((data) => {
      if (isMounted) {
        setModels(data);
        if (!selectedModel && data.length > 0) {
          setSelectedModel(data[0]);
        }
        setIsLoadingModels(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Auth gate check
  const navigateWithAuthCheck = (targetPage: PageId) => {
    if ((targetPage === 'create-twin' || targetPage === 'studio') && !user) {
      setRedirectAfterAuth(targetPage);
      setCurrentPage('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = (session: UserSession) => {
    setUser(session);
    showToast(`Signed in as ${session.name}. Workspace ready.`);
    if (redirectAfterAuth) {
      setCurrentPage(redirectAfterAuth);
      setRedirectAfterAuth(null);
    } else {
      setCurrentPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    auth.signOut();
    setUser(null);
    showToast('Signed out of workspace.', 'warning');
  };

  const handleSelectModelFromGallery = (model: Model) => {
    setSelectedModel(model);
    setCurrentPage('model-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseModelInStudio = (model: Model) => {
    setSelectedModel(model);
    navigateWithAuthCheck('studio');
  };

  const handleTwinCreated = (newTwin: Model) => {
    setModels((prev) => [newTwin, ...prev.filter((m) => m.id !== newTwin.id)]);
    setSelectedModel(newTwin);
    setCurrentPage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Twin ${newTwin.name} calibrated and saved to your private workspace.`);
  };

  const handleReplaceMedia = async (slot: 'front' | 'side' | 'up' | 'down', dataUrl: string) => {
    if (!selectedModel) return;
    try {
      const updated = await api.replaceModelMedia(selectedModel.id, slot, dataUrl);
      setSelectedModel(updated);
      setModels((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showToast(`Custom photo for ${slot} angle updated successfully.`);
    } catch {
      showToast('Could not save custom image. Please try another file.', 'error', 'Try again');
    }
  };

  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col relative">
        <CursorGlow />
        <Admin
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    );
  }

  if (currentPage === 'auth') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-[#040b1a]">
        <AuthPage
          onSuccess={handleSignInSuccess}
          onCancel={() => {
            if (redirectAfterAuth) {
              setCurrentPage(redirectAfterAuth);
              setRedirectAfterAuth(null);
            } else {
              setCurrentPage('home');
            }
          }}
          theme={theme}
        />
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    );
  }



  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 2. Cursor Glow Follower */}
      <CursorGlow />

      {/* Shared Nav with fixed full-width editorial layout & theme toggle */}
      <Nav
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'create-twin' || page === 'studio') {
            navigateWithAuthCheck(page);
          } else {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        user={user}
        onSignOut={handleSignOut}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Layout Container */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(page) => {
              if (page === 'create-twin' || page === 'studio') {
                navigateWithAuthCheck(page);
              } else {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            models={models}
            isLoading={isLoadingModels}
            filters={filters}
            onFilterChange={setFilters}
            onSelectModel={handleSelectModelFromGallery}
            onUseDirectly={handleUseModelInStudio}
            onCreateTwinClick={() => navigateWithAuthCheck('create-twin')}
            theme={theme}
          />
        )}

        {currentPage === 'model-detail' && selectedModel && (
          <ModelDetailPage
            model={selectedModel}
            onBack={() => setCurrentPage('gallery')}
            onUseModel={handleUseModelInStudio}
            onReplaceMedia={handleReplaceMedia}
            theme={theme}
          />
        )}

        {currentPage === 'studio' && (
          <StudioPage
            models={models}
            selectedModel={selectedModel || models[0]}
            onSelectModel={setSelectedModel}
            onBrowseGallery={() => setCurrentPage('gallery')}
            onCreateTwin={() => navigateWithAuthCheck('create-twin')}
            onToast={(msg: string, type?: 'success' | 'warning' | 'error') => showToast(msg, type || 'success')}
            theme={theme}
          />
        )}

        {currentPage === 'create-twin' && (
          <CreateTwinPage
            onTwinCreated={handleTwinCreated}
            onBrowseGallery={() => setCurrentPage('gallery')}
            onToast={(msg: string, type?: 'success' | 'warning' | 'error') => showToast(msg, type || 'success')}
            theme={theme}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={(page: PageId) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            theme={theme}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onToast={(msg: string, type?: 'success' | 'warning' | 'error') => showToast(msg, type || 'success')}
            theme={theme}
          />
        )}
      </main>

      {/* Shared Footer */}
      <Footer
        onNavigate={(page) => {
          if (page === 'create-twin' || page === 'studio') {
            navigateWithAuthCheck(page);
          } else {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Global Toast for notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Auto-hiding floating overlay scrollbar */}
      <PageOverlayScrollbar />
    </div>
  );
}
