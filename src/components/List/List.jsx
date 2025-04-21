import { useSelector } from 'react-redux';
import heart from '../../assets/heart.png';
import like from '../../assets/like.png';
import defaultAvatar from '../../assets/Rectangle 1.png';
import { toggleLike } from '../../store/listSlice';
import classes from './List.module.scss';
import { fetchList } from '../../store/listSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pagination } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

function List() {
  const dispatch = useDispatch();
  const { list, total } = useSelector((state) => state.list);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchList(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };
  return (
    <div className={classes.cardCont}>
      {list.map((article) => (
        <div className={classes.card} key={uuidv4()}>
          <div className={classes.content}>
            <div className={classes.header}>
              <div className={classes.title}>
                {' '}
                <Link to={`/${article.slug}`}>{article.title}</Link>{' '}
              </div>
              <div className={classes.like}>
                <button
                  className={`${classes.heart} ${
                    article.favorited ? classes.liked : ''
                  }`}
                  onClick={() =>
                    dispatch(
                      toggleLike({
                        slug: article.slug,
                        liked: article.favorited,
                      })
                    )
                  }
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
          </div>
          <div className={classes.autor}>
            <div className={classes.autorInfo}>
              <span className={classes.autorName}>
                {article.author.username}
              </span>
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
          </div>
        </div>
      ))}
      <div className={classes.paginationCont}>
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={total}
          pageSize={5}
        />
      </div>
    </div>
  );
}

export default List;
