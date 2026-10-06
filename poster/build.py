import json, base64, random
A=json.load(open('athletes.json'))
font=base64.b64encode(open('font-latin.woff2','rb').read()).decode()
random.seed(5)

# terrazzo confetti pattern
cls=['c-deco','c-far','c-deco2','c-cream','c-far2']
tz=''
for i in range(26):
    x,y,r=random.random()*220,random.random()*220,2+random.random()*7
    tz+= f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" class="{cls[i%5]}"/>' if i%3 else f'<polygon points="{x:.1f},{y:.1f} {x+r*2:.1f},{y+r*.6:.1f} {x+r*.4:.1f},{y+r*1.8:.1f}" class="{cls[i%5]}"/>'

# far shapes along the horizon (local y=0 is the base)
far=''
shapes=[('tri',60,300,'c-far','c-far2'),('arch',250,190,'c-deco','c-far'),('stripe',430,360,'c-far2',None),('arch',640,190,'c-far','c-deco'),('tri',700,300,'c-deco','c-far2'),('stripe',-40,230,'c-deco',None)]
for t,x,h,c1,c2 in shapes:
    w=h*1.05
    if t=='tri':
        far+=f'<polygon points="{x-w},0 {x},{-h} {x},0" class="{c1}"/><polygon points="{x},{-h} {x+w},0 {x},0" class="{c2}"/>'
    elif t=='arch':
        r=w*.8
        far+=f'<path d="M{x-r},0 A{r},{r} 0 0 1 {x+r},0 Z" class="{c1}"/><path d="M{x-r*.55},0 A{r*.55},{r*.55} 0 0 1 {x+r*.55},0 Z" class="{c2}"/><path d="M{x-r*.25},0 A{r*.25},{r*.25} 0 0 1 {x+r*.25},0 Z" class="{c1}"/>'
    else:
        far+=f'<polygon points="{x-w},0 {x},{-h} {x+w},0" class="{c1}"/><polygon points="{x-w},0 {x},{-h} {x+w},0" fill="url(#stripes)" opacity=".55"/>'

# mid teal hills with terrazzo + trees
mid=''
hills=[(120,230,330),(430,170,300),(760,250,360),(1010,160,260)]
for i,(x,h,w) in enumerate(hills):
    mid+=f'<path d="M{x-w},0 A{w},{h} 0 0 1 {x+w},0 Z" class="c-mid"/><path d="M{x},{-h} A{w},{h} 0 0 1 {x+w},0 L{x},0 Z" class="c-mid2"/>'
    if i%2==0: mid+=f'<path d="M{x-w},0 A{w},{h} 0 0 1 {x+w},0 Z" fill="url(#terrazzo)"/>'
trees=[(80,-205,'c-far2'),(190,-218,'c-deco'),(380,-150,'c-far2'),(500,-160,'c-deco'),(740,-232,'c-far2'),(840,-225,'c-deco'),(1000,-150,'c-far2')]
for x,y,c in trees:
    mid+=f'<line x1="{x}" y1="{y+4}" x2="{x}" y2="{y-30}" class="trunk"/><circle cx="{x}" cy="{y-42}" r="20" class="{c}"/>'

P=[(-20,1090),(420,1010),(700,840),(890,640)]
slope=' '.join(f'{x},{y}' for x,y in P)
# mountain colour facets
facets=f'''<polygon points="560,925 700,840 800,1100 640,1100" class="c-main2"/><polygon points="560,925 700,840 800,1100 640,1100" fill="url(#stripes)" opacity=".35"/>
<polygon points="300,1040 420,1010 470,1100 330,1100" class="c-mid"/>
<polygon points="780,780 890,640 1000,640 1000,1100 900,1100" class="c-deco"/><polygon points="780,780 890,640 1000,640 1000,1100 900,1100" fill="url(#stripes)" opacity=".35"/>'''
rainbow=lambda cx,cy:''.join(f'<path d="M{cx-j*55},{cy} A{j*55},{j*55} 0 0 1 {cx+j*55},{cy} Z" class="{["","c-cream","c-acc","c-deco"][j]}"/>' for j in (3,2,1))

svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1414" width="210mm" height="297mm">
<defs>
<pattern id="terrazzo" width="220" height="220" patternUnits="userSpaceOnUse">{tz}</pattern>
<pattern id="stripes" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="28" class="c-cream"/></pattern>
<pattern id="scallop" width="90" height="56" patternUnits="userSpaceOnUse"><path d="M8,20 A18,18 0 0 1 44,20" class="arc"/><path d="M53,48 A18,18 0 0 1 89,48" class="arc"/></pattern>
<clipPath id="sunclip"><circle r="200"/></clipPath>
<clipPath id="mclip"><polygon points="{slope} 1000,640 1000,1100 -20,1100"/></clipPath>
</defs>
<rect width="1000" height="1414" class="c-sky"/>
<g transform="translate(760,600)"><circle r="200" class="c-sun"/><g clip-path="url(#sunclip)">{''.join(f'<rect x="-200" y="{30+i*38}" width="400" height="{8+i*5}" class="c-sky"/>' for i in range(5))}</g></g>
<g transform="translate(0,1000)">{far}</g>
<rect y="1000" width="1000" height="110" class="c-mid"/><g transform="translate(0,1090)">{mid}</g>
<polygon points="{slope} 1000,640 1000,1100 -20,1100" class="c-main"/>
<g clip-path="url(#mclip)"><rect x="-20" y="600" width="1040" height="520" fill="url(#terrazzo)" opacity=".55"/>{facets}{rainbow(900,1100)}</g>
<polygon points="890,640 950,646 1000,676 1000,700 940,716 905,742 880,716 850,744 820,700 780,716" class="c-snow"/>
<line x1="890" y1="640" x2="890" y2="540" class="pole"/><polygon points="890,540 960,558 890,576" class="c-acc"/>
<polyline points="420,1026 700,856 890,656" class="road" fill="none"/>
<g transform="translate(546,919) rotate(-32.7) scale(1.7)">{A['cy']}</g>
<g transform="translate(776,746) scale(1.7)">{A['rn']}</g>
<rect y="1100" width="1000" height="320" class="c-lake"/><rect y="1124" width="1000" height="320" fill="url(#scallop)"/>
<g stroke-linecap="round" class="refl-g">{''.join(f'<line x1="{770-(130-i*16)}" x2="{770+(130-i*16)}" y1="{1130+i*26}" y2="{1130+i*26}" class="refl" stroke-width="{14-i*1.8}"/>' for i in range(5))}</g>
<g transform="translate(400,1185) scale(1.9)">{A['sw']}</g>
<g class="title"><text x="46" y="250" class="t1" style="font-size:223px">AIXMAN</text><text x="40" y="520" class="t1" style="font-size:300px">2027</text></g>
<rect x="210" y="1235" width="580" height="76" rx="38" class="c-cream"/><text x="500" y="1292" text-anchor="middle" class="pill" fill="#1E2A44">SAMEDI 5 JUIN</text>
<rect x="110" y="1326" width="780" height="64" rx="32" class="c-main"/><text x="500" y="1371" text-anchor="middle" class="disc">NATATION  ·  VÉLO  ·  TRAIL</text>
</svg>'''

css=f'''@font-face{{font-family:'League Spartan';font-weight:400 900;src:url(data:font/woff2;base64,{font}) format('woff2')}}
@page{{size:A4;margin:0}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:210mm;height:297mm;background:#F3E7D3;overflow:hidden}}
svg{{display:block}}
:root{{--sky:#F3E7D3;--sun:#F2B33D;--far:#F4B6A6;--far2:#E0603A;--deco:#F2B33D;--deco2:#7FB8A4;--mid:#1D7A74;--mid2:#145E59;--lake:#2747C8;--lake2:#1B338F;--main:#1E2A44;--main2:#E0603A;--snow:#F3E7D3;--fig:#1E2A44;--fig2:#4A5677;--acc:#E0603A;--cream:#F3E7D3;--on-sky:#1E2A44}}
.c-deco{{fill:var(--deco)}}.c-deco2{{fill:var(--deco2)}}.c-cream{{fill:var(--cream)}}.c-sky{{fill:var(--sky)}}.c-sun{{fill:var(--sun)}}.c-far{{fill:var(--far)}}.c-far2{{fill:var(--far2)}}.c-mid{{fill:var(--mid)}}.c-mid2{{fill:var(--mid2)}}.c-lake{{fill:var(--lake)}}.c-lake2{{fill:var(--lake2)}}.c-main{{fill:var(--main)}}.c-main2{{fill:var(--main2)}}.c-snow{{fill:var(--snow);stroke:var(--snow);stroke-width:4;stroke-linejoin:round}}.c-acc{{fill:var(--acc)}}.c-fig{{fill:var(--fig)}}
.arc{{fill:none;stroke:var(--cream);stroke-width:4;stroke-linecap:round;opacity:.6}}.trunk{{stroke:var(--mid2);stroke-width:5;stroke-linecap:round}}
.refl{{stroke:var(--sun);stroke-linecap:round}}.pole{{stroke:var(--cream);stroke-width:5}}
.road{{fill:none;stroke:var(--cream);stroke-width:5;stroke-dasharray:34 26;stroke-linecap:round;opacity:.85}}
.wave{{stroke:var(--cream);stroke-width:4;stroke-linecap:round;opacity:.55}}
.spoke{{stroke:var(--fig2);stroke-width:2.5}}.rim{{fill:none;stroke:var(--fig2);stroke-width:2}}
.speed{{stroke:var(--fig);stroke-width:4;stroke-linecap:round}}
.bars{{fill:none;stroke:var(--fig);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}}.saddle{{stroke:var(--fig);stroke-width:7;stroke-linecap:round}}.shoe{{stroke:var(--fig);stroke-width:9;stroke-linecap:round}}.shoe.back{{stroke:var(--fig2)}}
.limb{{stroke:var(--fig);stroke-linecap:round;fill:none}}.limb.back{{stroke:var(--fig2)}}.limb.deep{{stroke:var(--lake2);stroke-width:12}}
.w14{{stroke-width:14}}.w12{{stroke-width:13}}.w11{{stroke-width:11}}.w10{{stroke-width:10}}.w9{{stroke-width:9}}.w8{{stroke-width:8}}.w5{{stroke-width:5}}
.goggle{{stroke:var(--cream);stroke-width:5;stroke-linecap:round}}.wheel{{fill:none;stroke:var(--fig);stroke-width:7}}
.frame{{fill:none;stroke:var(--fig);stroke-width:6;stroke-linejoin:round;stroke-linecap:round}}.torso{{stroke:var(--acc);stroke-width:27;stroke-linecap:round}}
text{{font-family:'League Spartan',sans-serif;font-weight:900}}
.t1{{fill:#1E2A44;font-size:330px;letter-spacing:-6px}}
.pill{{font-size:44px;letter-spacing:3px}}
.disc{{font-size:34px;letter-spacing:8px;fill:#F3E7D3;font-weight:800}}
'''
open('affiche-aixman-2027.html','w').write(f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Affiche AixMan 2027</title><style>{css}</style></head><body>{svg}</body></html>')
