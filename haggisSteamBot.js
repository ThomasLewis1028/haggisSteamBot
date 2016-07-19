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
var haggisTestGroup = properties.haggisTestGroup;
var steamBotPath = properties.steamBotPath;
var haggisSteamID = properties.haggisID;
var botfartSteamID = properties.botfartID;
var steamMods = properties.steamMods;

//Connect to the steam Client with bot user/pass, stored in a private .json file
steamClient.connect();
steamClient.on('connected', function () {
	steamUser.logOn({
		account_name: username,
		password: password
	});
});

//Do stuff when it comes online
steamClient.on('logOnResponse', function (logonResp) {
	if (logonResp.eresult == Steam.EResult.OK) {
		console.log('Logged in!');
		steamFriends.setPersonaState(Steam.EPersonaState.Online);
		steamFriends.setPersonaName(profileName);
		steamFriends.joinChat(haggisTestGroup);
		//steamFriends.joinChat(pcmrGroup);
	}
});

//Save Steam servers to a file
steamClient.on('servers', function (servers) {
	fs.writeFile('servers', JSON.stringify(servers));
});

//###DO ON GROUP MESSAGE###
steamFriends.on('chatMsg', function (serverID, message, type, userID) {
	try {
		var user = steamFriends.personaStates[userID].player_name;

		var messageArray = message.split(" ");

		if (userID != botfartSteamID && userID != haggisSteamID) {
			for (i = 0; i < messageArray.length; i++) {
				if (/H(a|o)(gg|g)is/i.test(messageArray[i])) {
					sendSteamMessage(haggisSteamID, user + " Pinged you with: " + message);
				}
			}
		}

		logSteamChat(serverID, userID, user, getDateTime(), message);
	} catch (err) {
		console.log(err);
	}
});

//###DO ON PM###
steamFriends.on('friendMsg', function (userID, message, type) {
	if (type == 2) {
		return;
	}

	if (userID == haggisSteamID && /^!rejoin$/i.test(message)) {
		steamClient.disconnect();
		steamClient.connect();
	} else {
		sendSteamMessage(userID, 'piss off');
	}
})

// ###AUTO REJOIN###
// steamFriends.on('chatStateChange', function (stateChange, chatterActedOn, steamIDChat, chatterActedBy) {
// 	if (stateChange == Steam.EChatMemberStateChange.Kicked && chatterActedOn == steamClient.steamID) {
// 		steamFriends.joinChat(steamIDChat);
// 		steamFriends.sendMessage(steamIDChat, 'don\'t kick me fgot', Steam.EChatEntryType.ChatMsg);
// 	}
// });

//###SEND MESSAGES###
function sendSteamMessage(serverID, message) {
	steamFriends.sendMessage(serverID, message, Steam.EChatEntryType.ChatMsg);
}


//###LOG CHAT###
function logSteamChat(serverID, userID, user, time, message) {
	var date = new Date();
	var yyyy = date.getFullYear();
	var mm = date.getMonth() + 1;
	mm = (mm < 10 ? "0" : "") + mm;
	var dd = date.getDate();
	dd = (dd < 10 ? "0" : "") + dd;

	var path = steamBotPath + "logs/"
	var fileName = yyyy + "-" + mm + "-" + dd + ".txt"

	var logContent = yyyy + "-" + mm + "-" + dd + "-" + time + "\r\n"
		+ user + " - " + userID + "\r\n"
		+ "ServerID - " + serverID + "\r\n"
		+ message + "\r\n"
		+ "----------\r\n";

	fs.appendFileSync(path + fileName, logContent, encoding = "utf8");
}

//###GET TIME###
function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;


    return hour + ":" + min + ":" + sec;
}

//###ACTUALLY NO CLUE WHAT THIS DOES###
// steamFriends.on('clanState', function (clanState) {
// 	if (clanState.announcements.length) {
// 		console.log('Group with SteamID ' + clanState.steamid_clan + ' has posted ' + clanState.announcements[0].headline);
// 	}
// });