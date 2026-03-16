import { useState } from 'react';
import { useApp } from '../context';
import { toast } from 'sonner';
import { Plus, BookmarkCheck, X } from 'lucide-react';
import type { Reservation } from '../types';

export function Reservations() {
  const { reservations, products, clients, addReservation, updateReservation } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    clientId: '',
    quantity: 1,
    expiryDate: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === formData.productId);
    const client = clients.find((c) => c.id === formData.clientId);

    if (!product || !client) {
      toast.error('Selecione produto e cliente');
      return;
    }

    const now = new Date();
    addReservation({
      productId: formData.productId,
      productName: product.name,
      clientId: formData.clientId,
      clientName: client.name,
      quantity: formData.quantity,
      date: now.toLocaleDateString('pt-BR'),
      expiryDate: formData.expiryDate,
      status: 'ativa',
      notes: formData.notes,
    });

    toast.success('Reserva criada');
    setIsModalOpen(false);
    setFormData({ productId: '', clientId: '', quantity: 1, expiryDate: '', notes: '' });
  };

  const activeReservations = reservations.filter((r) => r.status === 'ativa');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reservas</h2>
          <p className="text-gray-600 mt-1">Gerencie reservas de produtos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Reserva
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookmarkCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{reservation.productName}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cliente</p>
                    <p className="font-medium text-gray-900">{reservation.clientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantidade</p>
                    <p className="font-medium text-gray-900">{reservation.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Data Reserva</p>
                    <p className="font-medium text-gray-900">{reservation.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Validade</p>
                    <p className="font-medium text-gray-900">{reservation.expiryDate}</p>
                  </div>
                </div>
                {reservation.notes && (
                  <p className="text-sm text-gray-600 mt-2">{reservation.notes}</p>
                )}
              </div>
              <button
                onClick={() => {
                  updateReservation(reservation.id, { status: 'cancelada' });
                  toast.info('Reserva cancelada');
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {activeReservations.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            <BookmarkCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma reserva ativa</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nova Reserva</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  {products.filter((p) => p.stock > p.reservedStock).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.stock - p.reservedStock} disponível)
                    </option>
                  ))}
                </select>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validade *</label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
                  Criar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
