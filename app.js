const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const shows = [
  "https://www.imdb.com/title/tt2359704/?ref_=nv_sr_srsg_0",
  "https://www.imdb.com/title/tt0877057/?ref_=tt_sims_tt_i_7",
  "https://www.imdb.com/title/tt1355642/?ref_=tt_sims_tt_i_1",
];

(async () => {
  try {
    let imdbData = [];
    for (let show of shows) {
      const response = await request({
        uri: show,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",

          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
        },
        gzip: true,
      });

      const $ = cheerio.load(response);
      const title = $(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.TitleBlock__Container-sc-1nlhx7j-0.hglRHk > div.TitleBlock__TitleContainer-sc-1nlhx7j-1.jxsVNt > h1"
      ).text();
      const rating = $(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.TitleBlock__Container-sc-1nlhx7j-0.hglRHk > div.RatingBar__RatingContainer-sc-85l9wd-0.hNqCJh.TitleBlock__HideableRatingBar-sc-1nlhx7j-4.bhTVMj > div > div:nth-child(1) > a > div > div > div.AggregateRatingButton__ContentWrap-sc-1ll29m0-0.hmJkIS > div.AggregateRatingButton__Rating-sc-1ll29m0-2.bmbYRW > span.AggregateRatingButton__RatingScore-sc-1ll29m0-1.iTLWoV"
      ).text();
      const summary = $(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.Hero__MediaContentContainer__Video-kvkd64-2.kmTkgc > div.Hero__ContentContainer-kvkd64-10.eaUohq > div.Hero__MetaContainer__Video-kvkd64-4.kNqsIK > div.GenresAndPlot__ContentParent-cum89p-8.bFvaWW.Hero__GenresAndPlotContainer-kvkd64-11.twqaW > p > span.GenresAndPlot__TextContainerBreakpointXL-cum89p-2.gCtawA"
      ).text();
      const releaseDate = $(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.TitleBlock__Container-sc-1nlhx7j-0.hglRHk > div.TitleBlock__TitleContainer-sc-1nlhx7j-1.jxsVNt > div.TitleBlock__TitleMetaDataContainer-sc-1nlhx7j-2.hWHMKr > ul > li:nth-child(2) > a"
      ).text();
      const genre = $(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.Hero__MediaContentContainer__Video-kvkd64-2.kmTkgc > div.Hero__ContentContainer-kvkd64-10.eaUohq > div.Hero__MetaContainer__Video-kvkd64-4.kNqsIK > div.GenresAndPlot__ContentParent-cum89p-8.bFvaWW.Hero__GenresAndPlotContainer-kvkd64-11.twqaW > div > a:nth-child(1) > span"
      ).text();
      const creator = $(
        "#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.Hero__MediaContentContainer__Video-kvkd64-2.kmTkgc > div.Hero__ContentContainer-kvkd64-10.eaUohq > div.Hero__MetaContainer__Video-kvkd64-4.kNqsIK > div.PrincipalCredits__PrincipalCreditsPanelWideScreen-hdn81t-0.iGxbgr > ul > li:nth-child(1) > div > ul > li > a"
      ).text();

      imdbData.push({
        title,
        rating,
        summary,
        releaseDate,
        genre,
        creator,
      });
    }

    const json2csvParser = new json2csv();
    const csv = json2csvParser.parse(imdbData);

    fs.writeFile("./imdb.csv", csv, "utf-8", function (err) {
      if (err) throw err;
      console.log("file saved");
    });
  } catch (error) {
    console.log(error);
  }
})();
