// ==========================================
// 1. CONTROLE DO MENU RESPONSIVO (MOBILE)
// ==========================================

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

if (navLinks) {
    navLinks.addEventListener("click", (e) => {
        navLinks.classList.remove("open");
        if (menuBtnIcon) menuBtnIcon.setAttribute("class", "ri-menu-line");
    });
}


// ==========================================
// 2. CÁLCULO DINÂMICO DO TOTAL E DATA MÍNIMA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".booking-card__checkbox");
    const totalElement = document.getElementById("total-value");
    const inputData = document.getElementById("data_agendamento");

    // Trava automaticamente o campo de data para não permitir dias anteriores a hoje
    if (inputData) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        inputData.min = `${ano}-${mes}-${dia}`;
    }

    // Função responsável por calcular a soma dos serviços marcados
    function calcularTotal() {
        let total = 0;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const price = parseFloat(checkbox.getAttribute("data-price")) || 0;
                total += price;
            }
        });

        if (totalElement) {
            totalElement.textContent = total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", calcularTotal);
    });
});


// ==========================================
// 3. PROCESSAMENTO, VALIDAÇÃO E SALVAMENTO
// ==========================================

const bookingForm = document.querySelector("form");

if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Filtra apenas os checkboxes marcados
        const servicosSelecionados = document.querySelectorAll(".booking-card__checkbox:checked");

        if (servicosSelecionados.length === 0) {
            alert("Por favor, selecione pelo menos um serviço antes de continuar!");
            return;
        }

        // Coleta os valores dos campos usando os IDs corretos do HTML
        const barbeiro = document.querySelector("select[name='barbeiro']").value;
        const dataInput = document.getElementById("data_agendamento").value;
        const horarioInput = document.getElementById("horario_agendamento").value;

        // Validação estrita de data
        const hojeStr = new Date().toISOString().split("T")[0];
        if (!dataInput || dataInput < hojeStr) {
            alert("Você não pode agendar para uma data que já passou!");
            return;
        }

        // Validação de horário comercial (das 08:00 às 20:00)
        if (!horarioInput || horarioInput < "08:00" || horarioInput > "20:00") {
            alert("Nosso horário de funcionamento é das 08:00 às 20:00.");
            return;
        }

        // Cria o objeto do novo agendamento
        const novoAgendamento = {
            id: Date.now(),
            servicos: Array.from(servicosSelecionados).map(cb => {
                return cb.closest(".booking-card").querySelector("h3").innerText;
            }),
            barbeiro: barbeiro,
            data: dataInput,
            horario: horarioInput,
            total: document.getElementById("total-value").innerText
        };

        // Salva no localStorage
        let agendamentos = JSON.parse(localStorage.getItem("agendamentos_gordao")) || [];
        agendamentos.push(novoAgendamento);
        localStorage.setItem("agendamentos_gordao", JSON.stringify(agendamentos));

        // Redireciona para a tela de Meus Agendamentos
        window.location.href = "meus-agendamentos.html";
    });
}