import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StockItemsTable from './stock-items-table';

const items = [
  {
    commonName: 'Acetaminophen',
    batchNo: '330',
    quantity: 330,
    expiration: null,
    stockItemPackagingUOMName: 'Box',
  },
  {
    commonName: 'Ibuprofen 200mg',
    batchNo: 'IBU-1',
    quantity: 10,
    expiration: null,
    stockItemPackagingUOMName: 'Tablet',
  },
] as any;

describe('StockItemsTable search', () => {
  it.each(['acet', 'ACET', 'Acet'])('finds the item when searching "%s"', async (text) => {
    const user = userEvent.setup();
    render(<StockItemsTable items={items} />);

    await user.type(screen.getByRole('searchbox'), text);

    expect(screen.getByText('Acetaminophen')).toBeInTheDocument();
    expect(screen.queryByText('Ibuprofen 200mg')).not.toBeInTheDocument();
  });
});

describe('StockItemsTable item name', () => {
  const drugItem = {
    commonName: null,
    stockItemName: 'Vitamin A',
    batchNo: 'VA-1',
    quantity: 5,
    expiration: null,
    stockItemPackagingUOMName: 'Tablet',
  } as any;

  it('shows the stock item name when the item has no common name', () => {
    render(<StockItemsTable items={[drugItem]} />);

    expect(screen.getByText('Vitamin A')).toBeInTheDocument();
  });

  it('finds an item without a common name by its stock item name', async () => {
    const user = userEvent.setup();
    render(<StockItemsTable items={[...items, drugItem]} />);

    await user.type(screen.getByRole('searchbox'), 'vitamin');

    expect(screen.getByText('Vitamin A')).toBeInTheDocument();
    expect(screen.queryByText('Acetaminophen')).not.toBeInTheDocument();
  });
});
