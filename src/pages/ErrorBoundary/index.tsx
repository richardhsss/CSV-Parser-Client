import { Component, PropsWithChildren } from 'react';
import styles from './styles.module.css';

class ErrorBoundary extends Component<PropsWithChildren> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.section}>
          <h1 className={styles.title}>Something went wrong</h1>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
