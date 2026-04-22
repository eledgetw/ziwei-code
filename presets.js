// =========================================================================
// ======== 【 預設命盤儲存與 CSV / XLSX 匯出/匯入模組 】 ====================
let savedPresets = [];

try {
  let v3 = localStorage.getItem("ziwei_presets_v3");
  if (v3) {
    savedPresets = JSON.parse(v3);
  } else {
    let old = JSON.parse(localStorage.getItem("ziwei_presets"));
    if (old && !Array.isArray(old)) {
      for (let k in old) {
        if (old[k].text) {
          savedPresets.push({
            id: Date.now() + Math.random(),
            cat1: "1",
            cat2: "預設",
            category: "預設",
            name: old[k].note || `命盤${k}`,
            text: old[k].text,
            yearType: old[k].yearType || "ad",
            calendar: old[k].type || "solar",
            isLeap: old[k].isLeap || false,
            notes: "",
            father: "",
            mother: "",
            spouse: "",
            child: "",
          });
        }
      }
    }
  }
} catch (e) {
  console.error(e);
}

if (savedPresets.length === 0) {
  for (let i = 1; i <= 5; i++) {
    savedPresets.push({
      id: Date.now() + i,
      cat1: "1",
      cat2: "未分類",
      category: "未分類",
      name: `命盤${i}`,
      text: "",
      yearType: "ad",
      calendar: "solar",
      isLeap: false,
      notes: "",
      father: "",
      mother: "",
      spouse: "",
      child: "",
    });
  }
} else {
  savedPresets.forEach((p) => {
    if (!p.cat1) p.cat1 = "1";
    if (!p.cat2) p.cat2 = p.category || "未分類";
  });
}

let currentEditingPreset = null;
let activePresetGroup = null;

function renderPresetsBar() {
  let html = '<div style="display: flex; gap: 15px; justify-content: center; width: 100%; margin-bottom: 15px;">';
  for (let i = 1; i <= 4; i++) {
    let isActive = activePresetGroup === String(i) ? "background-color: #2980b9; color: white; border-color: #2980b9;" : "background-color: #f1f5f9; color: #475569; border-color: #cbd5e1;";
    html += `<button style="padding: 10px 25px; font-size: 16px; font-weight: bold; border-radius: 8px; border: 1px solid; cursor: pointer; transition: all 0.2s; ${isActive}" onclick="togglePresetGroup('${i}')">群組${i}</button>`;
  }
  html += "</div>";

  html += `<div id="preset-group-content" style="width: 100%; display: flex; flex-direction: column; gap: 15px;"></div>`;
  html += `<div style="width: 100%; text-align: center; margin-top: 15px;"><button class="edit-preset-btn" onclick="openPresetModal()">編輯/新增 命盤列表</button></div>`;

  document.getElementById("presets-bar-container").innerHTML = html;

  if (activePresetGroup) {
    renderPresetGroupContent(activePresetGroup);
  }
}

function togglePresetGroup(grp) {
  if (activePresetGroup === grp) {
    activePresetGroup = null;
  } else {
    activePresetGroup = grp;
  }
  renderPresetsBar();
}

function renderPresetGroupContent(grp) {
  let filtered = savedPresets.filter((p) => String(p.cat1) === String(grp));
  let categories = {};
  filtered.forEach((p) => {
    let cat = p.cat2 || "未分類";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });

  let html = "";
  for (let cat in categories) {
    html += `<div class="preset-category-group">
                      <div class="preset-category-title">【 ${cat} 】</div>
                      <div class="preset-buttons-container">`;
    categories[cat].forEach((p) => {
      let btnName = p.name || p.text || "未命名";
      html += `<button class="preset-btn" onclick="applyPreset('${p.id}')">${btnName}</button>`;
    });
    html += `   </div></div>`;
  }
  const contentDiv = document.getElementById("preset-group-content");
  if (contentDiv) contentDiv.innerHTML = html;
}

