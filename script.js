"use strict";

function findMaximum(numbers) {
  let max = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return max;
}

function filterHighForecasts(numbers) {
  const highForecasts = [];

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 20) {
      highForecasts[highForecasts.length] = numbers[i];
    }
  }

  return highForecasts;
}

function calculateSum(numbers) {
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }

  return sum;
}

function countLowForecasts(numbers) {
  let lowForecastsCount = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] <= 5) {
      lowForecastsCount++;
    }
  }

  return lowForecastsCount;
}

function runForecastAnalysis() {
  const growthForecasts = [1, 2, 30, 7, 3, 5];
  let userName = prompt("Введите ваше имя:");

  if (userName === null || userName === "") {
    userName = "Гость";
  }

  alert("Здравствуйте, " + userName + "!");

  const maxForecast = findMaximum(growthForecasts);
  const highForecasts = filterHighForecasts(growthForecasts);
  const sumOfForecasts = calculateSum(growthForecasts);
  const avgGrowth = Math.round(sumOfForecasts / growthForecasts.length * 100) / 100;
  const lowForecastsCount = countLowForecasts(growthForecasts);
  const lowForecastsShare = Math.round(lowForecastsCount / growthForecasts.length * 10000) / 100;

  alert(
    "Средний прогнозируемый рост – " +
    avgGrowth +
    "%, " +
    highForecasts.length +
    " прогнозов – высокие"
  );

  console.log("Прогнозы роста: " + growthForecasts);
  console.log("Максимальный прогноз: " + maxForecast + "%");
  console.log("Сумма прогнозов: " + sumOfForecasts + "%");
  console.log("Количество низких прогнозов: " + lowForecastsCount);
  console.log("Доля низких прогнозов: " + lowForecastsShare + "%");

  if (maxForecast > 50) {
    console.log("Некоторые прогнозы выглядят очень амбициозно!");
  }
}

const defaultForecasts = [
  {
    title: "Медицина",
    description: "К 2035 году ранняя диагностика с помощью ИИ станет доступнее в обычных поликлиниках.",
    keyword: "ранняя диагностика",
    probability: 80
  },
  {
    title: "Транспорт",
    description: "К 2040 году беспилотный транспорт будет обслуживать часть городских маршрутов.",
    keyword: "беспилотный транспорт",
    probability: 70
  },
  {
    title: "Энергетика",
    description: "К 2045 году термоядерные станции начнут поставлять энергию в отдельные городские сети.",
    keyword: "термоядерные станции",
    probability: 45
  }
];

let forecasts = [];

function saveForecasts() {
  try {
    localStorage.setItem("lab5Forecasts", JSON.stringify(forecasts));
  } catch (error) {
    console.error("Не удалось сохранить прогнозы:", error);
  }
}

function loadForecasts() {
  try {
    const savedForecasts = localStorage.getItem("lab5Forecasts");

    if (savedForecasts === null) {
      return defaultForecasts.slice();
    }

    const parsedForecasts = JSON.parse(savedForecasts);

    if (!Array.isArray(parsedForecasts)) {
      throw new Error("Сохранённые прогнозы имеют неверный формат");
    }

    return parsedForecasts;
  } catch (error) {
    console.error("Не удалось загрузить прогнозы:", error);
    return defaultForecasts.slice();
  }
}

function addDescription(paragraph, forecast) {
  const keywordPosition = forecast.description.indexOf(forecast.keyword);

  if (forecast.keyword === "" || keywordPosition === -1) {
    paragraph.textContent = forecast.description;
    return;
  }

  paragraph.append(document.createTextNode(forecast.description.slice(0, keywordPosition)));

  const mark = document.createElement("mark");
  mark.textContent = forecast.keyword;
  paragraph.append(mark);

  const textAfterKeyword = forecast.description.slice(keywordPosition + forecast.keyword.length);
  paragraph.append(document.createTextNode(textAfterKeyword));
}

