// =========================================================================
// ======== 【 核心排盤與介面互動邏輯 】 ====================

function resizeChart() {
  const wrapper = document.getElementById("chart-scale-wrapper");
  const area = document.querySelector(".chart-area");
  if (!wrapper || !area) return;

  const chartWidth = 530;
  const areaWidth = area.clientWidth;

  if (areaWidth < chartWidth && areaWidth > 0) {
    const scale = areaWidth / chartWidth;
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.marginBottom = `-${chartWidth * (1 - scale)}px`;
  } else {
    wrapper.style.transform = "scale(1)";
    wrapper.style.marginBottom = "0px";
  }
}
window.addEventListener("resize", resizeChart);

function checkPatterns(p, palaces, sysState, effectiveStem) {
  let patterns = [];
  const getSanFangIndices = (idx) => [
    idx, (idx + 4) % 12, (idx + 6) % 12, (idx + 8) % 12,
  ];
  const pStars = palaces[p].stars.map((s) => s.name);
  const pHas = (star) => pStars.includes(star);

  const sfIndices = getSanFangIndices(p);
  const sfStars = sfIndices.flatMap((idx) => palaces[idx].stars.map((s) => s.name));
  const sfHas = (star) => sfStars.includes(star);
  const sfHasAny = (starArr) => starArr.some((s) => sfStars.includes(s));

  const luStar = effectiveStem ? sihuaTable[effectiveStem]["祿"] : null;
  const quanStar = effectiveStem ? sihuaTable[effectiveStem]["權"] : null;
  const keStar = effectiveStem ? sihuaTable[effectiveStem]["科"] : null;

  if (p === 1 || p === 7) {
    let prevStars = palaces[(p + 11) % 12].stars.map((s) => s.name);
    let nextStars = palaces[(p + 1) % 12].stars.map((s) => s.name);
    if (
      (prevStars.includes("太陽") && nextStars.includes("太陰")) ||
      (prevStars.includes("太陰") && nextStars.includes("太陽"))
    ) {
      patterns.push("日月夾命");
    }
  }
  if (p === 3 && pHas("太陽")) patterns.push("日照雷門");
  if (p === 11 && pHas("太陰")) patterns.push("月朗天門");
  if ((p === 0 || p === 6) && pHas("巨門")) {
    if (luStar === "巨門" || quanStar === "巨門" || keStar === "巨門") {
      patterns.push("石中隱玉");
    }
  }
  if (sfHas("太陽") && sfHas("天梁") && sfHasAny(["文昌", "文曲"])) {
    if (sfHas("祿存") || (luStar && sfHas(luStar))) {
      patterns.push("陽梁昌祿");
    }
  }
  if (sfHas("天機") && sfHas("太陰") && sfHas("天同") && sfHas("天梁")) {
    patterns.push("機月同梁");
  }
  if (p === 7) {
    let maoHasSun = palaces[3].stars.some((s) => s.name === "太陽");
    let haiHasMoon = palaces[11].stars.some((s) => s.name === "太陰");
    if (maoHasSun && haiHasMoon) patterns.push("明珠出海");
  }
  if (p === 6 && pHas("太陽")) patterns.push("金燦光輝");
  if (p === 6 && pHas("天梁")) patterns.push("壽星入廟");
  if (sfHasAny(["火星", "鈴星"]) && sfHas("貪狼")) patterns.push("火貪");
  if (sfHasAny(["文昌", "文曲"]) && sfHas("貪狼")) patterns.push("昌貪");
  let oppP = (p + 6) % 12;
  let pAndOppStars = [
    ...palaces[p].stars.map((s) => s.name),
    ...palaces[oppP].stars.map((s) => s.name),
  ];
  let poHasLu = pAndOppStars.includes("祿存") || (luStar && pAndOppStars.includes(luStar));
  let poHasMa = pAndOppStars.includes("天馬");
  if (poHasLu && poHasMa) patterns.push("祿馬交馳");

  if (sfHasAny(["文昌", "文曲"]) && sfHasAny(["火星", "鈴星"]) && sfHasAny(["擎羊", "陀羅"]) && sfHas("武曲")) {
    patterns.push("鈴昌陀武");
  }
  if (p === 6 && pHas("擎羊")) patterns.push("馬頭帶劍");
  if (sfHas("巨門") && sfHasAny(["火星", "鈴星"]) && sfHasAny(["擎羊", "陀羅"])) {
    patterns.push("巨火羊");
  }
  if (sfHas("天機") && sfHas("天梁") && sfHasAny(["擎羊", "陀羅"])) {
    patterns.push("天機天梁擎羊會");
  }
  if ((p === 0 && pHas("貪狼") && pHas("擎羊")) || (p === 11 && pHas("貪狼") && pHas("陀羅"))) {
    patterns.push("泛水桃花");
  }
  if (pHas("廉貞") && pHas("天相")) {
    if (pHas("擎羊")) {
      patterns.push("刑囚夾印");
    } else {
      let prevHasYang = palaces[(p + 11) % 12].stars.some((s) => s.name === "擎羊");
      let nextHasYang = palaces[(p + 1) % 12].stars.some((s) => s.name === "擎羊");
      if (prevHasYang || nextHasYang) patterns.push("刑囚夾印");
    }
  }
  if (sfHas("太陽") && sfHasAny(["擎羊", "陀羅"])) patterns.push("人離財散");
  if (pHas("破軍") && pHas("文曲")) patterns.push("眾水朝東");
  if (pHas("天馬") && pHas("陀羅")) patterns.push("折足馬");
  if (sfHasAny(["太陽", "太陰"]) && sfHasAny(["火星", "鈴星"])) patterns.push("十惡");
  if (p === 2 && pHas("貪狼") && pHas("陀羅")) patterns.push("風流綵杖");
  if (p === 9 && pHas("巨門") && pHas("天機") && sfHasAny(["紅鸞", "天喜", "咸池", "天姚"])) {
    patterns.push("巨陷天機");
  }
  if ((p === 7 || p === 8) && pHas("廉貞")) {
    if (!sfHasAny(["擎羊", "陀羅", "地空", "地劫", "火星", "鈴星"])) {
      patterns.push("雄宿朝垣");
    }
  }

  // 判定「無往不利」格局 (自化權條件：壬紫、癸巨、庚武)
  if (effectiveStem) {
    const yinStemIdx = wuhuBase[effectiveStem];
    const diffFromYin = (p - 2 + 12) % 12;
    const pStem = stemsArr[(yinStemIdx + diffFromYin) % 10];
    if ((pStem === "壬" && pHas("紫微")) || 
        (pStem === "癸" && pHas("巨門")) || 
        (pStem === "庚" && pHas("武曲"))) {
      patterns.push("無往不利");
    }
  }

  return patterns;
}

let appState = {
  ziwei: null, calcZiwei: null, birthMonth: null, birthHour: null,
  target: null, manualStem: null, calcStem: null, yearBranch: null,
  birthSolarYear: null, targetYear: null, lunarYear: null, lunarDay: null,
  bureau: null, lifePalaceIdx: null, isForward: true, gender: "男",
  bazi: null, baziStems: null, sihuaMode: "none", brightnessMode: 0,
  currentName: "", useDayStemMode: false, useYearStemMode: false,
  showBureau: false, showFlow: false, showYinShen: false,
};

// 自動偵測環境，若在 GitHub 上則隱藏開發區塊
function initDevFeatures() {
  const devSection = document.getElementById('dev-section');
  const hostname = window.location.hostname;
  
  // 如果網址不是本地端 (localhost 或 127.0.0.1) 且不是空字串 (代表在線上環境)
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '') {
    if (devSection) {
      devSection.style.display = 'none';
      console.log("偵測到線上環境：已隱藏開發中功能。");
    }
  }
}

function updateToggleButtons() {
  const dayBtn = document.getElementById("day-stem-btn");
  const yearBtn = document.getElementById("year-stem-btn");
  const nowBtn = document.getElementById("now-time-btn");

  nowBtn.style.background = "#e2e8f0";
  nowBtn.style.color = "#334155";
  nowBtn.style.borderColor = "#cbd5e1";

  if (appState.useDayStemMode) {
    dayBtn.style.background = "#ef4444";
    dayBtn.style.color = "#ffffff";
    dayBtn.style.borderColor = "#ef4444";
  } else {
    dayBtn.style.background = "#e2e8f0";
    dayBtn.style.color = "#334155";
    dayBtn.style.borderColor = "#cbd5e1";
  }

  if (appState.useYearStemMode) {
    yearBtn.style.background = "#3b82f6";
    yearBtn.style.color = "#ffffff";
    yearBtn.style.borderColor = "#3b82f6";
  } else {
    yearBtn.style.background = "#e2e8f0";
    yearBtn.style.color = "#334155";
    yearBtn.style.borderColor = "#cbd5e1";
  }
}