function renderPresetModalRows() {
  let html = "";
  savedPresets.forEach((p) => {
    let isAd = p.yearType === "ad" ? "selected" : "";
    let isRoc = p.yearType === "roc" ? "selected" : "";
    let isSolar = p.calendar === "solar" ? "selected" : "";
    let isLunar = p.calendar === "lunar" ? "selected" : "";
    let isLeap = p.isLeap ? "checked" : "";
    let displayLeap = p.calendar === "lunar" ? "inline-block" : "none";

    html += `
          <div class="preset-edit-item" data-id="${p.id}" style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #cbd5e1; margin-bottom:10px;">
              <div style="display:flex; margin-bottom:8px; gap:5px;">
                  <input type="text" class="p-cat1" value="${p.cat1 || ""}" placeholder="群組1~4" style="width:15%; padding:4px;">
                  <input type="text" class="p-cat2" value="${p.cat2 || ""}" placeholder="分類2" style="width:20%; padding:4px;">
                  <input type="text" class="p-name" value="${p.name || ""}" placeholder="名字" style="width:25%; padding:4px;">
                  <input type="text" class="p-notes" value="${p.notes || ""}" placeholder="註" style="flex:1; padding:4px;">
                  <button onclick="removePreset('${p.id}')" style="color:#ef4444; background:none; border:none; font-weight:bold; cursor:pointer; font-size:16px;">✕</button>
              </div>
              <div style="display:flex; gap:5px; align-items:center; margin-bottom:8px;">
                  <input type="text" class="p-father" value="${p.father || ""}" placeholder="父" style="width:25%; padding:4px;">
                  <input type="text" class="p-mother" value="${p.mother || ""}" placeholder="母" style="width:25%; padding:4px;">
                  <input type="text" class="p-spouse" value="${p.spouse || ""}" placeholder="妻" style="width:25%; padding:4px;">
                  <input type="text" class="p-child" value="${p.child || ""}" placeholder="子" style="width:25%; padding:4px;">
              </div>
              <div style="display:flex; gap:5px; align-items:center;">
                  <select class="p-yt" style="padding:4px;"><option value="ad" ${isAd}>西元</option><option value="roc" ${isRoc}>民國</option></select>
                  <select class="p-cal" onchange="togglePresetLeapRow(this)" style="padding:4px;"><option value="solar" ${isSolar}>陽曆</option><option value="lunar" ${isLunar}>陰曆</option></select>
                  <label class="p-leap-wrap" style="display:${displayLeap}; color:#db2777; font-size:13px; font-weight:bold; white-space:nowrap;"><input type="checkbox" class="p-leap" ${isLeap}>閏</label>
                  <input type="text" class="p-text" value="${p.text || ""}" placeholder="YYMMDD時性別 (如:680718未男)" style="flex:1; padding:4px; min-width:120px;">
              </div>
          </div>
          `;
  });
  document.getElementById("preset-modal-content").innerHTML = html;
}

function togglePresetLeapRow(selectEl) {
  const isLunar = selectEl.value === "lunar";
  const wrapper = selectEl.closest(".preset-edit-item").querySelector(".p-leap-wrap");
  if (wrapper) wrapper.style.display = isLunar ? "inline-block" : "none";
}

function syncModalToState() {
  let newPresets = [];
  const items = document.querySelectorAll(".preset-edit-item");
  items.forEach((item) => {
    newPresets.push({
      id: item.dataset.id,
      cat1: item.querySelector(".p-cat1").value,
      cat2: item.querySelector(".p-cat2").value,
      category: item.querySelector(".p-cat2").value,
      name: item.querySelector(".p-name").value,
      notes: item.querySelector(".p-notes").value,
      father: item.querySelector(".p-father").value,
      mother: item.querySelector(".p-mother").value,
      spouse: item.querySelector(".p-spouse").value,
      child: item.querySelector(".p-child").value,
      yearType: item.querySelector(".p-yt").value,
      calendar: item.querySelector(".p-cal").value,
      isLeap: item.querySelector(".p-leap").checked,
      text: item.querySelector(".p-text").value,
    });
  });
  savedPresets = newPresets;
}

function addPresetRow() {
  syncModalToState();
  savedPresets.push({
    id: Date.now() + Math.random(),
    cat1: "1",
    cat2: "未分類",
    category: "未分類",
    name: "新命盤",
    text: "",
    yearType: "ad",
    calendar: "solar",
    isLeap: false,
    notes: "",
    father: "",
    mother: "",
    spouse: "",
    child: "",
  });
  renderPresetModalRows();
  setTimeout(() => {
    let content = document.getElementById("preset-modal-content");
    content.scrollTop = content.scrollHeight;
  }, 50);
}

function removePreset(id) {
  syncModalToState();
  savedPresets = savedPresets.filter((p) => p.id != id);
  renderPresetModalRows();
}

