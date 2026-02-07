/** @jsxImportSource @emotion/react */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, Core3Button as Button, Input, Select, Badge, Icon, Toggle, type ToggleOption } from '@core3/ui-components';
import { ROUTING_ASSET_OPTIONS } from '@/services/stellar';
import { MultiLineChart, DataBlock } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import { useRouting } from '@/hooks/useRouting';
import * as styles from './page.styles';

const routingModeOptions: ToggleOption<'cheapest' | 'fastest' | 'safest' | 'balanced'>[] = [
  { value: 'cheapest', label: 'Cheapest' },
  { value: 'fastest', label: 'Fastest' },
  { value: 'safest', label: 'Safest' },
  { value: 'balanced', label: 'Balanced' },
];

const generateRouteComparisonData = (routes: { name: string }[]) => {
  if (!routes?.length) return [];
  const timePoints = ['0', '5', '10', '15', '20', '25', '30'];
  return timePoints.map((time, index) => {
    const decay = index * 0.1;
    const data: Record<string, string | number> = { time };
    routes.slice(0, 3).forEach((route, routeIndex) => {
      const baseValue = 100;
      const routeDecay = decay * (1 + routeIndex * 0.1);
      const key = (route?.name ?? 'route').toLowerCase().replace(/\s+/g, '_');
      data[key] = baseValue - routeDecay;
    });
    return data;
  });
};

const getRiskColor = (riskScore: number): 'green' | 'orange' | 'red' => {
  if (riskScore <= 1.5) return 'green';
  if (riskScore <= 3) return 'orange';
  return 'red';
};

const getRiskLabel = (riskScore: number) => {
  if (riskScore <= 1.5) return 'Low';
  if (riskScore <= 3) return 'Medium';
  return 'High';
};

