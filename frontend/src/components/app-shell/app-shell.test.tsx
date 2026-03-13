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

    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^plan$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^check-in$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^community$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^me$/i })).toBeInTheDocument();
  });
});
