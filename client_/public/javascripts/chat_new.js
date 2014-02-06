var Chat = {

};

Chat.newChat = function(chat) {
	return $("<p/>").append(chat.jogador + ": " + chat.message);
};

Chat.adicionaConversa = function(chat) {
	$(".messages").append(Chat.newChat(chat));
	if (!($("#chat-window").hasClass("bounceInUp"))) {
		$("#chat-window").removeClass("bounceOutDown").show().addClass("bounceInUp");
	}
};