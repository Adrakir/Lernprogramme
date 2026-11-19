"use strict";
// Mit node redaktion-bauen.cjs aus den Aufgaben erzeugen.
const fragenRegister = [
  {
    "id": "fit-uebung-0",
    "topic": "fit",
    "level": 1,
    "question": "Was hilft Maja bei einem aktiven Nachmittag?",
    "contentHash": "a7f3974b0bdac656d5b64db98d746d832d6a61f9d5b9613dd494eaf1bf49b946",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fit-uebung-1",
    "topic": "fit",
    "level": 1,
    "question": "Wie kann Stern nach dem Spielen zur Ruhe kommen?",
    "contentHash": "1ce155dccf48a54dab364f37b3e0d5823d2405971dcb10499b02b6cd4f1eafa9",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fit-uebung-2",
    "topic": "fit",
    "level": 1,
    "question": "Welcher Snack kombiniert zwei verschiedene Lebensmittelgruppen?",
    "contentHash": "da2aaee6ebbbbbff39205cf44247ed391326ca8085c23085eb0710d92b6c289a",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fit-check",
    "topic": "fit",
    "level": 2,
    "question": "Welcher Plan passt für Bärlis Spielnachmittag?",
    "contentHash": "5a49d3bf965aac14825fe621eeaed77762a252e33b24381ec3ba2bc35b13d9a8",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fit-transfer-0",
    "topic": "fit",
    "level": 2,
    "question": "Maja springt draußen Seil. Was gehört zu einer guten Pause?",
    "contentHash": "dae9c0e854110b5d454d40c573e785444913a99fb5a7973a5acd0f611ed3c16d",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fit-transfer-1",
    "topic": "fit",
    "level": 2,
    "question": "Was packt Stern für einen bewegten Nachmittag ein?",
    "contentHash": "0ea8c5b0a2774c005d71ed57b186721ca5e3682b1e5da72fabf7b604ed8de9f9",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-uebung-0",
    "topic": "labor",
    "level": 1,
    "question": "Welchen Baustoff braucht der Körper zum Wachsen?",
    "contentHash": "cb9e22ee1ba8659b6bf35e176e97120620a515ce1c41748f651d686ded5c15be",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-uebung-1",
    "topic": "labor",
    "level": 1,
    "question": "Welche zwei Lebensmittel liefern zum Beispiel Eiweiß?",
    "contentHash": "ebfc33aace78059be864577506eadce58e37ad5273d1e74fc37808102e5c4feb",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-uebung-2",
    "topic": "labor",
    "level": 1,
    "question": "Welcher Mineralstoff hilft beim Aufbau von Knochen und Zähnen?",
    "contentHash": "20978b39fde9e9c770cb0ffff145870ec888a1c1cb69b479d69fd61ef335b2e7",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-check",
    "topic": "labor",
    "level": 2,
    "question": "Warum braucht dein Körper auch beim Lesen Energie?",
    "contentHash": "ac7bfad35d21522397ddb11ac1d2a6cbf29c4a2469221adcb34617924f9c6913",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-transfer-0",
    "topic": "labor",
    "level": 2,
    "question": "Was braucht Bärlis Körper auch im Schlaf?",
    "contentHash": "0d0f5da02c5f0c986c4aa39db5385a98900aae03c1d2155912c7204c00cbac8b",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-transfer-1",
    "topic": "labor",
    "level": 2,
    "question": "Welche Aussage über Kohlenhydrate und Eiweiß stimmt?",
    "contentHash": "64ffaa0fc463b6b970b239686d79dec467d1d669bdb5415cf9cc3e3cccb8f7c8",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-uebung-0",
    "topic": "ballast",
    "level": 1,
    "question": "Welche beiden Lebensmittel sind typische Ballaststoffquellen?",
    "contentHash": "96a5ac13f9c3c440ec7cdd1c62c7751e6f7fd89f3dd6a69c8ea088afe07b3503",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-uebung-1",
    "topic": "ballast",
    "level": 1,
    "question": "Welches Körperorgan unterstützen Ballaststoffe besonders?",
    "contentHash": "0bfb6f0b8e89db8af0dc1dd82f7dc00644eb5b49b762cd006b3f98fc4ee0dccc",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-uebung-2",
    "topic": "ballast",
    "level": 1,
    "question": "Was passt gut zu ballaststoffreichem Essen?",
    "contentHash": "f62c73aa596c652c5bb432ea2d7bcbf01f966df53dbbbbb7c190448db5c756f0",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-check",
    "topic": "ballast",
    "level": 2,
    "question": "Welche Kombination fügt Ballaststoffe zu Majas Pause hinzu?",
    "contentHash": "46ec7e114121abfd74bc115e44d97c2e89be41ec1ff5fac1cd27e650bb49a9e0",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-transfer-0",
    "topic": "ballast",
    "level": 2,
    "question": "Was kann Stern essen, wenn er eine ballaststoffreiche Beilage sucht?",
    "contentHash": "cdbbe22ba918e7b09c7b74ece4900687294876e38574fc9f3f40c995a7bd6c31",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-transfer-1",
    "topic": "ballast",
    "level": 2,
    "question": "Bärli tauscht sein helles Brötchen gegen ein Vollkornbrötchen. Was ist meist anders?",
    "contentHash": "4a1ced0c8c6c416ff5e7845d150ff78d38540ee3bf9968c2be3235cae0643dcf",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-uebung-0",
    "topic": "pyramide",
    "level": 1,
    "question": "Wohin gehört Naturjoghurt?",
    "contentHash": "cae564382fcf26872c5644e140962dd2c0bf7f6ce4526acb1cfa4b037dd3f5a4",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-uebung-1",
    "topic": "pyramide",
    "level": 1,
    "question": "Wo findet Maja angebratene Kartoffeln, wenn es um die Kartoffeln als Grundzutat geht?",
    "contentHash": "c1676a71b2dfbba4b3ff3f83c1b8758e8b0fdd65ecc57607411a4594895e0317",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-uebung-2",
    "topic": "pyramide",
    "level": 1,
    "question": "Welche zwei Lebensmittel gehören zu den Extras?",
    "contentHash": "a4f102ca924289d02df426867e65c4562e34dbdf8247982d74a6ce66833dd6dd",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-check",
    "topic": "pyramide",
    "level": 2,
    "question": "Wofür stehen Grün, Gelb und Rot in der Pyramide?",
    "contentHash": "c52f3884d7bf0723fd1fb32ddf164eed7c352d73049f7738c6fe27566eb3a225",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-transfer-0",
    "topic": "pyramide",
    "level": 2,
    "question": "Maja räumt Butter und Haselnüsse ein. Wie ordnet sie richtig zu?",
    "contentHash": "7694006bcafe5d140208c49b6bc3e14ac60352d4ddf2d47443ca94f568777263",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-transfer-1",
    "topic": "pyramide",
    "level": 2,
    "question": "Bärli legt einen Apfel und einen Keks aus. Welche Zuordnung stimmt?",
    "contentHash": "fd29c1c2e2d293c879d19865730794f90fe75bc6c0b7ee7bf35d0004df981f47",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-uebung-0",
    "topic": "fruehstueck",
    "level": 1,
    "question": "Stern hat Wasser und Vollkornbrot. Was ergänzt die beiden fehlenden Bausteine?",
    "contentHash": "a9f36cb80742b69b8214ed1d52f4688f3ab8a5672f274eeb4f4187b0c5b6aff7",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-uebung-1",
    "topic": "fruehstueck",
    "level": 1,
    "question": "In welche Gruppe gehören Haferflocken?",
    "contentHash": "289f38f9235d3e0f1e23cd3a8785e08cc6160d33acdfac363528e96b2c396c20",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-uebung-2",
    "topic": "fruehstueck",
    "level": 1,
    "question": "Welches Getränk passt zu Majas Pyramidenfrühstück?",
    "contentHash": "90eea9e359d556d0fe038ce9f74d4c20e302e68afed4d66fe73636a527dfa049",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-check",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Welche Auswahl enthält alle vier Frühstücksbausteine?",
    "contentHash": "49c25323a941f2071254f36a78213a3a08bb52b3c6642b2d8ade68abc6083008",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-transfer-0",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Welches zweite Frühstück passt zu allen vier Bausteinen?",
    "contentHash": "eb61d13f68e30ceae0a5454aed267a48d5564765e8e44ce82e584f72e400b930",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-transfer-1",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Stern hat Tee, Gurke und Käse. Was fehlt noch für ein Pyramidenfrühstück?",
    "contentHash": "c89dec261687936c783ccb21a7deed75239b9618ce5b873da6811178e00533fd",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-uebung-0",
    "topic": "zucker",
    "level": 1,
    "question": "Saft hat 10 g und eine Schorle 4 g Zucker, jeweils je 100 ml. Welches Getränk hat in gleicher Menge mehr Zucker?",
    "contentHash": "4c66a0277233ae2cc6b392cd83878f5caf7f400818aedf7cba96210e462e4210",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-uebung-1",
    "topic": "zucker",
    "level": 1,
    "question": "Was zählt die Zeile „davon Zucker“?",
    "contentHash": "44bc20ebeeb608854b3a46e5ccde3d000cc55eef54830642489d840637b9a4ef",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-uebung-2",
    "topic": "zucker",
    "level": 1,
    "question": "Eine Schorle hat 4 g Zucker je 100 ml. Wie viel Zucker steckt in zwei Gläsern mit je 100 ml?",
    "contentHash": "89ebd46ab9717606bccb1ae463ef85089b9f01a9b66d16884dc45d87468adc32",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-check",
    "topic": "zucker",
    "level": 2,
    "question": "Welche Angaben eignen sich für einen fairen Zuckervergleich zwischen zwei Getränken?",
    "contentHash": "4f2f345d84888304f2bc7a976585da1f34af508af84f2d194a830c48d6c82889",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-transfer-0",
    "topic": "zucker",
    "level": 2,
    "question": "Auf zwei Flaschen steht 3 g und 8 g Zucker, beide je 100 ml. Was kann Maja sagen?",
    "contentHash": "95836e266bc230a483141a1825b7adc5764bc0406c3b1676aab8c1897aa979cb",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-transfer-1",
    "topic": "zucker",
    "level": 2,
    "question": "Ein Glas hat 100 ml Apfelschorle mit 5 g Zucker. Wie viel Zucker steckt in 200 ml derselben Schorle?",
    "contentHash": "66c49a9a98b235f637809665ef88793a5c6403227b25b64210861a93f2279088",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-uebung-0",
    "topic": "geschichte",
    "level": 1,
    "question": "Was passt aus dem Picknick zur grünen Hälfte der Pyramide?",
    "contentHash": "27e8ce67946b37d68d360a94dfc721f8d072d17387287331ce75de775ae5579b",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-uebung-1",
    "topic": "geschichte",
    "level": 1,
    "question": "Was ergänzt Naturjoghurt und Vollkornbrot zu einem vollständigen Pyramidenfrühstück?",
    "contentHash": "6208227a1db64614baac53db4625d0accd4334720ebac976c19ce7d88847535a",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-uebung-2",
    "topic": "geschichte",
    "level": 1,
    "question": "Was kann Bärli nach dem Rennen tun, um sich zu erholen?",
    "contentHash": "379c5972378b796e31c2417972d5933a1628864cd4b46ff1f0bf878fe5bc04ff",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-check",
    "topic": "geschichte",
    "level": 2,
    "question": "Wie kann Maja erklären, warum das Picknick aus Wasser, Möhre, Vollkornbrot und Käse zum Frühstücksmodell passt?",
    "contentHash": "020f7768cb1365b7df9e1a99bc66a7ff1eb031924ec68a4be6026e573f8970d8",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-transfer-0",
    "topic": "geschichte",
    "level": 2,
    "question": "Stern bringt Wasser, Brot, Quark und Apfel mit. Warum passt das zum Frühstücksmodell?",
    "contentHash": "14f3d025d8cb25911b6453a26d7bb1b1d30559202bebac9ebca67706872bbb9e",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-transfer-1",
    "topic": "geschichte",
    "level": 2,
    "question": "Stern ersetzt im Frühstück die Möhre durch eine Birne. Was bleibt gleich?",
    "contentHash": "350d1d91f5aa15c5d5efae45a96111d9dbde7f0e51c3625fe1bf027792b76753",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-0",
    "topic": "fit",
    "level": 2,
    "question": "Maja war lange auf dem Spielplatz. Was hilft ihr, sich zu erholen?",
    "contentHash": "e3065d95b61bbecee88ea15f043f94e228d5079fbcb0ad25ea2d5e4e6f546199",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-1",
    "topic": "labor",
    "level": 2,
    "question": "Was liefert unter anderem Energie für Bewegung?",
    "contentHash": "97c11b30668886dc452aa7c4f66de1620a430a99ae8f1a52abded508a6fe9ff6",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-2",
    "topic": "ballast",
    "level": 2,
    "question": "In welchen zwei Brotdosen findest du eine typische Ballaststoffquelle?",
    "contentHash": "f02d83ac8d9c07a37808f1471a89f8c196fc79357ef3a5ef7f43a25c2b37f4d4",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-3",
    "topic": "pyramide",
    "level": 2,
    "question": "Was bedeutet Grün in der Pyramide?",
    "contentHash": "75b4bcf5bd2f9d529b1ab7c0ba398e10acb648007be109f344be33ccabdcd86e",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-4",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Bärli hat Wasser, Brot und Quark. Welche Auswahl füllt den noch fehlenden Baustein?",
    "contentHash": "f136912cc7fbc9a3c20d6eebfd2eb006cb97285938046e223f3168fe7003d1ab",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-5",
    "topic": "zucker",
    "level": 2,
    "question": "Bei einem Getränk steht „davon Zucker: 5 g je 100 ml“. Wie viel Zucker steckt in 100 ml?",
    "contentHash": "68505e85dc3a24685937a8891a8790a5ff9de2df983be070fb3b69a0e3cd0d1c",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-6",
    "topic": "pyramide",
    "level": 2,
    "question": "Wohin gehören Kichererbsen?",
    "contentHash": "365e2e65b57253fa5ef299245a0eb176fcfe5399c8b91231f032e823b5fb21db",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-0-7",
    "topic": "geschichte",
    "level": 2,
    "question": "Was kann Maja beim Picknick zum Durstlöschen mitnehmen?",
    "contentHash": "faa60f06d0e263e31621faab8fbfa40dcf86119d108902c48eb491dcb5b618d2",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-0-0",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Im Energiekreis fehlen drei Sätze. Ergänze die Lücken in der richtigen Reihenfolge: Bewegung → (1) → Essen und Trinken → (2) → neue Energie → (3).",
    "contentHash": "655b70d4e0525821f0b717d5427acf534ec781cc782f0b0d2653247f25b30a2c",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-0-1",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Bärli meint: „Wenn ich still lese, braucht mein Körper keine Energie.“ Erkläre ihm in einem Satz, was sein Körper beim Lesen trotzdem tut.",
    "contentHash": "dd8fb94a4312b222235488c4aa67d361373b817a9efde28acaa3d94032c0e892",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-0",
    "topic": "fit",
    "level": 2,
    "question": "Was hilft Bärli nach einem aktiven Tag, sich zu erholen?",
    "contentHash": "9ec4417c41556d998bc3be1e86c00a650d2882161664a8c83c66cdfa30343728",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-1",
    "topic": "labor",
    "level": 2,
    "question": "Welche Aufgabe hat Eiweiß im Körper?",
    "contentHash": "84c752f5e9544f540a73865fd051d8623f89cfc9f3f15f883b8efb24c8ad3318",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-2",
    "topic": "ballast",
    "level": 2,
    "question": "Warum können manche Ballaststoffe den Stuhl weicher machen?",
    "contentHash": "b48ece69df8b48971993d595523da70713e4772109032df8f50932935a97c11a",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-3",
    "topic": "pyramide",
    "level": 2,
    "question": "Zu welcher Gruppe gehört Rapsöl?",
    "contentHash": "f9789a5e25a2f6f48dd2b47678cc3ecc4c39e4f46c14b76330d0c860748794c4",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-4",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Welche zwei passen als Getreidebaustein in Bärlis Frühstück?",
    "contentHash": "b17fc569a6a55154cec1a3ed5ec52125bd247871efea6e73912ba76760841c19",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-5",
    "topic": "zucker",
    "level": 2,
    "question": "Eine Schorle enthält 3 g Zucker je 100 ml. Wie viel sind es bei 200 ml?",
    "contentHash": "739f1d5288a2073ecf6c7083a9576283765924e393151799247439d8e98a7ec1",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-6",
    "topic": "pyramide",
    "level": 2,
    "question": "Auf welcher Ebene steht Schokolade?",
    "contentHash": "38ab7620cedf69370da5894ab73aee0f4ae51b49618b20e18631c0271829fc8d",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-1-7",
    "topic": "geschichte",
    "level": 2,
    "question": "Stern hat einen Apfel, Naturjoghurt, Wasser und Brot dabei. Welche Änderung behält alle vier Bausteine?",
    "contentHash": "8da83fa88e85bd8c3cf555c68e38f6833c7673f5759c1f8db4388df129546a1b",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-1-0",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Stelle ein Pyramidenfrühstück zusammen. Schreibe neben jedes der vier Lebensmittel, zu welchem Baustein es gehört.",
    "contentHash": "ed38358e7dae021f417e1350203306888bf75488d3f55e424d29102db83f32b5",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-1-1",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Maja nimmt für ihre Brotdose Vollkornbrot. Erkläre, was daran dem Darm helfen kann.",
    "contentHash": "31c65263770ce85c1aa36e255254b2a3f5215a9949a9fadd82f3dd1578430e9c",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-0",
    "topic": "fit",
    "level": 2,
    "question": "Maja hat Sport und möchte Wasser mitnehmen. Wann passt eine Trinkpause?",
    "contentHash": "c1437a36bbe5aee70b0a201ed5995e30d22d7934f34742922a3037f4f7234787",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-1",
    "topic": "labor",
    "level": 2,
    "question": "Warum braucht dein Körper Wasser?",
    "contentHash": "831da33555867cf5b295875f6025d45a33e69fb944eab61632e6f390af4b342c",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-2",
    "topic": "ballast",
    "level": 2,
    "question": "Welche zwei Lebensmittel liefern typischerweise Ballaststoffe?",
    "contentHash": "ea391465406925d2d70d756e5532571177573b65b196e5b52d71d5e9d060da23",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-3",
    "topic": "pyramide",
    "level": 2,
    "question": "Welche Gruppe steht ganz unten?",
    "contentHash": "88aa7bfd28b53638746a2f3d991d065f0bf7ea40d7189712d99bad347526b8c1",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-4",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Stern wählt Wasser, Haferflocken und eine Banane. Welche Ergänzung passt?",
    "contentHash": "dac87560b6b4d6d303e8d779504b580b4082d54684b89dde32ae5d17c8802604",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-5",
    "topic": "zucker",
    "level": 2,
    "question": "Ein Getränk hat 6 g Zucker je 100 ml, das andere 8 g je 100 ml. Was lässt sich direkt vergleichen?",
    "contentHash": "0d229ec28e38856e1f77696fa332fa3b61f20794601e949aac091541cbc45b79",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-6",
    "topic": "zucker",
    "level": 2,
    "question": "Apfelsaft hat laut Etikett 10 g Zucker je 100 ml. Was kannst du daraus ablesen?",
    "contentHash": "41184977542aaa2b36147724c51f523165500931c36582d337b731ce3aaef5f6",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-2-7",
    "topic": "geschichte",
    "level": 2,
    "question": "Für die Pause hat Bärli Käse, Möhren und Wasser. Welcher Baustein fehlt?",
    "contentHash": "ea3c384e09ddfd11ce3f10937d1292338f288a4373e64685fb11bdcb731884ea",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-2-0",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Die Apfelschorle enthält 4 g Zucker je 100 ml. Der Apfelsaft enthält 10 g Zucker je 100 ml. Berechne die Zuckermenge für je 200 ml. Schreibe beide Ergebnisse mit Einheit auf.",
    "contentHash": "78c33ad9cc9b1d9ce06223d007525361f03d336a089c05b25a6b2e7d5892f147",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-2-1",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Stern will eine kleine Flasche Schorle und einen großen Saftkarton vergleichen. Erkläre, welche Angabe er auf beiden Verpackungen suchen soll und warum.",
    "contentHash": "42f352b988a22ee5cc993e6d2345bd28a749db1e22a2acf31226084f4a52dd34",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-0",
    "topic": "fit",
    "level": 2,
    "question": "Welche Beschäftigung zählt zu Bewegung?",
    "contentHash": "18501fb36b89eff336a1d6ac5a64f9217d1dfe694c3cfb669dca1a8e4a2ccb74",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-1",
    "topic": "labor",
    "level": 2,
    "question": "Welches Beispiel zeigt eine Aufgabe von Fett?",
    "contentHash": "0d2a4c06f0dd1552915a76891fab0057946314e550a2deed2b9960281fa900a0",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-2",
    "topic": "ballast",
    "level": 2,
    "question": "Welches Brot ist meistens ballaststoffreicher?",
    "contentHash": "e14c2dc33696f5b632b25eb7fc660725b7f01a4b9c2155a80d330ae62e6de525",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-3",
    "topic": "pyramide",
    "level": 2,
    "question": "Welche zwei gehören in die Gruppe Nüsse und Saaten?",
    "contentHash": "4907548494da7d7323b4f81053bdfa7a6f27aeb4278eac015c9dcd4eebe87fdd",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-4",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Was sind im Unterricht die vier Frühstücksbausteine?",
    "contentHash": "48facff21d8d42355d83464e1f2822fcefc52bd3a648eec37500e77791714376",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-5",
    "topic": "zucker",
    "level": 2,
    "question": "Auf einem festen Müsli steht „davon Zucker: 12 g je 100 g“. Womit lässt sich das direkt vergleichen?",
    "contentHash": "3479ca97b4c541596f00a2b3dc9ccbf27bd7e8607da0f68e9b51b189f39528c0",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-6",
    "topic": "pyramide",
    "level": 2,
    "question": "Warum ist die Pyramide an der Spitze besonders schmal?",
    "contentHash": "f4af4adf56e8c7d2ca418113eab2066e97680de6dd6d748a32e77fad7520592a",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-3-7",
    "topic": "geschichte",
    "level": 2,
    "question": "Welche zwei Dinge helfen Bärli direkt nach einem langen Spiel?",
    "contentHash": "48622f9bc79cf293632ad1b314bcc71df2c39f311dd9fc217e0681d99319ac1d",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-3-0",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Beschrifte die Lebensmittel für das Picknick. Nenne die Pyramiden-Gruppe für Leitungswasser, Möhren, Vollkornbrot und Schokolade.",
    "contentHash": "1bc7272ba0714912b58131dfe92b5ef71940bf4e304c748de6f0a0e6b6ef3451",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-3-1",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Nach dem Parcours braucht Bärli eine Pause. Was kann er jetzt tun? Nenne zwei Dinge und begründe eins davon.",
    "contentHash": "a5990d09caaafbee537ca57d2bff9fadd3541e9539fa4e3b8bd46e0906713dba",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-0",
    "topic": "fit",
    "level": 2,
    "question": "Bärli will fit durch den Tag kommen. Was gehört außer Bewegung und Essen dazu?",
    "contentHash": "1573eb26a7f9538e031407b50b171db2d2b47ff3b714751946ea6d690c6634af",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-1",
    "topic": "labor",
    "level": 2,
    "question": "Welche zwei Aussagen über Nährstoffe stimmen?",
    "contentHash": "78183f094121d22455c2ac5e9db794171e2585c5152db42d8e26cb873bce1e44",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-2",
    "topic": "ballast",
    "level": 2,
    "question": "Welches Beispiel verbindet eine Ballaststoffquelle mit einem Getränk zum Durstlöschen?",
    "contentHash": "9082111f18ad7a65090f8ddab13b42e1cc12c9608969f4f8c6093663d35e1ea6",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-3",
    "topic": "pyramide",
    "level": 2,
    "question": "Wo gehört ein Glas Milch im Pyramidenmodell hin?",
    "contentHash": "2ecb53eacfc3af64ed4af44192db8e57943f124b7df8f3286832531ddabcfe2d",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-4",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Welche zwei Dinge ergänzen Wasser und eine Möhre zu einem Pyramidenfrühstück?",
    "contentHash": "75aea3093fda7ee7ca55d294865c0302ecc38f4dda0be393b4827831b20f80a0",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-5",
    "topic": "zucker",
    "level": 2,
    "question": "Ein Getränk hat 7 g Zucker je 100 ml. Wie viel steckt in zwei gleich großen Portionen zu je 100 ml?",
    "contentHash": "350f59e73a803ce191a0cf3eb6c4aa7e4146525f285f6f73472a5152679d0399",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-6",
    "topic": "pyramide",
    "level": 2,
    "question": "Welche Gruppe hat in der Pyramide die Ampelfarbe Gelb?",
    "contentHash": "496e793f2dafd65785b53572021306862963b251d51cc49791ac8e12a7a49342",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "arbeit-4-7",
    "topic": "geschichte",
    "level": 2,
    "question": "Stern erklärt seine Auswahl für das Picknick. Welche Begründung passt?",
    "contentHash": "1d58b4ac73f352cd9ae433ba5289e809fa9f00de1971b400492888618ac6debb",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-4-0",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Trage je einen Fachbegriff ein. (1) Dieser Stoff dient als Baustoff für Muskeln. (2) Diese pflanzlichen Bestandteile helfen der Verdauung. (3) Dieser Mineralstoff ist wichtig für Knochen und Zähne.",
    "contentHash": "adc6ad50f6ae8500605619ca74db50f3bd7745d9f8048ba381f14ab56dd14c21",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "schreiben-4-1",
    "topic": "uebergreifend",
    "level": 3,
    "question": "Maja stellt aus Wasser, Äpfeln, Haferflocken und Quark ein Frühstück zusammen. Tausche genau ein Lebensmittel aus und erkläre, warum alle vier Bausteine weiterhin enthalten sind.",
    "contentHash": "74362e5d14ce8088066ec926b71ebd068dd18619d87337dbf1cfa91744a066da",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "baerli-0",
    "topic": "pyramide",
    "level": 2,
    "question": "Bärli stellt Milch ganz unten zu den Getränken. Welche Gruppe passt für Milch?",
    "contentHash": "7b6b834506cd67a99f32559b622ad826054ab9ad54a7ee12559b449c15cb43a7",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "baerli-1",
    "topic": "fruehstueck",
    "level": 2,
    "question": "Bärli packt Apfel, Gurke, Möhre und Birne ein. „Vier Dinge, also vier Frühstücksbausteine!“ Welche Bausteine fehlen?",
    "contentHash": "715579392c40ae24a911fd7334aaa1ef7c4f0aed2c1605fffd13661a244cb27b",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "baerli-2",
    "topic": "zucker",
    "level": 2,
    "question": "Bärli vergleicht Zucker je 100 ml mit Zucker je 500 ml. Wie kann er fair vergleichen?",
    "contentHash": "2a4f5593f95ef99b627b6ea252793dd2dc20d25afaa3235fe7b75326e267d98a",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "baerli-3",
    "topic": "labor",
    "level": 2,
    "question": "Bärli meint, sein Körper brauche beim Lesen keine Energie. Wie erklärst du ihm den Fehler?",
    "contentHash": "48e39240bd416ff26657e4618e55429d9703aae8eee51a772fea7b4d98979daf",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "baerli-4",
    "topic": "ballast",
    "level": 2,
    "question": "Bärli sucht Ballaststoffe und greift nur zu Käse. Welche Ergänzung liefert Ballaststoffe?",
    "contentHash": "efaaeb8bead89129a06f811cf35dbfd4fa242774c345ef581fd43097e48eef73",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "baerli-5",
    "topic": "fit",
    "level": 2,
    "question": "Bärli möchte den ganzen Nachmittag rennen und jede Pause auslassen. Wie verbesserst du seinen Plan?",
    "contentHash": "3a724e01d8fbae00466c47b5b36fda3ed74aaa45178b53f168c7f7b71cfa7ad5",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fit-alltag",
    "topic": "fit",
    "level": 3,
    "question": "Schreibe zwei Dinge auf, die du für eine aktive Pause mitnehmen oder einplanen möchtest.",
    "contentHash": "aeafbd74827fc637cd98bf22be8b2c718d6808aa8265e1aed63e0b548a171700",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "labor-alltag",
    "topic": "labor",
    "level": 3,
    "question": "Suche auf einer Lebensmittelpackung die Wörter Eiweiß, Kohlenhydrate oder Fett. Schreibe ein Wort und das Lebensmittel auf.",
    "contentHash": "067d73b7e194b9231b5584ef5b6012442b16593ad243e27e3fbf96d22b29a179",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "ballast-alltag",
    "topic": "ballast",
    "level": 3,
    "question": "Schau mit einem Erwachsenen auf eine Brot- oder Nudelpackung. Findest du das Wort Vollkorn? Was hast du entdeckt?",
    "contentHash": "cbfd0d0d87f5e42c41b675dbf11cff2a2ffa23762d0ed53ac80d832d1c8e8f76",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "pyramide-alltag",
    "topic": "pyramide",
    "level": 3,
    "question": "Wähle drei Lebensmittel und schreibe zu jedem die Gruppe aus der Pyramide.",
    "contentHash": "6039de65d900710dfe7b5c099354c8bd9a7a6c342f035309a91694f95d912bce",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "fruehstueck-alltag",
    "topic": "fruehstueck",
    "level": 3,
    "question": "Welche der vier Bausteine findest du heute? Was könnte noch dazukommen?",
    "contentHash": "27ff9959b7e8c676f6ef26447a9e1de7eb8fd1a10940a816136f96146c052284",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "zucker-alltag",
    "topic": "zucker",
    "level": 3,
    "question": "Suche mit einem Erwachsenen auf zwei Getränken die Angabe „davon Zucker je 100 ml“. Schreibe beide Werte auf und vergleiche.",
    "contentHash": "cdd8d440727228691cbe4ded7c4f207f153c61f9b09ccf338aa0cff65cafb942",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "geschichte-alltag",
    "topic": "geschichte",
    "level": 3,
    "question": "Was würdest du für Maja, Stern und Bärli mitnehmen? Begründe eine Auswahl.",
    "contentHash": "f04188fc03a0abf42fdda27b3fc64f2127d175229b82940f31a7f9b82a1429f3",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "gericht-0",
    "topic": "pyramide",
    "level": 3,
    "question": "Zerlege Belegtes Vollkornbrot in seine Zutaten.",
    "contentHash": "82ed28f75ea9e14e2cafb30328f45d4371909b06c3559b1530f15c10fa49d342",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "gericht-1",
    "topic": "pyramide",
    "level": 3,
    "question": "Zerlege Müsli in seine Zutaten.",
    "contentHash": "5e4a1bfe9dc7ce01033909355a7075884f9581b7e335adfe67a7d6f550fba401",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  },
  {
    "id": "gericht-2",
    "topic": "pyramide",
    "level": 3,
    "question": "Zerlege Selbst belegte Pizza in seine Zutaten.",
    "contentHash": "532ec0d89fabee7cc7eb11acd70dc112235986799ad394db1f924c2ae6bca0e7",
    "sources": [
      "https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/was-esse-ich",
      "https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/",
      "https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/am-besten-wasser-trinken"
    ],
    "reviewDate": "2026-11-19",
    "reviewStatus": "Redaktionelle Vorlage; automatische Strukturprüfung"
  }
];
