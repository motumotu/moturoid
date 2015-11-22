const BOT_ID = "moturoid";
var twitter = require('twitter');
var settings = require('./settings');
require('date-utils');

var bot = new twitter({
	consumer_key        : settings.consumer_key,
	consumer_secret     : settings.consumer_secret,
	access_token_key    : settings.access_token_key,
    access_token_secret : settings.access_token_secret
});

/*
 * 
 */
setInterval(function() {

}, 1000);

/*
 * つぶやき
 */
function tweetText(text)
{
    bot.post('statuses/update', { status: text },  function(error, tweet, response){
        if(error) throw error;
        console.log("tweet ："+text);
    });
}

/*
 * リプライ
 */
function tweetReply(text, reply_id)
{
    bot.post('statuses/update', { status: text, in_reply_to_status_id : reply_id }, function(error, tweet, response) {
        if (error) throw error;
        console.log("replay :" + text);
    });
}

/*
 * フォロワーのツイートに対してリプライ
 */
bot.stream('user', function(stream) {
    stream.on('data', function(data) {
        if (!('text' in data)) {
            console.error('[ERROR] invalid data');
            return;
        }
        var twUserId = data.user.screen_name;
        var text = data.text;
        var replayStr = data.text.replace(new RegExp('^@' + BOT_ID + ' '), '');
        var isMention = (data.in_reply_to_user_id !== null);
        var replyId = data.id_str;
        
        // リプライに返信
        if (isMention && twUserId != BOT_ID) {
            tweetReply('@' + twUserId + ' ' + 'それは ' + getAdjective() + " ね！", replyId);
        }
        // あいさつ
        else if (text.match(/おはよう/)) {
            tweetReply('@' + twUserId + ' ' + 'おはよーo(^-^)o', replyId);
        }
    });
});

/*
 * 名詞取得
 */
function getNoun()
{
    dic = ["リンゴ"];
    return dic[Math.floor(Math.random() * dic.length)];
}

/*
 * 形容詞取得
 */
function getAdjective()
{
    var dic = ["嬉しい", "楽しい", "苦しい", "つらい", "悲しい", "恐ろしい", "寂しい", "面白い", "凄い"];
    return dic[Math.floor(Math.random() * dic.length)];
}

