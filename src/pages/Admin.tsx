import React, { useState, useRef } from 'react';
import { PageId } from '../types';
import {
  cmsStore,
  useCmsContent,
  useCmsModels,
  CmsModel,
  SiteContent,
  putMediaBlob,
  blobToDataUrl,
  deleteMediaBlob,
  listMediaKeys,
} from '../lib/cmsStore';
import { AvatarPlaceholder } from '../components/ui/AvatarPlaceholder';

interface AdminProps {
  onNavigate: (page: PageId) => void;
}

type AdminTab = 'models' | 'home' | 'other' | 'media' | 'backup';

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const [content, setContent] = useCmsContent();
  const [models, setModels] = useCmsModels();

  const [activeTab, setActiveTab] = useState<AdminTab>('models');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');

  // Form states for content edits
  const [contentDraft, setContentDraft] = useState<SiteContent>(content);
  // Track selected model being edited
  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];
  const [modelDraft, setModelDraft] = useState<CmsModel>(currentModel || ({} as CmsModel));

  // Sync draft when selected model changes
  const handleSelectModel = (m: CmsModel) => {
    setSelectedModelId(m.id);
    setModelDraft({ ...m });
  };

  const triggerSavedToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2400);
  };

  // Save Content
  const handleSaveContent = () => {
    setContent(contentDraft);
    triggerSavedToast();
  };

  // Save Model
  const handleSaveModel = () => {
    cmsStore.saveModel(modelDraft);
    triggerSavedToast();
  };

  // Add New Model
  const handleAddNewModel = () => {
    const newId = `model-${Date.now()}`;
    const newModel: CmsModel = {
      id: newId,
      slug: `creator-${models.length + 1}`,
      name: `New Creator ${models.length + 1}`,
      creatorNumber: `Creator No. 0${models.length + 1}`,
      role: 'Growth Marketing Creator',
      discipline: 'E-commerce & UGC',
      niche: 'Lifestyle & Product Reviews',
      year: '2026',
      bio: 'Natural conversational speaker with direct camera gaze and engaging pacing.',
      gender: 'Female',
      traits: ['Relatable', 'Articulate', 'Warm'],
      languages: ['English', 'Bahasa Malaysia'],
      tone: 'Warm, authentic',
      status: 'published',
      angles: {},
      voiceSamples: {},
      voiceIds: { en: '21m00Tcm4TlvDq8ikWAM' },
      characterPrompt: '',
      specs: {
        bestFor: 'TikTok Ads, Reels',
        speakingStyle: 'Warm, conversational',
        cameraStyles: 'Selfie, Talking head',
        turnaround: '~2 minutes per 9:16 clip',
      },
    };
    cmsStore.saveModel(newModel);
    handleSelectModel(newModel);
    triggerSavedToast();
  };

  // Delete Model
  const handleDeleteModel = (id: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      cmsStore.deleteModel(id);
      const remaining = models.filter((m) => m.id !== id);
      if (remaining.length > 0) {
        handleSelectModel(remaining[0]);
      }
      triggerSavedToast();
    }
  };

  // File Upload Handlers
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    angleSlot: 'front' | 'left' | 'right'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await blobToDataUrl(file);
      const idbKey = `img_${modelDraft.id}_${angleSlot}_${Date.now()}`;
      await putMediaBlob(idbKey, file);

      const updated = {
        ...modelDraft,
        photoUrl: angleSlot === 'front' ? dataUrl : modelDraft.photoUrl || dataUrl,
        angles: {
          ...modelDraft.angles,
          [angleSlot]: dataUrl,
        },
      };
      setModelDraft(updated);
      cmsStore.saveModel(updated);
      triggerSavedToast();
    } catch (err) {
      console.error('Failed to upload image:', err);
    }
  };

  const handleClearImage = (angleSlot: 'front' | 'left' | 'right') => {
    const updatedAngles = { ...modelDraft.angles };
    delete updatedAngles[angleSlot];

    const updated = {
      ...modelDraft,
      photoUrl: angleSlot === 'front' ? undefined : modelDraft.photoUrl,
      angles: updatedAngles,
    };
    setModelDraft(updated);
    cmsStore.saveModel(updated);
    triggerSavedToast();
  };

  const handleAudioUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    lang: 'en' | 'ms' | 'zh'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await blobToDataUrl(file);
      const idbKey = `audio_${modelDraft.id}_${lang}_${Date.now()}`;
      await putMediaBlob(idbKey, file);

      const updated = {
        ...modelDraft,
        voiceSamples: {
          ...modelDraft.voiceSamples,
          [lang]: dataUrl,
        },
      };
      setModelDraft(updated);
      cmsStore.saveModel(updated);
      triggerSavedToast();
    } catch (err) {
      console.error('Failed to upload audio:', err);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await blobToDataUrl(file);
      const idbKey = `video_${modelDraft.id}_${Date.now()}`;
      await putMediaBlob(idbKey, file);

      const updated = {
        ...modelDraft,
        sampleVideoUrl: dataUrl,
      };
      setModelDraft(updated);
      cmsStore.saveModel(updated);
      triggerSavedToast();
    } catch (err) {
      console.error('Failed to upload video:', err);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await blobToDataUrl(file);
      await putMediaBlob('img_hero_bust', file);

      const updated = {
        ...contentDraft,
        hero: {
          ...contentDraft.hero,
          heroAvatarImageUrl: dataUrl,
        },
      };
      setContentDraft(updated);
      cmsStore.setContent(updated);
      triggerSavedToast();
    } catch (err) {
      console.error('Failed to upload hero image:', err);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = cmsStore.exportConfigJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinstudio_cms_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (cmsStore.importConfigJson(text)) {
        setContentDraft(cmsStore.getContent());
        const newModels = cmsStore.getModels();
        if (newModels.length > 0) handleSelectModel(newModels[0]);
        triggerSavedToast();
        alert('Configuration imported successfully!');
      } else {
        alert('Failed to import JSON file. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all website text, models, and media back to default factory settings?')) {
      cmsStore.resetToDefaults();
      setContentDraft(cmsStore.getContent());
      const defaultM = cmsStore.getModels();
      if (defaultM.length > 0) handleSelectModel(defaultM[0]);
      triggerSavedToast();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 flex flex-col font-sans">
      {/* =======================================================================
          TOP BAR NAVIGATION
          ======================================================================= */}
      <header className="sticky top-0 z-50 h-16 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight">TwinStudio®</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--text)] text-[var(--bg)] font-mono font-medium">
            CMS Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Saved Toast Indicator */}
          {showSavedToast && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b6d34] text-white text-xs font-medium animate-in fade-in duration-200">
              <span>✓</span>
              <span>Saved live</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            View Live Site
          </button>
        </div>
      </header>

      {/* =======================================================================
          MAIN ADMIN WORKSPACE: SIDEBAR + CONTENT
          ======================================================================= */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 p-6 sm:p-8">
        {/* Left Sidebar Tabs */}
        <aside className="space-y-1.5">
          {[
            { id: 'models' as AdminTab, label: '01 Models Manager' },
            { id: 'home' as AdminTab, label: '02 Home Copy & Sections' },
            { id: 'other' as AdminTab, label: '03 Other Pages Copy' },
            { id: 'media' as AdminTab, label: '04 Media & Audio' },
            { id: 'backup' as AdminTab, label: '05 Backup / Reset' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="w-full text-left px-3.5 py-2.5 rounded-[6px] text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none"
                style={{
                  background: isActive ? 'var(--text)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--text-secondary)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel */}
        <div className="rounded-[8px] bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 min-h-[600px]">
          {/* ===================================================================
              TAB 1: MODELS MANAGER
              =================================================================== */}
          {activeTab === 'models' && (
            <div className="space-y-8">
              {/* Models List Header & Add Button */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="text-xl font-medium m-0">Models Manager</h2>
                  <p className="text-xs text-[var(--text-secondary)] m-0 mt-0.5">
                    Add, edit, upload photos, audio, and videos for AI creators.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewModel}
                  className="px-4 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                >
                  + Add New Model
                </button>
              </div>

              {/* Models Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {models.map((m) => {
                  const isSelected = m.id === selectedModelId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectModel(m)}
                      className="px-4 py-2 rounded-[6px] border text-xs font-medium cursor-pointer transition-all flex items-center gap-2"
                      style={{
                        background: isSelected ? 'var(--text)' : 'var(--bg)',
                        color: isSelected ? 'var(--bg)' : 'var(--text)',
                        borderColor: isSelected ? 'var(--text)' : 'var(--border)',
                      }}
                    >
                      <span>{m.name}</span>
                      <span className="text-[10px] opacity-60">({m.status})</span>
                    </button>
                  );
                })}
              </div>

              {/* Model Edit Form */}
              {modelDraft && (
                <div className="space-y-6 pt-4 border-t border-[var(--border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Model Name
                      </label>
                      <input
                        type="text"
                        value={modelDraft.name || ''}
                        onChange={(e) => setModelDraft({ ...modelDraft, name: e.target.value })}
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={modelDraft.slug || ''}
                        onChange={(e) => setModelDraft({ ...modelDraft, slug: e.target.value })}
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Creator Number Tag
                      </label>
                      <input
                        type="text"
                        value={modelDraft.creatorNumber || ''}
                        onChange={(e) =>
                          setModelDraft({ ...modelDraft, creatorNumber: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Discipline / Role
                      </label>
                      <input
                        type="text"
                        value={modelDraft.discipline || ''}
                        onChange={(e) =>
                          setModelDraft({ ...modelDraft, discipline: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Niche Description
                      </label>
                      <input
                        type="text"
                        value={modelDraft.niche || ''}
                        onChange={(e) => setModelDraft({ ...modelDraft, niche: e.target.value })}
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Human Bio (2 Lines)
                      </label>
                      <textarea
                        rows={2}
                        value={modelDraft.bio || ''}
                        onChange={(e) => setModelDraft({ ...modelDraft, bio: e.target.value })}
                        className="w-full p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Gender
                      </label>
                      <select
                        value={modelDraft.gender || 'Female'}
                        onChange={(e) =>
                          setModelDraft({ ...modelDraft, gender: e.target.value as any })
                        }
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                        Status
                      </label>
                      <select
                        value={modelDraft.status || 'published'}
                        onChange={(e) =>
                          setModelDraft({ ...modelDraft, status: e.target.value as any })
                        }
                        className="w-full h-10 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* ===========================================================
                      IMAGE UPLOADERS (Front, Left, Right Profile)
                      =========================================================== */}
                  <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                      Angle Photos & Visual Assets
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] m-0">
                      Upload high-res images. If cleared, automatically reverts to the flat Facebook-style avatar placeholder.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      {[
                        { slot: 'front' as const, label: 'Main Front Portrait' },
                        { slot: 'left' as const, label: 'Left Side Profile' },
                        { slot: 'right' as const, label: 'Right Side Profile' },
                      ].map((angle) => {
                        const imgUrl = modelDraft.angles?.[angle.slot];
                        return (
                          <div
                            key={angle.slot}
                            className="p-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] space-y-2 text-center"
                          >
                            <span className="text-[11px] font-medium block">{angle.label}</span>
                            <div className="aspect-[3/4] w-24 mx-auto rounded-[4px] overflow-hidden border border-[var(--border)] relative bg-[var(--surface-2)]">
                              {imgUrl ? (
                                <img src={imgUrl} alt={angle.label} className="w-full h-full object-cover" />
                              ) : (
                                <AvatarPlaceholder aspectRatio="3/4" />
                              )}
                            </div>

                            <div className="flex items-center justify-center gap-2 pt-1">
                              <label className="px-2.5 py-1 rounded-full bg-[var(--text)] text-[var(--bg)] text-[10px] font-medium cursor-pointer hover:opacity-80">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, angle.slot)}
                                />
                              </label>

                              {imgUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleClearImage(angle.slot)}
                                  className="text-[10px] text-[var(--text-muted)] hover:text-[var(--status-error)]"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ===========================================================
                      AUDIO & VOICE SAMPLE UPLOADERS
                      =========================================================== */}
                  <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                      Multi-Language Voice Samples (.mp3 / .wav)
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] m-0">
                      Upload 10-second demo clips for each language. If no file is uploaded, a synthesized vocal tone plays automatically.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      {[
                        { lang: 'en' as const, label: 'English Voice (.mp3)' },
                        { lang: 'ms' as const, label: 'Bahasa Malaysia (.mp3)' },
                        { lang: 'zh' as const, label: 'Mandarin (.mp3)' },
                      ].map((item) => {
                        const hasAudio = !!modelDraft.voiceSamples?.[item.lang];
                        return (
                          <div
                            key={item.lang}
                            className="p-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] space-y-2"
                          >
                            <span className="text-[11px] font-medium block">{item.label}</span>
                            <div className="text-[10px] text-[var(--text-secondary)] truncate">
                              {hasAudio ? '✓ Uploaded audio sample' : 'Default synthesizer active'}
                            </div>
                            <label className="inline-block px-3 py-1 rounded-full bg-[var(--text)] text-[var(--bg)] text-[10px] font-medium cursor-pointer hover:opacity-80">
                              Upload MP3
                              <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={(e) => handleAudioUpload(e, item.lang)}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ===========================================================
                      SAMPLE VIDEO UPLOADER
                      =========================================================== */}
                  <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                      Sample 9:16 Video Ad Take (.mp4)
                    </h3>
                    <div className="p-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-between">
                      <div className="text-xs text-[var(--text-secondary)]">
                        {modelDraft.sampleVideoUrl ? '✓ Custom MP4 video attached' : 'Default preview player active'}
                      </div>
                      <label className="px-3.5 py-1.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-80">
                        Upload MP4
                        <input
                          type="file"
                          accept="video/mp4"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons: Save & Delete */}
                  <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteModel(modelDraft.id)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--status-error)] cursor-pointer"
                    >
                      Delete Model
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveModel}
                      className="px-6 py-2.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90"
                    >
                      Save Model Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              TAB 2: HOME PAGE COPY & SECTIONS
              =================================================================== */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="border-b border-[var(--border)] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium m-0">Home Page Copy Editor</h2>
                  <p className="text-xs text-[var(--text-secondary)] m-0 mt-0.5">
                    Edit any text on the home page and save live.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveContent}
                  className="px-6 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90"
                >
                  Save Live
                </button>
              </div>

              {/* 1. Hero Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                  Section 1: Hero
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Eyebrow</label>
                    <input
                      type="text"
                      value={contentDraft.hero.eyebrow}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, eyebrow: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Background Watermark</label>
                    <input
                      type="text"
                      value={contentDraft.hero.watermark}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, watermark: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Heading Line 1 (Sans)</label>
                    <input
                      type="text"
                      value={contentDraft.hero.headingSans}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, headingSans: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Heading Line 2 (Italic Serif)</label>
                    <input
                      type="text"
                      value={contentDraft.hero.headingItalic}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, headingItalic: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Description</label>
                    <textarea
                      rows={2}
                      value={contentDraft.hero.description}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, description: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Primary Button Text</label>
                    <input
                      type="text"
                      value={contentDraft.hero.primaryCta}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, primaryCta: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Secondary Link Text</label>
                    <input
                      type="text"
                      value={contentDraft.hero.secondaryCta}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          hero: { ...contentDraft.hero, secondaryCta: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>

                  {/* Hero Centerpiece Image Uploader */}
                  <div className="sm:col-span-2 p-4 rounded-[8px] border border-[var(--border)] bg-[var(--bg)] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
                        Hero Centerpiece Image (Converted to Particles)
                      </label>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Samples 3D sculpture pixels into 25,000+ interactive particles
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-[4px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0">
                        <img
                          src={contentDraft.hero.heroAvatarImageUrl || '/hero-bust.webp'}
                          alt="Hero centerpiece preview"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="text-xs text-[var(--text-secondary)] truncate">
                          Active file: <span className="font-mono text-[11px] text-[var(--text)]">{contentDraft.hero.heroAvatarImageUrl || '/hero-bust.webp'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="px-3.5 py-1.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-80">
                            Upload Custom Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleHeroImageUpload}
                            />
                          </label>

                          {contentDraft.hero.heroAvatarImageUrl && contentDraft.hero.heroAvatarImageUrl !== '/hero-bust.webp' && (
                            <button
                              type="button"
                              onClick={() => {
                                const resetContent = {
                                  ...contentDraft,
                                  hero: { ...contentDraft.hero, heroAvatarImageUrl: '/hero-bust.webp' },
                                };
                                setContentDraft(resetContent);
                                cmsStore.setContent(resetContent);
                                triggerSavedToast();
                              }}
                              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
                            >
                              Reset to default bust
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Studio Statement */}
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                  Section 2: Studio Statement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Line 1</label>
                    <input
                      type="text"
                      value={contentDraft.statement.line1}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          statement: { ...contentDraft.statement, line1: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Line 2 Italic Accent</label>
                    <input
                      type="text"
                      value={contentDraft.statement.line2Accent}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          statement: { ...contentDraft.statement, line2Accent: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Description</label>
                    <textarea
                      rows={2}
                      value={contentDraft.statement.description}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          statement: { ...contentDraft.statement, description: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Approach Steps */}
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                  Section 4: Approach Steps
                </h3>
                <div className="space-y-4">
                  {contentDraft.approach.steps.map((step, idx) => (
                    <div
                      key={step.num}
                      className="p-3 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs">{step.num}</span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newSteps = [...contentDraft.approach.steps];
                            newSteps[idx].title = e.target.value;
                            setContentDraft({
                              ...contentDraft,
                              approach: { ...contentDraft.approach, steps: newSteps },
                            });
                          }}
                          className="flex-1 h-8 px-2 rounded border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] font-medium"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={step.text}
                        onChange={(e) => {
                          const newSteps = [...contentDraft.approach.steps];
                          newSteps[idx].text = e.target.value;
                          setContentDraft({
                            ...contentDraft,
                            approach: { ...contentDraft.approach, steps: newSteps },
                          });
                        }}
                        className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveContent}
                  className="px-6 py-2.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90"
                >
                  Save Home Page Changes
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 3: OTHER PAGES (About, Contact, Footer)
              =================================================================== */}
          {activeTab === 'other' && (
            <div className="space-y-8">
              <div className="border-b border-[var(--border)] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium m-0">Other Pages & Footer Copy</h2>
                  <p className="text-xs text-[var(--text-secondary)] m-0 mt-0.5">
                    Edit copy for About, Contact, and the Footer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveContent}
                  className="px-6 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90"
                >
                  Save Live
                </button>
              </div>

              {/* Footer Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] m-0">
                  Global Footer & Studio Contact Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Footer Heading Sans</label>
                    <input
                      type="text"
                      value={contentDraft.footer.headingSans}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          footer: { ...contentDraft.footer, headingSans: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Footer Heading Italic</label>
                    <input
                      type="text"
                      value={contentDraft.footer.headingItalic}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          footer: { ...contentDraft.footer, headingItalic: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Studio Email</label>
                    <input
                      type="text"
                      value={contentDraft.footer.email}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          footer: { ...contentDraft.footer, email: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Phone Number</label>
                    <input
                      type="text"
                      value={contentDraft.footer.phone}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          footer: { ...contentDraft.footer, phone: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase text-[var(--text-secondary)]">Studio Physical Address</label>
                    <input
                      type="text"
                      value={contentDraft.footer.address}
                      onChange={(e) =>
                        setContentDraft({
                          ...contentDraft,
                          footer: { ...contentDraft.footer, address: e.target.value },
                        })
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveContent}
                  className="px-6 py-2.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 4: MEDIA & VOICE UPLOADS
              =================================================================== */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-medium m-0">Media & Voice Storage (IndexedDB)</h2>
                <p className="text-xs text-[var(--text-secondary)] m-0 mt-0.5">
                  Uploaded image files and audio MP3s are stored locally in high-capacity IndexedDB storage without quota limits.
                </p>
              </div>

              <div className="p-4 rounded-[6px] bg-[var(--bg)] border border-[var(--border)] text-xs space-y-2">
                <div className="font-semibold text-[var(--text)]">Storage Mode: Local Browser IndexedDB</div>
                <div className="text-[var(--text-secondary)]">
                  All media blobs are persisted to your browser database and referenced instantaneously across all views.
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 5: BACKUP / RESET / EXPORT
              =================================================================== */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-medium m-0">Backup, Export & Reset</h2>
                <p className="text-xs text-[var(--text-secondary)] m-0 mt-0.5">
                  Export full website configuration to commit to git, or restore from a JSON file.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] space-y-3">
                  <h3 className="text-sm font-medium m-0">Export JSON Configuration</h3>
                  <p className="text-xs text-[var(--text-secondary)] m-0">
                    Download complete snapshot of all text copy, model data, and configuration.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-4 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90"
                  >
                    Download JSON File
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] space-y-3">
                  <h3 className="text-sm font-medium m-0">Import JSON Configuration</h3>
                  <p className="text-xs text-[var(--text-secondary)] m-0">
                    Upload a previously exported JSON file to restore website content.
                  </p>
                  <label className="inline-block px-4 py-2 rounded-full border border-[var(--border-strong)] text-[var(--text)] text-xs font-medium cursor-pointer hover:bg-[var(--surface-2)]">
                    Upload JSON File
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportJson}
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="pt-6 border-t border-[var(--border)]">
                <div className="p-5 rounded-[6px] border border-[var(--status-error)]/30 bg-[var(--status-error)]/5 space-y-3">
                  <h3 className="text-sm font-medium text-[var(--status-error)] m-0">
                    Reset Website to Factory Defaults
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] m-0">
                    This will clear all localStorage CMS overrides and restore original factory defaults.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="px-4 py-2 rounded-full bg-[var(--status-error)] text-white text-xs font-medium cursor-pointer hover:opacity-90"
                  >
                    Reset Everything to Factory Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
