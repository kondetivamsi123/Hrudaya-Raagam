import Navbar from '../components/Navbar';

const Downloads = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <h1>Offline Downloads</h1>
                <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', marginTop: '2rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>🎵</span>
                    <h3>Your Local Music</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Songs you download are saved directly to your device.</p>
                    <button className="btn" style={{ marginTop: '1rem' }}>Open Downloads Folder</button>
                </div>
            </div>
        </div>
    )
}
export default Downloads;
