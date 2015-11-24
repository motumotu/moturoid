const BOT_ID = "moturoid";
var twitter = require('twitter');
var settings = require('./settings');
require('date-utils');
var noun = require('./noun_dic');
var adj = require('./adj_dic');
//var kuromoji = require("kuromoji");

var bot = new twitter({
	consumer_key        : settings.consumer_key,
	consumer_secret     : settings.consumer_secret,
	access_token_key    : settings.access_token_key,
    access_token_secret : settings.access_token_secret
});

//randTweet();
console.log("noun " + noun.noun_dic.length);
console.log("adj  " + adj.adj_dic.length);
/*
 * 
 */
setInterval(function() {
    randTweet();              // ランダムにツイート
}, 1800000);                // 30分毎
//}, 600000);                   // 10分毎

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
        
        //console.log("twUserId " + twUserId);
        //console.log("text " + text);
        //console.log(data);
        
        // リプライに返信
        if (isMention && twUserId != BOT_ID && data.in_reply_to_screen_name == BOT_ID) {
            tweetReply('@' + twUserId + ' ' + 'それは' + getAdjective() + "ね！", replyId);
            //console.log("自分へのリプライ");
        }
        
        // あいさつ
        else if (text.match(/おはよ/) && twUserId != BOT_ID) {
            tweetReply('@' + twUserId + ' ' + 'おはよーo(^-^)o', replyId);
        }
        
        /*
        kuromoji.builder({ dicPath: "./node_modules/kuromoji/dist/dict/" }).build(function(err, tokenizer) {
            var path = tokenizer.tokenize(text);
            console.log(path);
        });
        */
    });
});

/*
 * 名詞取得
 */
var pre_noun_num = -1;
function getNoun()
{
    var dic = noun.noun_dic;
    var rnd = 0;
    do {
        rnd = Math.floor(Math.random() * dic.length);
    } while (rnd == pre_noun_num);
    pre_noun_num = rnd;
    return dic[rnd];
}

/*
 * 形容詞取得
 */
var pre_adj_num = -1;
function getAdjective()
{
    var dic = adj.adj_dic;
    var rnd = 0;
    do {
        rnd = Math.floor(Math.random() * dic.length);
    } while (rnd == pre_adj_num);
    pre_adj_num = rnd;
    return dic[rnd];
}

/*
 * 状態語
 */
function getStative()
{
    var dic = ["あっさり", "いらいら", "うっかり", "うろうろ", "うんざり", "がたがた", "がっかり", "がやがや", "からから",
               "がらがら", "がんがん", "ぎっしり", "きちんと", "きっちり", "きっぱり", "きらきら", "ぎりぎり", "くすくす",
               "ぐずぐず", "ぐっと", "くるくる", "ぐるぐる", "げっそり", "げらげら", "ごちゃごちゃ", "こっそり", "ころころ",
               "ごろごろ", "ざあざあ", "さっさと", "さっと", "ざっと", "ざらざら", "さらさら", "しっかり", "じっくり", "じっと",
               "じろじろ", "すっかり", "すっきり", "すっと", "すらすら", "ずらり", "ずるずる", "そっくり", "そっと", "そろそろ",
               "ぞろぞろ", "たっぷり", "だぶだぶ", "ちゃんと", "つるつる", "どきどき", "どっと", "どんどん", "にこにこ",
               "にやにや", "ぬるぬる", "ねばなば", "のろのろ", "のんびり", "はっかり", "ばったり", "はっと", "ばっと", "ばたばた",
               "はらはら", "ばらばら", "びっくり", "ぴかぴか", "ぴったり", "ふっくら", "ふと", "ふらふら", "ぶらぶら", "ぶるぶる",
               "ぺこぺこ", "ぺらぺら", "ぼうっと", "ほっと", "ぼろぼろ", "ぼんやり", "むかむか", "めちゃくちゃ", "もりもり",
               "ゆっくり", "よろよろ", "わくわく"];
    return dic[Math.floor(Math.random() * dic.length)];
}

/*
 * 顔文字
 */
function getEmoticon()
{
    var dic = ["(*>_<*)ﾉ", "(｡･ω･｡)", "(^･ｪ･^)", "ヾ(oゝω･o)ﾉ))", "ヾ(oﾟｘﾟo)ﾉ", "σ(馬ﾟдﾟ鹿)☆",
               "Σ(oﾟｪﾟ)", "Σ(*★UvO*)艸", "(ﾉ)^ω^(ヾ)", "(喜’v`*)"];
    return dic[Math.floor(Math.random() * dic.length)];
}
/*
 * ランダムツイート
 */
var pre_text_num = -1;
function randTweet()
{
    var text;
    var rnd;
    do {
        rnd = Math.floor(Math.random() * 29);
    } while (rnd == pre_text_num);
    pre_text_num = rnd;
    switch (rnd) {
        case 0: text = getNoun() + "って" + getAdjective() + "よねぇ"; break;
        case 1: text = getNoun() + "が" + getAdjective() + "らしいよ！"; break;
        case 2: text = getNoun() + "が食べたいなぁ"; break;
        case 3: text = "今日は" + getNoun() + "しようかな"; break;
        case 4: text = getNoun() + "って私苦手なのよねぇー"; break;
        case 5: text = getAdjective() + "ときは、やっぱり" + getNoun() + "だよね！"; break;
        case 6: text = "最近のマイブームは" + getNoun() + "だよ！"; break;
        case 7: text = getNoun() + "と" + getNoun() + "って似てるよね"; break;
        case 8: text = getAdjective() + getNoun() + "って" + getAdjective() + "よね！"; break;
        case 9: text = "あんなに" + getAdjective() + "なんて・・・"; break;
        case 10: text = getAdjective() + "のが好きなの"; break;
        case 11: text = "たまには" + getNoun() + "しないとね！"; break;
        case 12: text = "今日は" + getAdjective() + "気分だよ！"; break;
        case 13: text = getAdjective() + getNoun() + "ってどう思う？"; break;
        case 14: text = "今から" + getNoun() + "するよ！"; break;
        case 15: text = getNoun() + "を見たよ！"; break;
        case 16: text = getNoun() + "よかったよ！"; break;
        case 17: text = getAdjective() + "よぉ"; break;
        case 18: text = getNoun() + "と" + getNoun() + "は" + getNoun() + "なんだよ！"; break;
        case 19: text = getNoun() + "の特集を見たよ！"; break;
        case 20: text = getAdjective() + getNoun() + "と" + getAdjective() + getNoun() + "どっちが好き？"; break;
        case 21: text = getAdjective() + "私ってどうかな？"; break;
        case 22: text = getStative() + "だよぉ" + getEmoticon(); break;
        case 23: text = getStative() + "だね！"; break;
        case 24: text = getStative() + "な" + getNoun() + "っていいよね！"; break;
        case 25: text = getStative() + "な" + getNoun() + "に興味があるよ"; break;
        case 26: text = getStative() + "してるよ！"; break;
        case 27: text = getNoun() + "って" + getAdjective() + "けど" + getAdjective() + "んだよ！"; break;
        case 28: text = getNoun() + "が欲しいな♪"; break;
    }
    //console.log(text);
    tweetText(text);
}
