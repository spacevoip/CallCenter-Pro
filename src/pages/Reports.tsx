import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, LineChart } from 'lucide-react';
import { cdrService, CallSummary } from '../services/cdrService';

interface CallTypeData {
  type: string;
  count: number;
  color: string;
}

export function Reports() {
  const [weeklyStats, setWeeklyStats] = useState<CallSummary[]>([]);
  const [callTypes, setCallTypes] = useState<CallTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      // Carregar resumo diário das últimas 7 dias
      const dailySummary = await cdrService.getDailySummary(7);
      setWeeklyStats(dailySummary);

      // Calcular totais por tipo
      const totalAnswered = dailySummary.reduce((sum, day) => sum + day.answered, 0);
      const totalMissed = dailySummary.reduce((sum, day) => sum + day.missed, 0);
      const totalCalls = totalAnswered + totalMissed;

      setCallTypes([
        { type: 'Atendidas', count: totalAnswered, color: 'bg-green-500' },
        { type: 'Perdidas', count: totalMissed, color: 'bg-red-500' }
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados dos relatórios');
      setLoading(false);
    }
  };

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

  // Calcular o maior valor para o gráfico
  const maxCalls = Math.max(...weeklyStats.map(day => day.total));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-500 mt-2">Análise detalhada das chamadas e desempenho</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico Semanal */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Chamadas por Dia</h2>
              <p className="text-sm text-gray-500 mt-1">Últimos 7 dias</p>
            </div>
            <LineChart className="h-6 w-6 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between">
            {weeklyStats.map((day, index) => {
              const height = (day.total / maxCalls) * 200;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
              
              return (
                <div key={day.date} className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-indigo-500 rounded-t-lg transition-all duration-300 hover:bg-indigo-600"
                    style={{ height: `${height}px` }}
                  ></div>
                  <span className="text-sm text-gray-600 mt-2">{dayName}</span>
                  <span className="text-xs text-gray-500">{day.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tipos de Chamadas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Tipos de Chamadas</h2>
              <p className="text-sm text-gray-500 mt-1">Distribuição por status</p>
            </div>
            <PieChart className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {callTypes.map((type) => {
              const totalCalls = callTypes.reduce((sum, t) => sum + t.count, 0);
              const percentage = totalCalls > 0 ? (type.count / totalCalls) * 100 : 0;
              
              return (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{type.type}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${type.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{type.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Métricas de Desempenho */}
        <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Métricas de Desempenho</h2>
              <p className="text-sm text-gray-500 mt-1">Indicadores principais</p>
            </div>
            <BarChart className="h-6 w-6 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Tempo Médio de Atendimento</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {cdrService.formatDuration(
                    Math.round(
                      weeklyStats.reduce((sum, day) => sum + day.avgDuration, 0) / weeklyStats.length
                    )
                  )}
                </p>
                <p className="ml-2 text-sm text-gray-500">minutos</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Taxa de Atendimento</h3>
              <div className="mt-2 flex items-baseline">
                {(() => {
                  const totalCalls = weeklyStats.reduce((sum, day) => sum + day.total, 0);
                  const answeredCalls = weeklyStats.reduce((sum, day) => sum + day.answered, 0);
                  const rate = totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0;
                  
                  return (
                    <>
                      <p className="text-2xl font-semibold text-gray-900">{rate}%</p>
                      <p className="ml-2 text-sm text-green-500">
                        {rate > 80 ? '+' : '-'}{Math.abs(rate - 80)}%
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500">Total de Chamadas</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {weeklyStats.reduce((sum, day) => sum + day.total, 0)}
                </p>
                <p className="ml-2 text-sm text-gray-500">últimos 7 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
