$(() => {
  $(document).on('click', '[data-alterar-quantidade-requisicoes]', function() {
    let botaoClicado              = $(this);
    let spanQuantidadeRequisicoes = $('#quantidadeRequisicoes');
    let quantidadeRequisicoes     = parseInt(spanQuantidadeRequisicoes.html());
    
    switch(botaoClicado.attr('id')) {
      case 'aumentar':
        spanQuantidadeRequisicoes.html(quantidadeRequisicoes + 1);
      break;
      
      case 'diminuir':
        if(quantidadeRequisicoes > 1) spanQuantidadeRequisicoes.html(quantidadeRequisicoes - 1);
      break;
    }
  });

  $(document).on('click', '[data-funcao-consultas]', definirExecucao);

  executarConsultas();
});

function definirExecucao() {
  let botaoClicado = $(this);

  switch(botaoClicado.attr('id')) {
    case 'iniciarConsultas':
      $('#executarConsultasNao').removeAttr('checked');
      $('#executarConsultasSim').attr('checked', true);

      botaoClicado.addClass('d-none');
      $('#finalizarConsultas').removeClass('d-none');
    break;

    case 'finalizarConsultas':
      $('#executarConsultasSim').removeAttr('checked');
      $('#executarConsultasNao').attr('checked', true);
      
      botaoClicado.addClass('d-none');
      $('#iniciarConsultas').removeClass('d-none');
    break;
  }
}

function executarConsultas() {
  let quantidadeRequisicoes, tempoEsperaRequisicoes;

  setInterval(function() {
    quantidadeRequisicoes  = parseInt($('#quantidadeRequisicoes').html());
    tempoEsperaRequisicoes = 1000 / quantidadeRequisicoes;

    if($('[name="executarConsultas"]:checked').val() == 's') {
      for (let index = 1; index <= quantidadeRequisicoes; index++) {
        setTimeout(realizarConsulta, tempoEsperaRequisicoes * index);
      }
    }
  }, 1000);
}

function realizarConsulta() {
  let agent = gerarAgente();
  let url   = 'http://localhost:8000?agent=' + agent;

  $.ajax({
    url: url,
    method: 'GET',
    dataType: 'json',
    success: data => {
      let container = new ContainerHTML(data.ip, data.versao, agent);
      container.processarElemento();
    }
  });
}

function gerarAgente() {
  let indice      = parseInt(Math.random()*10);
  let arrayAtores = [ 47771, 12955, 11112, 47391, 92510, 95169, 99958, 48911, 30951, 30169 ];
  return arrayAtores[indice];
}

function adicionarEventoValidacaoAtividadeRequisicoes(elemento) {
  elemento = $(elemento);

  setInterval(function() {
    let boxQuantidade   = elemento.find('[data-quantidade-requisicoes]');
    let quantidadeAntes = parseInt(boxQuantidade.attr('data-quantidade-requisicoes'));
    let quantidadeAtual = parseInt(boxQuantidade.text());

    if(quantidadeAtual > quantidadeAntes) {
      $(elemento.find('[data-quantidade-requisicoes]')).attr('data-quantidade-requisicoes', quantidadeAtual);
      elemento.find('.rounded-circle').removeClass('bg-danger').addClass('bg-success');
    } else {
      elemento.find('.rounded-circle').removeClass('bg-success').addClass('bg-danger');
    }
  }, 2000);
}

class ContainerHTML {
  constructor(ip, version, agent) {
    this.ip           = ip;
    this.agent        = agent;
    this.version      = version;
    this.existeBoxPai = document.getElementById(this.version) !== null;
  }

  guardarBoxPai() {
    this.boxPai = this.existeBoxPai ? $(document.getElementById(this.ip)): null;
  }

  criarBoxBadge() {
    let boxPai   = document.createElement('span');
    let boxFilha = document.createElement('span');

    //CLASSES DO ELEMENTO FILHO
    boxFilha.classList.add('visually-hidden');
    boxPai.classList.add(
      'position-absolute', 'top-0', 'start-100', 
      'translate-middle', 'p-2', 'bg-success', 'rounded-circle'
    );

    boxPai.appendChild(boxFilha);
    return boxPai;
  }

  criarElementoIdentificacaoContainer() {
    let boxPai = document.createElement('div');

    boxPai.classList.add('w-100');
    boxPai.innerHTML = `Container na versão <b>${this.version}</b>`;

    return boxPai;
  }

