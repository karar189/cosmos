/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import BadgeSelect from './BadgeSelect';

const meta: Meta<typeof BadgeSelect> = {
  title: 'Components/Badge/BadgeSelect',
  component: BadgeSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BadgeSelect>;

const timeframeOptions = [
  { value: '1h', label: '1h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: 'all', label: 'All' },
];

const DefaultComponent = () => {
  const [value, setValue] = useState('24h');
  return (
    <BadgeSelect
      options={timeframeOptions}
      value={value}
      onChange={setValue}
      color="gray"
      size="medium"
    />
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

const SmallSizeComponent = () => {
  const [value, setValue] = useState('24h');
  return (
    <BadgeSelect
      options={timeframeOptions}
      value={value}
      onChange={setValue}
      color="gray"
      size="small"
    />
  );
};

export const SmallSize: Story = {
  render: () => <SmallSizeComponent />,
};

const RedColorComponent = () => {
  const [value, setValue] = useState('24h');
  return (
    <BadgeSelect
      options={timeframeOptions}
      value={value}
      onChange={setValue}
      color="red"
      size="medium"
    />
  );
};

export const RedColor: Story = {
  render: () => <RedColorComponent />,
};

const OrangeColorComponent = () => {
  const [value, setValue] = useState('7d');
  return (
    <BadgeSelect
      options={timeframeOptions}
      value={value}
      onChange={setValue}
      color="orange"
      size="medium"
    />
  );
};

export const OrangeColor: Story = {
  render: () => <OrangeColorComponent />,
};

const YellowColorComponent = () => {
  const [value, setValue] = useState('1h');
  return (
    <BadgeSelect
      options={timeframeOptions}
      value={value}
      onChange={setValue}
      color="yellow"
      size="medium"
    />
  );
};

export const YellowColor: Story = {
  render: () => <YellowColorComponent />,
};

const GreenColorComponent = () => {
  const [value, setValue] = useState('30d');
  return (
    <BadgeSelect
      options={timeframeOptions}
      value={value}
      onChange={setValue}
      color="green"
      size="medium"
    />
  );
};

export const GreenColor: Story = {
  render: () => <GreenColorComponent />,
};

const AllColorsComponent = () => {
  const [value1, setValue1] = useState('24h');
  const [value2, setValue2] = useState('7d');
  const [value3, setValue3] = useState('1h');
  const [value4, setValue4] = useState('30d');
  const [value5, setValue5] = useState('all');

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <BadgeSelect options={timeframeOptions} value={value1} onChange={setValue1} color="red" />
      <BadgeSelect options={timeframeOptions} value={value2} onChange={setValue2} color="orange" />
      <BadgeSelect options={timeframeOptions} value={value3} onChange={setValue3} color="yellow" />
      <BadgeSelect options={timeframeOptions} value={value4} onChange={setValue4} color="green" />
      <BadgeSelect options={timeframeOptions} value={value5} onChange={setValue5} color="gray" />
    </div>
  );
};

export const AllColors: Story = {
  render: () => <AllColorsComponent />,
};

const CustomOptionsComponent = () => {
  const [value, setValue] = useState('btc');
  const cryptoOptions = [
    { value: 'btc', label: 'Bitcoin' },
    { value: 'eth', label: 'Ethereum' },
    { value: 'sol', label: 'Solana' },
    { value: 'ada', label: 'Cardano' },
  ];

  return (
    <BadgeSelect
      options={cryptoOptions}
      value={value}
      onChange={setValue}
      color="gray"
      size="medium"
    />
  );
};

export const CustomOptions: Story = {
  render: () => <CustomOptionsComponent />,
};

const MultipleSelectsComponent = () => {
  const [timeframe, setTimeframe] = useState('24h');
  const [currency, setCurrency] = useState('usd');
  const [sortBy, setSortBy] = useState('price');

  const currencyOptions = [
    { value: 'usd', label: 'USD' },
    { value: 'eur', label: 'EUR' },
    { value: 'gbp', label: 'GBP' },
  ];

  const sortOptions = [
    { value: 'price', label: 'Price' },
    { value: 'volume', label: 'Volume' },
    { value: 'marketcap', label: 'Market Cap' },
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <BadgeSelect
        options={timeframeOptions}
        value={timeframe}
        onChange={setTimeframe}
        color="gray"
      />
      <BadgeSelect
        options={currencyOptions}
        value={currency}
        onChange={setCurrency}
        color="gray"
      />
      <BadgeSelect
        options={sortOptions}
        value={sortBy}
        onChange={setSortBy}
        color="gray"
      />
    </div>
  );
};

export const MultipleSelects: Story = {
  render: () => <MultipleSelectsComponent />,
};

