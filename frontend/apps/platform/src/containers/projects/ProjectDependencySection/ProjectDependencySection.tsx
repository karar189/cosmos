/** @jsxImportSource @emotion/react */
'use client';

import { Dependency } from '@/types/api/project';
import {
  Badge,
  Card,
  Core3Button,
  DataList,
  DataListItemData,
  Icon,
  Section,
} from '@core3/ui-components';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './ProjectDependencySection.styles';

const COLLAPSED_CARD_COUNT = 3;

const overlayVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3, ease: 'easeIn' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.05,
      ease: 'easeOut' as const,
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

interface ProjectDependencySectionProps {
  id: string;
  data?: Dependency;
  onCollapse?: () => void;
}

const ProjectDependencySection: React.FC<ProjectDependencySectionProps> = ({ id, onCollapse }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      if (!newState) {
        onCollapse?.();
      }
      return newState;
    });
  };
  
  const bridgesAndCrossChainList: DataListItemData[] = [
    {
      label: t(
        'details.dependency.bridgesAndCrossChain.bridgeConcentrationRatio',
        'Bridge Concentration Ratio'
      ),
      value: '85.2%',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.bridgesAndCrossChain.bridgeDiversityIndex',
        'Bridge Diversity Index'
      ),
      value: '0.72',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.bridgesAndCrossChain.pauseEmergencyControlsQuality',
        'Pause/Emergency Controls Quality'
      ),
      value: 'High',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.bridgesAndCrossChain.upgradeabilityGuarding',
        'Upgradeability Guarding'
      ),
      value: 'Medium',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.bridgesAndCrossChain.incidentHistoryModifier',
        'Incident History Modifier'
      ),
      value: '-0.15',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.bridgesAndCrossChain.finalityChallengeDepth',
        'Finality/Challenge Depth'
      ),
      value: '12 blocks',
      blurred: true,
    },
  ];

  const custodyTreasuryList: DataListItemData[] = [
    {
      label: t(
        'details.dependency.custodyTreasury.treasuryCustodyStrength',
        'Treasury Custody Strength'
      ),
      value: '92%',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.custodyTreasury.signerConcentrationOverlap',
        'Signer Concentration & Overlap'
      ),
      value: '3/5',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.custodyTreasury.timelockOnCriticalOps',
        'Timelock on Critical Ops'
      ),
      value: '48h',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.custodyTreasury.keyRotationChangeVelocity',
        'Key Rotation & Change Velocity'
      ),
      value: 'Low',
      blurred: true,
    },
    {
      label: t('details.dependency.custodyTreasury.privilegeSurface', 'Privilege Surface'),
      value: '4 roles',
      blurred: true,
    },
  ];

  const l2DaSequencerList: DataListItemData[] = [
    {
      label: t(
        'details.dependency.l2DaSequencer.sequencerCentralizationLiveness',
        'Sequencer Centralization & Liveness'
      ),
      value: 'High',
      blurred: true,
    },
    {
      label: t('details.dependency.l2DaSequencer.dataAvailabilityMode', 'Data Availability Mode'),
      value: 'On-chain',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.l2DaSequencer.proofSystemVerifierControl',
        'Proof System & Verifier Control'
      ),
      value: 'ZK-SNARK',
      blurred: true,
    },
    {
      label: t('details.dependency.l2DaSequencer.escapeHatchViability', 'Escape Hatch Viability'),
      value: 'Active',
      blurred: true,
    },
    {
      label: t('details.dependency.l2DaSequencer.adminKeyGovernance', 'Admin Key Governance'),
      value: 'Multisig',
      blurred: true,
    },
  ];

  const oracleAndMarketDataList: DataListItemData[] = [
    {
      label: t('details.dependency.oracleAndMarketData.oracleRedundancy', 'Oracle Redundancy'),
      value: '85.2%',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.oracleAndMarketData.deviationGuardrailBreaches',
        'Deviation Guardrail Breaches'
      ),
      value: '2',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.oracleAndMarketData.adminUpgradeControls',
        'Admin/Upgrade Controls'
      ),
      value: 'High',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.oracleAndMarketData.singleProviderReliance',
        'Single-Provider Reliance'
      ),
      value: 'Low',
      blurred: true,
    },
  ];

  const rpcNodeInfraList: DataListItemData[] = [
    {
      label: t('details.dependency.rpcNodeInfra.rpcConcentration', 'RPC Concentration'),
      value: '72%',
      blurred: true,
    },
    {
      label: t('details.dependency.rpcNodeInfra.ownNodePresence', 'Own Node Presence'),
      value: 'Yes',
      blurred: true,
    },
    {
      label: t('details.dependency.rpcNodeInfra.endpointHardening', 'Endpoint Hardening'),
      value: 'Medium',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.rpcNodeInfra.outageChangeFailureHistory',
        'Outage & Change-Failure History'
      ),
      value: '3 events',
      blurred: true,
    },
  ];

  const webDnsControlPlanList: DataListItemData[] = [
    {
      label: t('details.dependency.webDnsControlPlan.domainProtections', 'Domain Protections'),
      value: 'High',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.webDnsControlPlan.registrarRegistryLock2FA',
        'Registrar & Registry Lock / 2FA'
      ),
      value: 'Enabled',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.webDnsControlPlan.appStoreOwnershipHygiene',
        'App Store Ownership Hygiene'
      ),
      value: 'Good',
      blurred: true,
    },
    {
      label: t('details.dependency.webDnsControlPlan.socialHandleControl', 'Social Handle Control'),
      value: 'Verified',
      blurred: true,
    },
  ];

  const thirdPartySaasCiCdList: DataListItemData[] = [
    {
      label: t(
        'details.dependency.thirdPartySaasCiCd.criticalSaasMappingSsoMfa',
        'Critical SaaS Mapping & SSO/MFA'
      ),
      value: 'Partial',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.thirdPartySaasCiCd.secretsManagementRotation',
        'Secrets Management & Rotation'
      ),
      value: '90 days',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.thirdPartySaasCiCd.supplyChainTamperSurface',
        'Supply-Chain Tamper Surface (SDK Publishing)'
      ),
      value: 'Low',
      blurred: true,
    },
  ];

  const additionalMetricsList: DataListItemData[] = [
    {
      label: t(
        'details.dependency.additionalMetrics.validatorRelayerSetHealth',
        'Validator/Relayer Set Health (Bridges/L2s)'
      ),
      value: '95%',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.additionalMetrics.mevResilienceInInfra',
        'MEV-Resilience in Infra'
      ),
      value: 'Medium',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.additionalMetrics.operationalRunbooksPublicPostmortems',
        'Operational Runbooks & Public Post-mortems'
      ),
      value: 'Available',
      blurred: true,
    },
    {
      label: t(
        'details.dependency.additionalMetrics.crossOrgKeySegregation',
        'Cross-Org Key Segregation'
      ),
      value: 'Enforced',
      blurred: true,
    },
  ];

  const ownerPrivateKeyRotationList: DataListItemData[] = [
    {
      label: t(
        'details.dependency.ownerPrivateKeyRotation.rotationStatus',
        'Owner Private Key Rotation'
      ),
      value: 'Active',
      blurred: true,
    },
  ];

  const cardList = [
    {
      label: t('details.dependency.bridgesAndCrossChain.label', 'Bridges & Cross-Chain'),
      data: bridgesAndCrossChainList,
    },
    {
      label: t('details.dependency.custodyTreasury.label', 'Custody, Treasury & Admin Wallets'),
      data: custodyTreasuryList,
    },
    {
      label: t('details.dependency.l2DaSequencer.label', 'L2 / DA / Sequencer Dependencies'),
      data: l2DaSequencerList,
    },
    {
      label: t('details.dependency.oracleAndMarketData.label', 'Oracle & Market Data'),
      data: oracleAndMarketDataList,
    },
    {
      label: t('details.dependency.rpcNodeInfra.label', 'RPC/Node/Infra Providers'),
      data: rpcNodeInfraList,
    },
    {
      label: t('details.dependency.webDnsControlPlan.label', 'Web, DNS, and Control Plan'),
      data: webDnsControlPlanList,
    },
    {
      label: t('details.dependency.thirdPartySaasCiCd.label', 'Third-Party SaaS & CI/CD'),
      data: thirdPartySaasCiCdList,
    },
    {
      label: t('details.dependency.additionalMetrics.label', 'Additional Metrics'),
      data: additionalMetricsList,
    },
    {
      label: t('details.dependency.ownerPrivateKeyRotation.label', 'Owner Private Key Rotation'),
      data: ownerPrivateKeyRotationList,
    },
  ];

  const visibleCards = isExpanded ? cardList : cardList.slice(0, COLLAPSED_CARD_COUNT);
  const mobileVisibleCards = isExpanded ? cardList : cardList.slice(0, 1); // Show only first card on mobile

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <div css={styles.sectionWrapper(isExpanded)}>
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                css={styles.comingSoonOverlay}
                initial="visible"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
              >
                <motion.h3 css={styles.comingSoonTitle}>
                  {t('details.dependency.comingSoon.title', 'This Data is Coming Soon')}
                </motion.h3>
                <motion.p css={styles.comingSoonSubtitle}>
                  {t(
                    'details.dependency.comingSoon.subtitle',
                    "While we're gathering the data, explore the full list of included metrics"
                  )}
                </motion.p>
                <Core3Button
                  animated
                  size="medium"
                  css={styles.comingSoonButton}
                  onClick={handleToggleExpand}
                >
                  {t('details.dependency.showAllMetrics', 'SHOW ALL METRICS')}
                  <Icon name="chevron-down" css={styles.buttonIcon(false)} />
                </Core3Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Section
            id={id}
            title={t('details.dependency.title', 'Dependency')}
            headerContent={
              <Badge color="gray" size="large" mono>
                {t('common:main.comingSoon', 'Coming Soon')}
              </Badge>
            }
            columns={3}
            iconName="data-transfer"
          >
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, index) => (
            <motion.div
              key={card.label}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Card css={styles.card} title={card.label}>
                <DataList items={card.data} />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              css={styles.hideMetricsWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Core3Button
                animated
                size="medium"
                css={styles.comingSoonButton}
                onClick={handleToggleExpand}
              >
                {t('details.dependency.hideMetrics', 'HIDE METRICS')}
                <Icon name="chevron-down" css={styles.buttonIcon(true)} />
              </Core3Button>
            </motion.div>
          )}
        </AnimatePresence>
          </Section>
        </div>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="data-transfer" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.dependency.title', 'Dependency')}</h2>
            <Badge color="gray" size="medium" mono css={styles.comingSoonBadge}>
              {t('common:main.comingSoon', 'COMING SOON')}
            </Badge>
          </div>
        </div>

        {/* Cards Wrapper with Overlay */}
        <div css={styles.mobileCardsWrapper(isExpanded)}>
          {/* All Cards in Column */}
          {mobileVisibleCards.map((card) => (
            <Card key={card.label} title={card.label}>
              <DataList items={card.data} />
            </Card>
          ))}

          {/* Coming Soon Overlay */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                css={styles.mobileComingSoonOverlay}
                initial="visible"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
              >
                <motion.h3 css={styles.comingSoonTitle}>
                  {t('details.dependency.comingSoon.title', 'This Data is Coming Soon')}
                </motion.h3>
                <motion.p css={styles.comingSoonSubtitle}>
                  {t(
                    'details.dependency.comingSoon.subtitle',
                    "While we're gathering the data, explore the full list of included metrics"
                  )}
                </motion.p>
                <Core3Button
                  animated
                  size="medium"
                  css={styles.comingSoonButton}
                  onClick={handleToggleExpand}
                >
                  {t('details.dependency.showAllMetrics', 'SHOW ALL METRICS')}
                  <Icon name="chevron-down" css={styles.buttonIcon(false)} />
                </Core3Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hide Metrics Button */}
        {isExpanded && (
          <div css={styles.mobileButtonWrapper}>
            <Core3Button
              size="medium"
              css={styles.comingSoonButton}
              onClick={handleToggleExpand}
            >
              {t('details.dependency.hideMetrics', 'HIDE METRICS')}
              <Icon name="chevron-down" css={styles.buttonIcon(true)} />
            </Core3Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDependencySection;