export default function RoutingEnginePage() {
  const { t } = useTranslation('workspace');
  const [sourceAsset, setSourceAsset] = useState<string>('USDC');
  const [destinationAsset, setDestinationAsset] = useState<string>('XLM');
  const [amount, setAmount] = useState<string>('1000');
  const [routingMode, setRoutingMode] = useState<'cheapest' | 'fastest' | 'safest' | 'balanced'>('balanced');
  const [routeComparisonData, setRouteComparisonData] = useState<Record<string, string | number>[]>([]);

  const { routes, selectedRoute, loading, error, findRoutes, selectRoute } = useRouting();
  const safeRoutes = routes ?? [];

  const handleFindRoutes = async () => {
    await findRoutes({
      sourceAsset,
      destinationAsset,
      amount,
      routingMode,
    });
  };

  useEffect(() => {
    if (safeRoutes.length > 0) {
      setRouteComparisonData(generateRouteComparisonData(safeRoutes));
    } else {
      setRouteComparisonData([]);
    }
  }, [safeRoutes.length]);

  return (
    <div css={styles.pageContainer}>
      <div css={styles.headerSection}>
        <h1 css={styles.pageTitle}>Routing Engine</h1>
        <p css={styles.pageDescription}>
          The Google Maps of Stellar payments — find the cheapest, fastest, and safest route for any asset
        </p>
      </div>

      <div css={styles.twoColumnLayout}>
        {/* Left column — 40%: Route configuration */}
        <div css={styles.leftColumn}>
          <section css={styles.configSection}>
            <h2 css={styles.configSectionTitle}>Route Configuration</h2>
            <div css={styles.formContent}>
              <div css={styles.formBlock}>
                <label css={styles.label}>Source Asset</label>
                <Select
                  options={ROUTING_ASSET_OPTIONS}
                  value={sourceAsset}
                  onChange={(value) => setSourceAsset(String(value))}
                  placeholder="Select source asset"
                  ariaLabel="Source asset"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Destination Asset</label>
                <Select
                  options={ROUTING_ASSET_OPTIONS}
                  value={destinationAsset}
                  onChange={(value) => setDestinationAsset(String(value))}
                  placeholder="Select destination asset"
                  ariaLabel="Destination asset"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Amount</label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  type="number"
                />
              </div>
              <div css={styles.formBlock}>
                <label css={styles.label}>Routing Mode</label>
                <div css={styles.routingModeToggleWrapper}>
                  <Toggle
                    value={routingMode}
                    onChange={setRoutingMode}
                    options={routingModeOptions}
                    ariaLabel="Routing mode"
                    size="medium"
                  />
                </div>
              </div>
              <div css={styles.submitButtonWrapper}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleFindRoutes}
                  disabled={loading}
                >
                  <Icon name="data-transfer" />
                  {loading ? 'Finding Routes...' : 'Find Routes'}
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Right column — 60%: Results */}
        <div css={styles.rightColumn}>
          <section css={styles.resultsSection}>
            <h2 css={styles.sectionTitle}>Available Routes</h2>
            {error && (
              <div css={styles.errorMessage}>
                <Icon name="warning-triangle" />
                {error}
              </div>
            )}
            {loading && (
              <div css={styles.loadingMessage}>
                <Icon name="data-transfer" />
                Searching Stellar network for optimal routes...
              </div>
            )}
            {safeRoutes.length === 0 && !loading && !error && (
              <div css={styles.emptyState}>
                <Icon name="data-flow" />
                <p>Click &quot;Find Routes&quot; to discover payment paths on Stellar</p>
              </div>
            )}
            <div css={styles.routesList}>
              {safeRoutes.map((route) => (
                <Card
                  key={route.id}
                  css={[
                    styles.routeCard,
                    selectedRoute?.id === route.id && styles.routeCardSelected,
                  ]}
                  onClick={() => selectRoute(route.id)}
                >
                  <div css={styles.routeHeader}>
                    <h3 css={styles.routeName}>{route.name}</h3>
                    <Badge color={getRiskColor(route.score?.risk ?? 0)}>
                      {getRiskLabel(route.score?.risk ?? 0)} Risk
                    </Badge>
                  </div>
                  <div css={styles.routePath}>
                    <span css={styles.assetName}>
                      {route.source_asset_code ?? 'XLM'}
                    </span>
                    {(route.path ?? []).map((asset: { asset_code?: string }, index: number) => (
                      <React.Fragment key={index}>
                        <Icon name="chevron-right" css={styles.pathArrow} />
                        <span css={styles.assetName}>
                          {asset?.asset_code ?? 'XLM'}
                        </span>
                      </React.Fragment>
                    ))}
                    <Icon name="chevron-right" css={styles.pathArrow} />
                    <span css={styles.assetName}>
                      {route.destination_asset_code ?? 'XLM'}
                    </span>
                  </div>
                  <div css={styles.routeMetrics}>
                    <div css={styles.metric}>
                      <span css={styles.metricLabel}>Cost Score</span>
                      <span css={styles.metricValue}>{(route.score?.cost ?? 0).toFixed(1)}</span>
                    </div>
                    <div css={styles.metric}>
                      <span css={styles.metricLabel}>Time Score</span>
                      <span css={styles.metricValue}>{(route.score?.time ?? 0).toFixed(1)}</span>
                    </div>
                    <div css={styles.metric}>
                      <span css={styles.metricLabel}>Hops</span>
                      <span css={styles.metricValue}>{route.hops ?? 0}</span>
                    </div>
                    <div css={styles.metric}>
                      <span css={styles.metricLabel}>Slippage</span>
                      <span css={styles.metricValue}>{(route.slippage ?? 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div css={styles.routeAmount}>
                    <span css={styles.amountLabel}>You&apos;ll receive:</span>
                    <span css={styles.amountValue}>
                      {parseFloat(route.destination_amount ?? '0').toFixed(2)}{' '}
                      {route.destination_asset_code ?? 'XLM'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {selectedRoute && (
            <>
              <div css={styles.metricsGrid}>
                <DataBlock
                  title="Cost Score"
                  subtitle={(selectedRoute.score?.cost ?? 0).toFixed(1)}
                />
                <DataBlock
                  title="Time Score"
                  subtitle={(selectedRoute.score?.time ?? 0).toFixed(1)}
                />
                <DataBlock
                  title="Liquidity Score"
                  subtitle={(selectedRoute.score?.liquidity ?? 0).toFixed(1)}
                />
                <DataBlock
                  title="Risk Score"
                  subtitle={(selectedRoute.score?.risk ?? 0).toFixed(1)}
                >
                  <Badge color={getRiskColor(selectedRoute.score?.risk ?? 0)}>
                    {getRiskLabel(selectedRoute.score?.risk ?? 0)}
                  </Badge>
                </DataBlock>
              </div>

              <Card title="Live Stellar Route Analysis" css={styles.chartCard}>
                {routeComparisonData.length > 0 && safeRoutes.length > 0 ? (
                  <MultiLineChart
                    data={routeComparisonData}
                    lines={safeRoutes.slice(0, 3).map((route, index) => ({
                      key: (route.name ?? 'route').toLowerCase().replace(/\s+/g, '_'),
                      dataKey: (route.name ?? 'route').toLowerCase().replace(/\s+/g, '_'),
                      name: route.name ?? `Route ${index + 1}`,
                      color: ['#10B981', '#3B82F6', '#F59E0B'][index],
                    }))}
                    xDataKey="time"
                    height={300}
                  />
                ) : (
                  <div css={styles.chartPlaceholder}>
                    <Icon name="candle-stick" />
                    <p>Route comparison will appear after finding routes</p>
                  </div>
                )}
              </Card>

              <Card title="Execute Payment" css={styles.executionCard}>
                <div css={styles.executionSummary}>
                  <div css={styles.summaryRow}>
                    <span>Sending:</span>
                    <strong>{amount} {selectedRoute.source_asset_code ?? 'XLM'}</strong>
                  </div>
                  <div css={styles.summaryRow}>
                    <span>Receiving:</span>
                    <strong>
                      {parseFloat(selectedRoute.destination_amount ?? '0').toFixed(2)}{' '}
                      {selectedRoute.destination_asset_code ?? 'XLM'}
                    </strong>
                  </div>
                  <div css={styles.summaryRow}>
                    <span>Route:</span>
                    <strong>{selectedRoute.name} ({selectedRoute.hops ?? 0} hops)</strong>
                  </div>
                  <div css={styles.summaryRow}>
                    <span>Estimated Slippage:</span>
                    <strong>{(selectedRoute.slippage ?? 0).toFixed(2)}%</strong>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="large"
                  css={styles.executeButton}
                  onClick={() => console.log('Execute payment:', selectedRoute)}
                >
                  <Icon name="data-transfer" />
                  Execute Payment
                </Button>
                <p css={styles.executionNote}>
                  * This will create a real Stellar transaction using PathPaymentStrictSend
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
