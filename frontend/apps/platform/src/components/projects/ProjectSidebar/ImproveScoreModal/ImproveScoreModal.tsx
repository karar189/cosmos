/** @jsxImportSource @emotion/react */
'use client';

import useTranslation from '@/hooks/useTranslation';
import { Alert, BaseModal, Core3Button, GradientBackground } from '@core3/ui-components';
import * as styles from './ImproveScoreModal.styles';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { SubmitDataCard } from '../../SubmitDataCard';

export interface ImproveScoreModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
}

export default function ImproveScoreModal({ open, onClose, projectName }: ImproveScoreModalProps) {
  const { t } = useTranslation(['sidebar']);

  const content = useMemo(() => [
    {
      id: 1,
      title: t('improveScore.sections.insurance.title', 'Insurance: Custody & Coverage'),
      items: [
        t('improveScore.sections.insurance.items.0', 'Policy Declarations Page (insurer, policy #, period, limits, deductibles, endorsements).'),
        t('improveScore.sections.insurance.items.1', 'Coverage type: Crime and/or Specie; whether hot/cold wallets are covered.'),
        t('improveScore.sections.insurance.items.2', 'Named insured (entity) and custody model (qualified custodian vs self-custody).'),
        t('improveScore.sections.insurance.items.3', 'Scope & exclusions relevant to digital assets (e.g., "only where custodian holds all keys"; common carve-outs).'),
        t('improveScore.sections.insurance.items.4', 'If using a custodian, a custodian letter referencing the policy.'),
      ],
    },
    {
      id: 2,
      title: t('improveScore.sections.monitoring.title', 'Third-Party Monitoring Attestation (DOCUSIGN)'),
      items: [
        t('improveScore.sections.monitoring.items.0', 'Provider & setup proof (e.g., Forta bots subscribed to your contracts; OpenZeppelin Monitor/Relayer OSS or legacy Defender; Tenderly alerts; SIEM feeds, etc.).'),
        t('improveScore.sections.monitoring.items.1', 'Monitored assets: addresses/contracts by chain, topics/events watched, thresholds.'),
        t('improveScore.sections.monitoring.items.2', 'Alerting: destinations (Slack/Discord/Webhook), escalation path, uptime.'),
        t('improveScore.sections.monitoring.items.3', 'Change control: who owns/maintains rules; how false positives are tuned.'),
      ],
    },
    {
      items: [
        t('improveScore.sections.monitoringNote.items.0', 'Projects frequently "buy" monitoring but never fully configure it; we verify concrete subscriptions/alerts exist (Forta subscriptions, Forta bot IDs; Tenderly webhooks; Defender/Monitor config). Note: OpenZeppelin is phasing out hosted Defender in favor of open-source Monitor/Relayer (sunset July 1, 2026), so we may accept self-hosted setups with equivalent functionality.'),
      ],
      note: t('improveScore.sections.monitoringNote.note', 'A DocuSign template form for Third Party Monitoring will be sent to you directly by our representatives'),
    },
    {
      id: 3,
      title: t('improveScore.sections.treasury.title', 'Treasury Contract Addresses'),
      items: [
        t('improveScore.sections.treasury.items.0', 'All treasury/ops/vesting/LP addresses by chain; label each address role.'),
        t('improveScore.sections.treasury.items.1', 'Multisig configuration (e.g., Safe threshold and owner addresses) and any timelocks/guardians.'),
        t('improveScore.sections.treasury.items.2', 'Verification links (Etherscan/Blockscout verified code, ABI published where applicable).'),
      ],
    },
    {
      id: 4,
      title: t('improveScore.sections.licenses.title', 'Licenses & Regulatory Proof'),
      items: [
        t('improveScore.sections.licenses.items.0', 'Jurisdiction, license type/number, status, and public registry link.'),
        t('improveScore.sections.licenses.items.1', 'If operating in the EU, MiCA CASP authorization details and links to the ESMA MiCA register (or NCA register pending ESMA updates).'),
      ],
    },
    {
      id: 5,
      title: t('improveScore.sections.iso.title', 'ISO/IEC 27001 Certificate'),
      items: [
        t('improveScore.sections.iso.items.0', 'ISO/IEC 27001:2022 certificate copy, scope statement, and Statement of Applicability (SoA).'),
        t('improveScore.sections.iso.items.1', 'Certification Body (CB) name and accreditation (checkable via the relevant National Accreditation Body under IAF).'),
        t('improveScore.sections.iso.items.2', 'Audit cycle (3-year cycle with surveillance audits is typical); last & next audit dates.'),
      ],
    },
    {
      id: 6,
      title: t('improveScore.sections.locker.title', 'Locker Addresses'),
      items: [
        t('improveScore.sections.locker.items.0', 'Addresses of all LP lockers, listed per chain.'),
        t('improveScore.sections.locker.items.1', 'For each address, specify the locker type (e.g., Unicrypt, Team Finance, PinkLock, Custom Locker).'),
        t('improveScore.sections.locker.items.2', 'Provide lock details where applicable (lock duration, unlock date, relock history).'),
        t('improveScore.sections.locker.items.3', 'Add verification links (Etherscan / Blockscout contract page, verified code status).'),
      ],
    },
    {
      id: 7,
      title: t('improveScore.sections.audit.title', 'Audit Reports, If the Report is Private'),
      sections: [
        {
          heading: t('improveScore.sections.audit.sections.0.heading', 'DocuSign-signed attestation letter from the auditor stating all of the following, in one document:'),
          items: [
            t('improveScore.sections.audit.sections.0.items.0', 'All findings are fixed (or clearly listed with severity and justification if any remain).'),
            t('improveScore.sections.audit.sections.0.items.1', 'The audit was conducted using industry best practices (manual review, static analysis, fuzzing/property-based testing where applicable, threat modeling, privileged roles & upgrade paths review, SWC mapping, etc.).'),
            t('improveScore.sections.audit.sections.0.items.2', 'The audit was conducted on the exact same code (commit/tag) that is deployed on-chain.'),
            t('improveScore.sections.audit.sections.0.items.3', 'Scope (contracts/paths), compiler(s) & settings (solc version, optimizer runs, via-IR if used), chains/networks, and contract addresses (including proxy + implementation if applicable).'),
            t('improveScore.sections.audit.sections.0.items.4', 'Fix review/retest date(s) and outcome confirming all remediations were verified.'),
            t('improveScore.sections.audit.sections.0.items.5', 'Auditor firm letterhead, signer name/title, date, DocuSign envelope ID, and firm contact.'),
          ],
        },
        {
          heading: t('improveScore.sections.audit.sections.1.heading', 'Code equivalence when audit is public but repo is private. Provide one of these:'),
          items: [
            {
              text: t('improveScore.sections.audit.sections.1.items.0.text', 'Auditor Code-Match Statement (recommended): a DocuSign-signed letter by the auditor that includes:'),
              subItems: [
                t('improveScore.sections.audit.sections.1.items.0.subItems.0', 'The audited commit SHA (e.g., a1b2c3...) and public audit PDF link.'),
                t('improveScore.sections.audit.sections.1.items.0.subItems.1', 'The deployed bytecode match proof (e.g., Etherscan/Sourcify "Verified" with metadata hash) for each address in scope.'),
                t('improveScore.sections.audit.sections.1.items.0.subItems.2', 'If proxies are used: the proxy address, current implementation address, and confirmation that the implementation bytecode equals the audited commit\'s build artifacts.'),
              ],
            },
            {
              text: t('improveScore.sections.audit.sections.1.items.1.text', 'Self-provided Evidence Pack (if auditor can\'t issue): one PDF containing:'),
              subItems: [
                t('improveScore.sections.audit.sections.1.items.1.subItems.0', 'The audited commit SHA and screenshot/snippet from the public report showing it.'),
                t('improveScore.sections.audit.sections.1.items.1.subItems.1', 'Deployed contract addresses + explorer links per chain (proxy + implementation).'),
                t('improveScore.sections.audit.sections.1.items.1.subItems.2', 'Verification metadata (Etherscan/Sourcify pages) showing compiler, optimizer, and IPFS metadata hash that corresponds to the audited commit\'s metadata.json.'),
              ],
            },
            t('improveScore.sections.audit.sections.1.items.2', 'If the code is private: a git-bundle of the audited commit shared directly with the auditor (not with us) and a DocuSign letter from the auditor confirming the bundle matches the deployed bytecode.'),
          ],
        },
      ],
      note: t('improveScore.sections.audit.note', 'A DocuSign template form for Audits will be sent to you directly by our representatives'),
    }
  ], [t]);

  // Get only items with titles (nav items)
  const navItems = useMemo(() => content.filter(item => item.title), [content]);
  const [activeIndex, setActiveIndex] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    // Find the section that's currently at or above the viewport top
    let currentIndex = 1;
    
    navItems.forEach((item) => {
      const element = document.getElementById(`section-${item.id}`);
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      // If section top is at or above threshold, it's been scrolled to
      if (rect.top <= 200) {
        currentIndex = item.id!;
      }
    });
    
    setActiveIndex(currentIndex);
  }, [navItems]);

  // Get the modal's scroll container (goes up through wrapper div to BaseModal's scrollable)
  const getScrollContainer = useCallback(() => {
    return contentRef.current?.parentElement?.parentElement;
  }, []);

  useEffect(() => {
    if (!open) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Initial check
      handleScroll();
      
      // Find the scrollable parent (BaseModal's modalContentScrollable)
      const scrollContainer = getScrollContainer();
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const scrollContainer = getScrollContainer();
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [open, handleScroll, getScrollContainer]);

  // Reset active index when modal closes
  useEffect(() => {
    if (!open) setActiveIndex(1);
  }, [open]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={t('scoreCard.improveCta.modalTitle', 'Submit Data to Improve Score')}
      variant='fullscreen'
      contentCss={styles.modalContentOverride}
    >
      <div>
        <div ref={contentRef} css={styles.content}>
          <div>
            <div css={styles.navigationList}>
              {navItems.map((item) => (
                <button 
                  type="button"
                  css={[styles.navigationItem, item.id! <= activeIndex && styles.navigationItemActive]}
                  key={item.title}
                  onClick={() => document.getElementById(`section-${item.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {item.title}
                </button>
              ))}
              <div css={styles.submitButtonContainer}>
                <Core3Button 
                  size='small'
                  onClick={() => {
                    const scrollContainer = getScrollContainer();
                    if (scrollContainer) {
                      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                >
                  {t('improveScore.submitButton', 'Submit Data')}
                </Core3Button>
              </div>
            </div>
          </div>

          <div css={styles.contentContainer}>
            
            {content.map((item, itemIndex) => (
              <div key={item.title || `content-${itemIndex}`} id={item.id ? `section-${item.id}` : undefined} css={styles.modalSection}>
                {item.title && 
                  <div css={styles.modalSectionTitleContainer}>
                    <span css={styles.modalSectionNumber}>{item.id}</span>
                    <h3 css={styles.modalSectionTitle}>{item.title}</h3>
                  </div>
                }              
                <p css={styles.modalSectionDescription}>{t('improveScore.whatToSubmit', 'What to submit')}</p>
                
                {/* Simple items list */}
                {item.items && (
                  <ul css={styles.modalSectionList}>
                    {item.items.map((listItem, idx) => (
                      <li key={idx}>{listItem}</li>
                    ))}
                  </ul>
                )}
                
                {/* Numbered sections */}
                {item.sections && (
                  <ol css={styles.modalSectionOrderedList}>
                    {item.sections.map((section, sectionIdx) => (
                      <li css={styles.modalSectionList} key={sectionIdx}>
                        <p css={styles.modalSectionHeading}>{section.heading}</p>
                        <ul>
                          {section.items.map((sectionItem, itemIdx) => (
                            typeof sectionItem === 'string' ? (
                              <li key={itemIdx}>{sectionItem}</li>
                            ) : (
                              <li key={itemIdx}>
                                {sectionItem.text}
                                {sectionItem.subItems && (
                                  <ul>
                                    {sectionItem.subItems.map((subItem, subIdx) => (
                                      <li key={subIdx}>{subItem}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            )
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}
                
                {item.note && <Alert css={styles.modalSectionNote} severity='warning'>{item.note}</Alert>}
              </div>
            ))}
          </div>
        </div>

        <GradientBackground>
          <SubmitDataCard projectName={projectName} />
        </GradientBackground>
      </div>
    </BaseModal>
  );
}

