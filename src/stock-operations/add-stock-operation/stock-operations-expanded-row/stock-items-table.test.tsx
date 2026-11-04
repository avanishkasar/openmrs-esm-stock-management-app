import React from 'react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type StockOperationItemDTO } from '../../../core/api/types/stockOperation/StockOperationItemDTO';
import StockItemsTable from './stock-items-table';

const items = [
  { uuid: 'item-1', commonName: 'SMV Paracetamol 500mg', quantity: 10 },
  { uuid: 'item-2', commonName: 'Gauze roll', quantity: 5 },
] as unknown as Array<StockOperationItemDTO>;

describe('StockItemsTable', () => {
  it.each(['smv', 'SMV', 'Smv Para', '  smv  '])('finds items whatever the case of the search "%s"', async (query) => {
    const user = userEvent.setup();
    render(<StockItemsTable items={items} />);

    await user.type(screen.getByRole('searchbox'), query);

    expect(screen.getByText('SMV Paracetamol 500mg')).toBeInTheDocument();
    expect(screen.queryByText('Gauze roll')).not.toBeInTheDocument();
  });
});
