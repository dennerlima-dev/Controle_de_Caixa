import { useApp } from '../context';
import { Calendar, User, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';

export function CashHistory() {
  const { cashRegisters, cashEntries } = useApp();

  const sortedRegisters = [...cashRegisters].sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Histórico de Caixa</h2>
        <p className="text-gray-600 mt-1">Visualize o histórico de aberturas e fechamentos</p>
      </div>

      <div className="space-y-4">
        {sortedRegisters.map((register) => {
          const entries = cashEntries.filter((e) => e.cashRegisterId === register.id);
          const totalEntries = entries.filter((e) => e.type === 'entrada').reduce((sum, e) => sum + e.amount, 0);
          const totalExits = entries.filter((e) => e.type === 'saida').reduce((sum, e) => sum + e.amount, 0);

          return (
            <div key={register.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{register.date}</p>
                    <p className="text-sm text-gray-600">
                      {register.openingTime} {register.closingTime && `- ${register.closingTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {register.status === 'aberto' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Aberto
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      Fechado
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Operador</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {register.operatorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Inicial</p>
                    <p className="font-medium text-gray-900">
                      R$ {register.initialAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Movimentado</p>
                    <p className="font-medium text-blue-600">R$ {totalEntries.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {register.status === 'aberto' ? 'Saldo Atual' : 'Valor Final'}
                    </p>
                    <p className="font-medium text-green-600">
                      R$ {register.finalAmount?.toFixed(2) || (register.initialAmount + totalEntries - totalExits).toFixed(2)}
                    </p>
                  </div>
                </div>

                {register.status === 'fechado' && register.difference !== undefined && (
                  <div className={`p-3 rounded-lg flex items-center justify-between ${
                    Math.abs(register.difference) < 0.01 ? 'bg-green-50' : 'bg-yellow-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      {Math.abs(register.difference) < 0.01 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(register.difference) < 0.01
                          ? 'Caixa fechado sem diferenças'
                          : `Diferença: R$ ${register.difference?.toFixed(2)}`}
                      </span>
                    </div>
                    {register.expectedAmount && (
                      <span className="text-sm text-gray-600">
                        Esperado: R$ {register.expectedAmount.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}

                {register.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {register.notes}
                    </p>
                  </div>
                )}

                {/* Entries */}
                {entries.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Ver movimentações ({entries.length})
                    </summary>
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {entries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {entry.type === 'entrada' ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                              <p className="text-xs text-gray-600">{entry.time} • {entry.category}</p>
                            </div>
                          </div>
                          <p className={`text-sm font-semibold ${
                            entry.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {entry.type === 'entrada' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}

        {sortedRegisters.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum histórico de caixa encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
