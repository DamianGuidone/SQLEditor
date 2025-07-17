import styles from './Section.module.css';
interface SectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <i className={`fas fa-${icon}`} />
                <span className={styles.sectionTitle}>{title}</span>
            </div>
            <div className={styles.sectionContent}>
                {children}
            </div>
        </div>
    );
};

export default Section;