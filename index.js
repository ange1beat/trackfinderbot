const TelegramApi = require('node-telegram-bot-api')



var Deezer = require('deezer-node-api');
var dz = new Deezer();



const token = '5506186121:AAGrM3HDEPRCQ_PKNQ87HZ-1OC0NQp-7q6I'

const bot = new TelegramApi(token, {polling: true})

//QIWI




/////

var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

function transliterate(word){
  return word.split('').map(function (char) { 
    return a[char] || char; 
  }).join("");
}



/// отправка на питон








const {PythonShell} = require('python-shell')





let muz


////


const LastFM = require('last-fm')
const lastfm = new LastFM('2d4b23228d015d22e8b9b6b93f05f866', { userAgent: 'MyApp/1.0.0 (http://example.com)' })

const menuButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '🔎КАК ИСКАТЬ МУЗЫКУ🔎', callback_data: 'howFindMusic'}],
            // [{text: '💭ИНЛАЙН РЕЖИМ💭', callback_data: 'inlineMode'}],
            // [{text: '🌟МОИ ЗАГРУЗКИ🌟', callback_data: 'myDownloads'}],
            // [{text: '🟣ОТКЛЮЧИТЬ РЕКЛАМУ🟣', callback_data: 'donations'}],
            [{text: '❤️КОНТАКТНАЯ ИНФОРМАЦИЯ❤️', callback_data: 'otherBots'}],
        ]
    })
}

//поиск музла
let allData = []
let titleData3 = []
let linksData2 = []
let newkeyboard = []
let linksData = []
let trackButtons =  {
    reply_markup: JSON.stringify({
        inline_keyboard: newkeyboard
    })
}
let titleData = []

//скачали пользователи
let newkeyboard2 = []
let trackButtons2 = {
    reply_markup: JSON.stringify({
        inline_keyboard: newkeyboard2
    })
}
let titleData2 = []

//мои загрузки

let myDown = []

let myDownTracks = {
    reply_markup: JSON.stringify({
        inline_keyboard: myDown
    })
}

let myDown2 = []

bot.setMyCommands([
    {command: '/start', description: 'Если пропала кнопка вызова меню'},
    // {command: '/inline', description: 'Как использовать Inline'},
])

//путь для скачивания
let albumName = []
let songName = []

let albumName2 = []
let songName2 = []
////

const start = () => {
    bot.on('message', async msg => {
        const text2 = msg.text;
        let text = transliterate(text2)
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            const opts = {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    keyboard: [
                      [{text: '🌟МЕНЮ🌟', callback_data: 'menu'}],
                    ],
                }
            };

            return bot.sendMessage(chatId, `Привет! Просто отправь мне название трека и/или имя исполнителя, я буду искать музыку`, opts)
        }
        if (text === '/inline') {
            return bot.sendVideo(chatId, './inlineuse.mp4', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Inline - поиск🔎', switch_inline_query_current_chat: 'Morgenshtern'}]
                    ]
                }
            })

        }
        if (text === '🌟MENYU🌟') {
            return bot.sendMessage(chatId, 'МЕНЮ:', menuButtons)
        }
        //отправка музла
        if (text === text) {
            
            dz.findTracks(text).then(function(result) {
                for (let i = 0; i < 5; i++) {
                    let numOfSong = String(i)
                    newkeyboard.push([{text: result.data[i].title, callback_data: numOfSong}])
                    linksData.push(result.data[i].link)
                    titleData.push(result.data[i].title)

                    ///путь для скачки
                    albumName2.push(result.data[i].album.title + ' - ' + result.data[i].artist.name)
                    songName2.push(result.data[i].title + ' - ' + result.data[i].artist.name + ' (128).mp3')
                    
                }
                trackButtons = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: newkeyboard
                    })
                }
                linksData2 = linksData
                titleData3 = titleData

                ///путь
                albumName = albumName2
                songName = songName2
                
                bot.sendMessage(chatId, `Найденные треки по запросу ${text}:`, trackButtons)
                newkeyboard = []
                linksData = []
                titleData = []

                albumName2 = []
                songName2 = []
                
            });
        }
        
        //отправка музла
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const message_id = msg.message.message_id
        bot.deleteMessage(chatId, message_id)
        
        //find tracks
        for (let i = 0; i < titleData3.length; i++) {
            let way = './'+'musics'+'/'+albumName[i]+'/'+songName[i]
            if (data == i) {
                const pyshell = new PythonShell('downloadMusic.py');
                pyshell.send(linksData2[i]);
                pyshell.on('message', function (message) {
                  console.log(message);
                });
                pyshell.end(async function (err,code,signal) {
                    console.log('finished');
                    await bot.sendAudio(chatId, way, {caption:'🤍@muzBotAngelBeatbot'})
                    let fs = require('fs');
                    await fs.rmSync('./'+'musics/'+albumName[i], { recursive: true, force: true });
                  });
                
                // bot.answerCallbackQuery(msg.id, '⏳Идет скачивание...')
                bot.sendMessage(chatId, '⏳Идет скачивание...')
                
                bot.deleteMessage(chatId, message_id)
            }
        }

        if (data === 'menu') {
            bot.sendMessage(chatId, 'МЕНЮ:')
        }

        if (data === 'myDownloads') {
            bot.sendMessage(chatId, 'Твои скачанные треки:', myDownTracks)
        }

        if (data === 'howFindMusic') {
            bot.sendMessage(chatId, 'Просто вводи название трека или имя исполнителя (или и то, и другое) я сделаю всё остальное! 😉\n\nЕсли бот не находит музыку - скорее всего ты вводишь название или имя исполнителя с опечаткой, пожалуйста, проверь свой запрос ещё раз.') 
        }
        if (data === 'inlineMode') {
            bot.sendVideo(chatId, './inlineuse.mp4', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Inline - поиск🔎', switch_inline_query_current_chat: 'Morgenshtern'}]
                    ]
                }
            })
        }
    })

    // bot.on('inline_query', query => {
    //     const results = []
    //     for (let i = 0; i < 5; i++) {
    //         results.push({
    //             type: 'article',
    //             id: i.toString(),
    //             title: 'Title' + i,
    //             input_message_content: {
    //                 message_text: `Article #${i+1}`
    //             }
    //         })
    //     }
    //     bot.answerInlineQuery(query.id, results, {
    //         cache_time: 0
    //     })
    // })
}

start()