function applyPreset(id) {
  const preset = savedPresets.find((p) => p.id == id);
  if (!preset || !preset.text) {
    currentEditingPreset = id;
    openPresetModal();
    showMessage(`「${preset ? preset.name : "此命例"}」缺乏生辰資料，請先補齊。`);
    return;
  }

  try {
    appState.currentName = preset.name || "未命名";
    document.getElementById("birth-input").value = preset.text;

    let yt = preset.yearType === "roc" ? "roc" : "ad";
    let cal = preset.calendar === "lunar" ? "lunar" : "solar";

    const ytRadio = document.querySelector(`input[name="year-type"][value="${yt}"]`);
    if (ytRadio) ytRadio.checked = true;

    const calRadio = document.querySelector(`input[name="calendar"][value="${cal}"]`);
    if (calRadio) calRadio.checked = true;

    const leapBox = document.getElementById("is-leap-month");
    if (leapBox) leapBox.checked = preset.isLeap || false;

    toggleLeapMonth();
    parseBirthData("preset");

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  } catch (e) {
    console.error("套用命例錯誤:", e);
    showMessage("該命例資料有誤，系統已嘗試修復，請重新檢查。");
  }
}

function openPresetModal() {
  renderPresetModalRows();
  document.getElementById("preset-modal").style.display = "flex";
}

function closePresetModal() {
  document.getElementById("preset-modal").style.display = "none";
  currentEditingPreset = null;
}

function savePresets() {
  syncModalToState();
  localStorage.setItem("ziwei_presets_v3", JSON.stringify(savedPresets));
  document.getElementById("preset-modal").style.display = "none";
  renderPresetsBar();

  if (currentEditingPreset) {
    applyPreset(currentEditingPreset);
    currentEditingPreset = null;
  } else {
    showMessage("命盤列表已成功儲存！");
  }
}

function deleteAllPresets() {
  if (confirm("警告：確定要刪除「所有」命盤資料嗎？此動作無法復原！")) {
    savedPresets = [];
    localStorage.removeItem("ziwei_presets_v3");
    localStorage.removeItem("ziwei_presets");
    renderPresetModalRows();
    renderPresetsBar();
    showMessage("所有命盤資料已清空。");
  }
}

// ================= 【 CSV / XLSX 匯出 / 匯入核心模組 】 ====================

function escapeCSV(str) {
  if (str === null || str === undefined) return '""';
  const s = String(str);
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return `"${s}"`;
}

