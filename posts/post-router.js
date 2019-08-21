const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
  // SELECT * FROM Posts;
  db('posts')
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to get posts' });
    });
  // db.select('*').from('posts');
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.select('*')
    .from('posts')
    .where({ id: req.params.id })
    .then(([post]) => {
      if (post === undefined) {
        res.status(404).json({ message: 'invalid message id' });
        return;
      }
      res.json({
        post
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error', message: err });
    });
});

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;

//   db('posts')
//     .where({ id })
//     .then(posts => {
//       const post = posts[0];

//       if (post) {
//         res.json(post);
//       } else {
//         res.status(404).json({ message: 'invalid post id' });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ message: 'failed to get post' });
//     });
// });

router.post('/', (req, res) => {
  const postData = req.body;

  db('posts')
    .insert(postData)
    .then(ids => {
      res.status(201).json({ newPostId: ids[0] });
    })
    .catch(error => {
      console.log('post err', error);
      res.status(500).json({ message: 'Failed to insert post' });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('posts')
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.json({ updated: count });
      } else {
        res.status(404).json({ message: 'Invalid post id' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to update post' });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db('posts')
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.json({ deleted: count });
      } else {
        res.status(404).json({ message: 'invalid post id' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'failed to delete post' });
    });
});

module.exports = router;
