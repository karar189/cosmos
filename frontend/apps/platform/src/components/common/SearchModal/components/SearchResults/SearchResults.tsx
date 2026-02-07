/** @jsxImportSource @emotion/react */

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@core3/ui-components";
import { useRouter } from "next/navigation";
import { ResultsTable } from "../ResultsTable";
import { CategoryLink } from "../CategoryLink";
import * as styles from "./SearchResults.styles";
import useTranslation from "@/hooks/useTranslation";
import { ROUTES } from "@/constants/routes";
import type { ProjectData, ExchangeData } from "../../types";

interface SearchResultsProps {
  filteredProjects: ProjectData[];
  filteredExchanges: ExchangeData[];
  onItemClick: (item: ProjectData | ExchangeData, type: 'project' | 'exchange') => void;
  selectedIndex?: number;
  searchQuery?: string;
}

export function SearchResults({ 
  filteredProjects, 
  filteredExchanges, 
  onItemClick,
  selectedIndex = -1,
  searchQuery = ''
}: SearchResultsProps) {
  const { t } = useTranslation('search');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewAllProjects = () => {
    router.push(ROUTES.RATINGS.PROJECTS_SEARCH(searchQuery));
  };

  const handleViewAllExchanges = () => {
    router.push(ROUTES.RATINGS.EXCHANGES_SEARCH(searchQuery));
  };

  // Reset to "All" tab when search query changes
  useEffect(() => {
    setActiveTab(0);
  }, [searchQuery]);

  // Calculate indices based on the allItems structure
  // Must match the logic in SearchModal.tsx allItems construction
  let projectsLinkIndex = -1;
  let projectsStartIndex = 0;
  let exchangesLinkIndex = -1;
  let exchangesStartIndex = 0;

  // Build indices by walking through allItems
  let currentIndex = 0;
  
  // Projects section
  if (filteredProjects.length > 0) {
    // Only add link index if clickable (count > 3)
    const hasProjectsLink = filteredProjects.length > 3;
    if (hasProjectsLink) {
      projectsLinkIndex = currentIndex;
      currentIndex++; // Move past the link
    }
    projectsStartIndex = currentIndex;
    currentIndex += Math.min(filteredProjects.length, 3); // Move past the results (always show max 3)
  }
  
  // Exchanges section
  if (filteredExchanges.length > 0) {
    // Only add link index if clickable (count > 3)
    const hasExchangesLink = filteredExchanges.length > 3;
    if (hasExchangesLink) {
      exchangesLinkIndex = currentIndex;
      currentIndex++; // Move past the link
    }
    exchangesStartIndex = currentIndex;
  }

  // Check if both types have results - if only one type, hide tabs
  const hasProjects = filteredProjects.length > 0;
  const hasExchanges = filteredExchanges.length > 0;
  const showTabs = hasProjects && hasExchanges;

  const renderAllTab = () => (
    <>
      {filteredProjects.length === 0 && filteredExchanges.length === 0 ? (
        <div css={styles.noResults}>
          {t('noResults.found', 'No results found')}
        </div>
      ) : (
        <>
          {filteredProjects.length > 0 && (
            <>
              {/* CategoryLink is clickable only when count > 3, otherwise just displays count */}
              <CategoryLink
                label={t('tabs.projects', 'Projects')}
                count={filteredProjects.length}
                onClick={handleViewAllProjects}
                isSelected={projectsLinkIndex >= 0 && selectedIndex === projectsLinkIndex}
              />
              <ResultsTable 
                items={filteredProjects} 
                type="project" 
                limit={3} 
                onItemClick={onItemClick}
                selectedIndex={selectedIndex}
                startIndex={projectsStartIndex}
              />
            </>
          )}
          
          {filteredExchanges.length > 0 && (
            <>
              {/* CategoryLink is clickable only when count > 3, otherwise just displays count */}
              <CategoryLink
                label={t('tabs.exchanges', 'Exchanges')}
                count={filteredExchanges.length}
                onClick={handleViewAllExchanges}
                isSelected={exchangesLinkIndex >= 0 && selectedIndex === exchangesLinkIndex}
              />
              <ResultsTable 
                items={filteredExchanges} 
                type="exchange" 
                limit={3} 
                onItemClick={onItemClick}
                selectedIndex={selectedIndex}
                startIndex={exchangesStartIndex}
              />
            </>
          )}
        </>
      )}
    </>
  );

  // If only one type has results, show results directly without tabs
  if (!showTabs) {
    if (hasProjects) {
      return (
        <div>
          <CategoryLink
            label={t('tabs.projects', 'Projects')}
            count={filteredProjects.length}
            onClick={handleViewAllProjects}
            isSelected={projectsLinkIndex >= 0 && selectedIndex === projectsLinkIndex}
          />
          <ResultsTable 
            items={filteredProjects} 
            type="project" 
            limit={6} 
            onItemClick={onItemClick} 
            selectedIndex={selectedIndex} 
            startIndex={0} 
          />
        </div>
      );
    }
    
    if (hasExchanges) {
      return (
        <div>
          <CategoryLink
            label={t('tabs.exchanges', 'Exchanges')}
            count={filteredExchanges.length}
            onClick={handleViewAllExchanges}
            isSelected={exchangesLinkIndex >= 0 && selectedIndex === exchangesLinkIndex}
          />
          <ResultsTable 
            items={filteredExchanges} 
            type="exchange" 
            limit={6} 
            onItemClick={onItemClick} 
            selectedIndex={selectedIndex} 
            startIndex={0} 
          />
        </div>
      );
    }

    // No results
    return (
      <div css={styles.noResults}>
        {t('noResults.found', 'No results found')}
      </div>
    );
  }

  // Both types have results - show tabs
  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label={t('tabs.all', 'All')} />
        <Tab label={t('tabs.projects', 'Projects')} />
        <Tab label={t('tabs.exchanges', 'Exchanges')} />
      </Tabs>

      <div css={styles.tabContent}>
        {activeTab === 0 && renderAllTab()}
        {activeTab === 1 && (
          <ResultsTable 
            items={filteredProjects} 
            type="project" 
            limit={6} 
            onItemClick={onItemClick} 
            selectedIndex={selectedIndex} 
            startIndex={0} 
          />
        )}
        {activeTab === 2 && (
          <ResultsTable 
            items={filteredExchanges} 
            type="exchange" 
            limit={6} 
            onItemClick={onItemClick} 
            selectedIndex={selectedIndex} 
            startIndex={0} 
          />
        )}
      </div>
    </div>
  );
}

