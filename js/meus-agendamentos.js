
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. CONTROLE DO MENU MOBILE
    // ==========================================

    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");

            const isOpen = navLinks.classList.contains("open");

            if (menuBtnIcon) {
                menuBtnIcon.setAttribute(
                    "class",
                    isOpen ? "ri-close-line" : "ri-menu-line"
                );
            }
        });
    }

    // ==========================================
    // 2. VERIFICAÇÃO DA SESSÃO
    // ==========================================

    const sessao = JSON.parse(
        localStorage.getItem("sessao_gordao")
    );

    if (!sessao) {
        alert("Faça login para visualizar seus agendamentos.");
        window.location.href = "login.html";
        return;
    }

    renderizarAgendamentos(sessao);
});

// ==========================================
// 3. RENDERIZAÇÃO DOS AGENDAMENTOS
// ==========================================

function renderizarAgendamentos(sessao) {
    const container = document.getElementById("lista-agendamentos");

    if (!container) return;

    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos_gordao")
    ) || [];

    let agendamentosFiltrados = [];

    // Cliente: visualiza somente os próprios agendamentos
    if (sessao.tipo === "cliente") {
        agendamentosFiltrados = agendamentos.filter(
            (item) => item.clienteId === sessao.id
        );
    }

    // Barbeiro: visualiza somente seus próprios horários
    else if (sessao.tipo === "barbeiro") {
        agendamentosFiltrados = agendamentos.filter(
            (item) =>
                item.barbeiroId === sessao.barbeiroId ||
                item.barbeiro === sessao.barbeiroId
        );
    }

    // Administrador: visualiza todos
    else if (sessao.tipo === "administrador") {
        agendamentosFiltrados = agendamentos;
    }

    else {
        alert("Perfil de usuário não reconhecido.");
        window.location.href = "index.html";
        return;
    }

    container.innerHTML = "";

    if (agendamentosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="agendamentos-vazio"
                style="grid-column: 1 / -1; padding: 40px; text-align: center; background: #fff; border: 1px dashed #ccc; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">

                <i class="ri-calendar-event-line"
                    style="font-size: 2.5rem; color: #888;"></i>

                <h3 style="margin-top: 10px; font-size: 1.1rem; color: #111;">
                    Nenhum agendamento encontrado
                </h3>

                <p style="color: #666; font-size: 0.9rem;">
                    Não há horários vinculados a esta conta.
                </p>

                <a href="index.html#agendar" class="btn btn--small"
                    style="margin-top: 8px;">
                    VOLTAR
                </a>
            </div>
        `;

        return;
    }

    // Ordena os agendamentos por data e horário
    agendamentosFiltrados.sort((a, b) => {
        return `${a.data} ${a.horario}`.localeCompare(
            `${b.data} ${b.horario}`
        );
    });

    agendamentosFiltrados.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("agendamento-card");

        const servicosTexto = Array.isArray(item.servicos)
            ? item.servicos.join(", ")
            : item.servicos || "Serviço não informado";

        const partesData = (item.data || "").split("-");
        const dataFormatada = partesData.length === 3
            ? `${partesData[2]}/${partesData[1]}/${partesData[0]}`
            : "Data não informada";

        const barbeiros = {
            joao: "João",
            pedro: "Pedro",
            marcos: "Marcos"
        };

        const barbeiroNome =
            barbeiros[item.barbeiro] || item.barbeiro || "Não informado";

        const status = item.status || "ativo";
        const statusTexto = status === "cancelado"
            ? "Cancelado"
            : "Confirmado";

        const clienteNome = item.clienteNome || "Cliente não identificado";

        card.innerHTML = `
            <div class="agendamento-card__header">
                <h3></h3>
            </div>

            <div class="agendamento-card__body"
                style="display: flex; flex-direction: column; gap: 8px; margin: 12px 0;">

                <div class="agendamento-card__item">
                    <i class="ri-user-3-line"></i>
                    <span class="barbeiro-info"></span>
                </div>

                <div class="agendamento-card__item cliente-info">
                    <i class="ri-user-line"></i>
                    <span></span>
                </div>

                <div class="agendamento-card__item">
                    <i class="ri-calendar-line"></i>
                    <span class="data-info"></span>
                </div>

                <div class="agendamento-card__item">
                    <i class="ri-time-line"></i>
                    <span class="horario-info"></span>
                </div>

                <div class="agendamento-card__item">
                    <i class="ri-information-line"></i>
                    <span class="status-info"></span>
                </div>
            </div>

            <div class="agendamento-card__footer"
                style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 12px;">

                <div>
                    <span style="font-size: 0.75rem; color: #888;">
                        Valor Total
                    </span>
                    <p class="valor-info" style="font-weight: 700; color: #111;"></p>
                </div>

                <button class="btn--cancelar"
                    style="background: transparent; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 6px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                    <i class="ri-close-circle-line"></i> Cancelar
                </button>
            </div>
        `;

        // Insere os dados com textContent
        card.querySelector("h3").textContent = servicosTexto;
        card.querySelector(".barbeiro-info").textContent =
            `Barbeiro: ${barbeiroNome}`;
        card.querySelector(".data-info").textContent =
            `Data: ${dataFormatada}`;
        card.querySelector(".horario-info").textContent =
            `Horário: ${item.horario || "Não informado"}`;
        card.querySelector(".status-info").textContent =
            `Status: ${statusTexto}`;
        card.querySelector(".valor-info").textContent =
            item.total || "Não informado";

        // Nome do cliente aparece para barbeiros e administradores
        const clienteInfo = card.querySelector(".cliente-info");

        if (sessao.tipo === "cliente") {
            clienteInfo.remove();
        } else {
            clienteInfo.querySelector("span").textContent =
                `Cliente: ${clienteNome}`;
        }

        // Apenas clientes podem cancelar seus próprios agendamentos
        const botaoCancelar = card.querySelector(".btn--cancelar");

        if (sessao.tipo !== "cliente" || status === "cancelado") {
            botaoCancelar.remove();
        } else {
            botaoCancelar.addEventListener("click", () => {
                cancelarAgendamento(item.id, sessao);
            });
        }

        // Identificação visual do status
        if (status === "cancelado") {
            card.style.opacity = "0.65";
        }

        container.appendChild(card);
    });
}

// ==========================================
// 4. CANCELAMENTO DO AGENDAMENTO
// ==========================================

function cancelarAgendamento(id, sessao) {
    const confirmar = confirm(
        "Tem certeza que deseja cancelar este agendamento?"
    );

    if (!confirmar) return;

    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos_gordao")
    ) || [];

    const agendamento = agendamentos.find(
        (item) => item.id === id && item.clienteId === sessao.id
    );

    if (!agendamento) {
        alert("Agendamento não encontrado ou você não tem permissão para cancelá-lo.");
        return;
    }

    if (agendamento.status === "cancelado") {
        alert("Este agendamento já foi cancelado.");
        return;
    }

    // Atualiza o status sem excluir o registro
    agendamento.status = "cancelado";
    agendamento.canceladoEm = new Date().toISOString();

    localStorage.setItem(
        "agendamentos_gordao",
        JSON.stringify(agendamentos)
    );

    alert("Agendamento cancelado com sucesso!");

    renderizarAgendamentos(sessao);
}
