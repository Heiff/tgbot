const { Bot ,Keyboard}  = require('grammy')
require('dotenv').config()
const bot = new Bot(process.env.TOKEN);
const id = '5762202354'

bot.command('start',async(ctx) => {
  await ctx.reply('salom',{
    reply_markup:new Keyboard().text('help').row().text('image').row().requestLocation('location').resized()
  })
})

bot.hears('help' ,async(ctx) =>{
await ctx.reply('bu bot test uchun')
})

bot.hears('image',async(ctx) =>{
  await ctx.replyWithPhoto(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKeRPJ6Cu_cdiLiDb_ffrn6r0oi09bJXoGyA&usqp=CAU",
      {
          caption:"<b>text uchun</b>",
          parse_mode:"HTML"
      }
  )
})

bot.on(':text',async(ctx) => {
    function transliterate(word){
        console.log(word);
        let answer = ""
        const ToLatin = {
          'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Ғ': 'Gʻ', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'J', 'З': 'Z',
          'И': 'I', 'Й': 'Y', 'К': 'K', 'Қ': 'Q', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
          'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'X', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '', 'Ы': 'I', 'Ь': '',
          'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ғ': 'gʻ', 'д': 'd', 'е': 'e',
          'ё': 'yo', 'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'қ': 'q', 'л': 'l', 'м': 'm', 'н': 'n',
          'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh',
          'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
      
        const ToCril = {
          'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'Gʻ': 'Ғ', 'D': 'Д', 'E': 'Е', 'Yo': 'Ё', 'J': 'Ж', 'Z': 'З',
          'I': 'И', 'Y': 'Й', 'K': 'К', 'Q': 'Қ', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р',
          'S': 'С', 'T': 'Т', 'U': 'У', 'F': 'Ф', 'X': 'Х', 'Ch': 'Ч', 'Sh': 'Ш', 'Sh': 'Щ', 'Yo': 'Ё', 'Ya': 'Я',
          'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'gʻ': 'ғ', 'd': 'д', 'e': 'е', 'yo': 'ё', 'j': 'ж', 'z': 'з',
          'i': 'и', 'y': 'й', 'k': 'к', 'q': 'қ', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р',
          's': 'с', 't': 'т', 'u': 'у', 'f': 'ф', 'x': 'х', 'ch': 'ч', 'sh': 'ш', 'sh': 'щ', 'yo': 'ё', 'ya': 'я'
        };
       
        let cril = ''
    
       for (i in word){
         if (word.hasOwnProperty(i)) {
           if (ToLatin[word[i]] === undefined){
             answer += word[i];
           } else {
             answer += ToLatin[word[i]];
           }
         }
       }
       if (word == answer) {
        for (i in word){
          if (word.hasOwnProperty(i)) {
            if (ToCril[word[i]] === undefined){
              cril += word[i];
            } else {
              cril += ToCril[word[i]];
            }
          }
        }
        ctx.api.sendMessage(ctx.message.chat.id,cril)
       }

       if (word != answer) {
        ctx.api.sendMessage(ctx.message.chat.id,answer)
       }
       
    }
    transliterate(ctx.message.text)
})


bot.on(':location',async(ctx) =>{
    const arr = [{name:"Xadra",latitude:41.324754 ,longitude:69.2453,dist:0},{name:"Chimboy",latitude:41.34681,longitude:69.215841,dist:0},{name:"chilonzor",latitude:41.285453 ,longitude:69.203738,dist:0}]
    const userLat = ctx.message.location.latitude
    const userLot = ctx.message.location.longitude
    const p = 0.017453292519943295;    
    const c = Math.cos;
    const getDistanceFromLatLonInKm = async() => {
        for (let i = 0; i < arr.length; i++) {
            const a = 0.5 - c((userLat - arr[i].latitude) * p)/2 + 
                c(arr[i].latitude * p) * c(userLat * p) * 
                (1 - c((userLot - arr[i].longitude) * p))/2;
        const R = 6371; 
       const dist = 2 * R * Math.asin(Math.sqrt(a)); 
       arr[i].dist += dist
        }
        const sorted = arr.sort((a,b) => a.dist - b.dist)
        await ctx.api.sendLocation(ctx.message.chat.id,sorted[0].latitude,sorted[0].longitude)
        await ctx.api.sendMessage(ctx.message.chat.id,Math.floor(sorted[0].dist) + "km sizga eng yaqin filialmz")
      }
      getDistanceFromLatLonInKm()
})


bot.on('message::bold',async(ctx) =>{
    await ctx.reply('text')
})

bot.start()