  criarElementoQuantidadeRequisicoes() {
    let boxPai   = document.createElement('div');
    let boxBadge = document.createElement('span');

    boxPai.classList.add('w-100');
    boxBadge.classList.add('badge', 'text-bg-secondary');
    boxBadge.setAttribute('data-quantidade-requisicoes', 0);

    boxBadge.innerHTML = 1;
    boxPai.innerHTML   = 'Quantidade de requisições';
    boxPai.append(boxBadge);

    return boxPai;
  }

  gerarBoxInformacoes() {
    let boxPai = document.createElement('div');

    boxPai.classList.add('position-relative', 'mt-2');
    boxPai.append(this.criarBoxBadge());
    boxPai.append(this.criarElementoIdentificacaoContainer());
    boxPai.append(this.criarElementoQuantidadeRequisicoes());

    return boxPai;
  }

  gerarNomeElementoAtor() {
    let boxPai   = document.createElement('div');
    let boxFilha = document.createElement('div');

    boxPai.classList.add('ms-2', 'me-auto');
    boxFilha.classList.add('fw-bold');

    boxFilha.innerHTML = this.agent;
    boxPai.append(boxFilha);
    return boxPai;
  }

  gerarQuantidadeRequisicoesAtor() {
    let box = document.createElement('span');
    
    box.classList.add('badge', 'text-bg-primary', 'rounded-pill');
    box.setAttribute('data-quantidade-requisicoes-ator', '');
    box.innerHTML = 1;
    return box;
  }

  gerarElementoAtor() {
    let boxPai = document.createElement('li');

    boxPai.classList.add(
      'list-group-item', 'd-flex', 
      'justify-content-between', 'align-items-start'
    );

    boxPai.setAttribute('id', this.agent);

    boxPai.append(this.gerarNomeElementoAtor());
    boxPai.append(this.gerarQuantidadeRequisicoesAtor());
    return boxPai;
  }

  gerarListaAtores() {
    let boxPai = document.createElement('ol');

    boxPai.classList.add('list-group', 'list-group-numbered');
    boxPai.setAttribute('data-atores-requisicoes', '');
    boxPai.append(this.gerarElementoAtor());
    return boxPai;
  }

  gerarBoxAtores() {
    let boxPai    = document.createElement('div');
    let boxTitulo = document.createElement('b');

    boxTitulo.innerHTML = 'Atores das requisições:';
    
    boxPai.classList.add('mt-2');
    boxPai.append(boxTitulo);
    boxPai.append(this.gerarListaAtores());
    return boxPai;
  }

  gerarCardVersao() {
    let boxPai   = document.createElement('div');
    let boxFilha = document.createElement('div');

    boxPai.classList.add('col-auto', 'mx-2');
    boxFilha.classList.add('px-4', 'py-2', 'border');
    boxFilha.setAttribute('id', this.version);
    boxFilha.append(this.gerarBoxInformacoes());
    boxFilha.append(this.gerarBoxAtores());

    boxPai.append(boxFilha);
    return boxPai;
  }

  processarElemento() {
    if(!this.existeBoxPai) {
      $("#boxContaineres").append(this.gerarCardVersao());

      let elementoCriado = document.getElementById(this.version);
      adicionarEventoValidacaoAtividadeRequisicoes(elementoCriado);
      return;
    }

    this.atualizarQuantidadeRequisicoesVersao();

    if(this.verificarExistenciaAgente()) {
      this.atualizarQuantidadeRequisicoesAgente();
      return;
    }

    this.adicionarNovoAgente();
  }

  adicionarNovoAgente() {
    let elemento = document.getElementById(this.version);
    $(elemento).find('[data-atores-requisicoes]').append(this.gerarElementoAtor());
  }

  atualizarQuantidadeRequisicoesVersao() {
    let elementoBase    = document.getElementById(this.version);
    let elemento        = $(elementoBase).find('[data-quantidade-requisicoes]');
    let quantidadeAtual = parseInt(elemento.text());

    $(elementoBase).find('[data-quantidade-requisicoes]').text(quantidadeAtual + 1);
  }

  verificarExistenciaAgente() {
    return $(document.getElementById(this.version)).find(`#${this.agent}`).length > 0;
  }

  atualizarQuantidadeRequisicoesAgente() {
    let elemento      = $(document.getElementById(this.version)).find(`#${this.agent}`).find('[data-quantidade-requisicoes-ator]');
    let valorAnterior = elemento.text();

    $(document.getElementById(this.version)).find(`#${this.agent}`).find('[data-quantidade-requisicoes-ator]').text(parseInt(valorAnterior) + 1);
  }
}

$(document).on('click', '[data-teste-evento]', function() {
  let teste = new ContainerHTML('127.0.0.1', 'v1.0', gerarAgente());

  teste.processarElemento();
});