import styles from './Display.module.css';

interface DisplayProps {
  value: string;
  expression: string;
  isError: boolean;
}

export default function Display({ value, expression, isError }: DisplayProps) {
  return (
    <div className={styles.display}>
      <div className={styles.expression}>{expression || '\u00A0'}</div>
      <div
        className={`${styles.value} ${
          isError ? styles.error : ''
        } ${value.length > 10 ? styles.small : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
