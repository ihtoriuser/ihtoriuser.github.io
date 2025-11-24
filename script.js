const app = {
    currentMethod: 'cinquain',
    menuTimeout: null,

    defaults: {
        cinquain: `
# № | Термин | 2 Прилагательных | 3 Глагола | Фраза | Синоним
1 | Переобучение | Сложное, Шумное | Запоминает, Ошибается, Проваливается | Работает только на тренировке | High Variance
2 | Недообучение | Простая, Глупая | Игнорирует, Упрощает, Не понимает | Не может выучить данные | High Bias
3 | Валидация | Честная, Независимая | Проверяет, Оценивает, Контролирует | Защита от самообмана | Тестирование
4 | Регуляризация | Строгая, Ограничивающая | Штрафует, Упрощает, Сглаживает | Бритва Оккама в действии | Лечение
5 | Dropout | Случайный, Забывчивый | Выключает, Разряжает, Укрепляет | Не полагайся на одного | Прореживание
6 | L1 (Lasso) | Жесткая, Отбирающая | Зануляет, Убирает, Фильтрует | Оставляет только важное | Отбор фич
7 | L2 (Ridge) | Мягкая, Сглаживающая | Уменьшает, Ограничивает, Распределяет | Не дает весам расти | Весовой распад
8 | Данные | Шумные, Грязные | Собираем, Чистим, Размечаем | Мусор на входе - мусор на выходе | Датасет
9 | Аугментация | Разная, Искусственная | Поворачивает, Искажает, Множит | Бесплатные новые примеры | Обогащение
10 | Early Stop | Своевременная, Экономная | Следит, Останавливает, Сохраняет | Уйти пока выигрываешь | Прерывание
11 | Метрика | Точная, Числовая | Измеряет, Сравнивает, Показывает | Линейка для ума модели | Оценка
12 | Bias | Высокое, Ошибочное | Промахивается, Усредняет, Огрубляет | Вижу мир слишком просто | Предубеждение
13 | Variance | Высокий, Чувствительный | Скачет, Колеблется, Реагирует | Вижу то, чего нет | Разброс
14 | Сложность | Избыточная, Необходимая | Растет, Влияет, Определяет | Баланс между простотой и хаосом | Емкость
15 | Обобщение | Хорошее, Стабильное | Работает, Предсказывает, Понимает | Главная цель обучения | Generalization
`,
        cluster: `
ПРОБЛЕМЫ ОБУЧЕНИЯ
  ПЕРЕОБУЧЕНИЕ
    Ошибка Train ≈ 0
    Ошибка Test >> 0
    Сложная архитектура
    Запоминание шума
  ЛЕЧЕНИЕ ПЕРЕОБУЧЕНИЯ
    Регуляризация (L1/L2)
    Dropout
    Early Stopping
    Аугментация данных
  НЕДООБУЧЕНИЕ
    Слишком простая модель
    Мало признаков
    Низкая точность везде
  ЛЕЧЕНИЕ НЕДООБУЧЕНИЯ
    Усложнить сеть
    Feature Engineering
    Уменьшить регуляризацию
`,
        mindmap: `
Жизненный цикл ML
  1. Подготовка Данных
    Сбор и Парсинг
    Очистка (Outliers)
    Разметка
    Балансировка классов
    Сплит
  2. Выбор Модели
    Baseline (ЛогРег)
    Сложные (DL)
    Ансамбли
  3. Обучение
    Гиперпараметры
    Кросс-валидация
    Борьба с переобучением
  4. Оценка и Деплой
    Метрики (F1)
    A/B Тестирование
    Мониторинг
`,
        tchart: `
ТЕРМИН: DEEP LEARNING

ПЛЮСЫ
Высокая точность на больших данных
Автоматическое извлечение признаков
Работа с фото и текстом
State-of-the-art результаты

МИНУСЫ
Огромный риск переобучения
Требуют мощных GPU
"Черный ящик" (сложная интерпретация)
Нужны миллионы примеров
`,
        scamper: `
# Модификация | Исходное | Новое | Итог
Substitute | Полносвязные | Сверточные (CNN) | Эффективность для фото
Combine | L1 и L2 | ElasticNet | Гибкость отбора
Adapt | Обучение с 0 | Transfer Learning | Скорость на малых данных
Modify | Sigmoid | ReLU | Решение затухания градиента
Put to other use | Dropout (Train) | MC Dropout (Test) | Оценка неуверенности
Eliminate | Все фичи | Feature Selection | Меньше шума
Reverse | Все слои | Fine-tuning | Тонкая настройка
`,
        venn: `
[LEFT]
Заголовок: ПЕРЕОБУЧЕНИЕ
Текст:
• Модель слишком гибкая
• Запоминает шум
• Ошибка Train ≈ 0
• Ошибка Test высокая

[RIGHT]
Заголовок: НЕДООБУЧЕНИЕ
Текст:
• Модель слишком жесткая
• Игнорирует структуру
• Ошибка Train высокая
• Ошибка Test высокая

[CENTER]
Пересечение:
ОБЩАЯ ПРОБЛЕМА:
Низкая способность
к обобщению.
Провал в продакшене.
`,
        fishbone: `
ПРОБЛЕМА:
НИЗКОЕ КАЧЕСТВО
НА ТЕСТЕ

ПРИЧИНЫ (Верх):
Мало данных
Много шума
Сложная сеть
Нет регуляризации
Мультиколлинеарность

ФАКТЫ (Низ):
Ошибка Train -> 0
Ошибка Val растет
Веса огромные
Модель нестабильна
Долгое обучение

ВЫВОД:
МОДЕЛЬ НЕ ГОТОВА.
НУЖЕН РЕФАКТОРИНГ.
`,
        fan: `
ВОПРОС: Какой метод регуляризации выбрать?

# Критерии
Простота, Отбор фич, Для DeepLearning, Скорость, Интерпретация

# Методы и Оценки
L1 (Lasso): +, +, -, +, -
L2 (Ridge): +, -, +, +, -
Dropout: +, -, +, +, -
Early Stop: +, -, +, +, +

ИТОГ: Early Stopping побеждает (4 плюса) как самый универсальный.
`,
        swot: `
ПРЕДМЕТ: Deep Learning на малых данных

STRENGTHS
• Потенциал высокой точности
• Поиск нелинейных паттернов
• Transfer Learning

WEAKNESSES
• Гарантированное переобучение
• Сложность настройки
• Высокая стоимость

OPPORTUNITIES
• Аугментация (синтетика)
• Жесткая регуляризация
• Сбор новых данных

THREATS
• Запоминание шума
• Провал в продакшене
• Data Drift

ИТОГ: Риск высок. Рекомендуется начать с Random Forest.
`,
        lotus: `
ЦЕНТР: БОРЬБА С ПЕРЕОБУЧЕНИЕМ

1. Аугментация
Поворот, Сдвиг, Зум, Шум, Mixup, Cutout, Отражение, ГАНы

2. Данные
Сбор, Очистка, Баланс, Разметка, Валидация, Сплит, Фичи, Норма

3. Архитектура
Меньше слоев, Меньше нейронов, Pooling, 1x1 Conv, Skip Conn, Pruning, Simple Base, Distillation

4. Регуляризация
L1 Lasso, L2 Ridge, ElasticNet, Weight Decay, Max Norm, Constraints, Spectral, Entropy

5. Слои
Dropout, Spatial Drop, DropBlock, DropConnect, Stoch Depth, Noise Inj, Batch Norm, Layer Norm

6. Остановка
Early Stop, Patience, Restore Best, Monitor Loss, Min Delta, Epoch Limit, Checkpoint, Threshold

7. Ансамбли
Bagging, Boosting, Stacking, Voting, Snapshot, Average, Random Forest, XGBoost

8. Параметры
Learn Rate, Decay, Batch Size, Optimizer, Momentum, Scheduler, Warmup, Grad Clip
`
    },

    init: () => {
        app.data = JSON.parse(JSON.stringify(app.defaults));
        app.initMenu();
        app.switchMethod('cinquain');
    },

    initMenu: () => {
        const nav = document.getElementById('topNav');
        const trigger = document.getElementById('menuTrigger');
        setTimeout(() => nav.classList.add('hidden'), 3000);
        trigger.addEventListener('mouseenter', () => nav.classList.remove('hidden'));
        nav.addEventListener('mouseenter', () => nav.classList.remove('hidden'));
        nav.addEventListener('mouseleave', () => setTimeout(() => nav.classList.add('hidden'), 1000));
    },

    switchMethod: (m) => {
        app.currentMethod = m;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`button[onclick="app.switchMethod('${m}')"]`).classList.add('active');
        app.render();
    },

    openModal: () => {
        document.getElementById('dataInput').value = app.data[app.currentMethod].trim();
        document.getElementById('editorModal').style.display = 'flex';
    },
    closeModal: () => document.getElementById('editorModal').style.display = 'none',
    saveAndRender: () => {
        app.data[app.currentMethod] = document.getElementById('dataInput').value;
        app.render();
        app.closeModal();
    },

    render: () => {
        const c = document.getElementById('canvasContainer');
        c.innerHTML = '';
        const raw = app.data[app.currentMethod];
        const m = app.currentMethod;

        if(['cinquain', 'tchart', 'scamper', 'venn', 'swot', 'lotus'].includes(m)) {
            let content = '';
            if(m==='cinquain') content = app.getHtmlTable(raw);
            if(m==='tchart') content = app.getHtmlTChart(raw);
            if(m==='scamper') content = app.getHtmlScamper(raw);
            if(m==='venn') content = app.getHtmlVenn(raw);
            if(m==='swot') content = app.getHtmlSWOT(raw);
            if(m==='lotus') content = app.getHtmlLotus(raw);
            c.innerHTML = `<div class="viz-padding">${content}</div>`;
        } else {
            if(m==='cluster') app.drawCluster(c, raw);
            if(m==='mindmap') app.drawMindmap(c, raw);
            if(m==='fishbone') app.drawFishbone(c, raw);
            if(m==='fan') app.drawFan(c, raw);
        }
    },

    // --- HTML HELPERS ---
    getHtmlTable: (raw) => {
        const lines = raw.trim().split('\n');
        let h = `<table class="viz-table"><thead><tr>`;
        lines[0].replace('#','').split('|').forEach(x=>h+=`<th>${x.trim()}</th>`);
        h+=`</tr></thead><tbody>`;
        for(let i=1; i<lines.length; i++) h+=`<tr>`+lines[i].split('|').map(x=>`<td>${x.trim()}</td>`).join('')+`</tr>`;
        return h+`</tbody></table>`;
    },
    getHtmlScamper: (raw) => {
        const lines = raw.trim().split('\n');
        let h = `<table class="viz-table"><thead><tr>`;
        lines[0].replace('#','').split('|').forEach(x=>h+=`<th>${x.trim()}</th>`);
        h+=`</tr></thead><tbody>`;
        const colors = ['#ffe4e1', '#e0ffff', '#f0fff0', '#fffacd', '#e6e6fa', '#fff0f5', '#f5f5dc'];
        for(let i=1; i<lines.length; i++) {
            h+=`<tr style="background-color:${colors[(i-1)%colors.length]}">`+lines[i].split('|').map(x=>`<td>${x.trim()}</td>`).join('')+`</tr>`;
        }
        return h+`</tbody></table>`;
    },
    getHtmlTChart: (raw) => {
        const lines = raw.split('\n');
        const term = lines[1].replace('ТЕРМИН:','').trim();
        let l=[], r=[], cur=null;
        lines.forEach(x=>{ if(x.includes('ПЛЮСЫ')) cur=l; else if(x.includes('МИНУСЫ')) cur=r; else if(x.trim() && cur && !x.includes('ТЕРМИН')) cur.push(x.trim()); });
        return `<div class="t-container"><div class="t-header">${term}</div><div class="t-body"><div class="t-col"><div class="t-title t-plus">ПЛЮСЫ</div>${l.map(i=>`<div class="t-item"><span class="t-bullet t-plus">+ </span>${i}</div>`).join('')}</div><div class="t-col"><div class="t-title t-minus">МИНУСЫ</div>${r.map(i=>`<div class="t-item"><span class="t-bullet t-minus">- </span>${i}</div>`).join('')}</div></div></div>`;
    },
    getHtmlVenn: (raw) => {
        const parse = (k) => { const r = new RegExp(`\\[${k}\\]([\\s\\S]*?)(?=\\[|$)`); const m = raw.match(r); return m ? {title:m[1].split('\n')[1].replace('Заголовок:',''), text:m[1].split('\n').slice(2).join('\n').replace('Текст:','')} : {title:'',text:''}; };
        const L = parse('LEFT'), R = parse('RIGHT'), C = parse('CENTER');
        return `<div class="venn-wrapper"><div class="venn-circle v-left"><div class="venn-h" style="color:#1e40af">${L.title}</div><div class="venn-p">${L.text}</div></div><div class="venn-circle v-right"><div class="venn-h" style="color:#991b1b">${R.title}</div><div class="venn-p">${R.text}</div></div><div class="v-intersect">${C.text.replace('Пересечение:','').replace(/\n/g,'<br>')}</div></div>`;
    },
    getHtmlSWOT: (raw) => {
        const parse = (k) => { const r=new RegExp(`${k}([\\s\\S]*?)(?=[A-Z]+|$)`); const m=raw.match(r); return m?m[1].trim():''; };
        const list = (t) => `<ul class="swot-list">${t.split('\n').map(l=>`<li>${l.replace(/^[•-]\s*/,'')}</li>`).join('')}</ul>`;
        return `<h2 style="text-align:center; margin-bottom:20px;">${raw.split('\n')[1].replace('ПРЕДМЕТ:','')}</h2><div class="swot-grid"><div class="swot-card bg-s"><h3>Strengths</h3>${list(parse('STRENGTHS'))}</div><div class="swot-card bg-w"><h3>Weaknesses</h3>${list(parse('WEAKNESSES'))}</div><div class="swot-card bg-o"><h3>Opportunities</h3>${list(parse('OPPORTUNITIES'))}</div><div class="swot-card bg-t"><h3>Threats</h3>${list(parse('THREATS'))}</div></div><div class="swot-footer">${raw.split('ИТОГ:')[1]}</div>`;
    },
    getHtmlLotus: (raw) => {
        const lines=raw.split('\n').filter(l=>l.trim());
        const map = [0, 1, 2, 3, -1, 4, 5, 6, 7];
        let html = `<div class="lotus-grid">`;
        map.forEach(idx => { html += `<div class="lotus-block">`; if(idx===-1) map.forEach(x => html += `<div class="lotus-cell ${x===-1?'l-main':'l-sub'}">${x===-1?lines[0].replace('ЦЕНТР:',''):lines[x*2+1].trim().split('.')[1]}</div>`); else { const items=lines[idx*2+2].split(','); for(let i=0; i<9; i++) html += `<div class="lotus-cell ${i===4?'l-sub':''}">${i===4?lines[idx*2+1].trim().split('.')[1]:(items[i<4?i:i-1]||'')}</div>`; } html += `</div>`; });
        return html + `</div>`;
    },

    // --- SVG DRAWING (High Quality Text) ---

    wrapSvgText: (textSelection, width) => {
        textSelection.each(function() {
            let text = d3.select(this), words = text.text().split(/\s+/).reverse(), word, line = [], lineNumber = 0, lineHeight = 1.2, y = text.attr("y"), dy = parseFloat(text.attr("dy")||0);
            let tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word); tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop(); tspan.text(line.join(" ")); line = [word];
                    tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
            // Center vertically
            const totalHeight = (lineNumber + 1) * lineHeight;
            text.selectAll('tspan').attr('dy', (d, i) => ((i - lineNumber/2) * 1.2 + 0.3) + "em");
        });
    },

    drawCluster: (c, raw) => {
        const data = app.parseTree(raw);
        const w = 1600, h = 1000;
        const svg = d3.select(c).append('svg').attr('width', w).attr('height', h).call(d3.zoom().scaleExtent([0.1, 5]).on("zoom", e => g.attr("transform", e.transform)));
        const g = svg.append('g');
        const root = d3.hierarchy(data);
        const links = root.links();
        const nodes = root.descendants();
        const colors = d3.scaleOrdinal(d3.schemeSet3);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).distance(180))
            .force("charge", d3.forceManyBody().strength(-2000))
            .force("center", d3.forceCenter(w/2, h/2))
            .force("collide", d3.forceCollide().radius(100));

        for (let i = 0; i < 300; ++i) simulation.tick();

        g.selectAll('line').data(links).enter().append('line').attr("x1", d=>d.source.x).attr("y1", d=>d.source.y).attr("x2", d=>d.target.x).attr("y2", d=>d.target.y).attr("stroke", "#999").attr("stroke-width", 2);
        const node = g.selectAll('g').data(nodes).enter().append('g').attr("transform", d => `translate(${d.x},${d.y})`);
        
        node.append("ellipse").attr("rx", d=>d.depth===0?100:80).attr("ry", d=>d.depth===0?70:50).attr("fill", d=>d.depth===0?'#2563eb':colors(d.data.name)).attr("stroke", "#333").attr("stroke-width", 2);
        node.append("text").attr("x", 0).attr("y", 0).attr("text-anchor", "middle")
            .style("font-family","Roboto").style("font-weight","bold").style("font-size", "12px")
            .style("fill", d=>d.depth===0?'white':'black')
            .text(d => d.data.name).call(app.wrapSvgText, 120);
    },

    drawMindmap: (c, raw) => {
        const data = app.parseTree(raw);
        const w = 1600, h = 1200;
        const svg = d3.select(c).append('svg').attr('width', w).attr('height', h).call(d3.zoom().scaleExtent([0.1, 5]).on("zoom", e => g.attr("transform", e.transform)));
        const g = svg.append('g').attr('transform', 'translate(100,50)');
        const root = d3.hierarchy(data);
        const tree = d3.tree().size([h-100, w-400]);
        tree(root);
        const color = d3.scaleOrdinal(d3.schemeSet2);

        g.selectAll('path').data(root.links()).enter().append('path').attr('fill','none').attr('stroke-width', 3).attr('stroke', d => d.source.depth===0 ? color(d.target.data.name) : color(d.source.data.name)).attr('d', d3.linkHorizontal().x(d=>d.y).y(d=>d.x));
        const node = g.selectAll('g').data(root.descendants()).enter().append('g').attr("transform", d => `translate(${d.y},${d.x})`);
        node.append('rect').attr('y',-25).attr('height',50).attr('rx',10).attr('width', 200).attr('fill','white').attr('stroke-width',2).attr('stroke', d => d.depth===0 ? '#333' : (d.depth===1 ? color(d.data.name) : color(d.parent.data.name)));
        node.append('text').attr('x', 100).attr('y', 0).attr('text-anchor','middle').text(d=>d.data.name)
            .style("font-family","Roboto").style("font-weight","bold").style("font-size", "12px").call(app.wrapSvgText, 180);
    },

    drawFishbone: (c, raw) => {
        let head='', tail='', causes=[], facts=[], section='';
        raw.split('\n').forEach(l=>{ if(l.includes('ПРОБЛЕМА')) section='H'; else if(l.includes('ВЫВОД')) section='T'; else if(l.includes('ПРИЧИНЫ')) section='C'; else if(l.includes('ФАКТЫ')) section='F'; else if(l.trim()) { if(section==='H') head+=l+' '; if(section==='T') tail+=l+' '; if(section==='C') causes.push(l.trim()); if(section==='F') facts.push(l.trim()); }});

        const W=1600, H=900;
        const svg = d3.select(c).append('svg').attr('width', W).attr('height', H).call(d3.zoom().scaleExtent([0.1, 5]).on("zoom", e => g.attr("transform", e.transform)));
        const g = svg.append('g');
        
        g.append('text').attr('x', 150).attr('y', H/2-90).attr('text-anchor','middle').attr('font-weight','bold').attr('font-size','20px').text("ПРОБЛЕМА");
        g.append('text').attr('x', W-150).attr('y', H/2-90).attr('text-anchor','middle').attr('font-weight','bold').attr('font-size','20px').text("ВЫВОД");

        g.append('rect').attr('x', 50).attr('y', H/2-60).attr('width', 200).attr('height', 120).attr('rx',20).attr('fill','#2563eb');
        g.append('text').attr('x', 150).attr('y', H/2).attr('text-anchor','middle').attr('fill','white').attr('font-weight','bold').text(head).call(app.wrapSvgText, 180);

        g.append('rect').attr('x', W-250).attr('y', H/2-60).attr('width', 200).attr('height', 120).attr('rx',20).attr('fill','#2563eb');
        g.append('text').attr('x', W-150).attr('y', H/2).attr('text-anchor','middle').attr('fill','white').attr('font-weight','bold').text(tail).call(app.wrapSvgText, 180);

        g.append('line').attr('x1', 250).attr('y1', H/2).attr('x2', W-250).attr('y2', H/2).attr('stroke','#333').attr('stroke-width',6);

        const drawRibs = (list, isTop) => {
            const startX=350, gap=(W-600)/list.length;
            g.append('text').attr('x', W/2).attr('y', isTop?50:H-30).attr('text-anchor','middle').attr('font-size','24px').attr('font-weight','900').text(isTop?"ПРИЧИНЫ":"ФАКТЫ");
            list.forEach((txt, i) => {
                const x=startX+i*gap, yEnd=isTop?H/2-220:H/2+220;
                g.append('line').attr('x1', x).attr('y1', H/2).attr('x2', x-40).attr('y2', yEnd).attr('stroke','#64748b').attr('stroke-width',3);
                const bx=x-40-100, by=isTop?yEnd-60:yEnd;
                g.append('rect').attr('x', bx).attr('y', by).attr('width', 200).attr('height', 60).attr('fill','white').attr('stroke','black').attr('rx',5);
                g.append('text').attr('x', bx+100).attr('y', by+30).attr('text-anchor','middle').attr('font-size','12px').attr('font-weight','bold').text(txt).call(app.wrapSvgText, 190);
            });
        };
        drawRibs(causes, true); drawRibs(facts, false);
    },

    drawFan: (c, raw) => {
        const lines=raw.split('\n').filter(l=>l.trim());
        let question=lines[0].replace('ВОПРОС:', '').trim(), criteria=[], methods=[], result="";
        let section='';
        lines.forEach(l=>{ if(l.includes('Критерии')) section='C'; else if(l.includes('Методы')) section='M'; else if(l.includes('ИТОГ')) result=l; else if(l.trim()) { if(section==='C') criteria=l.split(',').map(s=>s.trim()); if(section==='M') { const p=l.split(':'); methods.push({name:p[0].trim(), scores:p[1].split(',').map(s=>s.trim())}); } } });

        const W=1600, H=1000, cx=W/2, cy=H-50, rOut=750;
        const svg = d3.select(c).append('svg').attr('width', W).attr('height', H).call(d3.zoom().scaleExtent([0.5, 3]).on("zoom", e => bg.attr("transform", e.transform)));
        const bg = svg.append('g');

        bg.append('text').attr('x', cx).attr('y', 50).attr('text-anchor','middle').attr('font-size','28px').attr('font-weight','bold').attr('fill','#1e3a8a').text(question);

        const count=criteria.length, step=Math.PI/(count+1);
        criteria.forEach((crit, i) => {
            const ang = -Math.PI + step * (i+1);
            bg.append('line').attr('x1', cx).attr('y1', cy).attr('x2', cx+rOut*Math.cos(ang)).attr('y2', cy+rOut*Math.sin(ang)).attr('stroke', '#e2e8f0').attr('stroke-width', 80);
            bg.append('text').attr('transform', `translate(${cx+(rOut-40)*Math.cos(ang)}, ${cy+(rOut-40)*Math.sin(ang)}) rotate(${(ang*180/Math.PI)+90})`).attr('text-anchor','end').attr('font-weight','bold').attr('fill','#475569').text(crit);
        });

        methods.forEach((m, i) => {
            const r = 300 + i * 120;
            const s = (m.scores.join('').match(/\+/g)||[]).length;
            const isWin = m.name.includes('Early');
            const arc = d3.arc()({innerRadius: r-5, outerRadius: r+5, startAngle: -Math.PI/2, endAngle: Math.PI/2});
            bg.append('path').attr('d', arc).attr('transform', `translate(${cx},${cy})`).attr('fill', isWin ? '#22c55e' : '#94a3b8');
            bg.append('text').attr('x', cx - r - 20).attr('y', cy).attr('text-anchor','end').attr('font-weight','bold').text(m.name);
            bg.append('text').attr('x', cx + r + 30).attr('y', cy).attr('font-weight','bold').attr('font-size','20px').attr('fill', isWin?'#166534':'black').text(`= ${s}`);
            m.scores.forEach((sc, j) => {
                const ang = -Math.PI + step * (j+1);
                bg.append('text').attr('x', cx+r*Math.cos(ang)).attr('y', cy+r*Math.sin(ang)).attr('text-anchor','middle').attr('dy',10).attr('font-weight','900').attr('font-size','32px').attr('fill', sc.includes('+')?'#064e3b':'#7f1d1d').text(sc);
            });
        });
        bg.append('path').attr('d', `M${cx-200},${cy} L${cx+200},${cy} L${cx},${cy-150} Z`).attr('fill', '#fefce8').attr('stroke', '#facc15').attr('stroke-width', 2);
        bg.append('text').attr('x', cx).attr('y', cy-50).attr('text-anchor','middle').attr('font-size','18px').attr('font-weight','bold').text(result);
    },

    parseTree: (text) => {
        const lines = text.split('\n').filter(l => l.trim());
        const root = { name: lines[0], children: [] };
        const stack = [{ node: root, indent: 0 }];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const indent = line.search(/\S/);
            const name = line.trim();
            while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
            const node = { name: name, children: [] };
            stack[stack.length - 1].node.children.push(node);
            stack.push({ node: node, indent: indent });
        }
        return root;
    },

    download: () => {
        const container = document.getElementById('canvasContainer');
        const svg = container.querySelector('svg');
        if(svg) {
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){ source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"'); }
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement("canvas");
                canvas.width = 3200; canvas.height = 1800;
                const context = canvas.getContext("2d");
                context.fillStyle = "white"; context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                const a = document.createElement("a");
                a.download = `MTS_201_${app.currentMethod}.png`;
                a.href = canvas.toDataURL("image/png");
                a.click();
            };
            img.src = url;
        } else {
            html2canvas(container, { scale: 3, backgroundColor: '#ffffff' }).then(cvs => {
                const a = document.createElement("a");
                a.download = `MTS_201_${app.currentMethod}.png`;
                a.href = cvs.toDataURL("image/png");
                a.click();
            });
        }
    },
    reset: () => { if(confirm("Сбросить?")) { app.data = JSON.parse(JSON.stringify(app.defaults)); app.render(); } }
};

window.onload = app.init;