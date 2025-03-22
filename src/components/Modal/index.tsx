import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

type Props = {
  text: string;
  handleClose: () => void;
};

function Modal({ text, handleClose }: Props) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleClose();
      setIsActive(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      {createPortal(
        <div className={styles.wrapper}>
          <p className={styles.text}>{text}</p>
        </div>,
        document.body
      )}
    </>
  );
}

export default memo(Modal);
