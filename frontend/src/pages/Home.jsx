import { Link } from 'react-router-dom';
import { Bed, Utensils, Shield, Award, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="animate-fade-up">
      {/* Cinematic Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '92vh', 
        width: '100%', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.4), rgba(3, 7, 18, 0.8)), url('/hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          transform: 'scale(1.05)',
          animation: 'slowZoom 20s infinite alternate'
        }}></div>

        <div className="container" style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', padding: '0.5rem 1.5rem', borderRadius: '2rem', border: '1px solid var(--primary)', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <Star size={16} color="var(--primary)" fill="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em' }}>KHIBRAD CAALAMI AH</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 0.9, marginBottom: '1.5rem', fontFamily: 'Outfit' }}>
            PILOTT ZADIIQ <br />
            <span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RAAXO AAN LA QIYASI KARIN</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Kusoo dhowow Pilott Zadiiq. Meel ay isugu yimaadeen raaxo, farshaxan, iyo adeeg heerkoodu sareeyo. 
            Dooro qolkaaga ama ku nafee maqaayadeena caalamiga ah.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <Link to="/rooms" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                  Sahami Qolalka <ArrowRight size={20} />
                </Link>
                <Link to="/menu" className="btn btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', backdropFilter: 'blur(10px)' }}>
                  Maqaayadda
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                  Soo Gal <ArrowRight size={20} />
                </Link>
                <Link to="/register" className="btn btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', backdropFilter: 'blur(10px)' }}>
                  Is-diiwaangeli
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating Stats */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4rem', opacity: 0.8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>45+</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Qolal Raaxo</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>5★</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Cunto Macaan</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>24/7</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Adeeg Hufan</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container" style={{ padding: '8rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Adeegyadeena Gaarka Ah</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>Waxaan kuu diyaarinay wax kasta oo aad ugu baahan tahay nasasho dhamaystiran.</p>
        </div>

        <div className="grid grid-cols-1 grid-cols-3" style={{ gap: '2.5rem' }}>
          <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '2rem', margin: '0 auto 2rem' }}>
              <Bed size={40} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Nolol Casri Ah</h3>
            <p style={{ color: 'var(--text-dim)' }}>Qolal casri ah oo leh technology-gii ugu dambeeyay iyo sariiro aad u raaxo badan.</p>
          </div>

          <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '2rem', margin: '0 auto 2rem' }}>
              <Utensils size={40} color="var(--secondary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Cunto Tayo Leh</h3>
            <p style={{ color: 'var(--text-dim)' }}>Cuntooyin caalami ah iyo kuwo dalka ah oo ay kuu diyaariyeen cunto-kariyeyaal xirfad leh.</p>
          </div>

          <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '2rem', margin: '0 auto 2rem' }}>
              <Shield size={40} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Amni Buuxa</h3>
            <p style={{ color: 'var(--text-dim)' }}>Amnigaaga iyo sirtaada ayaa noogu muhiimsan. 24 saac oo ilaalo buuxda ah.</p>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section style={{ marginBottom: '8rem' }}>
        <div className="container">
          <div className="glass" style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
            padding: '5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Award size={120} color="var(--primary)" style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }} />
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ma doonaysaa nasasho gaar ah?</h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Hadda nala soo xiriir si aad u hesho qiimo dhimis gaar ah oo loogu talagalay booqashadaada ugu horreysa.
            </p>
            {user ? (
              <Link to="/rooms" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Sahami Qolalka</Link>
            ) : (
              <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Is-diiwaangeli Hadda</Link>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Home;
