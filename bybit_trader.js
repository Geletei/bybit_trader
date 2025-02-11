const CYCLES = 2;                      // Кількість циклів для роботи (1 цикл = купити 100% + продати 100%)
const SLEEP_BETWEEN_CYCLES = [5, 15];  // Затримка між циклами в секундах, вказати проміжок [від, до], буде обрано рандомне значення
const SLEEP_BEFORE_SELL = 3;           // Затримка перед продажем в секундах (менше 3 краще не ставити)


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const selectors = {
  spotButton: "#sfeOrderTabSpot",
  marketButton: "#sfePlaceOrderArea > div.order-create > ul > li:nth-child(2)",
  setSpot0Button: "#sfeMarketArea > div > div.order-market-form > div.order-market-item.order-market-slider > div > div.moly-slider-mark > span:nth-child(1)",
  setSpot100Button: "#sfeMarketArea > div > div.order-market-form > div.order-market-item.order-market-slider > div > div.moly-slider-mark > span:nth-child(5)",
  orderMarketSubmitButton: "#sfeOrderPlaceBtn",
  MarketOrderSubmit: "div.moly-modal > div:nth-child(4) > div > button:nth-child(1)", 
  buySectionButton: "#sfePlaceOrderArea > div.order-create > div.order-create-side-tabs.flex-items-center.flex-row-space-between > button.buy.flex-1",
  sellSectionButton: "#sfePlaceOrderArea > div.order-create > div.order-create-side-tabs.flex-items-center.flex-row-space-between > button.sell.flex-1",
};

const clickElement = async (selector, actionDescription, delay = 2000) => {
  console.log(actionDescription);
  document.querySelector(selector).click();
  await sleep(delay);
};  

function getRandomSleep() {
  min = Math.ceil(SLEEP_BETWEEN_CYCLES[0]);
  max = Math.floor(SLEEP_BETWEEN_CYCLES[1]);
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

const run = async () => {
  await clickElement(selectors.marketButton, "Перейшов в розділ 'Ринок'", 1000);
  await clickElement(selectors.spotButton, "Перейшов в розділ спотовової торгівлі.", 1000);
  var buyProblem = false
  var sellProblem = false
  var i = 1
  while (i <= CYCLES) {
    if (sellProblem == false) {
      console.log(`Цикл ${i} з ${CYCLES} почато.`);
      await clickElement(selectors.buySectionButton, "Перемкнувся на покупку.", 2000);
      await clickElement(selectors.setSpot0Button, "Обнулив відсоток для покупки.", 2000);
      await clickElement(selectors.setSpot100Button, "Виставив відсоток для покупки: 100%.", 2000);
      await clickElement(selectors.orderMarketSubmitButton, "Натиснув купити.", 2000);
      try {
        await clickElement(selectors.MarketOrderSubmit, "Підтвердив покупку.", 2000);
        buyProblem = false
      } catch (err) {
        console.log(`Цикл ${i} з ${CYCLES} не завершено, пробую ще раз`);
        buyProblem = true
        continue;
      }
      await sleep(SLEEP_BEFORE_SELL*1000);
    }
    if (buyProblem == false) {
      await clickElement(selectors.sellSectionButton, "Перемкнувся на продаж.", 2000);
      await clickElement(selectors.setSpot0Button, "Обнулив відсоток для продажу.", 2000);
      await clickElement(selectors.setSpot100Button, "Виставив відсоток для продажу: 100%.", 2000);
      await clickElement(selectors.orderMarketSubmitButton, "Натиснув продати.", 2000);  
      try {
        await clickElement(selectors.MarketOrderSubmit, "Підтвердив продаж.", 2000);
        sellProblem = false
      } catch (err) {
        console.log(`Цикл ${i} з ${CYCLES} не завершено, пробую ще раз`);
        sellProblem = true
        continue;
      }
    }
    console.log(`Цикл ${i} з ${CYCLES} завершено.`);
    if (i == CYCLES) {
      console.log(`--------------------------------------------------`);
      console.log(`Роботу завершено. Зроблено циклів: ${CYCLES}.`);
    } else {
      var sleep_between_cycles = getRandomSleep();
      console.log(`Сплю перед наступним циклом ${sleep_between_cycles/1000}с.`);
      console.log(`--------------------------------------------------`);
      await sleep(sleep_between_cycles);
    }
    i++
  }
};

run();