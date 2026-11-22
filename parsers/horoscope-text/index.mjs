// Natively written horoscope copy per interface language. Every module has the same shape as lv.mjs.
// HOROSCOPE_LANGS=lv,en limits the loaded languages while a new module is still being written.
const wanted=(process.env.HOROSCOPE_LANGS||'lv,ru,en,lt,et').split(',').map(s=>s.trim()).filter(Boolean);
const load=async name=>{try{return [name,(await import(`./${name}.mjs`)).default];}catch(error){if(error.code==='ERR_MODULE_NOT_FOUND')return [name,null];throw error;}};
export const content=Object.fromEntries((await Promise.all(wanted.map(load))).filter(([,module])=>module));
