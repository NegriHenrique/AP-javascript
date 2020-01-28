let quantidadeEstados = "1";
let estadoInicial = "-1";
let alfabeto = [];
let automato = [];
let pilha = {
  valor: 'B',
  proximo: null
};

const SIMBOLO_VAZIO = 'λ';

function atribuiOptions(id, quantidade, label, multiple = false) {
  let message =
    `<label for='${id}'>${label}</label>` +
    `<select id='${id}' name='${id}' class='selectpicker' ${
    multiple ? "multiple" : ""
    }>`;
  if (!multiple) message += "<option value='-1'>Escolha um estado</option>";
  for (let i = 0; i < quantidade; i++) {
    message += `<option value='${i}'>q${i}</option>`;
  }
  message += "</select>";
  return message;
}

function atribuiOptionsValores(id, valores, label, multiple = false) {
  let message =
    `<label for='${id}'>${label}</label>` +
    `<select id='${id}' name='${id}' class='selectpicker' ${
    multiple ? "multiple" : ""
    }>`;
  if (!multiple) message += "<option value='-1'>Escolha um estado</option>";
  for (let i = 0; i < valores.length; i++) {
    message += `<option value='${valores[i]}'>${valores[i]}</option>`;
  }
  message += "</select>";
  return message;
}

function adicionarTransacao() {
  const inicio = $("#inicio").val();
  const valores = $("#valor").val();

  for (let i = 0; i < valores.length; i++) {
    const transicao = {
      destino: $("#destino").val(),
      valor: valores[i],
      adicionadoPilha: $('#inserir-pilha').val().length > 0
        ? $('#inserir-pilha').val().split("").map(item => item.toUpperCase())
        : [],
      removerPilha: $('#remover-pilha').val().length > 0
        ? $('#remover-pilha').val().toUpperCase()
        : null
    };

    if (automato[inicio].find(a =>
      (a.valor === transicao.valor) &&
      (a.removerPilha === transicao.removerPilha)
    )) {
      return;
    } else {
      automato[inicio] = [...automato[inicio], transicao];
      const message = `<p class='mb-1'>(q${inicio}, ${transicao.removerPilha
        ? transicao.removerPilha : SIMBOLO_VAZIO}, ${transicao.valor}) -> (q${
        transicao.destino}, ${transicao.adicionadoPilha.length > 0
          ? transicao.adicionadoPilha.join('')
          : SIMBOLO_VAZIO
        }) <span class='bg-danger bg-red float-right font-weight-bold rounded text-center text-white' style='width: 19px; cursor: pointer' onClick="excluiTransicao(${automato[
          inicio
        ].length - 1}, ${inicio})"> X </span> </p>`;
      $("#transicoes-texto").append(message);
    }
  }
  $("#inicio")
    .val("-1")
    .change();
  $("#valor")
    .val([])
    .change();
  $("#destino")
    .val("-1")
    .change();
  $("#inserir-pilha").val('')
  $("#remover-pilha").val('')
}

function excluiTransicao(index, inicio) {
  const func = [...automato[inicio]];
  func.splice(index, 1);
  automato[inicio] = [...func];
  message = "";
  for (index in automato) {
    const funcs = automato[index];
    for (i in funcs) {
      const transicao = funcs[i];
      message += `<p class='mb-1'>(q${index}, ${transicao.removerPilha
        ? transicao.removerPilha : SIMBOLO_VAZIO}, ${transicao.valor}) -> (q${
        transicao.destino}, ${transicao.adicionadoPilha.length > 0
          ? transicao.adicionadoPilha.join('')
          : SIMBOLO_VAZIO
        }) <span class='bg-danger bg-red float-right font-weight-bold rounded text-center text-white' style='width: 19px; cursor: pointer' onClick="excluiTransicao(${i}, ${index})"> X </span> </p>`;
    }
  }
  $("#transicoes-texto").html(message);
}

function finalizar() {
  let mensagemErro = "";
  if ($("#transicoes-texto").html() === "")
    mensagemErro = "O autômato precisa ter pelo menos uma transição.";

  $("#erro").html(mensagemErro);

  if (mensagemErro !== "") return;

  let message =
    "<h4>Palavras</h4>" +
    "<div class='row'>" +
    "<div class='col-12 col-md-6 d-inline-flex flex-column'>" +
    "<label for='palavra'> Palavra </label>" +
    "<input id='palavra' type='text'/>" +
    "</div>" +
    "<div class='align-items-center col-12 d-flex d-inline-flex flex-column justify-content-end'>" +
    "<span id='resultado-palavra'> </span>" +
    "</div>" +
    "</div>";

  $("#main-content").html(message);

  listenerPalavraInput();
}

