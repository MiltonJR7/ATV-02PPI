import express from "express";

const host = "0.0.0.0";
const port = 3000;
var listaProdutos = [];

const app = express();

app.use(express.urlencoded({extended: true}));

app.get("/", (requisicao, resposta) => {
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
                                        <li><a class="dropdown-item" href="/produtos">Produtos</a></li>
                                    </ul>
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

app.get("/produtos", (requisicao, resposta) => {
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

app.post("/produtos", (requisicao, resposta) => {
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


app.get("/listaProdutos", (requisicao, resposta) => {
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


app.listen(port, host, () => {
    console.log(`Servidor em execucao em http://${host}:${port}/`);
});