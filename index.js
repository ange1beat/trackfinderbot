
let fs = require('fs');
const sequelize = require('./db')
const UserModel = require('./models')
const TelegramApi = require('node-telegram-bot-api')



var Deezer = require('deezer-node-api');
var dz = new Deezer();



const token = '5435769025:AAFbWO_H6NOmuKQlGoe1WlGWbi5Un0_fDXU'

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








const {PythonShell} = require('python-shell');









//// database
let msgSendAll
let userS
let editSub


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

const adminPanel = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Создать рассылку', callback_data: 'sendAllUsers'}],
            [{text: 'Настроить обязательную подписку', callback_data: 'nessesarySub'}],
        ]
    })
}

const checkSubs = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Проверить подписку', callback_data: 'checkSub'}]
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
    {command: '/menu', description: 'Если пропала кнопка вызова меню'},
    // {command: '/inline', description: 'Как использовать Inline'},
])

//путь для скачивания
let albumName = []
let songName = []
let channelForSub = '@testmembernodejs'

let albumName2 = []
let songName2 = []
////

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log(e)
    }

    bot.on('message', async msg => {
        msgSendAll = msg.message_id
        editSub = msg.text
        const text2 = msg.text;
        let text = text2
        try {
            text = transliterate(text2)
        } catch (err) {
            return console.log('не смог затранслитить')
        }
        
        const chatId = msg.chat.id;
        
    
        if (text === '/menu') {
            
            const opts = {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    keyboard: [
                      [{text: '🌟МЕНЮ🌟', callback_data: 'menu'}],
                    ],
                }
            };
            
            bot.sendMessage(chatId, `Привет! Просто отправь мне название трека и/или имя исполнителя, я буду искать музыку`, opts)

            try {
                await UserModel.create({chatId})
            } catch(err) {
                return console.log('такой пользователь уже существует')
            }

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
        if (text === '/start') {
            return true
        }

        //админ панель
        if (text === '/adminpanel22808808') {
            userS = await UserModel.findAll()
            return bot.sendMessage(chatId, 'Добро пожаловать в админ панель!', adminPanel)
        }
        //отправка музла
        if (text === text) {
            
            dz.findTracks(text).then(function(result) {
                for (let i = 0; i < 5; i++) {
                    console.log(result.data[i].link)
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

    bot.on('callback_query', async msg => {
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
                    try {
                        await bot.sendAudio(chatId, way, {caption:'🤍@Findmusicx_bot'})
                    } catch(err) {
                        bot.sendMessage(chatId, 'Не удалось найти аудиофайл :C')
                        return console.log(err)
                    }
                    
                    try {
                        await fs.rmSync('./'+'musics/'+albumName[i], { recursive: true, force: true });
                    } catch(err) {
                        return console.log(err)
                    }
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
        if (data === 'sendAllUsers') {
            console.log(msgSendAll)
            for (let i = 0; i < userS.length; i++) {
                console.log(userS[i].chatId)
                bot.forwardMessage(userS[i].chatId, chatId, msgSendAll)
            }
            msgSendAll = null
            return console.log('рассылка завершена корректно')
        }
        if (data === 'nessesarySub') {
            channelForSub = editSub
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


let xtest 
let start2 = async () => {
    bot.on('message', async msg => {
        let schatId = msg.chat.id
        let sText = msg.text
        xtest = msg.from.id

        if (sText === '/start') {
            return bot.sendMessage(schatId, `Привет, подпишись на канал чтобы пользоваться ботом ${channelForSub}`, checkSubs)
        }
        return console.log('ok')
    })

    bot.on('callback_query', async msg => {
        const sdata = msg.data;
        const schatId = msg.message.chat.id;

        if (sdata === 'checkSub') {
            try {
                let chatMem = await bot.getChatMember(channelForSub, xtest)
                if (chatMem.status == 'member') {
                    console.log('member acess')
                    bot.sendMessage(schatId, 'Теперь можете пользоваться ботом! /menu - чтобы открыть меню')
                    return start()
                }
                else {
                    return bot.sendMessage(schatId, 'Ты не подписался!')
                }
            } catch (err) {
                return console.log('не получилось проверить подписку')
            } 
        }
    })
  return console.log('ok')
}

start2()