function handleNext() {
  let mensagemErro = "";
  if (estadoInicial === "-1") mensagemErro += "Estado inicial inválido.";
  if (alfabeto.length === 0) mensagemErro += " Alfabeto inválido";
  if (parseInt(quantidadeEstados) < 1)
    mensagemErro += " Quantidade de estados inválido.";

  $("#erro").html(mensagemErro);

  if (mensagemErro !== "") {
    return;
  }

  message = "<h4>Transições</h4>" + "<div class='row'>";

  message +=
    "<div class='col-12 d-flex justify-content-center align-items-center flex-column'>";
  message += atribuiOptions("inicio", quantidadeEstados, "Início");
  message += "</div>";

  message +=
    "<div class='mt-4 col-12 d-flex justify-content-center align-items-center flex-column'>";
  message += "<label for='remover-pilha'> Remover da pilha </label>"
  message += "<input id='remover-pilha' class='text-uppercase' maxlength='1' style='width: 200px' type='text'/>";
  message += "</div>";

  message +=
    "<div class='mt-4 col-12 d-flex justify-content-center align-items-center flex-column'>";
  message += atribuiOptionsValores("valor", alfabeto, "Valor", true);
  message += "</div>";

  message +=
    "<div class='mt-4 col-12 d-flex justify-content-center align-items-center flex-column'>";
  message += atribuiOptions("destino", quantidadeEstados, "Destino");
  message += "</div>";

  message +=
    "<div class='mt-4 col-12 d-flex justify-content-center align-items-center flex-column'>";
  message += "<label for='inserir-pilha'> Adicionar à pilha </label>"
  message += "<input id='inserir-pilha' maxlength='2' class='text-uppercase' style='width: 200px' type='text'/>";
  message += "</div>";

  message +=
    "<div class='mt-5 d-flex col-12 justify-content-end'>" +
    "<button class='btn btn-success mr-3' onClick='adicionarTransacao()'> Adicionar e continuar </button>" +
    "<button class='btn btn-primary' onClick='finalizar()'> Finalizar </button>" +
    "</div>";

  message += "</div>";
  automato = new Array(parseInt(quantidadeEstados)).fill([]);
  $("#main-content").html(message);

  $("#inicio").selectpicker();
  $("#valor").selectpicker();
  $("#destino").selectpicker();
}

function verificaPalavra(palavra) {
  let atualEstado = estadoInicial;
  for (let i = 0; i < palavra.length; i++) {
    const valor = palavra[i];
    const rec = automato[atualEstado].filter(a => a.valor === valor);
    if (rec.length > 0) {

      const transition = rec.find(a =>
        (a.removerPilha === pilha || (pilha && a.removerPilha === pilha.valor)));

      if (transition) {
        pilha = pilha ? pilha.proximo : null
        transition.adicionadoPilha.forEach(element => {
          pilha = {
            valor: element,
            proximo: pilha ? pilha : null
          }
        })
        atualEstado = transition.destino
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  if (!pilha) return true;

  return false;
}

$("#alfabeto").on("change", function () {
  alfabeto = $(this)
    .val()
    .split(",")
    .filter(item => item !== '');


  alfabeto = alfabeto.filter((este, i) => alfabeto.indexOf(este) === i);

  $("#alfabeto-texto").html(alfabeto.join(", "));
});

$("#qtd-estados").on("change", function () {
  quantidadeEstados = $(this).val();
  const estadoInicialSelectDiv = $("#div-estado-inicial");
  const estadoInicialSelect = atribuiOptions(
    "estado-inicial",
    quantidadeEstados,
    "Estado inicial"
  );
  estadoInicialSelectDiv.html(estadoInicialSelect);
  estadoInicial = "-1";
  $("#estado-inicial-texto").html("");

  $("#estados-finais-texto").html("");

  $("#estado-inicial").selectpicker();
  $("#estados-finais").selectpicker();

  listenerEstadoInicial();

  estadoInicial = -1;
});

function listenerPalavraInput() {
  $("#palavra").on("change", function () {
    const resultado = $("#resultado-palavra");
    if (verificaPalavra($(this).val())) {
      resultado.html("Está palavra é aceita na linguagem");
      resultado.removeClass("text-danger");
      resultado.addClass("text-success");
    } else {
      resultado.html("Está palavra NÃO é aceita na linguagem");
      resultado.removeClass("text-success");
      resultado.addClass("text-danger");
    }
  });
}

function listenerEstadoInicial() {
  $("#estado-inicial").on("change", function () {
    estadoInicial = $(this).val();
    $("#estado-inicial-texto").html(estadoInicial);
  });
}

$(document).ready(function () {
  listenerEstadoInicial();
});
