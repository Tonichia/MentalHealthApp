import { useState, useEffect, useRef } from "react";

// ─── Design tokens ─────────────────────────────────────────────────────────
const C = {
  deep:    "#0B1E2D", mid:  "#1A3A4A", sky:  "#2B5F72", dawn: "#3D7A8A",
  glass:   "rgba(255,255,255,0.10)", glassBorder: "rgba(255,255,255,0.18)",
  glassDark: "rgba(0,0,0,0.28)",
  text:    "#F0EDE6", textSec: "#B8C9D0", textFaint: "rgba(240,237,230,0.45)",
  gold:    "#D4A853", goldFaint: "rgba(212,168,83,0.18)",
  sage:    "#7BAE8E", sageFaint: "rgba(123,174,142,0.20)",
  mist:    "#8BA8B5", mistFaint: "rgba(139,168,181,0.20)",
  rose:    "#B8748A", roseFaint: "rgba(184,116,138,0.20)",
};

const SCREENS = ["Welcome","Home","Stories","Plans","Community","Paywall"];

const AFFIRMATIONS = [
  '"I am growing, learning, and becoming the best version of myself."',
  '"My mind is a place of peace, clarity, and strength."',
  '"I choose healing, hope, and wholeness today."',
];

const MOODS = [
  { e:"😌", l:"Calm"     },
  { e:"😊", l:"Happy"    },
  { e:"😰", l:"Anxious"  },
  { e:"😢", l:"Sad"      },
  { e:"🙏", l:"Grateful" },
];

const STORIES = [
  { title:"Finding Light in the Dark", author:"Sarah M.", tag:"Resilience", accent:C.sage,  time:"3 min", excerpt:"When everything felt overwhelming, I took one small step..." },
  { title:"My Journey to Self-Love",   author:"David K.", tag:"Self-Love",  accent:C.gold,  time:"5 min", excerpt:"I used to be my own worst critic. Here is how I changed..." },
  { title:"Embracing the Quiet",       author:"Elena R.", tag:"Mindfulness",accent:C.mist,  time:"4 min", excerpt:"In a noisy world, finding peace in silence became my superpower..." },
];

const PLANS = [
  { title:"Overcoming Anxiety",  duration:"7 Days",  icon:"🍃", color:C.sage,  level:"Beginner",     desc:"Breathing techniques & grounding exercises" },
  { title:"Better Sleep",        duration:"14 Days", icon:"🌙", color:C.mist,  level:"Intermediate", desc:"Wind-down routines & sleep hygiene habits"   },
  { title:"Building Confidence", duration:"21 Days", icon:"⭐", color:C.gold,  level:"All Levels",   desc:"Daily affirmations & mindset reframing"      },
  { title:"Stress Management",   duration:"10 Days", icon:"🧘", color:C.rose,  level:"Beginner",     desc:"Mindfulness practices & relaxation tools"    },
];

const GROUPS = [
  { name:"Anxiety Support Group", members:128, live:true,  icon:"🍃", color:C.sage },
  { name:"Mindful Meditation",     members:340, live:false, icon:"🧘", color:C.mist },
  { name:"Sleep Hygiene Basics",   members:85,  live:true,  icon:"🌙", color:C.rose },
];

// ─── Gradient background ───────────────────────────────────────────────────
function GradBg({ children, dawn }) {
  return (
    <div style={{
      position:"relative", flex:1, overflow:"hidden",
      background: dawn
        ? `linear-gradient(160deg, ${C.dawn} 0%, ${C.sky} 40%, ${C.mid} 100%)`
        : `linear-gradient(160deg, ${C.deep} 0%, ${C.mid} 50%, ${C.sky} 100%)`,
      minHeight:"100%",
    }}>
      {/* top-right glow */}
      <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:C.sky, opacity:0.3, pointerEvents:"none" }} />
      {/* bottom vignette */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:140, background:`linear-gradient(to top, ${C.deep}, transparent)`, pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
}

