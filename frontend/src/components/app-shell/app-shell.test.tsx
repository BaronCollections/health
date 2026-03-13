import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/render';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  it('renders five primary navigation entries', () => {
    renderWithProviders(
      <AppShell currentPath="/" title="MintBit">
        <div>content</div>
      </AppShell>
    );

    expect(screen.getByRole('link', { name: '首页' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '方案' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '打卡' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '社区' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '我的' })).toBeInTheDocument();
  });
});
