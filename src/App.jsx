import { useState, useEffect } from "react";
import { profile, skills, competencies, experience, projects, certifications, education } from "./data.js";
import { useWallet } from "./useWallet.js";
import Network from "./Network.jsx";

const TIP_ADDRESS = import.meta.env.VITE_TIP_ADDRESS;
const short = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;

function WalletCard() {
  const w = useWallet();
  const [signature, setSignature] = useState("");
  const [tip, setTip] = useState("0.001");
  const [txHash, setTxHash] = useState("");

  const verify = async () => {
    const msg = `Hi Tejas, I visited your portfolio.\nWallet: ${w.account}\nTime: ${new Date().toISOString()}`;
    const sig = await w.sign(msg);
    if (sig) setSignature(sig);
  };
  const send = async () => {
    const hash = await w.sendTip(TIP_ADDRESS, tip);
    if (hash) setTxHash(hash);
  };

  return (
    <aside className="wallet" aria-label="Wallet">
      <h2><span className={"dot" + (w.account ? " on" : "")} />Visitor wallet</h2>
      {!w.hasProvider && <p className="note">No wallet found. Install MetaMask or another browser wallet to try this.</p>}
      {w.hasProvider && !w.account && (
        <>
          <p className="note">Connect to sign a hello message. Nothing is sent without your approval.</p>
          <button className="btn primary" onClick={w.connect}>Connect wallet</button>
        </>
      )}
      {w.account && (
        <>
          <dl>
            <dt>Address</dt><dd title={w.account}>{short(w.account)}</dd>
            <dt>Network</dt><dd>{w.chain || "…"}</dd>
            <dt>Balance</dt><dd>{w.balance ?? "…"} ETH</dd>
          </dl>
          <button className="btn primary" onClick={verify}>Sign a hello message</button>
          {signature && <p className="sig">Signed: {signature.slice(0, 18)}…{signature.slice(-8)}</p>}
          {TIP_ADDRESS && (
            <div className="tip">
              <label>Tip amount (ETH)
                <input value={tip} onChange={(e) => setTip(e.target.value)} inputMode="decimal" />
              </label>
              <button className="btn" onClick={send}>Send a tip</button>
              {txHash && <p className="sig">Sent: {short(txHash)}</p>}
            </div>
          )}
          <button className="link" onClick={w.disconnect}>Disconnect</button>
        </>
      )}
      {w.error && <p className="err" role="alert">{w.error}</p>}
    </aside>
  );
}

const SCRIPT = [
  "$ whoami", "React full stack developer, Pune", "",
  "$ cat stack.txt", "Next.js  React  Node.js  MongoDB  MySQL  n8n", "",
  "$ ls projects/", "FileDock  Zoomix  WanderLust  ...",
].join("\n");

function Terminal() {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(reduce ? SCRIPT.length : 0);
  useEffect(() => {
    if (n >= SCRIPT.length) return;
    const t = setTimeout(() => setN(n + 1), SCRIPT[n] === "\n" ? 160 : 26);
    return () => clearTimeout(t);
  }, [n]);
  const lines = SCRIPT.slice(0, n).split("\n");
  return (
    <div className="term" role="img" aria-label="Terminal: whoami, stack and projects">
      <div className="bar"><i /><i /><i /></div>
      <pre>
        {lines.map((l, i) => (
          <div key={i}>
            {l.startsWith("$ ") ? <><b>$</b>{l.slice(1)}</> : l}
            {i === lines.length - 1 && <span className="cur" />}
          </div>
        ))}
      </pre>
    </div>
  );
}

export default function App() {
  return (
    <>
      <header className="nav">
        <span className="logo"></span>
        <nav>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="heroText">
            <p className="where">{profile.title} · {profile.location}</p>
            <h1>{profile.name}</h1>
            <p className="lead">{profile.summary}</p>
            <Terminal />
            <div className="row">
              <a className="btn primary" href="#projects">See my work</a>
              <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
          <div className="heroSide">
            <Network />
            <WalletCard />
          </div>
        </section>

        <section id="experience">
          <h2 className="sec">Experience</h2>
          <ol className="chain">
            {experience.map((e, i) => (
              <li className="block" key={e.role}>
                <div className="blockno">Block {i + 1}</div>
                <h3>{e.role}</h3>
                <p className="meta">{e.company}, {e.place} — {e.period}</p>
                <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <div className="tags">{e.tech.map((t) => <span key={t}>{t}</span>)}</div>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects">
          <h2 className="sec">Projects</h2>
          <div className="rows">
            {projects.map((p) => (
              <a className="row3" key={p.name} href={p.url} target="_blank" rel="noreferrer">
                <div><h3>{p.name}</h3><p className="meta">{p.subtitle}</p></div>
                <p>{p.text}</p>
                <div className="tags">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
              </a>
            ))}
          </div>
        </section>

        <section id="skills">
          <h2 className="sec">Skills</h2>
          <dl className="skills">
            {Object.entries(skills).map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v.join(", ")}</dd></div>
            ))}
          </dl>
          <h3 className="sub">Core competencies</h3>
          <div className="tags">{competencies.map((c) => <span key={c}>{c}</span>)}</div>
        </section>

        <section className="two">
          <div>
            <h2 className="sec">Education</h2>
            <h3>{education.school}</h3>
            <p className="meta">{education.degree}</p>
            <p className="meta">{education.period}, {education.place}</p>
          </div>
          <div>
            <h2 className="sec">Certifications</h2>
            <ul className="plain">{certifications.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </section>

        <section id="contact">
          <h2 className="sec">Contact</h2>
          <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <p><a href={`tel:${profile.phone.replace(/-/g, "")}`}>{profile.phone}</a></p>
          <p><a href={profile.github} target="_blank" rel="noreferrer">github.com/tjs-07</a></p>
        </section>
      </main>
      <footer>© {new Date().getFullYear()} {profile.name}</footer>
    </>
  );
}