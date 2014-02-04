//Module dependencies.
 
var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//Node roda e fica esperando alguma tentaiva de conexão
var server = app.listen(app.get('port'), function(){
    console.log("Servidor escutando na porta " + app.get('port'));
});

var io = socketio.listen(server);

var Servidor ={
	partida : {
		listaDeJogos: [],
		estado: "",
		jogadorDaVez: "",
		jogadores: []
	}
}

var EstadosDaPartida = {
	AGUARDANDO_INICIAR: 1,
	PRONTA_PARA_INICIAR: 2,
	INICIADA: 3,
	ENCERRADA_BRUSCAMENTE: 9
}
var EstadosDoJogo = {
	PREPARANDO: 1,
	PRONTO_PARA_INICIAR: 2,
	INICIADO: 4
	
}
 
var socketsDeJogadores = [];

Servidor.recarregaPartida = function(jogada){
	for(var i = 0; i < Servidor.partida.listaDeJogos.length; i++){
		for(var j = 0; j < Servidor.partida.listaDeJogos[i].exercito.length; j++){
			if(Servidor.partida.listaDeJogos[i].exercito[j].id == jogada.idPecaClicada){
				Servidor.partida.listaDeJogos[i].exercito[j].linha = jogada.coordenada.linha;
				Servidor.partida.listaDeJogos[i].exercito[j].coluna = jogada.coordenada.coluna;
			}
		}
	}
	//Servidor.partida.jogadorDaVez = jogada.jogadorDaVez;
}	

Servidor.recuperaSocketPorJogador = function(jogador){
	for(var i=0; i<socketsDeJogadores.length; i++){
	      if(socketsDeJogadores[i].jogador == jogador){
	      	  return socketsDeJogadores[i].socket;
	      }
	}
}

Servidor.enviaPartidasInicial = function (){
	Servidor.criarPartidasTemporarias();
	var socket;
	for(var i=0; i<Servidor.partida.jogadores.length; i++){		//recupera o socket de cada jogador e envia a respectiva partida
		socket = Servidor.recuperaSocketPorJogador(Servidor.partida.jogadores[i]);
		if(i == 0){
			socket.emit("partidaProntaParaIniciar", Servidor.partidaTemporaria_1);
		}else if(i == 1){
			socket.emit("partidaProntaParaIniciar", Servidor.partidaTemporaria_2);
		}
		
	}
}

//Para cada jogador é necessário mascarar as patentes dos soldados para enviar o exercito para o jogador adversário
Servidor.inibePatentesDoExercito = function(partidaTemporaria, indiceDoJogoAdversario){
      for(var i=0; i < partidaTemporaria.listaDeJogos[indiceDoJogoAdversario].exercito.length; i++){
      	   delete partidaTemporaria.listaDeJogos[indiceDoJogoAdversario].exercito[i]["patente"];
      	   ///substitue image por imagem padrao
      }
      if(indiceDoJogoAdversario == 0){
      	Servidor.partidaTemporaria_2 = partidaTemporaria;
      }else if(indiceDoJogoAdversario == 1){
		Servidor.partidaTemporaria_1 = partidaTemporaria; //Alterou a partidaTemporaria_1
      }
}

Servidor.criarPartidasTemporarias = function(){
	Servidor.partidaTemporaria_1 = JSON.parse(JSON.stringify(Servidor.partida));  //partida que será enviada para o jogador 1
	Servidor.partidaTemporaria_2 = JSON.parse(JSON.stringify(Servidor.partida));	 //partida que será enviada para o jogador 2
	Servidor.inibePatentesDoExercito(Servidor.partidaTemporaria_1, 1);
	Servidor.inibePatentesDoExercito(Servidor.partidaTemporaria_2, 0)
 }

Servidor.quantidadeJogosProntos = function(){
	var jogosProntos = 0;
	for(var i=0; i<Servidor.partida.listaDeJogos.length; i++){
		if((Servidor.partida.listaDeJogos[i].length != 0) && (Servidor.partida.listaDeJogos[i].estado == 2)){ //2: PRONTO_PARA_INICIAR
			jogosProntos++;
		}
	}
	return jogosProntos;
}

