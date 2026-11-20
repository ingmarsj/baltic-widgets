import {icon} from './icons.js';

export function widgetIcon(accent) {
  const mark = document.createElement('span');
  mark.classList.add('widget-heading-icon');
  mark.dataset.accent = accent;
  mark.setAttribute('aria-hidden', 'true');
  mark.append(icon(accent));
  return mark;
}

function headingParts(control, title, accent) {
  const name = document.createElement('span');
  name.className = 'widget-heading-title';
  name.textContent = title;
  const value = document.createElement('span');
  value.className = 'widget-heading-value';
  const arrow = icon('chevron');
  arrow.classList.add('widget-heading-arrow');
  control.append(widgetIcon(accent), name, value, arrow);
  return value;
}

export function widgetCountry(title, accent, select) {
  const control = document.createElement('label');
  control.className = 'widget-heading-control widget-heading-country';
  const value = headingParts(control, title, accent);
  value.setAttribute('aria-hidden', 'true');
  const updateValue = () => { value.textContent = select.selectedOptions[0]?.textContent || ''; };
  updateValue();
  select.addEventListener('change', updateValue);
  control.append(select);
  return {control, updateValue};
}

export function widgetPicker(title, accent) {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'widget-heading-control';
  control.setAttribute('aria-haspopup', 'dialog');
  const value = headingParts(control, title, accent);
  return {control, value};
}
