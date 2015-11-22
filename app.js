var twitter = require('twitter');
var settings = require('./settings');
var bot = new twitter({
	consumer_key        : settings.consumer_key,
	consumer_secret     : settings.consumer_secret,
	access_token_key    : settings.access_token_key,
    access_token_secret : settings.access_token_secret
});


/*
 * つぶやき
 */
function tweet_text(text)
{
    bot.post('statuses/update', {status: text},  function(error, tweet, response){
        if(error) throw error;
        console.log("tweet ："+text);
    });
}
