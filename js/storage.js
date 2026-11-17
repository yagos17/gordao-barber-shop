// ==========================================
// GORDÃO BARBERSHOP — CENTRAL DE DADOS
// Gerencia usuários, sessões e agendamentos.
// ==========================================

const GordaoStorage = (() => {

    // Chaves utilizadas no localStorage
    const CHAVES = {
        usuarios: "usuarios_gordao",
        sessao: "sessao_gordao",
        agendamentos: "agendamentos_gordao"
    };


    // ==========================================
    // 1. FUNÇÕES AUXILIARES
    // ==========================================

    function obterDados(chave, valorPadrao = []) {
        try {
            const dados = localStorage.getItem(chave);

            return dados ? JSON.parse(dados) : valorPadrao;

        } catch (erro) {
            console.error(`Erro ao acessar ${chave}:`, erro);
            return valorPadrao;
        }
    }

    function salvarDados(chave, dados) {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
            return true;

        } catch (erro) {
            console.error(`Erro ao salvar ${chave}:`, erro);
            return false;
        }
    }


    // ==========================================
    // 2. USUÁRIOS E SESSÃO
    // ==========================================

    function obterUsuarios() {
        return obterDados(CHAVES.usuarios);
    }

    function obterSessao() {
        return obterDados(CHAVES.sessao, null);
    }

    function usuarioAutenticado() {
        return obterSessao() !== null;
    }


    // ==========================================
    // 3. AGENDAMENTOS
    // ==========================================

    function obterAgendamentos() {
        const dados = obterDados(CHAVES.agendamentos);
        return Array.isArray(dados) ? dados : [];
    }

    function salvarAgendamentos(agendamentos) {
        return salvarDados(CHAVES.agendamentos, agendamentos);
    }

    function adicionarAgendamento(agendamento) {
        const agendamentos = obterAgendamentos();

        agendamentos.push(agendamento);

        return salvarAgendamentos(agendamentos);
    }

    function atualizarAgendamento(id, alteracoes) {
        const agendamentos = obterAgendamentos();

        const indice = agendamentos.findIndex(
            item => String(item.id) === String(id)
        );

        if (indice === -1) {
            return false;
        }

        agendamentos[indice] = {
            ...agendamentos[indice],
            ...alteracoes
        };

        return salvarAgendamentos(agendamentos);
    }

    function obterAgendamentosPorCliente(clienteId) {
        return obterAgendamentos().filter(
            item => item.clienteId === clienteId
        );
    }

    function obterAgendamentosPorBarbeiro(barbeiroId) {
        return obterAgendamentos().filter(
            item => item.barbeiroId === barbeiroId
        );
    }


    // ==========================================
    // 4. DISPONIBILIZAÇÃO DAS FUNÇÕES
    // ==========================================

    return {
        obterUsuarios,
        obterSessao,
        usuarioAutenticado,

        obterAgendamentos,
        salvarAgendamentos,
        adicionarAgendamento,
        atualizarAgendamento,

        obterAgendamentosPorCliente,
        obterAgendamentosPorBarbeiro
    };

})();
