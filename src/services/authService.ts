import { supabase } from '../lib/supabase';

interface Extension {
  id: number;
  numero: string;
  bloqueio: boolean;
  nome: string;
  callerid: string;
  senha: string;
  status: string;
  snystatus: string;
  stagente: string;
}

export const authService = {
  async login(ramal: string) {
    try {
      // Primeiro, verificar se o usuário já está logado
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut(); // Fazer logout se já estiver logado
      }

      // Buscar o ramal na tabela extensions
      const { data: extension, error: extensionError } = await supabase
        .from('extensions')
        .select('*')
        .eq('numero', ramal)
        .single();

      if (extensionError || !extension) {
        console.error('Erro ao buscar ramal:', extensionError);
        throw new Error('Ramal não encontrado');
      }

      console.log('Dados do ramal encontrado:', extension);

      // Log para debug
      console.log('Verificando bloqueio do ramal:', {
        ramal: extension.numero,
        bloqueio: extension.bloqueio,
        tipo: typeof extension.bloqueio
      });

      // Verificar APENAS se o ramal está bloqueado
      if (extension.bloqueio === true) {
        console.error('Ramal bloqueado:', extension.numero);
        throw new Error('Ramal bloqueado. Para mais informações, entre em contato com o administrador.');
      }

      // Se não estiver bloqueado, proceder com o login
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${ramal}@ramal.local`,
        password: extension.senha // Usando a senha real do ramal
      });

      if (signInError) {
        console.error('Erro no signIn:', signInError);
        throw new Error('Erro na autenticação. Tente novamente.');
      }

      if (!authData?.user) {
        throw new Error('Erro na autenticação. Usuário não encontrado.');
      }

      return {
        user: authData.user,
        extension: {
          ramal: extension.numero,
          nome: extension.nome,
          caller_id: extension.callerid,
          status: extension.status,
          snystatus: extension.snystatus,
          stagente: extension.stagente
        }
      };
    } catch (error) {
      console.error('Erro completo no login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      // Verificar a sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        return null;
      }

      // Extrair o ramal do email do usuário
      const ramal = session.user.email?.split('@')[0];
      if (!ramal) return null;

      // Verificar apenas o bloqueio do ramal
      const { data: extension, error: extensionError } = await supabase
        .from('extensions')
        .select('*')
        .eq('numero', ramal)
        .single();

      if (extensionError || !extension) {
        console.error('Ramal não encontrado na verificação:', ramal);
        await this.logout();
        return null;
      }

      // Se estiver bloqueado, fazer logout
      if (extension.bloqueio === true) {
        console.error('Ramal bloqueado na verificação:', ramal);
        await this.logout();
        return null;
      }

      return {
        ...session.user,
        extension: {
          ramal: extension.numero,
          nome: extension.nome,
          caller_id: extension.callerid,
          status: extension.status,
          snystatus: extension.snystatus,
          stagente: extension.stagente
        }
      };
    } catch (error) {
      console.error('Erro ao verificar usuário atual:', error);
      return null;
    }
  }
};
