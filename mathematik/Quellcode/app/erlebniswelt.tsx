import {useState} from 'react';
import './erlebniswelt.css';

/**
 * Mathe zum Anfassen: Die Modelle zeigen mathematische Beziehungen.
 * Alle drei Modelle sind mit Tastatur und Touch bedienbar; keine Datenübertragung.
 */
const countTo = (end: number) => Array.from({length: end}, (_, i) => i);
const chartPoint = (value: number) => 36 + value * 4.08;
const polar = (angle: number, radius: number) => ({
  x: 150 + Math.cos(angle) * radius,
  y: 100 + Math.sin(angle) * radius,
});

function Pizza({selected, total}: {selected: number; total: number}) {
  const slices = countTo(total).map((index) => {
    const start = -Math.PI / 2 + (index / total) * Math.PI * 2;
    const end = -Math.PI / 2 + ((index + 1) / total) * Math.PI * 2;
    const a = polar(start, 77);
    const b = polar(end, 77);
    const center = polar((start + end) / 2, 49);
    return {index, d: `M 150 100 L ${a.x.toFixed(2)} ${a.y.toFixed(2)} A 77 77 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} Z`, center};
  });
  return <svg className="ev-pizza" viewBox="0 0 300 205" role="img" aria-label={`Pizza in ${total} gleich große Stücke aufgeteilt, davon ${selected} farbig markiert`}>
    <circle cx="150" cy="100" r="86" fill="#c68542" stroke="#8d5024" strokeWidth="4"/>
    <circle cx="150" cy="100" r="79" fill="#f9dc95"/>
    {slices.map(({index,d,center}) => <g key={index}>
      <path className="ev-slice" d={d} fill={index < selected ? '#ef745d' : '#f9d991'} stroke="#9b512f" strokeWidth="2.6" strokeLinejoin="round"/>
      <circle cx={center.x} cy={center.y} r="6" fill={index < selected ? '#a83536' : '#cf9c4f'} opacity=".86"/>
    </g>)}
    <circle cx="150" cy="100" r="5" fill="#9b512f"/>
  </svg>;
}

function ClockPicture({minutes}: {minutes: number}) {
  return <svg className="ev-clock" viewBox="0 0 300 205" role="img" aria-label={`Die Zeitspanne beträgt ${minutes} Minuten, also ${Math.floor(minutes/60)} Stunden und ${minutes%60} Minuten`}>
    <circle cx="150" cy="99" r="88" fill="#d0e4f7" stroke="#3361aa" strokeWidth="8"/>
    <circle cx="150" cy="99" r="75" fill="#fff"/>
    {countTo(12).map(i => {
      const a=(i*30-90)*Math.PI/180;
      return <line key={i} x1={150+Math.cos(a)*65} y1={99+Math.sin(a)*65} x2={150+Math.cos(a)*72} y2={99+Math.sin(a)*72} stroke="#345176" strokeWidth="3.3" strokeLinecap="round"/>;
    })}
    <text x="150" y="42" textAnchor="middle" fontSize="18" fontWeight="800" fill="#25446e">12</text>
    <text x="203" y="106" textAnchor="middle" fontSize="18" fontWeight="800" fill="#25446e">3</text>
    <text x="150" y="162" textAnchor="middle" fontSize="18" fontWeight="800" fill="#25446e">6</text>
    <text x="98" y="106" textAnchor="middle" fontSize="18" fontWeight="800" fill="#25446e">9</text>
    <line x1="150" y1="99" x2="119" y2="78" stroke="#365988" strokeWidth="10" strokeLinecap="round"/>
    <g className="ev-hand" style={{transform: `rotate(${(minutes % 60) * 6}deg)`, transformOrigin:'150px 99px'}}>
      <line x1="150" y1="99" x2="150" y2="37" stroke="#e25c67" strokeWidth="7" strokeLinecap="round"/>
    </g>
    <circle cx="150" cy="99" r="8" fill="#e25c67" stroke="#fff" strokeWidth="3"/>
  </svg>;
}

