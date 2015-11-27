const BOT_ID = "moturoid";
var twitter = require('twitter');
var settings = require('./settings');
require('date-utils');
var noun = require('./dict/noun_dic');
var adj = require('./dict/adj_dic');
var verb = require('./dict/verb_dic');
//var kuromoji = require("kuromoji");

var bot = new twitter({
	consumer_key        : settings.consumer_key,
	consumer_secret     : settings.consumer_secret,
	access_token_key    : settings.access_token_key,
    access_token_secret : settings.access_token_secret
});

//console.log(createReplyText("dfofkds"));
//randTweet();
console.log("noun " + noun.noun_dic.length);
console.log("adj  " + adj.adj_dic.length);
console.log("verb " + verb.verb_dic.length);
//console.log(getVerb());
/*
 * 
 */
setInterval(function() {
    randTweet();              // ランダムにツイート
}, 3600000);                  // 一時間毎
// }, 1800000);               // 30分毎
//}, 600000);                 // 10分毎
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
        var replyStr = data.text.replace(new RegExp('^@' + BOT_ID + ' '), '');
        var isMention = (data.in_reply_to_user_id !== null);
        var replyId = data.id_str;
        
        // リプライに返信
        if (isMention && twUserId != BOT_ID && data.in_reply_to_screen_name == BOT_ID) {
            var replyText = createReplyText(replyStr);
            tweetReply('@' + twUserId + ' ' + replyText, replyId);
        }
        
        // あいさつ
        else if (text.match(/おはよ/) && twUserId != BOT_ID) {
            tweetReply('@' + twUserId + ' ' + 'おはよー' + getEmoticon(), replyId);
        }
        else if (text.match("おやすみ|寝る|寝ます") && twUserId != BOT_ID) {
            tweetReply('@' + twUserId + ' ' + 'おやすみー' + getEmoticon(), replyId);
        }
        else if (text.match("もつろいど|モツロイド") && twUserId != BOT_ID) {
            tweetReply('@' + twUserId + ' ' + 'お呼びですか？' + getEmoticon(), replyId);
        }
        
        /*
        kuromoji.builder({ dicPath: "./node_modules/kuromoji/dist/dict/" }).build(function(err, tokenizer) {
            var path = tokenizer.tokenize(text);
            //console.log(path);
            for (var i = 0; i < path.length; i++) {
                console.log(path[i].surface_form + " " + path[i].pos);
            }
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
 * 動詞取得
 */
function getVerb()
{
    return verb.verb_dic[Math.floor(Math.random() * verb.verb_dic.length)];
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
               "Σ(oﾟｪﾟ)", "Σ(*★UvO*)艸", "(ﾉ)^ω^(ヾ)", "(喜’v`*)", "U^ェ^U", "(-ω-*)",
               "(._.*)", "(⌒∇⌒*｡)", "(･-･`*", "⊂(･ω･*)∩", "　ﾟωﾟ)", "(ﾟﾛﾟ;", "(*ﾟ□ﾟ)",
               "(*･д･*)"];
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
        rnd = Math.floor(Math.random() * 32);
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
        case 14: text = "今から" + getNoun() + "を" + getVerb() + "よ！"; break;
        case 15: text = getNoun() + "を見たよ！"; break;
        case 16: text = getNoun() + "よかったよ！"; break;
        case 17: text = getAdjective() + "よぉ" + getEmoticon(); break;
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
        case 29: text = getNoun() + "を" + getVerb() + "よ！" + getEmoticon(); break;
        case 30: text = getNoun() + "を" + getVerb() + "のが流行ってるらしいよ！" + getEmoticon(); break;
        case 31: text = "ご注文は" + getNoun() + "ですか？"; break;
        case 32: text = "わたし何もあげられるものないから" + getNoun() + "を" + getVerb() + "よ！"; break;
    }
    //console.log(text);
    tweetText(text);
}

/*
 * リプライ用のテキスト生成
 */
function createReplyText(text)
{
    //---- 呼びかけ
    if (text.match("^あの$|^ねえ$|^よう$|^おい$|^やあ$|^もつろいど$|^モツロイド$")) {
        var arr = ["どうしました？", "どうしたの？", "お呼びですか？", "はい", "んー？"];
        return arr[Math.floor(Math.random() * arr.length)] + getEmoticon();
    }
    //---- 同意
    if (text.match("ね？$|だね$|だよね$|ない？$|ですか？$|かな？")) {
        var arr = ["うん！", "違うよ！", "そうなの？", "そうかも！", "だよねー"];
        return arr[Math.floor(Math.random() * arr.length)] + getEmoticon();
    }
    //---- 質問
    if (text.match("好き")) {
        return getNoun() + "が好きだよ！";
    }
    if (text.match("元気|体調|気分")) {
        var arr = ["元気だよ！", "いい感じだよ！", "普通かな", "眠いよ～"];
        return arr[Math.floor(Math.random() * arr.length)] + getEmoticon();
    }
    //---- 時間
    if (text.match("何時|時間")) {
        var dt = new Date();
        return "今は" + dt.toFormat("HH24時MI分") + "だよ！";
    }
    //---- こんばんは
    if (text.match("こんばんは")) {
        var arr = ["こばゎ ヾ(*´□｀)ﾉﾞ ぁああん~☆", "((o´ω｀o)ﾉ.｡ﾟ:;｡+･;ｺﾝﾊﾞﾝﾜ!! ｡.:*･ﾟ",
                   "εミ(*b´З`)bｺﾝﾊﾞﾝﾜｰ♪", "(*･З･)ﾉ(*-∀-)ﾉこんばんわぁ♪"];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    //---- 謝る
    if (text.match("うざ|うるさ|うぜ|うるせ|は？|だまれ")) {
        return "ごめんなさい！！m(｡_｡；))m";
    }
    var arr = [getAdjective() + "ね！", getNoun() + "を" + getVerb() + "のがいいよ！"];
    return arr[Math.floor(Math.random() * arr.length)];    
}