function GlassCard({ children, style={}, gold=false }) {
  return (
    <div style={{
      background: gold ? C.goldFaint : C.glass,
      border: `1px solid ${gold ? "rgba(212,168,83,0.35)" : C.glassBorder}`,
      borderRadius:20, padding:18,
      backdropFilter:"blur(12px)",
      boxShadow:"0 4px 24px rgba(0,0,0,0.25)",
      ...style,
    }}>{children}</div>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────
function WelcomeScreen({ onNav }) {
  const slides = [
    { icon:"🌿", eyebrow:"WELCOME", title:"Find Your\nInner Calm",   subtitle:"A space rooted in warmth, gentle reflection, and the quiet comfort of growth.", accent:C.sage },
    { icon:"📖", eyebrow:"REFLECT", title:"Your Private\nSanctuary", subtitle:"Journal your thoughts in a safe, beautiful space. Your words, your healing.",     accent:C.gold },
    { icon:"🤝", eyebrow:"CONNECT", title:"You Are\nNot Alone",      subtitle:"Connect with support groups and professionals whenever you need guidance.",       accent:C.mist },
  ];
  const [idx, setIdx] = useState(0);
  const s = slides[idx];
  return (
    <GradBg>
      <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", padding:"32px 28px 28px" }}>
        {/* Tag */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
          <div style={{ border:`1px solid ${s.accent}70`, borderRadius:20, padding:"5px 18px" }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:10, fontWeight:700, letterSpacing:3, color:s.accent }}>{s.eyebrow}</span>
          </div>
        </div>

        {/* Slide */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div style={{ width:120, height:120, borderRadius:"50%", border:`1.5px solid ${s.accent}50`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:36, boxShadow:"0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ width:98, height:98, borderRadius:"50%", background:`${s.accent}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>{s.icon}</div>
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:40, fontWeight:500, color:C.text, margin:"0 0 16px", lineHeight:1.2, whiteSpace:"pre-line" }}>{s.title}</h1>
          <div style={{ width:40, height:3, borderRadius:2, background:s.accent, marginBottom:18 }} />
          <p style={{ fontFamily:"sans-serif", fontSize:15, color:C.textSec, lineHeight:1.65, margin:0, maxWidth:280 }}>{s.subtitle}</p>
        </div>

        {/* Dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:24 }}>
          {slides.map((sl, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ height:8, borderRadius:4, width: i===idx ? 28 : 8, background: i===idx ? sl.accent : "rgba(255,255,255,0.25)", cursor:"pointer", transition:"all 0.3s" }} />
          ))}
        </div>

        <button onClick={() => onNav("Home")} style={{ width:"100%", padding:"17px 0", background:C.text, color:C.deep, border:"none", borderRadius:9999, fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, cursor:"pointer", marginBottom:14, boxShadow:"0 8px 24px rgba(0,0,0,0.3)" }}>
          Begin Your Journey
        </button>
        <div style={{ textAlign:"center" }}>
          <span style={{ fontFamily:"sans-serif", fontSize:13, color:C.textSec }}>Already have an account? </span>
          <span onClick={() => onNav("Home")} style={{ fontFamily:"sans-serif", fontSize:13, color:C.text, fontWeight:700, cursor:"pointer" }}>Sign In</span>
        </div>
        <p style={{ textAlign:"center", fontSize:9, color:C.textFaint, letterSpacing:3, fontFamily:"sans-serif", marginTop:18 }}>MIND MATTER WELLNESS</p>
      </div>
    </GradBg>
  );
}

function HomeScreen({ onNav }) {
  const [mood, setMood]   = useState(null);
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([
    { id:"1", text:"Today I felt grateful for the small moments — a warm cup of tea, sunlight through the window.", date:"Apr 22, 2026" },
    { id:"2", text:"I paused before my meeting, breathed, and reminded myself I am prepared.", date:"Apr 21, 2026" },
  ]);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("pro");

  const saveEntry = () => {
    if (!entry.trim()) return;
    setEntries([{ id:String(Date.now()), text:entry, date:"Today" }, ...entries]);
    setEntry("");
  };

  const tierCfg = tier==="pro" ? { label:"🌟 Pro", bg:C.gold, color:C.deep } : { label:"Upgrade ↑", bg:C.glass, color:C.textSec };

  const filtered = entries.filter(e => e.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <GradBg>
      <div style={{ padding:"20px 16px 0", paddingBottom:40 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
          <div style={{ width:58, height:58, borderRadius:"50%", border:`1.5px solid ${C.gold}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <div style={{ width:50, height:50, borderRadius:"50%", background:C.glass, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontSize:10, color:C.textSec, letterSpacing:1.5, fontFamily:"sans-serif" }}>GOOD MORNING,</p>
            <p style={{ margin:"2px 0 3px", fontSize:20, color:C.text, fontFamily:"Georgia,serif" }}>Toni</p>
            <p style={{ margin:0, fontSize:9, color:C.gold, letterSpacing:2.5, fontFamily:"sans-serif" }}>MIND MATTER WELLNESS</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <div onClick={() => setTier(t => t==="pro"?"free":"pro")} style={{ background:tierCfg.bg, color:tierCfg.color, borderRadius:20, padding:"5px 13px", fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${C.glassBorder}`, marginBottom:6 }}>{tierCfg.label}</div>
            <span style={{ fontSize:10, color:C.textFaint, cursor:"pointer" }}>Sign Out</span>
          </div>
        </div>

        {/* Mood */}
        <GlassCard style={{ marginBottom:14 }}>
          <p style={{ margin:"0 0 14px", fontSize:10, color:C.textSec, letterSpacing:2.5, fontFamily:"sans-serif" }}>HOW ARE YOU FEELING?</p>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            {MOODS.map(m => (
              <div key={m.l} onClick={() => setMood(mood===m.l?null:m.l)} style={{ display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", padding:"8px 4px", borderRadius:12, background: mood===m.l ? C.glassBorder : "transparent", flex:1 }}>
                <span style={{ fontSize:22, marginBottom:5 }}>{m.e}</span>
                <span style={{ fontSize:9, color: mood===m.l ? C.text : C.textSec, fontFamily:"sans-serif" }}>{m.l}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Affirmation */}
        <GlassCard gold style={{ marginBottom:20 }}>
          <p style={{ margin:"0 0 10px", fontSize:9, color:C.gold, letterSpacing:3, fontFamily:"sans-serif" }}>DAILY AFFIRMATION</p>
          <p style={{ margin:0, fontFamily:"Georgia,serif", fontSize:15, color:C.text, lineHeight:1.6, fontStyle:"italic" }}>{AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length]}</p>
        </GlassCard>

        {/* Tools */}
        <p style={{ fontSize:10, color:C.textSec, letterSpacing:2.5, margin:"0 0 12px", fontFamily:"sans-serif" }}>YOUR TOOLS</p>
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          {[
            { icon:"📚", label:"Stories",  accent:C.sage, onClick:() => onNav("Stories") },
            { icon:"🤝", label:"Connect",  accent:C.mist, onClick:() => onNav("Community") },
            { icon:"🗺️", label:"Plans",    accent:C.gold, onClick:() => onNav("Plans") },
          ].map(t => (
            <div key={t.label} onClick={t.onClick} style={{ flex:1, background:C.glass, borderRadius:18, border:`1px solid ${C.glassBorder}`, display:"flex", flexDirection:"column", alignItems:"center", paddingBottom:14, overflow:"hidden", cursor:"pointer", boxShadow:"0 2px 14px rgba(0,0,0,0.2)" }}>
              <div style={{ height:3, background:t.accent, width:"100%", borderRadius:"18px 18px 0 0" }} />
              <div style={{ width:50, height:50, borderRadius:"50%", background:`${t.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"14px 0 10px" }}>{t.icon}</div>
              <span style={{ fontSize:12, color:C.text, fontFamily:"Georgia,serif", fontWeight:600 }}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Journal */}
        <p style={{ fontSize:10, color:C.textSec, letterSpacing:2.5, margin:"0 0 12px", fontFamily:"sans-serif" }}>QUICK JOURNAL</p>
        <GlassCard style={{ marginBottom:14 }}>
          <textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="How are you feeling today?" rows={4} style={{ width:"100%", border:"none", outline:"none", resize:"none", fontSize:14, color:C.text, fontFamily:"Georgia,serif", fontStyle:"italic", lineHeight:1.65, background:"transparent", boxSizing:"border-box", marginBottom:12 }} />
          <button onClick={saveEntry} disabled={!entry.trim()} style={{ width:"100%", padding:"13px 0", background: entry.trim() ? C.text : "rgba(255,255,255,0.12)", color: entry.trim() ? C.deep : C.textFaint, border:"none", borderRadius:10, cursor: entry.trim() ? "pointer" : "default", fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, letterSpacing:0.5 }}>Save Entry</button>
        </GlassCard>

        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(0,0,0,0.28)", borderRadius:12, padding:"10px 14px", border:`1px solid ${C.glassBorder}`, marginBottom:14 }}>
          <span>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your journal..." style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:13, color:C.text, fontFamily:"Georgia,serif", fontStyle:"italic" }} />
        </div>

        {/* Entries */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(e => (
            <GlassCard key={e.id} style={{ padding:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ background:C.goldFaint, borderRadius:20, padding:"3px 12px" }}>
                  <span style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, color:C.gold }}>{e.date}</span>
                </div>
                <span onClick={() => setEntries(prev => prev.filter(x=>x.id!==e.id))} style={{ fontSize:11, color:C.textFaint, cursor:"pointer" }}>Delete</span>
              </div>
              <p style={{ margin:0, fontSize:13, color:C.textSec, fontFamily:"Georgia,serif", fontStyle:"italic", lineHeight:1.6 }}>{e.text}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </GradBg>
  );
}

function StoriesScreen({ onNav }) {
  return (
    <GradBg>
      <div style={{ padding:"8px 16px 40px" }}>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:28, color:C.text, margin:"0 0 6px" }}>Positive Stories</h2>
        <p style={{ fontFamily:"sans-serif", fontSize:14, color:C.textSec, margin:"0 0 24px", lineHeight:1.6 }}>Real stories of growth, healing, and resilience.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {STORIES.map((story, i) => (
            <GlassCard key={i} style={{ position:"relative", overflow:"hidden", paddingTop:22 }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:story.accent }} />
              <div style={{ position:"absolute", top:14, right:18, fontFamily:"sans-serif", fontSize:40, fontWeight:800, color:"rgba(255,255,255,0.06)", lineHeight:1 }}>{String(i+1).padStart(2,"0")}</div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ background:`${story.accent}25`, border:`1px solid ${story.accent}50`, borderRadius:9999, padding:"4px 12px" }}>
                  <span style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, color:story.accent }}>{story.tag}</span>
                </div>
                <span style={{ fontFamily:"sans-serif", fontSize:12, color:C.textFaint }}>{story.time} read</span>
              </div>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:20, color:C.text, margin:"0 0 10px", lineHeight:1.4, paddingRight:44 }}>{story.title}</h3>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:story.accent }} />
                <span style={{ fontFamily:"sans-serif", fontSize:13, color:C.textSec }}>By {story.author}</span>
              </div>
              <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:C.textSec, lineHeight:1.65, fontStyle:"italic", margin:"0 0 14px" }}>"{story.excerpt}"</p>
              <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:700, color:story.accent, cursor:"pointer" }}>Read full story →</span>
            </GlassCard>
          ))}
        </div>
      </div>
    </GradBg>
  );
}

function PlansScreen({ onNav }) {
  return (
    <GradBg>
      <div style={{ padding:"8px 16px 40px" }}>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:28, color:C.text, margin:"0 0 6px" }}>Self-Help Plans</h2>
        <p style={{ fontFamily:"sans-serif", fontSize:14, color:C.textSec, margin:"0 0 24px", lineHeight:1.6 }}>Structured programs to build lasting mental wellness habits.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {PLANS.map((plan, i) => (
            <GlassCard key={i} style={{ display:"flex", alignItems:"center", padding:0, overflow:"hidden" }}>
              <div style={{ width:4, background:plan.color, alignSelf:"stretch" }} />
              <div style={{ width:54, height:54, borderRadius:"50%", background:`${plan.color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"14px 12px 14px 12px" }}>{plan.icon}</div>
              <div style={{ flex:1, padding:"14px 0" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"Georgia,serif", fontSize:16, color:C.text, flex:1 }}>{plan.title}</span>
                  <div style={{ background:`${plan.color}25`, border:`1px solid ${plan.color}50`, borderRadius:9999, padding:"2px 9px" }}>
                    <span style={{ fontFamily:"sans-serif", fontSize:9, fontWeight:700, color:plan.color }}>{plan.level}</span>
                  </div>
                </div>
                <p style={{ margin:"0 0 8px", fontFamily:"sans-serif", fontSize:12, color:C.textSec, lineHeight:1.5 }}>{plan.desc}</p>
                <span style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, color:plan.color }}>⏱  {plan.duration}</span>
              </div>
              <span style={{ fontSize:24, color:plan.color, paddingRight:16 }}>›</span>
            </GlassCard>
          ))}
        </div>
      </div>
    </GradBg>
  );
}

function CommunityScreen() {
  return (
    <GradBg>
      <div style={{ padding:"8px 16px 40px" }}>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:28, color:C.text, margin:"0 0 6px" }}>Community</h2>
        <p style={{ fontFamily:"sans-serif", fontSize:14, color:C.textSec, margin:"0 0 22px", lineHeight:1.6 }}>Connect with others on similar journeys.</p>

        <p style={{ fontSize:10, color:C.textSec, letterSpacing:2.5, margin:"0 0 12px", fontFamily:"sans-serif" }}>SUPPORT GROUPS</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
          {GROUPS.map((g, i) => (
            <GlassCard key={i} style={{ display:"flex", alignItems:"center", padding:0, overflow:"hidden", cursor:"pointer" }}>
              <div style={{ width:4, background:g.color, alignSelf:"stretch" }} />
              <div style={{ width:48, height:48, borderRadius:"50%", background:`${g.color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:12 }}>{g.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"sans-serif", fontSize:14, fontWeight:600, color:C.text, flex:1 }}>{g.name}</span>
                  {g.live && <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(123,174,142,0.15)", padding:"2px 8px", borderRadius:9999 }}><div style={{ width:6, height:6, borderRadius:"50%", background:C.sage }} /><span style={{ fontFamily:"sans-serif", fontSize:9, fontWeight:700, color:C.sage }}>Live</span></div>}
                </div>
                <span style={{ fontFamily:"sans-serif", fontSize:12, color:C.textSec }}>{g.members.toLocaleString()} members</span>
              </div>
              <div style={{ background:g.color, borderRadius:9999, padding:"8px 14px", margin:12 }}>
                <span style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color:C.deep }}>Join</span>
              </div>
            </GlassCard>
          ))}
        </div>

        <p style={{ fontSize:10, color:C.textSec, letterSpacing:2.5, margin:"0 0 12px", fontFamily:"sans-serif" }}>PROFESSIONALS</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { name:"Dr. Sarah Jenkins", role:"Clinical Psychologist", avail:"Available Today",  now:true  },
            { name:"Mark Thompson",     role:"Therapist, LCSW",       avail:"Next: Tomorrow",   now:false },
          ].map((p,i) => (
            <GlassCard key={i} style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:C.glass, border:`1.5px solid ${C.glassBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", fontSize:15, fontWeight:700, color:C.text, flexShrink:0 }}>
                {p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontFamily:"sans-serif", fontSize:14, fontWeight:600, color:C.text }}>{p.name}</p>
                <p style={{ margin:"0 0 8px", fontFamily:"sans-serif", fontSize:12, color:C.textSec }}>{p.role}</p>
                <div style={{ display:"inline-block", background: p.now ? C.sageFaint : "rgba(255,255,255,0.08)", borderRadius:9999, padding:"3px 10px" }}>
                  <span style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, color: p.now ? C.sage : C.textSec }}>{p.now?"● ":"○ "}{p.avail}</span>
                </div>
              </div>
              <div style={{ background:C.glass, border:`1px solid ${C.glassBorder}`, borderRadius:9999, padding:"8px 14px", cursor:"pointer" }}>
                <span style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color:C.text }}>Message</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </GradBg>
  );
}

function PaywallScreen({ onNav }) {
  const [tier, setTier] = useState(null);
  if (tier) return (
    <GradBg dawn>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", gap:16, padding:32 }}>
        <span style={{ fontSize:48 }}>✅</span>
        <h2 style={{ fontFamily:"Georgia,serif", color:C.text, margin:0 }}>{tier} Unlocked!</h2>
        <button onClick={() => onNav("Home")} style={{ background:C.text, color:C.deep, border:"none", borderRadius:9999, padding:"13px 28px", fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, cursor:"pointer" }}>Go to Home</button>
      </div>
    </GradBg>
  );
  return (
    <GradBg dawn>
      <div style={{ padding:"24px 20px 48px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", border:`1px solid ${C.gold}60`, borderRadius:9999, padding:"5px 16px", marginBottom:18 }}>
            <span style={{ fontFamily:"sans-serif", fontSize:9, fontWeight:700, color:C.gold, letterSpacing:2.5 }}>✦ UNLOCK YOUR POTENTIAL</span>
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:36, color:C.text, margin:"0 0 12px", lineHeight:1.2 }}>Elevate Your Mind</h1>
          <p style={{ fontFamily:"sans-serif", fontSize:15, color:C.textSec, lineHeight:1.65, margin:0 }}>Choose the plan that fits your journey.</p>
        </div>

        {/* Plus */}
        <GlassCard style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div><h2 style={{ fontFamily:"Georgia,serif", fontSize:26, color:C.text, margin:"0 0 4px" }}>Plus</h2><span style={{ fontFamily:"sans-serif", fontSize:13, color:C.textSec }}>Perfect to start</span></div>
            <div style={{ textAlign:"right" }}><span style={{ fontFamily:"Georgia,serif", fontSize:34, color:C.text }}>$9.99</span><span style={{ fontFamily:"sans-serif", fontSize:13, color:C.textSec }}>/mo</span></div>
          </div>
          <div style={{ borderTop:`1px solid ${C.glassBorder}`, marginBottom:16 }} />
          {["Unlimited journaling","Community connections","Stories library","Offline sync"].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:11 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:C.sageFaint, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:11, fontWeight:700, color:C.sage }}>✓</span></div>
              <span style={{ fontFamily:"sans-serif", fontSize:14, color:C.textSec }}>{f}</span>
            </div>
          ))}
          <button onClick={() => setTier("Plus")} style={{ width:"100%", padding:"15px 0", background:C.text, color:C.deep, border:"none", borderRadius:9999, fontFamily:"sans-serif", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:16 }}>Unlock Plus</button>
        </GlassCard>

        {/* Pro */}
        <GlassCard gold style={{ marginBottom:16, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:20, background:C.deep, borderBottomLeftRadius:12, borderBottomRightRadius:12, padding:"6px 14px" }}>
            <span style={{ fontFamily:"sans-serif", fontSize:9, fontWeight:700, color:C.gold, letterSpacing:1.5 }}>MOST POPULAR</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, marginTop:20 }}>
            <div><h2 style={{ fontFamily:"Georgia,serif", fontSize:26, color:C.text, margin:"0 0 4px" }}>Pro</h2><span style={{ fontFamily:"sans-serif", fontSize:13, color:C.textSec }}>Full access</span></div>
            <div><span style={{ fontFamily:"Georgia,serif", fontSize:34, color:C.text }}>$19.99</span><span style={{ fontFamily:"sans-serif", fontSize:13, color:C.textSec }}>/mo</span></div>
          </div>
          <div style={{ borderTop:`1px solid rgba(212,168,83,0.3)`, marginBottom:16 }} />
          {["Everything in Plus","All self-help plans","Professional support","Priority access"].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:11 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:C.goldFaint, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:11, fontWeight:700, color:C.gold }}>✓</span></div>
              <span style={{ fontFamily:"sans-serif", fontSize:14, color:C.textSec }}>{f}</span>
            </div>
          ))}
          <button onClick={() => setTier("Pro")} style={{ width:"100%", padding:"15px 0", background:C.deep, color:C.text, border:"none", borderRadius:9999, fontFamily:"sans-serif", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:16 }}>Unlock Pro</button>
        </GlassCard>

        <div style={{ textAlign:"center" }}>
          <span onClick={() => onNav("Home")} style={{ fontFamily:"sans-serif", fontSize:14, color:C.textFaint, cursor:"pointer" }}>Maybe Later</span>
        </div>
      </div>
    </GradBg>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("Welcome");

  const screenMap = {
    Welcome:   <WelcomeScreen onNav={setScreen} />,
    Home:      <HomeScreen    onNav={setScreen} />,
    Stories:   <StoriesScreen onNav={setScreen} />,
    Plans:     <PlansScreen   onNav={setScreen} />,
    Community: <CommunityScreen />,
    Paywall:   <PaywallScreen  onNav={setScreen} />,
  };

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", position:"relative", fontFamily:"Georgia,serif", overflow:"hidden" }}>
      {/* Nav bar (except Welcome) */}
      {screen !== "Welcome" && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:`${C.deep}EE`, borderTop:`1px solid ${C.glassBorder}`, display:"flex", justifyContent:"space-around", padding:"10px 0 16px", zIndex:100, backdropFilter:"blur(12px)" }}>
          {[
            { s:"Home",      icon:"🏠", label:"Home"      },
            { s:"Stories",   icon:"📚", label:"Stories"   },
            { s:"Plans",     icon:"🗺️", label:"Plans"     },
            { s:"Community", icon:"🤝", label:"Community" },
            { s:"Paywall",   icon:"⭐", label:"Upgrade"   },
          ].map(item => (
            <div key={item.s} onClick={() => setScreen(item.s)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", opacity: screen===item.s ? 1 : 0.45, transition:"opacity 0.2s" }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span style={{ fontSize:9, fontFamily:"sans-serif", color:C.text, letterSpacing:0.5 }}>{item.label}</span>
              {screen===item.s && <div style={{ width:4, height:4, borderRadius:"50%", background:C.gold }} />}
            </div>
          ))}
        </div>
      )}
      <div style={{ paddingBottom: screen !== "Welcome" ? 80 : 0 }}>
        {screenMap[screen]}
      </div>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } textarea::placeholder, input::placeholder { color: rgba(240,237,230,0.35); } button:hover { opacity:0.9; }`}</style>
    </div>
  );
}
