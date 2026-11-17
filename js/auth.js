// ==========================================
// GORDÃO BARBERSHOP — AUTENTICAÇÃO SIMULADA
// Etapa 1: cadastro, login e sessão local
// ==========================================

const CHAVE_USUARIOS = "usuarios_gordao";
const CHAVE_SESSAO = "sessao_gordao";

function obterUsuarios() {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function obterSessao() {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO));
}

function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
    window.location.href = "index.html";
}

// Cria contas fictícias para testar os três tipos de acesso.
function prepararContasDeTeste() {
    const usuarios = obterUsuarios();

    const contasDemo = [
        {
            id: "admin-001",
            nome: "Administrador",
            email: "admin@gordao.com",
            senha: "Admin123",
            tipo: "administrador"
        },
        {
            id: "barbeiro-001",
            nome: "João",
            email: "joao@gordao.com",
            senha: "Joao123",
            tipo: "barbeiro",
            barbeiroId: "joao"
        },
        {
            id: "barbeiro-002",
            nome: "Pedro",
            email: "pedro@gordao.com",
            senha: "Pedro123",
            tipo: "barbeiro",
            barbeiroId: "pedro"
        },
        {
            id: "barbeiro-003",
            nome: "Marcos",
            email: "marcos@gordao.com",
            senha: "Marcos123",
            tipo: "barbeiro",
            barbeiroId: "marcos"
        }
    ];

    let alterou = false;

    contasDemo.forEach(conta => {
        const jaExiste = usuarios.some(
            usuario => usuario.email.toLowerCase() === conta.email
        );

        if (!jaExiste) {
            usuarios.push(conta);
            alterou = true;
        }
    });

    if (alterou || !localStorage.getItem(CHAVE_USUARIOS)) {
        salvarUsuarios(usuarios);
    }
}

function exibirMensagem(elemento, mensagem, tipo = "erro") {
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.className = `auth-message auth-message--${tipo}`;
    elemento.hidden = false;
}

function limparMensagem(elemento) {
    if (!elemento) return;
    elemento.textContent = "";
    elemento.hidden = true;
}

// Cadastro público: sempre cria um usuário do tipo cliente.
function configurarCadastro() {
    const formulario = document.getElementById("form-cadastro");
    if (!formulario) return;

    const mensagem = document.getElementById("auth-message");

    formulario.addEventListener("submit", event => {
        event.preventDefault();
        limparMensagem(mensagem);

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        if (nome.length < 3) {
            exibirMensagem(mensagem, "Informe seu nome completo.");
            return;
        }

        if (senha.length < 8) {
            exibirMensagem(mensagem, "A senha precisa ter pelo menos 8 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            exibirMensagem(mensagem, "As senhas não coincidem.");
            return;
        }

        const usuarios = obterUsuarios();
        const emailEmUso = usuarios.some(
            usuario => usuario.email.toLowerCase() === email
        );

        if (emailEmUso) {
            exibirMensagem(mensagem, "Este e-mail já possui cadastro.");
            return;
        }

        const novoUsuario = {
            id: `cliente-${Date.now()}`,
            nome,
            email,
            senha,
            tipo: "cliente",
            criadoEm: new Date().toISOString()
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);

        localStorage.setItem(CHAVE_SESSAO, JSON.stringify({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            tipo: novoUsuario.tipo
        }));

        window.location.href = "index.html";
    });
}

// O tipo de acesso é identificado pela conta, não por uma escolha no formulário.
function configurarLogin() {
    const formulario = document.getElementById("form-login");
    if (!formulario) return;

    const mensagem = document.getElementById("auth-message");

    formulario.addEventListener("submit", event => {
        event.preventDefault();
        limparMensagem(mensagem);

        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;

        const usuario = obterUsuarios().find(item =>
            item.email.toLowerCase() === email && item.senha === senha
        );

        if (!usuario) {
            exibirMensagem(mensagem, "E-mail ou senha inválidos.");
            return;
        }

        const sessao = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            barbeiroId: usuario.barbeiroId || null
        };

        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

        // Nesta primeira etapa todos retornam à página inicial.
        sessionStorage.setItem(
            "mensagem_login_gordao",
            `Olá, ${usuario.nome}! Acesso como ${usuario.tipo} realizado.`
        );

        window.location.href = "index.html";
    });
}

// Atualiza links da navegação quando o script é incluído na página.
function atualizarNavegacao() {
    const sessao = obterSessao();
    const linkCadastro = document.querySelector('[data-auth="cadastro"]');
    const linkEntrar = document.querySelector('[data-auth="entrar"]');
    const linkSair = document.querySelector('[data-auth="sair"]');
    const linkPerfil = document.querySelector('[data-auth="perfil"]');

    if (sessao) {
        if (linkCadastro) linkCadastro.hidden = true;
        if (linkEntrar) linkEntrar.hidden = true;

        if (linkPerfil) {
            linkPerfil.textContent = `OLÁ, ${sessao.nome.split(" ")[0].toUpperCase()}`;
            linkPerfil.href = "#";
        }

        if (linkSair) {
            linkSair.hidden = false;
            linkSair.addEventListener("click", event => {
                event.preventDefault();
                encerrarSessao();
            });
        }
    } else {
        if (linkCadastro) linkCadastro.hidden = false;
        if (linkEntrar) linkEntrar.hidden = false;
        if (linkSair) linkSair.hidden = true;

        if (linkPerfil) {
            linkPerfil.textContent = "ENTRAR";
            linkPerfil.href = "login.html";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    prepararContasDeTeste();
    configurarCadastro();
    configurarLogin();
    atualizarNavegacao();

    const aviso = sessionStorage.getItem("mensagem_login_gordao");
    if (aviso && window.location.pathname.endsWith("index.html")) {
        alert(aviso);
        sessionStorage.removeItem("mensagem_login_gordao");
    }
});
