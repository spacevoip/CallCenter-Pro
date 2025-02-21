import { supabase } from '../lib/supabase';

export interface Call {
  uniqueid: string;
  calldate: string;
  src: string;
  dst: string;
  duration: number;
  disposition: string;
  lastapp: string;
  userfield: string;
}

export interface CallSummary {
  date: string;
  total: number;
  answered: number;
  missed: number;
  avgDuration: number;
}

export const cdrService = {
  async getStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: calls, error } = await supabase
        .from('cdr')
        .select('*')
        .gte('calldate', today.toISOString());

      if (error) throw error;

      const total = calls.length;
      const answered = calls.filter(call => call.disposition === 'ANSWERED').length;
      const active = calls.filter(call => call.lastapp === 'Dial' && !call.disposition).length;
      const avgDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0) / (answered || 1);

      return {
        total,
        answered,
        active,
        avgDuration,
        missed: total - answered
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  async getActiveCalls() {
    try {
      const { data: calls, error } = await supabase
        .from('cdr')
        .select('*')
        .eq('lastapp', 'Dial')
        .is('disposition', null);

      if (error) throw error;

      return calls;
    } catch (error) {
      console.error('Error fetching active calls:', error);
      throw error;
    }
  },

  async getCalls(page = 1, pageSize = 10) {
    try {
      const start = (page - 1) * pageSize;

      const { data: calls, error, count } = await supabase
        .from('cdr')
        .select('*', { count: 'exact' })
        .order('calldate', { ascending: false })
        .range(start, start + pageSize - 1);

      if (error) throw error;

      return {
        calls: calls || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching calls:', error);
      throw error;
    }
  },

  async getDailySummary(days = 7) {
    try {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);

      const { data: calls, error } = await supabase
        .from('cdr')
        .select('*')
        .gte('calldate', startDate.toISOString())
        .lte('calldate', endDate.toISOString());

      if (error) throw error;

      const dailySummary: { [key: string]: CallSummary } = {};

      // Inicializar o objeto com todos os dias
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dailySummary[dateKey] = {
          date: dateKey,
          total: 0,
          answered: 0,
          missed: 0,
          avgDuration: 0
        };
      }

      // Agrupar chamadas por dia
      calls.forEach(call => {
        const dateKey = call.calldate.split('T')[0];
        if (dailySummary[dateKey]) {
          dailySummary[dateKey].total++;
          if (call.disposition === 'ANSWERED') {
            dailySummary[dateKey].answered++;
            dailySummary[dateKey].avgDuration += call.duration || 0;
          } else {
            dailySummary[dateKey].missed++;
          }
        }
      });

      // Calcular média de duração
      Object.values(dailySummary).forEach(summary => {
        if (summary.answered > 0) {
          summary.avgDuration = Math.round(summary.avgDuration / summary.answered);
        }
      });

      return Object.values(dailySummary);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      throw error;
    }
  },

  formatDuration(seconds: number) {
    if (!seconds) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
