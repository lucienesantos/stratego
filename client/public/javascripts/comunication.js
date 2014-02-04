var socket;

var Comunication = {};

Comunication.socket = io.connect("http://localhost:3000"); 

//Tenta uma conexão com a aplicação rodando no node, que está escutando na porta 3000, através do socket definido acima
Comunication.socket.on('connect', function() {
  console.log('conectei');
});

Comunication.socket.on('loginSuccess', function(partida) {  
  Estado.atualizaJogo(partida);
});

Comunication.socket.on('loginFalha', function(data) {
  Estado.falhaNoLogin(data);
});
Comunication.socket.on('jogoRecebido', function(data) {
  Estado.jogoRecebido(data);
});
Comunication.socket.on("partidaProntaParaIniciar", function(partida){
  Estado.montaTabuleiroCompleto(partida);
});

Comunication.socket.on("recebaJogada", function(novaJogada){
	Estado.recebaJogada(novaJogada);
});

Comunication.socket.on("exibirCombate", function(resultCombate){
	Estado.exibirCombate(resultCombate);
});

Comunication.socket.on("chat", function(data){
	Chat.adicionaConversa(data);
});

Comunication.socket.on("jogadorDaVez", function(jogador){
	Estado.atualizaJogadorDaVez(jogador);
});

Comunication.socket.on("zeraPartida", function(partida){
	Estado.zeraPartida(partida);
});

Comunication.sendMessage = function(message) {
	var chat = {
		jogador: Estado.jogador,
		message: message
	};
	Comunication.socket.emit("message", chat);
};

Comunication.logaJogador = function(nomeJogador) {
  Comunication.socket.emit('login', nomeJogador);
};

Comunication.informarJogoPronto = function(jogo){
  Comunication.socket.emit("informarJogoPronto", jogo);
};

Comunication.enviaJogada = function(jogada){
  Comunication.socket.emit("enviaJogada", jogada);
};

Comunication.enviaCombate = function(jogada){
  Comunication.socket.emit("enviaCombate", jogada);
};

Comunication.limparPartida = function(){
	Comunication.socket.emit("limpaPartida");	
};

Comunication.disconect = function (){
	Comunication.socket.emit("disconnect");
}