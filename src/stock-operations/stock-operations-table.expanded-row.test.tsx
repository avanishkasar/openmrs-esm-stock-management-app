import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import { useStockOperationPages } from './stock-operations-table.resource';
import StockOperations from './stock-operations-table.component';

const mockUseStockOperationPages = vi.mocked(useStockOperationPages);

vi.mock('./stock-operations-filters.component', () => ({ default: () => null }));
vi.mock('./stock-operation-types-selector/stock-operation-types-selector.component', () => ({ default: () => null }));
vi.mock('./edit-stock-operation/edit-stock-operation-action-menu.component', () => ({
  default: ({ stockOperation }) => <span>{stockOperation.operationNumber}</span>,
}));
vi.mock('./add-stock-operation/stock-operations-expanded-row/stock-operation-expanded-row.component', () => ({
  default: ({ model }) => <div data-testid="expanded-row">Expanded {model?.operationNumber}</div>,
}));
vi.mock('./stock-operations-table.resource', () => ({
  useStockOperationPages: vi.fn(),
}));

const operations = [
  { uuid: 'op-1', operationNumber: 'RCPT-0064', status: 'SUBMITTED', stockOperationItems: [] },
  { uuid: 'op-2', operationNumber: 'REQ-0060', status: 'COMPLETED', stockOperationItems: [] },
];

describe('StockOperations expanded row', () => {
  it('shows the operation of the expanded row after sorting', async () => {
    const user = userEvent.setup();
    mockUseStockOperationPages.mockReturnValue({
      items: operations,
      tableHeaders: [
        { key: 'operationNumber', header: 'Number' },
        { key: 'status', header: 'Status', isSortable: true },
      ],
      currentPage: 1,
      pageSizes: [10],
      totalItems: operations.length,
      goTo: vi.fn(),
      currentPageSize: 10,
      setPageSize: vi.fn(),
      isLoading: false,
    } as unknown as ReturnType<typeof useStockOperationPages>);

    render(<StockOperations />);

    // Sorting by status puts REQ-0060 (COMPLETED) above RCPT-0064 (SUBMITTED), the reverse of the fetched order.
    await user.click(screen.getByRole('button', { name: /status/i }));
    const firstRow = screen.getAllByRole('row')[1];
    expect(within(firstRow).getByText('REQ-0060')).toBeInTheDocument();

    await user.click(within(firstRow).getByRole('button', { name: /expand/i }));

    expect(screen.getByTestId('expanded-row')).toHaveTextContent('Expanded REQ-0060');
  });
});
