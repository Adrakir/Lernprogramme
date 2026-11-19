// Originalzeichnungen aus Majas Wortwerkstatt.
const ausstattung = {
  "sonnenhut": {
    "title": "Gelber Sonnenhut",
    "art": "<path d=\"M157 66Q158 16 227 22Q295 24 299 66Z\" fill=\"#f4c85e\"/><path d=\"M110 81Q226 49 346 81Q226 111 110 81Z\" fill=\"#f4c85e\"/><path d=\"M166 63Q230 77 294 63\" stroke=\"#bf785f\" stroke-width=\"10\" fill=\"none\"/>",
    "slot": "huete",
    "need": 1
  },
  "forscherbrille": {
    "title": "Blaue Forscherbrille",
    "art": "<g fill=\"#8ecadf\" fill-opacity=\".27\" stroke=\"#377192\" stroke-width=\"6\"><rect x=\"153\" y=\"95\" width=\"66\" height=\"43\" rx=\"12\"/><rect x=\"237\" y=\"95\" width=\"66\" height=\"43\" rx=\"12\"/></g><path d=\"M220 109q8-6 17 0m-84-5-16-5m167 5 15-5\" stroke=\"#377192\" stroke-width=\"6\" fill=\"none\"/>",
    "slot": "brillen",
    "need": 2
  },
  "regenbogenpullover": {
    "title": "Regenbogenpullover",
    "art": "<path d=\"M154 180L121 212L135 276L168 266L178 240L178 281L278 281L282 242L302 267L334 276L344 213L293 179L270 165Q224 188 181 165Z\" fill=\"#77b9c1\" stroke=\"#577e80\" stroke-width=\"4\"/><path d=\"M177 219Q224 196 280 219M180 236Q229 211 277 236M179 254Q226 232 277 254\" stroke-width=\"9\" fill=\"none\" stroke=\"#f6d279\"/><path d=\"M174 279H282\" stroke=\"#416d75\" stroke-width=\"9\"/>",
    "slot": "pullover",
    "need": 3
  },
  "jeans": {
    "title": "Blaue Jeans",
    "art": "<path d=\"M167 273H281L298 390L250 395L225 325L205 395L153 390Z\" fill=\"#4779ae\" stroke=\"#2f5279\" stroke-width=\"5\"/><path d=\"M168 286h113M223 291v34M176 309h23m56 0h22\" stroke=\"#a7c4db\" stroke-width=\"4\" fill=\"none\"/>",
    "slot": "hosen",
    "need": 4
  },
  "turnschuhe": {
    "title": "Türkise Turnschuhe",
    "art": "<path d=\"M133 386q19-6 56 0l29 20q6 14-10 18h-81q-21-3-14-20Z\" fill=\"#49a6a2\" stroke=\"#2d6264\" stroke-width=\"4\"/><path d=\"M247 386q35-9 59 0l26 22q4 15-10 17h-78q-17-1-17-15Z\" fill=\"#49a6a2\" stroke=\"#2d6264\" stroke-width=\"4\"/><path d=\"M118 411h97m15 0h101\" stroke=\"#fff4db\" stroke-width=\"7\"/>",
    "slot": "schuhe",
    "need": 5
  },
  "kuschelmuetze": {
    "title": "Blaue Kuschelmütze",
    "art": "<path d=\"M127 77Q130 15 225 17Q322 14 320 77L298 87Q220 71 147 88Z\" fill=\"#5c9fc3\"/><path d=\"M133 75Q224 62 315 75\" stroke=\"#d3e8ec\" stroke-width=\"13\"/><circle cx=\"227\" cy=\"10\" r=\"17\" fill=\"#f5d6aa\"/>",
    "slot": "huete",
    "need": 6
  },
  "winterschal": {
    "title": "Roter Kuschelschal",
    "art": "<path d=\"M147 176Q224 198 292 174L300 195Q270 215 238 211L253 276L224 283L207 214Q169 211 143 194Z\" fill=\"#ce6171\" stroke=\"#8e4051\" stroke-width=\"5\"/><path d=\"M159 188q62 24 129-2m-74 56 31-9m-28 25 33-10\" fill=\"none\" stroke=\"#f4cac8\" stroke-width=\"7\"/>",
    "slot": "schals",
    "need": 7
  },
  "stiefel": {
    "title": "Rote Winterstiefel",
    "art": "<path d=\"M139 374h59v26l31 11q8 17-13 20h-94q-15-5-7-18l24-14Z\" fill=\"#bc5b56\" stroke=\"#834345\" stroke-width=\"5\"/><path d=\"M250 374h58v28l28 11q7 17-13 18h-91q-16-3-8-18l26-14Z\" fill=\"#bc5b56\" stroke=\"#834345\" stroke-width=\"5\"/><path d=\"M140 378h58m52 0h58\" stroke=\"#fff4df\" stroke-width=\"9\"/>",
    "slot": "schuhe",
    "need": 8
  },
  "beanbag": {
    "title": "Blauer Sitzsack",
    "need": 0,
    "slot": "raum",
    "art": "<svg class=\"bh-art\" viewBox=\"0 0 130 120\" role=\"img\" aria-hidden=\"true\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\"><path d=\"M19 89Q-1 66 22 38Q28 1 64 13Q101 5 110 44Q130 86 92 100Q48 116 19 89Z\" fill=\"#548ac0\"/><path d=\"M30 74q23 24 66 3\" stroke=\"#d6e9f7\" stroke-width=\"5\" fill=\"none\"/></g></svg>"
  },
  "desk": {
    "title": "Forschertisch",
    "need": 2,
    "slot": "raum",
    "art": "<svg class=\"bh-art\" viewBox=\"0 0 130 120\" role=\"img\" aria-hidden=\"true\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"12\" y=\"39\" width=\"104\" height=\"17\" rx=\"4\" fill=\"#b58969\"/><path d=\"M26 54v52m75-52v52\" stroke=\"#876b57\" stroke-width=\"10\"/><rect x=\"68\" y=\"11\" width=\"34\" height=\"26\" fill=\"#f8e6c3\"/></g></svg>"
  },
  "bookshelf": {
    "title": "Bücherregal",
    "need": 4,
    "slot": "raum",
    "art": "<svg class=\"bh-art\" viewBox=\"0 0 130 120\" role=\"img\" aria-hidden=\"true\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"19\" y=\"9\" width=\"92\" height=\"99\" rx=\"6\" fill=\"#aa8059\"/><path d=\"M22 43h86M22 79h86\" stroke=\"#876b57\" stroke-width=\"7\"/><path d=\"M33 19v22m15-25v25m16-18v18m15-22v22M34 53v23m19-20v20m22-21v21m17-17v17\" stroke=\"#e8dfb2\" stroke-width=\"10\"/></g></svg>"
  },
  "rug": {
    "title": "Wiesenteppich",
    "need": 6,
    "slot": "raum",
    "art": "<svg class=\"bh-art\" viewBox=\"0 0 130 120\" role=\"img\" aria-hidden=\"true\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\"><ellipse cx=\"65\" cy=\"70\" rx=\"56\" ry=\"28\" fill=\"#579c80\"/><ellipse cx=\"65\" cy=\"69\" rx=\"39\" ry=\"15\" fill=\"none\" stroke=\"#f4dfaf\" stroke-width=\"7\"/></g></svg>"
  },
  "telescope": {
    "title": "Sterns Fernrohr",
    "need": 9,
    "slot": "raum",
    "art": "<svg class=\"bh-art\" viewBox=\"0 0 130 120\" role=\"img\" aria-hidden=\"true\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\"><path d=\"m27 30 72-23 10 24-72 27Z\" fill=\"#59989e\" stroke=\"#49605a\" stroke-width=\"6\"/><path d=\"M67 47v54m-27 6 27-50 28 50\" stroke=\"#876b57\" stroke-width=\"8\"/></g></svg>"
  },
  "fireplace": {
    "title": "Kamin",
    "need": 12,
    "slot": "raum",
    "art": "<svg class=\"bh-art\" viewBox=\"0 0 130 120\" role=\"img\" aria-hidden=\"true\"><g stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"20\" y=\"26\" width=\"93\" height=\"83\" rx=\"5\" fill=\"#aa7665\"/><rect x=\"37\" y=\"46\" width=\"59\" height=\"55\" fill=\"#49605a\"/><path d=\"M46 89q-9-27 8-33 0 18 11 20 10-25 16-14 17 29-14 38Z\" fill=\"#e7ac69\"/><path d=\"M14 28h103\" stroke=\"#876b57\" stroke-width=\"13\"/></g></svg>"
  }
};
