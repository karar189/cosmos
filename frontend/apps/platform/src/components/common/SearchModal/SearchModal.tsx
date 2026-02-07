/** @jsxImportSource @emotion/react */

import { BaseModal, Icon } from "@core3/ui-components";
import * as styles from "./SearchModal.styles";
import { useState, useEffect, useRef } from "react";
import { addRecentSearch, getRecentSearches, clearRecentSearches } from "./utils/recentSearches";
import { useRouter } from "next/navigation";
import { SearchInput } from "./components/SearchInput";
import { SearchResults } from "./components/SearchResults";
import { RecentSearches } from "./components/RecentSearches";
import { TrendingSection } from "./components/TrendingSection";
import useTranslation from "@/hooks/useTranslation";
import type { ProjectData, ExchangeData } from "./types";
import { useAllSearchableProjects, useProjectSearch } from "@/hooks/useProjectData";
import { useAllSearchableExchanges, useExchangeSearch } from "@/hooks/useExchangeData";
import { ROUTES } from "@/constants/routes";

export default function SearchModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { t } = useTranslation('search');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all projects for trending view (when no search query)
  const { data: allProjectsData = [], isLoading: _isLoadingAll } = useAllSearchableProjects();
  
  // Search projects when user types
  const { data: searchedProjects = [], isLoading: _isSearching } = useProjectSearch(searchQuery);

  // Fetch all exchanges for trending view (when no search query)
  const { data: allExchangesData = [], isLoading: _isLoadingAllExchanges } = useAllSearchableExchanges();
  
  // Search exchanges when user types
  const { data: searchedExchanges = [], isLoading: _isSearchingExchanges } = useExchangeSearch(searchQuery);

  // Filter projects based on search query - now using real data
  const filteredProjects = searchQuery ? searchedProjects : [];

  // Filter exchanges based on search query - now using real data
  const filteredExchanges = searchQuery ? searchedExchanges : [];

  // Get trending projects (first 3 from all projects)
  const trendingProjects = allProjectsData.slice(0, 3);
  
  // Get trending exchanges (first 3 from all exchanges)
  const trendingExchanges = allExchangesData.slice(0, 3);

  // Handle row click - save to recent searches
  const handleItemClick = (item: ProjectData | ExchangeData, type: 'project' | 'exchange') => {
    if (type === 'project') {
      const projectItem = item as ProjectData;
      router.push(ROUTES.PROJECTS.DETAILS(item.id));

      addRecentSearch({
        id: item.id,
        name: projectItem.project,
        type: 'project',
        chain: projectItem.chain,
        pol: projectItem.pol,
        logo: projectItem.logo,
      });
    } else {
      const exchangeItem = item as ExchangeData;
      router.push(ROUTES.EXCHANGES.DETAILS(item.id));

      addRecentSearch({
        id: item.id,
        name: exchangeItem.name,
        type: 'exchange',
        pol: exchangeItem.security, // Exchange uses security instead of pol
        logo: exchangeItem.logo,
      });
    }
    
    setRecentSearches(getRecentSearches());
    onClose();
  };

  // Handle recent search click - just navigate, already in recent searches
  const handleRecentSearchClick = (item: typeof recentSearches[0]) => {
    if (item.type === 'project') {
      router.push(ROUTES.PROJECTS.DETAILS(item.id));
    } else {
      router.push(ROUTES.EXCHANGES.DETAILS(item.id));
    }
    onClose();
  };

  // Handle clear all recent searches
  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Get all available items for navigation
  const allItems = (() => {
    if (searchQuery) {
      // When searching, include category links if they're clickable (count > 3)
      const items: Array<{ 
        item?: ProjectData | ExchangeData; 
        type: string; 
        index: number; 
        isLink?: boolean; 
        onClick?: () => void 
      }> = [];
      
      if (filteredProjects.length > 0) {
        // Add category link for projects if clickable
        if (filteredProjects.length > 3) {
          items.push({ type: 'categoryLink', index: items.length, isLink: true, onClick: () => router.push(ROUTES.RATINGS.PROJECTS_SEARCH(searchQuery)) });
        }
        // Add project results
        filteredProjects.slice(0, 3).forEach((project) => {
          items.push({ item: project, type: 'project', index: items.length });
        });
      }
      
      if (filteredExchanges.length > 0) {
        // Add category link for exchanges if clickable
        if (filteredExchanges.length > 3) {
          items.push({ type: 'categoryLink', index: items.length, isLink: true, onClick: () => router.push(ROUTES.RATINGS.EXCHANGES_SEARCH(searchQuery)) });
        }
        // Add exchange results
        filteredExchanges.slice(0, 3).forEach((exchange) => {
          items.push({ item: exchange, type: 'exchange', index: items.length });
        });
      }
      
      return items;
    } else {
      // When not searching, show recent searches and trending
      const recent = recentSearches.map((item, index) => ({ item, type: 'recent' as const, index }));
      const trending = trendingProjects.map((item, index) => ({ item, type: 'project' as const, index }));
      const trendingExchangesItems = trendingExchanges.map((item, index) => ({ item, type: 'exchange' as const, index }));
      return [...recent, ...trending, ...trendingExchangesItems];
    }
  })();

  // Reset selection when query or modal changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery, open]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      // Delay to allow modal animation to complete
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < allItems.length) {
            e.preventDefault();
            const selected = allItems[selectedIndex];
            if (selected.type === 'categoryLink' && selected.onClick) {
              selected.onClick();
              onClose();
            } else if (selected.type === 'recent') {
              handleRecentSearchClick(selected.item as typeof recentSearches[0]);
            } else if (selected.item && (selected.type === 'project' || selected.type === 'exchange')) {
              handleItemClick(selected.item as ProjectData | ExchangeData, selected.type);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      variant="fullscreen"
      containerCss={styles.modalContainer}
      boxCss={styles.modalBox}
      contentCss={styles.contentWrapper}
      ariaLabelledBy="search-modal-title"
      ariaDescribedBy="search-modal-description"
    >
      <div css={styles.container} role="dialog" aria-modal="true">
        <h2 id="search-modal-title" css={styles.visuallyHidden}>
          {t('aria.search', 'Search projects and exchanges')}
        </h2>
        <p id="search-modal-description" css={styles.visuallyHidden}>
          {t('aria.search', 'Search for projects and exchanges')}
        </p>
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          onClose={onClose}
          inputRef={inputRef}
        />

        <div css={styles.content}>
          {searchQuery ? (
            <SearchResults 
              filteredProjects={filteredProjects}
              filteredExchanges={filteredExchanges}
              onItemClick={handleItemClick}
              selectedIndex={selectedIndex}
              searchQuery={searchQuery}
            />
          ) : (
            <>
              <RecentSearches 
                items={recentSearches}
                onItemClick={handleRecentSearchClick}
                onClear={handleClearRecentSearches}
                selectedIndex={selectedIndex}
              />
              <TrendingSection 
                projects={trendingProjects}
                exchanges={trendingExchanges}
                onItemClick={handleItemClick}
                selectedIndex={selectedIndex - recentSearches.length}
              />
            </>
          )}
        </div>

        {/* Only show navigation helper when there are results or trending/recent items */}
        {(searchQuery ? (filteredProjects.length > 0 || filteredExchanges.length > 0) : (recentSearches.length > 0 || trendingProjects.length > 0 || trendingExchanges.length > 0)) && (
          <div css={styles.navHelper} role="status" aria-label="Keyboard shortcuts">
            <div css={styles.navHelperItem}>
              <div css={styles.keyIcon} aria-hidden="true">
                <Icon name="arrow-up" />
              </div>
              <div css={styles.keyIcon} aria-hidden="true">
                <Icon name="arrow-down" />
              </div>
              <span>{t('navigation.toNavigate', 'to navigate')}</span>
            </div>
            <div css={styles.navHelperItem}>
              <div css={styles.keyIcon} aria-hidden="true">
                {t('navigation.esc', 'Esc')}
              </div>
              <span>{t('navigation.toExit', 'to exit')}</span>
            </div>
            <div css={styles.navHelperItem}>
              <div css={styles.keyIcon} aria-hidden="true">
                <Icon name="arrow-enter" />
              </div>
              <span>{t('navigation.toSelect', 'to select')}</span>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
