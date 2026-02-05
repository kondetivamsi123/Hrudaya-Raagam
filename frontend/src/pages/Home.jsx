import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import Navbar from '../components/Navbar';

const Home = ({ onPlay }) => {
    const [bpm, setBpm] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [monitorMode, setMonitorMode] = useState(false);
    const [steps, setSteps] = useState(0);

    const startMonitoring = () => {
        setMonitorMode(true);
        setScanning(true);
        setSteps(0);

        let usingSensors = false;

        // Try to use real sensors if available
        if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        usingSensors = true;
                        startSensorLogic();
                    } else {
                        startSimulationLogic();
                    }
                })
                .catch(console.error);
        } else if (window.DeviceMotionEvent) {
            // Non-iOS or older devices
            usingSensors = true;
            try {
                startSensorLogic();
            } catch (e) {
                console.warn("Sensor error, falling back to sim", e);
                startSimulationLogic();
            }
        } else {
            startSimulationLogic();
        }
    };

    const startSensorLogic = () => {
        let lastAcc = { x: 0, y: 0, z: 0 };
        let currentBpm = 70;

        const handleMotion = (event) => {
            const acc = event.accelerationIncludingGravity || event.acceleration;
            if (!acc) return;

            const deltaX = Math.abs(acc.x - lastAcc.x);
            const deltaY = Math.abs(acc.y - lastAcc.y);
            const deltaZ = Math.abs(acc.z - lastAcc.z);

            if (deltaX + deltaY + deltaZ > 15) { // Sensitivity threshold
                setSteps(prev => prev + 1);
                currentBpm += 2;
                if (currentBpm > 160) currentBpm = 160;
                setBpm(Math.floor(currentBpm));
            } else {
                currentBpm -= 0.5; // Cool down
                if (currentBpm < 60) currentBpm = 60;
                setBpm(Math.floor(currentBpm));
            }
            lastAcc = acc;
        };

        window.addEventListener('devicemotion', handleMotion);

        // Cleanup after 10s
        setTimeout(() => {
            window.removeEventListener('devicemotion', handleMotion);
            setScanning(false);
            setMonitorMode(false);
            fetchRecommendations(bpm || 80);
        }, 10000);
    };

    const startSimulationLogic = () => {
        let localSteps = 0;
        const interval = setInterval(() => {
            localSteps += Math.floor(Math.random() * 3);
            setSteps(localSteps);

            // Calculate BPM based on "steps" activity
            let calculatedBpm = 70 + (localSteps * 0.5);
            if (calculatedBpm > 150) calculatedBpm = 150;
            setBpm(Math.floor(calculatedBpm));

        }, 1000);

        // Stop after 10 seconds of "walking"
        setTimeout(() => {
            clearInterval(interval);
            setScanning(false);
            setMonitorMode(false);
            fetchRecommendations(bpm || 80);
        }, 10000);
    };

    const fetchRecommendations = async (bpmVal) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/analyze-mood`, null, { params: { bpm: bpmVal } });
            setRecommendations(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Navbar />
            <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1>Biometric Activity Scanner</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    {monitorMode ? "Detecting motion... Walk with your phone!" : "Tap the circle OR Start Activity Monitor"}
                </p>

                <div
                    onClick={startMonitoring}
                    style={{
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: scanning ? 'conic-gradient(var(--primary), var(--secondary), var(--primary))' : 'var(--card-bg)',
                        margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', cursor: 'pointer',
                        animation: scanning ? 'spin 2s linear infinite' : 'none',
                        boxShadow: `0 0 ${scanning ? '40px' : '20px'} ${scanning ? 'var(--secondary)' : 'rgba(0,0,0,0.5)'}`,
                        border: '4px solid var(--secondary)'
                    }}
                >
                    {scanning ? (
                        <>
                            <span style={{ fontSize: '3rem' }}>🏃</span>
                            <span style={{ fontSize: '1rem', marginTop: '10px' }}>{steps} Steps</span>
                            <span style={{ fontSize: '1.2rem' }}>{bpm} BPM</span>
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: '3rem' }}>❤️</span>
                            <span>{bpm ? `${bpm} BPM` : 'Start Scan'}</span>
                        </>
                    )}
                </div>

                {!bpm && !scanning && (
                    <div style={{ marginTop: '4rem', textAlign: 'left', animation: 'fadeIn 1s' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Featured Playlists</h2>
                        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                            {[
                                { title: "Top Telugu Hits", color: "linear-gradient(135deg, #6366f1, #a855f7)" },
                                { title: "Melody Magic", color: "linear-gradient(135deg, #f43f5e, #f97316)" },
                                { title: "Mass Masala", color: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
                                { title: "Late Night Vibes", color: "linear-gradient(135deg, #10b981, #3b82f6)" }
                            ].map((playlist, idx) => (
                                <div key={idx} style={{
                                    minWidth: '160px', height: '160px', background: playlist.color,
                                    borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '1rem', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}>
                                    {playlist.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {bpm && !scanning && (
                    <div style={{ marginTop: '3rem', animation: 'fadeIn 0.5s' }}>
                        <h2>Detected Activity: <span style={{ color: 'var(--secondary)' }}>
                            {bpm > 120 ? 'High Intensity (Running/Mass)' : (bpm < 90 ? 'Resting (Melody)' : 'Moderate (Walking/Happy)')}
                        </span></h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            {recommendations.length} songs recommended for your mood
                        </p>

                        {recommendations.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                                {recommendations.map(song => (
                                    <div key={song.id} style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '1rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{song.title}</h3>
                                        <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{song.artist}</p>
                                        <p style={{ margin: '0.3rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{song.movie}</p>
                                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{song.mood_tag}</span>
                                            <button
                                                className="btn"
                                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
                                                onClick={() => onPlay(song)}
                                            >
                                                ▶ Play
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '1rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '3rem' }}>🎵</span>
                                <h3>No songs found for this mood</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your activity level or check back later!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Home;
