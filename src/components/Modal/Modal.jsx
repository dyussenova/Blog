import { useState } from 'react';
import propTypes from 'prop-types';
import classes from './Modal.module.scss';

function Modal({ onConfirm, onCancel }) {
  const [selected, setSelected] = useState(null);

  const handleYes = () => {
    setSelected('yes');
    onConfirm();
  };

  const handleNo = () => {
    setSelected('no');
    onCancel();
  };

  return (
    <div className={classes.modal}>
      <div className={classes.content}>
        <div className={classes.warning}>!</div>
        <h2 className={classes.title}>Are you sure to delete this article?</h2>
      </div>
      <div className={classes.buttons}>
        <button
          className={`${classes.yes} ${
            selected === 'yes' ? classes.active : ''
          }`}
          onClick={handleYes}
        >
          Yes
        </button>
        <button
          className={`${classes.no} ${selected === 'no' ? classes.active : ''}`}
          onClick={handleNo}
        >
          No
        </button>
      </div>
    </div>
  );
}
Modal.propTypes = {
  onConfirm: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};
export default Modal;
