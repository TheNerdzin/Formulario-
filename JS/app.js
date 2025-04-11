document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formularioInscricao");
    const camposObrigatorios = [
        "usuarioID", "senha", "nome", "dataNascimento", "documentoCPF", "genero",
        "emailUsuario", "telefone", "cepUsuario", "logradouro", "numeroCasa",
        "cidade", "estado", "residencia", "identidade"
    ];

    // Sistema de exibição de erros
    const erros = {
        mostrar: (campo, mensagem) => {
            let erroSpan = campo.parentElement.querySelector(".erro");
            if (!erroSpan) {
                erroSpan = document.createElement("span");
                erroSpan.className = "erro";
                campo.parentElement.appendChild(erroSpan);
            }
            erroSpan.textContent = mensagem;
            campo.classList.add("erro-campo");
        },

        limpar: (campo) => {
            const erroSpan = campo.parentElement.querySelector(".erro");
            if (erroSpan) erroSpan.remove();
            campo.classList.remove("erro-campo");
        },

        limparTodos: () => {
            document.querySelectorAll(".erro").forEach(e => e.remove());
            document.querySelectorAll(".erro-campo").forEach(e => e.classList.remove("erro-campo"));
        }
    };

    // Validadores robustos
    const validadores = {
        campoObrigatorio: (valor) => {
            if (typeof valor === "string") return valor.trim() !== "";
            if (valor instanceof File) return valor.name !== "";
            return !!valor;
        },

        email: (email) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(String(email).toLowerCase());
        },

        cpf: (cpf) => {
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

            // Validação dos dígitos verificadores
            let soma = 0;
            for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
            let resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf[9])) return false;

            soma = 0;
            for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            return resto === parseInt(cpf[10]);
        },

        telefone: (tel) => {
            const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
            return regex.test(tel);
        },

        cep: (cep) => /^\d{5}-?\d{3}$/.test(cep),

        uf: (estado) => {
            const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
                "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
                "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
            return ufs.includes(estado.toUpperCase());
        },

        arquivo: (file) => {
            if (!file) return false;
            const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];
            const maxTamanho = 2 * 1024 * 1024; // 2MB
            return tiposPermitidos.includes(file.type) && file.size <= maxTamanho;
        },

        idadeMinima: (dataNascimento) => {
            const dataNasc = new Date(dataNascimento);
            if (isNaN(dataNasc.getTime())) return false;

            const hoje = new Date();
            let idade = hoje.getFullYear() - dataNasc.getFullYear();
            const mes = hoje.getMonth() - dataNasc.getMonth();
            const dia = hoje.getDate() - dataNasc.getDate();

            if (mes < 0 || (mes === 0 && dia < 0)) {
                idade--;
            }
            return idade >= 12;
        }
    };

    // Validação em tempo real
    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("blur", () => {
                const valor = campo.type === "file" ? campo.files[0] : campo.value.trim();

                if (!validadores.campoObrigatorio(valor)) {
                    erros.mostrar(campo, "Este campo é obrigatório.");
                } else {
                    erros.limpar(campo);
                }
            });
        }
    });

    // Validações específicas
    document.getElementById("emailUsuario")?.addEventListener("blur", function () {
        if (this.value && !validadores.email(this.value)) {
            erros.mostrar(this, "Por favor, insira um email válido.");
        }
    });

    document.getElementById("documentoCPF")?.addEventListener("blur", function () {
        if (this.value && !validadores.cpf(this.value)) {
            erros.mostrar(this, "CPF inválido. Verifique o número digitado.");
        }
    });

    document.getElementById("telefone")?.addEventListener("blur", function () {
        if (this.value && !validadores.telefone(this.value)) {
            erros.mostrar(this, "Telefone inválido. Use o formato (00) 00000-0000");
        }
    });

    document.getElementById("cepUsuario")?.addEventListener("blur", function () {
        if (this.value && !validadores.cep(this.value)) {
            erros.mostrar(this, "CEP inválido. Use o formato 00000-000");
        }
    });

    document.getElementById("estado")?.addEventListener("blur", function () {
        if (this.value && !validadores.uf(this.value)) {
            erros.mostrar(this, "UF inválido. Use a sigla do estado (ex: SP)");
        }
    });

    // Validação de data de nascimento
    document.getElementById("dataNascimento")?.addEventListener("change", function () {
        if (this.value) {
            if (!validadores.idadeMinima(this.value)) {
                erros.mostrar(this, "Você deve ter pelo menos 12 anos para se cadastrar.");
            } else {
                erros.limpar(this);
            }
        }
    });

    // Validação de arquivos
    document.getElementById("identidade")?.addEventListener("change", function () {
        if (this.files.length > 0 && !validadores.arquivo(this.files[0])) {
            erros.mostrar(this, "Documento inválido. Envie PDF/JPG/PNG até 2MB.");
        }
    });

    document.getElementById("residencia")?.addEventListener("change", function () {
        if (this.files.length > 0 && !validadores.arquivo(this.files[0])) {
            erros.mostrar(this, "Comprovante inválido. Envie PDF/JPG/PNG até 2MB.");
        }
    });

    // Seleção de trilhas
    document.querySelectorAll(".opcao-trilha input[type='radio']").forEach(radio => {
        radio.addEventListener("change", function () {
            document.querySelectorAll(".opcao-trilha").forEach(opcao => {
                opcao.classList.remove("selected");
            });
            if (this.checked) {
                this.closest(".opcao-trilha").classList.add("selected");
            }
        });
    });

    // Submit do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        erros.limparTodos();

        let valido = true;
        const dados = {};

        // Validação dos campos obrigatórios
        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            const valor = campo.type === "file" ? campo.files[0] : campo.value.trim();

            if (!validadores.campoObrigatorio(valor)) {
                erros.mostrar(campo, "Este campo é obrigatório.");
                valido = false;
            } else {
                dados[id] = campo.type === "file" ? campo.files[0].name : valor;
            }
        });

        // Validações específicas
        const validacoesEspecificas = [
            { campo: "emailUsuario", validador: validadores.email, mensagem: "Email inválido." },
            { campo: "documentoCPF", validador: validadores.cpf, mensagem: "CPF inválido." },
            { campo: "telefone", validador: validadores.telefone, mensagem: "Telefone inválido." },
            { campo: "cepUsuario", validador: validadores.cep, mensagem: "CEP inválido." },
            { campo: "estado", validador: validadores.uf, mensagem: "Estado (UF) inválido." },
            { campo: "identidade", validador: validadores.arquivo, mensagem: "Documento inválido." },
            { campo: "residencia", validador: validadores.arquivo, mensagem: "Comprovante inválido." },
            { campo: "dataNascimento", validador: validadores.idadeMinima, mensagem: "Você deve ter pelo menos 12 anos." }
        ];

        validacoesEspecificas.forEach(({ campo, validador, mensagem }) => {
            const elemento = document.getElementById(campo);
            const valor = elemento.type === "file" ? elemento.files[0] : elemento.value;

            if (valor && !validador(valor)) {
                erros.mostrar(elemento, mensagem);
                valido = false;
            }
        });

        // Verificar trilha selecionada
        const trilhaSelecionada = document.querySelector('input[name="trilha"]:checked');
        if (!trilhaSelecionada) {
            const primeiroRadio = document.querySelector('input[name="trilha"]');
            erros.mostrar(primeiroRadio, "Por favor, selecione uma trilha.");
            valido = false;
        }

        // Verificar termos aceitos
        const termos = document.getElementById("termos");
        if (!termos.checked) {
            erros.mostrar(termos, "Você deve aceitar os termos e condições.");
            valido = false;
        }

        if (valido) {
            try {
                form.classList.add("enviando");
                const botao = form.querySelector("button[type='submit']");
                botao.disabled = true;
                botao.innerHTML = "Enviando...";

                // Simular envio
                await new Promise(resolve => setTimeout(resolve, 1500));

                localStorage.setItem("inscricao", JSON.stringify(dados));
                alert("Inscrição realizada com sucesso!");
                form.reset();
                window.location.href = "/login.html";
            } catch (error) {
                console.error("Erro:", error);
                alert("Ocorreu um erro. Tente novamente.");
            } finally {
                form.classList.remove("enviando");
                const botao = form.querySelector("button[type='submit']");
                botao.disabled = false;
                botao.textContent = "Fazer inscrição";
            }
        } else {
            const primeiroErro = document.querySelector(".erro");
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });

    // Função para pré-visualização de arquivos
    window.previewArquivo = function (input, destinoImgId) {
        const file = input.files[0];
        const imgPreview = document.getElementById(destinoImgId);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                imgPreview.src = reader.result;
                imgPreview.classList.add("preview");
            };
            reader.readAsDataURL(file);
        }
    };
});