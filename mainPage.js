/// <reference path="jquery-3.6.0.js" />
'use strict';

$(function () {
  const OPEN_MODAL = 4
  var selectedCoinList = [];
  var coinsList = [];

  var removeCoinList = [];

  function renderAllCoins() {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins",
      success: coins => {
        $("#display").empty()
        displayCoins(coins)
        coinsList = coins;
      },
      error: err => alert("Error: " + err.status)
    })
  }

  $("#displayButton").ready(function () {
    renderAllCoins()
  });

  $("#displayButton").click(function () {
    renderAllCoins()
  });

  function displayCoins(coins) {
    for (let i = 0; i < 50; i++) {
      const card = `
      <div class="col" >
      <div id="saveCoin${[i]}">
              <div class="card  mb-3" style="width: 250px;" height: 350px;"  >
              <div class="card-body">

              <div class="form-check form-switch">
              <input 
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="${coins[i].name}"
               >
              <label class="form-check-label" ></label>
              </div>

              <img src="${coins[i].image.small}"></img>
              <h4 class="card-title">${coins[i].name}</h4>
              <p class="card-text">${coins[i].symbol}</p>
              <div class="d-grid">
              <button  id="${coins.id} type="button" class="btn btn-outline-warning  btn-sm" data-bs-toggle="collapse" data-bs-target="#saveCoin${i}collapse" aria-expanded="false" aria-controls="collapseExample">View more</button>
              <div class="collapse" id="saveCoin${i}collapse">
              <div class="card card-body">
              <div>Price In USD: ${coins[i].market_data.current_price.usd}$</div>
              <div>Price In EUR: ${coins[i].market_data.current_price.eur}€</div>
              <div>Price In ILS: ${coins[i].market_data.current_price.ils}₪</div>
              <div class=responsive">
              <img src="${coins[i].image.small}"></img>
             </div>
             </div>
          </div>`

      $("#display").append(card);

    }


    //----------------------------Check Button-----------------------------------------------//
    $(".form-check-input").on("click", function (event) {
      const isCheck = event.target.checked;
      const coinName = event.target.id;

      if (isCheck) {
        if (selectedCoinList.length > OPEN_MODAL) {
          const cardList = selectedCoinList.map(coin => `
            <div class="form-check form-switch">
              <input 
                checked
                class="form-check-input"
                type="checkbox"
                role="switch"
                  id="modal-${coin}"
               >  
                   <label class="form-check-label" ><b>${coin}</b></label>
              </div>
        `)


          //--------------------------Create Modal-------------------------------------------//
          $("#staticBackdrop").modal('show');
          $("#modalBody").append(cardList);

          $(".form-check-input").on("click", function (event) {
            const coinName = event.target.id.split("-")[1];
            const isCheckBoxInModalCheck = event.target.checked;
            if (isCheckBoxInModalCheck) {
              removeCoinList = removeCoinList.filter((coin) => coin != coinName)
            } else {
              removeCoinList.push(coinName)
            }
            console.log(removeCoinList)

          })
          $("#modalSave").on("click", function (event) {
            removeCoinList.forEach((coin) => {
              $(`#${coin}`).prop('checked', false);
              selectedCoinList = selectedCoinList.filter((selectedCoin) => selectedCoin != coin)
            })

            selectedCoinList.push(coinName);
            $("#staticBackdrop").modal('hide');
            console.log(selectedCoinList)
          });
          return;
        }
        selectedCoinList.push(coinName);
      } else {
        selectedCoinList = selectedCoinList.filter((coin) => coin != coinName)
      }
      console.log(selectedCoinList)
    });

  }


  //--------------------------SEARCH COIN-------------------------------------------------//

  $("#myCoinSearch").click(function (event) {
    event.preventDefault();
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins",
      success: coins => {
        $("#display").empty()
        displaySearchCoin(coins)
      },
      error: err => alert("Error: " + err.status)
    })
  });

  function displaySearchCoin(coins, i) {

    const value = $("input[type=search]").val();
    $("input[type-search]").val("");
    $("input[type-search]").focus("");

    let arr = [];

    for (let i = 0; i < 50; i++) {
      const oneTwo = coins[i]
      arr.push(oneTwo)

    }

    let result = (arr.find(result => result.id === value || result.name === value || result.symbol === value))

    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins",
      success: coins => {
        $("#display").empty()
        displayOnly1Coin(result)
      },
      error: err => alert("Error: " + err.status)
    })



    function displayOnly1Coin(coins) {
      const card = `
      <div class="col">
      <div class="card  mb-3" style="width: 250px;" height: 350px;" >
      <div class="card-body" >
      <div class="form-check form-switch">
      <input id="saveCoin${123}" class="form-check-input"  type="checkbox" role="switch" id="flexSwitchCheckChecked">
      <label class="form-check-label" for="flexSwitchCheckChecked"></label>
      <img src="${result.image.small}"></img>
      <h4 class="card-title">${result.name}</h4>
      <p class="card-text">${result.symbol}</p>
      <div class="d-grid">
      <button  type="button" class="btn btn-outline-warning  btn-sm"  data-bs-toggle="collapse" data-bs-target="#collapseExample${123}" aria-expanded="false" aria-controls="collapseExample">More info</button>
      <div class="collapse" id="collapseExample${123}"> 
      <div class="card card-body">
      <div>Price In USD: ${result.market_data.current_price.usd}$</div>
      <div>Price In EUR: ${result.market_data.current_price.eur}€</div>
      <div>Price In ILS: ${result.market_data.current_price.ils}₪</div>
      <div class=responsive">
      <img src="${result.image.small}"></img>
     </div>
    </div>
  </div>`

      $("#display").append(card);


    }

  }





  //------------------ Navigate start---------------------

  $('#displayButton').on('click', function () {
    $('#coinsSection').show();
    $('#liveSection').attr("hidden", "hidden");
    $('#aboutSection').attr("hidden", "hidden");
  });

  $('#charLink').on('click', function () {
    $('#coinsSection').hide();
    $('#liveSection').removeAttr("hidden");
    $('#aboutSection').attr("hidden", "hidden");
  });

  $('#aboutLink').on('click', function () {
    $('#coinsSection').hide();
    $('#liveSection').attr("hidden", "hidden");
    $('#aboutSection').removeAttr("hidden");
  });







  // ------- Test more info START------------------

  //<button onclick="onMoreInfoClick()" id="more-info-button-${coins.id} type="button" class="btn btn-outline-warning  btn-sm" data-bs-toggle="collapse" data-bs-target="#saveCoin${i}collapse" aria-expanded="false" aria-controls="collapseExample">View more</button>
  //<div class="collapse" id="saveCoin${i}collapse">
  //<div class="loader" id="loader-coin-id-${coins.id}"></div>
  //<div class="card card-body">



  //function onMoreInfoClick() {
  //const coinName = (event.target.id).split("-")[3];
  //const coinFromLocalStorage = localStorage.getItem(coinName);
  //$(`#more-info-${coinName}`).toggleClass("hideMoreInfo");
  //if (coinFromLocalStorage) {
  //console.log("get Data from local storage")
  //const data = JSON.parse(coinFromLocalStorage);
  //showMoreInfo(coinName, data)
  //return;
  //} else {
  //console.log("get Data from API")
  //toggleSpinner(coinName)
  //$.ajax({
  //url: `https://api.coingecko.com/api/v3/coins/${coinName}`,
  //success: coin => {
  //localStorage.setItem(coinName, JSON.stringify(coin))
  //showMoreInfo(coinName, coin)
  //clearCache(coinName)
  //toggleSpinner(coinName)
  //},
  //error: err => alert("Error: " + err.status)
  //  });
  //}
  //}

  //function showMoreInfo(coinName, coin) {
  //$(`#more-info-${coinName}`).text(`${coin.market_data.current_price.usd}$ | ${coin.market_data.current_price.eur}€ | ${coin.market_data.current_price.ils}₪`);
  //}

  //function clearCache(coinName) {
  //const twoMinuets = 120000;
  //setTimeout(() => {
  //localStorage.removeItem(coinName)
  //}, twoMinuets)
  //}

  //--------- Test more info END------------------




});











