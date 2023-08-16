export function Overlay() {
  return (
    <>
      <div className="char" style={{ top: 40, left: 40 }}>
        B
      </div>
      <div className="char" style={{ top: 40, left: '20vw' }}>
        E
      </div>
      <div className="char" style={{ top: 40, left: '40vw' }}>
        N
      </div>
      <div className="char" style={{ top: '20vw', left: '20vw' }}>
        E
      </div>
      <div className="char" style={{ bottom: 40, left: '30vw' }}>
        D
      </div>
      <div className="char" style={{ bottom: 40, left: '50vw' }}>
        I
      </div>
      <div className="char" style={{ bottom: 40, left: '70vw' }}>
        K
      </div>
      <div className="char" style={{ bottom: 40, left: '90vw' }}>
        T
      </div>
      <div style={{ position: 'absolute', top: 40, right: 160, fontSize: '15px', textAlign: 'right' }}>
        
        <br />
        
      </div>
      <div style={{ position: 'absolute', top: 40, right: 40, fontSize: '15px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        —
        <br />
        Benedikt Schnupp
      </div>
      {/* <svg style={{ position: 'absolute', right: 40, top: '50%' }} width="54" height="23" viewBox="0 0 54 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line y1="1.5" x2="54" y2="1.5" stroke="black" strokeWidth="3" />
        <line y1="11.5" x2="54" y2="11.5" stroke="black" strokeWidth="3" />
        <line y1="21.5" x2="54" y2="21.5" stroke="black" strokeWidth="3" />
      </svg> */}
      <div style={{ position: 'absolute', bottom: 120, left: 120, fontSize: '18px' }}>
        Hey,
        <br />
        Im a Motion Designer <br /> and Web Developer from Berlin. <br />
        <br />
        This page is under construction, duh. <br />
        For now connect with me on:
        <br />
        <br />
        <div style={{ position: 'relative', marginTop: 10, display: 'inline-block' }}>
          <a style={{ fontSize: '15px', fontWeight: 600, letterSpacing: 2 }} href="https://www.linkedin.com/in/benedikt-schnupp-928112116/">
            LinkedIn
          </a>
          <div style={{ marginTop: 6, height: 2.5, width: '100%', background: '#3e3e3d' }} />
        </div>
        <br />
      </div>
    </>
  )
}
