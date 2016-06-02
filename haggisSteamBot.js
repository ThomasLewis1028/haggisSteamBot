var Steam = require('steam');
var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var properties = "steamBotProperties.json"

steamClient.connect();
steamClient.on('connected', function(){
	steamUser.logOn({
		account_name = properties.username,
		password = properties.password
	});
});
steamClient.on('logOnResponse', function(){
	/* ... */
});

steamClient.on('message',function(header, body){
	
})