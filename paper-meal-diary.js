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
  let selectionMaster = [];
  let selectionStatus = 'loading';
  const quickGrams = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60, 65, 75, 80, 100, 120, 150, 200, 250, 300];

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
      marksLine.textContent = marks.length ? marks.map(mark => '○ ' + mark + (mark === '第4群 油脂類' && points == null ? '（量不明）' : '')).join('　') : '食品群未確認';
      const score = document.createElement('small');
      score.textContent = points == null ? '点数未計算' : format(points);
      row.append(name, marksLine, score);
      return row;
    }));
  }

  function readMeal(meal) {
    const {scores, unmatched, rows} = scoreMemo(meal.mealMemo || '');
    for (const ingredient of meal.ingredients || []) {
      const {name, dish, grams, group, category, gramsPerPoint} = ingredient;
      const points = grams == null ? null : grams / gramsPerPoint;
      const phrase = [dish, name].filter(Boolean).join(' ／ ') + (grams == null ? '' : ' ' + grams + 'g');
      rows.push({phrase, marks: ['第' + group + '群 ' + category], points});
      if (points == null) unmatched.push(phrase);
      else scores[group] = (scores[group] || 0) + points;
    }
    return {scores, unmatched, rows};
  }

  function mealPoints(meal, scores = readMeal(meal).scores) {
    return groups.map(group => meal.mealPoints?.[group] ?? scores[group] ?? null);
  }

  function updateDay(summary, day) {
    const points = mealDefs.map(([id]) => mealPoints(day[id]));
    const sums = groups.map((_, index) => total(points.map(row => row[index])));
    const recorded = mealDefs.filter(([id]) => {
      const meal = day[id];
      return meal.ingredients?.length || meal.mealMemo?.trim() || meal.img || meal.mealTime || Object.keys(meal.mealPoints || {}).length;
    });
    const incomplete = recorded.some(([id]) => {
      const meal = day[id];
      return readMeal(meal).unmatched.length || mealPoints(meal).every(value => value == null);
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
      <h3 class="paperIngredientTitle">料理と食材を記録</h3>
      <label class="paperField">料理名（任意）<input name="ingredientDish" maxlength="100" placeholder="例：魚のホイル焼き"></label>
      <label class="paperField">食材を検索<input type="search" name="ingredientSearch" maxlength="100" autocomplete="off" placeholder="例：ご飯、ささみ、ごま油"></label>
      <label class="paperField">食材の候補<select name="ingredientChoice"><option value="">食材名を検索してください</option></select></label>
      <label class="paperField">食べた量<select name="ingredientAmount">
        <option value="">量がわからない</option>
        ${quickGrams.map(value => `<option value="${value}">${value}g</option>`).join('')}
        <option value="custom">グラムを入力する</option>
      </select></label>
      <label class="paperField" data-custom-grams hidden>食べた量（g）<input type="number" name="ingredientGrams" min="0.1" max="10000" step="0.1" inputmode="decimal"></label>
      <p class="paperHint" data-ingredient-status aria-live="polite"></p>
      <button class="paperAction" type="button" data-add-ingredient disabled>この食材を追加</button>
      <details class="paperLegacy"><summary>メニューの補足・従来のメモ入力</summary>
        <label class="paperField">メニューのメモ<textarea name="mealMemo" rows="3" maxlength="1000"
          placeholder="例：アジフライ"></textarea></label>
      </details>
      <ul class="paperMenu" data-paper-menu aria-label="食材と食品群"></ul>
      <p class="paperHint">1点＝80kcal。量がわからない食材は、食品群だけ記録できます。</p>
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
        <details class="paperLegacy"><summary>朝食・昼食・夕食・間食の記録をまとめて見る</summary><div data-day-meals></div></details>
      </section>`;

    const time = panel.querySelector('[name="mealTime"]');
    const memo = panel.querySelector('[name="mealMemo"]');
    const fields = [...panel.querySelectorAll('[data-point]')];
    time.value = meal.mealTime || '';
    memo.value = meal.mealMemo || '';

    function update() {
      const {scores, unmatched, rows} = readMeal(meal);
      const menu = panel.querySelector('[data-paper-menu]');
      renderMenu(menu, rows);
      const ingredients = meal.ingredients || [];
      [...menu.children].slice(menu.children.length - ingredients.length).forEach((row, index) => {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = '削除';
        remove.setAttribute('aria-label', ingredients[index].name + 'を削除');
        remove.onclick = () => { ingredients.splice(index, 1); update(); };
        row.append(remove);
      });
      const overview = panel.querySelector('[data-day-meals]');
      overview.replaceChildren(...mealDefs.map(([mealId, label]) => {
        const entry = day[mealId];
        const section = document.createElement('section');
        const heading = document.createElement('h4');
        const {rows: mealRows, scores: mealScores} = readMeal(entry);
        const points = mealPoints(entry, mealScores);
        heading.textContent = [label, entry.mealTime, format(total(points))].filter(Boolean).join('　');
        const list = document.createElement('ul');
        list.className = 'paperMenu';
        renderMenu(list, mealRows);
        const subtotal = document.createElement('p');
        subtotal.className = 'paperHint';
        if (points.some(value => value != null)) {
          subtotal.textContent = groups.map((group, index) => '第' + group + '群 ' + format(points[index])).join('　');
        }
        section.append(heading, list, subtotal);
        return section;
      }));
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

    const dish = panel.querySelector('[name="ingredientDish"]');
    const search = panel.querySelector('[name="ingredientSearch"]');
    const choice = panel.querySelector('[name="ingredientChoice"]');
    const amount = panel.querySelector('[name="ingredientAmount"]');
    const custom = panel.querySelector('[name="ingredientGrams"]');
    const add = panel.querySelector('[data-add-ingredient]');
    const feedback = panel.querySelector('[data-ingredient-status]');
    const grams = () => amount.value === '' ? null : Number(amount.value === 'custom' ? custom.value : amount.value);
    const selected = () => choice.value === '' ? null : selectionMaster[Number(choice.value)];

    function updateSelection() {
      const food = selected();
      const value = grams();
      const validAmount = value == null || Number.isFinite(value) && value >= 0.1 && value <= 10000;
      add.disabled = !food || !validAmount;
      custom.closest('label').hidden = amount.value !== 'custom';
      feedback.textContent = food
        ? food.group + ' ' + food.category + ' ／ ' + (value == null ? '量不明' : validAmount ? format(value / food.gramsPerPoint) : '0.1〜10000gで入力してください。')
        : selectionStatus === 'ready' ? '' : selectionStatus === 'loading' ? '食品マスターを読み込んでいます。' : '食品マスターを読み込めませんでした。';
    }

    function findIngredients() {
      const query = key(search.value).toLowerCase();
      const aliases = {'ご飯':'めし・水稲・精白米', 'ごはん':'めし・水稲・精白米', 'ささみ':'ささ身'};
      const match = key(aliases[query] || query).toLowerCase();
      const results = query ? selectionMaster.filter(food => key(food.name).toLowerCase().includes(match)).slice(0, 30) : [];
      const options = results.map(food => new Option(food.name + '（' + food.group + '・' + food.category + '）', food.index));
      const placeholder = query && selectionStatus === 'ready' && !options.length ? '一致する食材がありません' : '食材を選択';
      choice.replaceChildren(new Option(placeholder, ''), ...options);
      updateSelection();
    }

    search.addEventListener('input', findIngredients);
    choice.addEventListener('change', updateSelection);
    amount.addEventListener('change', updateSelection);
    custom.addEventListener('input', updateSelection);
    add.addEventListener('click', () => {
      const food = selected();
      if (!food || add.disabled) return;
      const {name, group, category, gramsPerPoint} = food;
      meal.ingredients ??= [];
      meal.ingredients.push({dish: dish.value.trim(), name, group: Number(group[1]), category, gramsPerPoint, grams: grams()});
      search.value = '';
      amount.value = '';
      custom.value = '';
      findIngredients();
      update();
      search.focus();
    });
    findIngredients();
    time.addEventListener('input', () => { meal.mealTime = time.value; update(); });
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
    .paperField input,.paperField textarea,.paperField select,.paperPoint input{width:100%;min-width:0;border:1px solid #baa89c;border-radius:9px;background:#fff;padding:8px;color:#392e28;font:inherit;font-size:16px}
    .paperField textarea{resize:vertical}
    .paperField[hidden]{display:none}
    .paperIngredientTitle{font-size:16px;margin:6px 0 0}
    .paperAction{padding:10px;min-height:44px;border-radius:9px;border:1px solid #b35418;background:#fff4e8;color:#84380b;font-weight:700}
    .paperAction:disabled{opacity:.55}
    .paperMenu button{grid-column:2;min-height:34px;border:1px solid #baa89c;border-radius:6px;background:#fff;color:#392e28}
    [data-day-meals] h4{margin:10px 0 4px}
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
  window.renderPaperMealMenu = (list, meal) => renderMenu(list, readMeal(meal).rows);

  fetch('food-master.json')
    .then(response => {
      if (!response.ok) throw new Error('Food master unavailable');
      return response.json();
    })
    .then(master => {
      selectionMaster = master.foods.filter(food =>
        /^第[1-4]群$/.test(food.group) && Number.isFinite(food.gramsPerPoint) && food.gramsPerPoint > 0);
      selectionMaster.forEach((food, index) => { food.index = index; });
      selectionStatus = 'ready';
    })
    .catch(() => { selectionStatus = 'failed'; })
    .finally(() => document.querySelector('[name="ingredientSearch"]')?.dispatchEvent(new Event('input')));

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
