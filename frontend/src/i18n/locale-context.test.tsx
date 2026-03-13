import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LanguageSwitcher } from '@/components/app-shell/language-switcher';
import { renderWithProviders } from '@/test/render';

import { useLocale } from './use-locale';

function Probe() {
  const { locale, t } = useLocale();

  return (
    <>
      <span>{locale}</span>
      <span>{t('nav.home')}</span>
      <LanguageSwitcher />
    </>
  );
}

describe('locale context', () => {
  it('switches between zh-CN and en and persists the active locale', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Probe />);

    expect(screen.getByText('首页')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /english/i }));
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(window.localStorage.getItem('mintbit-locale')).toBe('en');
  });
});
