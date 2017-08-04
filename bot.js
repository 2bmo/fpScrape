/**
 * Created by valerie on 13.06.17.
 */
var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app     = express(),
    TelegramBot = require('node-telegram-bot-api');

// server
app.get('./', function (req, res) {
    res.send('Server is up');
});

app.listen(process.env.PORT || 8081);

exports = module.exports = app;

// scrapping request
var refreshJson = setInterval(function() {
    url = 'https://funpay.ru/lots/9/';

    request(url, function(error, response, html) {

        if (!error) {
            var $ = cheerio.load(html);

            var json = {accounts: []};

            var linesNum = $('tbody').children.length;
            for (var i = 0; i < linesNum; i++) {
                $("tbody tr").filter(function () {

                    var account, offerLink, server, race, wear, descr, price, lvl, prof;

                    offerLink = $(this).attr("data-href");

                    if ($(this).attr("data-server") == '40') {
                        server = 'Gran Kain';
                    } else if ($(this).attr("data-server") == '41') {
                        server = 'Shillen';
                    } else {
                        server = 'no data QQ';
                    }

                    race = $(this).attr("data-f-race");

                    wear = $(this).attr("data-f-wear");

                    descr = $(this).find('.wrap').text().split(',');


                    for (var i = 0; i < descr.length; i++) {
                        if (descr[i].toLowerCase().indexOf('уровень') >= 0) {
                            lvl = parseInt(descr[i].slice(0, -8));
                        }
                    }

                    function getText(AInputText, AReplaceText) {
                        var VRegExp = new RegExp(/[^a-zа-я]/gi);
                        return AInputText.replace(VRegExp, AReplaceText);
                    }

                    var valRaw = getText(descr[0], ' ').toLowerCase();


                    if (new RegExp('over|ower|овер').test(valRaw)) {
                        prof = 'Overlord';
                    } else if (new RegExp('hawk|хавк|стрелок').test(valRaw)) {
                        prof = 'Hawk';
                    } else if (new RegExp('wc|warc|вк|варк|вестник войны').test(valRaw)) {
                        prof = 'Warc';
                    } else if (new RegExp('destr|дестр|разрушитель').test(valRaw)) {
                        prof = 'Dest';
                    } else if (new RegExp('tyran|tiran|тир|отшельник|туран|кастет|монах').test(valRaw)) {
                        prof = 'Tyr';
                    } else if (new RegExp('проповедник|пп|pp|рр|prophet').test(valRaw)) {
                        prof = 'PP';
                    } else if (new RegExp('bp|бп|биш|bishop').test(valRaw)) {
                        prof = 'BP';
                    } else if (new RegExp('sorc|сорк').test(valRaw)) {
                        prof = 'Sorc';
                    } else if (new RegExp('necr|некр').test(valRaw)) {
                        prof = 'Necr';
                    } else if (new RegExp('кот|колдун|warlock').test(valRaw)) {
                        prof = 'Cat';
                    } else if (new RegExp('th|treasure hunter|тх').test(valRaw)) {
                        prof = 'TH';
                    } else if (new RegExp('pal|пал').test(valRaw)) {
                        prof = 'Paladin';
                    } else if (new RegExp('glad|глад').test(valRaw)) {
                        prof = 'Glady';
                    } else if (new RegExp('wl|вл|warlord|копейщик').test(valRaw)) {
                        prof = 'WL';
                    } else if (new RegExp('ee|ее|еешка|elven elder').test(valRaw)) {
                        prof = 'EE';
                    } else if (new RegExp('mm|ss|sps|мм|сс|спс|mystic muse|spell singer').test(valRaw)) {
                        prof = 'MM';
                    } else if (new RegExp('sws|sword singer|свс|менестрель|виртуоз').test(valRaw)) {
                        prof = 'SWS';
                    } else if (new RegExp('es|ес|последователь стихий|elemental summoner|конь').test(valRaw)) {
                        prof = 'ES';
                    } else if (new RegExp('pw|plains walker|пв').test(valRaw)) {
                        prof = 'PW';
                    } else if (new RegExp('spoil|спойл|споил|охотник за наградой').test(valRaw)) {
                        prof = 'Spoil';
                    } else if (new RegExp('craft|крафт|кузя|кузнец').test(valRaw)) {
                        prof = 'Craft';
                    } else if (new RegExp('se|ше|се|шилка|shilien elder|shillen elder|shilen elder|оракул шилен').test(valRaw)) {
                        prof = 'SE';
                    } else if (new RegExp('sh|сх|spellhowler|заклинатель ветра').test(valRaw)) {
                        prof = 'SH';
                    } else if (new RegExp('рыцарь евы|tk|temple knight|тк').test(valRaw)) {
                        prof = 'TK';
                    } else if (new RegExp('ps|phs|fs|фс|fantom summoner|phantom summoner|фантом').test(valRaw)) {
                        prof = 'FS';
                    } else if (new RegExp('bd|бд|blade dancer|танцор смерти|бдшка').test(valRaw)) {
                        prof = 'BD';
                    } else if (new RegExp('dark avenger|да|da').test(valRaw)) {
                        prof = 'DA';
                    } else if (new RegExp('sk|shillen knight|shilen knight|shilien knight|шк').test(valRaw)) {
                        prof = 'SK';
                    } else if (new RegExp('fr|phantom ranger|fantom ranger|фр').test(valRaw)) {
                        prof = 'FR';
                    } else if (new RegExp('aw|aw||abyss walker|ав|ав|').test(valRaw)) {
                        prof = 'AW';
                    } else if (new RegExp('sr|silver ranger|сырок|сыр|ср|серебрянный|серебряный').test(valRaw)) {
                        prof = 'SR';
                    } else {
                        prof = 'idk, go check site: https://funpay.ru/lots/9';
                    }


                    var priceStr = $(this).find('.text-right div').text();
                    price = parseInt(priceStr.slice(0, -2));

                    account = {
                        server: server,
                        race: race,
                        descr: descr,
                        prof: prof,
                        lvl: lvl,
                        wear: wear,
                        price: price,
                        offerLink: offerLink
                    };

                    json.accounts.push(account);
                });
            }

        }
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            // console.log('JSON created'); // test
        });
    });

}, 1440000); // 1440000 - 4h


