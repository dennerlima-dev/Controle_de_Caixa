import { useApp } from '../context';
import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Reports() {
  const { sales, products, categories } = useApp();

  // Sales by category
  const salesByCategory = categories.map((cat) => {
    const categoryProducts = products.filter((p) => p.categoryId === cat.id);
    const categoryProductIds = categoryProducts.map((p) => p.id);
    
    const total = sales.reduce((sum, sale) => {
      const categoryItems = sale.items.filter((item) => categoryProductIds.includes(item.productId));
      return sum + categoryItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
    }, 0);

    return { name: cat.name, value: total };
  }).filter((item) => item.value > 0);

  // Top products
  const productSales = products.map((product) => {
    const totalSold = sales.reduce((sum, sale) => {
      const item = sale.items.find((i) => i.productId === product.id);
      return sum + (item?.quantity || 0);
    }, 0);

    const revenue = sales.reduce((sum, sale) => {
      const item = sale.items.find((i) => i.productId === product.id);
      return sum + (item?.totalPrice || 0);
    }, 0);

    return { name: product.name, quantity: totalSold, revenue };
  })
    .filter((p) => p.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = sales.length;
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Relatórios</h2>
        <p className="text-gray-600 mt-1">Análise de vendas e performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-semibold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-semibold text-gray-900">{totalSales}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-semibold text-gray-900">R$ {averageTicket.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        {salesByCategory.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Products */}
        {productSales.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3B82F6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Product List */}
      {productSales.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Detalhamento de Produtos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Produto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Qtd Vendida</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {productSales.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.quantity}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      R$ {product.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sales.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nenhuma venda registrada ainda</p>
          <p className="text-sm mt-2">Os relatórios aparecerão quando houver vendas</p>
        </div>
      )}
    </div>
  );
}
