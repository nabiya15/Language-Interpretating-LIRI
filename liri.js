// import the keys from keys.js
var keys= require("./keys.js");
// import the require node module
var request= require("request");
// import the spotify node module;
var spotifyApi= require("node-spotify-api");
// import twitter node module;
var twitterApi=require("twitter");
// require file system
var fs=require("fs");

var searchCommand = process.argv[2];
var searchItem="";
var dataoutput="";
var spacer="----------------------------------------------------------------------";

choice(searchCommand,searchItem);

function choice(searchCommand,searchItem){
	
	if(searchCommand==="my-tweets"){
		tweets(searchCommand,searchItem);
	}else if(searchCommand==="spotify-this-song"){
		spotifyThis(searchCommand,searchItem);
	}else if(searchCommand==="movie-this"){
		movieThis(searchCommand,searchItem);
	}else if(searchCommand==="do-what-it-says"){
		doasitsays();
	}else{
		console.log("Please choose a valid command.\nYour choices are:\n1.my-tweets\n2.movie-this\n3.spotify-this-song\n4.do-what-it-says")
	}
}
function tweets(searchCommand,searchItem){
	var client = new twitterApi(keys.twitterKeys);
	//console.log(client);
	var params = {screen_name: searchItem};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log(error);
			return;
		}
		for(var i=0;i<tweets.length;i++){
			dataoutput=("Tweet "+parseInt(i+1)+": \n"+tweets[i].text+"\nCreated @ "+tweets[i].created_at);
			console.log(dataoutput);
			logdata(dataoutput);
		}
	});
}

function spotifyThis(searchCommand,searchItem){
	var spotify = new spotifyApi(keys.spotifyKeys);
	for(var i=3; i<process.argv.length; i++){
		searchItem=searchItem+'+'+process.argv[i];
	}

	if( searchItem==undefined || searchItem=="undefined" || searchItem==""){
		searchItem="The Sign";	
	}
	spotify.search({ type: 'track', query: searchItem, limit: 1})
	.then(function(response) {
				//console.log(JSON.stringify(response,null,2));
				dataoutput= spacer+"\nArtist(s): \n"+response.tracks.items[0].artists[0].name+"\n"+spacer+"\nSong name: \n"+response.tracks.items[0].name+"\n"+spacer+"\nSpotify Preview Link: \n"+ response.tracks.items[0].preview_url+"\n"+spacer+"\nAlbum: \n"+ response.tracks.items[0].album.name+"\n"+spacer;
				console.log(dataoutput);
				logdata(dataoutput);
			})
	.catch(function(error){
				//return console.log(error);
				console.log("Sorry!!! Track not found.")
			})
}

function movieThis(searchCommand,searchItem){
	for(var i=3; i<process.argv.length; i++){
		searchItem=searchItem+'+'+process.argv[i];
	}

	if( searchItem==undefined || searchItem=="undefined" || searchItem==""){
		searchItem="mr.nobody";	
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + searchItem + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
		    console.log(JSON.parse(body));
			dataoutput=spacer+"\n"+" Title: \n "+JSON.parse(body).Title+"\n"+spacer+"\n"+" Release Year: \n " + body.Year+"\n"+spacer+"\n"+" IMDB Rating: \n " + JSON.parse(body).Ratings[0].Value+"\n"+spacer+"\n"+" Rotten Tomato Rating: \n " + JSON.parse(body).Ratings[1].Value+"\n"+spacer+"\n"+" Country of production: \n " + JSON.parse(body).Country+"\n"+spacer+"\n"+" Language: \n " + JSON.parse(body).Language+"\n"+spacer+"\n"+" Plot: \n " + JSON.parse(body).Plot+"\n"+spacer+"\n"+" Actors: \n " + JSON.parse(body).Actors+"\n"+spacer+"\n";
			console.log(dataoutput);
			logdata(dataoutput);
		}
	});
}

function doasitsays(){
		fs.readFile("random.txt","utf8",function(error,data){
		if(error){
			return console.log(error);
		}
		var searchArray= data.split(",");
		var searchCommand=searchArray[0];
		var searchItem=searchArray[1];
		choice(searchCommand,searchItem);

	})
}

function logdata(dataoutput){
	fs.appendFile("log" , "\nNew Log:\n"+spacer+"\n"+dataoutput+"\n"+spacer+"\n" , function(error){
		if(error){
			//return console.log(error)
			console.log("Not logged!!")
		}


	})
}