//bot goes here
const token = '322243938:AAE6HVw08JDmHJfli6RzFfnYTYLibSimlz0',
      bot = new TelegramBot(token, {polling: true});

var neededSever;

bot.onText(/\/scrape (.+)/, function (msg, match) {
    neededSever = match[1].toLowerCase();
    const raceBtns = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Human', callback_data: 'human' }],
                [{ text: 'Elf', callback_data: 'elf' }],
                [{ text: 'Dark Elf', callback_data: 'delf' }],
                [{ text: 'Orc', callback_data: 'orc' }],
                [{ text: 'Dwarf', callback_data: 'dwarf' }]
            ]
        })
    };
    bot.sendMessage(msg.chat.id, 'Please, select race', raceBtns);
});


bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const replyParams = {
        chat_id: msg.chat.id,
        message_id: msg.message_id
    };

    const humanProfBtns = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Phoenix Knight', callback_data: 'Paladin' }],
                [{ text: 'Dark Avenger', callback_data: 'DA' }],
                [{ text: 'Warlord', callback_data: 'WL' }],
                [{ text: 'Gladiator', callback_data: 'Glady' }],
                [{ text: 'Treasure Hunter', callback_data: 'TH' }],
                [{ text: 'Hawker', callback_data: 'Hawk' }],
                [{ text: 'Sorcerer', callback_data: 'Sorc' }],
                [{ text: 'Necromancer', callback_data: 'Necr' }],
                [{ text: 'Warlock', callback_data: 'Cat' }],
                [{ text: 'Bishop', callback_data: 'BP' }],
                [{ text: 'Prophet', callback_data: 'PP' }]
            ]
        })
    };
    const elfProfBtns = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Temple Knight', callback_data: 'TK' }],
                [{ text: 'Sword Singer', callback_data: 'SWS' }],
                [{ text: 'Plains Walker', callback_data: 'PW' }],
                [{ text: 'silver Ranger', callback_data: 'SR' }],
                [{ text: 'Mystic Muse', callback_data: 'MM' }],
                [{ text: 'Elemental summoner', callback_data: 'ES' }],
                [{ text: 'Elven Elder', callback_data: 'EE' }]
            ]
        })
    };
    const delfProfBtns = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Shillen Knight', callback_data: 'SK' }],
                [{ text: 'Blade Dancer', callback_data: 'BD' }],
                [{ text: 'Abyss Walker', callback_data: 'AW' }],
                [{ text: 'Phantom Ranger', callback_data: 'FR' }],
                [{ text: 'Spellhowler', callback_data: 'SH' }],
                [{ text: 'Phantom Summoner', callback_data: 'FS' }],
                [{ text: 'Shillen Elder', callback_data: 'SE' }]
            ]
        })
    };
    const orcProfBtns = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Destroyer', callback_data: 'Dest' }],
                [{ text: 'Tyrant', callback_data: 'Tyr' }],
                [{ text: 'Overlord', callback_data: 'Overlord' }],
                [{ text: 'Warcryer', callback_data: 'Warc' }]
            ]
        })
    };
    const dwarfProfBtns = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Spoiler', callback_data: 'Spoil' }],
                [{ text: 'Сraftsman', callback_data: 'Craft' }]
            ]
        })
    };


    if (action == 'human') {
        bot.editMessageText('So you are interested in a human race...', replyParams);
        bot.sendMessage(msg.chat.id, 'Now let\'s define profession', humanProfBtns);
    } else if (action == 'elf') {
        bot.editMessageText('So you need an elf...', replyParams);
        bot.sendMessage(msg.chat.id, 'Now let\'s define profession', elfProfBtns);
    } else if (action == 'delf') {
        bot.editMessageText('So you need a dark elf...', replyParams);
        bot.sendMessage(msg.chat.id, 'Now let\'s define profession', delfProfBtns);
    } else if (action == 'orc') {
        bot.editMessageText('So you need a greeny guy...', replyParams);
        bot.sendMessage(msg.chat.id, 'Now let\'s define profession', orcProfBtns);
    } else if (action == 'dwarf') {
        bot.editMessageText('So you like small folks...', replyParams);
        bot.sendMessage(msg.chat.id, 'Now let\'s define profession', dwarfProfBtns);
    }

    var info = JSON.parse(fs.readFileSync('./output.json', 'utf-8')),
        reply = '';
    if (action == 'Paladin') {
        if (neededSever == 'gk' || neededSever == 'gran kain') {
            var j = 1;
            for (var i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Paladin') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Paladins on sell:\n' + reply, replyParams);
        } else if (neededSever == 'shi' || neededSever == 'shillen') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Paladin') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Paladins on sell:\n' + reply + '\n' +neededSever, replyParams);
        }

    }
    if (action == 'DA') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'DA') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about DA\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'DA') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about DA\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'WL') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'WL') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about WL\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'WL') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about WLs on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Glady') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Glady') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Gladiators on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Glady') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Gladiators on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'TH') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'TH') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about TH\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'TH') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about TH\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Hawk') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Hawk') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Hawk\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Hawk') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Hawk\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Sorc') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Sorc') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Sorcerers on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Sorc') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Sorcerers on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Necr') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Necr') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Necromancers on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Necr') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Necromancers on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Cat') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Cat') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Warlocks on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Cat') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Warlocks on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'BP') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'BP') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about BP\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'BP') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about BP\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'PP') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'PP') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PP\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'PP') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PP\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'TK') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'TK') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about TK\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'TK') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about TK\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'SWS') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'SWS') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SWS\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'SWS') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SWS\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'PW') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'PW') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Pw\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Pw') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PW\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'SR') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'SR') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SR\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'SR') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SR\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'MM') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'MM') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about MM\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'MM') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about MM\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'ES') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'ES') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about ES\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'ES') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about ES\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'EE') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'EE') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about EE\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'EE') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about EE\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'SK') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'SK') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SK\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'SK') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SK\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'BD') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'BD') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about BD\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'BD') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about BD\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'AW') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'AW') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about AW\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'AW') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about AW\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'FR') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'FR') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PR\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'FR') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PR\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'SH') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'SH') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SH\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Sh') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SH\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'FS') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'FS') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PS\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'FS') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about PS\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'SE') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'SE') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SE\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'SE') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about SE\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Dest') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Dest') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Destroyers on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Dest') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Destroyers on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Tyr') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Tyr') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Tyrants on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Tyr') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Tyrants on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Overlord') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Overlord') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Overlords on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Overlord') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Overlords on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Warc') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Warc') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Warc\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Warc') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Warc\'s on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Spoil') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Spoil') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Spoilers on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Spoil') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Spoilers on sell:\n' + reply, replyParams);
        }

    }
    if (action == 'Craft') {
        if (neededSever == 'gk') {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Gran Kain') {
                    if (info.accounts[i].prof == 'Craft') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Craft\'s on sell:\n' + reply, replyParams);
        } else {
            j = 1;
            for (i in info.accounts) {
                if (info.accounts[i].server == 'Shillen') {
                    if (info.accounts[i].prof == 'Craft') {
                        reply += j + '. ' + info.accounts[i].prof + ', ' + info.accounts[i].lvl + ', ' + info.accounts[i].wear + ', ' + info.accounts[i].price + 'р. - ' + info.accounts[i].offerLink +'\n';
                        j++;
                    }
                }
            }
            bot.editMessageText('Here is your info about Craft\'s on sell:\n' + reply, replyParams);
        }

    }
});

//non-official command :3
bot.onText(/\/ngup/, function onSecretText(msg) {
    bot.sendPhoto(msg.chat.id, 'https://sd.keepcalm-o-matic.co.uk/i/keep-calm-and-eat-salad-71.png');
});