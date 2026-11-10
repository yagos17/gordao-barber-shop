document.addEventListener("DOMContentLoaded", () => {
    // 1. Controle do Menu Mobile 
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            const isOpen = navLinks.classList.contains("open");
            menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
        });
    }

    // 2. Renderiza os agendamentos salvos ao carregar a página
    renderizarAgendamentos();
});

// Função que lê o localStorage e desenha os cartões na tela
function renderizarAgendamentos() {
    const container = document.getElementById("lista-agendamentos");
    
    // Busca a lista salva no localStorage (ou cria array vazio se não houver nada)
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos_gordao")) || [];

    // Se a lista estiver vazia, exibe uma mensagem com um botão para voltar a agendar
    if (agendamentos.length === 0) {
        container.innerHTML = `
            <div class="agendamentos-vazio" style="grid-column: 1 / -1; padding: 40px; text-align: center; background: #fff; border: 1px dashed #ccc; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
                <i class="ri-calendar-event-line" style="font-size: 2.5rem; color: #888;"></i>
                <h3 style="margin-top: 10px; font-size: 1.1rem; color: #111;">Nenhum agendamento encontrado</h3>
                <p style="color: #666; font-size: 0.9rem;">Você ainda não possui horários reservados na barbearia.</p>
                <a href="index.html#agendar" class="btn btn--small" style="margin-top: 8px; display: inline-flex; align-items: center; justify-content: center; text-align: center;">AGENDAR AGORA</a>
            </div>
        `;
        return;
    }

    // Limpa o container antes de desenhar
    container.innerHTML = "";

    // Percorre cada agendamento salvo e cria o cartão HTML
    agendamentos.forEach(item => {
        const servicosTexto = Array.isArray(item.servicos) ? item.servicos.join(", ") : item.servicos;

        // ---> FORMATAÇÃO DA DATA PARA DD-MM-YYYY <---
        const partesData = item.data.split("-"); 
        const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`; 

        const card = document.createElement("div");
        card.classList.add("agendamento-card");

        card.innerHTML = `
            <div class="agendamento-card__header">
                <h3>${servicosTexto}</h3>
            </div>
            <div class="agendamento-card__body" style="display: flex; flex-direction: column; gap: 8px; margin: 12px 0;">
                <div class="agendamento-card__item" style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #555;">
                    <i class="ri-user-3-line"></i>
                    <span><strong>Barbeiro:</strong> ${item.barbeiro}</span>
                </div>
                <div class="agendamento-card__item" style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #555;">
                    <i class="ri-calendar-line"></i>
                    <span><strong>Data:</strong> ${dataFormatada}</span>
                </div>
                <div class="agendamento-card__item" style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #555;">
                    <i class="ri-time-line"></i>
                    <span><strong>Horário:</strong> ${item.horario}</span>
                </div>
            </div>
            <div class="agendamento-card__footer" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 12px;">
                <div>
                    <span style="font-size: 0.75rem; color: #888;">Valor Total</span>
                    <p style="font-weight: 700; color: #111;">${item.total}</p>
                </div>
                <button class="btn--cancelar" onclick="cancelarAgendamento(${item.id})" style="background: transparent; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 6px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                    <i class="ri-delete-bin-line"></i> Cancelar
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Função para cancelar um agendamento
function cancelarAgendamento(id) {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
        let agendamentos = JSON.parse(localStorage.getItem("agendamentos_gordao")) || [];
        
        // Remove o item clicado através do ID
        agendamentos = agendamentos.filter(item => item.id !== id);

        // Atualiza o localStorage
        localStorage.setItem("agendamentos_gordao", JSON.stringify(agendamentos));

        // Atualiza a tela na hora
        renderizarAgendamentos();
    }
}