//Verifica se ja existe um jogo cadastrado para esse jogador na lista.
Servidor.procuraJogoNalista = function(jogo) {
	for(var i=0; i<Servidor.partida.listaDeJogos.length; i++){
		if (jogo.jogador == Servidor.partida.listaDeJogos[i].jogador) {
			return i;
		}
	}
};

/* Se ja existe jogo para esse jogador, ele é atualizado
   Senão, ele adiciona o jogo na lista
*/
Servidor.inseriJogoNaLista = function(jogo){
	var i = Servidor.procuraJogoNalista(jogo); 
	jogo.estado = EstadosDoJogo.PRONTO_PARA_INICIAR;
	if(i != undefined){ 
		Servidor.partida.listaDeJogos[i] = jogo;
	}else{
		Servidor.partida.listaDeJogos.push(jogo); 
	}
}

Servidor.atualizaPartida = function(jogo){
	Servidor.inseriJogoNaLista(jogo);
	if(Servidor.quantidadeJogosProntos() == 1){
		Servidor.partida.estado = EstadosDaPartida.AGUARDANDO_INICIAR;
	}else if(Servidor.quantidadeJogosProntos() == 2){
		Servidor.partida.estado = EstadosDaPartida.PRONTA_PARA_INICIAR;
	}
	
}

Servidor.getIndiceDoJogoNaListaPorJogador = function(jogador){
	// após corrigir "disconnect" retirar if
	if(jogador != undefined && Servidor.partida.listaDeJogos.length > 1){
		for(var i=0; i < Servidor.partida.listaDeJogos.length; i++){
	    	if(Servidor.partida.listaDeJogos[i].jogador == jogador){
	    		return i;
	    	}
	    }
	}
}

Servidor.getIndiceDoJogadorLista = function(jogador){
    for(var i=0; i < Servidor.partida.jogadores.length; i++){
    	if(Servidor.partida.jogadores[i] == jogador){
    		return i;
    	}
    }
}

Servidor.enviaCombate = function(jogada){
	 var resultCombate = Servidor.preparaJogadaCombate(jogada);
   	 io.sockets.emit("exibirCombate", resultCombate);
}

Servidor.jogadorAdversario = function(jogadoAtual){
	for(var i=0; i < Servidor.partida.jogadores.length; i++){
		if(jogadoAtual != Servidor.partida.jogadores[i]){
			return Servidor.partida.jogadores[i];
		}
	}
}


Servidor.preparaJogadaCombate = function(jogada){
	var pecaAtacada = {};
	var posicaoEmMovimento = {};

	for(var i=0; i < Servidor.partida.listaDeJogos.length; i++){
		for(var j=0; j < Servidor.partida.listaDeJogos[i].exercito.length; j++){
			if(Servidor.partida.listaDeJogos[i].exercito[j].linha == jogada.coordenada.linha &&
				Servidor.partida.listaDeJogos[i].exercito[j].coluna == jogada.coordenada.coluna){

				pecaAtacada =  Servidor.partida.listaDeJogos[i].exercito[j];
			}
			if(Servidor.partida.listaDeJogos[i].exercito[j].id == jogada.idPecaClicada){
				posicaoEmMovimento = Servidor.partida.listaDeJogos[i].exercito[j];
			}
		}
	}
    var jogadorDaVez = Servidor.jogadorAdversario(jogada.jogadorDaVez);
	var combate = {
		pecaAtacada : pecaAtacada,
		pecaEmMovimento: posicaoEmMovimento,
		jogadorDaVez : jogadorDaVez,
	}

	var resultCombate = Servidor.realizaCombate(combate);
	return resultCombate;
};

Servidor.excluiPecaDaPartida = function (pecaExcluida){
	for(var i = 0; i < Servidor.partida.listaDeJogos.length; i++){
		for(var j = 0; j < Servidor.partida.listaDeJogos[i].exercito.length; j++){
			var pecaNaLista = Servidor.partida.listaDeJogos[i].exercito[j];
			if(pecaExcluida.id == pecaNaLista.id){
				Servidor.partida.listaDeJogos[i].exercito.splice(j,1);  //exclui a peca na partida
			}
		}

	}
}

