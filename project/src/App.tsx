import React from 'react';
import { 
  Phone, 
  PhoneCall, 
  CheckCircle2, 
  Clock,
  PhoneOff,
  BarChart3,
  Bell,
  Search,
  PhoneIncoming,
  PhoneOutgoing,
  UserCheck,
  LogOut
} from 'lucide-react';
import { useUser } from './contexts/UserContext';

const stats = {
  totalCalls: 1248,
  successRate: 87,
  activeCalls: 5,
  avgCallTime: '4:30',
  missedCalls: 23
};

const onlineCalls = [
  { id: 1, agent: 'Carlos Silva', client: 'João Silva', duration: '5:22', type: 'incoming', status: 'Em Andamento' },
  { id: 2, agent: 'Ana Paula', client: 'Maria Santos', duration: '2:15', type: 'outgoing', status: 'Em Andamento' },
  { id: 3, agent: 'Roberto Carlos', client: 'Pedro Alves', duration: '8:45', type: 'incoming', status: 'Em Andamento' },
  { id: 4, agent: 'Juliana Costa', client: 'Ana Costa', duration: '1:30', type: 'outgoing', status: 'Em Andamento' },
];

const recentCalls = [
  { id: 1, client: 'João Silva', time: '10:30', duration: '5:22', status: 'Concluída', phone: '(11) 98765-4321' },
  { id: 2, client: 'Maria Santos', time: '10:15', duration: '3:45', status: 'Concluída', phone: '(11) 91234-5678' },
  { id: 3, client: 'Pedro Alves', time: '10:00', duration: '2:30', status: 'Perdida', phone: '(11) 99876-5432' },
  { id: 4, client: 'Ana Costa', time: '09:45', duration: '4:15', status: 'Concluída', phone: '(11) 94567-8901' },
];

function StatCard({ icon: Icon, title, value, color, bgColor }: any) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-10">
          <PhoneCall className="h-8 w-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">CallCenter Pro</h1>
        </div>
        
        <nav className="flex flex-col h-[calc(100%-8rem)] justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Principal</p>
            <a href="#" className="flex items-center space-x-3 text-indigo-600 bg-indigo-50 rounded-lg px-4 py-3">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 rounded-lg px-4 py-3">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Chamadas</span>
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-600 hover:bg-red-50 rounded-lg px-4 py-3 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 w-96">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar chamadas, clientes..."
                className="ml-3 bg-transparent outline-none w-full text-sm"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-600">JS</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={Phone}
              title="Total de Chamadas"
              value={stats.totalCalls}
              color="bg-blue-500"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={CheckCircle2}
              title="Taxa de Sucesso"
              value={`${stats.successRate}%`}
              color="bg-green-500"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={PhoneCall}
              title="Chamadas Ativas"
              value={stats.activeCalls}
              color="bg-indigo-500"
              bgColor="bg-indigo-50"
            />
            <StatCard
              icon={Clock}
              title="Tempo Médio"
              value={stats.avgCallTime}
              color="bg-amber-500"
              bgColor="bg-amber-50"
            />
            <StatCard
              icon={PhoneOff}
              title="Chamadas Perdidas"
              value={stats.missedCalls}
              color="bg-red-500"
              bgColor="bg-red-50"
            />
          </div>

          {/* Online Calls Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Chamadas Online</h2>
                <p className="text-sm text-gray-500 mt-1">Chamadas em andamento neste momento</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-green-600 font-medium">{onlineCalls.length} chamadas ativas</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onlineCalls.map((call) => (
                <div key={call.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{call.agent}</span>
                        {call.type === 'incoming' ? (
                          <PhoneIncoming className="h-4 w-4 text-green-500" />
                        ) : (
                          <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{call.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-indigo-600">{call.duration}</div>
                    <div className="text-sm text-gray-500">Duração</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Calls Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Chamadas Recentes</h2>
                  <p className="text-sm text-gray-500 mt-1">Últimas chamadas registradas</p>
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                  Ver todas
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {call.client.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{call.client}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          call.status === 'Concluída' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;