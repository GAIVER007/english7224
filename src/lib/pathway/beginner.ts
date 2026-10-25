import type { PathQuestion, PathUnit } from "./types";

type Quiz = [prompt: string, options: string[], answer: string, explanation: string];
type QuizPair = [Quiz, Quiz];

type UnitInput = Omit<PathUnit, "questions"> & {
  grammar: QuizPair;
  readingQuestions: QuizPair;
  listeningQuestions: QuizPair;
};

function questions(skill: PathQuestion["skill"], items: QuizPair): PathQuestion[] {
  return items.map(([prompt, options, answer, explanation]) => ({
    skill,
    prompt,
    options,
    answer,
    explanation,
  }));
}

function makeUnit(input: UnitInput): PathUnit {
  const { grammar, readingQuestions, listeningQuestions, ...unit } = input;
  return {
    ...unit,
    questions: [
      ...questions("grammar", grammar),
      ...questions("reading", readingQuestions),
      ...questions("listening", listeningQuestions),
    ],
  };
}

export const beginnerUnits: PathUnit[] = [
  makeUnit({
    id: "a0-01",
    level: "A0",
    title: "Буквы и имя",
    goal: "Назвать своё имя по буквам и распознать простое написание на слух.",
    theory:
      "В английском 26 букв. Название буквы и звук в слове могут различаться: буква A называется /eɪ/, в name гласная тоже звучит /eɪ/, а в cat — /æ/. Ориентируйся на запись IPA и аудио, а не только на русское приближение. Для spelling произноси названия букв отдельно. Спроси How do you spell your name?; если слово уже названо, можно спросить How do you spell it?",
    examples: ["My name is Max.", "M-A-X.", "How do you spell Anna?"],
    vocabulary: [
      { en: "letter", ru: "буква" },
      { en: "name", ru: "имя" },
      { en: "spell", ru: "произносить по буквам" },
      { en: "first name", ru: "имя" },
      { en: "last name", ru: "фамилия" },
      { en: "again", ru: "ещё раз" },
    ],
    reading: "This is Mia. Her last name is Fox. Mia spells it F-O-X.",
    listening: "Hello! My name is Leo. That is L-E-O. My last name is King: K-I-N-G.",
    grammar: [
      [
        "Как правильно спросить написание имени?",
        ["How you spell your name?", "How do you spell your name?", "What spell your name?"],
        "How do you spell your name?",
        "В самостоятельном вопросе называем объект и используем помощник do: How do you spell your name?",
      ],
      [
        "Выбери правильное предложение.",
        ["My name are Eva.", "I name is Eva.", "My name is Eva."],
        "My name is Eva.",
        "С существительным name используется is.",
      ],
    ],
    readingQuestions: [
      [
        "What is the girl's first name?",
        ["Mia", "Fox", "Leo"],
        "Mia",
        "В первом предложении сказано: This is Mia.",
      ],
      [
        "How does she spell her last name?",
        ["F-O-X", "M-I-A", "K-I-N-G"],
        "F-O-X",
        "Текст прямо даёт spelling фамилии Fox.",
      ],
    ],
    listeningQuestions: [
      [
        "What is the speaker's first name?",
        ["Max", "Leo", "King"],
        "Leo",
        "Говорящий представляется: My name is Leo.",
      ],
      [
        "Which spelling is the last name?",
        ["L-E-O", "K-I-N-G", "F-O-X"],
        "K-I-N-G",
        "После My last name is King звучит K-I-N-G.",
      ],
    ],
    writing: {
      prompt: "Напиши своё имя и произнеси его по буквам через дефисы.",
      minWords: 3,
      model: "My name is Ivan. I-V-A-N.",
      checklist: [
        "Есть My name is",
        "Все буквы разделены дефисами",
        "Имя начинается с большой буквы",
      ],
    },
    speaking: {
      prompt: "Представься и назови имя по буквам.",
      model: "Hello! My name is Nina. N-I-N-A.",
      checklist: ["Поздоровайся", "Скажи My name is", "Произнеси каждую букву отдельно"],
    },
  }),
  makeUnit({
    id: "a0-02",
    level: "A0",
    title: "Приветствие и прощание",
    goal: "Поздороваться, узнать самочувствие и вежливо завершить разговор.",
    theory:
      "Hello подходит почти всегда, hi звучит неформально. Good morning говорят утром, good evening — вечером. На How are you? достаточно короткого ответа I'm fine, thanks. При знакомстве Nice to meet you означает «приятно познакомиться».",
    examples: [
      "Good morning, Ben!",
      "How are you? — I'm fine, thanks.",
      "Nice to meet you. — Nice to meet you too.",
    ],
    vocabulary: [
      { en: "hello", ru: "здравствуйте" },
      { en: "hi", ru: "привет" },
      { en: "good morning", ru: "доброе утро" },
      { en: "good evening", ru: "добрый вечер" },
      { en: "fine", ru: "хорошо" },
      { en: "goodbye", ru: "до свидания" },
    ],
    reading:
      "It is morning. Tom sees Ada at school. He says, “Good morning, Ada!” Ada smiles and says, “Hi, Tom! How are you?”",
    listening:
      "Good evening. I'm Sara. — Hello, Sara. I'm Dan. Nice to meet you. — Nice to meet you too. Goodbye!",
    grammar: [
      [
        "Что уместно сказать в 9 утра?",
        ["Good night", "Good morning", "Good evening"],
        "Good morning",
        "Morning — время до полудня.",
      ],
      [
        "Выбери естественный ответ на How are you?",
        ["I'm fine, thanks.", "I am name Alex.", "Good night yesterday."],
        "I'm fine, thanks.",
        "Так кратко отвечают о самочувствии.",
      ],
    ],
    readingQuestions: [
      [
        "Where are Tom and Ada?",
        ["At school", "At a hotel", "At home"],
        "At school",
        "Место прямо указано: at school.",
      ],
      [
        "Who asks How are you?",
        ["Tom", "Ada", "Sara"],
        "Ada",
        "В тексте Ada задаёт этот вопрос Тому.",
      ],
    ],
    listeningQuestions: [
      [
        "What time of day is it?",
        ["Morning", "Afternoon", "Evening"],
        "Evening",
        "Диалог начинается с Good evening.",
      ],
      [
        "What does Dan say after his name?",
        ["Nice to meet you", "How old are you?", "See you in class"],
        "Nice to meet you",
        "После знакомства Dan говорит Nice to meet you.",
      ],
    ],
    writing: {
      prompt: "Напиши короткое приветствие и спроси, как дела.",
      minWords: 5,
      model: "Hi, Olga! How are you today?",
      checklist: ["Есть приветствие", "Есть How are you", "В конце вопросительный знак"],
    },
    speaking: {
      prompt: "Разыграй знакомство утром.",
      model: "Good morning! I'm Pavel. Nice to meet you.",
      checklist: ["Используй Good morning", "Назови имя", "Заверши Nice to meet you"],
    },
  }),
  makeUnit({
    id: "a0-03",
    level: "A0",
    title: "Числа и возраст",
    goal: "Понимать числа до 100, называть возраст и простой номер.",
    theory:
      "Числа 13–19 имеют окончание -teen: thirteen. Десятки 20–90 оканчиваются на -ty: twenty. В возрасте используется be: I am twenty, а не I have twenty. Вопрос How old are you? спрашивает возраст.",
    examples: ["I am eighteen years old.", "How old is Tim?", "My room number is forty-two."],
    vocabulary: [
      { en: "thirteen", ru: "тринадцать" },
      { en: "twenty", ru: "двадцать" },
      { en: "thirty", ru: "тридцать" },
      { en: "age", ru: "возраст" },
      { en: "years old", ru: "лет" },
      { en: "number", ru: "номер; число" },
    ],
    reading:
      "Lena is nineteen. Her brother Max is thirteen. Their father is forty. They live in flat twenty-six.",
    listening:
      "My name is Omar. I am twenty-two. My phone ends with eight-five. My English class is in room thirty-one.",
    grammar: [
      [
        "Как сказать «Мне 20 лет»?",
        ["I have twenty.", "I am twenty.", "I is twenty."],
        "I am twenty.",
        "Возраст в английском строится с глаголом be.",
      ],
      [
        "Какое число означает 30?",
        ["thirteen", "thirty", "three hundred"],
        "thirty",
        "Десятки получают окончание -ty.",
      ],
    ],
    readingQuestions: [
      ["How old is Max?", ["13", "19", "40"], "13", "Max is thirteen."],
      ["What is the flat number?", ["22", "26", "31"], "26", "Семья живёт in flat twenty-six."],
    ],
    listeningQuestions: [
      ["How old is Omar?", ["12", "22", "32"], "22", "Он говорит I am twenty-two."],
      [
        "What is his classroom number?",
        ["31", "85", "19"],
        "31",
        "English class is in room thirty-one.",
      ],
    ],
    writing: {
      prompt: "Напиши своё имя, возраст и любое любимое число.",
      minWords: 8,
      model: "I'm Vera. I am twenty-four. My favourite number is seven.",
      checklist: ["Возраст дан с am", "Числа написаны словами", "Есть любимое число"],
    },
    speaking: {
      prompt: "Назови возраст и три числа вокруг тебя.",
      model: "I am thirty. I can see numbers ten, sixteen and forty.",
      checklist: ["Используй I am", "Назови три числа", "Говори десятки отчётливо"],
    },
  }),
  makeUnit({
    id: "a0-04",
    level: "A0",
    title: "Время и дни",
    goal: "Спросить время, назвать час и день недели.",
    theory:
      "Для точного часа используется It's ... o'clock. Половина часа — half past, четверть после часа — quarter past. Вопрос What time is it? спрашивает текущее время. С днями недели используется on: on Monday.",
    examples: ["It's six o'clock.", "The lesson is on Tuesday.", "It's half past eight."],
    vocabulary: [
      { en: "Monday", ru: "понедельник" },
      { en: "Friday", ru: "пятница" },
      { en: "today", ru: "сегодня" },
      { en: "tomorrow", ru: "завтра" },
      { en: "o'clock", ru: "ровно (о времени)" },
      { en: "half past", ru: "половина после часа" },
    ],
    reading:
      "Today is Monday. Nina's English lesson is at six o'clock. On Tuesday she has no lesson. Her next class is on Friday at half past five.",
    listening:
      "The shop opens at nine o'clock on Saturday. I arrive at quarter past nine. My friend comes at half past nine.",
    grammar: [
      [
        "Какой предлог нужен: ___ Friday?",
        ["at", "on", "in"],
        "on",
        "Перед днями недели используется on.",
      ],
      [
        "Как сказать 7:00?",
        ["It's seven o'clock.", "It's half seven day.", "It seven hours."],
        "It's seven o'clock.",
        "Для точного часа используется o'clock.",
      ],
    ],
    readingQuestions: [
      [
        "When is Nina's first lesson?",
        ["Monday at 6:00", "Tuesday at 6:00", "Friday at 6:30"],
        "Monday at 6:00",
        "Первый урок — on Monday at six o'clock.",
      ],
      [
        "Does Nina have a lesson on Tuesday?",
        ["Yes, at five.", "No, she doesn't.", "Yes, at six."],
        "No, she doesn't.",
        "В тексте сказано: On Tuesday she has no lesson.",
      ],
    ],
    listeningQuestions: [
      ["When does the shop open?", ["9:00", "9:15", "9:30"], "9:00", "It opens at nine o'clock."],
      [
        "Who comes at 9:30?",
        ["The speaker", "The speaker's friend", "The shop owner"],
        "The speaker's friend",
        "My friend comes at half past nine.",
      ],
    ],
    writing: {
      prompt: "Напиши день и время двух дел на этой неделе.",
      minWords: 10,
      model: "My class is on Monday at six. Football is on Friday at eight.",
      checklist: ["Перед днями есть on", "Перед временем есть at", "Указаны два разных дела"],
    },
    speaking: {
      prompt: "Скажи, какой сегодня день и во сколько начнётся следующее дело.",
      model: "Today is Wednesday. My next class is at half past seven.",
      checklist: ["Назови день", "Назови время", "Используй today и at"],
    },
  }),
  makeUnit({
    id: "a0-05",
    level: "A0",
    title: "I, you, he, she и глагол be",
    goal: "Строить простые фразы о себе и людях с am, is, are.",
    theory:
      "Формы be зависят от подлежащего: I am, he/she/it is, you/we/they are. В разговоре часто используются сокращения I'm, he's, we're. Для отрицания добавь not: she isn't или she is not.",
    examples: ["I'm from Russia.", "She is a student.", "They aren't at home."],
    vocabulary: [
      { en: "I", ru: "я" },
      { en: "you", ru: "ты; вы" },
      { en: "he", ru: "он" },
      { en: "she", ru: "она" },
      { en: "we", ru: "мы" },
      { en: "they", ru: "они" },
    ],
    reading:
      "I am Alex. I am a cook. Maya is my friend. She is a doctor. We are from Kazan, but we are in London today.",
    listening:
      "This is Ben and this is Kim. He is from Canada. She is from Korea. They are students. They aren't teachers.",
    grammar: [
      ["Выбери форму: She ___ happy.", ["am", "is", "are"], "is", "С she используется is."],
      [
        "Выбери верное отрицание для they.",
        ["They isn't here.", "They not are here.", "They aren't here."],
        "They aren't here.",
        "Форма are not сокращается до aren't.",
      ],
    ],
    readingQuestions: [
      ["What is Alex's job?", ["Cook", "Doctor", "Student"], "Cook", "Alex говорит I am a cook."],
      [
        "Where are Alex and Maya today?",
        ["Kazan", "London", "Canada"],
        "London",
        "В конце сказано we are in London today.",
      ],
    ],
    listeningQuestions: [
      [
        "Where is Kim from?",
        ["Canada", "Korea", "London"],
        "Korea",
        "После представления Kim звучит She is from Korea.",
      ],
      [
        "Are Ben and Kim teachers?",
        ["Yes, both are.", "No, they are students.", "Only Ben is."],
        "No, they are students.",
        "Текст говорит They are students. They aren't teachers.",
      ],
    ],
    writing: {
      prompt: "Напиши три предложения о себе и знакомом с be.",
      minWords: 10,
      model: "I'm Anton. I am a designer. My friend is a student.",
      checklist: ["После I стоит am", "После friend стоит is", "Есть профессия или город"],
    },
    speaking: {
      prompt: "Представь себя и двух людей.",
      model: "I'm Alina. This is Max. He is my friend. This is Eva. She is my sister.",
      checklist: ["Используй I'm", "Используй he", "Используй she"],
    },
  }),
  makeUnit({
    id: "a0-06",
    level: "A0",
    title: "A, an и the",
    goal: "Выбирать базовый артикль для одного предмета.",
    theory:
      "A ставится перед согласным звуком: a book. An ставится перед гласным звуком: an apple. The указывает на уже известный или конкретный предмет: I see a bag. The bag is red. С именами людей артикль обычно не нужен.",
    examples: ["This is a pen.", "It is an orange.", "The pen is blue."],
    vocabulary: [
      { en: "book", ru: "книга" },
      { en: "apple", ru: "яблоко" },
      { en: "umbrella", ru: "зонт" },
      { en: "bag", ru: "сумка" },
      { en: "key", ru: "ключ" },
      { en: "orange", ru: "апельсин" },
    ],
    reading:
      "There is a bag on the chair. An umbrella is in the bag. The bag is green, and the umbrella is black.",
    listening:
      "I have an apple and a sandwich. The apple is red. The sandwich is for my lunch. I also have a blue bottle.",
    grammar: [
      [
        "Выбери: It is ___ umbrella.",
        ["a", "an", "the one"],
        "an",
        "Umbrella начинается с гласного звука, поэтому an.",
      ],
      [
        "Как продолжить: I see a dog. ___ dog is small.",
        ["A", "An", "The"],
        "The",
        "При повторном упоминании предмет уже известен.",
      ],
    ],
    readingQuestions: [
      [
        "What is in the bag?",
        ["An umbrella", "A book", "An apple"],
        "An umbrella",
        "Текст говорит An umbrella is in the bag.",
      ],
      ["What colour is the bag?", ["Black", "Green", "Blue"], "Green", "The bag is green."],
    ],
    listeningQuestions: [
      ["What colour is the apple?", ["Green", "Red", "Blue"], "Red", "The apple is red."],
      [
        "What is for lunch?",
        ["The sandwich", "The bottle", "The apple tree"],
        "The sandwich",
        "Говорящий уточняет The sandwich is for my lunch.",
      ],
    ],
    writing: {
      prompt: "Опиши три предмета рядом, используя a, an или the.",
      minWords: 10,
      model: "I see a phone, a cup and an orange. The phone is black.",
      checklist: [
        "Есть a перед согласным звуком",
        "Есть an перед гласным звуком",
        "The относится к уже названному предмету",
      ],
    },
    speaking: {
      prompt: "Покажи два предмета и назови их с артиклем.",
      model: "This is a key. This is an apple. The key is small.",
      checklist: ["Назови два предмета", "Выбери a или an", "Повтори один предмет с the"],
    },
  }),
  makeUnit({
    id: "a0-07",
    level: "A0",
    title: "Множественное число",
    goal: "Называть один и несколько предметов.",
    theory:
      "Обычно множественное число получает -s: book — books. После шипящих звуков часто добавляется -es: box — boxes. Некоторые частые формы особые: child — children, man — men. This указывает на один близкий предмет, these — на несколько.",
    examples: ["I have two books.", "These boxes are heavy.", "The children are here."],
    vocabulary: [
      { en: "one", ru: "один" },
      { en: "two", ru: "два" },
      { en: "books", ru: "книги" },
      { en: "boxes", ru: "коробки" },
      { en: "children", ru: "дети" },
      { en: "these", ru: "эти" },
    ],
    reading:
      "This is my desk. There are three books, two pens and four photos on it. These photos are from my trips. Two small boxes are under the desk.",
    listening:
      "In my kitchen I have six cups and four plates. The cups are white. Two glasses are on the table. The plates are in a box.",
    grammar: [
      [
        "Какое множественное число у box?",
        ["boxs", "boxes", "boxies"],
        "boxes",
        "После x добавляется -es.",
      ],
      [
        "Выбери форму для нескольких детей.",
        ["childs", "childes", "children"],
        "children",
        "Children — особая форма множественного числа.",
      ],
    ],
    readingQuestions: [
      [
        "How many books are on the desk?",
        ["Two", "Three", "Four"],
        "Three",
        "На столе three books.",
      ],
      [
        "Where are the boxes?",
        ["On the desk", "Under the desk", "In the kitchen"],
        "Under the desk",
        "Two small boxes are under the desk.",
      ],
    ],
    listeningQuestions: [
      ["How many cups are there?", ["Four", "Six", "Two"], "Six", "Говорящий называет six cups."],
      [
        "What is on the table?",
        ["Two glasses", "Four plates", "A box"],
        "Two glasses",
        "Two glasses are on the table.",
      ],
    ],
    writing: {
      prompt: "Перечисли несколько предметов в комнате.",
      minWords: 10,
      model: "There are three chairs, two bags and four books in my room.",
      checklist: [
        "Есть минимум три группы предметов",
        "Использованы числа",
        "Формы множественного числа верны",
      ],
    },
    speaking: {
      prompt: "Посчитай вслух три вида предметов вокруг.",
      model: "I can see two windows, five chairs and three boxes.",
      checklist: ["Назови три числа", "Добавь -s или -es", "Используй I can see"],
    },
  }),
  makeUnit({
    id: "a0-08",
    level: "A0",
    title: "Семья и притяжательные слова",
    goal: "Рассказать, кому принадлежит предмет, и описать семью.",
    theory:
      "Перед существительным используются my, your, his, her, our, their: my sister, her phone. Апостроф + s показывает владельца: Anna's bag. Не путай his и her: his относится к мужчине, her — к женщине.",
    examples: ["This is my mother.", "His name is Dan.", "It is Kate's phone."],
    vocabulary: [
      { en: "mother", ru: "мама" },
      { en: "father", ru: "папа" },
      { en: "sister", ru: "сестра" },
      { en: "brother", ru: "брат" },
      { en: "parents", ru: "родители" },
      { en: "family", ru: "семья" },
    ],
    reading:
      "This is Rosa's family. Her mother is Eva, and her father is Luis. Rosa's brother is Sam. Their dog is called Pico. His bed is in Rosa's room.",
    listening:
      "My name is Jack. My sister is Lucy. Her favourite colour is yellow. Our parents are teachers. Their school is near our house.",
    grammar: [
      [
        "Выбери слово: Tom has a bike. ___ bike is red.",
        ["Her", "His", "Their"],
        "His",
        "Tom — мужчина, поэтому his.",
      ],
      [
        "Как сказать «сумка Анны»?",
        ["Anna bag", "Annas bag", "Anna's bag"],
        "Anna's bag",
        "Владелец обозначается апострофом и s.",
      ],
    ],
    readingQuestions: [
      [
        "Who is Sam?",
        ["Rosa's brother", "Rosa's father", "Rosa's dog"],
        "Rosa's brother",
        "Rosa's brother is Sam.",
      ],
      [
        "Where is Pico's bed?",
        ["In the kitchen", "In Rosa's room", "Near the school"],
        "In Rosa's room",
        "His bed is in Rosa's room.",
      ],
    ],
    listeningQuestions: [
      [
        "What is Lucy's favourite colour?",
        ["Red", "Yellow", "Blue"],
        "Yellow",
        "Her favourite colour is yellow.",
      ],
      [
        "What do Jack's parents do?",
        ["They are doctors.", "They are teachers.", "They are cooks."],
        "They are teachers.",
        "Говорящий сообщает Our parents are teachers.",
      ],
    ],
    writing: {
      prompt: "Напиши о трёх людях своей семьи.",
      minWords: 12,
      model: "My mother is Lena. My father's name is Oleg. Their son is my brother Max.",
      checklist: ["Есть my", "Есть форма с 's", "Упомянуты три человека"],
    },
    speaking: {
      prompt: "Покажи семейное фото или представь его и назови людей.",
      model: "This is my family. Her name is Irina. She is my mother. His name is Paul.",
      checklist: ["Начни This is my family", "Используй her", "Используй his"],
    },
  }),
  makeUnit({
    id: "a0-09",
    level: "A0",
    title: "Базовые вопросы",
    goal: "Задавать вопросы с be и вопросительными словами.",
    theory:
      "В вопросе с be глагол ставится перед человеком или предметом: Are you ready? Is he at home? Вопросительные слова уточняют информацию: what — что, who — кто, where — где, when — когда. После них сохраняется порядок be + подлежащее.",
    examples: ["What is your name?", "Where are you from?", "Is she at home?"],
    vocabulary: [
      { en: "what", ru: "что; какой" },
      { en: "who", ru: "кто" },
      { en: "where", ru: "где; куда" },
      { en: "when", ru: "когда" },
      { en: "why", ru: "почему" },
      { en: "how", ru: "как" },
    ],
    reading:
      "A new student is in class. The teacher asks, “What is your name?” “I'm Amir.” “Where are you from?” “I'm from Egypt.” “Are you ready?” Amir says, “Yes, I am.”",
    listening:
      "Where is the bus stop? — It is near the bank. Is the bank open? — Yes, it is. When is the next bus? — At ten o'clock.",
    grammar: [
      [
        "Собери вопрос о месте.",
        ["Where you are?", "Where are you?", "Are where you?"],
        "Where are you?",
        "После where ставятся are и подлежащее.",
      ],
      [
        "Как спросить, дома ли она?",
        ["She is at home?", "Does she at home?", "Is she at home?"],
        "Is she at home?",
        "В вопросе is переносится перед she.",
      ],
    ],
    readingQuestions: [
      [
        "What is the student's name?",
        ["Amir", "Egypt", "Adam"],
        "Amir",
        "Студент отвечает I'm Amir.",
      ],
      [
        "Where is Amir from?",
        ["England", "Egypt", "Canada"],
        "Egypt",
        "Он отвечает I'm from Egypt.",
      ],
    ],
    listeningQuestions: [
      [
        "Where is the bus stop?",
        ["Near the bank", "At the school", "Behind the shop"],
        "Near the bank",
        "Ответ: It is near the bank.",
      ],
      [
        "When is the next bus?",
        ["At nine", "At ten", "At twelve"],
        "At ten",
        "В диалоге названо at ten o'clock.",
      ],
    ],
    writing: {
      prompt: "Напиши три вопроса новому знакомому.",
      minWords: 10,
      model: "What is your name? Where are you from? Are you a student?",
      checklist: ["Есть what", "Есть where", "Есть вопрос с Are you"],
    },
    speaking: {
      prompt: "Задай вслух четыре вопроса о человеке.",
      model: "What is your name? Where are you from? How are you? Are you new here?",
      checklist: ["Четыре вопроса", "Be стоит перед подлежащим", "Интонация вопросительная"],
    },
  }),
  makeUnit({
    id: "a0-10",
    level: "A0",
    title: "Где находится предмет",
    goal: "Описывать положение предметов с there is/are и предлогами.",
    theory:
      "There is вводит один предмет, there are — несколько. Для места используй in (внутри), on (на поверхности), under (под), next to (рядом), between (между). Вопрос Is there...? уточняет наличие одного предмета.",
    examples: [
      "There is a lamp on the desk.",
      "Two shoes are under the bed.",
      "Is there a bank near here?",
    ],
    vocabulary: [
      { en: "in", ru: "в" },
      { en: "on", ru: "на" },
      { en: "under", ru: "под" },
      { en: "next to", ru: "рядом с" },
      { en: "between", ru: "между" },
      { en: "behind", ru: "за" },
    ],
    reading:
      "There is a sofa in my room. A lamp is next to the sofa. My bag is on the sofa, and my shoes are under it. Two pictures are above the sofa.",
    listening:
      "The café is between the bank and the hotel. There is a bus stop in front of the hotel. My bicycle is behind the café.",
    grammar: [
      [
        "Выбери: ___ two chairs in the room.",
        ["There is", "There are", "It are"],
        "There are",
        "Для нескольких предметов используется there are.",
      ],
      [
        "Книга лежит внутри сумки: The book is ___ the bag.",
        ["in", "on", "between"],
        "in",
        "In означает внутри.",
      ],
    ],
    readingQuestions: [
      [
        "Where is the bag?",
        ["On the sofa", "Under the sofa", "Next to the lamp"],
        "On the sofa",
        "My bag is on the sofa.",
      ],
      [
        "How many pictures are there?",
        ["One", "Two", "Three"],
        "Two",
        "В тексте Two pictures are above the sofa.",
      ],
    ],
    listeningQuestions: [
      [
        "What is between the bank and the hotel?",
        ["The café", "The bicycle", "The bus stop"],
        "The café",
        "The café is between those buildings.",
      ],
      [
        "Where is the bicycle?",
        ["In front of the hotel", "Behind the café", "Inside the bank"],
        "Behind the café",
        "Говорящий говорит My bicycle is behind the café.",
      ],
    ],
    writing: {
      prompt: "Опиши расположение четырёх предметов в комнате.",
      minWords: 14,
      model: "There is a desk by the window. My phone is on it. Two bags are under the chair.",
      checklist: [
        "Есть there is или there are",
        "Использованы два предлога места",
        "Описаны четыре предмета",
      ],
    },
    speaking: {
      prompt: "Дай устный тур по комнате.",
      model: "There is a bed near the wall. A lamp is next to it. My books are on the shelf.",
      checklist: ["Назови три места", "Используй there is", "Используй разные предлоги"],
    },
  }),
  makeUnit({
    id: "a0-11",
    level: "A0",
    title: "Еда и простые просьбы",
    goal: "Назвать еду, попросить предмет и сказать о желании.",
    theory:
      "I want прямо сообщает о желании, а I'd like звучит вежливее при заказе. Перед исчисляемым предметом нужен a/an: a sandwich. Please смягчает просьбу. Here you are говорят, когда передают предмет.",
    examples: ["I'd like a tea, please.", "I want an apple.", "A bottle of water, please."],
    vocabulary: [
      { en: "water", ru: "вода" },
      { en: "tea", ru: "чай" },
      { en: "bread", ru: "хлеб" },
      { en: "sandwich", ru: "бутерброд" },
      { en: "menu", ru: "меню" },
      { en: "please", ru: "пожалуйста" },
    ],
    reading:
      "Mila is in a small café. She wants a cheese sandwich and tea. The sandwich is four pounds. Tea is two pounds. Mila has seven pounds.",
    listening:
      "Hello. I'd like a chicken sandwich and a bottle of water, please. — That's six pounds. — Here you are. — Thank you.",
    grammar: [
      [
        "Выбери вежливый заказ.",
        ["Give tea.", "I'd like a tea, please.", "Tea me now."],
        "I'd like a tea, please.",
        "I'd like и please создают вежливую просьбу.",
      ],
      [
        "Какой артикль нужен: ___ apple?",
        ["a", "an", "никакой всегда"],
        "an",
        "Apple начинается с гласного звука.",
      ],
    ],
    readingQuestions: [
      [
        "What sandwich does Mila want?",
        ["Cheese", "Chicken", "Fish"],
        "Cheese",
        "She wants a cheese sandwich.",
      ],
      [
        "Can Mila pay six pounds?",
        ["Yes, she has seven.", "No, she has four.", "No, she has two."],
        "Yes, she has seven.",
        "Еда и чай стоят шесть, у Mila семь фунтов.",
      ],
    ],
    listeningQuestions: [
      [
        "What drink does the customer order?",
        ["Tea", "Water", "Coffee"],
        "Water",
        "Заказана a bottle of water.",
      ],
      [
        "How much is the order?",
        ["Four pounds", "Six pounds", "Seven pounds"],
        "Six pounds",
        "Сотрудник говорит That's six pounds.",
      ],
    ],
    writing: {
      prompt: "Напиши заказ из напитка и двух блюд.",
      minWords: 10,
      model: "I'd like tea, a cheese sandwich and an apple, please.",
      checklist: ["Есть I'd like", "Названы три позиции", "Есть please"],
    },
    speaking: {
      prompt: "Закажи завтрак в кафе.",
      model: "Good morning. I'd like a coffee and a sandwich, please. Thank you.",
      checklist: ["Поздоровайся", "Используй I'd like", "Поблагодари"],
    },
  }),
  makeUnit({
    id: "a0-12",
    level: "A0",
    title: "Итог A0: обо мне",
    goal: "Соединить знакомство, семью, время, предметы и простые вопросы.",
    theory:
      "Для короткого рассказа сначала представься с be, затем добавь семью или работу, место и распорядок. Связывай простые мысли словами and и but. Проверяй согласование: I am, she is, they are; один предмет — there is, несколько — there are.",
    examples: [
      "I'm Nina, and I'm twenty.",
      "My brother is a student, but I am a cook.",
      "There are two cafés near my home.",
    ],
    vocabulary: [
      { en: "about me", ru: "обо мне" },
      { en: "home", ru: "дом" },
      { en: "work", ru: "работа" },
      { en: "friend", ru: "друг" },
      { en: "and", ru: "и" },
      { en: "but", ru: "но" },
    ],
    reading:
      "I'm Zoe and I'm twenty-one. I live with my parents and my brother. Our flat is near a park. I work in a café from Monday to Friday. My English class is on Tuesday at seven.",
    listening:
      "Hi, I'm Mark. I'm from Ireland, but I live in Leeds. I'm a student. There are three people in my family. My sister is sixteen. We have a small dog called Spot.",
    grammar: [
      [
        "Выбери верную связку.",
        [
          "I am a student, and my sister is a doctor.",
          "I is a student, my sister are doctor.",
          "I a student and sister doctor.",
        ],
        "I am a student, and my sister is a doctor.",
        "Обе части используют правильные формы be.",
      ],
      [
        "Выбери: ___ three shops near my home.",
        ["There is", "There are", "It is"],
        "There are",
        "Перед множественным shops используется there are.",
      ],
    ],
    readingQuestions: [
      [
        "Where does Zoe work?",
        ["In a café", "In a park", "In a school"],
        "In a café",
        "Она говорит I work in a café.",
      ],
      [
        "When is her English class?",
        ["Monday at six", "Tuesday at seven", "Friday at five"],
        "Tuesday at seven",
        "Последнее предложение даёт день и время.",
      ],
    ],
    listeningQuestions: [
      [
        "Where does Mark live?",
        ["Ireland", "Leeds", "London"],
        "Leeds",
        "Он из Ирландии, но живёт in Leeds.",
      ],
      ["How old is Mark's sister?", ["13", "16", "21"], "16", "He says My sister is sixteen."],
    ],
    writing: {
      prompt: "Напиши мини-профиль: имя, город, занятие, семья и одно расписание.",
      minWords: 15,
      model:
        "I'm Dima and I'm twenty-five. I live in Perm. I'm a cook. My sister is a teacher. My class is on Friday.",
      checklist: ["Есть пять фактов", "Формы be согласованы", "Есть день недели"],
    },
    speaking: {
      prompt: "Расскажи о себе за 30 секунд.",
      model:
        "Hello, I'm Rita. I'm from Moscow. I'm a designer. There are four people in my family. My English class is on Monday.",
      checklist: ["Представься", "Назови город и занятие", "Добавь семью и расписание"],
    },
  }),
  makeUnit({
    id: "a1-01",
    level: "A1",
    title: "Мой обычный день",
    goal: "Описывать регулярные действия в Present Simple.",
    theory:
      "Present Simple описывает привычки и факты. С I/you/we/they используется базовая форма: I work. С he/she/it добавляется -s: she works. После окончаний -ch, -sh, -x, -o часто добавляется -es: he watches, she goes.",
    examples: ["I start work at nine.", "Mia walks to school.", "He watches TV after dinner."],
    vocabulary: [
      { en: "wake up", ru: "просыпаться" },
      { en: "get dressed", ru: "одеваться" },
      { en: "have breakfast", ru: "завтракать" },
      { en: "start work", ru: "начинать работу" },
      { en: "finish", ru: "заканчивать" },
      { en: "go to bed", ru: "ложиться спать" },
    ],
    reading:
      "Nora wakes up at seven on weekdays. She has breakfast with her son and walks to the bus stop. Her work starts at nine. She answers emails and helps customers. Nora finishes at five, cooks dinner at home and reads before she goes to bed at eleven every single night.",
    listening:
      "I work from home three days a week. I get up at half past seven and make coffee. My first meeting starts at nine. At lunchtime, I walk in the park. I usually finish at six. In the evening, I cook, call my parents and sometimes watch a film before bed.",
    grammar: [
      [
        "Выбери форму: Leo ___ work at eight.",
        ["start", "starts", "starting"],
        "starts",
        "С Leo, то есть he, глагол получает -s.",
      ],
      [
        "Выбери правильную фразу.",
        ["They goes home at six.", "They go home at six.", "They going home at six."],
        "They go home at six.",
        "С they используется базовая форма go.",
      ],
    ],
    readingQuestions: [
      [
        "How does Nora travel toward work?",
        ["She walks to the bus stop.", "She drives her son.", "She takes a taxi."],
        "She walks to the bus stop.",
        "Текст говорит she walks to the bus stop.",
      ],
      [
        "What does Nora do before bed?",
        ["She answers emails.", "She reads.", "She helps customers."],
        "She reads.",
        "После ужина Nora reads before bed.",
      ],
    ],
    listeningQuestions: [
      [
        "When does the first meeting start?",
        ["7:30", "9:00", "12:00"],
        "9:00",
        "Говорящий сообщает My first meeting starts at nine.",
      ],
      [
        "What does the speaker do at lunchtime?",
        ["Calls parents", "Walks in the park", "Watches a film"],
        "Walks in the park",
        "At lunchtime, I walk in the park.",
      ],
    ],
    writing: {
      prompt: "Опиши свой обычный будний день.",
      minWords: 25,
      model:
        "I wake up at seven and have breakfast. I start work at nine. I have lunch at one. I finish at six and go to bed at eleven.",
      checklist: ["Минимум четыре действия", "Есть время", "У глаголов с I нет -s"],
    },
    speaking: {
      prompt: "Расскажи о дне близкого человека.",
      model:
        "My brother gets up early. He drives to work and starts at eight. He finishes at five and plays football in the evening.",
      checklist: ["Используй he или she", "Добавляй -s к глаголам", "Назови утро и вечер"],
    },
  }),
  makeUnit({
    id: "a1-02",
    level: "A1",
    title: "Привычки и вопросы",
    goal: "Задавать вопросы о распорядке и говорить о частоте.",
    theory:
      "В вопросах Present Simple используются do и does: Do you work? Does she drive? После does смысловой глагол теряет -s. В отрицании — don't/doesn't. Наречия usually, often, sometimes, never ставятся перед смысловым глаголом, но после be.",
    examples: ["Do you cook every day?", "He doesn't drink coffee.", "We often study together."],
    vocabulary: [
      { en: "always", ru: "всегда" },
      { en: "usually", ru: "обычно" },
      { en: "often", ru: "часто" },
      { en: "sometimes", ru: "иногда" },
      { en: "hardly ever", ru: "почти никогда" },
      { en: "never", ru: "никогда" },
    ],
    reading:
      "Eli usually cycles to college, but he takes the bus when it rains. He never drives because he doesn't have a car. After class, he often studies in the library. Does he study there every day? No. On Fridays, he meets friends at a small pizza place near the station.",
    listening:
      "Do you exercise during the week, Maya? — Yes, I do. I usually run on Tuesday and Thursday. I sometimes swim on Saturday. — Does your sister run with you? — No, she doesn't. She prefers yoga and goes to a class every Monday evening after work with her friend.",
    grammar: [
      [
        "Выбери вопрос: ___ Anna work here?",
        ["Do", "Does", "Is do"],
        "Does",
        "Для she/Anna нужен does.",
      ],
      [
        "Выбери верное отрицание.",
        ["He doesn't likes tea.", "He doesn't like tea.", "He not like tea."],
        "He doesn't like tea.",
        "После doesn't глагол остаётся в базовой форме.",
      ],
    ],
    readingQuestions: [
      [
        "Why doesn't Eli drive?",
        ["He cannot cycle.", "He has no car.", "The station is closed."],
        "He has no car.",
        "В тексте: he doesn't have a car.",
      ],
      [
        "Where does he go on Fridays?",
        ["The library", "A pizza place", "A swimming pool"],
        "A pizza place",
        "По пятницам он встречает друзей at a pizza place.",
      ],
    ],
    listeningQuestions: [
      [
        "How often does Maya run?",
        ["Twice a week", "Every day", "Once a month"],
        "Twice a week",
        "Она бегает во вторник и четверг.",
      ],
      [
        "What exercise does Maya's sister prefer?",
        ["Running", "Swimming", "Yoga"],
        "Yoga",
        "She prefers yoga.",
      ],
    ],
    writing: {
      prompt: "Напиши о трёх своих привычках и одной вещи, которую ты не делаешь.",
      minWords: 25,
      model:
        "I usually walk after work. I often cook at home and sometimes meet friends on Friday. I never drink coffee in the evening because I want to sleep well.",
      checklist: ["Есть три наречия частоты", "Есть don't или never", "Указана причина"],
    },
    speaking: {
      prompt: "Задай другу вопросы о трёх привычках и сам ответь на них.",
      model:
        "Do you cook every day? Yes, I do. Do you exercise? Sometimes. Do you work on Sunday? No, I don't.",
      checklist: ["Три вопроса с Do", "Короткие ответы", "Есть частотное слово"],
    },
  }),
  makeUnit({
    id: "a1-03",
    level: "A1",
    title: "Что происходит сейчас",
    goal: "Описывать действие в момент речи с Present Continuous.",
    theory:
      "Present Continuous строится из am/is/are + глагол-ing и показывает действие сейчас или вокруг текущего момента. Make теряет e: making; run удваивает согласную: running. Слова now, right now, at the moment часто подсказывают эту форму.",
    examples: ["I'm waiting for the bus.", "She is making lunch now.", "They aren't sleeping."],
    vocabulary: [
      { en: "right now", ru: "прямо сейчас" },
      { en: "at the moment", ru: "в данный момент" },
      { en: "wait", ru: "ждать" },
      { en: "carry", ru: "нести" },
      { en: "wear", ru: "носить (одежду)" },
      { en: "rain", ru: "идти (о дожде)" },
    ],
    reading:
      "It is Saturday morning in the city square. A band is playing near the fountain. Two children are dancing, and their parents are taking photos. A man is selling flowers. It isn't raining, so many people are sitting outside the cafés and enjoying the warm weather together this sunny morning.",
    listening:
      "Hi, Lena. I can't talk for long. I'm standing in a supermarket queue. Dad is looking for bread, and Mum is choosing fruit. My little brother is sitting in the trolley and singing loudly. Everyone is looking at us! I'll call you when we get home in about an hour.",
    grammar: [
      [
        "Выбери: We ___ dinner now.",
        ["cook", "are cooking", "cooks"],
        "are cooking",
        "Now указывает на am/is/are + -ing.",
      ],
      [
        "Какое написание верно?",
        ["makeing", "making", "makking"],
        "making",
        "Перед -ing конечная e исчезает.",
      ],
    ],
    readingQuestions: [
      [
        "Who is playing near the fountain?",
        ["A band", "Two parents", "A flower seller"],
        "A band",
        "A band is playing near the fountain.",
      ],
      [
        "Why are people sitting outside?",
        ["It is raining.", "The weather is warm.", "The cafés are closed."],
        "The weather is warm.",
        "It isn't raining and the weather is warm.",
      ],
    ],
    listeningQuestions: [
      [
        "Where is the speaker?",
        ["At home", "In a supermarket queue", "In the city square"],
        "In a supermarket queue",
        "Говорящий прямо сообщает своё место.",
      ],
      [
        "What is the little brother doing?",
        ["Choosing fruit", "Looking for bread", "Singing in the trolley"],
        "Singing in the trolley",
        "He is sitting in the trolley and singing.",
      ],
    ],
    writing: {
      prompt: "Опиши, что сейчас делают четыре человека вокруг или на картинке.",
      minWords: 25,
      model:
        "A woman is waiting for a bus. Two children are talking. A man is carrying a bag, and a driver is opening the door. A cyclist is riding past them.",
      checklist: ["Четыре действия", "Везде есть форма be", "Глаголы имеют -ing"],
    },
    speaking: {
      prompt: "Оглянись и прокомментируй происходящее сейчас.",
      model:
        "I'm sitting by the window. A car is moving outside. Two people are walking, and a dog is running near them.",
      checklist: ["Используй I'm", "Назови три действия", "Добавь now или at the moment"],
    },
  }),
  makeUnit({
    id: "a1-04",
    level: "A1",
    title: "Обычно и сейчас",
    goal: "Различать Present Simple и Present Continuous.",
    theory:
      "Present Simple отвечает на «что обычно происходит», а Present Continuous — «что происходит сейчас». Compare: I work in an office (факт), but today I'm working at home (временная ситуация). Глаголы состояния like, know, want обычно не употребляются в Continuous.",
    examples: [
      "She usually walks, but today she is driving.",
      "I work in a bank.",
      "We are having lunch now.",
    ],
    vocabulary: [
      { en: "usually", ru: "обычно" },
      { en: "today", ru: "сегодня" },
      { en: "this week", ru: "на этой неделе" },
      { en: "normally", ru: "обычно" },
      { en: "now", ru: "сейчас" },
      { en: "temporary", ru: "временный" },
    ],
    reading:
      "Sam normally works in a quiet office. This week, his team is working at a busy trade show. Sam usually writes reports, but today he is talking to visitors and showing a new product. He likes the change, although he wants a quiet evening when the show finishes later today.",
    listening:
      "I usually take my children to school by car. Today the car is at the garage, so we are walking. My daughter normally complains about mornings, but now she is laughing with her brother. We are enjoying the sunshine, and I think we may walk again tomorrow morning together too.",
    grammar: [
      [
        "Выбери: She usually ___ at home, but today she ___ in a café.",
        ["works / is working", "is working / works", "work / working"],
        "works / is working",
        "Usually требует Simple, today описывает временную ситуацию.",
      ],
      [
        "Выбери естественную форму.",
        ["I am knowing the answer.", "I know the answer.", "I knowing the answer."],
        "I know the answer.",
        "Know — глагол состояния и обычно не используется в Continuous.",
      ],
    ],
    readingQuestions: [
      [
        "Where does Sam normally work?",
        ["At a trade show", "In a quiet office", "At home"],
        "In a quiet office",
        "Первое предложение описывает обычное место.",
      ],
      [
        "What is Sam doing today?",
        ["Writing reports only", "Talking to visitors", "Resting at home"],
        "Talking to visitors",
        "Today he is talking to visitors.",
      ],
    ],
    listeningQuestions: [
      [
        "Why is the family walking today?",
        ["The weather is bad.", "The car is at the garage.", "School is closed."],
        "The car is at the garage.",
        "Причина дана в первом предложении о сегодняшнем дне.",
      ],
      [
        "How does the daughter feel now?",
        ["She is laughing.", "She is complaining.", "She is sleeping."],
        "She is laughing.",
        "Now she is laughing with her brother.",
      ],
    ],
    writing: {
      prompt: "Сравни свой обычный день с сегодняшним.",
      minWords: 30,
      model:
        "I usually work in the office, but today I'm working at home. I normally eat with colleagues. Now I'm making lunch in my kitchen and listening to music. This is unusual.",
      checklist: [
        "Есть usually или normally",
        "Есть today или now",
        "Использованы обе временные формы",
      ],
    },
    speaking: {
      prompt: "Скажи три пары «обычно — сейчас».",
      model:
        "I usually drink tea, but now I'm drinking water. I normally sit inside, but today I'm sitting in the garden.",
      checklist: ["Минимум две пары", "Simple для привычек", "Continuous для текущих действий"],
    },
  }),
  makeUnit({
    id: "a1-05",
    level: "A1",
    title: "Can и инструкции",
    goal: "Говорить об умениях, просить разрешение и давать команды.",
    theory:
      "Can показывает умение или возможность и не меняется по лицам: she can swim. После can идёт базовая форма без to. Отрицание can't. Повелительная форма начинается с глагола: Turn left. Для запрета используется Don't + глагол.",
    examples: ["I can speak English.", "Can I open the window?", "Don't touch that button."],
    vocabulary: [
      { en: "turn", ru: "поворачивать" },
      { en: "follow", ru: "следовать" },
      { en: "open", ru: "открывать" },
      { en: "close", ru: "закрывать" },
      { en: "careful", ru: "осторожный" },
      { en: "allowed", ru: "разрешено" },
    ],
    reading:
      "Visitors can explore the first floor of the old house, but they can't enter the kitchen. Follow the blue arrows and keep your ticket. Don't take photos near the paintings. You can use your phone in the garden. Ask a guide if you need help or directions during your visit.",
    listening:
      "Can you help me with this printer? — Yes. First, open the paper tray and put the paper inside. Then press the green button. Don't press the red one. — Can I print on both sides? — Yes, you can. Choose this option on the screen before you start printing.",
    grammar: [
      [
        "Выбери: Mia can ___ very well.",
        ["sings", "to sing", "sing"],
        "sing",
        "После can используется базовая форма без to.",
      ],
      [
        "Как дать запрет?",
        ["Not open the door.", "Don't open the door.", "Can't you opening."],
        "Don't open the door.",
        "Запрет строится с Don't + базовый глагол.",
      ],
    ],
    readingQuestions: [
      [
        "Where can visitors use a phone?",
        ["In the kitchen", "In the garden", "Near the paintings"],
        "In the garden",
        "Текст разрешает phone in the garden.",
      ],
      [
        "What must visitors keep?",
        ["Their ticket", "A painting", "A blue arrow"],
        "Their ticket",
        "Инструкция говорит keep your ticket.",
      ],
    ],
    listeningQuestions: [
      [
        "Which button should the user press?",
        ["The red button", "The green button", "Both buttons"],
        "The green button",
        "Инструкция: press the green button.",
      ],
      [
        "Can the printer use both sides?",
        ["Yes", "No", "Only on Monday"],
        "Yes",
        "Ответ в диалоге: Yes, you can.",
      ],
    ],
    writing: {
      prompt: "Напиши четыре правила для гостя дома или офиса.",
      minWords: 25,
      model:
        "You can use the kitchen. Please close the window. Don't leave bags by the door. Keep the hallway clear. Ask me if you need help.",
      checklist: ["Есть can", "Есть положительная команда", "Есть запрет с don't"],
    },
    speaking: {
      prompt: "Объясни человеку, как выполнить простое действие.",
      model:
        "Open the app. Choose your name and press Start. Don't close the screen. You can ask me for help.",
      checklist: ["Три команды по порядку", "Один запрет", "Одна фраза с can"],
    },
  }),
  makeUnit({
    id: "a1-06",
    level: "A1",
    title: "Еда: some, any и количество",
    goal: "Различать исчисляемые и неисчисляемые продукты.",
    theory:
      "Исчисляемые слова можно посчитать: an egg, two eggs; с ними употребляются many и how many. Неисчисляемые: water, rice, bread; с ними much и how much. Some типично в утверждении, any — в вопросе и отрицании. В предложении помощи возможен some: Would you like some tea?",
    examples: ["We need some tomatoes.", "Is there any milk?", "How much rice do you want?"],
    vocabulary: [
      { en: "rice", ru: "рис" },
      { en: "milk", ru: "молоко" },
      { en: "egg", ru: "яйцо" },
      { en: "tomato", ru: "помидор" },
      { en: "much", ru: "много (неисчисляемое)" },
      { en: "many", ru: "много (исчисляемое)" },
    ],
    reading:
      "Kim is checking the kitchen before shopping. There is some rice and a little cheese, but there isn't any milk. She has three eggs and two tomatoes. She wants to make soup, so she needs some onions, a bottle of oil and a lot of fresh green vegetables for dinner.",
    listening:
      "How many people are coming for dinner? — Six. We have enough pasta, but we don't have any tomato sauce. — How much sauce do we need? — Two large jars. Please buy some salad too. We have one cucumber, but there aren't any fresh peppers or green onions left.",
    grammar: [
      [
        "Выбери: We don't have ___ coffee.",
        ["a", "any", "many cups"],
        "any",
        "В отрицании с неисчисляемым coffee обычно используется any.",
      ],
      [
        "Как спросить о количестве яблок?",
        ["How much apples?", "How many apples?", "How any apple?"],
        "How many apples?",
        "Apples можно посчитать, поэтому how many.",
      ],
    ],
    readingQuestions: [
      [
        "What is missing from Kim's kitchen?",
        ["Milk", "Rice", "Eggs"],
        "Milk",
        "There isn't any milk.",
      ],
      [
        "Why does Kim need onions and oil?",
        ["To make soup", "To bake bread", "To cook breakfast"],
        "To make soup",
        "Она хочет приготовить soup.",
      ],
    ],
    listeningQuestions: [
      [
        "How many people are coming?",
        ["Two", "Six", "Eight"],
        "Six",
        "В ответе прямо названо Six.",
      ],
      [
        "How much sauce do they need?",
        ["One small jar", "Two large jars", "Three bottles"],
        "Two large jars",
        "В диалоге указан этот объём.",
      ],
    ],
    writing: {
      prompt: "Составь список продуктов и объясни, что уже есть дома.",
      minWords: 30,
      model:
        "We have some rice and three eggs. There isn't any milk. I need two tomatoes, some cheese and a bottle of water. We also need fresh fruit. We don't need any bread.",
      checklist: ["Есть some и any", "Есть исчисляемые продукты", "Есть неисчисляемый продукт"],
    },
    speaking: {
      prompt: "Проверь продукты для ужина вопросами.",
      model:
        "Do we have any rice? How many tomatoes are there? How much milk do we need? Let's buy some cheese.",
      checklist: ["Вопрос с any", "Вопрос How many", "Вопрос How much"],
    },
  }),
  makeUnit({
    id: "a1-07",
    level: "A1",
    title: "Покупки и кафе",
    goal: "Уточнять цену, размер и детали заказа в ежедневной ситуации.",
    theory:
      "Для вежливой просьбы подходят I'd like... и Could I have...? Цена спрашивается How much is it/are they? В магазине What size are you? уточняет размер. Too означает «слишком»: too small. Enough означает достаточность: big enough.",
    examples: [
      "Could I have the menu, please?",
      "How much are these shoes?",
      "This jacket is too small.",
    ],
    vocabulary: [
      { en: "price", ru: "цена" },
      { en: "size", ru: "размер" },
      { en: "try on", ru: "примерить" },
      { en: "receipt", ru: "чек" },
      { en: "bill", ru: "счёт" },
      { en: "change", ru: "сдача" },
    ],
    reading:
      "Lara needs a jacket for a work trip. She tries on a blue one in medium, but the sleeves are too short. The assistant brings a large black jacket. It fits well and costs sixty pounds. Lara pays by card and keeps the receipt because she may return it next week.",
    listening:
      "Are you ready to order? — Yes. Could I have the vegetable soup and grilled chicken, please? — Would you like rice or potatoes? — Rice, please. And can I have some water? — Of course. Still or sparkling? — Still, please. Could we have the bill after the meal?",
    grammar: [
      [
        "Как вежливо попросить меню?",
        ["Menu now.", "Could I have the menu, please?", "You give menu?"],
        "Could I have the menu, please?",
        "Could I have и please образуют вежливую просьбу.",
      ],
      [
        "Выбери: Эти брюки слишком большие.",
        [
          "These trousers are too big.",
          "This trousers is enough big.",
          "These trouser too bigger.",
        ],
        "These trousers are too big.",
        "Trousers требует are, а too стоит перед прилагательным.",
      ],
    ],
    readingQuestions: [
      [
        "Why doesn't Lara buy the blue jacket?",
        ["It is too expensive.", "The sleeves are too short.", "It is black."],
        "The sleeves are too short.",
        "Эта причина дана после примерки.",
      ],
      [
        "Why does she keep the receipt?",
        ["She may return the jacket.", "She paid cash.", "It shows her size."],
        "She may return the jacket.",
        "Последняя часть объясняет цель чека.",
      ],
    ],
    listeningQuestions: [
      [
        "What side dish does the customer choose?",
        ["Potatoes", "Rice", "Salad"],
        "Rice",
        "На выбор rice or potatoes клиент отвечает Rice.",
      ],
      [
        "What kind of water does the customer want?",
        ["Sparkling", "Still", "Hot"],
        "Still",
        "Клиент отвечает Still, please.",
      ],
    ],
    writing: {
      prompt: "Напиши диалог из четырёх реплик в магазине или кафе.",
      minWords: 30,
      model:
        "Could I try on this shirt, please? — Of course. What size are you? — Medium. How much is it? — It's thirty pounds. — Could I pay by card? — Yes, of course.",
      checklist: [
        "Есть вежливая просьба",
        "Есть вопрос о размере или выборе",
        "Есть вопрос о цене",
      ],
    },
    speaking: {
      prompt: "Разыграй заказ блюда и напитка с уточнением.",
      model:
        "Could I have the soup, please? Does it have meat? I'd also like still water. Could I have the bill, please?",
      checklist: ["Закажи блюдо", "Задай уточняющий вопрос", "Попроси счёт"],
    },
  }),
  makeUnit({
    id: "a1-08",
    level: "A1",
    title: "Was и were",
    goal: "Описывать состояние и место в прошлом.",
    theory:
      "Was и were — прошлые формы be. I/he/she/it was; you/we/they were. Отрицания wasn't и weren't. В вопросе форма ставится перед подлежащим: Were you tired? Where was the meeting? Прошлое часто отмечают yesterday, last night, ago.",
    examples: ["I was busy yesterday.", "They weren't at home.", "Where were you last night?"],
    vocabulary: [
      { en: "yesterday", ru: "вчера" },
      { en: "last night", ru: "прошлым вечером" },
      { en: "ago", ru: "назад" },
      { en: "busy", ru: "занятый" },
      { en: "tired", ru: "уставший" },
      { en: "quiet", ru: "тихий" },
    ],
    reading:
      "Yesterday was a difficult day for Arun. He was late for work because the buses were slow. His manager wasn't angry, but the office was very busy. At lunch, Arun and his colleagues were too tired to go out. By evening, the roads were quiet and his journey home was easy.",
    listening:
      "How was your weekend, Bea? — It was great. I was at my cousin's house near the sea. — Were your parents there? — No, they weren't. They were in the city. — Was the weather good? — Saturday was rainy, but Sunday was warm and sunny all day outside.",
    grammar: [
      [
        "Выбери: We ___ at the cinema last night.",
        ["was", "were", "are"],
        "were",
        "С we в прошлом используется were.",
      ],
      [
        "Составь вопрос.",
        ["Was she tired?", "Did she was tired?", "She were tired?"],
        "Was she tired?",
        "Was ставится перед she без did.",
      ],
    ],
    readingQuestions: [
      [
        "Why was Arun late?",
        ["The buses were slow.", "His manager was angry.", "The roads were quiet."],
        "The buses were slow.",
        "Причина указана в первом предложении о работе.",
      ],
      [
        "How was the journey home?",
        ["Difficult", "Easy", "Very late"],
        "Easy",
        "В конце сказано his journey home was easy.",
      ],
    ],
    listeningQuestions: [
      [
        "Where was Bea at the weekend?",
        ["At her cousin's house", "At work", "In the city with her parents"],
        "At her cousin's house",
        "Она была at my cousin's house near the sea.",
      ],
      [
        "What was Sunday weather like?",
        ["Rainy", "Warm and sunny", "Cold and windy"],
        "Warm and sunny",
        "Последняя реплика описывает Sunday.",
      ],
    ],
    writing: {
      prompt: "Опиши вчерашний день: где ты был и каким он был.",
      minWords: 30,
      model:
        "Yesterday I was at work in the morning. The office was quiet. My colleagues were busy. In the evening, I was at home and I wasn't tired. It was peaceful.",
      checklist: ["Есть was", "Есть were", "Есть отрицание wasn't или weren't"],
    },
    speaking: {
      prompt: "Ответь на вопросы о прошлых выходных.",
      model:
        "I was at home on Saturday. My friends were there in the evening. We were happy because the food was good.",
      checklist: ["Назови место", "Назови людей", "Опиши чувство или погоду"],
    },
  }),
  makeUnit({
    id: "a1-09",
    level: "A1",
    title: "Past Simple: правильные глаголы",
    goal: "Рассказывать о завершённых действиях в прошлом.",
    theory:
      "В Past Simple правильные глаголы получают -ed: work — worked. Если глагол заканчивается на e, добавляется -d: arrive — arrived; consonant + y меняется на -ied: study — studied. В отрицании и вопросе используется did, а смысловой глагол возвращается к базовой форме.",
    examples: [
      "We visited York last year.",
      "She didn't call yesterday.",
      "Did you finish the report?",
    ],
    vocabulary: [
      { en: "visit", ru: "посещать" },
      { en: "arrive", ru: "прибывать" },
      { en: "stay", ru: "останавливаться" },
      { en: "decide", ru: "решать" },
      { en: "invite", ru: "приглашать" },
      { en: "enjoy", ru: "наслаждаться" },
    ],
    reading:
      "Last Saturday, Mei visited a new art centre with her friend. They arrived at eleven and joined a short tour. Mei asked the guide several questions and photographed the garden. They stayed for three hours, but they didn't visit the café because it closed early. Mei really enjoyed the exhibition.",
    listening:
      "I moved into my flat last month. On the first weekend, I painted the bedroom and cleaned the kitchen. My sister helped me with the curtains. We ordered pizza in the evening and watched a comedy. I wanted to unpack everything, but I stopped at midnight and finished on Sunday.",
    grammar: [
      [
        "Выбери прошедшую форму study.",
        ["studyed", "studied", "did studied"],
        "studied",
        "После согласной y меняется на i перед -ed.",
      ],
      [
        "Выбери вопрос.",
        ["Did she visited Rome?", "Did she visit Rome?", "Visited she Rome?"],
        "Did she visit Rome?",
        "После did используется базовая форма visit.",
      ],
    ],
    readingQuestions: [
      [
        "How long did Mei stay?",
        ["One hour", "Three hours", "All day"],
        "Three hours",
        "They stayed for three hours.",
      ],
      [
        "Why didn't they visit the café?",
        ["It closed early.", "It was expensive.", "They had no questions."],
        "It closed early.",
        "Причина указана после because.",
      ],
    ],
    listeningQuestions: [
      [
        "Who helped with the curtains?",
        ["The speaker's sister", "A neighbour", "A painter"],
        "The speaker's sister",
        "My sister helped me with the curtains.",
      ],
      [
        "When did the speaker finish unpacking?",
        ["Saturday morning", "At midnight", "On Sunday"],
        "On Sunday",
        "Он остановился в полночь и finished on Sunday.",
      ],
    ],
    writing: {
      prompt: "Опиши прошлую субботу, используя правильные глаголы.",
      minWords: 35,
      model:
        "Last Saturday I cleaned my room and walked to the market. I visited a friend in the afternoon. We cooked dinner and watched a film. We talked for an hour. I didn't work, so I enjoyed the day.",
      checklist: [
        "Минимум четыре глагола с -ed",
        "Есть didn't + базовая форма",
        "События идут по порядку",
      ],
    },
    speaking: {
      prompt: "Расскажи о завершённом небольшом проекте.",
      model:
        "Last week I painted my room. I moved the furniture, cleaned the walls and started on Monday. My friend helped me. We finished on Wednesday.",
      checklist: [
        "Назови время в прошлом",
        "Три завершённых действия",
        "Используй started и finished",
      ],
    },
  }),
  makeUnit({
    id: "a1-10",
    level: "A1",
    title: "Past Simple: частые глаголы",
    goal: "Использовать основные неправильные формы в рассказе.",
    theory:
      "Неправильные глаголы не получают обычное -ed: go — went, see — saw, have — had, get — got, buy — bought. Их формы нужно запоминать в контексте. В вопросах и отрицаниях всё равно используется did + базовая форма: Did you go? I didn't see.",
    examples: ["We went to the coast.", "I bought a train ticket.", "Did she see the message?"],
    vocabulary: [
      { en: "went", ru: "пошёл; поехал" },
      { en: "saw", ru: "увидел" },
      { en: "had", ru: "имел; ел" },
      { en: "got", ru: "получил; добрался" },
      { en: "bought", ru: "купил" },
      { en: "took", ru: "взял; поехал" },
    ],
    reading:
      "On Sunday, Luis went to a street market with his daughter. They took the underground and got there before ten. His daughter saw a red bicycle, but it was too expensive. Luis bought fresh bread and fruit. They had lunch in the park and came home in the late afternoon.",
    listening:
      "My train left at eight, so I got up very early. I took a taxi to the station and bought coffee there. On the train, I met an old school friend. We sat together and spoke about our families. The journey felt short, and I arrived before my important morning meeting.",
    grammar: [
      [
        "Выбери прошедшую форму go.",
        ["goed", "went", "did went"],
        "went",
        "Go имеет неправильную форму went.",
      ],
      [
        "Выбери отрицание.",
        ["I didn't saw it.", "I didn't see it.", "I not saw it."],
        "I didn't see it.",
        "После didn't нужен базовый see.",
      ],
    ],
    readingQuestions: [
      [
        "How did Luis travel to the market?",
        ["By bicycle", "By underground", "By taxi"],
        "By underground",
        "They took the underground.",
      ],
      [
        "What did Luis buy?",
        ["A red bicycle", "Bread and fruit", "Lunch tickets"],
        "Bread and fruit",
        "В тексте он bought fresh bread and fruit.",
      ],
    ],
    listeningQuestions: [
      [
        "Who did the speaker meet?",
        ["A work manager", "An old school friend", "A taxi driver"],
        "An old school friend",
        "На поезде он met an old school friend.",
      ],
      [
        "Why did the speaker get up early?",
        ["The train left at eight.", "The taxi was late.", "The meeting ended early."],
        "The train left at eight.",
        "Первое предложение связывает время поезда и ранний подъём.",
      ],
    ],
    writing: {
      prompt: "Напиши о недавней поездке или прогулке с пятью действиями.",
      minWords: 35,
      model:
        "Last Sunday I went to the city centre. I took a bus and met a friend. We saw a market, bought fruit and had lunch in a park. We then left together. I came home at six.",
      checklist: ["Есть went", "Ещё три неправильных глагола", "Есть указатель прошлого"],
    },
    speaking: {
      prompt: "Расскажи историю по цепочке went — saw — bought — had.",
      model:
        "I went to a market yesterday. I saw an old friend, bought some bread and had coffee with her. Then I took the bus home.",
      checklist: ["Используй четыре заданные формы", "Назови место", "Добавь завершение"],
    },
  }),
  makeUnit({
    id: "a1-11",
    level: "A1",
    title: "Планы на будущее",
    goal: "Говорить о намерениях и договорённостях.",
    theory:
      "Be going to выражает намерение или план: I'm going to study. Present Continuous может передавать твёрдую договорённость с временем: We're meeting at six. Will удобен для решения в момент речи и обещания: I'll help. После going to и will используется базовая форма.",
    examples: [
      "I'm going to learn to drive.",
      "We're meeting Sara at seven.",
      "I'll carry that bag for you.",
    ],
    vocabulary: [
      { en: "plan", ru: "план" },
      { en: "arrange", ru: "договариваться" },
      { en: "next week", ru: "на следующей неделе" },
      { en: "tonight", ru: "сегодня вечером" },
      { en: "appointment", ru: "назначенная встреча" },
      { en: "promise", ru: "обещать" },
    ],
    reading:
      "Marta is going to start a photography course next month. The classes are on Wednesday evenings. She is meeting the teacher this Friday to discuss the equipment. Marta doesn't have a camera yet, so she is going to compare prices online. Her brother says, “I'll lend you mine for the first class.”",
    listening:
      "What are you doing this weekend? — I'm meeting Jo on Saturday morning. We're going to visit the science museum. — That sounds good. How are you getting there? — We're taking the ten o'clock train. I haven't bought my ticket, but I'll do it tonight. On Sunday, I'm going to rest.",
    grammar: [
      [
        "Выбери намерение: I ___ study Spanish next year.",
        ["am going to", "will to", "am go"],
        "am going to",
        "Намерение строится с be going to + глагол.",
      ],
      [
        "Как выразить договорённость на 18:00?",
        ["We meet maybe.", "We're meeting at six.", "We will meeting six."],
        "We're meeting at six.",
        "Present Continuous с точным временем показывает договорённость.",
      ],
    ],
    readingQuestions: [
      [
        "When is Marta meeting the teacher?",
        ["This Friday", "Next month", "Wednesday night"],
        "This Friday",
        "Точная договорённость указана в третьем предложении.",
      ],
      [
        "How will Marta get a camera for the first class?",
        ["Her brother will lend one.", "The teacher will buy one.", "She already has one."],
        "Her brother will lend one.",
        "Брат предлагает I'll lend you mine.",
      ],
    ],
    listeningQuestions: [
      [
        "Where are the friends going on Saturday?",
        ["A photography course", "A science museum", "A train station only"],
        "A science museum",
        "Они собираются visit the science museum.",
      ],
      [
        "When will the speaker buy the ticket?",
        ["Tonight", "Sunday", "Next month"],
        "Tonight",
        "Он обещает I'll do it tonight.",
      ],
    ],
    writing: {
      prompt: "Опиши планы на ближайшие выходные и одну договорённость.",
      minWords: 35,
      model:
        "I'm going to clean my flat on Saturday. In the afternoon, I'm meeting Alex at three. We're going to cook dinner. It should be fun. On Sunday, I'm going to study. I'll call my parents too.",
      checklist: [
        "Два плана с going to",
        "Одна договорённость в Continuous",
        "Одно решение или обещание с will",
      ],
    },
    speaking: {
      prompt: "Расскажи о планах на следующую неделю.",
      model:
        "I'm going to exercise more. I'm meeting my tutor on Tuesday at seven. On Friday, we're having dinner with friends. I'll book a table tomorrow.",
      checklist: ["Назови два дня", "Используй going to", "Добавь договорённость со временем"],
    },
  }),
  makeUnit({
    id: "a1-12",
    level: "A1",
    title: "Итог A1: связный рассказ",
    goal: "Соединить настоящее, прошлое и планы в понятном сообщении.",
    theory:
      "Связный рассказ даёт слушателю ориентиры: usually для привычки, yesterday/last для прошлого, next/going to для планов. Сначала обозначь время, затем действие и деталь. Связывай фразы and, but, because, so. Перед завершением проверь вспомогательные глаголы do/did и формы be.",
    examples: [
      "I usually work at home, but today I'm in the office.",
      "Yesterday I missed the bus, so I walked.",
      "Next week I'm going to visit my sister.",
    ],
    vocabulary: [
      { en: "first", ru: "сначала" },
      { en: "then", ru: "затем" },
      { en: "because", ru: "потому что" },
      { en: "so", ru: "поэтому" },
      { en: "last week", ru: "на прошлой неделе" },
      { en: "next month", ru: "в следующем месяце" },
    ],
    reading:
      "Ravi usually spends weekends in town, but last Saturday he went hiking with colleagues. They took an early train and walked for four hours. Ravi was tired, but he enjoyed the views. Next month, the group is going to visit another trail. Ravi is buying better shoes before the trip.",
    listening:
      "I normally cook at home, but yesterday I met my cousin at a new restaurant. We had vegetable curry and shared a cake because it was her birthday. The food was excellent. Next Friday, she's coming to my flat. I'm going to make pasta, and she'll bring a fresh salad.",
    grammar: [
      [
        "Выбери логичную последовательность.",
        [
          "Yesterday I go; next week I went.",
          "Yesterday I went; next week I'm going again.",
          "Yesterday I'm going; next week I go ago.",
        ],
        "Yesterday I went; next week I'm going again.",
        "Yesterday требует прошлого, next week — будущего плана.",
      ],
      [
        "Выбери связку причины.",
        [
          "I stayed home because I was tired.",
          "I stayed home but I was tired because so.",
          "Because tired I staying.",
        ],
        "I stayed home because I was tired.",
        "Because соединяет действие и его причину.",
      ],
    ],
    readingQuestions: [
      [
        "What did Ravi do last Saturday?",
        ["He worked in town.", "He went hiking.", "He bought shoes."],
        "He went hiking.",
        "Прошлое событие описано во втором фрагменте.",
      ],
      [
        "What is the group going to do next month?",
        ["Visit another trail", "Take a cooking class", "Stay in town"],
        "Visit another trail",
        "Будущий план прямо указан в тексте.",
      ],
    ],
    listeningQuestions: [
      [
        "Why did the cousins share a cake?",
        ["It was a restaurant gift.", "It was her birthday.", "The curry was bad."],
        "It was her birthday.",
        "Because вводит причину: her birthday.",
      ],
      [
        "What will the cousin bring next Friday?",
        ["Pasta", "A salad", "A cake"],
        "A salad",
        "Последняя часть: she'll bring a salad.",
      ],
    ],
    writing: {
      prompt: "Напиши три абзаца: обычная жизнь, недавнее событие и ближайший план.",
      minWords: 40,
      model:
        "I usually work and study English on weekdays. Last Saturday I went to the coast with friends. We walked and had lunch outside. Next weekend, I'm going to stay home because I have an exam. I'll call my tutor tonight.",
      checklist: [
        "Есть Present Simple",
        "Есть Past Simple",
        "Есть будущий план и связка because/so",
      ],
    },
    speaking: {
      prompt: "Запиши минутный рассказ «обычно — вчера — скоро».",
      model:
        "I usually take the bus to work. Yesterday the bus was late, so I walked. I met a friend on the way. Tomorrow, I'm going to leave earlier, and I'll buy coffee near the office.",
      checklist: ["Три временных ориентира", "Минимум две связки", "Формы времени не смешаны"],
    },
  }),
];