Servidor.verificaSeParticaAcabou = function(){
    
var resultVerificacao ={
	isEmpate: false,
	nomeVencedor: ""
}
   var listaPerdedores = [];
      
   for(var i = 0;  i < Servidor.partida.listaDeJogos.length; i++){
   		var exercito = Servidor.partida.listaDeJogos[i].exercito;
   		var pecasMoveis = 0;
   		var quantidade = exercito.filter(function(peca){return peca.isMovel == true});
   		pecasMoveis = quantidade.length;
   		if(pecasMoveis == 0){
   			listaPerdedores.push(Servidor.partida.listaDeJogos[i].jogador);
   		}

   }
   if(listaPerdedores.length == 2){
 		resultVerificacao.isEmpate = true;
   }
   else if (listaPerdedores.length == 1){

   	    resultVerificacao.nomeVencedor = Servidor.getJogadorVencedor(listaPerdedores[0]);
   }
   return resultVerificacao;
}

Servidor.getJogadorVencedor = function(jogadorPerdedor){
	for(var i = 0; i < Servidor.partida.jogadores.length; i++){
		if(jogadorPerdedor != Servidor.partida.jogadores[i]){
			return Servidor.partida.jogadores[i];
		}
	}
}

Servidor.getIndiceDoJogadorLista = function(){

}

Servidor.realizaCombate = function(combate){ //Exclui a bandeira da partida
    var valorPecaAtacada =  combate.pecaAtacada.valor;
    var valorPecaEmMovimento = combate.pecaEmMovimento.valor;

    var jogadorQueAtacou = Servidor.jogadorAdversario(combate.jogadorDaVez);

    var resultCombate ={
     	vencedorDaJogada : "",
     	vencedorDaPartida : "",
     	pecaAtacada: combate.pecaAtacada,
     	pecaEmMovimento: combate.pecaEmMovimento,
     	jogadorDaVez: jogadorQueAtacou,
     	movimentaPeca: false,
     	isEmpate: false

    }
    if(valorPecaAtacada == "F"){ // fim de jogo
     	resultCombate.vencedorDaPartida = combate.jogadorDaVez;
     	Servidor.excluiPecaDaPartida(combate.pecaAtacada); //Exclui a bandeira da partida
     	resultCombate.vencedorDaPartida = jogadorQueAtacou;
     	resultCombate.isEmpate = false;
    }
    else {
     	if(valorPecaAtacada == "B"){ // se for bomba 
     		if(parseInt(valorPecaEmMovimento) == 2){ // se for cabo-armeiro desarma bomba
     			resultCombate.vencedorDaJogada = combate.jogadorDaVez;
     			resultCombate.movimentaPeca = true;
     			Servidor.excluiPecaDaPartida(combate.pecaAtacada);    // exclui a bomba da partida
     		}
     		else {
     			resultCombate.vencedorDaJogada = jogadorQueAtacou; // bomba destroi
     			Servidor.excluiPecaDaPartida(combate.pecaEmMovimento); //Exclui a peca destruida pela bomba
     		}
     	}
     	else if(parseInt(valorPecaEmMovimento) == 0){ // Se for espião
	     		if(parseInt(valorPecaAtacada) == 9){ 
	     			resultCombate.vencedorDaJogada = combate.valorPecaAtacada; // se for marechal, mata marechal
	     			resultCombate.movimentaPeca = true;
	     			Servidor.excluiPecaDaPartida(combate.valorPecaAtacada); //Exclui o marechal da partida
	     		}
	     		else if(parseInt(valorPecaAtacada) == 0){
	     			resultCombate.vencedorDaJogada = ""; 
	    			Servidor.excluiPecaDaPartida(combate.pecaAtacada);
	    			Servidor.excluiPecaDaPartida(combate.pecaEmMovimento);
	     		}
	     		else{
	     			resultCombate.vencedorDaJogada = jogadorQueAtacou;
	     			Servidor.excluiPecaDaPartida(combate.pecaEmMovimento); // Exclui o espião
	     		}
	    }
	    else if(parseInt(valorPecaEmMovimento) > parseInt(valorPecaAtacada)){
	    	 resultCombate.vencedorDaJogada = combate.jogadorDaVez;
	    	 resultCombate.movimentaPeca = true;
	    	 Servidor.excluiPecaDaPartida(combate.pecaAtacada);
	    }
	    else if(parseInt(valorPecaEmMovimento) < parseInt(valorPecaAtacada)){
	    	 resultCombate.vencedorDaJogada = jogadorQueAtacou;
	    	 Servidor.excluiPecaDaPartida(combate.pecaEmMovimento);
	    } 	
	    else {
	    	resultCombate.vencedorDaJogada = ""; //Soldados com mesma patente, nenhum vencedor, os 2 soldados morrem
	    	Servidor.excluiPecaDaPartida(combate.pecaAtacada);
	    	Servidor.excluiPecaDaPartida(combate.pecaEmMovimento);
	    }
	   var resultadoVerificacao = Servidor.verificaSeParticaAcabou();
	   if(!resultadoVerificacao.isEmpate){
		  resultCombate.vencedorDaPartida = resultadoVerificacao.nomeVencedor;
	   }else{
	   	resultCombate.isEmpate = resultadoVerificacao;
	   }
    } 

   return resultCombate;
};

