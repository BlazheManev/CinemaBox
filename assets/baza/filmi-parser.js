const express = require('express');
const puppeteer = require('puppeteer'); // verzija 18.1.0 na vajah
const app = express();
const fs = require('fs');


stran = "https://www.kolosej.si/filmi/A-Z/slovensko/"



app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let seznamFilmov = [];

    strani = [];
    await page.goto(stran)
    const naslovi = await page.$$('tr');

for (let i = 1;i<naslovi.length;i++){ //(const naslov in naslovi)... naslovi[i] ~~ naslov
    const naslova = await naslovi[i].$$("td")
    const zalink = await naslovi[i].$("td > a")

     const slo = await naslova[0].evaluate((n)=>n.innerText)
    const originalni = await naslova[1].evaluate((n)=>n.innerText)
    const link = await zalink.evaluate((n)=>n.getAttribute('href'))
    seznamFilmov.push({ "sloNaslov": slo, "originalniNaslov": originalni, "povezava": `https://www.kolosej.si${link}` })
    strani.push(`https://www.kolosej.si${link}`)

}
console.log(strani.length)

for (let i=0; i<strani.length;i++){    //
    await page.goto(strani[i])
    const vrsta = await page.$(".movie__data-top > .movie__genre")
    if(vrsta){seznamFilmov[i]['vrsta'] = await vrsta.evaluate((n)=>n.innerText)}
    const cas = await page.$(".movie__data-top > .movie__duration")
    if(cas){seznamFilmov[i]['cas'] = await cas.evaluate((n)=>n.innerText)}
    const drzava = await page.$(".movie__data-top > .movie__country > a")
    if(drzava){seznamFilmov[i]['drzava'] = await drzava.evaluate((n)=>n.innerText)}
    const jezik= await page.$(".movie__data-top > .movie__language")
    if(jezik){seznamFilmov[i]['jezik'] = await jezik.evaluate((n)=>n.innerText.slice(7))}

    const scenarij = await page.$(".movie__info > .movie__screenplay")
    if(scenarij){seznamFilmov[i]['scenarij'] = await scenarij.evaluate((n)=>n.innerText.slice(10))}
    const rezija= await page.$(".movie__info > .movie__director")
    if(rezija){seznamFilmov[i]['rezija'] = await rezija.evaluate((n)=>n.innerText.slice(8))}
    const igralci= await page.$(".movie__info > .movie__actors")
    if(igralci){seznamFilmov[i]['igralci'] = await igralci.evaluate((n)=>n.innerText.slice(8))}
    const slika= await page.$(".movie__info > .movie__data-top-image >.movie__image > img")
    if(slika){const s = await slika.evaluate((n)=>n.getAttribute("src"));seznamFilmov[i]['slika'] = `https://www.kolosej.si${s}`}
    const opis = await page.$(".movie__plot-outline")
    if(opis){seznamFilmov[i]['opis'] = await opis.evaluate((n)=>n.innerText)}

if(i%10==0){console.log(i/strani.length)}

}


    fs.writeFile("filmi.json", JSON.stringify(seznamFilmov), function (err) {
        if (err) {
            console.log(err);
        }
    });
    res.json(seznamFilmov);
    browser.close();
});





























app.listen(3000);