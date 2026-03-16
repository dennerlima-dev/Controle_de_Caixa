import { useState } from 'react';
import { useApp } from '../context';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { Wallet, Plus, Minus, DollarSign, Clock, TrendingUp, TrendingDown } from 'lucide-react';

export function CashRegister() {
  const { activeCashRegister, openCashRegister, closeCashRegister, currentUser, cashEntries, addCashEntry } = useApp();
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [isEntryModal, setIsEntryModal] = useState(false);
  const [initialAmount, setInitialAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [closingNotes, setClosingNotes] = useState('');

  const [entryData, setEntryData] = useState({
    type: 'entrada' as 'entrada' | 'saida',
    category: 'outro' as any,
    amount: 0,
    description: '',
  });

  const handleOpenCashRegister = () => {
    if (initialAmount < 0) {
      toast.error('Valor inicial inválido');
      return;
    }

    const now = new Date();
    openCashRegister({
      date: now.toLocaleDateString('pt-BR'),
      openingTime: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      initialAmount,
    });

    toast.success('Caixa aberto com sucesso!');
    setIsOpeningModal(false);
    setInitialAmount(0);
  };

  const handleCloseCashRegister = () => {
    if (!activeCashRegister) return;

    if (finalAmount < 0) {
      toast.error('Valor final inválido');
      return;
    }

    closeCashRegister(activeCashRegister.id, {
      finalAmount,
      notes: closingNotes,
    });

    toast.success('Caixa fechado com sucesso!');
    setIsClosingModal(false);
    setFinalAmount(0);
    setClosingNotes('');
  };

  const handleAddEntry = () => {
    if (!activeCashRegister) return;

    if (entryData.amount <= 0) {
      toast.error('Valor inválido');
      return;
    }

    if (!entryData.description) {
      toast.error('Descrição é obrigatória');
      return;
    }

    const now = new Date();
    addCashEntry({
      cashRegisterId: activeCashRegister.id,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: entryData.type,
      category: entryData.category,
      amount: entryData.amount,
      description: entryData.description,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    toast.success(entryData.type === 'entrada' ? 'Entrada registrada' : 'Saída registrada');
    setIsEntryModal(false);
    setEntryData({ type: 'entrada', category: 'outro', amount: 0, description: '' });
  };

  const todayEntries = activeCashRegister
    ? cashEntries.filter((e) => e.cashRegisterId === activeCashRegister.id)
    : [];

  const totalEntries = todayEntries.filter((e) => e.type === 'entrada').reduce((sum, e) => sum + e.amount, 0);
  const totalExits = todayEntries.filter((e) => e.type === 'saida').reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = activeCashRegister ? activeCashRegister.initialAmount + totalEntries - totalExits : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Controle de Caixa</h2>
          <p className="text-gray-600 mt-1">Gerencie o caixa e movimentações</p>
        </div>
        <Link
          to="/caixa/historico"
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          Ver Histórico
        </Link>
      </div>

      {/* Cash Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {activeCashRegister ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Caixa Aberto</h3>
                  <p className="text-sm text-gray-600">
                    Operador: {activeCashRegister.operatorName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClosingModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Fechar Caixa
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Abertura</p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeCashRegister.openingTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Inicial</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {activeCashRegister.initialAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Movimentado</p>
                <p className="text-lg font-semibold text-blue-600">
                  R$ {totalEntries.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Saldo Atual</p>
                <p className="text-lg font-semibold text-green-600">
                  R$ {currentBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Caixa Fechado</h3>
            <p className="text-gray-600 mb-4">Abra o caixa para começar a registrar vendas</p>
            <button
              onClick={() => setIsOpeningModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Abrir Caixa
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {activeCashRegister && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setEntryData({ ...entryData, type: 'entrada' });
              setIsEntryModal(true);
            }}
            className="flex items-center gap-3 p-4 bg-white border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <div className="p-3 bg-green-100 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Registrar Entrada</h3>
              <p className="text-sm text-gray-600">Adicionar valor ao caixa</p>
            </div>
          </button>

          <button
            onClick={() => {
              setEntryData({ ...entryData, type: 'saida' });
              setIsEntryModal(true);
            }}
            className="flex items-center gap-3 p-4 bg-white border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <div className="p-3 bg-red-100 rounded-lg">
              <Minus className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Registrar Saída</h3>
              <p className="text-sm text-gray-600">Retirar valor do caixa</p>
            </div>
          </button>
        </div>
      )}

      {/* Recent Entries */}
      {activeCashRegister && todayEntries.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Movimentações de Hoje</h3>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {todayEntries.slice().reverse().map((entry) => (
              <div key={entry.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${entry.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {entry.type === 'entrada' ? (
                      <TrendingUp className={`w-5 h-5 ${entry.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                      <TrendingDown className={`w-5 h-5 ${entry.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entry.description}</p>
                    <p className="text-sm text-gray-600">
                      {entry.time} • {entry.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-semibold ${entry.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.type === 'entrada' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opening Modal */}
      {isOpeningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Abrir Caixa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Inicial (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsOpeningModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleOpenCashRegister}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Abrir Caixa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Closing Modal */}
      {isClosingModal && activeCashRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fechar Caixa</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Inicial:</span>
                  <span className="font-medium">R$ {activeCashRegister.initialAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Entradas:</span>
                  <span className="font-medium text-green-600">R$ {totalEntries.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Saídas:</span>
                  <span className="font-medium text-red-600">R$ {totalExits.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Valor Esperado:</span>
                  <span className="font-semibold text-blue-600">R$ {currentBalance.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Final Contado (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              {finalAmount > 0 && (
                <div className={`p-3 rounded-lg ${Math.abs(finalAmount - currentBalance) < 0.01 ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className="text-sm font-medium">
                    Diferença: R$ {(finalAmount - currentBalance).toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  rows={3}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsClosingModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCloseCashRegister}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Fechar Caixa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Modal */}
      {isEntryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Registrar {entryData.type === 'entrada' ? 'Entrada' : 'Saída'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={entryData.category}
                  onChange={(e) => setEntryData({ ...entryData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {entryData.type === 'entrada' ? (
                    <>
                      <option value="pagamento_cliente">Pagamento de Cliente</option>
                      <option value="ajuste">Ajuste</option>
                      <option value="deposito">Depósito</option>
                      <option value="outro">Outro</option>
                    </>
                  ) : (
                    <>
                      <option value="sangria">Sangria</option>
                      <option value="despesa">Despesa</option>
                      <option value="ajuste">Ajuste</option>
                      <option value="outro">Outro</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={entryData.amount}
                  onChange={(e) => setEntryData({ ...entryData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  rows={3}
                  value={entryData.description}
                  onChange={(e) => setEntryData({ ...entryData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsEntryModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEntry}
                  className={`px-4 py-2 text-white rounded-lg ${
                    entryData.type === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
