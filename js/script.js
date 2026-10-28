// ==========================================
// 1. CONTROLE DO MENU RESPONSIVO (MOBILE)
// ==========================================

// Seleciona o botão de abrir/fechar o menu e o container dos links de navegação
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
// Seleciona o ícone (tag <i>) que está dentro do botão do menu
const menuBtnIcon = menuBtn.querySelector("i");

// Adiciona um ouvinte de clique no botão do menu
menuBtn.addEventListener("click", () => {
    // Alterna a classe "open" no menu (se tiver, tira; se não tiver, coloca)
    navLinks.classList.toggle("open");

    // Verifica se o menu ficou aberto ou fechado após o clique
    const isOpen = navLinks.classList.contains("open");

    // Troca o ícone: se estiver aberto vira "X" (fechar), senão vira as barras (menu)
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

// Fecha o menu automaticamente quando o usuário clica em qualquer link de navegação
navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});


// ==========================================
// 2. CÁLCULO DINÂMICO DO TOTAL DOS SERVIÇOS
// ==========================================

// Garante que o código só executa após todo o HTML da página carregar
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os checkboxes dos cards de serviços e o elemento do preço total
    const checkboxes = document.querySelectorAll(".booking-card__checkbox");
    const totalElement = document.getElementById("total-value");

    // Função responsável por calcular a soma dos serviços marcados
    function calcularTotal() {
        let total = 0;

        // Passa por cada checkbox para ver se está marcado
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                // Pega o valor do atributo "data-price" e converte para número decimal
                const price = parseFloat(checkbox.getAttribute("data-price")) || 0;
                total += price; // Soma ao valor total acumulado
            }
        });

        // Formata o número final para o padrão monetário brasileiro (R$ 0,00) e exibe na tela
        totalElement.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Adiciona um evento de mudança em cada checkbox para recalcular o preço na hora
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", calcularTotal);
    });
});


// ==========================================
// 3. PROCESSAMENTO E SALVAMENTO DO AGENDAMENTO
// ==========================================

// Seleciona o formulário principal da página
const bookingForm = document.querySelector("form");

// Escuta o evento de envio (quando o botão "Próximo Passo" é clicado)
bookingForm.addEventListener("submit", (event) => {
    // Evita o comportamento padrão do formulário (que recarregaria a página inteira)
    event.preventDefault();

    // Filtra apenas os checkboxes que estão marcados pelo usuário
    const servicosSelecionados = document.querySelectorAll(".booking-card__checkbox:checked");

    // Validação: se nenhum serviço foi marcado, exibe um alerta e interrompe o envio
    if (servicosSelecionados.length == 0) {
        alert("Por favor, selecione pelo menos um serviço antes de continuar!");
        return;
    }

    // Coleta os valores preenchidos nos campos do formulário
    const barbeiro = document.querySelector("select[name='barbeiro']").value;
    const data = document.querySelector("input[type='date']").value;
    const horario = document.querySelector("input[type='time']").value;

    // Cria um objeto estruturado contendo todas as informações do agendamento
    const novoAgendamento = {
        id: Date.now(), // Gera um ID único baseado no timestamp atual
        // Transforma a lista de checkboxes selecionados nos nomes dos serviços correspondentes
        servicos: Array.from(servicosSelecionados).map(cb => {
            return cb.closest(".booking-card").querySelector("h3").innerText;
        }),
        barbeiro: barbeiro,
        data: data,
        horario: horario,
        total: document.getElementById("total-value").innerText
    };

    // Recupera os agendamentos salvos anteriormente no navegador (ou inicia uma lista vazia)
    let agendamentos = JSON.parse(localStorage.getItem("agendamentos_gordao")) || [];
    
    // Adiciona o novo agendamento dentro da lista
    agendamentos.push(novoAgendamento);
    
    // Salva a lista atualizada no "localStorage" convertendo para texto (JSON)
    localStorage.setItem("agendamentos_gordao", JSON.stringify(agendamentos));

    // Mensagem de sucesso para o usuário
    alert("Agendamento guardado com sucesso!");
});