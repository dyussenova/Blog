import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchSinglePage, deleteArticle } from '../../store/listSlice';
import Error from '../../error/error';
import Spinner from '../../spinner/spinner';
import { toggleLike } from '../../store/listSlice';
import like from '../../assets/like.png';
import heart from '../../assets/heart.png';
import Modal from '../Modal';
import defaultAvatar from '../../assets/Rectangle 1.png';
import Markdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

import classes from './Article.module.scss';

function Article() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { singlePage, status, error } = useSelector((state) => state.list);
  const currentUser = useSelector(
    (state) => state.login.user || state.user.user
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSinglePage(slug));
  }, [slug, dispatch]);

  const handleDelete = async () => {
    setIsModalOpen(false);
    await dispatch(deleteArticle(slug))
      .unwrap()
      .then(() => {
        navigate('/');
      });
  };

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  if (status === 'loading') {
    return <Spinner />;
  }

  if (status === 'failed') {
    return <Error message={error} />;
  }

  if (!singlePage) {
    return <div>Статья не найдена.</div>;
  }

  const article = singlePage.article;
  const handleToggleLike = () => {
    dispatch(toggleLike({ slug: article.slug, liked: article.favorited }));
  };
  return (
    <>
      {isModalOpen && (
        <>
          <div className={classes.overlay}></div>
          <Modal
            onConfirm={handleDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        </>
      )}
      <div className={classes.card}>
        <div className={classes.content}>
          <div className={classes.header}>
            <div className={classes.title}>{article.title}</div>
            <div className={classes.like}>
              <button
                className={`${classes.heart} ${
                  article.favorited ? classes.liked : ''
                }`}
                onClick={handleToggleLike}
              >
                <img src={article.favorited ? like : heart} alt="likes" />
                <p>{article.favoritesCount}</p>
              </button>
            </div>
          </div>
          <div className={classes.tags}>
            {article.tagList.length > 0 &&
              article.tagList.map((tag) => (
                <span className={classes.tag} key={uuidv4()}>
                  {tag}
                </span>
              ))}
          </div>
          <p className={classes.text}>{article.description}</p>
          <div className={classes.markdownContent}>
            <Markdown>{article.body}</Markdown>
          </div>
        </div>
        <div className={classes.autor}>
          <div className={classes.autorInfo}>
            <span className={classes.autorName}>{article.author.username}</span>
            <span className={classes.date}>
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>
          <img
            src={article.author.image || defaultAvatar}
            alt={article.author.username}
            className={classes.foto}
            onError={handleImageError}
          />
          {currentUser?.username === article.author.username && (
            <div className={classes.buttonsWrapper}>
              {isModalOpen && (
                <div className={classes.modalWrapper}>
                  <Modal
                    onConfirm={handleDelete}
                    onCancel={() => setIsModalOpen(false)}
                  />
                </div>
              )}
              <div className={classes.buttons}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={classes.deleteBtn}
                >
                  Delete
                </button>
                <Link
                  to={`/edit/${article.slug}`}
                  state={{ article }}
                  className={classes.editBtn}
                >
                  Edit
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Article;
