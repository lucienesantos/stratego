var Jogo ={

}

var idNumero = 0;

Jogo.gerarPeca = function(quantidade, patente, cor, valor){
	for(var i = 0; i < quantidade; i++){
		var id = idNumero + "_" + Estado.jogador + "_" + i;
		var soldado = $("<div/>").attr("id", id)
								 .attr("data-patente", patente)
								 .attr("valor", valor)
								 .attr("data-jogador", Estado.jogador)
								 .addClass("peca")
								 .addClass(patente + "_" + cor)
								 .addClass("exercito_"+cor);
		if((patente == "bandeira") || (patente == "bomba")){
			soldado.addClass("imovel");
		}
		$("#exercito").append(soldado);
		idNumero++;
	}
}

Jogo.gerarExercito = function(cor){
		Jogo.gerarPeca(1, "bandeira", cor, "F");
		Jogo.gerarPeca(6, "bomba", cor, "B");
		Jogo.gerarPeca(1, "espiao", cor, 0);
		Jogo.gerarPeca(8, "soldado", cor, 1);
		Jogo.gerarPeca(5, "cabo-armeiro", cor, 2);
		Jogo.gerarPeca(4, "sargento", cor, 3);
		Jogo.gerarPeca(4, "tenente", cor, 4);
		Jogo.gerarPeca(4, "capitao", cor, 5);
		Jogo.gerarPeca(3, "major", cor, 6);
		Jogo.gerarPeca(2, "coronel", cor, 7);
		Jogo.gerarPeca(1, "general", cor, 8);
		Jogo.gerarPeca(1, "marechal", cor, 9);
}

Jogo.habilitaButaoPronto = function(){
    $("#pronto").removeAttr("disabled");
}

Jogo.desabilitaButaoPronto = function(){
	$("#pronto").attr("disabled", true);
}

Jogo.desabilitaButaoPrepararJogo = function(){
	$("#preparar-jogo").attr("disabled", true);
}

//Verifica se o exercito está completamente posicionado no tabuleiro
Jogo.validaInicioDoJogo = function(){
	var jogoAtual = Estado.jogoAtual();
	if(jogoAtual.exercito.length == 40){
		return true;
	}else{
		alert("O tabuleiro ainda não está completo!");
	}
}

Jogo.iniciaJogoNoClick = function(){
	$("#pronto").click(function(){
		if(Jogo.validaInicioDoJogo()){
			Estado.jogoPronto(Estado.jogoAtual());			
		}
	});
}

Jogo.montaJogoNoClick = function() {
	$("#preparar-jogo").click(function(){
		var nome = $("#nomeJogador").val();

		Estado.logaJogador(nome, function(){
			if(Estado.numeroDoJogador == 1){
				var cor = "vermelho";
			} else if(Estado.numeroDoJogador == 2){
				var cor = "azul";
			}
			Tabuleiro.montarTabuleiro();
			Tabuleiro.desabilitaTabuleiroAdversario();
			Jogo.gerarExercito(cor);
			Tabuleiro.cliqueDaPeca();
		    Tabuleiro.cliqueNoTabuleiro();
		});		
	});
};

Jogo.mostraJogadoresOnline = function(jogadores) {
	$("#lista").html("");
	for (var i = 0; i < jogadores.length; i++) {
		var option = $("<option/>").text(jogadores[i]);
		$("#lista").append(option);
	};
};

$(function(){

	Jogo.montaJogoNoClick();	
	Jogo.iniciaJogoNoClick();
});