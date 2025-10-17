import styles from './RateLimitsTable.module.css';

export default function RateLimitsTable() {
    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Model</div>
                    <div className={styles.headerCell}>Base Tier</div>
                    <div className={styles.headerCell}>Enhanced Tier</div>
                </div>

                <div className={styles.tableBody}>
                    <div className={styles.row}>
                        <div className={styles.cell}>
                            <span className={styles.modelName}>moondream3-preview</span>
                        </div>
                        <div className={styles.cell}>
                            <div>
                                <span className={styles.rateValue}>2</span>
                                <span className={styles.rateUnit}>req/sec</span>
                            </div>
                            <div className={styles.tierNote}>Default for all API keys</div>
                        </div>
                        <div className={styles.cell}>
                            <div>
                                <span className={styles.rateValue}>10</span>
                                <span className={styles.rateUnit}>req/sec</span>
                            </div>
                            <div className={styles.tierNote}>≥ $10 in paid credits</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

