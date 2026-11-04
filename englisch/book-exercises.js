'use strict';
const bookGaps=[
['to help','Can you ___ me, please?','help','Du bittest um Hilfe.','help ist hier ein Verb: helfen.'],
['help','Thank you for your ___.','help','Nach your steht hier ein Nomen.','help ist hier das Nomen: Hilfe.'],
['when','We can play ___ you come home.','when','Gemeint ist: sobald du nach Hause kommst.','when beschreibt hier den Zeitpunkt.'],
['to learn','We ___ new words at school.','learn','Gesucht ist lernen.','learn = lernen.'],
['people','There are three ___ in the room. (Menschen)','people','Das Wort steht in der Mehrzahl.','people = Leute/Menschen.'],
['umbrella','It is raining. Take an ___.','umbrella','Ein Regenschirm schützt vor Regen.','Vor umbrella steht an.'],
['to type','I ___ a message on my phone.','type','Hier geht es um Tippen.','type a message = eine Nachricht tippen.'],
['to pronounce','Can you ___ this word? (aussprechen)','pronounce','Das Verb beginnt mit pr.','pronounce = aussprechen.'],
['then','First read the word, ___ write it.','then','Erst lesen, dann schreiben.','then = dann.'],
['to hear','I can ___ the doorbell.','hear','Ein Geräusch wahrnehmen: hear.','hear = hören. Bewusst zuhören heißt listen.'],
['listen','Please ___ to the teacher.','listen','Nach diesem Verb steht to.','listen to = zuhören.'],
['to say','Please ___ your name.','say','Gesucht ist sagen.','say your name = deinen Namen sagen.'],
['question','Who is she? This is a ___.','question','Ein Satz mit Fragezeichen.','question = Frage.'],
['answer','Yes, I am. This is an ___.','answer','Eine Reaktion auf eine Frage.','answer = Antwort.'],
['to use','May I ___ your pen?','use','Du möchtest den Stift benutzen.','use = benutzen.'],
['or','Do you like cats ___ dogs? (oder)','or','Zwei Möglichkeiten werden verbunden.','or = oder.'],
['before','I eat breakfast ___ school. (vor)','before','Es geht um eine zeitliche Reihenfolge.','before school = vor Schulbeginn.'],
['letter','The first ___ in book is b.','letter','Hier ist kein Brief gemeint.','letter kann Buchstabe oder Brief heißen.'],
['careful','Be ___ with the glass. (vorsichtig)','careful','Das Wort beginnt mit c.','Be careful! = Sei vorsichtig!'],
['conversation','We have a ___ in English. (Gespräch)','conversation','Zwei Menschen unterhalten sich.','conversation = Gespräch.'],
['There are …','There ___ two books on the desk.','are','two books ist Mehrzahl.','Mehrzahl: there are.'],
['There’s …','There ___ a cat in the garden.','is','a cat ist Einzahl.','Einzahl: there is.'],
['its','The dog is small. ___ name is Pip.','Its','Besitz, nicht it is. Das Wort steht am Satzanfang.','Its name = sein Name.'],
['full stop','Put a ___ at the end of this sentence. (Punkt)','full stop','Gesucht sind zwei Wörter.','Ein Punkt als Satzzeichen heißt full stop.'],
['in German','Please say it in ___. (Deutsch)','German','Sprachen schreibt man groß.','in German = auf Deutsch.'],
['sentence','Write a short ___. (Satz)','sentence','Das Wort beginnt mit s.','sentence = Satz.']
];
for(const [word,text,answer,hint,explain] of bookGaps)applicationTasks.push({unit:'unit1',kind:'gap',word,title:'Sprache üben · S. 234',text,answers:[answer],hint,explain});
applicationTasks.push({unit:'unit1',kind:'dialogue',word:'question',title:'Um Hilfe bitten',text:'Lily: Can you help me pronounce this word?\nZane: ___',answer:'Yes. Listen, then say it again.',wrong:['It is my favourite colour.','The dog is in the garden.'],explain:'Lily bittet um Aussprachehilfe. Zane bietet ein Vorbild zum Nachsprechen an.'});
for(const [word,text,answer,hint,explain] of [['tie','My ___ is red. (Krawatte)','tie','Drei Buchstaben, beginnt mit t.','tie = Krawatte.'],['blazer','My school ___ is blue. (Blazer)','blazer','Das englische Wort ist dem deutschen ähnlich.','blazer = Blazer/Sportjacke.'],['wrong','This answer is not right. It is ___.','wrong','Das Gegenteil von right.','wrong = falsch.'],['glue stick','I use a ___ to stick paper.','glue stick','Ein Klebestift; zwei Wörter.','glue stick = Klebestift.']])applicationTasks.push({unit:'welcome',kind:'gap',word,title:'Welcome ergänzen',text,answers:[answer],hint,explain});