function renderForecasts(forecastList, forecastCount) {
  forecastList.textContent = "";

  for (let i = 0; i < forecasts.length; i++) {
    const article = document.createElement("article");
    article.classList.add("forecast-card");

    const title = document.createElement("h3");
    title.textContent = forecasts[i].title;

    const description = document.createElement("p");
    addDescription(description, forecasts[i]);

    const probability = document.createElement("p");
    probability.classList.add("probability");
    probability.textContent = "Вероятность: " + forecasts[i].probability + "%";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-forecast");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("data-index", i);
    deleteButton.textContent = "Удалить";

    article.append(title, description, probability, deleteButton);
    forecastList.append(article);
  }

  forecastCount.textContent = "Количество прогнозов: " + forecasts.length;

  const deleteButtons = document.querySelectorAll(".delete-forecast");

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function () {
      const index = Number(deleteButtons[i].getAttribute("data-index"));
      const card = deleteButtons[i].closest(".forecast-card");

      if (card === null || Number.isNaN(index)) {
        console.error("Не удалось найти удаляемую карточку");
        return;
      }

      card.remove();
      forecasts.splice(index, 1);
      saveForecasts();
      renderForecasts(forecastList, forecastCount);
    });
  }
}

function addForecast(forecastList, forecastCount) {
  const description = prompt("Введите описание прогноза:");

  if (description === null || description.trim() === "") {
    alert("Описание прогноза не введено.");
    return;
  }

  const probabilityText = prompt("Введите вероятность от 0 до 100:");

  if (probabilityText === null) {
    return;
  }

  const probability = Number(probabilityText);

  if (probabilityText.trim() === "" || Number.isNaN(probability) || probability < 0 || probability > 100) {
    alert("Вероятность должна быть числом от 0 до 100.");
    return;
  }

  forecasts.push({
    title: "Новый прогноз",
    description: description.trim(),
    keyword: "",
    probability: probability
  });

  saveForecasts();
  renderForecasts(forecastList, forecastCount);
}

function restoreTheme(page, themeButton) {
  try {
    const savedTheme = localStorage.getItem("lab5Theme");

    if (savedTheme === "light") {
      page.classList.add("light-theme");
      themeButton.textContent = "Тёмная тема";
    }
  } catch (error) {
    console.error("Не удалось загрузить тему:", error);
  }
}

function toggleTheme(page, themeButton) {
  page.classList.toggle("light-theme");
  const lightThemeEnabled = page.classList.contains("light-theme");

  themeButton.textContent = lightThemeEnabled ? "Тёмная тема" : "Светлая тема";

  try {
    localStorage.setItem("lab5Theme", lightThemeEnabled ? "light" : "dark");
  } catch (error) {
    console.error("Не удалось сохранить тему:", error);
  }
}

function initializeDomInteraction() {
  const page = document.querySelector("body");
  const forecastSection = document.getElementById("forecasts");
  const forecastList = document.getElementById("forecast-list");
  const forecastCount = document.getElementById("forecast-count");
  const addForecastButton = document.getElementById("add-forecast");
  const toggleForecastsButton = document.getElementById("toggle-forecasts");
  const themeButton = document.getElementById("theme-toggle");

  if (page === null || forecastSection === null || forecastList === null ||
    forecastCount === null || addForecastButton === null ||
    toggleForecastsButton === null || themeButton === null) {
    console.error("Не удалось найти элементы для интерактивной работы страницы");
    return;
  }

  forecasts = loadForecasts();
  renderForecasts(forecastList, forecastCount);
  restoreTheme(page, themeButton);

  addForecastButton.addEventListener("click", function () {
    addForecast(forecastList, forecastCount);
  });

  toggleForecastsButton.addEventListener("click", function () {
    forecastSection.classList.toggle("hidden");
    const forecastsHidden = forecastSection.classList.contains("hidden");

    toggleForecastsButton.textContent = forecastsHidden ? "Показать прогнозы" : "Скрыть прогнозы";
    toggleForecastsButton.setAttribute("aria-expanded", String(!forecastsHidden));
  });

  themeButton.addEventListener("click", function () {
    toggleTheme(page, themeButton);
  });
}

initializeDomInteraction();
runForecastAnalysis();
