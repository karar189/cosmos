/** @jsxImportSource @emotion/react */
"use client";

import { motion, MotionConfig } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@core3/ui-components";
import useTranslation from "@/hooks/useTranslation";
import { ProjectHeaderData } from "@/types/project-layout";
import { ROUTES } from "@/constants/routes";
import {
  getNavigationState,
  clearNavigationState,
} from "@/utils/navigationState";
import { generateProjectGradient } from "@/utils/gradientGenerator";
import { useProjectHeaderScroll } from "@/hooks/useProjectHeaderScroll";
import * as styles from "./ProjectHeader.styles";

const MotionHeader = motion.header;
const MotionDiv = motion.div;
const MotionButton = motion.button;

export interface ProjectHeaderProps {
  /**
   * Project header data
   */
  data: ProjectHeaderData;
  /**
   * Whether to show back button
   * @default true
   */
  showBackButton?: boolean;
}

/**
 * ProjectHeader Component with Shrinking Scroll Behavior
 *
 * Features:
 * - Sticky positioning below platform header
 * - Shrinks on scroll: 88px→40px logo, 48px→32px text
 * - Hides badges/certification when scrolling
 * - Smooth framer motion animations
 * - Gradient fallback for missing images
 */
export default function ProjectHeader({
  data,
  showBackButton = true,
}: ProjectHeaderProps) {
  const { t } = useTranslation(["projects"]);
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Get scroll-based motion values
  const {
    logoSize,
    textScale,
    badgesOpacity,
    badgesMaxHeight,
    backButtonOpacity,
    headerPaddingBottom,
    headerPaddingTop,
  } = useProjectHeaderScroll();

  const handleBack = () => {
    const savedState = getNavigationState();
    const targetUrl = ROUTES.RATINGS.PROJECTS;

    if (savedState) {
      const params = new URLSearchParams();

      if (savedState.page) {
        params.set("page", savedState.page.toString());
      }

      if (savedState.tab) {
        params.set("tab", savedState.tab);
      }

      const queryString = params.toString();
      if (queryString) {
        router.push(`${targetUrl}?${queryString}`);
      } else {
        router.push(targetUrl);
      }

      clearNavigationState();
    } else {
      router.push(targetUrl);
    }
  };

  // Generate gradient for fallback
  const gradient = generateProjectGradient(data.id || data.name);

  return (
    <MotionConfig reducedMotion="user">
      <MotionHeader
        css={styles.header}
        style={{
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
        }}
        aria-label={t("header.aria.projectHeader", "Project header")}
      >
        {/* Back Button - fades out on scroll */}
        {showBackButton && (
          <MotionDiv
            style={{
              opacity: backButtonOpacity,
            }}
          >
            <MotionButton
              css={styles.backButton}
              onClick={handleBack}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              aria-label={t("layout.backToProjects", "Back to Project Ratings")}
            >
              <Icon name="chevron-left" css={styles.backIcon} />
              <span>{t("layout.backToProjects", "Back to Project Ratings")}</span>
            </MotionButton>
          </MotionDiv>
        )}

        <MotionDiv css={styles.projectInfo}>
          {/* Project Icon - shrinks from 88px to 40px */}
          <MotionDiv
            css={styles.iconWrapper}
            style={{
              width: logoSize,
              height: logoSize,
            }}
          >
            {!imageError && data.icon ? (
              <Image
                src={data.icon}
                alt={`${data.name} logo`}
                width={88}
                height={88}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div css={styles.iconGradient} style={{ background: gradient }}>
                {data.name.charAt(0).toUpperCase()}
              </div>
            )}
          </MotionDiv>

          {/* Main Info */}
          <div css={styles.mainInfo}>
            {/* Project Name and Ticker - scales from 48px to 32px */}
            <MotionDiv
              css={styles.projectNameRow}
              style={{ scale: textScale, transformOrigin: "left center" }}
            >
              <h1 css={styles.projectName}>{data.name}</h1>
              <span css={styles.projectTicker}>{data.ticker}</span>
            </MotionDiv>

            {/* Badges - fade out and collapse on scroll */}
            <MotionDiv
              css={styles.badgesWrapper}
              style={{
                maxHeight: badgesMaxHeight,
              }}
            >
              <MotionDiv css={styles.badges} style={{ opacity: badgesOpacity }}>
                {/* Launch Stage - operational, not a score */}
                <div css={styles.projectBadge}>
                  <span>
                    {t("header.launchStage", "Launch Stage")}: <b>{data.launchStage ?? "—"}</b>
                  </span>
                </div>
                {/* Regulatory Tier - informational only */}
                <div css={styles.projectBadge}>
                  <span css={styles.certificationLabel}>
                    {t("header.regulatoryTier", "Regulatory Tier")}:
                  </span>
                  <span css={styles.regulatoryTierValue}>{data.regulatoryTier ?? "—"}</span>
                </div>
              </MotionDiv>
            </MotionDiv>
          </div>
        </MotionDiv>
      </MotionHeader>
    </MotionConfig>
  );
}
