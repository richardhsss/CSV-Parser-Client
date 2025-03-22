import { HTMLInputTypeAttribute, memo } from 'react';
import styles from './styles.module.css';
import { UseFormRegister } from 'react-hook-form';
import { User } from 'src/types';

type Props = {
  name: keyof User;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  register: UseFormRegister<User>;
  error?: string;
  disabled?: boolean;
};

function Input({ name, placeholder, type, error, register, disabled }: Props) {
  return (
    <div className={styles.wrapper}>
      <input
        id={name}
        className={styles.input}
        style={error ? { border: '1px solid #db2a2a' } : undefined}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        type={type}
        disabled={disabled}
        {...register(name)}
      />
      <span className={styles.error} aria-live="polite">
        {error}
      </span>
    </div>
  );
}

export default memo(Input);
