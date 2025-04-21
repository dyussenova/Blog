import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createArticle } from '../../store/createArtSlice';
import { updateArticle } from '../../store/listSlice';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import classes from './CreateArticle.module.scss';
import Error from '../../error/error';

function CreateArticle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const isEdit = !!slug;
  const article = location.state?.article;

  const [tags, setTags] = useState([{ id: uuidv4(), value: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');

  const { status = 'idle', error = null } = useSelector(
    (state) => state.createart || {}
  );

  useEffect(() => {
    if (isEdit && article) {
      setTitle(article.title);
      setDescription(article.description);
      setText(article.body);
      setTags(
        article.tagList.length > 0
          ? article.tagList.map((tag) => ({ id: uuidv4(), value: tag }))
          : [{ id: uuidv4(), value: '' }]
      );
    }
  }, [isEdit, article]);

  const handleTagChange = (id, value) => {
    const updatedTags = tags.map((tag) =>
      tag.id === id ? { ...tag, value } : tag
    );
    setTags(updatedTags);
  };

  const addTagField = () => {
    setTags([...tags, { id: uuidv4(), value: '' }]);
  };

  const deleteTagField = (id) => {
    if (tags.length === 1) {
      setTags([{ id: tags[0].id, value: '' }]);
    } else {
      setTags(tags.filter((tag) => tag.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const articleData = {
      title,
      description,
      body: text,
      tagList: tags.map((tag) => tag.value).filter((tag) => tag !== ''),
    };

    if (isEdit) {
      dispatch(updateArticle({ slug, updatedData: articleData }))
        .unwrap()
        .then(() => navigate(`/${slug}`));
    } else {
      dispatch(createArticle(articleData))
        .unwrap()
        .then(() => navigate('/'));
    }
  };

  return (
    <div className={classes.createart}>
      <h2>{isEdit ? 'Edit Article' : 'Create new Article'}</h2>
      <form className={classes.createform} onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={classes.title}
          required
        />

        <label htmlFor="description">Short description</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={classes.title}
          required
        />

        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          name="text"
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={classes.text}
        ></textarea>

        <label>Tags</label>
        {tags.map((tag) => (
          <div key={tag.id} className={classes.tagFieldWrapper}>
            <input
              type="text"
              value={tag.value}
              onChange={(e) => handleTagChange(tag.id, e.target.value)}
              placeholder="Enter a tag"
              className={classes.tags}
            />
            <button
              type="button"
              onClick={() => deleteTagField(tag.id)}
              className={classes.deleteTagBtn}
            >
              Delete
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addTagField}
          className={classes.addTagBtn}
        >
          Add Tag
        </button>

        <button type="submit" className={classes.send}>
          {isEdit ? 'Save' : 'Send'}
        </button>
      </form>

      {status === 'loading' && <p>Sending article...</p>}
      {status === 'failed' && (
        <Error message={error?.general || 'Something went wrong!'} />
      )}
    </div>
  );
}

export default CreateArticle;