export function Erlebniswelt() {
  const [point,setPoint] = useState(65);
  const [part,setPart] = useState(3);
  const [total,setTotal] = useState(8);
  const [minutes,setMinutes] = useState(95);
  const pct = Math.round(part / total * 100);
  return <section className="ev-world" aria-labelledby="ev-title">
    <div className="ev-hero">
      <div className="ev-hero-copy">
        <span className="ev-overline">NEU · MATHE ZUM ANFASSEN</span>
        <h2 id="ev-title">Nicht nur rechnen. <em>Mathe sehen.</em></h2>
        <p>Schiebe, entdecke und beobachte, was sich verändert. Hier kannst du Mathematik selbst ausprobieren.</p>
        <a href="#atelier" className="ev-hero-link">Weitere interaktive Aufgaben <span aria-hidden="true">↗</span></a>
      </div>
      <svg className="ev-hero-art" viewBox="0 0 380 240" role="img" aria-label="Illustration mit Zahlenstrahl, Würfel, Brüchen und einer Uhr">
        <defs>
          <linearGradient id="ev-hero-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffd477"/><stop offset="1" stopColor="#ff9a85"/></linearGradient>
        </defs>
        <circle cx="206" cy="115" r="98" fill="#ffffff" fillOpacity=".10"/>
        <circle className="ev-floating ev-float-a" cx="82" cy="48" r="29" fill="#f7cc75"/>
        <text x="82" y="58" fontSize="28" fontWeight="900" textAnchor="middle" fill="#25365d">⅔</text>
        <rect className="ev-floating ev-float-b" x="179" y="39" width="91" height="91" rx="19" fill="#c5f0eb" transform="rotate(12 224 84)"/>
        <text x="226" y="98" fontSize="53" fontWeight="900" textAnchor="middle" fill="#1f5d68">7</text>
        <rect x="86" y="145" width="190" height="63" rx="15" fill="#fff" fillOpacity=".95"/>
        <line x1="108" y1="174" x2="253" y2="174" stroke="#476499" strokeWidth="5" strokeLinecap="round"/>
        {countTo(6).map(i=><line key={i} x1={110+i*28} y1="165" x2={110+i*28} y2="184" stroke="#476499" strokeWidth="3"/>)}
        <circle className="ev-pulse" cx="195" cy="174" r="11" fill="#fb806a" stroke="white" strokeWidth="4"/>
        <circle className="ev-floating ev-float-c" cx="307" cy="167" r="36" fill="url(#ev-hero-gradient)"/>
        <path d="M307 167 L307 140 M307 167 L328 173" stroke="#684869" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="307" cy="167" r="5" fill="#684869"/>
      </svg>
    </div>

    <div className="ev-section-heading">
      <div><span className="ev-overline">SO FUNKTIONIERT MATHE</span><h3>3 interaktive Mini-Labore</h3></div>
      <p>Du veränderst die Zahlen. Das Modell verändert sich mit.</p>
    </div>

    <div className="ev-grid">
      <article className="ev-card">
        <div className="ev-card-top"><span className="ev-tag ev-tag-blue">Zahlen</span><span className="ev-step">01</span></div>
        <h4>Entdecke den Zahlenstrahl</h4>
        <p>Wo liegt deine Zahl zwischen 0 und 100?</p>
        <div className="ev-graphic ev-numbers">
          <svg viewBox="0 0 480 154" role="img" aria-label={`Zahlenstrahl mit einem Punkt bei ${point}`}>
            <line x1="36" y1="94" x2="444" y2="94" stroke="#a9bbd1" strokeWidth="10" strokeLinecap="round"/>
            <line x1="36" y1="94" x2={chartPoint(point)} y2="94" stroke="#397de0" strokeWidth="10" strokeLinecap="round"/>
            {[0,20,40,60,80,100].map(v=><g key={v}>
              <line x1={chartPoint(v)} x2={chartPoint(v)} y1="80" y2="109" stroke="#344e76" strokeWidth="3"/>
              <text x={chartPoint(v)} y="131" fontWeight="700" fontSize="18" textAnchor="middle" fill="#344e76">{v}</text>
            </g>)}
            <g className="ev-point" style={{transform:`translateX(${chartPoint(point) - chartPoint(0)}px)`}}>
              <circle cx="36" cy="94" r="16" fill="#ff765e" stroke="white" strokeWidth="5"/>
              <text x="36" y="62" fontSize="31" fontWeight="900" textAnchor="middle" fill="#174a8c">{point}</text>
            </g>
          </svg>
        </div>
        <label className="ev-slider-label" htmlFor="ev-position"><span>Punkt verschieben</span><strong>{point}</strong></label>
        <input id="ev-position" type="range" min="0" max="100" step="5" value={point} onChange={e=>setPoint(Number(e.target.value))}/>
        <p className="ev-insight" aria-live="polite">{point < 50 ? `${point} liegt links von 50.` : point > 50 ? `${point} liegt rechts von 50.` : '50 ist genau die Mitte.'}</p>
        <a className="ev-practice-link" href="#line">Zahlenstrahl üben <span aria-hidden="true">→</span></a>
      </article>

      <article className="ev-card">
        <div className="ev-card-top"><span className="ev-tag ev-tag-coral">Brüche</span><span className="ev-step">02</span></div>
        <h4>Wie viel ist ein Bruch?</h4>
        <p>Färbe Teile einer Pizza und entdecke den Anteil.</p>
        <div className="ev-graphic ev-fractions"><Pizza selected={part} total={total}/><strong className="ev-fraction-number">{part}<span></span>{total}</strong></div>
        <label className="ev-slider-label" htmlFor="ev-total"><span>Gleich große Stücke</span><strong>{total}</strong></label>
        <input id="ev-total" type="range" min="2" max="8" step="1" value={total} onChange={e=>{const value=Number(e.target.value);setTotal(value);setPart(old=>Math.min(old,value));}}/>
        <label className="ev-slider-label" htmlFor="ev-selected"><span>Gefärbte Stücke</span><strong>{part}</strong></label>
        <input id="ev-selected" type="range" min="1" max={total} step="1" value={part} onChange={e=>setPart(Number(e.target.value))}/>
        <p className="ev-insight" aria-live="polite">{part} von {total} gleich großen Teilen sind gefärbt (ungefähr {pct} %).</p>
        <a className="ev-practice-link" href="#fractions">Brüche üben <span aria-hidden="true">→</span></a>
      </article>

      <article className="ev-card">
        <div className="ev-card-top"><span className="ev-tag ev-tag-teal">Zeit</span><span className="ev-step">03</span></div>
        <h4>Minuten werden Stunden</h4>
        <p>60 Minuten ergeben eine Stunde. Drehe die Zeit weiter.</p>
        <div className="ev-graphic ev-time"><ClockPicture minutes={minutes}/><strong className="ev-hours"><span>{Math.floor(minutes/60)} h</span><span>{minutes%60} min</span></strong></div>
        <label className="ev-slider-label" htmlFor="ev-minutes"><span>Zeitspanne einstellen</span><strong>{minutes} min</strong></label>
        <input id="ev-minutes" type="range" min="0" max="180" step="5" value={minutes} onChange={e=>setMinutes(Number(e.target.value))}/>
        <p className="ev-insight" aria-live="polite">{minutes} Minuten = {Math.floor(minutes/60)} volle Stunden und {minutes%60} Minuten.</p>
        <a className="ev-practice-link" href="#g-zeit">Zeitumrechnungen üben <span aria-hidden="true">→</span></a>
      </article>
    </div>
  </section>;
}
