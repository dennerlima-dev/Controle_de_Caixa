import { useState } from 'react';
import { useApp } from '../context';
import { toast } from 'sonner';
import { Plus, Wrench } from 'lucide-react';

export function ServiceOrders() {
  const { serviceOrders, clients, addServiceOrder, updateServiceOrder } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'conserto' as 'conserto' | 'ajuste' | 'limpeza' | 'avaliacao',
    description: '',
    estimatedValue: 0,
    expectedDelivery: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) {
      toast.error('Selecione um cliente');
      return;
    }

    addServiceOrder({
      clientId: formData.clientId,
      clientName: client.name,
      type: formData.type,
      description: formData.description,
      estimatedValue: formData.estimatedValue || undefined,
      date: new Date().toLocaleDateString('pt-BR'),
      expectedDelivery: formData.expectedDelivery || undefined,
      status: 'pendente',
      notes: formData.notes || undefined,
    });

    toast.success('Ordem de serviço criada');
    setIsModalOpen(false);
    setFormData({ clientId: '', type: 'conserto', description: '', estimatedValue: 0, expectedDelivery: '', notes: '' });
  };

  const typeLabels = {
    conserto: 'Conserto',
    ajuste: 'Ajuste',
    limpeza: 'Limpeza',
    avaliacao: 'Avaliação',
  };

  const statusLabels = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
    entregue: 'Entregue',
  };

  const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-700',
    em_andamento: 'bg-blue-100 text-blue-700',
    concluido: 'bg-green-100 text-green-700',
    entregue: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Ordens de Serviço</h2>
          <p className="text-gray-600 mt-1">Gerencie consertos e ajustes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Ordem
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {serviceOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{order.clientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{typeLabels[order.type]}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.description}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.finalValue ? (
                      <span className="font-semibold text-green-600">R$ {order.finalValue.toFixed(2)}</span>
                    ) : order.estimatedValue ? (
                      <span className="text-gray-600">~R$ {order.estimatedValue.toFixed(2)}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateServiceOrder(order.id, { status: e.target.value as any })}
                      className="text-sm px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="entregue">Entregue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {serviceOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma ordem de serviço</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nova Ordem de Serviço</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="conserto">Conserto</option>
                  <option value="ajuste">Ajuste</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="avaliacao">Avaliação</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previsão Entrega</label>
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Criar Ordem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
