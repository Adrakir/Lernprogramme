'use strict';
// Abgleich mit den hochgeladenen Buchseiten 225–234; bestehende IDs bleiben erhalten.
const pageGroups={225:[106,107,108,109,...Array.from({length:12},(_,i)=>128+i),151,152,153,256,156,154,155,157,158,159,160,161,162,163,233,234,164,235,178],226:[172,173,174,175,176,177,110,111,127,112,264,165,166,113,265,114,115,236,237,238,266,167,116,117,168,169,170,191,190],227:[180,181,182,183,184,185,186,187,188,195,142,118,119,259,120,260,241,267,268,...Array.from({length:11},(_,i)=>140+i),239,189,240,199,196,257,232,258,197],228:[179,200,121,253,242,250,201,251,122,252,192,243,123,254,193,194,244,255,204,205,245,206,207,203,208],229:[209,...Array.from({length:7},(_,i)=>210+i),217,218,246,247,219,248,249,261,126,263,220,221,222,223,224,225,226,202,227,228,229,230,231,262,198,124,125,171]};
for(const [page,ids] of Object.entries(pageGroups))for(const id of ids)vocab[id].page=Number(page);
const addedWords=[
['e.g.','z. B.; zum Beispiel','I like pets, e.g. cats and rabbits.','e.g. ist die Abkürzung für „zum Beispiel“.'],
['to help','helfen','Can you help me with this word?','Verb: helfen.'],['help','die Hilfe','Thank you for your help.','Nomen: die Hilfe; nicht mit dem Verb verwechseln.'],
['when','wenn; sobald','We can play when you come home.','when: wenn/sobald; if: wenn/falls (Bedingung).'],
['to learn','lernen','We learn five new words.','learn = lernen; teach = unterrichten.'],['to talk to','reden mit; sich unterhalten mit','I talk to my friend after school.','talk to someone = mit jemandem reden.'],
['people','Leute; Menschen','There are four people in the room.','Mehrzahl: people.'],['umbrella','der Schirm; der Regenschirm','My umbrella is blue.','Vor umbrella steht an: an umbrella.'],
['to type','tippen','I type a short message.','Am Computer oder Handy tippen.'],['to pronounce','aussprechen','Can you pronounce this word?','Aussprache eines Wortes.'],
['then','dann','Read the word, then write it.','then beschreibt eine Reihenfolge.'],['to hear','hören','I can hear the doorbell.','hear: etwas hören; listen: bewusst zuhören.'],['to say','sagen','Please say your name.','say something = etwas sagen.'],
['question','die Frage','I have a question.','question = Frage; answer = Antwort.'],['answer','die Antwort','Your answer is right.','Nomen: Antwort.'],['your favourite book','dein Lieblingsbuch','What is your favourite book?','Britische Schreibweise: favourite.'],
['to use','benutzen; verwenden','May I use your ruler?','Verb: benutzen.'],['or','oder','Is it a cat or a rabbit?','or verbindet Alternativen.'],['before','vor','I read before school.','Zeitlich: vor Schulbeginn.'],
['letter','der Buchstabe','The first letter is B.','Hier: Buchstabe. Ein Brief heißt ebenfalls letter.'],['careful','vorsichtig','Be careful with the glass.','Be careful! = Sei vorsichtig!'],['conversation','das Gespräch; die Unterhaltung','We have a conversation in English.','Ein Gespräch zwischen Menschen.'],
['There are …','Es sind …; Es gibt … (Mehrzahl)','There are two books on the desk.','Mehrzahl: there are.'],['There’s …','Es ist …; Es gibt … (Einzahl)','There’s a cat in the garden.','Einzahl: there is; Kurzform there’s.'],
['its','sein; seine; ihr; ihre','The cat is black. Its name is Pip.','its = sein/ihr; it’s = it is.'],['Lily’s letter','Lilys Brief','Lily’s letter is on the desk.','Hier: letter = Brief, nicht Buchstabe.'],['full stop','der Punkt (Satzzeichen)','Put a full stop at the end.','Ein Satz endet oft mit einem full stop.'],
['in English','auf Englisch','Please answer in English.','English wird großgeschrieben.'],['in German','auf Deutsch','Can you say it in German?','German wird großgeschrieben.'],['the first word','das erste Wort','Read the first word.','first = erste/erster/erstes.'],['sentence','der Satz','Write a short sentence.','Ein vollständiger Satz beginnt groß.']
];
for(const [en,de,example,hint] of addedWords)vocab.push({id:vocab.length,en,de,example,hint,page:234,unit:'unit1',topic:'Sprache & Gespräche',aliases:en==='There’s …'?['There is …']:[]});
for(const [en,de,page,example] of [['wrong','falsch; verkehrt',227,'This answer is wrong.'],['blazer','der Blazer; die Sportjacke',228,'My blazer is blue.'],['tie','der Schlips; die Krawatte',228,'His tie is red.'],['the gardens are great','die Gärten sind großartig',226,'The gardens are great.'],['the days of the week','die Wochentage',229,'We know the days of the week.'],['glue stick','der Klebestift',229,'Here is my glue stick.']])vocab.push({id:vocab.length,en,de,page,example,unit:'welcome',topic:'Welcome ergänzen'});
// Wortarten und Kontexte für die zwei Bedeutungen von help/letter getrennt halten.
vocab.find(v=>v.en==='to help').de='helfen';
vocab.find(v=>v.en==='to help').sense='verb';
vocab.find(v=>v.en==='help').sense='noun';
vocab.push({id:vocab.length,en:'family',de:'die Familie',page:228,unit:'welcome',topic:'Familie',example:'My family lives in Brighton.',hint:'Mehrzahl: families.'});
for(const en of ['blazer','tie']){const v=vocab.find(x=>x.en===en);v.contextImage='school-uniform';v.contextAlt='Schulblazer mit Krawatte';v.contextCaption='Schulkleidung: blazer und tie';}
for(const en of ['upstairs','downstairs']){const v=vocab.find(x=>x.en===en);v.contextImage='stairs';v.contextAlt='Treppe mit oberem und unterem Stockwerk';v.contextCaption='upstairs = oben · downstairs = unten';}
