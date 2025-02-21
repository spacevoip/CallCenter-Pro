import React, { useEffect, useState } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, UserCheck } from 'lucide-react';
import { cdrService, Call } from '../services/cdrService';

export function Calls() {
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCalls, setTotalCalls] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 10;

  useEffect(() => {
    loadCallsData();
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadCallsData, 30000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const loadCallsData = async () => {
    try {
      // Carregar chamadas ativas
      const activeCallsData = await cdrService.getActiveCalls();
      setActiveCalls(activeCallsData);

      // Carregar histórico de chamadas
      const { calls, total } = await cdrService.getCalls(currentPage, pageSize);
      setCallHistory(calls);
      setTotalCalls(total);

      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados das chamadas');
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCalls / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Chamadas</h1>
        <p className="text-gray-500 mt-2">Visualize e gerencie todas as chamadas do sistema</p>
      </div>

      {/* Chamadas Ativas */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Chamadas em Andamento</h2>
            <p className="text-sm text-gray-500 mt-1">Chamadas ativas no momento</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-green-600 font-medium">{activeCalls.length} chamadas ativas</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCalls.map((call) => (
            <div key={call.uniqueid} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">Ramal {call.src}</span>
                    <PhoneIncoming className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-500">Cliente: {call.dst}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-indigo-600">
                  {cdrService.formatDuration(call.duration)}
                </div>
                <div className="text-sm text-gray-500">Duração</div>
              </div>
            </div>
          ))}
          {activeCalls.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              Nenhuma chamada ativa no momento
            </div>
          )}
        </div>
      </div>

      {/* Histórico de Chamadas */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Histórico de Chamadas</h2>
            <p className="text-sm text-gray-500 mt-1">Registro completo de todas as chamadas</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="pb-4 pr-6">Data/Hora</th>
                <th className="pb-4 pr-6">Origem</th>
                <th className="pb-4 pr-6">Destino</th>
                <th className="pb-4 pr-6">Duração</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {callHistory.map((call) => (
                <tr key={call.uniqueid} className="border-t border-gray-100">
                  <td className="py-4 pr-6">
                    <div className="font-medium text-gray-900">
                      {cdrService.formatDateTime(call.calldate)}
                    </div>
                  </td>
                  <td className="py-4 pr-6 text-gray-500">{call.src}</td>
                  <td className="py-4 pr-6 text-gray-500">{call.dst}</td>
                  <td className="py-4 pr-6 text-gray-500">
                    {cdrService.formatDuration(call.duration)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        call.disposition === 'ANSWERED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {call.disposition === 'ANSWERED' ? 'Atendida' : 'Não Atendida'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> até{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalCalls)}
                </span>{' '}
                de <span className="font-medium">{totalCalls}</span> resultados
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