function toggleDayStemMode() {
  appState.useDayStemMode = !appState.useDayStemMode;
  if (appState.useDayStemMode) appState.useYearStemMode = false;
  updateToggleButtons();
  updateUI();
}

function toggleYearStemMode() {
  appState.useYearStemMode = !appState.useYearStemMode;
  if (appState.useYearStemMode) appState.useDayStemMode = false;
  updateToggleButtons();
  updateUI();
}

function getColor(b) {
  if (b === "廟" || b === "旺" || b === "極旺") return "#c82cbd";
  if (b === "陷" || b === "男平女陷") return "#2563eb";
  return "#1e293b";
}

function getBureau(stemChar, branchChar) {
  const str = stemChar + branchChar;
  const water2 = ["丙子", "丁丑", "甲寅", "乙卯", "壬辰", "癸巳", "丙午", "丁未", "甲申", "乙酉", "壬戌", "癸亥"];
  const wood3 = ["壬子", "癸丑", "庚寅", "辛卯", "戊辰", "己巳", "壬午", "癸未", "庚申", "辛酉", "戊戌", "己亥"];
  const metal4 = ["甲子", "乙丑", "壬寅", "癸卯", "庚辰", "辛巳", "甲午", "乙未", "壬申", "癸酉", "庚戌", "辛亥"];
  const earth5 = ["庚子", "辛丑", "戊寅", "己卯", "丙辰", "丁巳", "庚午", "辛未", "戊申", "己酉", "丙戌", "丁亥"];
  const fire6 = ["戊子", "己丑", "丙寅", "丁卯", "甲辰", "乙巳", "戊午", "己未", "丙申", "丁酉", "甲戌", "乙亥"];
  if (water2.includes(str)) return 2;
  if (wood3.includes(str)) return 3;
  if (metal4.includes(str)) return 4;
  if (earth5.includes(str)) return 5;
  if (fire6.includes(str)) return 6;
  return 2;
}

function toggleBureau() {
  appState.showBureau = !appState.showBureau;
  const btn = document.getElementById("toggle-bureau-btn");
  if (appState.showBureau) {
    btn.style.backgroundColor = "#dbeafe";
    btn.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
  } else {
    btn.style.backgroundColor = "#ffffff";
    btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  }
  updateUI();
}

function toggleFlow() {
  appState.showFlow = !appState.showFlow;
  const btn = document.getElementById("toggle-flow-btn");
  if (appState.showFlow) {
    btn.style.backgroundColor = "#dbeafe";
    btn.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
  } else {
    btn.style.backgroundColor = "#ffffff";
    btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  }
  updateUI();
}

function toggleYinShen() {
  appState.showYinShen = !appState.showYinShen;
  const btn = document.getElementById("toggle-yinshen-btn");
  if (appState.showYinShen) {
    btn.style.backgroundColor = "#dbeafe";
    btn.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
  } else {
    btn.style.backgroundColor = "#ffffff";
    btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  }
  updateUI();
}

function toggleBrightness() {
  appState.brightnessMode = (appState.brightnessMode + 1) % 2;
  const btn = document.getElementById("toggle-brightness-btn");
  if (appState.brightnessMode === 0) {
    btn.style.backgroundColor = "#94a3b8";
    btn.style.opacity = "0.8";
  } else {
    btn.style.backgroundColor = "#2c3e50";
    btn.style.opacity = "1";
  }
  updateUI();
}

let isStarNatureOpen = false;
function toggleStarNature() {
  isStarNatureOpen = !isStarNatureOpen;
  const modal = document.getElementById("star-nature-modal");
  const btn = document.getElementById("toggle-nature-btn");

  if (isStarNatureOpen) {
    modal.style.display = "block";
    btn.style.backgroundColor = "#8b5cf6";
    btn.style.opacity = "1";
    btn.style.color = "#ffffff";
  } else {
    modal.style.display = "none";
    btn.style.backgroundColor = "#94a3b8";
    btn.style.opacity = "0.8";
  }
}

function showMessage(msg) {
  document.getElementById("modal-message").innerText = msg;
  document.getElementById("custom-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("custom-modal").style.display = "none";
}

function toggleLeapMonth() {
  const isLunar = document.querySelector('input[name="calendar"]:checked').value === "lunar";
  document.getElementById("leap-month-label").style.display = isLunar ? "inline-block" : "none";
}

function useCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = now.getHours();
  const hourIdx = Math.floor(((hours + 1) % 24) / 2);
  const hourChar = branchNames[hourIdx];
  const timeStr = `${year}${month}${day}${hourChar}男`;

  document.getElementById("birth-input").value = timeStr;
  document.querySelector('input[name="year-type"][value="ad"]').checked = true;
  document.querySelector('input[name="calendar"][value="solar"]').checked = true;
  document.getElementById("is-leap-month").checked = false;

  toggleLeapMonth();
  parseBirthData("now");
}

function parseBirthData(sourceStr) {
  if (typeof sourceStr !== "string") {
    appState.currentName = "手動排盤";
  } else if (sourceStr === "now") {
    appState.currentName = "現在時間";
  }

  const input = document.getElementById("birth-input").value.replace(/\s+/g, "");
  const regex = /^(-?\d{1,4})(\d{2})(\d{2})([子丑寅卯辰巳午未申酉戌亥])([男女])$/;
  const match = input.match(regex);

  if (!match) {
    showMessage(`排盤中斷！\n「${input}」格式不符。\n請確認格式為：YYMMDD時性別 (如 700222子男)`);
    return false;
  }

  let year = parseInt(match[1]);
  const month = parseInt(match[2]);
  const day = parseInt(match[3]);
  const hourChar = match[4];
  const gender = match[5];

  appState.rawYear = year;
  appState.rawMonth = month;
  appState.rawDay = day;
  appState.rawYearType = document.querySelector('input[name="year-type"]:checked').value;
  appState.rawIsLunar = document.querySelector('input[name="calendar"]:checked').value === "lunar";

  const yearType = document.querySelector('input[name="year-type"]:checked').value;
  if (yearType === "roc") {
    year += 1911;
  }

  const isLunar = document.querySelector('input[name="calendar"]:checked').value === "lunar";
  const isLeap = isLunar && document.getElementById("is-leap-month").checked;

  let lunarMonth, lunarDay, lunarStemChar, lunarYear;
  const hourMap = { 子: 0, 丑: 2, 寅: 4, 卯: 6, 辰: 8, 巳: 10, 午: 12, 未: 14, 申: 16, 酉: 18, 戌: 20, 亥: 22 };
  const hourNum = hourMap[hourChar];

  try {
    let lunarObj;
    if (isLunar) {
      let m = isLeap ? -month : month;
      lunarObj = Lunar.fromYmdHms(year, m, day, hourNum, 0, 0);
    } else {
      let solarObj = Solar.fromYmdHms(year, month, day, hourNum, 0, 0);
      lunarObj = solarObj.getLunar();
    }

    lunarYear = lunarObj.getYear();
    let rawLunarMonth = lunarObj.getMonth();
    lunarDay = lunarObj.getDay();

    const bY = lunarObj.getYearInGanZhi();
    const monthNum = Math.abs(lunarObj.getMonth());
    const yearGan = lunarObj.getYearGan();
    const wuhuIdx = { 甲: 2, 己: 2, 乙: 4, 庚: 4, 丙: 6, 辛: 6, 丁: 8, 壬: 8, 戊: 0, 癸: 0 }[yearGan];

    const mStemIdx = (wuhuIdx + monthNum - 1) % 10;
    const mBranchIdx = (monthNum + 1) % 12;

    const bM = stemsArr[mStemIdx] + branchNames[mBranchIdx];
    const bD = lunarObj.getDayInGanZhi();
    const bT = lunarObj.getTimeInGanZhi();

    lunarStemChar = bY.charAt(0);

    appState.bazi = [bT, bD, bM, bY];
    appState.baziStems = [bT.charAt(0), bD.charAt(0), bM.charAt(0), bY.charAt(0)];
    appState.yearBranch = bY.charAt(1);

    lunarMonth = Math.abs(rawLunarMonth);
    if (rawLunarMonth < 0) {
      lunarMonth = (lunarMonth % 12) + 1;
    }
  } catch (e) {
    showMessage(`排盤中斷！\n「${input}」日期轉換失敗，請確認日期是否合理。`);
    return false;
  }

  const hourIdx = branchNames.indexOf(hourChar);

  appState.birthSolarYear = year;
  appState.targetYear = null;
  document.getElementById("target-year-input").value = "";

  appState.calcStem = lunarStemChar;
  appState.manualStem = null;
  appState.birthMonth = lunarMonth - 1;
  appState.birthHour = hourIdx;
  appState.gender = gender;

  appState.sihuaMode = "bazi";
  appState.target = null;

  let lifePalaceIdx = (2 + (lunarMonth - 1) - hourIdx) % 12;
  if (lifePalaceIdx < 0) lifePalaceIdx += 12;
  appState.lifePalaceIdx = lifePalaceIdx;

  const yinStemIdx = wuhuBase[lunarStemChar];
  const diffFromYin = (lifePalaceIdx - 2 + 12) % 12;
  const lpStemIdx = (yinStemIdx + diffFromYin) % 10;
  const lpStemChar = stemsArr[lpStemIdx];
  const lpBranchChar = branchNames[lifePalaceIdx];

  const bureau = getBureau(lpStemChar, lpBranchChar);
  appState.bureau = bureau;

  const stemIdx = stemsArr.indexOf(lunarStemChar);
  appState.isForward = (stemIdx % 2 === 0) === (gender === "男");

  let X = 0;
  while ((lunarDay + X) % bureau !== 0) {
    X++;
  }
  let quotient = (lunarDay + X) / bureau;
  let basePos = (2 + quotient - 1) % 12;

  let ziweiPos;
  if (X === 0) ziweiPos = basePos;
  else if (X % 2 !== 0) ziweiPos = (basePos - X + 12) % 12;
  else ziweiPos = (basePos + X) % 12;

  appState.ziwei = ziweiPos;
  appState.calcZiwei = ziweiPos;
  appState.lunarYear = lunarYear;
  appState.lunarDay = lunarDay;
  updateUI();

  return true;
}

