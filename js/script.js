
// ==========================================
// 1. CONTROLE DO MENU RESPONSIVO (MOBILE)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
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

    if (navLinks) {
        navLinks.addEventListener("click", () => {
            navLinks.classList.remove("open");

            if (menuBtnIcon) {
                menuBtnIcon.setAttribute("class", "ri-menu-line");
            }
        });
    }

    // ==========================================
    // 2. DATA MÍNIMA E CÁLCULO DOS SERVIÇOS
    // ==========================================

    const checkboxes = document.querySelectorAll(".booking-card__checkbox");
    const totalElement = document.getElementById("total-value");
    const inputData = document.getElementById("data_agendamento");

    if (inputData) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");

        inputData.min = `${ano}-${mes}-${dia}`;
    }

    function calcularTotal() {
        let total = 0;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                total += parseFloat(checkbox.dataset.price) || 0;
            }
        });

        if (totalElement) {
            totalElement.textContent = total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }
    }

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", calcularTotal);
    });

    // ==========================================
    // 3. PROCESSAMENTO DO AGENDAMENTO
    // ==========================================

    const bookingForm =
        document.querySelector("#agendar form") ||
        document.querySelector("form");

    if (!bookingForm) return;

    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Verifica se existe um usuário autenticado
        const sessao = JSON.parse(
            localStorage.getItem("sessao_gordao")
        );

        if (!sessao) {
            alert("Faça login para realizar um agendamento.");
            window.location.href = "login.html";
            return;
        }

        // Somente clientes podem realizar agendamentos
        if (sessao.tipo !== "cliente") {
            alert("Esta funcionalidade está disponível para clientes.");
            return;
        }

        const servicosSelecionados = document.querySelectorAll(
            ".booking-card__checkbox:checked"
        );

        if (servicosSelecionados.length === 0) {
            alert("Selecione pelo menos um serviço antes de continuar!");
            return;
        }

        const barbeiroSelect = document.querySelector(
            "select[name='barbeiro']"
        );

        const dataInput = document.getElementById("data_agendamento");
        const horarioInput = document.getElementById("horario_agendamento");

        if (!barbeiroSelect || !dataInput || !horarioInput) {
            alert("Não foi possível localizar todos os campos do agendamento.");
            return;
        }

        const barbeiro = barbeiroSelect.value;
        const data = dataInput.value;
        const horario = horarioInput.value;

        if (!barbeiro || !data || !horario) {
            alert("Preencha todos os campos do agendamento.");
            return;
        }

        // Compara a data usando o calendário local
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataEscolhida = new Date(`${data}T00:00:00`);

        if (dataEscolhida < hoje) {
            alert("Você não pode agendar para uma data que já passou!");
            return;
        }

        // Horário de funcionamento
        if (horario < "08:00" || horario > "20:00") {
            alert("Nosso horário de funcionamento é das 08:00 às 20:00.");
            return;
        }

        // Recupera os agendamentos existentes
        const agendamentos = JSON.parse(
            localStorage.getItem("agendamentos_gordao")
        ) || [];

        // Verifica se o barbeiro já possui esse horário reservado
        const horarioOcupado = agendamentos.some((item) => {
            return (
                item.barbeiro === barbeiro &&
                item.data === data &&
                item.horario === horario &&
                item.status !== "cancelado"
            );
        });

        if (horarioOcupado) {
            alert("Esse horário já está reservado para o barbeiro escolhido. Selecione outro horário.");
            return;
        }

        // Monta o novo agendamento vinculado ao cliente
        const novoAgendamento = {
            id: Date.now(),
            clienteId: sessao.id,
            clienteNome: sessao.nome,
            clienteEmail: sessao.email,

            servicos: Array.from(servicosSelecionados).map((checkbox) => {
                const card = checkbox.closest(".booking-card");
                return card.querySelector("h3").textContent.trim();
            }),

            barbeiro: barbeiro,
            barbeiroId: barbeiro,
            data: data,
            horario: horario,
            total: totalElement ? totalElement.textContent : "R$ 0,00",

            status: "ativo",
            criadoEm: new Date().toISOString()
        };

        agendamentos.push(novoAgendamento);

        localStorage.setItem(
            "agendamentos_gordao",
            JSON.stringify(agendamentos)
        );

        alert("Agendamento realizado com sucesso!");

        window.location.href = "meus-agendamentos.html";
    });
});
