import { useState } from 'react';
import { useApp } from '../context';
import { FileText, Search, Calendar, DollarSign, User } from 'lucide-react';

export function Sales() {
  const { sales, products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<typeof sales[0] | null>(null);

  const filteredSales = sales
    .filter((s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.time);
      const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.time);
      return dateB.getTime() - dateA.getTime();
    });

  const paymentMethodLabels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao_debito: 'Cartão de Débito',
    cartao_credito: 'Cartão de Crédito',
    parcelado: 'Parcelado',
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Histórico de Vendas</h2>
        <p className="text-gray-600 mt-1">Visualize todas as vendas realizadas</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Itens</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Pagamento</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{sale.date}</p>
                      <p className="text-gray-600">{sale.time}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{sale.clientName || '-'}</p>
                      <p className="text-gray-600">{sale.userName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {sale.items.length} item(ns)
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="text-gray-900">{paymentMethodLabels[sale.paymentMethod]}</p>
                      {sale.installments && sale.installments > 1 && (
                        <p className="text-gray-600">{sale.installments}x</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="font-semibold text-green-600">R$ {sale.total.toFixed(2)}</p>
                      {sale.discount > 0 && (
                        <p className="text-gray-600">Desc: R$ {sale.discount.toFixed(2)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma venda encontrada</p>
          </div>
        )}
      </div>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Detalhes da Venda</h3>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Sale Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Data/Hora
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedSale.date} às {selectedSale.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Vendedor
                    </p>
                    <p className="font-medium text-gray-900">{selectedSale.userName}</p>
                  </div>
                  {selectedSale.clientName && (
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium text-gray-900">{selectedSale.clientName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Pagamento
                    </p>
                    <p className="font-medium text-gray-900">
                      {paymentMethodLabels[selectedSale.paymentMethod]}
                      {selectedSale.installments && selectedSale.installments > 1 && ` (${selectedSale.installments}x)`}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Itens da Venda</h4>
                  <div className="space-y-2">
                    {selectedSale.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          R$ {item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">R$ {selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedSale.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="font-medium text-red-600">- R$ {selectedSale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-2 border-t">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-green-600">R$ {selectedSale.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedSale.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {selectedSale.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t mt-6">
                <button
                  onClick={() => setSelectedSale(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
