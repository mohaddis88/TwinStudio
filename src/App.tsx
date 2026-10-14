import { useState, useEffect } from 'react';
import { PageId, Model, ModelFilters, UserSession, ThemeMode } from './types';
import { api } from './services/twinStudioApi';
import { auth } from './services/auth';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Theme State: CSS variables, data-theme="light|dark", default = system, saved
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('twinstudio_theme_v3');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
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
  const [user, setUser] = useState<UserSession | null>(() => auth.getCurrentUser());
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

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[var(--border-focus)] selection:text-white">
      {/* 2. Cursor Glow Follower */}
      <CursorGlow />

      {/* Shared Header with spring pill behavior & theme toggle */}
      <Header
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

      {/* Main Page Layout Container (1200px max width, mobile-first) */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-16">
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
          />
        )}

        {currentPage === 'model-detail' && selectedModel && (
          <ModelDetailPage
            model={selectedModel}
            onBack={() => setCurrentPage('gallery')}
            onUseModel={handleUseModelInStudio}
            onReplaceMedia={handleReplaceMedia}
          />
        )}

        {currentPage === 'studio' && (
          <StudioPage
            models={models}
            selectedModel={selectedModel || models[0]}
            onSelectModel={setSelectedModel}
            onBrowseGallery={() => setCurrentPage('gallery')}
            onCreateTwin={() => navigateWithAuthCheck('create-twin')}
            onToast={(msg, type) => showToast(msg, type || 'success')}
          />
        )}

        {currentPage === 'create-twin' && (
          <CreateTwinPage
            onTwinCreated={handleTwinCreated}
            onBrowseGallery={() => setCurrentPage('gallery')}
            onToast={(msg, type) => showToast(msg, type || 'success')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onToast={(msg, type) => showToast(msg, type || 'success')}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            onSuccess={handleSignInSuccess}
            onCancel={() => {
              if (redirectAfterAuth) {
                setCurrentPage('home');
                setRedirectAfterAuth(null);
              } else {
                setCurrentPage('home');
              }
            }}
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
