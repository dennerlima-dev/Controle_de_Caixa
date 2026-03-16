import { Link } from 'react-router';
import { useApp } from '../context';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  Wallet,
} from 'lucide-react';

export function Dashboard() {
  const { products, sales, activeCashRegister, clients, cashEntries } = useApp();

  // Calcular estatísticas
  const totalProducts = products.length;
  const availableStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 2 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Vendas de hoje
  const today = new Date().toLocaleDateString('pt-BR');
  const todaySales = sales.filter((s) => s.date === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  // Total de vendas
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = sales.length;

  // Caixa
  const cashBalance = activeCashRegister
    ? activeCashRegister.initialAmount +
      cashEntries
        .filter((e) => e.cashRegisterId === activeCashRegister.id)
        .reduce((sum, e) => sum + (e.type === 'entrada' ? e.amount : -e.amount), 0)
    : 0;

  const stats = [
    {
      name: 'Vendas Hoje',
      value: `R$ ${todayRevenue.toFixed(2)}`,
      subtitle: `${todaySales.length} venda(s)`,
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/vendas',
    },
    {
      name: 'Total de Vendas',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      subtitle: `${totalSales} venda(s)`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      link: '/vendas',
    },
    {
      name: 'Produtos',
      value: totalProducts.toString(),
      subtitle: `${availableStock} em estoque`,
      icon: Package,
      color: 'bg-purple-500',
      link: '/produtos',
    },
    {
      name: 'Clientes',
      value: clients.length.toString(),
      subtitle: 'cadastrados',
      icon: Users,
      color: 'bg-orange-500',
      link: '/clientes',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Visão geral do sistema</p>
      </div>

      {/* Cash Register Alert */}
      {!activeCashRegister && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-900">Caixa Fechado</h3>
            <p className="text-sm text-yellow-700 mt-1">
              É necessário abrir o caixa para realizar vendas.
            </p>
          </div>
          <Link
            to="/caixa"
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
          >
            Abrir Caixa
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Caixa Status */}
      {activeCashRegister && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Caixa Atual
            </h3>
            <Link
              to="/caixa"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver detalhes
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Operador</p>
              <p className="font-medium text-gray-900">{activeCashRegister.operatorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Abertura</p>
              <p className="font-medium text-gray-900">{activeCashRegister.openingTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Saldo Atual</p>
              <p className="font-medium text-gray-900">R$ {cashBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/pdv"
            className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Nova Venda</span>
          </Link>
          <Link
            to="/produtos"
            className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Package className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Produtos</span>
          </Link>
          <Link
            to="/clientes"
            className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Users className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Clientes</span>
          </Link>
          <Link
            to="/relatorios"
            className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Relatórios</span>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        {lowStockProducts.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Estoque Baixo
              </h3>
              <Link
                to="/produtos"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm text-gray-900">{product.name}</span>
                  <span className="text-sm font-medium text-orange-600">
                    {product.stock} unidade(s)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Out of Stock */}
        {outOfStockProducts.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Sem Estoque
              </h3>
              <Link
                to="/produtos"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-2">
              {outOfStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-gray-900">{product.name}</span>
                  <span className="text-sm font-medium text-red-600">Esgotado</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
