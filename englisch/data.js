// Wortschatz: Unit 1 S. 231–233, Welcome S. 230 und früherer Welcome-Stand.
const vocab=[
  {
    "id": 0,
    "en": "pet",
    "de": "das Haustier",
    "image": "cat",
    "example": "My pet is a cat.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 1,
    "en": "cute",
    "de": "niedlich; süß",
    "image": "rabbit",
    "example": "Your rabbit is cute.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 2,
    "en": "scary",
    "de": "unheimlich; gruselig",
    "image": "spider",
    "example": "The spider looks scary.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 3,
    "en": "boring",
    "de": "langweilig",
    "image": null,
    "example": "This game is boring.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 4,
    "en": "budgie",
    "de": "der Wellensittich",
    "image": "budgie",
    "example": "My budgie is green and yellow.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 5,
    "en": "cat",
    "de": "die Katze",
    "image": "cat",
    "example": "The cat is on my bed.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 6,
    "en": "fish",
    "de": "der Fisch",
    "image": "fish",
    "example": "There are three fish in the tank.",
    "page": 230,
    "unit": "welcome",
    "hint": "Ein Fisch: fish. Mehrere Fische: fish – hier bleibt die Form gleich.",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 7,
    "en": "guinea pig",
    "de": "das Meerschweinchen",
    "image": "guinea pig",
    "example": "My guinea pig likes carrots.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 8,
    "en": "parrot",
    "de": "der Papagei",
    "image": "parrot",
    "example": "The parrot is colourful.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 9,
    "en": "rabbit",
    "de": "das Kaninchen",
    "image": "rabbit",
    "example": "The rabbit is in the garden.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 10,
    "en": "rat",
    "de": "die Ratte",
    "image": "rat",
    "example": "The rat is small.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 11,
    "en": "snake",
    "de": "die Schlange",
    "image": "snake",
    "example": "The snake is long.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 12,
    "en": "spider",
    "de": "die Spinne",
    "image": "spider",
    "example": "The spider has eight legs.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 13,
    "en": "under",
    "de": "unter",
    "image": null,
    "example": "The ball is under the bed.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter"
  },
  {
    "id": 14,
    "en": "I don’t like …",
    "de": "Ich mag … nicht.; Ich mag ... nicht.",
    "image": null,
    "example": "I don’t like spiders.",
    "page": 230,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "aliases": [
      "I don't like ..."
    ]
  },
  {
    "id": 15,
    "en": "more",
    "de": "mehr",
    "image": null,
    "example": "I need more time.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter"
  },
  {
    "id": 16,
    "en": "animal",
    "de": "das Tier",
    "image": "rabbit",
    "example": "A rabbit is an animal.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 17,
    "en": "hobby",
    "de": "das Hobby",
    "image": null,
    "example": "My hobby is dancing.",
    "page": 230,
    "unit": "welcome",
    "hint": "Einzahl: hobby. Mehrzahl: hobbies (y wird zu ies).",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 18,
    "en": "football",
    "de": "der Fußball",
    "image": "football",
    "example": "I play football with Ben.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 19,
    "en": "run",
    "de": "rennen; laufen",
    "image": "running",
    "example": "I run in the park.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "aliases": [
      "to run"
    ]
  },
  {
    "id": 20,
    "en": "music",
    "de": "die Musik",
    "image": "music",
    "example": "I like music.",
    "page": 230,
    "unit": "welcome",
    "topic": "Tiere & Hobbys"
  },
  {
    "id": 21,
    "en": "swim",
    "de": "schwimmen",
    "image": "swimming",
    "example": "I swim on Monday.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "aliases": [
      "to swim"
    ]
  },
  {
    "id": 22,
    "en": "dance",
    "de": "tanzen",
    "image": "dancing",
    "example": "We dance to the music.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "aliases": [
      "to dance"
    ]
  },
  {
    "id": 23,
    "en": "what",
    "de": "was",
    "image": null,
    "example": "What is in your bag?",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter"
  },
  {
    "id": 24,
    "en": "What about you?",
    "de": "Und du?; Und ihr?; Was ist mit dir?; Was ist mit euch?; Und was ist mit dir?",
    "image": null,
    "example": "I like cats. What about you?",
    "page": 230,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze"
  },
  {
    "id": 25,
    "en": "if",
    "de": "wenn; falls",
    "image": null,
    "example": "If you need help, ask me.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter"
  },
  {
    "id": 26,
    "en": "need",
    "de": "brauchen; benötigen",
    "image": null,
    "example": "I need my phone.",
    "page": 230,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "aliases": [
      "to need"
    ]
  },
  {
    "id": 27,
    "en": "at home",
    "de": "daheim; zu Hause",
    "image": "house",
    "example": "My sister is at home.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 28,
    "en": "everyone",
    "de": "jeder; alle",
    "image": null,
    "example": "Everyone is here.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 29,
    "en": "This is …",
    "de": "Dies ist …; Das ist …",
    "image": null,
    "example": "This is my brother.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 30,
    "en": "street",
    "de": "die Straße",
    "image": "street",
    "example": "My house is in this street.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 31,
    "en": "It’s called …",
    "de": "Er heißt …; Sie heißt …; Es heißt …",
    "image": null,
    "example": "It’s called Sunny Road.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 32,
    "en": "road",
    "de": "die Straße; die Landstraße",
    "image": "road",
    "example": "The road goes to the village.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 33,
    "en": "car",
    "de": "das Auto",
    "image": "car",
    "example": "The car is blue.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 34,
    "en": "house",
    "de": "das Haus",
    "image": "house",
    "example": "Our house has a red door.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 35,
    "en": "a lot of",
    "de": "viel; viele",
    "image": null,
    "example": "We have a lot of books.",
    "page": 231,
    "unit": "unit1",
    "aliases": [
      "lots of"
    ]
  },
  {
    "id": 36,
    "en": "lots of",
    "de": "viel; viele",
    "image": null,
    "example": "There are lots of cats here.",
    "page": 231,
    "unit": "unit1",
    "aliases": [
      "a lot of"
    ]
  },
  {
    "id": 37,
    "en": "postman",
    "de": "der Briefträger; der Postbote",
    "image": null,
    "example": "The postman has a parcel.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 38,
    "en": "morning",
    "de": "der Morgen; der Vormittag",
    "image": null,
    "example": "I listen to music in the morning.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 39,
    "en": "doorbell",
    "de": "die Türklingel; die Türglocke",
    "image": "doorbell",
    "example": "The doorbell is loud.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 40,
    "en": "bell",
    "de": "die Klingel; die Glocke",
    "image": "bell",
    "example": "I can hear a bell.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 41,
    "en": "maybe",
    "de": "vielleicht",
    "image": null,
    "example": "Maybe my dad is at home.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 42,
    "en": "dad",
    "de": "der Papa; der Vati",
    "image": null,
    "example": "My dad is in the garden.",
    "page": 231,
    "unit": "unit1",
    "hint": "my dad: klein. Als Name oder Anrede: Dad. Beispiel: Dad, come here!"
  },
  {
    "id": 43,
    "en": "mum",
    "de": "die Mama; die Mutti",
    "image": null,
    "example": "My mum likes music.",
    "page": 231,
    "unit": "unit1",
    "hint": "my mum: klein. Als Name oder Anrede: Mum. Beispiel: Mum, come here!"
  },
  {
    "id": 44,
    "en": "come",
    "de": "kommen",
    "image": null,
    "example": "Come to my house, please.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 45,
    "en": "so",
    "de": "also; deshalb; daher",
    "image": null,
    "example": "I like animals, so I have a pet.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 46,
    "en": "you’re",
    "de": "du bist",
    "image": null,
    "example": "You’re in my class.",
    "page": 231,
    "unit": "unit1",
    "aliases": [
      "you are"
    ]
  },
  {
    "id": 47,
    "en": "her class",
    "de": "ihre Klasse",
    "image": null,
    "example": "Ben is in her class.",
    "page": 231,
    "unit": "unit1"
  },
  {
    "id": 48,
    "en": "upstairs",
    "de": "oben; nach oben (im Haus)",
    "image": null,
    "example": "My room is upstairs.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 49,
    "en": "downstairs",
    "de": "unten; nach unten (im Haus)",
    "image": null,
    "example": "My mum is downstairs.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 50,
    "en": "room",
    "de": "das Zimmer; der Raum",
    "image": "room",
    "example": "My room is small.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 51,
    "en": "why?",
    "de": "warum?",
    "image": null,
    "example": "Why are you here?",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 52,
    "en": "an hour",
    "de": "eine Stunde",
    "image": null,
    "example": "We play for an hour.",
    "page": 232,
    "unit": "unit1",
    "hint": "Das h ist stumm. Deshalb: an hour, nicht a hour."
  },
  {
    "id": 53,
    "en": "for",
    "de": "für",
    "image": null,
    "example": "This parcel is for you.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 54,
    "en": "It isn’t here.",
    "de": "Es ist nicht hier.",
    "image": null,
    "example": "My phone? It isn’t here.",
    "page": 232,
    "unit": "unit1",
    "aliases": [
      "It is not here."
    ]
  },
  {
    "id": 55,
    "en": "He isn’t here.",
    "de": "Er ist nicht hier.",
    "image": null,
    "example": "Ben? He isn’t here.",
    "page": 232,
    "unit": "unit1",
    "aliases": [
      "He is not here."
    ]
  },
  {
    "id": 56,
    "en": "She isn’t here.",
    "de": "Sie ist nicht hier.",
    "image": null,
    "example": "Mia? She isn’t here.",
    "page": 232,
    "unit": "unit1",
    "aliases": [
      "She is not here."
    ]
  },
  {
    "id": 57,
    "en": "here",
    "de": "hier; hierher",
    "image": null,
    "example": "Come here, please.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 58,
    "en": "Sorry.",
    "de": "Verzeihung.; Entschuldigung.",
    "image": null,
    "example": "Sorry. I need more time.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 59,
    "en": "Who?",
    "de": "Wer?",
    "image": null,
    "example": "Who is at the door?",
    "page": 232,
    "unit": "unit1",
    "hint": "who = wer. where = wo / wohin. Nicht verwechseln!"
  },
  {
    "id": 60,
    "en": "brother",
    "de": "der Bruder",
    "image": null,
    "example": "My brother likes football.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 61,
    "en": "sister",
    "de": "die Schwester",
    "image": null,
    "example": "My sister has a rabbit.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 62,
    "en": "Yes, I am.",
    "de": "Ja, das bin ich.",
    "image": null,
    "example": "Are you at home? Yes, I am.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 63,
    "en": "See you.",
    "de": "Bis gleich.; Bis bald.",
    "image": null,
    "example": "See you, Ben!",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 64,
    "en": "You’re lucky.",
    "de": "Du hast Glück.",
    "image": null,
    "example": "You’re lucky. You have a pet.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 65,
    "en": "sure",
    "de": "sicher",
    "image": null,
    "example": "Are you sure?",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 66,
    "en": "smile",
    "de": "das Lächeln",
    "image": "smile",
    "example": "She has a lovely smile.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 67,
    "en": "sometimes",
    "de": "manchmal",
    "image": null,
    "example": "I sometimes swim on Friday.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 68,
    "en": "weird",
    "de": "seltsam; komisch",
    "image": null,
    "example": "That noise is weird.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 69,
    "en": "at school",
    "de": "in der Schule",
    "image": null,
    "example": "We are at school.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 70,
    "en": "she’s",
    "de": "sie ist",
    "image": null,
    "example": "She’s in my class.",
    "page": 232,
    "unit": "unit1",
    "aliases": [
      "she is"
    ]
  },
  {
    "id": 71,
    "en": "they aren’t",
    "de": "sie sind nicht",
    "image": null,
    "example": "They aren’t at home.",
    "page": 232,
    "unit": "unit1",
    "aliases": [
      "they are not"
    ]
  },
  {
    "id": 72,
    "en": "they’re",
    "de": "sie sind",
    "image": null,
    "example": "They’re in the garden.",
    "page": 232,
    "unit": "unit1",
    "aliases": [
      "they are"
    ]
  },
  {
    "id": 73,
    "en": "divorced",
    "de": "geschieden",
    "image": null,
    "example": "Her parents are divorced.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 74,
    "en": "parents",
    "de": "die Eltern",
    "image": null,
    "example": "My parents are at home.",
    "page": 232,
    "unit": "unit1"
  },
  {
    "id": 75,
    "en": "listen",
    "de": "zuhören; horchen",
    "image": null,
    "example": "Listen to the music.",
    "page": 232,
    "unit": "unit1",
    "hint": "listen to music = Musik hören. Denke an „to“ vor dem, was du hörst."
  },
  {
    "id": 76,
    "en": "phone",
    "de": "das Telefon; das Mobiltelefon; das Handy",
    "image": "phone",
    "example": "My phone is on the table.",
    "page": 232,
    "unit": "unit1",
    "hint": "„Handy“ heißt auf Englisch phone oder mobile phone.",
    "aliases": [
      "mobile phone",
      "mobile"
    ]
  },
  {
    "id": 77,
    "en": "message",
    "de": "die Nachricht; die SMS",
    "image": null,
    "example": "I have a message for you.",
    "page": 233,
    "unit": "unit1",
    "aliases": [
      "text message",
      "text"
    ]
  },
  {
    "id": 78,
    "en": "free",
    "de": "frei",
    "image": null,
    "example": "Are you free on Saturday?",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 79,
    "en": "hang out",
    "de": "abhängen; rumhängen",
    "image": null,
    "example": "We hang out at my place.",
    "page": 233,
    "unit": "unit1",
    "hint": "Das ist eine umgangssprachliche Wendung für „abhängen“.",
    "aliases": [
      "to hang out"
    ]
  },
  {
    "id": 80,
    "en": "at my place",
    "de": "bei mir",
    "image": null,
    "example": "We can play at my place.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 81,
    "en": "place",
    "de": "der Ort; der Platz; die Stelle",
    "image": null,
    "example": "This is a nice place.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 82,
    "en": "know",
    "de": "kennen",
    "image": null,
    "example": "I know your sister.",
    "page": 233,
    "unit": "unit1",
    "hint": "Das k ist stumm. know klingt wie „no“.",
    "aliases": [
      "to know"
    ]
  },
  {
    "id": 83,
    "en": "primary school",
    "de": "die Grundschule",
    "image": null,
    "example": "My brother is at primary school.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 84,
    "en": "again",
    "de": "wieder; noch einmal",
    "image": null,
    "example": "Please say it again.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 85,
    "en": "Good morning.",
    "de": "Guten Morgen.",
    "image": null,
    "example": "Good morning, Mia!",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 86,
    "en": "Here’s …",
    "de": "Hier ist …",
    "image": null,
    "example": "Here’s your phone.",
    "page": 233,
    "unit": "unit1",
    "aliases": [
      "Here is …"
    ]
  },
  {
    "id": 87,
    "en": "Here are …",
    "de": "Hier sind …",
    "image": null,
    "example": "Here are your books.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 88,
    "en": "parcel",
    "de": "das Paket; das Päckchen",
    "image": "parcel",
    "example": "The parcel is for my mum.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 89,
    "en": "very big",
    "de": "sehr groß",
    "image": null,
    "example": "Their house is very big.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 90,
    "en": "understand",
    "de": "verstehen",
    "image": null,
    "example": "I understand this word.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 91,
    "en": "father",
    "de": "der Vater",
    "image": null,
    "example": "My father likes music.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 92,
    "en": "mother",
    "de": "die Mutter",
    "image": null,
    "example": "My mother has a car.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 93,
    "en": "useful",
    "de": "nützlich",
    "image": null,
    "example": "This word is useful.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 94,
    "en": "phrase",
    "de": "der Satz; der Ausdruck; die Redewendung",
    "image": null,
    "example": "This is a useful phrase.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 95,
    "en": "grandma",
    "de": "die Oma; die Großmutter",
    "image": null,
    "example": "My grandma has a cat.",
    "page": 233,
    "unit": "unit1",
    "aliases": [
      "grandmother"
    ]
  },
  {
    "id": 96,
    "en": "grandpa",
    "de": "der Opa; der Großvater",
    "image": null,
    "example": "My grandpa likes football.",
    "page": 233,
    "unit": "unit1",
    "aliases": [
      "grandfather"
    ]
  },
  {
    "id": 97,
    "en": "aunt",
    "de": "die Tante",
    "image": null,
    "example": "My aunt is at home.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 98,
    "en": "uncle",
    "de": "der Onkel",
    "image": null,
    "example": "My uncle has a dog.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 99,
    "en": "cousin",
    "de": "der Cousin; die Cousine",
    "image": null,
    "example": "My cousin is in my class.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 100,
    "en": "some",
    "de": "einige; ein paar; etwas",
    "image": null,
    "example": "Here are some books.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 101,
    "en": "English",
    "de": "Englisch; englisch",
    "image": null,
    "example": "I speak English.",
    "page": 233,
    "unit": "unit1",
    "hint": "Sprachen und Nationalitäten werden großgeschrieben: English, German, British."
  },
  {
    "id": 102,
    "en": "word",
    "de": "das Wort",
    "image": null,
    "example": "What does this word mean?",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 103,
    "en": "like words in other languages",
    "de": "wie Wörter in anderen Sprachen",
    "image": null,
    "example": "Some English words are like words in other languages.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 104,
    "en": "other",
    "de": "andere; anderer; anderes",
    "image": null,
    "example": "Where are the other books?",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 105,
    "en": "language",
    "de": "die Sprache",
    "image": null,
    "example": "English is a language.",
    "page": 233,
    "unit": "unit1"
  },
  {
    "id": 106,
    "en": "Welcome to Brighton.",
    "de": "Willkommen in Brighton.",
    "image": null,
    "example": "Welcome to Brighton, Ben!",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 107,
    "en": "My name is Alice.",
    "de": "Ich heiße Alice.",
    "image": null,
    "example": "My name is Alice and I am eleven.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 108,
    "en": "I'm from Brighton.",
    "de": "Ich komme aus Brighton.; Ich bin aus Brighton.",
    "image": null,
    "example": "I'm from Brighton in England.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 109,
    "en": "I'm eleven years old.",
    "de": "Ich bin elf Jahre alt.",
    "image": null,
    "example": "I'm eleven years old and my sister is twelve.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 110,
    "en": "Nice to meet you.",
    "de": "Freut mich, dich kennenzulernen.",
    "image": null,
    "example": "Nice to meet you, Ben!",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 111,
    "en": "How old are you?",
    "de": "Wie alt bist du?",
    "image": null,
    "example": "How old are you, Mia?",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 112,
    "en": "Where are you from?",
    "de": "Woher kommst du?",
    "image": null,
    "example": "Where are you from, Ben?",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 113,
    "en": "Hello.",
    "de": "Hallo.; Guten Tag.",
    "image": null,
    "example": "Hello, my name is Mia.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 114,
    "en": "How are you?",
    "de": "Wie geht es dir?; Wie geht's?",
    "image": null,
    "example": "How are you today?",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 115,
    "en": "I'm fine, thanks.",
    "de": "Gut, danke.",
    "image": null,
    "example": "I'm fine, thanks. How are you?",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 116,
    "en": "Bye.",
    "de": "Tschüs.; Auf Wiedersehen.",
    "image": null,
    "example": "Bye, see you on Monday!",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 117,
    "en": "Goodbye.",
    "de": "Auf Wiedersehen.; Tschüs.",
    "image": null,
    "example": "Goodbye, see you on Friday!",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 118,
    "en": "No, that's wrong.",
    "de": "Nein, das ist falsch.",
    "image": null,
    "example": "No, that's wrong. My bag is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 119,
    "en": "Yes, that's right.",
    "de": "Ja, das ist richtig.",
    "image": null,
    "example": "Yes, that's right. I am eleven.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 120,
    "en": "It's your turn.",
    "de": "Du bist dran.; Du bist an der Reihe.",
    "image": null,
    "example": "It's your turn to read.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 121,
    "en": "Let me show you.",
    "de": "Lass mich dir etwas zeigen.",
    "image": null,
    "example": "Let me show you my garden.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 122,
    "en": "Let us sing.",
    "de": "Lass uns singen.",
    "image": null,
    "example": "Let us sing a song.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 123,
    "en": "Thanks.",
    "de": "Danke.",
    "image": null,
    "example": "Thanks for your help.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 124,
    "en": "Here you are.",
    "de": "Hier, bitte.",
    "image": null,
    "example": "Here you are. This book is for you.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 125,
    "en": "Simon says ...",
    "de": "Simon sagt ...",
    "image": null,
    "example": "Simon says touch your nose.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 126,
    "en": "I don't have ...",
    "de": "Ich habe kein ...",
    "image": null,
    "example": "I don't have a bike.",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 127,
    "en": "Are you ...?",
    "de": "Bist du ...?",
    "image": null,
    "example": "Are you in my class?",
    "page": null,
    "unit": "welcome",
    "topic": "Begrüßung & Sätze",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 128,
    "en": "one",
    "de": "eins",
    "image": null,
    "example": "I have one pencil.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "1",
      "key": "number-one"
    }
  },
  {
    "id": 129,
    "en": "two",
    "de": "zwei",
    "image": null,
    "example": "I have two pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "2",
      "key": "number-two"
    }
  },
  {
    "id": 130,
    "en": "three",
    "de": "drei",
    "image": null,
    "example": "I have three pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "3",
      "key": "number-three"
    }
  },
  {
    "id": 131,
    "en": "four",
    "de": "vier",
    "image": null,
    "example": "I have four pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "4",
      "key": "number-four"
    }
  },
  {
    "id": 132,
    "en": "five",
    "de": "fünf",
    "image": null,
    "example": "I have five pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "5",
      "key": "number-five"
    }
  },
  {
    "id": 133,
    "en": "six",
    "de": "sechs",
    "image": null,
    "example": "I have six pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "6",
      "key": "number-six"
    }
  },
  {
    "id": 134,
    "en": "seven",
    "de": "sieben",
    "image": null,
    "example": "I have seven pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "7",
      "key": "number-seven"
    }
  },
  {
    "id": 135,
    "en": "eight",
    "de": "acht",
    "image": null,
    "example": "I have eight pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "8",
      "key": "number-eight"
    }
  },
  {
    "id": 136,
    "en": "nine",
    "de": "neun",
    "image": null,
    "example": "I have nine pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "9",
      "key": "number-nine"
    }
  },
  {
    "id": 137,
    "en": "ten",
    "de": "zehn",
    "image": null,
    "example": "I have ten pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "10",
      "key": "number-ten"
    }
  },
  {
    "id": 138,
    "en": "eleven",
    "de": "elf",
    "image": null,
    "example": "I have eleven pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "11",
      "key": "number-eleven"
    }
  },
  {
    "id": 139,
    "en": "twelve",
    "de": "zwölf",
    "image": null,
    "example": "I have twelve pencils.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "visual": {
      "type": "number",
      "value": "12",
      "key": "number-twelve"
    }
  },
  {
    "id": 140,
    "en": "red",
    "de": "rot",
    "image": null,
    "example": "My bag is red.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#dc2626",
      "key": "colour-red"
    }
  },
  {
    "id": 141,
    "en": "yellow",
    "de": "gelb",
    "image": null,
    "example": "My bag is yellow.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#facc15",
      "key": "colour-yellow"
    }
  },
  {
    "id": 142,
    "en": "blue",
    "de": "blau",
    "image": null,
    "example": "My bag is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#2563eb",
      "key": "colour-blue"
    }
  },
  {
    "id": 143,
    "en": "green",
    "de": "grün",
    "image": null,
    "example": "My bag is green.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#16a34a",
      "key": "colour-green"
    }
  },
  {
    "id": 144,
    "en": "brown",
    "de": "braun",
    "image": null,
    "example": "My bag is brown.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#854d0e",
      "key": "colour-brown"
    }
  },
  {
    "id": 145,
    "en": "orange",
    "de": "orange",
    "image": null,
    "example": "My bag is orange.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#ea580c",
      "key": "colour-orange"
    }
  },
  {
    "id": 146,
    "en": "grey",
    "de": "grau",
    "image": null,
    "example": "My bag is grey.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#6b7280",
      "key": "colour-grey"
    }
  },
  {
    "id": 147,
    "en": "pink",
    "de": "rosa; pink",
    "image": null,
    "example": "My bag is pink.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#f472b6",
      "key": "colour-pink"
    }
  },
  {
    "id": 148,
    "en": "purple",
    "de": "lila; violett",
    "image": null,
    "example": "My bag is purple.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#9333ea",
      "key": "colour-purple"
    }
  },
  {
    "id": 149,
    "en": "white",
    "de": "weiß",
    "image": null,
    "example": "My bag is white.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#ffffff",
      "key": "colour-white"
    }
  },
  {
    "id": 150,
    "en": "black",
    "de": "schwarz",
    "image": null,
    "example": "My bag is black.",
    "page": null,
    "unit": "welcome",
    "topic": "Zahlen & Farben",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Farben schreibt man im Englischen normalerweise klein. Am Satzanfang beginnen sie groß.",
    "visual": {
      "type": "colour",
      "value": "#111827",
      "key": "colour-black"
    }
  },
  {
    "id": 151,
    "en": "a city",
    "de": "eine Stadt; eine Großstadt",
    "image": null,
    "example": "Brighton is a city in England.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 152,
    "en": "in England",
    "de": "in England",
    "image": null,
    "example": "My friend lives in England.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 153,
    "en": "my friend",
    "de": "mein Freund; meine Freundin",
    "image": null,
    "example": "My friend likes music.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 154,
    "en": "the",
    "de": "der; die; das",
    "image": null,
    "example": "The cat is on the chair.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 155,
    "en": "sea",
    "de": "das Meer",
    "image": null,
    "example": "The sea is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 156,
    "en": "by the sea",
    "de": "am Meer",
    "image": null,
    "example": "We live by the sea.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 157,
    "en": "boy",
    "de": "der Junge",
    "image": null,
    "example": "The boy is in my class.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 158,
    "en": "girl",
    "de": "das Mädchen",
    "image": null,
    "example": "The girl has a red bike.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 159,
    "en": "beach",
    "de": "der Strand",
    "image": null,
    "example": "We play on the beach.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 160,
    "en": "sand",
    "de": "der Sand",
    "image": null,
    "example": "The sand is hot.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 161,
    "en": "seagull",
    "de": "die Möwe",
    "image": null,
    "example": "The seagull is by the sea.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 162,
    "en": "sky",
    "de": "der Himmel",
    "image": null,
    "example": "The sky is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 163,
    "en": "stone",
    "de": "der Stein",
    "image": null,
    "example": "There is a small stone in my bag.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 164,
    "en": "picture",
    "de": "das Bild",
    "image": null,
    "example": "This picture is great.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 165,
    "en": "hometown",
    "de": "die Heimatstadt",
    "image": null,
    "example": "Brighton is my hometown.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 166,
    "en": "town",
    "de": "die Stadt",
    "image": null,
    "example": "My town has a park.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 167,
    "en": "Germany",
    "de": "Deutschland",
    "image": null,
    "example": "I live in Germany.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 168,
    "en": "garden",
    "de": "der Garten",
    "image": null,
    "example": "My garden has lots of flowers.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 169,
    "en": "palace",
    "de": "der Palast; das Schloss",
    "image": null,
    "example": "The palace is very big.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 170,
    "en": "park",
    "de": "der Park",
    "image": null,
    "example": "We play football in the park.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 171,
    "en": "world",
    "de": "die Welt",
    "image": null,
    "example": "There are many languages in the world.",
    "page": null,
    "unit": "welcome",
    "topic": "Menschen & Orte",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 172,
    "en": "cool",
    "de": "cool",
    "image": null,
    "example": "Your bike is cool.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 173,
    "en": "big",
    "de": "groß",
    "image": null,
    "example": "My school is big.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 174,
    "en": "small",
    "de": "klein",
    "image": null,
    "example": "The cat is small.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 175,
    "en": "great",
    "de": "großartig",
    "image": null,
    "example": "This game is great.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 176,
    "en": "hot",
    "de": "heiß",
    "image": null,
    "example": "The sand is hot.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 177,
    "en": "cold",
    "de": "kalt",
    "image": null,
    "example": "The sea is cold.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 178,
    "en": "nice",
    "de": "nett; schön",
    "image": null,
    "example": "My friend is nice.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 179,
    "en": "awesome",
    "de": "klasse; großartig",
    "image": null,
    "example": "Your picture is awesome.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 180,
    "en": "ball",
    "de": "der Ball",
    "image": null,
    "example": "The ball is under the chair.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 181,
    "en": "balloon",
    "de": "der Luftballon",
    "image": null,
    "example": "My balloon is red.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 182,
    "en": "bee",
    "de": "die Biene",
    "image": null,
    "example": "The bee is on a flower.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 183,
    "en": "bike",
    "de": "das Fahrrad",
    "image": null,
    "example": "My bike is green.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 184,
    "en": "dog",
    "de": "der Hund",
    "image": null,
    "example": "My dog is in the garden.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 185,
    "en": "grass",
    "de": "das Gras; der Rasen",
    "image": null,
    "example": "The grass is green.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 186,
    "en": "flower",
    "de": "die Blume; die Blüte",
    "image": null,
    "example": "The flower is yellow.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 187,
    "en": "sandwich",
    "de": "das Sandwich; das belegte Brot",
    "image": null,
    "example": "My sandwich is in my bag.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 188,
    "en": "tree",
    "de": "der Baum",
    "image": null,
    "example": "The tree is in the park.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 189,
    "en": "banana",
    "de": "die Banane",
    "image": null,
    "example": "I have a banana for lunch.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 190,
    "en": "bag",
    "de": "die Tasche; der Beutel; die Tüte",
    "image": null,
    "example": "My bag is on the chair.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 191,
    "en": "game",
    "de": "das Spiel",
    "image": null,
    "example": "This game is fun.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 192,
    "en": "thing",
    "de": "die Sache; das Ding",
    "image": null,
    "example": "This thing is new.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 193,
    "en": "dot",
    "de": "der Punkt; das Pünktchen",
    "image": null,
    "example": "Draw a blue dot.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 194,
    "en": "double",
    "de": "doppelt; Doppel-",
    "image": null,
    "example": "Double three is six.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 195,
    "en": "something",
    "de": "etwas",
    "image": null,
    "example": "There is something in my bag.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 196,
    "en": "new",
    "de": "neu",
    "image": null,
    "example": "My schoolbag is new.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 197,
    "en": "uniform",
    "de": "die Schuluniform; die Uniform",
    "image": null,
    "example": "My school uniform is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 198,
    "en": "problem",
    "de": "das Problem",
    "image": null,
    "example": "I have a problem with this word.",
    "page": null,
    "unit": "welcome",
    "topic": "Dinge & Eigenschaften",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 199,
    "en": "school",
    "de": "die Schule",
    "image": null,
    "example": "My school is in Brighton.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 200,
    "en": "class",
    "de": "die Klasse",
    "image": null,
    "example": "My friend is in my class.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 201,
    "en": "classroom",
    "de": "das Klassenzimmer",
    "image": null,
    "example": "Our classroom is big.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 202,
    "en": "student",
    "de": "der Schüler; die Schülerin",
    "image": null,
    "example": "Ben is a student at my school.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 203,
    "en": "class teacher",
    "de": "der Klassenlehrer; die Klassenlehrerin",
    "image": null,
    "example": "My class teacher is Mr Lee.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 204,
    "en": "Mr Lee",
    "de": "Herr Lee",
    "image": null,
    "example": "Mr Lee is our class teacher.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 205,
    "en": "Mrs Lee",
    "de": "Frau Lee",
    "image": null,
    "example": "Mrs Lee is in the classroom.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 206,
    "en": "art",
    "de": "die Kunst",
    "image": null,
    "example": "I like art at school.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 207,
    "en": "history",
    "de": "die Geschichte",
    "image": null,
    "example": "We have history on Tuesday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 208,
    "en": "poem",
    "de": "das Gedicht",
    "image": null,
    "example": "This poem is about a cat.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 209,
    "en": "day",
    "de": "der Tag",
    "image": null,
    "example": "Today is a nice day.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 210,
    "en": "Monday",
    "de": "Montag",
    "image": null,
    "example": "I play football on Monday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Monday."
  },
  {
    "id": 211,
    "en": "Tuesday",
    "de": "Dienstag",
    "image": null,
    "example": "I play football on Tuesday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Tuesday."
  },
  {
    "id": 212,
    "en": "Wednesday",
    "de": "Mittwoch",
    "image": null,
    "example": "I play football on Wednesday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Wednesday."
  },
  {
    "id": 213,
    "en": "Thursday",
    "de": "Donnerstag",
    "image": null,
    "example": "I play football on Thursday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Thursday."
  },
  {
    "id": 214,
    "en": "Friday",
    "de": "Freitag",
    "image": null,
    "example": "I play football on Friday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Friday."
  },
  {
    "id": 215,
    "en": "Saturday",
    "de": "Samstag; Sonnabend",
    "image": null,
    "example": "I play football on Saturday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Saturday."
  },
  {
    "id": 216,
    "en": "Sunday",
    "de": "Sonntag",
    "image": null,
    "example": "I play football on Sunday.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "Wochentage werden im Englischen großgeschrieben: Sunday."
  },
  {
    "id": 217,
    "en": "book",
    "de": "das Buch; das Heft",
    "image": null,
    "example": "My book is on the desk.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 218,
    "en": "song",
    "de": "das Lied; der Song",
    "image": null,
    "example": "We sing a song at school.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 219,
    "en": "French",
    "de": "Französisch",
    "image": null,
    "example": "My aunt speaks French.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 220,
    "en": "board",
    "de": "die Tafel",
    "image": null,
    "example": "The word is on the board.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 221,
    "en": "chair",
    "de": "der Stuhl",
    "image": null,
    "example": "My bag is under the chair.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 222,
    "en": "desk",
    "de": "der Schreibtisch",
    "image": null,
    "example": "My pencil is on the desk.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 223,
    "en": "exercise book",
    "de": "das Schulheft; das Übungsheft",
    "image": null,
    "example": "My exercise book is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 224,
    "en": "pencil case",
    "de": "das Federmäppchen",
    "image": null,
    "example": "My pencil case is in my schoolbag.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 225,
    "en": "pencil",
    "de": "der Bleistift",
    "image": null,
    "example": "My pencil is yellow.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 226,
    "en": "schoolbag",
    "de": "die Schultasche",
    "image": null,
    "example": "My schoolbag is red.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 227,
    "en": "marker",
    "de": "der Textmarker",
    "image": null,
    "example": "Use a marker for this word.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 228,
    "en": "pen",
    "de": "der Kugelschreiber; der Stift; der Füller",
    "image": null,
    "example": "My pen is on the desk.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 229,
    "en": "rubber",
    "de": "der Radiergummi; das Radiergummi",
    "image": null,
    "example": "My rubber is in my pencil case.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 230,
    "en": "ruler",
    "de": "das Lineal",
    "image": null,
    "example": "My ruler is in my schoolbag.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 231,
    "en": "sharpener",
    "de": "der Anspitzer",
    "image": null,
    "example": "I need a sharpener for my pencil.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 232,
    "en": "year",
    "de": "der Jahrgang; die Jahrgangsstufe",
    "image": null,
    "example": "My sister is in Year 7.",
    "page": null,
    "unit": "welcome",
    "topic": "Schule & Wochentage",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 233,
    "en": "to see",
    "de": "sehen; besuchen",
    "image": null,
    "example": "I can see a seagull.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 234,
    "en": "to like",
    "de": "mögen",
    "image": null,
    "example": "I like music.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 235,
    "en": "to think",
    "de": "denken; glauben; meinen",
    "image": null,
    "example": "I think this game is great.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 236,
    "en": "to live",
    "de": "wohnen; leben",
    "image": null,
    "example": "I live in Brighton.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 237,
    "en": "can",
    "de": "können",
    "image": null,
    "example": "I can swim.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 238,
    "en": "to fly",
    "de": "fliegen",
    "image": null,
    "example": "The seagull can fly.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 239,
    "en": "to find",
    "de": "finden",
    "image": null,
    "example": "I can find my pencil.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 240,
    "en": "to have",
    "de": "haben",
    "image": null,
    "example": "I have a blue bike.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 241,
    "en": "to spell",
    "de": "buchstabieren",
    "image": null,
    "example": "Can you spell your name?",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 242,
    "en": "to show",
    "de": "zeigen",
    "image": null,
    "example": "I can show you my school.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 243,
    "en": "to know",
    "de": "wissen",
    "image": null,
    "example": "I know the answer.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz",
    "hint": "know kann „wissen“ und „kennen“ heißen. In diesem Welcome-Eintrag übst du „wissen“. Das k ist stumm."
  },
  {
    "id": 244,
    "en": "to sit",
    "de": "sitzen; sich setzen",
    "image": null,
    "example": "I sit on my chair.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 245,
    "en": "to teach",
    "de": "unterrichten",
    "image": null,
    "example": "My aunt can teach English.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 246,
    "en": "to go",
    "de": "gehen",
    "image": null,
    "example": "We go to school on Monday.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 247,
    "en": "to speak",
    "de": "sprechen",
    "image": null,
    "example": "I speak English and German.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 248,
    "en": "to read",
    "de": "lesen",
    "image": null,
    "example": "I read a book at home.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 249,
    "en": "to watch a film",
    "de": "sich einen Film anschauen",
    "image": null,
    "example": "We watch a film on Saturday.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 250,
    "en": "our",
    "de": "unser; unsere",
    "image": null,
    "example": "Our classroom is big.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 251,
    "en": "we",
    "de": "wir",
    "image": null,
    "example": "We are at school.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 252,
    "en": "us",
    "de": "uns",
    "image": null,
    "example": "This game is for us.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 253,
    "en": "me",
    "de": "mich; mir",
    "image": null,
    "example": "This parcel is for me.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 254,
    "en": "with",
    "de": "mit; bei",
    "image": null,
    "example": "I play football with my friend.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 255,
    "en": "together",
    "de": "zusammen",
    "image": null,
    "example": "We go to school together.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 256,
    "en": "too",
    "de": "auch",
    "image": null,
    "example": "My sister likes music too.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 257,
    "en": "at",
    "de": "an; bei; in",
    "image": null,
    "example": "We are at school.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 258,
    "en": "please",
    "de": "bitte",
    "image": null,
    "example": "Please come here.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 259,
    "en": "now",
    "de": "jetzt; nun",
    "image": null,
    "example": "We can play now.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 260,
    "en": "your",
    "de": "dein; deine; euer; eure",
    "image": null,
    "example": "Your bag is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 261,
    "en": "but",
    "de": "aber",
    "image": null,
    "example": "I like cats but I don't like snakes.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 262,
    "en": "no ...",
    "de": "kein; keine",
    "image": null,
    "example": "There are no books on the desk.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 263,
    "en": "so",
    "de": "so",
    "image": null,
    "example": "My sister is so happy.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 264,
    "en": "where",
    "de": "wo; woher; wohin",
    "image": null,
    "example": "Where is your schoolbag?",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 265,
    "en": "today",
    "de": "heute",
    "image": null,
    "example": "Today is Monday.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 266,
    "en": "a tour of Brighton",
    "de": "eine Tour durch Brighton; ein Rundgang durch Brighton",
    "image": null,
    "example": "We go on a tour of Brighton.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 267,
    "en": "spelling",
    "de": "die Rechtschreibung",
    "image": null,
    "example": "I can practise my spelling.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  },
  {
    "id": 268,
    "en": "colour",
    "de": "die Farbe",
    "image": null,
    "example": "My favourite colour is blue.",
    "page": null,
    "unit": "welcome",
    "topic": "Verben & kleine Wörter",
    "source": "Früherer Welcome-Wortschatz"
  }
];
const images=["budgie","cat","fish","guinea pig","parrot","rabbit","rat","snake","spider","hamster","house","car","street","road","doorbell","bell","parcel","phone","football","music","running","swimming","dancing","smile","room"];
const rules=[
  {
    "title": "I ist immer groß",
    "text": "Das englische Wort für „ich“ schreibt man immer I, auch mitten im Satz.",
    "example": "My friend and I play football."
  },
  {
    "title": "Satzanfänge und Namen",
    "text": "Am Satzanfang beginnt das erste Wort groß. Namen von Menschen und Orten schreibt man groß.",
    "example": "This is Ben. He lives in London."
  },
  {
    "title": "Sprachen und Nationalitäten",
    "text": "English, German und British werden großgeschrieben. Das gilt auch als Adjektiv.",
    "example": "My English book is here."
  },
  {
    "title": "Tage und Monate",
    "text": "Wochentage und Monate beginnen groß. Jahreszeiten schreibt man normalerweise klein.",
    "example": "On Monday in October. In summer."
  },
  {
    "title": "Nomen und Farben",
    "text": "Die meisten englischen Nomen und Farben schreibt man klein. Am Satzanfang und in Namen gelten die anderen Regeln.",
    "example": "My house is blue. The cat is black."
  },
  {
    "title": "mum oder Mum? dad oder Dad?",
    "text": "Nach my oder your: mum und dad klein. Als Name oder direkte Anrede: Mum und Dad groß.",
    "example": "My dad is here. Hello, Dad!"
  }
];
const caseQuestions=[
  [
    "My friend and ___ play football.",
    "I",
    [
      "i",
      "I"
    ],
    "Das Wort I wird immer großgeschrieben."
  ],
  [
    "My ___ is at home.",
    "dad",
    [
      "Dad",
      "dad"
    ],
    "Nach my ist dad ein gewöhnliches Nomen und wird kleingeschrieben."
  ],
  [
    "Hello, ___!",
    "Mum",
    [
      "mum",
      "Mum"
    ],
    "In dieser direkten Anrede steht Mum wie ein Name und wird großgeschrieben."
  ],
  [
    "I speak ___.",
    "English",
    [
      "english",
      "English"
    ],
    "Sprachen werden großgeschrieben: English."
  ],
  [
    "My car is ___.",
    "blue",
    [
      "Blue",
      "blue"
    ],
    "Farben schreibt man mitten im Satz klein."
  ],
  [
    "I swim on ___.",
    "Monday",
    [
      "monday",
      "Monday"
    ],
    "Wochentage werden großgeschrieben."
  ],
  [
    "My birthday is in ___.",
    "October",
    [
      "october",
      "October"
    ],
    "Monate werden großgeschrieben."
  ],
  [
    "We play outside in ___.",
    "summer",
    [
      "Summer",
      "summer"
    ],
    "Jahreszeiten schreibt man normalerweise klein."
  ],
  [
    "___ is my sister.",
    "This",
    [
      "this",
      "This"
    ],
    "Am Satzanfang schreibt man das erste Wort groß."
  ],
  [
    "My ___ is small.",
    "house",
    [
      "House",
      "house"
    ],
    "Englische Nomen schreibt man normalerweise klein."
  ],
  [
    "I live in ___.",
    "London",
    [
      "london",
      "London"
    ],
    "Ortsnamen werden großgeschrieben."
  ],
  [
    "My mum and ___ are here.",
    "Dad",
    [
      "dad",
      "Dad"
    ],
    "Hier wird Dad als Name verwendet. Anders: my mum and my dad."
  ]
];
if(typeof module!=='undefined')module.exports={vocab,images,rules,caseQuestions};
