import { useState } from 'react';
import { useApp } from '../context';
import { toast } from 'sonner';
import { Plus, Scale } from 'lucide-react';

export function SilverEvaluation() {
  const { silverEvaluations, clients, addSilverEvaluation, updateSilverEvaluation } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    silverType: '925',
    weight: 0,
    pricePerGram: 0,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.weight <= 0 || formData.pricePerGram <= 0) {
      toast.error('Peso e preço devem ser maiores que zero');
      return;
    }

    const totalValue = formData.weight * formData.pricePerGram;
    const client = clients.find((c) => c.id === formData.clientId);

    addSilverEvaluation({
      clientId: formData.clientId || undefined,
      clientName: client?.name || formData.clientName,
      date: new Date().toLocaleDateString('pt-BR'),
      silverType: formData.silverType,
      weight: formData.weight,
      pricePerGram: formData.pricePerGram,
      totalValue,
      description: formData.description,
      status: 'avaliado',
    });

    toast.success('Avaliação registrada');
    setIsModalOpen(false);
    setFormData({ clientId: '', clientName: '', silverType: '925', weight: 0, pricePerGram: 0, description: '' });
  };

  const statusLabels = {
    avaliado: 'Avaliado',
    comprado: 'Comprado',
    recusado: 'Recusado',
  };

  const statusColors = {
    avaliado: 'bg-blue-100 text-blue-700',
    comprado: 'bg-green-100 text-green-700',
    recusado: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Avaliação de Prata</h2>
          <p className="text-gray-600 mt-1">Registre avaliações de peças de prata</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Avaliação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Peso (g)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">R$/g</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Valor Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {silverEvaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{evaluation.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {evaluation.clientName || 'Sem cadastro'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">Prata {evaluation.silverType}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{evaluation.weight.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    R$ {evaluation.pricePerGram.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    R$ {evaluation.totalValue.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[evaluation.status]}`}>
                      {statusLabels[evaluation.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {evaluation.status === 'avaliado' && (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            updateSilverEvaluation(evaluation.id, { status: 'comprado' });
                            toast.success('Marcado como comprado');
                          }}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Comprar
                        </button>
                        <button
                          onClick={() => {
                            updateSilverEvaluation(evaluation.id, { status: 'recusado' });
                            toast.info('Marcado como recusado');
                          }}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {silverEvaluations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma avaliação registrada</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nova Avaliação de Prata</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente Cadastrado
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Nenhum (informar nome)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {!formData.clientId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome (opcional)"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Prata *
                </label>
                <select
                  value={formData.silverType}
                  onChange={(e) => setFormData({ ...formData, silverType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="925">925 (Sterling)</option>
                  <option value="950">950</option>
                  <option value="999">999 (Pura)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (gramas) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço por Grama (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.pricePerGram}
                  onChange={(e) => setFormData({ ...formData, pricePerGram: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.weight > 0 && formData.pricePerGram > 0 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    Valor Total: R$ {(formData.weight * formData.pricePerGram).toFixed(2)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva a peça..."
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
                  Registrar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