function updateTargetYear() {
  const val = document.getElementById("target-year-input").value;
  if (val) {
    appState.targetYear = parseInt(val);
  } else {
    appState.targetYear = null;
  }
  updateUI();
}

function setZiwei(val) {
  if (appState.ziwei === val) {
    appState.ziwei = appState.calcZiwei !== undefined ? appState.calcZiwei : null;
  } else {
    appState.ziwei = val;
  }
  updateUI();
}

function setStem(val) {
  if (appState.manualStem === val) {
    appState.manualStem = null;
  } else {
    appState.manualStem = val;
  }
  updateUI();
}

function setTarget(val) {
  if (appState.target === val) {
    appState.target = null;
    appState.sihuaMode = appState.baziStems ? "bazi" : "none";
  } else {
    appState.target = val;
    appState.sihuaMode = "target";
  }
  updateUI();
}

function updateUI() {
  const groups = ["ziwei", "target", "stem"];
  const mapGroup = {
    ziwei: appState.ziwei,
    target: appState.target,
    stem: appState.manualStem !== null ? stemsArr.indexOf(appState.manualStem) : null,
  };

  groups.forEach((group) => {
    const btns = document.querySelectorAll(`#btn-group-${group} button`);
    btns.forEach((btn, index) => {
      if (index === mapGroup[group] && mapGroup[group] !== null) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });

  generateChart();
  resizeChart();
}

function generateChart() {
  let palaces = Array.from({ length: 12 }, () => ({ stars: [], bottomLeftStars: [] }));
  let palaceNames = Array(12).fill("");
  let ageRanges = Array(12).fill("");
  let palaceStems = Array(12).fill("");

  let targetY = appState.targetYear;
  let liuNianStem = null;
  let liuNianBranch = null;

  if (appState.lunarYear !== null && appState.birthSolarYear !== null) {
    if (!targetY) {
      const now = new Date();
      const lunarNow = Lunar.fromDate(now);
      liuNianStem = lunarNow.getYearGan();
      liuNianBranch = lunarNow.getYearZhi();
    } else {
      let stemIdx = (targetY - 4) % 10;
      if (stemIdx < 0) stemIdx += 10;
      liuNianStem = stemsArr[stemIdx];

      let branchIdx = (targetY - 4) % 12;
      if (branchIdx < 0) branchIdx += 12;
      liuNianBranch = branchNames[branchIdx];
    }
  }

  let baseStem = appState.calcStem;
  let effectiveBranch = appState.yearBranch;

  if (appState.useYearStemMode && liuNianStem !== null && liuNianBranch !== null) {
    baseStem = liuNianStem;
    effectiveBranch = liuNianBranch;
  } else if (appState.useDayStemMode && appState.baziStems) {
    baseStem = appState.baziStems[1];
  }

  let effectiveStem = appState.manualStem !== null ? appState.manualStem : baseStem;

  if (effectiveStem !== null) {
    if (appState.useDayStemMode && !appState.useYearStemMode) {
      let ziStemIdx = wushuBase[effectiveStem];
      for (let i = 0; i < 12; i++) {
        let stemIdx = (ziStemIdx + i) % 10;
        palaceStems[i] = stemsArr[stemIdx];
      }
    } else {
      let yinStemIdx = wuhuBase[effectiveStem];
      for (let i = 0; i < 12; i++) {
        let diffFromYin = (i - 2 + 12) % 12;
        let stemIdx = (yinStemIdx + diffFromYin) % 10;
        palaceStems[i] = stemsArr[stemIdx];
      }
    }
  }

  if (appState.lifePalaceIdx !== null && appState.bureau !== null) {
    for (let i = 0; i < 12; i++) {
      let pIdxName = (appState.lifePalaceIdx - i + 12) % 12;
      palaceNames[pIdxName] = palaceTypes[i];

      let pIdxAge = appState.isForward
        ? (appState.lifePalaceIdx + i) % 12
        : (appState.lifePalaceIdx - i + 12) % 12;
      let startAge = appState.bureau + i * 10;
      let endAge = startAge + 9;
      ageRanges[pIdxAge] = `${startAge}-${endAge}`;
    }
  }

  const topInfoBar = document.getElementById("top-info-bar");
  const topInfoText = document.getElementById("top-info-text");
  const birthInfoEl = document.getElementById("birth-info-text");
  
  if (birthInfoEl && appState.rawYear !== undefined && appState.rawYear !== null) {
    const branchNamesHour = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    let hourStr = appState.birthHour !== null && appState.birthHour >= 0 ? branchNamesHour[appState.birthHour] : "未知";
    let genderStr = appState.gender === "F" || appState.gender === "女" ? "女命" : "男命";
    let calPrefix = appState.rawIsLunar ? "陰曆" : "陽曆";
    let isROC = appState.rawYearType === "roc" || appState.rawYear < 200;
    let yearPrefix = isROC ? "民國" : "西元";
    let dYear = appState.rawYear;
    let dMonth = appState.rawMonth;
    let dDay = appState.rawDay;

    birthInfoEl.innerHTML = `${calPrefix}${yearPrefix}${dYear}年${dMonth}月${dDay}日${hourStr}時 - ${genderStr}`;
    birthInfoEl.style.display = "block";
  } else if (birthInfoEl) {
    birthInfoEl.style.display = "none";
  }

  const currentNameBox = document.getElementById("current-chart-name");
  if (currentNameBox) {
    if (appState.currentName) {
      currentNameBox.innerText = `【 ${appState.currentName} 】`;
      currentNameBox.style.display = "block";
    } else {
      currentNameBox.style.display = "none";
    }
  }

  if (appState.lunarYear !== null && appState.birthSolarYear !== null) {
    let targetY = appState.targetYear;
    let age, daxianNum, liunianStr, displayStr;

    if (!targetY) {
      const now = new Date();
      const yy = now.getFullYear();
      const mm = now.getMonth() + 1;
      const dd = now.getDate();
      const hh = now.getHours();
      const hourIdx = Math.floor(((hh + 1) % 24) / 2);
      const currentZhi = branchNames[hourIdx];
      const dateStr = `${yy}/${String(mm).padStart(2, "0")}/${String(dd).padStart(2, "0")}/${currentZhi}`;

      const lunarNow = Lunar.fromDate(now);
      const currStem = lunarNow.getYearGan();
      const currBranch = lunarNow.getYearZhi();

      const dunGanYinIdx = wuhuBase[currStem];
      const currBranchIdx = branchNames.indexOf(currBranch);
      const diff = (currBranchIdx - 2 + 12) % 12;
      const dunGan = stemsArr[(dunGanYinIdx + diff) % 10];
      liunianStr = `${currStem}${currBranch}${dunGan}`;

      age = lunarNow.getYear() - appState.lunarYear + 1;
      if (isNaN(age) || age < 1) age = 1;

      daxianNum = age >= appState.bureau ? Math.floor((age - appState.bureau) / 10) + 1 : 1;
      let dxStart = appState.bureau + (daxianNum - 1) * 10;
      let dxEnd = dxStart + 9;

      displayStr = `${dateStr} - ${age}歲 - ${daxianNum}限(${dxStart}-${dxEnd}) - ${liunianStr}`;
    } else {
      let stemIdx = (targetY - 4) % 10;
      if (stemIdx < 0) stemIdx += 10;
      let branchIdx = (targetY - 4) % 12;
      if (branchIdx < 0) branchIdx += 12;

      const currStem = stemsArr[stemIdx];
      const currBranch = branchNames[branchIdx];

      const dunGanYinIdx = wuhuBase[currStem];
      const diff = (branchIdx - 2 + 12) % 12;
      const dunGan = stemsArr[(dunGanYinIdx + diff) % 10];
      liunianStr = `${currStem}${currBranch}${dunGan}`;

      age = targetY - appState.birthSolarYear + 1;
      if (isNaN(age) || age < 1) age = 1;

      daxianNum = age >= appState.bureau ? Math.floor((age - appState.bureau) / 10) + 1 : 1;
      let dxStart = appState.bureau + (daxianNum - 1) * 10;
      let dxEnd = dxStart + 9;

      displayStr = `${targetY} - ${age}歲 - ${daxianNum}限(${dxStart}-${dxEnd}) - ${liunianStr}`;
    }

    topInfoText.innerText = displayStr;
    topInfoBar.style.display = "flex";
  } else {
    topInfoBar.style.display = "none";
  }

  function addStar(starName, pos) {
    if (pos === null || pos < 0 || pos > 11 || isNaN(pos)) return;
    let b = "";
    if (starBrightness[starName]) b = starBrightness[starName][pos];
    palaces[pos].stars.push({
      name: starName,
      short: shortNameMap[starName],
      brightness: b,
    });
  }

  function addMinorStar(starName, pos, isPeach) {
    if (pos === null || pos < 0 || pos > 11 || isNaN(pos)) return;
    palaces[pos].bottomLeftStars.push({
      name: starName,
      short: shortNameMap[starName] || starName.substring(0, 1),
      isPeach: isPeach,
    });
  }

  function getStarPos(name) {
    for (let i = 0; i < 12; i++) {
      if (palaces[i].stars.some((s) => s.name === name)) return i;
      if (palaces[i].bottomLeftStars.some((s) => s.name === name)) return i;
    }
    return null;
  }

  function getHuaTargetPos(pIdx, type) {
    if (pIdx === null) return null;
    let stem = palaceStems[pIdx];
    if (!stem) return null;
    let targetStar = sihuaTable[stem][type];
    return getStarPos(targetStar);
  }

  if (appState.ziwei !== null) {
    let z = appState.ziwei;
    addStar("紫微", z);
    addStar("天機", (z - 1 + 12) % 12);
    addStar("太陽", (z - 3 + 12) % 12);
    addStar("武曲", (z - 4 + 12) % 12);
    addStar("天同", (z - 5 + 12) % 12);
    addStar("廉貞", (z - 8 + 12) % 12);

    const f = (16 - z) % 12;
    addStar("天府", f);
    addStar("太陰", (f + 1) % 12);
    addStar("貪狼", (f + 2) % 12);
    addStar("巨門", (f + 3) % 12);
    addStar("天相", (f + 4) % 12);
    addStar("天梁", (f + 5) % 12);
    addStar("七殺", (f + 6) % 12);
    addStar("破軍", (f + 10) % 12);
  }

  if (effectiveBranch !== null) {
    const yb = effectiveBranch;
    const ybIdx = branchNames.indexOf(yb);
    const tianMaMap = { 申: 2, 子: 2, 辰: 2, 寅: 8, 午: 8, 戌: 8, 亥: 5, 卯: 5, 未: 5, 巳: 11, 酉: 11, 丑: 11 };
    addStar("天馬", tianMaMap[yb]);

    if (appState.birthHour !== null) {
      const huoBase = { 寅: 1, 午: 1, 戌: 1, 申: 2, 子: 2, 辰: 2, 巳: 3, 酉: 3, 丑: 3, 亥: 9, 卯: 9, 未: 9 };
      const lingBase = { 寅: 3, 午: 3, 戌: 3, 申: 10, 子: 10, 辰: 10, 巳: 10, 酉: 10, 丑: 10, 亥: 10, 卯: 10, 未: 10 };
      addStar("火星", (huoBase[yb] + appState.birthHour) % 12);
      addStar("鈴星", (lingBase[yb] + appState.birthHour) % 12);
    }

    addMinorStar("紅鸞", (3 - ybIdx + 12) % 12, true);
    addMinorStar("天喜", (((3 - ybIdx + 12) % 12) + 6) % 12, true);
    const xianChiMap = [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0];
    addMinorStar("咸池", xianChiMap[ybIdx], true);

    addMinorStar("龍池", (4 + ybIdx) % 12, false);
    addMinorStar("鳳閣", (10 - ybIdx + 12) % 12, false);
    addMinorStar("白虎", (ybIdx + 8) % 12, false);
    addMinorStar("天哭", (6 - ybIdx + 12) % 12, false);
    addMinorStar("天虛", (6 + ybIdx) % 12, false);
    addMinorStar("亡神", [11, 8, 5, 2][ybIdx % 4], false);
    addMinorStar("破碎", [5, 1, 9, 5, 1, 9, 5, 1, 9, 5, 1, 9][ybIdx], false);
    addMinorStar("華蓋", [4, 1, 10, 7][ybIdx % 4], false);
    addMinorStar("喪門", (ybIdx + 2) % 12, false);
    addMinorStar("官符", (ybIdx + 4) % 12, false);
    const daHaoMap = [7, 6, 9, 8, 11, 10, 1, 0, 3, 2, 5, 4];
    addMinorStar("大耗", daHaoMap[ybIdx], false);
    addMinorStar("孤辰", [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2][ybIdx], false);
    addMinorStar("寡宿", [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10][ybIdx], false);
    addMinorStar("息神", [3, 0, 9, 6][ybIdx % 4], false);
  }

  if (appState.birthMonth !== null) {
    let mIdx = appState.birthMonth;
    let zfPos = (4 + mIdx) % 12;
    addStar("左輔", zfPos);
    let ybPos = (10 - mIdx + 12) % 12;
    addStar("右弼", ybPos);

    addMinorStar("天姚", (1 + mIdx) % 12, true);
    addMinorStar("天刑", (9 + mIdx) % 12, false);
    const yinShaMap = [2, 0, 10, 8, 6, 4, 2, 0, 10, 8, 6, 4];
    addMinorStar("陰煞", yinShaMap[mIdx], false);
    addMinorStar("風伯", (8 - mIdx + 12) % 12, false);
    const yuShiMap = [0, 6, 3, 9, 0, 6, 3, 9, 0, 6, 3, 9];
    addMinorStar("雨師", yuShiMap[mIdx], false);

    if (appState.lunarDay !== null) {
      addMinorStar("三台", (zfPos + appState.lunarDay - 1) % 12, false);
      addMinorStar("八座", (ybPos - appState.lunarDay + 1 + 12 * 3) % 12, false);
    }
  }

  if (appState.birthHour !== null) {
    let wqPos = (4 + appState.birthHour) % 12;
    addStar("文曲", wqPos);
    let wcPos = (10 - appState.birthHour + 12) % 12;
    addStar("文昌", wcPos);

    let dkPos = (11 - appState.birthHour + 12) % 12;
    addStar("地空", dkPos);
    let djPos = (11 + appState.birthHour) % 12;
    addStar("地劫", djPos);

    addMinorStar("台輔", (6 + appState.birthHour) % 12, false);
    addMinorStar("封誥", (2 + appState.birthHour) % 12, false);

    if (appState.lunarDay !== null) {
      addMinorStar("恩光", (wcPos + appState.lunarDay - 2 + 12) % 12, false);
      addMinorStar("天貴", (wqPos + appState.lunarDay - 2 + 12) % 12, false);
    }
  }

  if (effectiveBranch !== null && appState.lifePalaceIdx !== null && appState.birthMonth !== null && appState.birthHour !== null) {
    let ybIdx = branchNames.indexOf(effectiveBranch);
    let bodyPalaceIdx = (2 + appState.birthMonth + appState.birthHour) % 12;
    addMinorStar("天才", (appState.lifePalaceIdx + ybIdx) % 12, false);
    addMinorStar("天壽", (bodyPalaceIdx + ybIdx) % 12, false);
  }

  if (effectiveStem !== null) {
    const stem = effectiveStem;
    const luCunMap = { 甲: 2, 乙: 3, 丙: 5, 丁: 6, 戊: 5, 己: 6, 庚: 8, 辛: 9, 壬: 11, 癸: 0 };
    let luCunPos = luCunMap[stem];
    addStar("祿存", luCunPos);
    addStar("擎羊", (luCunPos + 1) % 12);
    addStar("陀羅", (luCunPos - 1 + 12) % 12);

    const kuiMap = { 甲: 1, 乙: 0, 丙: 11, 丁: 11, 戊: 1, 己: 0, 庚: 1, 辛: 2, 壬: 3, 癸: 3 };
    const yueMap = { 甲: 7, 乙: 8, 丙: 9, 丁: 9, 戊: 7, 己: 8, 庚: 7, 辛: 6, 壬: 5, 癸: 5 };
    addStar("天魁", kuiMap[stem]);
    addStar("天鉞", yueMap[stem]);

    const tianFuMap = { 甲: 9, 乙: 8, 丙: 0, 丁: 11, 戊: 3, 己: 2, 庚: 6, 辛: 5, 壬: 6, 癸: 5 };
    addMinorStar("天福", tianFuMap[stem], false);

    const tianGuanMap = { 甲: 7, 乙: 4, 丙: 5, 丁: 2, 戊: 3, 己: 9, 庚: 11, 辛: 9, 壬: 10, 癸: 6 };
    addMinorStar("天官", tianGuanMap[stem], false);
  }

  let baziBranchIndices = [];
  if (appState.bazi) {
    baziBranchIndices = appState.bazi.map((pillar) => branchNames.indexOf(pillar.charAt(1)));
  }

  function getOriginalPos(starName) {
    let z = appState.calcZiwei;
    if (z === null || z === undefined) return null;
    if (starName === "紫微") return z;
    if (starName === "天機") return (z - 1 + 12) % 12;
    if (starName === "太陽") return (z - 3 + 12) % 12;
    if (starName === "武曲") return (z - 4 + 12) % 12;
    if (starName === "天同") return (z - 5 + 12) % 12;
    if (starName === "廉貞") return (z - 8 + 12) % 12;

    const f = (16 - z) % 12;
    if (starName === "天府") return f;
    if (starName === "太陰") return (f + 1) % 12;
    if (starName === "貪狼") return (f + 2) % 12;
    if (starName === "巨門") return (f + 3) % 12;
    if (starName === "天相") return (f + 4) % 12;
    if (starName === "天梁") return (f + 5) % 12;
    if (starName === "七殺") return (f + 6) % 12;
    if (starName === "破軍") return (f + 10) % 12;

    if (starName === "文昌" && appState.birthHour !== null) return (10 - appState.birthHour + 12) % 12;
    if (starName === "文曲" && appState.birthHour !== null) return (4 + appState.birthHour) % 12;

    return null;
  }

  for (let i = 0; i < 12; i++) {
    const cell = document.getElementById(`cell-${i}`);

    if (baziBranchIndices.includes(i)) {
      cell.style.backgroundColor = "#e0f2fe";
    } else {
      cell.style.backgroundColor = "#ffffff";
    }

    let starsHTML = "";
    let reversedStars = [...palaces[i].stars].reverse();
    let starCount = reversedStars.length;

    let mainSize, subSize, brightSize, gapSize;
    if (starCount <= 2) {
      mainSize = 30; subSize = 22; brightSize = 20; gapSize = 10;
    } else if (starCount === 3) {
      mainSize = 26; subSize = 19; brightSize = 18; gapSize = 8;
    } else if (starCount === 4) {
      mainSize = 22; subSize = 17; brightSize = 16; gapSize = 6;
    } else if (starCount === 5) {
      mainSize = 19; subSize = 15; brightSize = 14; gapSize = 4;
    } else {
      mainSize = 17; subSize = 14; brightSize = 12; gapSize = 2;
    }

    for (let star of reversedStars) {
      let cCode = getColor(star.brightness);

      let isSpecialStarRed = ["文昌", "文曲", "左輔", "右弼", "天魁", "天鉞"].includes(star.name);
      let isSpecialStarGreen = ["擎羊", "陀羅", "火星", "鈴星", "地空", "地劫"].includes(star.name);
      let isLuCun = star.name === "祿存";
      let isTianMa = star.name === "天馬";
      let isMainStar = !isSpecialStarRed && !isSpecialStarGreen && !isLuCun && !isTianMa;

      let sSize = isMainStar ? mainSize : subSize;
      let sColor = "#0f172a";
      if (isSpecialStarRed) sColor = "#dc2626";
      if (isSpecialStarGreen) sColor = "#059669";
      if (isLuCun) sColor = "#2563eb"; 

      let nameStyle = `font-size: ${sSize}px; color: ${sColor};`;
      let bStyle = `font-size: ${brightSize}px; color: ${cCode};`;

      let brightText = "";

      starsHTML += `
                  <div class="star-group">
                      <div class="star-name" style="${nameStyle}">${star.short}</div>
                      <div class="star-brightness" style="${bStyle}">${brightText}</div>
                  </div>
              `;
    }

    let overallHTML = "";
    let primaryStarName = null;
    for (let s of palaces[i].stars) {
      if (overallPalaceBrightness[s.name]) {
        primaryStarName = s.name;
        break;
      }
    }

    if (primaryStarName && appState.brightnessMode === 1) {
      let overallB = overallPalaceBrightness[primaryStarName][i];
      let oColor = getColor(overallB);
      overallHTML = `<div class="overall-brightness" style="color: ${oColor};">${overallB}</div>`;
    } else {
      overallHTML = `<div class="overall-brightness"></div>`;
    }

    let bNum = getBureau(palaceStems[i], branchNames[i]);
    const bureauMap = { 2: "二", 3: "三", 4: "四", 5: "五", 6: "六" };
    let bNumStr = appState.showBureau ? bureauMap[bNum] || "" : "";

    function getOriginalMainStars(pIdx) {
      let z = appState.calcZiwei;
      if (z === null || z === undefined) return [];
      let stars = [];
      if (z === pIdx) stars.push("紫微");
      if ((z - 1 + 12) % 12 === pIdx) stars.push("天機");
      if ((z - 3 + 12) % 12 === pIdx) stars.push("太陽");
      if ((z - 4 + 12) % 12 === pIdx) stars.push("武曲");
      if ((z - 5 + 12) % 12 === pIdx) stars.push("天同");
      if ((z - 8 + 12) % 12 === pIdx) stars.push("廉貞");
      let f = (16 - z) % 12;
      if (f === pIdx) stars.push("天府");
      if ((f + 1) % 12 === pIdx) stars.push("太陰");
      if ((f + 2) % 12 === pIdx) stars.push("貪狼");
      if ((f + 3) % 12 === pIdx) stars.push("巨門");
      if ((f + 4) % 12 === pIdx) stars.push("天相");
      if ((f + 5) % 12 === pIdx) stars.push("天梁");
      if ((f + 6) % 12 === pIdx) stars.push("七殺");
      if ((f + 10) % 12 === pIdx) stars.push("破軍");
      if (stars.length === 0) {
        let opp = (pIdx + 6) % 12;
        if (z === opp) stars.push("紫微");
        if ((z - 1 + 12) % 12 === opp) stars.push("天機");
        if ((z - 3 + 12) % 12 === opp) stars.push("太陽");
        if ((z - 4 + 12) % 12 === opp) stars.push("武曲");
        if ((z - 5 + 12) % 12 === opp) stars.push("天同");
        if ((z - 8 + 12) % 12 === opp) stars.push("廉貞");
        let ff = (16 - z) % 12;
        if (ff === opp) stars.push("天府");
        if ((ff + 1) % 12 === opp) stars.push("太陰");
        if ((ff + 2) % 12 === opp) stars.push("貪狼");
        if ((ff + 3) % 12 === opp) stars.push("巨門");
        if ((ff + 4) % 12 === opp) stars.push("天相");
        if ((ff + 5) % 12 === opp) stars.push("天梁");
        if ((ff + 6) % 12 === opp) stars.push("七殺");
        if ((ff + 10) % 12 === opp) stars.push("破軍");
      }
      return stars;
    }

    const main14Stars = ["紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府", "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "破軍"];
    let curXMainStars = palaces[i].stars.filter((s) => main14Stars.includes(s.name)).map((s) => s.name);
    let origXMainPositions = curXMainStars.map((sName) => getOriginalPos(sName)).filter((pos) => pos !== null);

    let yinShenSymbol = "";
    if (appState.showYinShen) {
      let oriStars = getOriginalMainStars(i);
      let yinLuCount = 0, yinJiCount = 0;
      const sfIdx = [i, (i + 4) % 12, (i + 6) % 12, (i + 8) % 12];
      let allSfStarNames = [];
      sfIdx.forEach((idx) => {
        allSfStarNames.push(...palaces[idx].stars.map((s) => s.name));
      });

      oriStars.forEach((sName) => {
        let curPos = getStarPos(sName);
        if (curPos !== null) {
          let stem = palaceStems[curPos];
          if (stem && sihuaTable[stem]) {
            let luS = sihuaTable[stem]["祿"], jiS = sihuaTable[stem]["忌"];
            let origLuPos = getOriginalPos(luS);
            let origJiPos = getOriginalPos(jiS);

            let luMatchOrig = origXMainPositions.some((p) => origLuPos === p || origLuPos === (p + 6) % 12);
            let jiMatchOrig = origXMainPositions.some((p) => origJiPos === p || origJiPos === (p + 6) % 12);

            if (allSfStarNames.includes(luS) || luMatchOrig) yinLuCount++;
            if (allSfStarNames.includes(jiS) || jiMatchOrig) yinJiCount++;
          }
        }
      });
      let comb = "";
      for (let c = 0; c < yinLuCount; c++) comb += "●";
      for (let c = 0; c < yinJiCount; c++) comb += "x";
      yinShenSymbol = comb || "-";
    }

    let flowSymbol = "";
    if (appState.showFlow) {
      const sfIdx = [i, (i + 4) % 12, (i + 6) % 12, (i + 8) % 12];
      const branch = branchNames[i];
      let targetStars = [];

      if (["申", "子", "辰"].includes(branch)) targetStars = ["天機", "貪狼"];
      else if (["寅", "午", "戌"].includes(branch)) targetStars = ["紫微", "天府", "天梁"];
      else if (["巳", "酉", "丑"].includes(branch)) targetStars = ["太陰", "天同", "巨門", "天相", "破軍"];
      else if (["亥", "卯", "未"].includes(branch)) targetStars = ["太陽", "廉貞"];

      let allSfStarNames = [];
      sfIdx.forEach((idx) => {
        allSfStarNames.push(...palaces[idx].stars.map((s) => s.name));
      });

      let starFound = false;
      let flowLuCount = 0;
      let flowJiCount = 0;

      sfIdx.forEach((idx) => {
        const currentStars = palaces[idx].stars.map((s) => s.name);
        const foundTargets = currentStars.filter((name) => targetStars.includes(name));

        if (foundTargets.length > 0) {
          starFound = true;
          let stem = palaceStems[idx];
          if (stem && sihuaTable[stem]) {
            let luStar = sihuaTable[stem]["祿"];
            let jiStar = sihuaTable[stem]["忌"];

            let origLuPos = getOriginalPos(luStar);
            let origJiPos = getOriginalPos(jiStar);

            let luMatchOrig = origXMainPositions.some((p) => origLuPos === p || origLuPos === (p + 6) % 12);
            let jiMatchOrig = origXMainPositions.some((p) => origJiPos === p || origJiPos === (p + 6) % 12);

            if (allSfStarNames.includes(luStar) || luMatchOrig) flowLuCount++;
            if (allSfStarNames.includes(jiStar) || jiMatchOrig) flowJiCount++;
          }
        }
      });

      if (!starFound) {
        flowSymbol = "-";
      } else {
        let combined = "";
        for (let c = 0; c < flowLuCount; c++) combined += "●";
        for (let c = 0; c < flowJiCount; c++) combined += "X";
        flowSymbol = combined || "-";
      }
    }

    let yinShenHtml = yinShenSymbol ? `<div style="font-size: 13px; color: #059669; font-weight: bold; line-height: 1; margin-bottom: 2px;">${yinShenSymbol}</div>` : "";
    let flowHtml = flowSymbol ? `<div style="font-size: 13px; color: #2563eb; font-weight: bold; line-height: 1; margin-bottom: 2px;">${flowSymbol}</div>` : "";

    let branchStr = `
              <div class="branch-name" style="position: absolute; bottom: 6px; right: 8px;">
                  ${yinShenHtml}
                  ${flowHtml}
                  <span style="position: absolute; right: 100%; bottom: 0; font-size: 12px; color: #2563eb; margin-right: 4px; font-weight: bold; white-space: nowrap;">${bNumStr}</span>
                  ${palaceStems[i] ? palaceStems[i] + "<br>" : ""}${branchNames[i]}
              </div>
          `;
    let wrapperStyle = `gap: ${gapSize}px;`;

    let pInfoHTML = "";
    if (palaceNames[i] && ageRanges[i]) {
      const isLifePalace = palaceNames[i] === "命宮";
      const labelClass = isLifePalace ? "palace-label life-palace" : "palace-label";

      const bodyPalaceIdx = (appState.birthMonth !== null && appState.birthHour !== null) 
                            ? (2 + appState.birthMonth + appState.birthHour) % 12 
                            : null;
      const isBodyPalace = i === bodyPalaceIdx;
      const bodyLabel = isBodyPalace ? `<span class="palace-label body-palace">身</span>` : "";

      pInfoHTML = `<div class="palace-info"><span class="${labelClass}">${palaceNames[i]}</span> ${ageRanges[i]}${bodyLabel}</div>`;
    }

    let minorStarsHTML = "";
    if (palaces[i].bottomLeftStars && palaces[i].bottomLeftStars.length > 0) {
      let sHTML = palaces[i].bottomLeftStars.map((s) => {
          let sColor = s.isPeach ? "#e83e8c" : "#475569";
          return `<span style="color: ${sColor}; margin-right: 3px; margin-bottom: 2px;">${s.short}</span>`;
        }).join("");
      minorStarsHTML = `<div class="minor-stars-bottom-left">${sHTML}</div>`;
    }

    cell.innerHTML = `
              ${minorStarsHTML}
              ${branchStr}
              ${pInfoHTML}
              <div class="stars-wrapper" style="${wrapperStyle}">${starsHTML}</div>
              ${overallHTML}
          `;
  }

  let patternsHTML = "";
  for (let i = 0; i < 12; i++) {
    let matchedPatterns = checkPatterns(i, palaces, appState, effectiveStem);
    let patternHTMLList = "";

    if (matchedPatterns.length > 0) {
      patternHTMLList = " 、 " + matchedPatterns.map((ptn) => {
            let isBad = badPatternsList.includes(ptn);
            let ptnStyle = isBad ? "color: #059669; font-weight: bold;" : "color: #334155;";
            return `<span style="${ptnStyle}">${ptn}</span>`;
          }).join("、");
    }

    patternsHTML += `
              <div class="pattern-row">
                  <div class="pattern-branch ${i === appState.target ? "active" : ""}">${branchNames[i]}</div>
                  <div class="pattern-text">${patternHTMLList}</div>
              </div>
          `;
  }
  document.getElementById("patterns-display").innerHTML = patternsHTML;

  let tgStems = [];
  let centerTitleColor = "#1e293b";
  let sihuaMarksByType = { 忌: Array(12).fill(""), 祿: Array(12).fill(""), 科: Array(12).fill(""), 權: Array(12).fill("") };

  if (appState.sihuaMode === "bazi" && appState.baziStems) {
    if (appState.useYearStemMode || appState.useDayStemMode) {
      let baziBranchIndices = appState.bazi.map((pillar) => branchNames.indexOf(pillar.charAt(1)));
      tgStems = baziBranchIndices.map((idx) => palaceStems[idx]);
    } else {
      tgStems = appState.baziStems;
    }
    centerTitleColor = "#1e293b";
  } else if (appState.sihuaMode === "target" && appState.target !== null && effectiveStem !== null) {
    let targetP = appState.target;
    let sanfangIndices = [targetP, (targetP + 4) % 12, (targetP + 6) % 12, (targetP + 8) % 12];
    tgStems = sanfangIndices.map((idx) => palaceStems[idx]);
    centerTitleColor = "#1e293b";
  }

  if (tgStems.length > 0) {
    let starPosMap = {};
    for (let i = 0; i < 12; i++) {
      for (let star of palaces[i].stars) {
        starPosMap[star.name] = i;
      }
    }
    tgStems.forEach((stem, index) => {
      let transData = sihuaTable[stem];
      for (let type in transData) {
        let targetStarName = transData[type];
        if (starPosMap.hasOwnProperty(targetStarName)) {
          let pIdx = starPosMap[targetStarName];

          let dotColor = "#1e293b";
          if (appState.sihuaMode === "bazi" && index === 3) {
            dotColor = "#2563eb";
          } else if (appState.sihuaMode === "target" && index === 0) {
            dotColor = "#2563eb";
          }

          sihuaMarksByType[type][pIdx] += `<span style="color:${dotColor};">${sihuaSymbols[type]}</span>`;
        }
      }
    });
  }

  const baziDisplay = document.getElementById("bazi-display");
  if (appState.bazi) {
    let html = "";
    let origHtml = '<div style="display: flex; gap: 8px;">';
    appState.bazi.forEach((pillar, index) => {
      origHtml += `
                  <div class="bazi-pillar">
                      <div>${pillar.charAt(0)}</div>
                      <div>${pillar.charAt(1)}</div>
                  </div>
              `;
    });
    origHtml += "</div>";
    html += origHtml;

    if (appState.useYearStemMode || appState.useDayStemMode) {
      let baziBranchIndices = appState.bazi.map((pillar) => branchNames.indexOf(pillar.charAt(1)));
      let newBaziStems = baziBranchIndices.map((idx) => palaceStems[idx]);

      html += '<div style="font-size: 18px; color: #94a3b8; font-weight: bold; margin: 0 6px;">➔</div>';

      html += '<div style="display: flex; gap: 8px;">';
      appState.bazi.forEach((pillar, index) => {
        let newStem = newBaziStems[index];
        html += `
                      <div class="bazi-pillar" style="color: #dc2626;">
                          <div>${newStem}</div>
                          <div>${pillar.charAt(1)}</div>
                      </div>
                  `;
      });
      html += "</div>";
    }

    baziDisplay.innerHTML = html;
    baziDisplay.style.display = "flex";
  } else {
    baziDisplay.style.display = "none";
  }

  const centerCell = document.getElementById("center-cell");
  function getMiniChartHTML(title, marksArray, tColor) {
    return `
              <div class="mini-chart">
                  <div class="mini-cell">${marksArray[5]}</div>
                  <div class="mini-cell">${marksArray[6]}</div>
                  <div class="mini-cell">${marksArray[7]}</div>
                  <div class="mini-cell">${marksArray[8]}</div>
                  <div class="mini-cell">${marksArray[4]}</div>
                  <div class="mini-center" style="color: ${tColor};">${title}</div>
                  <div class="mini-cell">${marksArray[9]}</div>
                  <div class="mini-cell">${marksArray[3]}</div>
                  <div class="mini-cell">${marksArray[10]}</div>
                  <div class="mini-cell">${marksArray[2]}</div>
                  <div class="mini-cell">${marksArray[1]}</div>
                  <div class="mini-cell">${marksArray[0]}</div>
                  <div class="mini-cell">${marksArray[11]}</div>
              </div>
          `;
  }
  centerCell.innerHTML = `
          <div class="mini-charts-grid">
              ${getMiniChartHTML("忌", sihuaMarksByType["忌"], "#1e293b")}
              ${getMiniChartHTML("祿", sihuaMarksByType["祿"], "#1e293b")}
              ${getMiniChartHTML("科", sihuaMarksByType["科"], "#1e293b")}
              ${getMiniChartHTML("權", sihuaMarksByType["權"], "#1e293b")}
          </div>
      `;

  let miniBoardsHtml = "";
  const miniBoardsConfigs = [
    { type: "lu", stars: [{ n: "紅鸞", l: "鸞" }, { n: "天喜", l: "喜" }, { n: "咸池", l: "咸" }, { n: "天姚", l: "姚" }], text: "鸞咸<br>喜姚" },
    { type: "ji", stars: [{ n: "紅鸞", l: "鸞" }, { n: "天喜", l: "喜" }, { n: "咸池", l: "咸" }, { n: "天姚", l: "姚" }], text: "鸞咸<br>喜姚" },
    { type: "lu", stars: [{ n: "天府", l: "府" }, { n: "天相", l: "相" }, { n: "祿存", l: "存" }], text: "府相<br>祿處" },
    { type: "ji", stars: [{ n: "太陽", l: "日" }, { n: "太陰", l: "月" }, { n: "天梁", l: "梁" }, { n: "天馬", l: "馬" }], text: "日月<br>梁馬" },
    { type: "lu", stars: [{ n: "天機", l: "機" }, { n: "太陰", l: "月" }, { n: "天同", l: "同" }, { n: "天梁", l: "梁" }], text: "機月<br>同梁" },
    { type: "ji", stars: [{ n: "天機", l: "機" }, { n: "太陰", l: "月" }, { n: "天同", l: "同" }, { n: "天梁", l: "梁" }], text: "機月<br>同梁" },
    { type: "ji", stars: [{ n: "廉貞", l: "廉" }, { n: "陰煞", l: "煞" }, { n: "白虎", l: "虎" }, { n: "天刑", l: "刑" }], text: "廉煞<br>虎刑" },
    { type: "huo_ling_ji", stars: [], text: "不見<br>之形" },
    { type: "ji", stars: [{ n: "廉貞", l: "廉" }, { n: "陰煞", l: "煞" }, { n: "華蓋", l: "蓋" }, { n: "天梁", l: "梁" }], text: "廉煞<br>蓋梁" },
    { type: "lu", stars: [{ n: "廉貞", l: "廉" }, { n: "陰煞", l: "煞" }, { n: "華蓋", l: "蓋" }, { n: "天梁", l: "梁" }], text: "廉煞<br>蓋梁" },
    { type: "special_ji", stars: [], text: "破疾<br>忌處" },
    { type: "kong_jie_ben", stars: [], text: "空劫<br>本家" },
    { type: "chang_qu_ben", stars: [], text: "昌曲<br>本家" },
    { type: "ke_xing_chang_qu", stars: [], text: "科星<br>昌曲" },
    { type: "wuxing_changsheng", stars: [], text: "五行<br>長生" },
  ];

  miniBoardsConfigs.forEach((b) => {
    let marks = Array(12).fill("");
    if (effectiveStem !== null) {
      if (b.type === "special_ji") {
        let pPos = getStarPos("破軍");
        let pTarget = getHuaTargetPos(pPos, "忌");
        if (pTarget !== null) marks[pTarget] += `<span style="color:#059669;">破</span>`;

        if (pPos !== null) {
          let jiEPos = (pPos - 5 + 12) % 12;
          let jiETarget = getHuaTargetPos(jiEPos, "忌");
          if (jiETarget !== null) marks[jiETarget] += `<span style="color:#059669;">疾</span>`;
        }
      } else if (b.type === "huo_ling_ji") {
        if (effectiveBranch) {
          let yb = effectiveBranch;
          let g1HuoP, g1LingP;
          if (["寅", "午", "戌"].includes(yb)) { g1HuoP = 1; g1LingP = 3; }
          else if (["申", "子", "辰"].includes(yb)) { g1HuoP = 2; g1LingP = 10; }
          else if (["巳", "酉", "丑"].includes(yb)) { g1HuoP = 10; g1LingP = 9; }
          else if (["亥", "卯", "未"].includes(yb)) { g1HuoP = 9; g1LingP = 10; }

          if (g1HuoP !== undefined && g1LingP !== undefined) {
            let s1 = palaceStems[g1HuoP];
            let t1 = s1 ? getStarPos(sihuaTable[s1]["忌"]) : null;
            if (t1 !== null) marks[t1] += '<span style="color:#059669;">火</span>';

            let s2 = palaceStems[g1LingP];
            let t2 = s2 ? getStarPos(sihuaTable[s2]["忌"]) : null;
            if (t2 !== null) marks[t2] += '<span style="color:#059669;">鈴</span>';
          }
        }

        let pHuo = getStarPos("火星");
        if (pHuo !== null) {
          let s3 = palaceStems[pHuo];
          let t3 = s3 ? getStarPos(sihuaTable[s3]["忌"]) : null;
          if (t3 !== null) marks[t3] += '<span style="color:#059669;">火</span>';
        }

        let pLing = getStarPos("鈴星");
        if (pLing !== null) {
          let s4 = palaceStems[pLing];
          let t4 = s4 ? getStarPos(sihuaTable[s4]["忌"]) : null;
          if (t4 !== null) marks[t4] += '<span style="color:#059669;">鈴</span>';
        }
      } else if (b.type === "kong_jie_ben") {
        let pKong = getStarPos("地空");
        if (pKong !== null) {
          let sKong = palaceStems[pKong];
          let tKong = sKong ? getStarPos(sihuaTable[sKong]["祿"]) : null;
          if (tKong !== null) marks[tKong] += '<span style="color:#dc2626;">空</span>';
        }

        let pJie = getStarPos("地劫");
        if (pJie !== null) {
          let sJie = palaceStems[pJie];
          let tJie = sJie ? getStarPos(sihuaTable[sJie]["祿"]) : null;
          if (tJie !== null) marks[tJie] += '<span style="color:#dc2626;">劫</span>';
        }

        let sHai = palaceStems[11];
        let tHai = sHai ? getStarPos(sihuaTable[sHai]["祿"]) : null;
        if (tHai !== null) marks[tHai] += '<span style="color:#dc2626;">本</span>';
      } else if (b.type === "chang_qu_ben") {
        let pChang = getStarPos("文昌");
        if (pChang !== null) {
          let sChang = palaceStems[pChang];
          let tChang = sChang ? getStarPos(sihuaTable[sChang]["祿"]) : null;
          if (tChang !== null) marks[tChang] += '<span style="color:#dc2626;">昌</span>';
        }
        let pQu = getStarPos("文曲");
        if (pQu !== null) {
          let sQu = palaceStems[pQu];
          let tQu = sQu ? getStarPos(sihuaTable[sQu]["祿"]) : null;
          if (tQu !== null) marks[tQu] += '<span style="color:#dc2626;">曲</span>';
        }
        let sChen = palaceStems[4];
        let tChen = sChen ? getStarPos(sihuaTable[sChen]["祿"]) : null;
        if (tChen !== null) marks[tChen] += '<span style="color:#dc2626;">本</span>';
        let sXu = palaceStems[10];
        let tXu = sXu ? getStarPos(sihuaTable[sXu]["祿"]) : null;
        if (tXu !== null) marks[tXu] += '<span style="color:#dc2626;">家</span>';
      } else if (b.type === "ke_xing_chang_qu") {
        let pChang = getStarPos("文昌");
        if (pChang !== null) {
          let sChang = palaceStems[pChang];
          let tChang = sChang ? getStarPos(sihuaTable[sChang]["科"]) : null;
          if (tChang !== null) marks[tChang] += '<span style="color:#dc2626;">昌</span>';
        }
        let pQu = getStarPos("文曲");
        if (pQu !== null) {
          let sQu = palaceStems[pQu];
          let tQu = sQu ? getStarPos(sihuaTable[sQu]["科"]) : null;
          if (tQu !== null) marks[tQu] += '<span style="color:#dc2626;">曲</span>';
        }
        let sChen = palaceStems[4];
        let tChen = sChen ? getStarPos(sihuaTable[sChen]["科"]) : null;
        if (tChen !== null) marks[tChen] += '<span style="color:#dc2626;">本</span>';
        let sXu = palaceStems[10];
        let tXu = sXu ? getStarPos(sihuaTable[sXu]["科"]) : null;
        if (tXu !== null) marks[tXu] += '<span style="color:#dc2626;">家</span>';
      } else if (b.type === "wuxing_changsheng") {
        let sSi = palaceStems[5];
        let tSi = sSi ? getStarPos(sihuaTable[sSi]["忌"]) : null;
        if (tSi !== null) marks[tSi] += '<span style="color:#059669;">金</span>';
        let sShen = palaceStems[8];
        let tShen = sShen ? getStarPos(sihuaTable[sShen]["忌"]) : null;
        if (tShen !== null) marks[tShen] += '<span style="color:#059669;">水</span>';
        let sHai = palaceStems[11];
        let tHai = sHai ? getStarPos(sihuaTable[sHai]["忌"]) : null;
        if (tHai !== null) marks[tHai] += '<span style="color:#059669;">木</span>';
        let sYin = palaceStems[2];
        let tYin = sYin ? getStarPos(sihuaTable[sYin]["忌"]) : null;
        if (tYin !== null) marks[tYin] += '<span style="color:#059669; font-size:11px; letter-spacing:-1px;">火土</span>';
      } else {
        let huaType = b.type === "lu" ? "祿" : "忌";
        b.stars.forEach((s) => {
          let p = getStarPos(s.n);
          let target = getHuaTargetPos(p, huaType);
          if (target !== null) {
            let color = b.type === "lu" ? "#db2777" : "#059669";
            marks[target] += `<span style="color:${color};">${s.l}</span>`;
          }
        });
      }
    }

    let bgClass = "";
    let centerStyle = "";
    if (b.type === "lu") {
      bgClass = "bg-lu";
    } else if (b.type === "kong_jie_ben" || b.type === "chang_qu_ben" || b.type === "ke_xing_chang_qu") {
      centerStyle = "background-color: #ffffff; color: #059669;";
    } else if (b.type === "wuxing_changsheng") {
      centerStyle = "background-color: #bbf7d0; color: #064e3b;";
    } else {
      bgClass = "bg-ji";
    }

    miniBoardsHtml += `
              <div class="s-board">
                  <div class="s-cell">${marks[5]}</div>
                  <div class="s-cell">${marks[6]}</div>
                  <div class="s-cell">${marks[7]}</div>
                  <div class="s-cell">${marks[8]}</div>
                  <div class="s-cell">${marks[4]}</div>
                  <div class="s-center ${bgClass}" style="${centerStyle}">${b.text}</div>
                  <div class="s-cell">${marks[9]}</div>
                  <div class="s-cell">${marks[3]}</div>
                  <div class="s-cell">${marks[10]}</div>
                  <div class="s-cell">${marks[2]}</div>
                  <div class="s-cell">${marks[1]}</div>
                  <div class="s-cell">${marks[0]}</div>
                  <div class="s-cell">${marks[11]}</div>
              </div>
          `;
  });
  document.getElementById("sihua-boards-grid").innerHTML = miniBoardsHtml;
}

document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("selectstart", (event) => event.preventDefault());
document.addEventListener("keydown", function (e) {
  if (
    e.keyCode === 123 ||
    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
    (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74)) ||
    (e.ctrlKey && e.keyCode === 85) ||
    (e.metaKey && e.keyCode === 85)
  ) {
    e.preventDefault();
  }
});

async function copyChartToClipboard() {
  const btn = document.getElementById("copy-chart-btn");
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳";
  btn.style.backgroundColor = "#94a3b8";
  btn.disabled = true;

  try {
    const chartEl = document.querySelector(".chart-container");
    const canvas = await html2canvas(chartEl, {
      scale: 2,
      backgroundColor: "#eef2f5",
    });

    canvas.toBlob(async (blob) => {
      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        btn.innerHTML = "✅";
        btn.style.backgroundColor = "#10b981";
      } catch (err) {
        console.error("剪貼簿寫入失敗:", err);
        showMessage("複製失敗！您的瀏覽器可能不支援此功能，或需要 HTTPS 環境。");
        btn.innerHTML = "❌";
        btn.style.backgroundColor = "#ef4444";
      }
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "#ffffff";
        btn.disabled = false;
      }, 2000);
    }, "image/png");
  } catch (e) {
    console.error("截圖發生錯誤:", e);
    showMessage("圖片產生失敗！");
    btn.innerHTML = originalText;
    btn.style.backgroundColor = "#ffffff";
    btn.disabled = false;
  }
}

