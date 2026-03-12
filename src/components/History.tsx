'use client';

import { useEffect, useState } from 'react';
import styles from './History.module.css';

interface HistoryEntry {
  id: number;
  operand1: number;
  operator: string;
  operand2: number;
  result: number;
  createdAt: string;
}

interface HistoryProps {
  refreshTrigger: number;
}

function formatOperator(op: string): string {
  switch (op) {
    case '*':
      return '×';
    case '/':
      return '÷';
    case '-':
      return '−';
    default:
      return op;
  }
}

function formatNumber(n: number): string {
  const str = String(parseFloat(n.toString()));
  if (str.length > 12) {
    return parseFloat(n.toPrecision(8)).toString();
  }
  return str;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function History({ refreshTrigger }: HistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/calculations');
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistory(data.calculations || []);
        setError(null);
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [refreshTrigger]);

  return (
    <div className={styles.historyPanel}>
      <h2 className={styles.title}>History</h2>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : history.length === 0 ? (
        <div className={styles.empty}>
          <span>No calculations yet.</span>
          <span className={styles.hint}>Start calculating!</span>
        </div>
      ) : (
        <ul className={styles.list}>
          {history.map((entry) => (
            <li key={entry.id} className={styles.item}>
              <div className={styles.expression}>
                <span className={styles.operand}>{formatNumber(entry.operand1)}</span>
                <span className={styles.op}>{formatOperator(entry.operator)}</span>
                <span className={styles.operand}>{formatNumber(entry.operand2)}</span>
                <span className={styles.equals}>=</span>
                <span className={styles.result}>{formatNumber(entry.result)}</span>
              </div>
              <div className={styles.time}>{formatTime(entry.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
