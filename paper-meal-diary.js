(() => {
  const groups = [1, 2, 3, 4];
  const pointFormat = new Intl.NumberFormat('ja-JP', {maximumFractionDigits: 2});
  // 炊いた精白米の目安。既存の第4群食品表「めし・水稲精白米」と同じ換算。
  const rice = {group: 4, one_point_weight_g: 50};
  const foods = new Map([['ご飯', rice], ['ごはん', rice], ['白ご飯', rice], ['白ごはん', rice]]);
  const key = value => value.normalize('NFKC').replace(/\s+/g, '');
  const format = value => value == null ? '—' : pointFormat.format(value) + '点';
  const total = values => values.some(value => value != null)
    ? values.reduce((sum, value) => sum + (value ?? 0), 0)
    : null;
  let masterStatus = 'loading';
  let openHistoryKey = '';

  const categories = new Map([
    ...['アジフライ', 'あじフライ', '鯵フライ'].map(name => [name, ['第2群 魚介類', '第4群 油脂類']]),
    ...['ご飯', 'ごはん', '白ご飯', '白ごはん'].map(name => [name, ['第4群 主食']]),
    ['焼き竹輪', ['第2群 魚介類']],
    ['にんじん', ['第3群 野菜']],
    ['大根', ['第3群 野菜']],
    ['里芋', ['第3群 いも']],
    ['しょうゆ', ['第4群 調味料']],
    ['砂糖', ['第4群 砂糖']],
  ]);

  function scoreMemo(memo) {
    const scores = {};
    const unmatched = [];
    const rows = [];
    const phrases = memo.normalize('NFKC').split(/[、,。;\n]+/).map(text => text.trim()).filter(Boolean);

    for (const phrase of phrases) {
      const match = key(phrase).match(/^(.+?)(\d+(?:\.\d+)?)(?:グラム|g)$/i);
      const name = match?.[1] ?? key(phrase);
      const food = foods.get(name);
      const grams = match ? Number(match[2]) : 0;
      const points = food && Number.isFinite(grams) && grams > 0 && grams <= 10000
        ? grams / food.one_point_weight_g
        : null;
      const marks = categories.get(name) ?? (food ? ['第' + food.group + '群'] : []);
      rows.push({phrase, marks, points});
      if (points == null) {
        unmatched.push(phrase);
      } else {
        scores[food.group] = (scores[food.group] || 0) + points;
      }
    }
    return {scores, unmatched, rows};
  }

  function renderMenu(list, rows) {
    list.replaceChildren(...rows.map(({phrase, marks, points}) => {
      const row = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = phrase;
      const marksLine = document.createElement('span');
      marksLine.className = 'paperMenuMarks';
      marksLine.textContent = marks.length ? marks.map(mark => '○ ' + mark + (mark === '第4群 油脂類' ? '（量不明）' : '')).join('　') : '食品群未確認';
      const score = document.createElement('small');
      score.textContent = points == null ? '点数未計算' : format(points);
      row.append(name, marksLine, score);
      return row;
    }));
  }

  function mealPoints(meal) {
    const {scores} = scoreMemo(meal.mealMemo || '');
    return groups.map(group => meal.mealPoints?.[group] ?? scores[group] ?? null);
  }

  function updateDay(summary, day) {
    const points = mealDefs.map(([id]) => mealPoints(day[id]));
    const sums = groups.map((_, index) => total(points.map(row => row[index])));
    const recorded = mealDefs.filter(([id]) => {
      const meal = day[id];
      return meal.mealMemo?.trim() || meal.img || meal.mealTime || Object.keys(meal.mealPoints || {}).length;
    });
    const incomplete = recorded.some(([id]) => {
      const meal = day[id];
      return scoreMemo(meal.mealMemo || '').unmatched.length || mealPoints(meal).every(value => value == null);
    });
    summary.querySelector('[data-day-total]').textContent = format(total(sums));
    summary.querySelector('[data-day-target]').textContent = '設定上の目安 ' + (state.sex === 'male' ? 21 : 15) + '点';
    summary.querySelector('[data-day-note]').textContent = incomplete ? '点数を確認できた分の合計です。' : '';
    groups.forEach((group, index) => {
      summary.querySelector('[data-day-group="' + group + '"]').textContent = format(sums[index]);
    });
  }

  function mount() {
    const workspace = document.querySelector('.mealWorkspace');
    if (!workspace || workspace.querySelector('.paperMeal')) return;
    const id = window.__activeMealId || mealDefs[0][0];
    const day = dayData();
    const meal = day[id];
    const panel = document.createElement('section');
    panel.className = 'paperMeal';
    panel.innerHTML = `
      <label class="paperField">食べた時刻<input type="time" name="mealTime"></label>
      <label class="paperField">メニュー（1品ずつ）<textarea name="mealMemo" rows="3" maxlength="1000"
        placeholder="例：アジフライ&#10;ご飯50g"></textarea></label>
      <ul class="paperMenu" data-paper-menu aria-label="メニューの食品群"></ul>
      <p class="paperHint">量が分かる食品は点数も表示します。1点＝80kcal。</p>
      <div class="paperHeading"><h3>この食事の点数</h3><output data-meal-total>—</output></div>
      <div class="paperGroups">${groups.map(group => `<label class="paperPoint g${group}">第${group}群
        <input type="text" inputmode="decimal" data-point="${group}" maxlength="9" placeholder="—">
        <small data-point-source="${group}"></small></label>`).join('')}</div>
      <p class="paperHint" data-memo-status aria-live="polite"></p>
      <section class="paperDay">
        <div class="paperHeading"><h3>1日の合計</h3><output data-day-total>—</output></div>
        <div class="paperGroups">${groups.map(group => `<div class="paperPoint g${group}">第${group}群
          <strong data-day-group="${group}">—</strong></div>`).join('')}</div>
        <p class="paperHint" data-day-target></p>
        <p class="paperHint" data-day-note></p>
      </section>`;

    const time = panel.querySelector('[name="mealTime"]');
    const memo = panel.querySelector('[name="mealMemo"]');
    const fields = [...panel.querySelectorAll('[data-point]')];
    time.value = meal.mealTime || '';
    memo.value = meal.mealMemo || '';

    function update() {
      const {scores, unmatched, rows} = scoreMemo(meal.mealMemo || '');
      renderMenu(panel.querySelector('[data-paper-menu]'), rows);
      fields.forEach(input => {
        const group = input.dataset.point;
        const manual = meal.mealPoints?.[group];
        const candidate = scores[group];
        if (input !== document.activeElement) {
          input.value = manual ?? (candidate == null ? '' : Number(candidate.toFixed(2)));
        }
        panel.querySelector('[data-point-source="' + group + '"]').textContent =
          manual != null ? '手入力' : (candidate != null ? '自動' : '未入力');
      });
      panel.querySelector('[data-meal-total]').textContent = format(total(mealPoints(meal)));
      panel.querySelector('[data-memo-status]').textContent = masterStatus === 'loading'
        ? '食品マスターを読み込んでいます。'
        : (masterStatus === 'failed' ? '食品マスターを読み込めませんでした。ご飯の換算と手入力は使えます。' : '')
          + (unmatched.length ? ' 点数を確認できなかった記録：' + unmatched.join('、') : '');
      updateDay(panel, day);
    }

    time.addEventListener('input', () => { meal.mealTime = time.value; });
    memo.addEventListener('input', () => { meal.mealMemo = memo.value; update(); });
    fields.forEach(input => {
      input.addEventListener('input', () => {
        const value = key(input.value);
        const group = input.dataset.point;
        if (value && (!/^\d+(?:\.\d{1,2})?$/.test(value) || Number(value) > 1000)) {
          input.setAttribute('aria-invalid', 'true');
          return;
        }
        input.removeAttribute('aria-invalid');
        meal.mealPoints ??= {};
        if (value) meal.mealPoints[group] = Number(value);
        else delete meal.mealPoints[group];
        update();
      });
      input.addEventListener('blur', () => {
        input.removeAttribute('aria-invalid');
        update();
      });
    });

    const legacy = document.createElement('details');
    const historyKey = keyDate(current) + ':' + id;
    legacy.open = openHistoryKey === historyKey;
    legacy.addEventListener('toggle', () => {
      if (legacy.isConnected) openHistoryKey = legacy.open ? historyKey : '';
    });
    legacy.className = 'paperLegacy';
    legacy.innerHTML = '<summary>従来の食品内訳・回数の記録</summary>';
    [...workspace.children].filter(element =>
      element.matches('.groupSummary,.breakdownTitleRow,.breakGroup,.g3box')).forEach(element => legacy.append(element));
    workspace.append(panel, legacy);
    update();
  }

  const style = document.createElement('style');
  style.textContent = `
    .paperMeal,.paperDay{display:grid;gap:8px;margin-top:12px}
    .paperDay{border-top:1px solid var(--line);padding-top:10px}
    .paperField{display:grid;gap:4px;font-weight:700;font-size:14px}
    .paperField input,.paperField textarea,.paperPoint input{width:100%;min-width:0;border:1px solid #baa89c;border-radius:9px;background:#fff;padding:8px;color:#392e28;font:inherit;font-size:16px}
    .paperField textarea{resize:vertical}
    .paperHeading{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .paperHeading h3{font-size:16px;margin:0}
    .paperHeading output{font-weight:800;font-size:18px}
    .paperGroups{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
    .paperPoint{display:grid;gap:4px;min-width:0;padding:6px 3px;text-align:center;border-radius:9px;font-size:13px;font-weight:700}
    .paperPoint input{text-align:center;padding:5px 1px;min-height:36px}
    .paperPoint input[aria-invalid=true]{border-color:#a32028}
    .paperPoint small,.paperHint{font-size:12px;color:#5f5148;line-height:1.55;margin:0;overflow-wrap:anywhere}
    .paperHint:empty,.paperMenu:empty{display:none}
    .paperMenu{display:grid;gap:5px;list-style:none;margin:0;padding:0}
    .paperMenu li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 8px;padding:7px 9px;border:1px solid #e5ddd4;border-radius:8px;background:#fff;overflow-wrap:anywhere;font-size:13px}
    .paperMenuMarks{grid-column:1/-1;color:#554339}
    .paperMenu small{grid-row:1;grid-column:2;color:#5f5148;font-size:11px}
    .paperLegacy{margin-top:14px;font-size:13px}
    .paperLegacy summary{cursor:pointer;min-height:44px;align-content:center}
    .paperPoint.g1{background:#eff7ff}.paperPoint.g2{background:#fff1f4}
    .paperPoint.g3{background:#f1faed}.paperPoint.g4{background:#fff8eb}
  `;
  document.head.append(style);

  const renderOriginal = window.render;
  window.render = function () {
    renderOriginal();
    mount();
  };
  mount();
  window.getPaperMealPoints = mealPoints;
  window.renderPaperMealMenu = (list, memo) => renderMenu(list, scoreMemo(memo || '').rows);

  fetch('general-food-master-verified.json')
    .then(response => {
      if (!response.ok) throw new Error('Food master unavailable');
      return response.json();
    })
    .then(master => {
      for (const food of master.foods) {
        if (food.verified && groups.includes(food.group) && food.one_point_weight_g > 0 && !food.weight_type) {
          foods.set(key(food.name), food);
        }
      }
      masterStatus = 'ready';
    })
    .catch(() => { masterStatus = 'failed'; })
    .finally(() => {
      const panel = document.querySelector('.paperMeal');
      if (panel) panel.querySelector('[name="mealMemo"]').dispatchEvent(new Event('input'));
    });
})();
