var Estado = {
	jogador: "",
	partida: ""
}
var EstadosDoJogo = {
	PREPARANDO: 1,
	PRONTO_PARA_INICIAR: 2
}
var EstadosDaPartida = {
	AGUARDANDO_INICIAR: 1,
	PRONTA_PARA_INICIAR: 2,
	INICIADA: 3,
	ENCERRADA_BRUSCAMENTE: 9
}

Estado.atualizaJogadorDaVez = function(jogador) {
	Estado.partida.jogadorDaVez = jogador;
	$("#nome-jogador-da-vez").html("Jogador da Vez: " + Estado.partida.jogadorDaVez);
};

Estado.logaJogador = function(nomeJogador, callback) {
	Estado.callbackLogin = callback;
	Comunication.logaJogador(nomeJogador);
	Estado.jogador = nomeJogador;	
};

Estado.jogoRecebido = function(jogo){
	alert("O servidor recebeu o jogo do usuario: ");
};

Estado.estadoDoJogo = function(){
	for(var i = 0; i < Estado.partida.listaDeJogos.length; i++){
		if(Estado.partida.listaDeJogos[i].jogador == Estado.jogador)
			return Estado.partida.listaDeJogos[i].estado;
	}
}

Estado.jogoAtual = function() {
	for(var i = 0; i < Estado.partida.listaDeJogos.length; i++){
		if(Estado.partida.listaDeJogos[i].jogador == Estado.jogador)
			return Estado.partida.listaDeJogos[i];
	}
};

Estado.atualizaJogo = function(partida){
	Estado.partida = partida;
	Estado.atualizaJogadores();
	Estado.callbackLogin();
	Jogo.habilitaButaoPronto();
	Jogo.desabilitaButaoPrepararJogo();
};

Estado.enumeraJogador = function(jogadores){
	if (Estado.numeroDoJogador == undefined) {
		if(jogadores.length == 1){
			Estado.numeroDoJogador = 1;
		}else{
			Estado.numeroDoJogador = 2;
		}
	}	
}

Estado.atualizaJogadores = function() {
	var jogadores = [];
	for(var i = 0; i < Estado.partida.listaDeJogos.length; i++){
		jogadores.push(Estado.partida.listaDeJogos[i].jogador);
	}
	Estado.enumeraJogador(jogadores);
	Jogo.mostraJogadoresOnline(jogadores);
	Jogo.habilitaButaoPronto;	
};

Estado.loginJaCadastrado = function(data){
	alert(data);
};

Estado.falhaNoLogin = function(data) {
	alert(data);
};

Estado.atualizaConfiguracoes = function(jogoAtual) {
	for(var i = 0; i < Estado.partida.listaDeJogos.length; i++){
		if(Estado.partida.listaDeJogos[i].jogador == Estado.jogador)
			Estado.partida.listaDeJogos[i] = jogoAtual;
	}
};

Estado.procuraIndicePeca = function(id, jogoAtual) {
	for (var i = 0; i < jogoAtual.exercito.length; i++)	{
		if (id == jogoAtual.exercito[i].id) {
			return i;
		}
	}
};
  
Estado.procuraPeca = function(id, jogoAtual) {
    for (var i = 0; i < jogoAtual.exercito.length; i++) {
        if (id == jogoAtual.exercito[i].id) {
            return jogoAtual.exercito[i]
        }
    }
};

Estado.adicionaPecaNoExercito = function(peca) {
	var jogoAtual = Estado.jogoAtual();
	var pecaEncontrada = Estado.procuraIndicePeca(peca.id, jogoAtual);
	if (pecaEncontrada != undefined) {    
		peca.posicaoAnterior = jogoAtual.exercito[pecaEncontrada].posicaoAnterior;
		peca.quantidadeJogadasRepetidas = jogoAtual.exercito[pecaEncontrada].quantidadeJogadasRepetidas;
		jogoAtual.exercito[pecaEncontrada] = peca;
	} else {
		jogoAtual.exercito.push(peca);
	}
	Estado.atualizaConfiguracoes(jogoAtual);
};

Estado.jogoAdversario = function (){
	for(var i = 0; i < Estado.partida.listaDeJogos.length; i++){
		if(Estado.partida.listaDeJogos[i].jogador != Estado.jogador)
			return Estado.partida.listaDeJogos[i];
	}	
}
//Informar para o node (app.js) que o jogo está pronto para jogar (manda o jogo para o node)
Estado.jogoPronto = function(jogo){
	Jogo.desabilitaButaoPronto();
	Comunication.informarJogoPronto(jogo);
}	

Estado.montaTabuleiroCompleto = function(partida){
	if(Estado.estadoDoJogo != EstadosDoJogo.PREPARANDO){
		Estado.partida = partida;
		var jogoAtual = Estado.jogoAtual();
		var jogoAdversario = Estado.jogoAdversario();
		Tabuleiro.desenhaJogoAdversario(jogoAdversario);
	}
}

Estado.enviaJogadaRealizada = function(jogada){
	Comunication.enviaJogada(jogada);
}

Estado.recebaJogada = function(jogada){
	Tabuleiro.trocaPecaMovimentada(jogada);	
}

Estado.enviaCombate = function(jogada){
	Comunication.enviaCombate(jogada);
};

Estado.exibirCombate = function(resultCombate){
	Tabuleiro.exibirCombate(resultCombate);
}
Estado.limpaPartida = function(){
	Comunication.limparPartida();
};

Estado.zeraPartida = function(partida){
	Estado.partida = partida;
	Tabuleiro.zeraPartida(); 
};
