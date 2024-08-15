// ==UserScript==
// @name         Stocks in One Basket
// @version      1.05
// @author       Flutterz
// @description  Displays stocks owned on stock bargain page
// @match        https://www.neopets.com/stockmarket.phtml?type=portfolio
// @match        https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true
// @match        https://www.neopets.com/stockmarket.phtml?type=list&bargain=true
// @match        https://www.neopets.com/stockmarket.phtml?type=buy*
// ==/UserScript==

const stocks = ["AAVL","ACFI","BB","BOTT","BUZZ","CHIA","CHPS","COFL","CYBU","DROO","EEEEE","FAER","FISH","HELT","HUW","KAUF","KBAT","KSON","LDSC","LUPE","MPC","MYNC","NAKR","NATN","PDSS","PEOP","POWR","SHRX","SKBD","SKEI","SMUG","SSS","STFP","SWNC","TAG","TNAH","TNPT","TPEG","TPP","TSRC","UNIB","VPTS","YIPP"];
const MySellPrice = 60;

mainLoad();


function fetchAmount(){
    var bobby = document.getElementsByTagName("tr");
    var stockRecord = [];
    var saleNotif = "";
    var ownedList = "";
    let stockRows = document.querySelectorAll('td:nth-child(9)');
    for (let i = 1; i < stockRows.length; i++){
        let thisRow = stockRows[i].parentElement;
        let stockAmount = thisRow.children[5].innerText.replaceAll(",","");
        let stockName = thisRow.children[1].innerText;
        let currentPrice = thisRow.children[3].innerText;
        stockName = stockName.substring(0,stockName.indexOf("\n"));
        ownedList = ownedList + stockName + " ";
        stockRecord[stocks.indexOf(stockName)]=stockAmount;
        if (currentPrice >= MySellPrice){
                saleNotif = saleNotif + stockName + " is ready to sell!!!<br>";
        }
        thisRow.children[1].children[2].remove();
        let btn = document.createElement("div");
        let tab = thisRow.children[0].children[0];
        btn.innerHTML = "<button style=\"position: relative; top: 5px; font-size: 95%;\" type=\"button\"><b>Sell All</b></button>";
        btn.onclick = () => {
            fillSell(thisRow.parentElement.children[1+(i*2)],tab);
        };
        thisRow.children[1].append(btn);
    }
    window.localStorage.setItem('stockCount', stockRecord);
    let div = document.createElement("div");
    div.innerHTML="<center><p style=\"color:red\"><b>"+saleNotif+"</b></p></center>";
    console.log(ownedList);
    stockRows[0].parentElement.parentElement.parentElement.before(div);
}


function buyMenu(){
    let buyBox = document.getElementsByName("amount_shares")[0];
    buyBox.value = 1000;
    let tickerBox = document.getElementsByName("ticker_symbol")[0];
    let priceList = document.getElementsByTagName("marquee")[0].children;
    for (let i = 0; i < priceList.length; i++){
        let stockName = priceList[i].innerText.substring(0,priceList[i].innerText.indexOf(" "));
        if (stockName == tickerBox.value){
            let stockPrice = priceList[i].innerText.substring(priceList[i].innerText.indexOf(" ")+1);
            stockPrice = stockPrice.substring(0,stockPrice.indexOf(" "));
            var buyPrice = 15;
            var perkBar = document.getElementsByClassName("perkBar");
            if (perkBar[0]!=undefined){
                buyPrice = 10;
            }
            if (stockPrice != buyPrice){
                let div = document.createElement("div");
                div.innerHTML="<center>"+stockName+" price: "+stockPrice+"</center>";
                div.style="font-weight: bold; color:red; font-size:150%";
                tickerBox.parentElement.parentElement.parentElement.parentElement.before(div);
            }
            break;
        }
    }

}

function postAmount(){
    var stockRecord = [];
    var i = 0;
    var inRecord = window.localStorage.getItem('stockCount');
    var buyPrice = 15;
    var perkBar = document.getElementsByClassName("perkBar");
    let buyables = 0;
    if (perkBar[0]!=undefined){
        buyPrice = 10;
    }
    let displayStyle = document.createElement("style");
    displayStyle.innerHTML =`
     .stockBasket{
            display:none;
     }
     `;
    document.head.appendChild(displayStyle);
    while (inRecord.indexOf(",")>-1){
        stockRecord[i] = parseInt(inRecord.substring(0,inRecord.indexOf(",")));
        inRecord = inRecord.substring(inRecord.indexOf(",")+1);
        i++;
    }
    stockRecord[i] = parseInt(inRecord);
    let tableRows = document.querySelectorAll('td:nth-child(7)');
    for (let i = 1; i < tableRows.length; i++){
        let thisRow = tableRows[i].parentElement;
        let stockName = thisRow.children[1].innerText;
        let stockPrice = thisRow.children[5].innerText;
        if (stockPrice != buyPrice){
            thisRow.classList.add("stockBasket");
            thisRow.children[4].innerHTML = thisRow.children[4].innerHTML.replace("<b>","");
            thisRow.children[5].innerHTML = thisRow.children[5].innerHTML.replace("<b>","");
            thisRow.children[6].innerHTML = thisRow.children[6].innerHTML.replace("<b>","");
        } else {
            buyables++;
        }
        let ind = stocks.indexOf(stockName);
        let numOwned = stockRecord[ind];
        if (isNaN(numOwned))numOwned=0;
        thisRow.children[3].outerHTML = "<td bgcolor=\"#eeeeff\" align=\"center\">Owned:<br><b>"+numOwned+"</b></td>";
        let link = thisRow.children[1].children[0].outerHTML;
        link = "<a href=\"stockmarket.phtml?type=buy&ticker="+thisRow.children[1].innerText+"\">"+link.substring(link.indexOf("<b>"));
        thisRow.children[1].children[0].outerHTML = link;
    }
    if (buyables == 0){
        tableRows[0].parentElement.classList.add("stockBasket");
        let div = document.createElement("div");
        div.innerHTML="<center>No "+buyPrice+" NP stocks available!</center>";
        div.style="font-weight: bold; color:red; position:relative;";
        div.classList.add("noBuyable");
        tableRows[0].parentElement.after(div);
    }
    let btn = document.createElement("div");
    btn.innerHTML = "<center><button type=\"button\"><b>Show Off-Price Stocks</b></button><center>";
    btn.onclick = () => {
        hideButton(displayStyle,btn);
    };
    tableRows[0].parentElement.parentElement.parentElement.before(btn);
}

function mainLoad(){
    if (inURL("?type=buy")){
        buyMenu();
    } else if (inURL("bargain=true")){
        postAmount();
    } else {
        fetchAmount();
    }
}

function inURL(substr) {
    return document.URL.includes(substr);
}

function fillSell(elem,tab){
    let countCells = elem.getElementsByTagName("input");
    for (let i = 0; i < countCells.length; i++){
        let amount = countCells[0].parentElement.parentElement.children[0].innerText.replace(",","");
        countCells[i].value = amount;
    }
    tab.click();
}

function hideButton(displayStyle,btn){
    if (displayStyle.innerHTML.includes("noBuyable")){
        displayStyle.innerHTML =`
     .stockBasket{
            display:none;
     }
     `;
        btn.innerHTML = "<center><button type=\"button\"><b>Show Off-Price Stocks</b></button><center>";
    } else {
        displayStyle.innerHTML =`
     .noBuyable{
            display:none;
     }
     `;
        btn.innerHTML = "<center><button type=\"button\"><b>Hide Off-Price Stocks</b></button><center>";
    }

}
