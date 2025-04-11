document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();

    const loginId = document.getElementById("loginId").value.trim();
    const loginSenha = document.getElementById("loginSenha").value;
    const erroLogin = document.getElementById("erroLogin");
    const dadosSalvos = JSON.parse(localStorage.getItem("inscricao"));

    // Reset erro
    erroLogin.textContent = "";

    if (!loginId || !loginSenha) {
        erroLogin.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    if (dadosSalvos && dadosSalvos.usuarioID === loginId && dadosSalvos.senha === loginSenha) {
        alert("Login realizado com sucesso!");
        window.location.href = "/painel.html";
    } else {
        erroLogin.textContent = "ID ou senha inválidos. Verifique e tente novamente.";
    }
});
