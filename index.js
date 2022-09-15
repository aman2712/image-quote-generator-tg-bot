import dotenv from 'dotenv'
import axios from 'axios'
import textToImage from 'text-to-image'
import fs from 'fs'
import { Bot, InputFile } from 'grammy'

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN);

async function generatePost() {
    const { data } = await axios.get('https://api.quotable.io/random')
    const dataUri = textToImage.generateSync(`${data.content}`, {
        customHeight: 1080,
        maxWidth: 1080,
        textAlign: 'center',
        verticalAlign: 'center',
        fontFamily: 'Glacial Indifference',
        margin: 20,
        fontPath: './fonts/GlacialIndifference.otf',
        fontSize: 60,
        lineHeight: 100
    });
    return { img: dataUri, caption: `Quote by ${data.author}.\n\n#quotes #motivational #inspirational #motivationalquotes #inspirationalquotes #quotestoliveby #quotestagram #motivationalquotesdaily #motivational_quotes #motivationalquoteoftheday #motivationalquotesforstudents` }
}

bot.on("message:text", async (ctx) => {
    const { img, caption } = await generatePost()
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    fs.writeFile("out.png", base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
        }
    });
    ctx.replyWithPhoto(new InputFile("out.png"), { caption })
})

bot.start();