function parseCSVLine(text) {
  let result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function exportPresetsCSV() {
  syncModalToState();
  let csvContent = "\uFEFF";
  csvContent += "分類1,分類2,年格式,名字,年,月,日,時,性,曆法,潤月,註,父,母,妻,子\n";

  savedPresets.forEach((p) => {
    let match = p.text.match(/^(-?\d{1,4})(\d{2})(\d{2})([子丑寅卯辰巳午未申酉戌亥])([男女])$/);
    let y = "", m = "", d = "", h = "", g = "";
    if (match) {
      y = match[1]; m = parseInt(match[2]); d = parseInt(match[3]); h = match[4]; g = match[5];
    } else {
      y = p.text;
    }
    let yearTypeStr = p.yearType === "roc" ? "民國" : "西元";
    let calStr = p.calendar === "lunar" ? "陰曆" : "陽曆";
    let leapStr = p.isLeap ? "TRUE" : "FALSE";

    let row = [
      p.cat1, p.cat2, yearTypeStr, p.name, y, m, d, h, g, calStr, leapStr, p.notes, p.father, p.mother, p.spouse, p.child,
    ].map(escapeCSV).join(",");
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ziwei_backup.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportPresetsXLSX() {
  syncModalToState();
  let data = [
    ["分類1", "分類2", "年格式", "名字", "年", "月", "日", "時", "性", "曆法", "潤月", "註", "父", "母", "妻", "子"],
  ];

  savedPresets.forEach((p) => {
    let match = p.text.match(/^(-?\d{1,4})(\d{2})(\d{2})([子丑寅卯辰巳午未申酉戌亥])([男女])$/);
    let y = "", m = "", d = "", h = "", g = "";
    if (match) {
      y = match[1]; m = parseInt(match[2]); d = parseInt(match[3]); h = match[4]; g = match[5];
    } else {
      y = p.text;
    }
    let yearTypeStr = p.yearType === "roc" ? "民國" : "西元";
    let calStr = p.calendar === "lunar" ? "陰曆" : "陽曆";
    let leapStr = p.isLeap ? "TRUE" : "FALSE";

    data.push([
      p.cat1, p.cat2, yearTypeStr, p.name, y, m, d, h, g, calStr, leapStr, p.notes, p.father, p.mother, p.spouse, p.child,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "紫微命盤資料");
  XLSX.writeFile(wb, "ziwei_backup.xlsx");
}

function applyImportedCSVData(csvText) {
  try {
    csvText = csvText.replace(/^\uFEFF/, "");
    let lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return showMessage("CSV 檔案格式錯誤或為空。");

    let headerLineIdx = -1;
    let headers = [];
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      let tempHeaders = parseCSVLine(lines[i]).map((h) => h.replace(/["\uFEFF]/g, "").trim());
      if (tempHeaders.includes("名字") || tempHeaders.includes("年")) {
        headerLineIdx = i;
        headers = tempHeaders;
        break;
      }
    }

    if (headerLineIdx === -1) {
      return showMessage("CSV 欄位不符，無法辨識標題列。請確保含有「名字」與「年」的欄位。");
    }

    let newPresets = [];
    for (let i = headerLineIdx + 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      let values = parseCSVLine(lines[i]);
      let obj = {};
      headers.forEach((h, j) => {
        let val = values[j] ? values[j].replace(/(^"|"$)/g, "").trim() : "";
        obj[h] = val;
      });

      if (!obj["名字"] && !obj["年"] && !obj["text"]) continue;

      let cat1 = obj["分類1"] || "1";
      let cat2 = obj["分類2"] || obj["分類"] || "未分類";
      let name = obj["名字"] || "未命名";
      let yt = obj["年格式"] === "民國" || obj["年格式"] === "roc" ? "roc" : "ad";
      let y = obj["年"] || "";
      let m = obj["月"] ? String(obj["月"]).padStart(2, "0") : "";
      let d = obj["日"] ? String(obj["日"]).padStart(2, "0") : "";
      let h = obj["時"] || "";
      let g = obj["性"] || obj["性別"] || "";
      let cal = obj["曆法"] === "陰曆" || obj["曆法"] === "lunar" ? "lunar" : "solar";
      let leapStr = String(obj["潤月"] || obj["閏月"] || "").toUpperCase();
      let leap = leapStr === "TRUE" || leapStr === "是";
      let notes = obj["註"] || obj["備註"] || "";
      let father = obj["父"] || "";
      let mother = obj["母"] || "";
      let spouse = obj["妻"] || obj["配偶"] || "";
      let child = obj["子"] || "";

      let text = "";
      if (y && m && d && h && g) {
        text = `${y}${m}${d}${h}${g}`;
      } else if (y) {
        text = y;
      }

      newPresets.push({
        id: Date.now() + i + Math.random(),
        cat1: cat1, cat2: cat2, category: cat2, name: name, text: text,
        yearType: yt, calendar: cal, isLeap: leap, notes: notes,
        father: father, mother: mother, spouse: spouse, child: child,
      });
    }

    if (newPresets.length > 0) {
      savedPresets = newPresets;
      localStorage.setItem("ziwei_presets_v3", JSON.stringify(savedPresets));
      renderPresetModalRows();
      renderPresetsBar();
      showMessage(`成功匯入 ${newPresets.length} 筆命盤資料！請檢視列表是否正確。`);
    } else {
      showMessage("檔案內無有效資料。");
    }
  } catch (e) {
    console.error(e);
    showMessage("解析檔案發生錯誤，請確認是否為標準格式。");
  }
}

function importFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const fileName = file.name.toLowerCase();
  const reader = new FileReader();

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvString = XLSX.utils.sheet_to_csv(worksheet);
        applyImportedCSVData(csvString);
      } catch (err) {
        console.error(err);
        showMessage("Excel 檔案解析失敗。");
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    reader.onload = function (e) {
      let text = e.target.result;
      if (!text.includes("名字") && !text.includes("年")) {
        const readerBig5 = new FileReader();
        readerBig5.onload = function (eBig5) {
          applyImportedCSVData(eBig5.target.result);
        };
        readerBig5.readAsText(file, "Big5");
      } else {
        applyImportedCSVData(text);
      }
    };
    reader.readAsText(file, "utf-8");
  }
  event.target.value = "";
}

function importFromPaste() {
  const pasteText = document.getElementById("paste-input").value.trim();
  if (!pasteText) {
    return showMessage("請先在輸入框中貼上資料！");
  }

  let lines = pasteText.split(/\r?\n/);
  let csvContent = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    let cols = line.includes("\t") ? line.split("\t") : line.split(/\s+/);
    let csvRow = cols.map((col) => {
        let s = String(col).replace(/"/g, '""');
        return `"${s}"`;
      }).join(",");
    csvContent += csvRow + "\n";
  }

  applyImportedCSVData(csvContent);
  document.getElementById("paste-input").value = "";
}