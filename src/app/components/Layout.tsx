import { Header } from "./Header";
import { Outlet, Link, useLocation } from 'react-router';
import { useApp } from '../context';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  Wallet,
  FileText,
  BarChart3,
  BookmarkCheck,
  Wrench,
  Scale,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'PDV', href: '/pdv', icon: ShoppingCart },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Categorias', href: '/categorias', icon: FolderTree },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Caixa', href: '/caixa', icon: Wallet },
  { name: 'Vendas', href: '/vendas', icon: FileText },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Reservas', href: '/reservas', icon: BookmarkCheck },
  { name: 'Ordens de Serviço', href: '/ordens-servico', icon: Wrench },
  { name: 'Avaliação de Prata', href: '/avaliacao-prata', icon: Scale },
];

export function Layout() {
  const location = useLocation();
  const { currentUser, activeCashRegister } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transition-transform duration-200 ease-in-out mt-[57px] lg:mt-0`}
        >
          <nav className="p-4 space-y-1 h-[calc(100vh-57px)] lg:h-screen overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-20 mt-[57px]"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
