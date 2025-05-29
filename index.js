import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";

const host = "0.0.0.0";
const port = 3000;

var listaUsuarios = [];
var listaProdutos = [];

const app = express();

app.use(express.urlencoded({extended: true}));

// Preparando a aplicacao para fazer o uso de sessao
// Adicionado a aplicacao o middleware session

app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: false,
    cookie: { // Definir o tempo de vida util de uma sessao
        maxAge: 1000 * 60 * 15, // Depois de 15 minutos de inatividade do usuario que criou essa sessao sera excluida  
        httpOnly: true,
        secure: false // true se for https
    }
}));

app.use(cookieParser());

app.get("/", verificarAutenticacao, (requisicao, resposta) => {
    resposta.send(`
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">Menu Inicial</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <ul class="navbar-nav">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="/" id="cadastrosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Cadastrar Produtos
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="cadastrosDropdown">
                                    <li><a class="dropdown-item" href="/cadastroFornecedor">Cadastro de Fornecedor</a></li> 
                                    <li><hr class="dropdown-divider"></li>   
                                    <li><a class="dropdown-item" href="/produtos">Produtos</a></li>
                                    </ul>
                                </li>
                            </ul>
                              <ul class="navbar-nav ms-auto">
                                <li class="nav-item">
                                <a class="nav-link" href="/login">Login</a>
                                </li>
                                <li class="nav-item">
                                <a class="nav-link" href="/logout">Sair</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `)
    resposta.end();
});


app.get("/cadastroFornecedor", verificarAutenticacao, (requisisao, resposta) => {
    resposta.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Cadastro de Fornecedor</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>
                body {
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                }
                .form-container {
                width: 100%;
                max-width: 550px;
                }
            </style>
            </head>
            <body>

            <div class="form-container">
                <div class="card shadow rounded-4">
                <div class="card-body p-4">
                    <h4 class="text-center mb-4">Cadastro de Fornecedor</h4>
                    <form method="POST" action="/cadastroFornecedor" id="fornecedorForm" novalidate>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="cnpj" name="cnpj" placeholder="CNPJ (somente números)"/>
                        <div class="invalid-feedback">Informe um CNPJ válido com 14 dígitos.</div>
                    </div>

                    <div class="mb-3">
                        <input type="text" class="form-control" id="razaoSocial" name="razaoSocial" placeholder="Razão Social ou Nome do Fornecedor"/>
                        <div class="invalid-feedback">Informe a razão social ou nome do fornecedor.</div>
                    </div>

                    <div class="mb-3">
                        <input type="text" class="form-control" id="nomeFantasia" name="nomeFantasia" placeholder="Nome Fantasia"/>
                        <div class="invalid-feedback">Informe o nome fantasia.</div>
                    </div>

                    <div class="mb-3">
                        <input type="text" class="form-control" id="endereco" name="endereco" placeholder="Endereço"/>
                        <div class="invalid-feedback">Informe o endereço.</div>
                    </div>

                    <div class="mb-3">
                        <input type="text" class="form-control" id="cidade" name="cidade" placeholder="Cidade"/>
                        <div class="invalid-feedback">Informe a cidade.</div>
                    </div>

                    <div class="mb-3">
                        <select class="form-select" id="uf" name="uf">
                            <option value="">UF...</option>
                            <option>AC</option><option>AL</option><option>AP</option><option>AM</option><option>BA</option><option>CE</option>
                            <option>DF</option><option>ES</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option>
                            <option>MG</option><option>PA</option><option>PB</option><option>PR</option><option>PE</option><option>PI</option>
                            <option>RJ</option><option>RN</option><option>RS</option><option>RO</option><option>RR</option><option>SC</option>
                            <option>SP</option><option>SE</option><option>TO</option>
                        </select>
                        <div class="invalid-feedback">Informe a UF.</div>
                    </div>

                    <div class="mb-3">
                        <input type="text" class="form-control" id="cep" name="cep" placeholder="CEP (somente números)"/>
                        <div class="invalid-feedback">Informe um CEP válido com 8 dígitos.</div>
                    </div>

                    <div class="mb-3">
                        <input type="email" class="form-control" id="email" name="email" placeholder="E-mail"/>
                        <div class="invalid-feedback">Informe um e-mail válido.</div>
                    </div>

                    <div class="mb-3">
                        <input type="tel" class="form-control" id="telefone" name="telefone" placeholder="Telefone (somente números)""/>
                        <div class="invalid-feedback">Informe um telefone válido (10 a 11 dígitos).</div>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                        <a class="btn btn-secondary" href="/" style="margin-top: 5px">Voltar</a>
                    </div>

                </form>

                </div>
                </div>
            </div>
            </body>
            </html>
    `)
})

app.get("/produtos", verificarAutenticacao, (requisicao, resposta) => {
    resposta.send(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Cadastro de Produto</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                </head>
                <body>

                <div class="container mt-5">
                    <div class="card shadow p-4">
                        <form method="POST" action="/produtos">
                            <fieldset>
                                <legend class="text-center">Cadastro de Produto</legend>
                            </fieldset>
                            <div class="mb-3">
                                <label for="nome" class="form-label">Nome do Produto:</label>
                                <input type="text" class="form-control" id="nome" name="nome">
                            </div>

                            <div class="mb-3">
                                <label for="categoria" class="form-label">Categoria:</label>
                                <select class="form-select" id="categoria" name="categoria">
                                    <option value="">Selecione</option>
                                    <option value="eletronico">Eletrônico</option>
                                    <option value="vestuario">Vestuário</option>
                                    <option value="alimento">Alimento</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="preco" class="form-label">Preço:</label>
                                <input type="number" class="form-control" id="preco" name="preco" step="0.01">
                            </div>

                            <div class="mb-3">
                                <label for="descricao" class="form-label">Descrição:</label>
                                <textarea class="form-control" id="descricao" name="descricao" rows="4"></textarea>
                            </div>

                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary" type="submit">Cadastrar Produto</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                        </form>
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                </body>
                </html>
            `);
    resposta.end();
});


