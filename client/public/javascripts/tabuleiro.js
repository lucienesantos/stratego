var Tabuleiro = {
    isCombate: false
}
    
Tabuleiro.criaLinha = function(id){
    var linha = $("<div/>").attr("id", "linha_"+id).addClass("linha");
    return linha;
};

Tabuleiro.criaPosicao = function(linha, coluna){
    var posicao = "posicao_" + linha + "_" + coluna; 
    var elemento = $("<div/>").attr("id", posicao)
                              .addClass("ui-widget-header posicao");
    elemento.attr("data-row", linha);
    elemento.attr("data-column", coluna);
    Tabuleiro.criaLago(linha, coluna, elemento);
    return elemento;
};

Tabuleiro.criaLago = function(linha, coluna, elemento){
    if(linha == 5 && coluna == 3){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 5 && coluna == 4){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 6 && coluna == 3){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 6 && coluna == 4){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 5 && coluna == 7){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 5 && coluna == 8){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 6 && coluna == 7){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
     if(linha == 6 && coluna == 8){
        elemento.addClass("lago");
        elemento.removeClass("ui-widget-header");
    }
};

Tabuleiro.montarTabuleiro = function(){
    var i; 
    var tabuleiro = $("#tabuleiro");
    for (i=1; i<11; i++){
        var linha = Tabuleiro.criaLinha(i);
        for (j=1; j<11; j++){ 
            linha.append(Tabuleiro.criaPosicao(i,j)); 
        };
        tabuleiro.append(linha);
    }
};

Tabuleiro.mostraOpcoes = function() {
    $(".posicao").removeClass("opcaoDeMovimento");
    for (var i = 0; i < Tabuleiro.pecaClicada.opcoesDeMovimento.length; i++) {
        var opcao = Tabuleiro.pecaClicada.opcoesDeMovimento[i];
        var posicao = Tabuleiro.posicaoPorCoordenadas(opcao.linha, opcao.coluna);
        posicao.addClass("opcaoDeMovimento");
    };
};

Tabuleiro.posicaoPorCoordenadas = function(linha, coluna){
    return $("#posicao_" + linha + "_" + coluna);
};

Tabuleiro.pecaPorId = function(id){
    return $("#" + id);
}

Tabuleiro.naoELago = function(posicaoCalculada) {
    var posicao = Tabuleiro.posicaoPorCoordenadas(posicaoCalculada.linha, posicaoCalculada.coluna);
    return !posicao.hasClass("lago");
};

Tabuleiro.pecaQueEstaNaPosicao = function(posicao){
    var posicao = Tabuleiro.posicaoPorCoordenadas(posicao.linha, posicao.coluna);
    return $(posicao).children();
}

Tabuleiro.posicaoEstaOcupada = function(posicao){
    var posicao = Tabuleiro.posicaoPorCoordenadas(posicao.linha, posicao.coluna);
    return ($(posicao).children().length != 0);
}

Tabuleiro.posicaoOcupadaPeloAdversario = function(posicao){
    var peca = Tabuleiro.pecaQueEstaNaPosicao(posicao);
    if(peca != undefined){
        console.info(($(peca).attr("data-patente")));        
        if(($(peca).attr("data-patente") == undefined) || ($(peca).attr("data-patente") == null)){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

Tabuleiro.calculaPosicoesDoSoldado = function(linha, coluna){
    var linhaDaPeca = linha;
    var colunaDaPeca = coluna;

    var opcoes = [];
    var posicaoColunaEsquerda = {linha: linha, coluna: coluna - 1};
    var posicaoColunaDireita = {linha: linha, coluna: coluna + 1};
    var posicaoLinhaAcima = {linha: linha - 1, coluna: coluna};
    var posicaoLinhaAbaixo = {linha: linha + 1, coluna: coluna};

    for(var i = colunaDaPeca -1; i > 0; i--){
        var posicao = {linha: linhaDaPeca, coluna: i};
        if (Tabuleiro.naoELago(posicao)){
            if(!(Tabuleiro.posicaoEstaOcupada(posicao))){ // verifica se a posicao não está ocupada
                opcoes.push(posicao);
            }else{
                if(Tabuleiro.posicaoOcupadaPeloAdversario(posicao)){
                    if(posicaoColunaEsquerda.linha == posicao.linha && posicaoColunaEsquerda.coluna == posicao.coluna){ //verificando se é a posicão vizinha   
                        posicao.isAdversario = true;
                        opcoes.push(posicao);
                        break;
                     }   
                     else{
                        break;
                    }  
                }
                else{
                    break;
                }
            }
        }
        else{
            break;
        }          
    }
    for(var i = colunaDaPeca + 1; i < 11; i++ ){
        var posicao = {linha: linhaDaPeca, coluna: i};
        if (Tabuleiro.naoELago(posicao)){
            if(!(Tabuleiro.posicaoEstaOcupada(posicao))){ // verifica se a posicao não está ocupada
                opcoes.push(posicao);
            }else{
                if(Tabuleiro.posicaoOcupadaPeloAdversario(posicao)){
                    if(posicaoColunaDireita.linha == posicao.linha && posicaoColunaDireita.coluna == posicao.coluna){ //verificando se é a posicão vizinha   
                        posicao.isAdversario = true;
                        opcoes.push(posicao);
                        break;
                     }
                     else{
                        break;
                    }     
                }
                else{
                    break;
                }
            }
        }  
        else{
            break;
        }        
    }

    for(var i = linhaDaPeca-1; i > 0; i--){
        var posicao = {linha: i, coluna: colunaDaPeca};
        if (Tabuleiro.naoELago(posicao)){
            if(!(Tabuleiro.posicaoEstaOcupada(posicao))){ // verifica se a posicao não está ocupada
                opcoes.push(posicao);

            }else{
                if(Tabuleiro.posicaoOcupadaPeloAdversario(posicao)){
                    if(posicaoLinhaAcima.linha == posicao.linha && posicaoLinhaAcima.coluna == posicao.coluna){ //verificando se é a posicão vizinha   
                        posicao.isAdversario = true;
                        opcoes.push(posicao);
                        break;
                    }else{
                        break;
                    }
                }
                else{
                    break;
                }
            }
        } 
        else{
            break;
        }         
    }
    for(var i = linhaDaPeca + 1; i < 11; i++){
        var posicao = {linha: i, coluna: colunaDaPeca};
        if (Tabuleiro.naoELago(posicao)){
            if(!(Tabuleiro.posicaoEstaOcupada(posicao))){ // verifica se a posicao não está ocupada
                opcoes.push(posicao);

            }
            else{
                if(Tabuleiro.posicaoOcupadaPeloAdversario(posicao)){
                    if(posicaoLinhaAbaixo.linha == posicao.linha && posicaoLinhaAbaixo.coluna == posicao.coluna){ //verificando se é a posicão vizinha   
                        posicao.isAdversario = true;
                        opcoes.push(posicao);
                        break; 
                    }  
                    else{
                        break;
                    }  
                }
                else{
                    break;
                }
            }
        } else{
            break;
        }        
    }
    return opcoes;

}


Tabuleiro.calculaOpcoesDeMovimento = function(linha, coluna) {
    var opcoes = [];
    

    if(Tabuleiro.pecaClicada.patente == "soldado"){
        var opcoes = Tabuleiro.calculaPosicoesDoSoldado(linha, coluna);
        return opcoes;
    } 

    var posicaoColunaEsquerda = {linha: linha, coluna: coluna - 1};
    var posicaoColunaDireita = {linha: linha, coluna: coluna + 1};
    var posicaoLinhaAcima = {linha: linha - 1, coluna: coluna};
    var posicaoLinhaAbaixo = {linha: linha + 1, coluna: coluna};

    if (Tabuleiro.naoELago(posicaoColunaEsquerda)){
        if(!(Tabuleiro.posicaoEstaOcupada(posicaoColunaEsquerda))){ // verifica se a posicao não está ocupada
            opcoes.push(posicaoColunaEsquerda);


        }else{
            if(Tabuleiro.posicaoOcupadaPeloAdversario(posicaoColunaEsquerda)){
                posicaoColunaEsquerda.isAdversario = true;
                opcoes.push(posicaoColunaEsquerda);
            }
        }
    } 
    if (Tabuleiro.naoELago(posicaoColunaDireita)){
        if(!(Tabuleiro.posicaoEstaOcupada(posicaoColunaDireita))){ // verifica se a posicao não está ocupada
            opcoes.push(posicaoColunaDireita);
        }else{
            if(Tabuleiro.posicaoOcupadaPeloAdversario(posicaoColunaDireita)){
                posicaoColunaDireita.isAdversario = true;
                opcoes.push(posicaoColunaDireita);
            }
        }
    } 
    if (Tabuleiro.naoELago(posicaoLinhaAcima)){
        if(!(Tabuleiro.posicaoEstaOcupada(posicaoLinhaAcima))){ // verifica se a posicao não está ocupada
            opcoes.push(posicaoLinhaAcima);
        }else{
            if(Tabuleiro.posicaoOcupadaPeloAdversario(posicaoLinhaAcima)){
                posicaoLinhaAcima.isAdversario = true;
                opcoes.push(posicaoLinhaAcima);
            }
        }
    } 
    if (Tabuleiro.naoELago(posicaoLinhaAbaixo)){
        if(!(Tabuleiro.posicaoEstaOcupada(posicaoLinhaAbaixo))){ // verifica se a posicao não está ocupada
            opcoes.push(posicaoLinhaAbaixo);
        }else{
            if(Tabuleiro.posicaoOcupadaPeloAdversario(posicaoLinhaAbaixo)){
                posicaoLinhaAbaixo.isAdversario = true;
                opcoes.push(posicaoLinhaAbaixo);
            }
        }
    }
    return opcoes; 
};

Tabuleiro.calculaPosicoes = function() {
    if ($(Tabuleiro.pecaClicada.peca).parent().hasClass("posicao")) {
        var posicao = $(Tabuleiro.pecaClicada.peca).parent();
        var linha = parseInt($(posicao).attr("data-row"));
        var coluna = parseInt($(posicao).attr("data-column"));
        var patente = ($(Tabuleiro.pecaClicada.peca).attr("data-patente"));
        Tabuleiro.pecaClicada.linha = linha;
        Tabuleiro.pecaClicada.coluna = coluna;
            Tabuleiro.pecaClicada.patente = patente;
        Tabuleiro.pecaClicada.opcoesDeMovimento = Tabuleiro.calculaOpcoesDeMovimento(linha, coluna);
        return true;
    }  
    return false;
};

Tabuleiro.cliqueDaPeca = function() {    
    $(".peca").click(function() { 
        // Se a peça for imóvel e o estado da partida jogo
        var jogoAtual = Estado.jogoAtual();
        if((Tabuleiro.pecaClicadaImovel($(this))) && (jogoAtual.estado != EstadosDoJogo.PREPARANDO)){
            alert("Peça imóvel");
        }
        else{
            if(jogoAtual.estado == EstadosDoJogo.PREPARANDO){
                Tabuleiro.pecaClicada = {
                 peca: $(this)
                };
                if (Tabuleiro.calculaPosicoes()) {
                     Tabuleiro.mostraOpcoes();
                }
            }
            else{
                if(jogoAtual.jogador == Estado.partida.jogadorDaVez){
                    if(Tabuleiro.pecaClicadaIsInimigo($(this))){
                        alert("Não pode movimentar o exercito inimigo");
                    }else{
                        Tabuleiro.pecaClicada = {
                            peca: $(this)
                        }; 
                        if (Tabuleiro.calculaPosicoes()) {
                            Tabuleiro.mostraOpcoes();
                        }
                    }
                }
                else{
                    alert("O jogador da vez é " + Estado.partida.jogadorDaVez);
                }
            }
        }
    });
};

Tabuleiro.movePecaClicadaPara = function(destino) {

    Tabuleiro.pecaClicada.peca.linha = destino.linha;
    Tabuleiro.pecaClicada.peca.coluna = destino.coluna;
    $(destino).append(Tabuleiro.pecaClicada.peca);
    $(".posicao").removeClass("opcaoDeMovimento");
    Tabuleiro.pecaClicada = undefined;
};


Tabuleiro.movendoPeca = function(objeto) {
    var parent = $(Tabuleiro.pecaClicada.peca).parent().attr("id");
    return ((parent == undefined) || (parent != $(objeto).attr("id")));
};

Tabuleiro.validaMovimento = function(destino){
    var linha = $(destino).attr("data-row");
    var coluna = $(destino).attr("data-column");
    for (var i = 0; i < Tabuleiro.pecaClicada.opcoesDeMovimento.length; i++){
        var opcao = Tabuleiro.pecaClicada.opcoesDeMovimento[i];
        if(linha == opcao.linha && coluna == opcao.coluna){
            Tabuleiro.isCombate = opcao.isAdversario;
            return true;
        }
    }
    return false;
}

Tabuleiro.realizaAtaque = function(resultCombate){
    //Estado.partida.jogadorDaVez = resultCombate.jogadorDaVez;
    var posicaoAtacada = Tabuleiro.posicaoPorCoordenadas(resultCombate.pecaAtacada.linha, resultCombate.pecaAtacada.coluna);
    var pecaAtacada = Tabuleiro.pecaPorId(resultCombate.pecaAtacada.id);
    var pecaEmMovimento = Tabuleiro.pecaPorId(resultCombate.pecaEmMovimento.id);
    if(resultCombate.movimentaPeca){
        //movimenta peca e desaparece a outra
        $(pecaAtacada).remove();
        var pecaEmMovimentoAux = $(pecaEmMovimento).clone();
        $(posicaoAtacada).append(pecaEmMovimentoAux);
        $(pecaEmMovimento).remove();// remover do exercito da lista do jogo
               
    }else {
        if(resultCombate.vencedorDaJogada == ""){
            $(pecaEmMovimento).remove();
            $(pecaAtacada).remove();
           
        }
      //remove a peca em movimento
      $(pecaEmMovimento).remove();
    }
//    $("#nome-jogador-da-vez").html("Jogador da Vez: " + resultCombate.jogadorDaVez);
    $(".posicao").removeClass("opcaoDeMovimento");
}

Tabuleiro.exibirCombate = function(resultCombate){

    var posicaoAtacada = Tabuleiro.posicaoPorCoordenadas(resultCombate.pecaAtacada.linha, resultCombate.pecaAtacada.coluna);
    var posicaoEmMovimento = Tabuleiro.posicaoPorCoordenadas(resultCombate.pecaEmMovimento.linha, resultCombate.pecaEmMovimento.coluna);   
    if (resultCombate.jogadorDaVez == "2") {        
        $(posicaoAtacada).children().addClass(resultCombate.pecaAtacada.patente + "_azul");
        $(posicaoEmMovimento).children().addClass(resultCombate.pecaEmMovimento.patente + "_vermelho");
    } else {
        $(posicaoAtacada).children().addClass(resultCombate.pecaAtacada.patente + "_vermelho");
        $(posicaoEmMovimento).children().addClass(resultCombate.pecaEmMovimento.patente + "_azul");    
    }
    setTimeout(function(){Tabuleiro.realizaAtaque(resultCombate)} , 2000);
};

Tabuleiro.cliqueNoTabuleiro = function() {
    $(".posicao").click(function(){
        var posicao = $(this);
        Tabuleiro.iniciaMovimentoDaPeca($(this));
        /*if(Estado.estadoDoJogo != 2){ 
            if (Tabuleiro.movendoPeca($(this))) {
                if (Tabuleiro.pecaClicada != undefined) {
                    if (Estado.estadoDoJogo == 1 && (!$(this).hasClass("lago"))){
                        Tabuleiro.movePecaClicadaPara(this);
                        Tabuleiro.incluirPecaPosicionada(this);
                    }else if(Estado.estadoDoJogo == 3){
                       if(Tabuleiro.validaMovimento(this)){
                            Tabuleiro.movePecaClicadaPara(this);
                       }
                    }
                };
            } 
        }  */     
    });
};

Tabuleiro.incluirPecaPosicionada = function(pecaPosicionada){
    var pecaDoJogo = $(pecaPosicionada).children();

    var peca = {
        id: $(pecaDoJogo).attr("id"),
        linha: parseInt($(pecaPosicionada).attr("data-row")),
        coluna: parseInt($(pecaPosicionada).attr("data-column")),
        patente: $(pecaDoJogo).attr("data-patente"),
        valor: $(pecaDoJogo).attr("valor"),
        isMovel: (!$(pecaDoJogo).hasClass("imovel"))
    }
    Estado.adicionaPecaNoExercito(peca);
}

Tabuleiro.eMesmaPosicao = function(coordenada) {
    var linhaClicada = $(Tabuleiro.pecaClicada.peca).parent().attr("data-row");
    var colunaClicada = $(Tabuleiro.pecaClicada.peca).parent().attr("data-column");
    return linhaClicada == coordenada.linha && colunaClicada == coordenada.coluna;
};
 
Tabuleiro.iniciaMovimentoDaPeca = function(posicao){
    var coordenada = {
        linha: parseInt($(posicao).attr("data-row")),
        coluna: parseInt($(posicao).attr("data-column"))
    }
    if((Tabuleiro.naoELago(coordenada)) && (Tabuleiro.pecaClicada != undefined)){
        if(Estado.estadoDoJogo() == EstadosDoJogo.PREPARANDO){
            //Restringindo area para cada jogador posicionar seu exercito
            if((Estado.numeroDoJogador == 1 && coordenada.linha <= 4) || (Estado.numeroDoJogador == 2 && coordenada.linha >= 7)){
                Tabuleiro.movePecaClicadaPara(posicao);
                Tabuleiro.incluirPecaPosicionada(posicao);
            }
        //Todas as validaçoes serão feitas akiiiiiiiiiiiiiiiiiiiii    
        }else{
            if (!Tabuleiro.eMesmaPosicao(coordenada)) {
                if (Tabuleiro.validaMovimento(posicao)){
                    var pecaClicada = Tabuleiro.pecaClicada;
                    var jogadorDaVez = Estado.partida.jogadorDaVez;
                    //var jogadorDaVez = Estado.jogoAtual().jogador;
                    //Estado.partida.jogadorDaVez = jogadorDaVez;
                    var jogada ={
                              idPecaClicada : $((pecaClicada).peca).attr("id"),
                              coordenada : coordenada,
                              jogadorDaVez : jogadorDaVez,
                              isCombate: Tabuleiro.isCombate
                         }
                    if(Tabuleiro.isCombate){
                        var jogador = Estado.jogoAtual().jogador;

//                        $("#nome-jogador-da-vez").html("Jogador da Vez: " + jogador);
                        jogada.jogadorDaVez = Estado.partida.jogadorDaVez;
                        Estado.enviaCombate(jogada);
                    }else{
                        Tabuleiro.movePecaClicadaPara(posicao);
                        Tabuleiro.incluirPecaPosicionada(posicao);
                         //enviar a jogada para o servidor
//                         $("#nome-jogador-da-vez").html("Jogador da Vez: " + jogada.jogadorDaVez);
                         Estado.enviaJogadaRealizada(jogada);
                     }
                }                
            }            
        }
    }
}

Tabuleiro.desenhaJogoAdversario = function (jogoAdversario){
    var listaPosicoesAdversario = jogoAdversario;
    for(var i = 0; i < jogoAdversario.exercito.length; i++){
        var peca = jogoAdversario.exercito[i];
        var linha = peca.linha;
        var coluna = peca.coluna;        
        var posicao = Tabuleiro.posicaoPorCoordenadas(linha, coluna);
        //montando a  peça adversaria 
        var soldado = $("<div/>").attr("id", peca.id) 
                                 .attr("data-jogador", jogoAdversario.jogador)
                                 .addClass("peca")
                                 .addClass("inimigo");
        if(Estado.numeroDoJogador == 1){
            soldado.addClass("exercito_"+"azul");
        }else if(Estado.numeroDoJogador == 2){
            soldado.addClass("exercito_"+"vermelho");
        }        
        $(posicao).append(soldado);
     }
//    $("#nome-jogador-da-vez").html("Jogador da Vez: " + Estado.partida.jogadorDaVez);
}

Tabuleiro.pecaClicadaImovel = function(peca){
     return peca.hasClass("imovel");
}

Tabuleiro.pecaClicadaIsInimigo = function(peca){
    return peca.hasClass("inimigo");
}

Tabuleiro.isJogadorDaVez = function(){
    return (Estado.partida.jogadorDaVez == Estado.jogoAtual().jogador)
}

Tabuleiro.trocaPecaMovimentada = function(jogada){
    for(var i=0; i<Estado.partida.listaDeJogos.length; i++){
        if(Estado.partida.listaDeJogos[i].jogador != jogada.jogadorDaVez){
            for(var j=0; j<Estado.partida.listaDeJogos[i].exercito.length; j++){
                if(Estado.partida.listaDeJogos[j].exercito[i].id = jogada.idPecaClicada){
                    var posicao = Tabuleiro.posicaoPorCoordenadas(jogada.coordenada.linha, jogada.coordenada.coluna);
                    var peca = Tabuleiro.pecaPorId(jogada.idPecaClicada); 
                    $(posicao).append(peca);//Estado.partida.listaDeJogos[j].exercito[i] = jogada.pecaMovimentada;
//                    $("#nome-jogador-da-vez").html("Jogador da Vez: " + jogada.jogadorDaVez);
                }
                ///continuar
            }
        }
     }
};