var Steam = require('steam');
var fs = require('fs');
var properties = require('/home/thomas/steamBot/steamBotProperties.json'); //.json file holding private info such as user and password

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);

var username = properties.username;
var password = properties.password;
var profileName = properties.profileName;
var pcmrGroup = properties.pcmrGroup;
var steamBotPath = properties.steamBotPath;

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

//Save Steam servers to a file
steamClient.on('servers', function(servers){
	fs.writeFile('servers', JSON.stringify(servers));
});

//###DO ON MESSAGE###
steamFriends.on('message',function(serverID, message, type, userID){
	var user = steamFriends.personaStates[userID].player_name;

	if(type == 1){
		logChat(serverID, userID, user, getDateTime(), message);
	}
	
});

//###AUTO REJOIN###
steamFriends.on('chatStateChange', function(stateChange, chatterActedOn, steamIdChat, chatterActedBy) {
  if (stateChange == Steam.EChatMemberStateChange.Kicked && chatterActedOn == steamClient.steamID) {
    steamFriends.joinChat(steamIdChat);
	steamFriends.sendMessage(source, 'fuk u', Steam.EChatEntryType.ChatMsg);
  }
});

//###ACTUALLY NO CLUE WHAT THIS DOES###
steamFriends.on('clanState', function(clanState) {
  if (clanState.announcements.length) {
    console.log('Group with SteamID ' + clanState.steamid_clan + ' has posted ' + clanState.announcements[0].headline);
  }
});

//###LOG CHAT###
function logChat(serverID, userID, user, time, message){
	var date = new Date();
	var yyyy = date.getFullYear();
	var mm = date.getMonth()+1;
	mm = (mm < 10 ? "0" : "") + mm;
	var dd = date.getDate();
	dd = (dd < 10 ? "0" : "") + dd;
	
	var path = steamBotPath+"logs/"
	var fileName = yyyy+"-"+mm+"-"+dd+".txt"
	
	var logContent = yyyy+"-"+mm+"-"+dd+"-"+time+"\r\n"
	+user+" - "+userID+"\r\n"
	+"ServerID - "+serverID+"\r\n"
	+message+"\r\n"
	+"----------\r\n";
	
	fs.appendFileSync(path+fileName, logContent, encoding="utf8");
}

//###GET TIME###
function getDateTime(){
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;


    return hour + ":" + min + ":" + sec;
}