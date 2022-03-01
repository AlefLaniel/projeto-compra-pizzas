const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const fs = require('fs');

const db = mysql.createPool({
  host: "108.167.132.53",
  user: "anusca10_userdev",
  password: "s3nh@A2912345678",
  database: "anusca10_apilandingpage",
});


app.use(express.json());
app.use(cors());

/*
app.post("/cadastrar", (req, res) => {
  const { nome } = req.body;
  const { sobrenome } = req.body;
  const { email } = req.body;

  let mysql = "INSERT INTO usuario ( nome, sobrenome, email) VALUES (?, ?, ?)";
  db.query(mysql, [nome, sobrenome, email], (err, result) => {
    res.send(result);
    console.log(err);
  });
});

app.post("/pesquisar", (req, res) => {
  const { nome } = req.body;
  const { sobrenome } = req.body;
  const { email } = req.body;

  let mysql =
    "SELECT * from usuario WHERE nome = ? AND sobrenome = ? AND email = ?";
  db.query(mysql, [nome, sobrenome, email], (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.get("/listar", (req, res) => {
  let mysql = "SELECT * FROM usuario";
  db.query(mysql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/editar", (req, res) => {
  const { id } = req.body;
  const { nome } = req.body;
  const { sobrenome } = req.body;
  const { email } = req.body;
  let mysql = "UPDATE usuario SET nome = ?, sobrenome = ?, WHERE email = ?";
  db.query(mysql, [nome, sobrenome, email], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/delete/:email", (req, res) => {
  const { id } = req.params;
  let mysql = "DELETE FROM usuario WHERE email = ?";
  db.query(mysql, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

*/

app.post('/send', (req, res, next) => { 
  const detailsp = req.body.detailsp;
  const subtotal = req.body.subtotal;
  const desconto = req.body.desconto;
  const total = req.body.total;
  const nome = req.body.nome;
  const email = req.body.email;
  const telefone = req.body.telefone;
  const rua = req.body.rua;
  const numerocasa = req.body.numerocasa;
  const complemento = req.body.complemento;
  const cep = req.body.cep;

  const mensagem = `Detalhes do Pedido: \n 
  Detalhes - ${detailsp} \n Subtotal - ${subtotal} \n Desconto - ${desconto} \n Total = ${total} \n 
  Dados do Usuario: \n 
  Nome - ${nome} \n E-mail - ${email} \n Celular - ${telefone} \n 
  Endereço do Cliente: \n
  Rua - ${rua} \n Nº ${numerocasa} Complemento - ${complemento} \n CEP - ${cep} \n \n`

  const dados = [];

  if(dados.length > 0){
    dados.push({mensagem})
  }else{
    dados.push({mensagem})
  }

  fs.writeFile('./arquivos/DadosUsuários.docx', mensagem,{enconding:'utf-8',flag: 'a'}, function (err) {
    if (err) throw err;
    console.log('Arquivo salvo!');
});

  require("./nodemail")(detailsp, subtotal, desconto, total, email, nome, telefone, rua, numerocasa, complemento, cep)
      .then(response => {
        res.json(response)
        console.log("Enviado a Requisição com sucesso", response);
      })
      .catch(error => res.json(error));
})

app.listen(process.env.PORT || 3030, () => {
  console.log("rodando na porta 3030");
});
