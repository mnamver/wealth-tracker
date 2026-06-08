import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Building2, BarChart3, Coins, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stocks', icon: TrendingUp, label: 'Hisse Senetleri' },
  { to: '/currency', icon: Coins, label: 'Doviz / Altin' },
  { to: '/deposits', icon: Building2, label: 'Mevduat' },
  { to: '/funds', icon: BarChart3, label: 'Yatırım Fonları' },
];

export function Sidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="flex h-full w-16 flex-col items-center border-r border-border bg-card py-4 lg:w-56 lg:items-start lg:px-3">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-primary lg:w-full lg:justify-start lg:gap-2 lg:px-2">
        <span className="text-lg font-bold text-primary-foreground">W</span>
        <span className="hidden text-sm font-semibold text-primary-foreground lg:block">
          WealthTrack
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 w-full">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors lg:justify-start lg:gap-3 lg:px-3',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:w-full lg:justify-start lg:gap-3 lg:px-3"
        aria-label="Tema değiştir"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 shrink-0" />
        ) : (
          <Moon className="h-4 w-4 shrink-0" />
        )}
        <span className="hidden text-sm font-medium lg:block">
          {theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
        </span>
      </button>
    </aside>
  );
}
