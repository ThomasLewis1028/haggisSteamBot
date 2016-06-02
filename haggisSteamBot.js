var Steam = require('steam');
var fs = require('fs');
var properties = require('/home/thomas/steamBot/steamBotProperties.json');

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);

var username = properties.username;
var password = properties.password;
var profileName = properties.profileName;
var pcmrGroup = properties.pcmrGroup;

//Connect to the steam Client with bot user/pass, stored in a private .json file
steamClient.connect();
steamClient.on('connected', function(){
	steamUser.logOn({
		account_name: username,
		password: password
	});
});

//Do stuff when it comes online
steamClient.on('logOnResponse', function(logonResp){
	if(logonResp.eresult == Steam.EResult.OK){
		console.log('Logged in!');
		steamFriends.setPersonaState(Steam.EPersonaState.Online);
		steamFriends.setPersonaName(profileName);
		steamFriends.joinChat(pcmrGroup);
	}
});

steamClient.on('servers', function(servers){
	fs.writeFile('servers', JSON.stringify(servers));
});

steamClient.on('message',function(source, message, type, chatter){
	console.log('Received message: ' + message);
	if(message =='ping'){
		steamFriends.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg);
	}
});

steamFriends.on('chatStateChange', function(stateChange, chatterActedOn, steamIdChat, chatterActedBy){
	if(stateChange == Steam.EChatMemberStateChanged.kicked && chatterActedOn == steamClient.steamID){
		steamFriends.joinChat(steamIdChat);
	}
})

steamFriends.on('clanState', function(clanState) {
  if (clanState.announcements.length) {
    console.log('Group with SteamID ' + clanState.steamid_clan + ' has posted ' + clanState.announcements[0].headline);
  }
});