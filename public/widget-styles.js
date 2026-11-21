(() => {
  const variants = ['classic', 'wash', 'corner', 'band', 'rail'];
  const storageKey = 'inbox-widget-style';
  const root = document.documentElement;
  const requested = new URL(location.href).searchParams.get('widgetStyle');
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch {}
  let selected = variants.includes(requested) ? requested : variants.includes(saved) ? saved : 'wash';
  root.dataset.widgetStyle = selected;

  const labels = {
    lv: ['Noformējums', 'Sākotnējais', 'Maiga pāreja', 'Stūra gaisma', 'Krāsaina galvene', 'Sānu līnija'],
    ru: ['Оформление', 'Прежний вид', 'Мягкая заливка', 'Свечение из угла', 'Цветная шапка', 'Боковая полоска'],
    en: ['Appearance', 'Original', 'Soft wash', 'Corner glow', 'Tinted header', 'Side accent'],
    lt: ['Išvaizda', 'Pradinis', 'Švelnus perėjimas', 'Kampo švytėjimas', 'Spalvota antraštė', 'Šoninė linija'],
    et: ['Kujundus', 'Algne', 'Pehme üleminek', 'Nurga kuma', 'Värviline päis', 'Külgjoon']
  };
  const language = new URL(location.href).searchParams.get('lang') || 'lv';
  const copy = labels[language] || labels.lv;
  document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.createElement('aside');
    toolbar.className = 'widget-style-picker';
    toolbar.setAttribute('aria-label', copy[0]);
    const title = document.createElement('span');
    title.className = 'widget-style-picker-title';
    title.textContent = copy[0];
    const choices = document.createElement('div');
    choices.className = 'widget-style-choices';
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-label', copy[0]);
    function update() {
      root.dataset.widgetStyle = selected;
      for (const button of choices.children) button.setAttribute('aria-pressed', String(button.dataset.style === selected));
    }
    variants.forEach((variant, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.style = variant;
      const number = document.createElement('span');
      number.className = 'widget-style-number';
      number.textContent = String(index + 1);
      button.append(number, document.createTextNode(copy[index + 1]));
      button.addEventListener('click', () => {
        selected = variant;
        try { localStorage.setItem(storageKey, selected); } catch {}
        const url = new URL(location.href);
        url.searchParams.set('widgetStyle', selected);
        history.replaceState(history.state, '', url);
        update();
      });
      choices.append(button);
    });
    toolbar.append(title, choices);
    document.body.append(toolbar);
    update();
  });
})();