app.post("/cadastroFornecedor", verificarAutenticacao, (requisisao, resposta) => {
    const cnpj = requisisao.body.cnpj;
    const razaoSocial = requisisao.body.razaoSocial;
    const nomeFantasia = requisisao.body.nomeFantasia;
    const endereco = requisisao.body.endereco;
    const cidade = requisisao.body.cidade;
    const uf = requisisao.body.uf;
    const cep = requisisao.body.cep;
    const email = requisisao.body.email;
    const telefone = requisisao.body.telefone;

    if (cnpj && razaoSocial && nomeFantasia && endereco && cidade && uf && cep && email && telefone) {
        listaUsuarios.push({
            cnpj: cnpj,
            razaoSocial: razaoSocial,
            nomeFantasia: nomeFantasia,
            endereco: endereco,
            cidade: cidade,
            uf: uf,
            cep: cep,
            email: email,
            telefone: telefone
        });
        resposta.redirect("/listaUsuarios");
    } else {
        let conteudo = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Cadastro de Fornecedor</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                <style>
                    body {
                        background: #f8f9fa;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }
                    .form-container {
                        width: 100%;
                        max-width: 550px;
                    }
                </style>
            </head>
            <body>
            <div class="form-container">
                <div class="card shadow rounded-4">
                    <div class="card-body p-4">
                        <h4 class="text-center mb-4">Cadastro de Fornecedor</h4>
                        <form method="POST" action="/cadastroFornecedor">
        `;

        conteudo += `
            <div class="mb-3">
                <input type="text" class="form-control" name="cnpj" placeholder="CNPJ (somente números)" value="${cnpj || ''}"/>
                ${!cnpj ? `<span class="text-danger">Por favor informe o CNPJ</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="razaoSocial" placeholder="Razão Social" value="${razaoSocial || ''}"/>
                ${!razaoSocial ? `<span class="text-danger">Informe a razão social</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="nomeFantasia" placeholder="Nome Fantasia" value="${nomeFantasia || ''}"/>
                ${!nomeFantasia ? `<span class="text-danger">Informe o nome fantasia</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="endereco" placeholder="Endereço" value="${endereco || ''}"/>
                ${!endereco ? `<span class="text-danger">Informe o endereço</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="cidade" placeholder="Cidade" value="${cidade || ''}"/>
                ${!cidade ? `<span class="text-danger">Informe a cidade</span>` : ''}
            </div>
            <div class="mb-3">
                <select class="form-select" name="uf">
                    <option value="">UF...</option>
                    ${["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
                        .map(sigla => `<option value="${sigla}" ${uf === sigla ? 'selected' : ''}>${sigla}</option>`).join("")}
                </select>
                ${!uf ? `<span class="text-danger">Informe a UF</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="cep" placeholder="CEP" value="${cep || ''}"/>
                ${!cep ? `<span class="text-danger">Informe o CEP</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="email" class="form-control" name="email" placeholder="E-mail" value="${email || ''}"/>
                ${!email ? `<span class="text-danger">Informe o e-mail</span>` : ''}
            </div>
            <div class="mb-3">
                <input type="tel" class="form-control" name="telefone" placeholder="Telefone" value="${telefone || ''}"/>
                ${!telefone ? `<span class="text-danger">Informe o telefone</span>` : ''}
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Cadastrar</button>
                <a class="btn btn-secondary" href="/" style="margin-top: 5px">Voltar</a>
            </div>
        `;

        conteudo += `
                        </form>
                    </div>
                </div>
            </div>
            </body>
            </html>
        `;
        resposta.send(conteudo);
    }
});


app.post("/produtos", verificarAutenticacao, (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const categoria = requisicao.body.categoria;
    const preco = requisicao.body.preco;
    const descricao = requisicao.body.descricao;

    const precoFloat = parseFloat(preco);

    let erros = {
        nome: !nome ? "O nome é obrigatório." : "",
        categoria: !categoria ? "A categoria é obrigatória." : "",
        preco: !preco ? "O preço é obrigatório." :
               isNaN(precoFloat) ? "O preço deve ser um número válido." :
               precoFloat < 0.01 ? "O preço deve ser no mínimo R$ 0,01." :
               precoFloat > 100000 ? "O preço não pode ser maior que R$ 100.000,00." : "",
        descricao: !descricao ? "A descrição é obrigatória." : ""
    };

    const temErros = Object.values(erros).some(msg => msg !== "");

    if (!temErros) {
        listaProdutos.push({
            nome: nome,
            categoria: categoria,
            preco: preco,
            descricao: descricao
        });
        resposta.redirect("/listaProdutos");
    } else {
        let conteudo = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Cadastro de Produto</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        </head>
        <body>
        <div class="container mt-5">
            <div class="card shadow p-4">
                <form method="POST" action="/produtos">
                    <fieldset>
                        <legend class="text-center">Cadastro de Produto</legend>
                    </fieldset>

                    <div class="mb-3">
                        <label for="nome" class="form-label">Nome do Produto:</label>
                        <input type="text" class="form-control" id="nome" name="nome" value="${nome || ""}">
                        ${erros.nome ? `<span class="text-danger">${erros.nome}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <label for="categoria" class="form-label">Categoria:</label>
                        <select class="form-select" id="categoria" name="categoria">
                            <option value="">Selecione</option>
                            <option value="eletronico" ${categoria === "eletronico" ? "selected" : ""}>Eletrônico</option>
                            <option value="vestuario" ${categoria === "vestuario" ? "selected" : ""}>Vestuário</option>
                            <option value="alimento" ${categoria === "alimento" ? "selected" : ""}>Alimento</option>
                        </select>
                        ${erros.categoria ? `<span class="text-danger">${erros.categoria}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <label for="preco" class="form-label">Preço:</label>
                        <input type="number" class="form-control" id="preco" name="preco" step="0.01" value="${preco || ""}">
                        ${erros.preco ? `<span class="text-danger">${erros.preco}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição:</label>
                        <textarea class="form-control" id="descricao" name="descricao" rows="4">${descricao || ""}</textarea>
                        ${erros.descricao ? `<span class="text-danger">${erros.descricao}</span>` : ""}
                    </div>

                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary" type="submit">Cadastrar Produto</button>
                        <a class="btn btn-secondary" href="/">Voltar</a>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        `;
        resposta.send(conteudo);
    }
});

app.get("/listaUsuarios", verificarAutenticacao, (requisicao, resposta) => {
    let conteudo=`
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Formulário</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                </head>
                <body>
                    <div class="container w-90 mb-5 mt-5">
                        <table class="table table-dark table-striped-columns">
                            <thead>
                                <tr>
                                    <th scope="col">CNPJ</th>
                                    <th scope="col">Razao Social</th>
                                    <th scope="col">Nome Fantasia</th>
                                    <th scope="col">Endereco</th>
                                    <th scope="col">Cidade</th>
                                    <th scope="col">UF</th>
                                    <th scope="col">CEP</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Telefone</th>
                                </tr>
                            </thead>
                            <tbody> `;
                            for(let i = 0; i < listaUsuarios.length; i++) {
                                conteudo = conteudo + `
                                        <tr>
                                            <td>${listaUsuarios[i].cnpj}</td>
                                            <td>${listaUsuarios[i].razaoSocial}</td>
                                            <td>${listaUsuarios[i].nomeFantasia}</td>
                                            <td>${listaUsuarios[i].endereco}</td>
                                            <td>${listaUsuarios[i].cidade}</td>
                                            <td>${listaUsuarios[i].uf}</td>
                                            <td>${listaUsuarios[i].cep}</td>
                                            <td>${listaUsuarios[i].email}</td>
                                            <td>${listaUsuarios[i].telefone}</td>
                                        </tr> ` 
                                    }

    conteudo = conteudo + ` </tbody>
                        </table>
                        <a class="btn btn-secondary" href="/cadastroFornecedor">Retornar ao cadastro</a>
                     </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </html>`
    resposta.send(conteudo);
    resposta.end();
})

app.get("/listaProdutos", verificarAutenticacao, (requisicao, resposta) => {
    let conteudo=`
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Formulário</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                </head>
                <body>
                    <div class="container w-75 mb-5 mt-5">
                        <table class="table table-dark table-striped-columns">
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Categoria</th>
                                    <th scope="col">preco</th>
                                    <th scope="col">descricao</th>
                                </tr>
                            </thead>
                            <tbody> `;
                            for(let i = 0; i < listaProdutos.length; i++) {
                                conteudo = conteudo + `
                                        <tr>
                                            <td>${listaProdutos[i].nome}</td>
                                            <td>${listaProdutos[i].categoria}</td>
                                            <td>${listaProdutos[i].preco}</td>
                                            <td>${listaProdutos[i].descricao}</td>
                                        </tr> ` 
                                    }

    conteudo = conteudo + ` </tbody>
                        </table>
                        <a class="btn btn-secondary" href="/produtos">Retornar ao cadastro</a>
                     </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </html>`
    resposta.send(conteudo);
    resposta.end();
})

app.get("/login", (requisicao, resposta) => {
    resposta.send(`
                <!DOCTYPE html>
                    <html lang="pt-br">
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Login</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                    <style>
                        body {
                        background-color: #f8f9fa;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        }
                        .card {
                        border-radius: 1rem;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                    </style>
                    </head>
                    <body>
                    <div class="card p-4" style="width: 100%; max-width: 360px;">
                        <h2 class="text-center mb-4">Login</h2>
                        <form action="/login" method="POST">
                        <div class="mb-3">
                            <label for="Usuario" class="form-label">Usuario</label>
                            <input type="Usuario" class="form-control" id="usuario" name="usuario"/>
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="senha" name="senha"/>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Entrar</button>
                        </form>
                        <div class="text-center mt-3">
                        <a href="#">Esqueceu a senha?</a>
                        </div>
                    </div>

                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                </html>
        `);
})

app.post("/login", (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;    
    const senha = requisicao.body.senha;

    if(usuario == "admin" && senha == "admin") {
        requisicao.session.logado = true;
        const dataHorasAtuais = new Date();
        requisicao.cookies.ultimoLogin = dataHorasAtuais.toLocaleString(), {}
        resposta.redirect("/");
    } else {
        resposta.send(`
            <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                <style>
                    body {
                    background-color: #f8f9fa;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }
                    .card {
                    border-radius: 1rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                </style>
                </head>
                <body>
                <div class="card p-4" style="width: 100%; max-width: 360px;">
                    <h2 class="text-center mb-4">Login</h2>
                    <form action="/login" method="POST">
                    <div class="mb-3">
                        <label for="Usuario" class="form-label">Usuario</label>
                        <input type="Usuario" class="form-control" id="usuario" name="usuario"/>
                    </div>
                    <div class="mb-3">
                        <label for="senha" class="form-label">Senha</label>
                        <input type="password" class="form-control" id="senha" name="senha"/>
                    </div>
                    <span style="color: red">Usuario e senha invalidos<span>
                    <button type="submit" class="btn btn-primary w-100">Entrar</button>
                    </form>
                    <div class="text-center mt-3">
                    <a href="#">Esqueceu a senha?</a>
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
                </body>
            </html>
        `);
    }

    //Realizar Validacao
})

function verificarAutenticacao(requisicao, resposta, next) {
    if(requisicao.session.logado) {
        next();
    } else {
        resposta.redirect("/login");
    }
}

app.get("/logout", verificarAutenticacao, (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
})


app.listen(port, host, () => {
    console.log(`Servidor em execucao em http://${host}:${port}/`);
});