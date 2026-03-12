'use client';

import { useState, useCallback } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import History from './History';
import styles from './Calculator.module.css';

type Operator = '+' | '-' | '*' | '/';

interface HistoryEntry {
  id: number;
  operand1: number;
  operator: string;
  operand2: number;
  result: number;
  createdAt: string;
}

export default function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const inputDigit = useCallback(
    (digit: string) => {
      setError(null);
      if (waitingForOperand) {
        setDisplayValue(digit);
        setWaitingForOperand(false);
      } else {
        setDisplayValue(
          displayValue === '0' ? digit : displayValue + digit
        );
      }
    },
    [displayValue, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    setError(null);
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
    setError(null);
  }, []);

  const handleOperator = useCallback(
    (nextOperator: Operator) => {
      setError(null);
      const inputValue = parseFloat(displayValue);

      if (previousValue !== null && !waitingForOperand && operator) {
        const prev = parseFloat(previousValue);
        let result: number;
        switch (operator) {
          case '+':
            result = prev + inputValue;
            break;
          case '-':
            result = prev - inputValue;
            break;
          case '*':
            result = prev * inputValue;
            break;
          case '/':
            if (inputValue === 0) {
              setError('Error: Division by zero');
              setExpression('');
              setPreviousValue(null);
              setOperator(null);
              setWaitingForOperand(false);
              return;
            }
            result = prev / inputValue;
            break;
          default:
            result = inputValue;
        }
        const resultStr = formatResult(result);
        setDisplayValue(resultStr);
        setPreviousValue(resultStr);
        setExpression(`${resultStr} ${nextOperator}`);
      } else {
        setPreviousValue(displayValue);
        setExpression(`${displayValue} ${nextOperator}`);
      }

      setOperator(nextOperator);
      setWaitingForOperand(true);
    },
    [displayValue, previousValue, operator, waitingForOperand]
  );

  const handleEquals = useCallback(async () => {
    setError(null);
    if (operator === null || previousValue === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(displayValue);
    let result: number;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          setError('Error: Division by zero');
          setExpression('');
          setPreviousValue(null);
          setOperator(null);
          setWaitingForOperand(false);
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    const resultStr = formatResult(result);
    setExpression(`${previousValue} ${operator} ${displayValue} =`);
    setDisplayValue(resultStr);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);

    // Save to database
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operand1: prev,
          operator,
          operand2: current,
          result,
        }),
      });
      setHistoryRefresh((n) => n + 1);
    } catch (err) {
      console.error('Failed to save calculation:', err);
    }
  }, [operator, previousValue, displayValue]);

  function formatResult(value: number): string {
    if (isNaN(value)) return 'Error';
    if (!isFinite(value)) return 'Error';
    const str = String(value);
    if (str.length > 12) {
      return parseFloat(value.toPrecision(10)).toString();
    }
    return str;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.calculatorContainer}>
        <Display
          value={error || displayValue}
          expression={expression}
          isError={!!error}
        />
        <ButtonGrid
          onDigit={inputDigit}
          onDecimal={inputDecimal}
          onOperator={handleOperator}
          onEquals={handleEquals}
          onClear={clear}
        />
      </div>
      <History refreshTrigger={historyRefresh} />
    </div>
  );
}
