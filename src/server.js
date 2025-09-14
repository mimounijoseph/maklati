const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { i18next, middleware } = require('./i18n.client');

const app = express();
app.use(cookieParser());
app.use(middleware.handle(i18next));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const lang = req.language || 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  res.render('index', { t: req.t, lang, dir });
});

app.post('/api/lang/:lng', (req, res) => {
  const { lng } = req.params;
  if (!['en','fr','ar'].includes(lng)) return res.status(400).json({ error: 'Invalid language' });
  res.cookie('i18next', lng, { httpOnly: false, sameSite: 'lax', maxAge: 31536000000 });
  res.json({ ok: true, lang: lng });
});

app.get('/api/hello', (req, res) => {
  res.json({
    lang: req.language,
    appName: req.t('appName'),
    hello: req.t('hello', { name: 'Youssef' }),
    price: req.t('currency_mad', { value: 49.9 })
  });
});

app.listen(3000, () => console.log('➡ http://localhost:3000'));
