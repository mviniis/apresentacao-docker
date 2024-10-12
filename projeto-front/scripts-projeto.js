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
  let url = 'http://localhost:8000';
  $.ajax({
    url: url,
    method: 'GET',
    dataType: 'json',
    success: data => {
      let container = new ContainerHTML(data.ip, data.versao);
      container.appendTo('#boxContaineres');
    }
  });
}

class ContainerHTML {
  constructor(ip, version) {
    this.ip = ip;
    this.version = version;
  }

  generateHTML() {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-auto', 'mx-2');

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('px-4', 'py-2', 'border');
    containerDiv.setAttribute('id', this.ip);

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('position-relative', 'mt-2');
    innerDiv.innerHTML = `Container <span class="ipContainer">${this.ip}</span>`;

    const versionSpan = document.createElement('span');
    versionSpan.classList.add('versaoContainer');
    versionSpan.textContent = this.version;

    containerDiv.appendChild(innerDiv);
    containerDiv.appendChild(versionSpan);
    colDiv.appendChild(containerDiv);

    return colDiv;
  }

  appendTo(targetElement) {
    const existingElement = $(document.getElementById(this.ip));
    
    if (existingElement.length > 0) {
      existingElement.find('.versaoContainer').text(this.version);
    } else {
      const htmlElement = this.generateHTML();
      $(targetElement).append(htmlElement);
    }
  }
  
}