async function copyHeaderToClipboard() {
  const btn = document.getElementById("copy-header-btn");
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳";
  btn.style.backgroundColor = "#e2e8f0";
  btn.disabled = true;

  try {
    const captureEl = document.getElementById("header-capture-zone");
    const canvas = await html2canvas(captureEl, {
      scale: 2,
      backgroundColor: "#eef2f5",
    });

    canvas.toBlob(async (blob) => {
      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        btn.innerHTML = "✅";
        btn.style.backgroundColor = "#10b981";
        btn.style.borderColor = "#10b981";
      } catch (err) {
        console.error("剪貼簿寫入失敗:", err);
        showMessage("複製失敗！您的瀏覽器可能不支援此功能，或需要 HTTPS 環境。");
        btn.innerHTML = "❌";
        btn.style.backgroundColor = "#ef4444";
        btn.style.borderColor = "#ef4444";
      }
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "#ffffff";
        btn.style.borderColor = "#cbd5e1";
        btn.disabled = false;
      }, 2000);
    }, "image/png");
  } catch (e) {
    console.error("截圖發生錯誤:", e);
    showMessage("圖片產生失敗！");
    btn.innerHTML = originalText;
    btn.style.backgroundColor = "#ffffff";
    btn.disabled = false;
  }
}

// 這是整個程式的啟動點
window.onload = () => {
  renderPresetsBar();
  toggleLeapMonth();
  updateUI();
  initDevFeatures(); // 啟動自動隱藏判斷
};