Servidor.limpaPartida = function(){
	Servidor.partida = {};
};


io.sockets.on('connection', function(socket) {

	//Chat
	socket.on('message', function(data){
		io.sockets.emit("chat", data);
	});

	socket.on('login', function(nomeJogador){
		var quantidadeJogadores =Servidor.partida.jogadores.length;
		if (quantidadeJogadores < 2) {
			var jogo = {
				estado: EstadosDoJogo.PREPARANDO, // Ao clicar no botÃO "Preparar Jogo" o estado do jogo, deste usuario, deve ser setado para "PREPARANDO" 
				jogador: nomeJogador,
				exercito: []
			};
			var socketAuxiliar = {
				socket: socket,
				jogador: nomeJogador
			}
			
			socketsDeJogadores.push(socketAuxiliar);
			if(quantidadeJogadores == 0){
				Servidor.partida.jogadorDaVez = nomeJogador;
			}

			Servidor.partida.listaDeJogos.push(jogo);
			Servidor.partida.jogadores.push(nomeJogador);
			socket.emit('loginSuccess', Servidor.partida); // Responde ao usuario se conseguiu logar com sucesso
		} else {			
			io.sockets.emit('loginFalha', 'Jogadores completos! aguarde sua vez.'); //caso contrario
		}		
	});

	socket.on("informarJogoPronto", function(jogo){
		
		Servidor.atualizaPartida(jogo);	
		if(Servidor.partida.estado == EstadosDaPartida.AGUARDANDO_INICIAR){
			socket.emit("jogoRecebido", jogo);
		}else if(Servidor.partida.estado == EstadosDaPartida.PRONTA_PARA_INICIAR){
			//alterar o estado dos jogos
			for(var i =0; i < Servidor.partida.listaDeJogos.length; i++){
				Servidor.partida.listaDeJogos[i].estado = EstadosDoJogo.INICIADO;
			}
			Servidor.partida.jogadorDaVez = Servidor.partida.jogadores[0];
			Servidor.partida.estado = EstadosDaPartida.INICIADA;
			
			Servidor.enviaPartidasInicial();
		}
	});

	socket.on("enviaJogada", function(jogada){
			Servidor.recarregaPartida(jogada);
			var socketAdversario = Servidor.recuperaSocketPorJogador(jogada.jogadorDaVez);
			io.sockets.emit("recebaJogada", jogada);
			var adversario = Servidor.jogadorAdversario(jogada.jogadorDaVez);
			io.sockets.emit("jogadorDaVez", adversario);
	});

	socket.on("enviaCombate", function(jogada){
		Servidor.enviaCombate(jogada);
		var adversario = Servidor.jogadorAdversario(jogada.jogadorDaVez);
		io.sockets.emit("jogadorDaVez", adversario);
	});

	socket.on("limpaPartida", function(){
		Servidor.limpaPartida();
		io.sockets.emit("zeraPartida", Servidor.partida);
	});
	
   	socket.on('disconnect', function() {
   		io.sockets.disconnect();
	   
  });
});