// ==UserScript==
// @name         Stocks in One Basket
// @author       Flutterz
// @description  Displays stocks owned on stock bargain page
// @match        https://www.neopets.com/stockmarket.phtml?type=portfolio
// @match        https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true
// @match        https://www.neopets.com/stockmarket.phtml?type=list&bargain=true
// ==/UserScript==

const stocks = ["AAVL","ACFI","BB","BOTT","BUZZ","CHIA","CHPS","COFL","CYBU","DROO","EEEEE","FAER","FISH","HELT","HUW","KAUF","KBAT","KSON","LDSC","LUPE","MPC","MYNC","NAKR","NATN","PDSS","PEOP","POWR","SHRX","SKBD","SKEI","SMUG","SSS","STFP","SWNC","TAG","TNAH","TNPT","TPEG","TPP","TSRC","UNIB","VPTS","YIPP"];
const MySellPrice = 60;

function inURL(substr) {
    return document.URL.includes(substr);
}

function fetchAmount(){
    var bobby = document.getElementsByTagName("tr");
    var stockRecord = [];
    var currentMax = 0;
    var saleNotif = "";
    var ownedList = "";
    for (let i = 0; i < bobby.length; i++) {
        var boop = bobby[i].innerHTML.toString().indexOf("onclick=\"disclose");
        if (boop == 65){
            var nameIndex = bobby[i].innerHTML.toString().indexOf("?type=buy&amp;ticker=")+21;
            var stockName = bobby[i].innerHTML.toString().substring(nameIndex,nameIndex+5);
            if (stockName.indexOf("\"")>-1) stockName = stockName.substring(0,stockName.indexOf("\""));
            ownedList = ownedList + stockName + " ";
            var priceIndex = bobby[i].innerHTML.toString().indexOf("td align=\"center")+18;
            var stockAmount = bobby[i].innerHTML.toString().substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            var currentPrice = stockAmount.substring(0,stockAmount.indexOf("</td>"));
            if (currentPrice >= MySellPrice){
                saleNotif = saleNotif + stockName + " is ready to sell!!!<br>";
            }
            priceIndex = stockAmount.indexOf("td align=\"center")+18;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("td align=\"center")+19;
            stockAmount = stockAmount.substring(priceIndex);
            priceIndex = stockAmount.indexOf("\t");
            stockAmount = stockAmount.substring(0,priceIndex).replace(",","");
            stockRecord[stocks.indexOf(stockName)]=stockAmount;
        }


    }
    window.localStorage.setItem('stockCount', stockRecord);
    var notif = document.getElementsByClassName("content");
    saleNotif = "<center><p style=\"color:red\"><b>"+saleNotif+"</b></p></center>";
    console.log(ownedList);
    notif[0].innerHTML = notif[0].innerHTML.replace("<b>here</b></a>.<br>","<b>here</b></a>.<br>"+saleNotif);
}

function postAmount(){
    var stockRecord = [];
    var i = 0;
    var inRecord = window.localStorage.getItem('stockCount');
    var buyPrice = 15;
    var perkBar = document.getElementsByClassName("perkBar");
    if (perkBar[0]!=undefined){
        buyPrice = 10;
    }
    while (inRecord.indexOf(",")>-1){
        stockRecord[i] = parseInt(inRecord.substring(0,inRecord.indexOf(",")));
        inRecord = inRecord.substring(inRecord.indexOf(",")+1);
        i++;
    }
    stockRecord[i] = parseInt(inRecord);
    var bobby = document.getElementsByTagName("tr");
    var skip = true;
    for (let j = 0; j < bobby.length; j++) {
        var boop = bobby[j].innerHTML.toString().indexOf("?type=profile&amp;company");

        if (boop > -1){
            if (skip){
                skip = false;
            } else {

                bobby[j].innerHTML = bobby[j].innerHTML.replace("<b>","<i>");
                bobby[j].innerHTML = bobby[j].innerHTML.replace("<b>","<i>");
                bobby[j].innerHTML = bobby[j].innerHTML.replace("<b>","<i>");
                bobby[j].innerHTML = bobby[j].innerHTML.replace("<b>","<i>");
                bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","<b>");
                var nameIndex = bobby[j].innerHTML.toString().indexOf("?type=profile&amp;company")+21;
                var stockName = bobby[j].innerHTML.toString().substring(nameIndex,nameIndex+20);
                stockName = stockName.substring(stockName.indexOf("\">")+5);
                if (stockName.indexOf("<")>-1){
                    stockName = stockName.substring(0,stockName.indexOf("<"));
                }
                var volumeIndex = bobby[j].innerHTML.toString().indexOf("\" align=")+17;
                var volumeTemp = bobby[j].innerHTML.toString().substring(volumeIndex);
                var volumeIndex2 = volumeTemp.indexOf("<");
                var repVolume = bobby[j].innerHTML.toString().substring(volumeIndex-3,volumeIndex+volumeIndex2+3);
                var newVolume = stockRecord[stocks.indexOf(stockName)];
                if (isNaN(newVolume)){
                    bobby[j].innerHTML = bobby[j].innerHTML.replace(repVolume,"r\">Owned<br><b>0</b></t");
                } else {
                    bobby[j].innerHTML = bobby[j].innerHTML.replace(repVolume,"r\">Owned<br><b>"+newVolume+"</b></t");
                }
                var repLow = volumeTemp.substring(93);
                repLow = repLow.substring(repLow.indexOf("<i>"));
                var repLow2 = repLow.substring(3);
                var repPrice = repLow.substring(3,repLow.indexOf("</i>"));
                if (repPrice!=buyPrice) {
                    bobby[j].innerHTML = bobby[j].innerHTML.replace(repLow,repLow2);
                    bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","");
                    bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","");
                    bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","");
                } else {
                    bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","<b>");
                    bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","<b>");
                    bobby[j].innerHTML = bobby[j].innerHTML.replace("<i>","<b>");

                }

            }

        }

    }

}

function mainLoad(){
    if (inURL("bargain=true")){
        postAmount();
    } else {
        fetchAmount();
    }
}

mainLoad();
