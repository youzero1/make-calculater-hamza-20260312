import styles from './ButtonGrid.module.css';

type Operator = '+' | '-' | '*' | '/';

interface ButtonGridProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (op: Operator) => void;
  onEquals: () => void;
  onClear: () => void;
}

export default function ButtonGrid({
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onClear,
}: ButtonGridProps) {
  return (
    <div className={styles.grid}>
      {/* Row 1 */}
      <button
        className={`${styles.button} ${styles.clear} ${styles.span2}`}
        onClick={onClear}
      >
        C
      </button>
      <button
        className={`${styles.button} ${styles.operator}`}
        onClick={() => onOperator('/')}
      >
        ÷
      </button>
      <button
        className={`${styles.button} ${styles.operator}`}
        onClick={() => onOperator('*')}
      >
        ×
      </button>

      {/* Row 2 */}
      <button className={styles.button} onClick={() => onDigit('7')}>
        7
      </button>
      <button className={styles.button} onClick={() => onDigit('8')}>
        8
      </button>
      <button className={styles.button} onClick={() => onDigit('9')}>
        9
      </button>
      <button
        className={`${styles.button} ${styles.operator}`}
        onClick={() => onOperator('-')}
      >
        −
      </button>

      {/* Row 3 */}
      <button className={styles.button} onClick={() => onDigit('4')}>
        4
      </button>
      <button className={styles.button} onClick={() => onDigit('5')}>
        5
      </button>
      <button className={styles.button} onClick={() => onDigit('6')}>
        6
      </button>
      <button
        className={`${styles.button} ${styles.operator}`}
        onClick={() => onOperator('+')}
      >
        +
      </button>

      {/* Row 4 */}
      <button className={styles.button} onClick={() => onDigit('1')}>
        1
      </button>
      <button className={styles.button} onClick={() => onDigit('2')}>
        2
      </button>
      <button className={styles.button} onClick={() => onDigit('3')}>
        3
      </button>
      <button
        className={`${styles.button} ${styles.equals} ${styles.span1rows2}`}
        onClick={onEquals}
      >
        =
      </button>

      {/* Row 5 */}
      <button
        className={`${styles.button} ${styles.span2}`}
        onClick={() => onDigit('0')}
      >
        0
      </button>
      <button className={styles.button} onClick={onDecimal}>
        .
      </button>
    </div>
  );
}
