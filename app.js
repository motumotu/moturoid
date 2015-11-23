const BOT_ID = "moturoid";
var twitter = require('twitter');
var settings = require('./settings');
require('date-utils');
var noun = require('./noun_dic');
//var kuromoji = require("kuromoji");

var bot = new twitter({
	consumer_key        : settings.consumer_key,
	consumer_secret     : settings.consumer_secret,
	access_token_key    : settings.access_token_key,
    access_token_secret : settings.access_token_secret
});

randTweet();
/*
 * 
 */
setInterval(function() {
    randTweet();              // ランダムにツイート
}, 600000);

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
            tweetReply('@' + twUserId + ' ' + 'それは' + getAdjective() + "ね！", replyId);
        }
        // あいさつ
        else if (text.match(/おはよ/)) {
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
function getNoun()
{
    var dic = noun.noun_dic;
    return dic[Math.floor(Math.random() * dic.length)];
}

/*
 * 形容詞取得
 */
function getAdjective()
{
    var dic = ["嬉しい", "楽しい", "苦しい", "つらい", "悲しい", "恐ろしい", "寂しい", "面白い", "凄い", "強い", "弱い", "偉い", "かわいい", "暑い", "甘い", "荒い", "軽い", "重い", "速い", "遅い", "丸い", "臭い", "寒い", "美しい", "白い", "赤い", "青い", "黒い", "黄色い", "美味しい", "美味しくない", "悪い", "正しい", "渋い", "若い", "太い", "細い", "怪しい", "うるさい", "おかしい", "厳しい", "悔しい", "詳しい", "そこはかとない", "空恐ろしい", "かたじけない", "おとなしい」", "こうばしい", "騒がしい", "しんどい", "大きい", "小さい", "かわいくない", "楽しくない", "苦しくない", "辛くない", "末恐ろしい",
    "辛抱強い", "忍耐強い", "明るい", "痛い", "近い", "遠い", "はっきりしない", "きつい", "新しい", "古い", "高い", "安い", "広い", "狭い", "いい", "よくない", "頭の良い", "素晴らしい", "ひどい", "多い", "少ない", "酷い", "めったにしない"];
    return dic[Math.floor(Math.random() * dic.length)];
}

/*
 * 状態語
 */
function getStative()
{
    var dic = ["あっさり", "いらいら", "うっかり", "うろうろ", "うんざり", "がたがた", "がっかり", "がやがや", "からから", "がらがら", "がんがん", "ぎっしり", "きちんと", "きっちり", "きっぱり", "きらきら", "ぎりぎり", "くすくす", "ぐずぐず", "ぐっと", "くるくる", "ぐるぐる", "げっそり", "げらげら", "ごちゃごちゃ", "こっそり", "ころころ", "ごろごろ", "ざあざあ", "さっさと", "さっと", "ざっと", "ざらざら", "さらさら", "しっかり", "じっくり", "じっと", "じろじろ", "すっかり", "すっきり", "すっと", "すらすら", "ずらり", "ずるずる", "そっくり", "そっと", "そろそろ",
    "ぞろぞろ", "たっぷり", "だぶだぶ", "ちゃんと", "つるつる", "どきどき", "どっと", "どんどん", "にこにこ", "にやにや", "ぬるぬる", "ねばなば", "のろのろ", "のんびり", "はっかり", "ばったり", "はっと", "ばっと", "ばたばた", "はらはら", "ばらばら", "びっくり", "ぴかぴか", "ぴったり", "ふっくら", "ふと", "ふらふら", "ぶらぶら", "ぶるぶる", "ぺこぺこ", "ぺらぺら", "ぼうっと", "ほっと", "ぼろぼろ", "ぼんやり", "むかむか", "めちゃくちゃ", "もりもり", "ゆっくり", "よろよろ", "わくわく"];
    return dic[Math.floor(Math.random() * dic.length)];
}

/*
 * 顔文字
 */
function getEmoticon()
{
    var dic = ["(*>_<*)ﾉ", "(｡･ω･｡)", "(^･ｪ･^)"];
    return dic[Math.floor(Math.random() * dic.length)];
}
/*
 * ランダムツイート
 */
function randTweet()
{
    var text;
    var rnd = Math.floor(Math.random() * 29);
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
        case 28: text = geNoun() + "が欲しいな♪"; break;
    }
    tweetText(text);
}
