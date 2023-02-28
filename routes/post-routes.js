/*
======== EXPRESS ROUTER ==========
из-за большого количества возможных роутов в одном файле сервера app.js могут возникать проблемы
для этого отдельные групы роутов выносятся в отдельные файлы по категориям, создается папка проекта /routes
создаются файлы post-routes.js / contact-routes.js

внутри файла импортируется экспресс и создается роутер как результат возврата функции express.Router()
далее этот роутер используется по аналогии с обычным app внутри основного файла сервера
после чего необходимо экспортировать данных роутер из файла и импортировать как postRoutes / contactRoutes в основном файле сервера::

const express = require('express');
const router = express.Router();

router.get('/contacts/', (req, res) => {});
...
router.post('/contacts/', (req, res) => {});

module.exports = router;
(/routes/contact-routes.js)
также в случае если роутер исплоьзует модель, то нужно перенести импорт модели из основного файла в дочерний.

далее в основном файле сервера app добавляем::
const contactRoutes = require('./routes/contact-routes.js');
app.use(contactRoutes);
==================================
*/
const express = require('express');
const router = express.Router();
const {
  getPostsPage,
  getAddPostPage,
  getPostPage,
  getEditPostPage
} = require('../controllers/post-controller');

router.get('/posts', getPostsPage);
router.get('/posts/add', getAddPostPage);
router.get('/posts/:id', getPostPage);
router.get('/posts/edit/:id', getEditPostPage);

module.exports = router;