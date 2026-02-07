import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import HeatMap, { HeatMapRef, HeatMapPoint } from './HeatMap';
import HeatMapLegend, { HeatMapLegendRef } from './HeatMapLegend';
import { colors } from '../../theme/styleSystem';

/**
 * HeatMap is a component that visualizes activity data over time.
 * Use with HeatMapLegend (separate component) and link them via ref.
 */
const meta = {
  title: 'Components/HeatMap',
  component: HeatMap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A heatmap component that displays activity data in a grid format. Works with HeatMapLegend component via ref for synchronized hover interactions. Accepts data from backend in the format: { points: [{ date, intensity }], intensities: [0, 25, 50, 75, 100] }',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    points: {
      control: 'object',
      description: 'Array of data points with date (YYYY-MM-DD) and intensity (0-100)',
    },
    intensityLevels: {
      control: 'object',
      description: 'Sorted array of intensity thresholds',
    },
    days: {
      control: 'number',
      description: 'Number of days to display',
      table: {
        defaultValue: { summary: '30' },
      },
    },
  },
} satisfies Meta<typeof HeatMap>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateRandomPoints = (days: number = 30): HeatMapPoint[] => {
  const points: HeatMapPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    if (Math.random() > 0.3) {
      const intensity = Math.floor(Math.random() * 101);
      points.push({ date: dateStr, intensity });
    }
  }

  return points;
};

const generateTestPoints = (days: number = 30): HeatMapPoint[] => {
  const points: HeatMapPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const intensity = (i % 5) * 25;
    points.push({ date: dateStr, intensity });
  }

  return points;
};

const DefaultExample = () => {
  const heatMapRef = useRef<HeatMapRef>(null);
  const legendRef = useRef<HeatMapLegendRef>(null);
  const intensityLevels = [0, 25, 50, 75, 100];
  const points = generateRandomPoints();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <HeatMap
        ref={heatMapRef}
        legendRef={legendRef}
        points={points}
        intensityLevels={intensityLevels}
      />
      <HeatMapLegend ref={legendRef} intensities={intensityLevels} heatMapRef={heatMapRef} />
    </div>
  );
};

/**
 * Default example with HeatMap and HeatMapLegend
 */
export const Default = {
  render: () => <DefaultExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const heatMapContainer = canvas.getByTestId('heatMapContainer');
    expect(heatMapContainer).toBeInTheDocument();

    const legendContainer = canvas.getByTestId('heatMapLegend');
    expect(legendContainer).toBeInTheDocument();

    const legendItemsContainer = canvas.getByTestId('legendItems');
    expect(legendItemsContainer).toBeInTheDocument();
    
    const legendItems = canvas.getAllByTestId('legendItem');
    expect(legendItems).toHaveLength(5);
  },
};

const BackendExample = () => {
  const heatMapRef = useRef<HeatMapRef>(null);
  const legendRef = useRef<HeatMapLegendRef>(null);

  const backendData = {
    heatmap: {
      intensities: [0, 25, 50, 75, 100],
      points: generateRandomPoints(),
    },
  };

  const { intensities, points } = backendData.heatmap;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Aeonik', fontSize: '14px', color: colors.text.secondary }}>
          Backend Response Format:
        </h3>
        <pre
          style={{
            backgroundColor: colors.background.light,
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto',
            maxWidth: '500px',
          }}
        >
          {JSON.stringify({ heatmap: { intensities, points: points.slice(0, 3) } }, null, 2)}
        </pre>
      </div>
      <HeatMap
        ref={heatMapRef}
        legendRef={legendRef}
        points={points}
        intensityLevels={intensities}
      />
      <HeatMapLegend ref={legendRef} intensities={intensities} heatMapRef={heatMapRef} />
    </div>
  );
};

/**
 * Backend data format example
 */
export const BackendDataFormat = {
  render: () => <BackendExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Backend Response Format:')).toBeInTheDocument();

    const preElement = canvasElement.querySelector('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.textContent).toContain('heatmap');
    expect(preElement?.textContent).toContain('intensities');
    expect(preElement?.textContent).toContain('points');

    const heatMapContainer = canvas.getByTestId('heatMapContainer');
    expect(heatMapContainer).toBeInTheDocument();
  },
};

const CustomIntensitiesExample = () => {
  const heatMapRef = useRef<HeatMapRef>(null);
  const legendRef = useRef<HeatMapLegendRef>(null);
  const intensityLevels = [0, 20, 40, 60, 80, 100];
  const points = generateRandomPoints();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <HeatMap
        ref={heatMapRef}
        legendRef={legendRef}
        points={points}
        intensityLevels={intensityLevels}
      />
      <HeatMapLegend ref={legendRef} intensities={intensityLevels} heatMapRef={heatMapRef} />
    </div>
  );
};

/**
 * Custom intensity levels example
 */
export const CustomIntensities = {
  render: () => <CustomIntensitiesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const legendItemsContainer = canvas.getByTestId('legendItems');
    expect(legendItemsContainer).toBeInTheDocument();
    
    const legendItems = canvas.getAllByTestId('legendItem');
    expect(legendItems).toHaveLength(6);

    const heatMapContainer = canvas.getByTestId('heatMapContainer');
    expect(heatMapContainer).toBeInTheDocument();
  },
};

/**
 * HeatMap without HeatMapLegend
 */
export const WithoutLegend: Story = {
  args: {
    points: generateTestPoints(),
    intensityLevels: [0, 25, 50, 75, 100],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const heatMapContainer = canvas.getByTestId('heatMapContainer');
    expect(heatMapContainer).toBeInTheDocument();

    const heatMapGrid = canvas.getByTestId('heatMapGrid');
    expect(heatMapGrid).toBeInTheDocument();

    const legendContainer = canvas.queryByTestId('heatMapLegend');
    expect(legendContainer).not.toBeInTheDocument();
  },
};