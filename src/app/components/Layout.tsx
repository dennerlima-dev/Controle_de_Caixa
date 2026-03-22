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
      <header className="bg-[#1E3A5F] shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">

              {/* LOGO */}
              <img
                src="/logo.webp"
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
            
              {/* TEXTO */}
              <h1 className="text-xl font-semibold flex items-center">
              
                          <span className="text-white">
                  ÁGUA E SAL |
                </span>
              
                <span className="ml-2" style={{ color: "lab(86.15% -4.04379 -21.0797)" }}>
                  Controle de Caixa
                </span>
              
              </h1>

            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeCashRegister ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Caixa Aberto
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Caixa Fechado
              </div>
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <button
                onClick={() => {
                  localStorage.removeItem("auth");
                  window.location.href = "/login";
                }}
                className="text-xs text-red-500"
              >
                Sair
              </button>
              <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </header>

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
