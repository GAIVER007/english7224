export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export interface Word {
  id: string;
  en: string;
  ru: string;
  ipa: string;
  example: string;
  exampleRu: string;
  phrases: { en: string; ru: string }[];
}

export interface DialogueLine {
  who: "A" | "B";
  en: string;
  ru: string;
}

export interface Lesson {
  day: number;
  title: string;
  titleRu: string;
  level: Level;
  words: Word[];
  dialogue: DialogueLine[];
  speaking: { prompt: string; target: string }[];
  grammar: { title: string; rule: string; examples: string[] };
}

export const lessons: Lesson[] = [
  {
    day: 1,
    title: "At a Restaurant",
    titleRu: "В ресторане",
    level: "A2",
    words: [
      {
        id: "menu",
        en: "menu",
        ru: "меню",
        ipa: "/ˈmen.juː/",
        example: "Can I see the menu, please?",
        exampleRu: "Можно мне меню, пожалуйста?",
        phrases: [
          { en: "Could we have the menu?", ru: "Можно нам меню?" },
          { en: "Is there a kids' menu?", ru: "Есть детское меню?" },
        ],
      },
      {
        id: "order",
        en: "order",
        ru: "заказывать / заказ",
        ipa: "/ˈɔː.dər/",
        example: "I'd like to order now.",
        exampleRu: "Я хотел бы сделать заказ.",
        phrases: [
          { en: "Are you ready to order?", ru: "Вы готовы заказать?" },
          { en: "This isn't what I ordered.", ru: "Это не то, что я заказывал." },
        ],
      },
      {
        id: "bill",
        en: "bill",
        ru: "счёт",
        ipa: "/bɪl/",
        example: "Can we get the bill?",
        exampleRu: "Можно счёт?",
        phrases: [
          { en: "Let's split the bill.", ru: "Давай разделим счёт." },
          { en: "The bill is on me.", ru: "Я плачу." },
        ],
      },
      {
        id: "recommend",
        en: "recommend",
        ru: "рекомендовать",
        ipa: "/ˌrek.əˈmend/",
        example: "What do you recommend?",
        exampleRu: "Что вы посоветуете?",
        phrases: [
          { en: "I'd recommend the fish.", ru: "Я бы посоветовал рыбу." },
          { en: "Can you recommend a dessert?", ru: "Посоветуете десерт?" },
        ],
      },
      {
        id: "available",
        en: "available",
        ru: "свободный / доступный",
        ipa: "/əˈveɪ.lə.bəl/",
        example: "Is this table available?",
        exampleRu: "Этот стол свободен?",
        phrases: [
          { en: "Are you available tomorrow?", ru: "Ты свободен завтра?" },
          { en: "I'm available after 6 PM.", ru: "Я свободен после 6 вечера." },
        ],
      },
      {
        id: "spicy",
        en: "spicy",
        ru: "острый",
        ipa: "/ˈspaɪ.si/",
        example: "Is this dish spicy?",
        exampleRu: "Это блюдо острое?",
        phrases: [
          { en: "Not too spicy, please.", ru: "Не слишком остро, пожалуйста." },
          { en: "I love spicy food.", ru: "Я люблю острую еду." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Hi! Do you have a table for two?",
        ru: "Здравствуйте! У вас есть столик на двоих?",
      },
      {
        who: "B",
        en: "Sure, this one is available. Here's the menu.",
        ru: "Конечно, этот свободен. Вот меню.",
      },
      { who: "A", en: "Thanks. What do you recommend?", ru: "Спасибо. Что посоветуете?" },
      {
        who: "B",
        en: "The chicken curry is great, but it's a bit spicy.",
        ru: "Карри с курицей отличное, но немного острое.",
      },
      { who: "A", en: "Perfect, I'd like to order that.", ru: "Отлично, я бы хотел его заказать." },
      { who: "B", en: "Anything to drink?", ru: "Что-нибудь выпить?" },
      {
        who: "A",
        en: "Just water, please. And can we get the bill later?",
        ru: "Просто воду. И можно потом счёт?",
      },
    ],
    speaking: [
      { prompt: "Попросите меню", target: "Can I see the menu, please" },
      { prompt: "Спросите, что посоветуют", target: "What do you recommend" },
      { prompt: "Попросите счёт", target: "Can we get the bill" },
    ],
    grammar: {
      title: "Would like",
      rule: "I'd like = I would like — вежливое «я бы хотел». Звучит мягче, чем I want.",
      examples: ["I'd like a coffee.", "I'd like to order.", "Would you like some water?"],
    },
  },
  {
    day: 2,
    title: "At the Airport",
    titleRu: "В аэропорту",
    level: "A2",
    words: [
      {
        id: "boarding",
        en: "boarding pass",
        ru: "посадочный талон",
        ipa: "/ˈbɔː.dɪŋ pɑːs/",
        example: "Here's my boarding pass.",
        exampleRu: "Вот мой посадочный.",
        phrases: [
          { en: "Can I see your boarding pass?", ru: "Можно ваш посадочный?" },
          { en: "I lost my boarding pass.", ru: "Я потерял посадочный." },
        ],
      },
      {
        id: "delayed",
        en: "delayed",
        ru: "задержан",
        ipa: "/dɪˈleɪd/",
        example: "My flight is delayed.",
        exampleRu: "Мой рейс задерживается.",
        phrases: [
          { en: "How long is it delayed?", ru: "На сколько задержка?" },
          { en: "Sorry, I got delayed.", ru: "Извини, я задержался." },
        ],
      },
      {
        id: "luggage",
        en: "luggage",
        ru: "багаж",
        ipa: "/ˈlʌɡ.ɪdʒ/",
        example: "Where can I pick up my luggage?",
        exampleRu: "Где забрать багаж?",
        phrases: [
          { en: "My luggage is missing.", ru: "Мой багаж пропал." },
          { en: "Is this carry-on luggage?", ru: "Это ручная кладь?" },
        ],
      },
      {
        id: "gate",
        en: "gate",
        ru: "выход на посадку",
        ipa: "/ɡeɪt/",
        example: "Which gate is it?",
        exampleRu: "Какой выход?",
        phrases: [
          { en: "The gate has changed.", ru: "Выход изменился." },
          { en: "Go to gate 12.", ru: "Идите к выходу 12." },
        ],
      },
      {
        id: "actually",
        en: "actually",
        ru: "вообще-то / на самом деле",
        ipa: "/ˈæk.tʃu.ə.li/",
        example: "Actually, I don't know.",
        exampleRu: "Вообще-то, я не знаю.",
        phrases: [
          { en: "Actually, it's my first time here.", ru: "Вообще-то, я здесь впервые." },
          { en: "I actually like it.", ru: "Мне на самом деле нравится." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Excuse me, is flight 204 delayed?",
        ru: "Извините, рейс 204 задерживается?",
      },
      {
        who: "B",
        en: "Yes, about forty minutes. Can I see your boarding pass?",
        ru: "Да, минут на сорок. Можно посадочный?",
      },
      { who: "A", en: "Here you go. Which gate is it?", ru: "Вот. Какой выход?" },
      {
        who: "B",
        en: "Actually, the gate has changed. It's gate 12 now.",
        ru: "Вообще-то, выход изменился. Теперь 12.",
      },
      { who: "A", en: "Great, thanks a lot!", ru: "Отлично, большое спасибо!" },
    ],
    speaking: [
      { prompt: "Скажите, что рейс задерживается", target: "My flight is delayed" },
      { prompt: "Спросите, какой выход", target: "Which gate is it" },
    ],
    grammar: {
      title: "Present Continuous для планов",
      rule: "I'm flying to London tomorrow — Present Continuous для договорённостей на будущее.",
      examples: ["I'm leaving at 6.", "We're meeting at the gate.", "Are you flying tonight?"],
    },
  },
  {
    day: 3,
    title: "Small Talk",
    titleRu: "Лёгкий разговор",
    level: "A2",
    words: [
      {
        id: "weekend",
        en: "weekend",
        ru: "выходные",
        ipa: "/ˌwiːkˈend/",
        example: "How was your weekend?",
        exampleRu: "Как прошли выходные?",
        phrases: [
          { en: "Any plans for the weekend?", ru: "Есть планы на выходные?" },
          { en: "I had a quiet weekend.", ru: "У меня были спокойные выходные." },
        ],
      },
      {
        id: "busy",
        en: "busy",
        ru: "занятой",
        ipa: "/ˈbɪz.i/",
        example: "I've been really busy lately.",
        exampleRu: "Я был очень занят в последнее время.",
        phrases: [
          { en: "Are you busy right now?", ru: "Ты сейчас занят?" },
          { en: "Work keeps me busy.", ru: "Работа не даёт скучать." },
        ],
      },
      {
        id: "lately",
        en: "lately",
        ru: "в последнее время",
        ipa: "/ˈleɪt.li/",
        example: "What have you been up to lately?",
        exampleRu: "Чем занимался в последнее время?",
        phrases: [
          { en: "I've been tired lately.", ru: "Я устаю в последнее время." },
          { en: "Have you seen any good movies lately?", ru: "Видел хорошие фильмы недавно?" },
        ],
      },
      {
        id: "sounds",
        en: "sounds good",
        ru: "звучит неплохо / договорились",
        ipa: "/saʊndz ɡʊd/",
        example: "Coffee at 5? — Sounds good!",
        exampleRu: "Кофе в 5? — Договорились!",
        phrases: [
          { en: "That sounds great.", ru: "Звучит отлично." },
          { en: "Sounds like fun.", ru: "Звучит весело." },
        ],
      },
      {
        id: "catchup",
        en: "catch up",
        ru: "пообщаться, наверстать",
        ipa: "/kætʃ ʌp/",
        example: "Let's catch up soon.",
        exampleRu: "Давай скоро увидимся и поболтаем.",
        phrases: [
          { en: "We should catch up sometime.", ru: "Надо как-нибудь пересечься." },
          { en: "I need to catch up on sleep.", ru: "Мне надо отоспаться." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Hey! Long time no see. How have you been?",
        ru: "Привет! Сто лет не виделись. Как ты?",
      },
      {
        who: "B",
        en: "Pretty good, just busy with work lately. You?",
        ru: "Неплохо, просто много работы в последнее время. А ты?",
      },
      { who: "A", en: "Same here. How was your weekend?", ru: "Аналогично. Как выходные?" },
      {
        who: "B",
        en: "Quiet. I mostly stayed home. We should catch up properly.",
        ru: "Спокойно. В основном дома. Надо нормально пообщаться.",
      },
      { who: "A", en: "Definitely. Coffee on Friday?", ru: "Обязательно. Кофе в пятницу?" },
      { who: "B", en: "Sounds good!", ru: "Договорились!" },
    ],
    speaking: [
      { prompt: "Спросите, как прошли выходные", target: "How was your weekend" },
      { prompt: "Предложите скоро увидеться", target: "Let's catch up soon" },
      { prompt: "Согласитесь: «Договорились!»", target: "Sounds good" },
    ],
    grammar: {
      title: "Present Perfect и Continuous",
      rule: "I've been busy lately — Present Perfect с be. I've been working — Present Perfect Continuous: действие продолжалось до настоящего момента.",
      examples: ["I've been working a lot.", "How have you been?", "She's been learning English."],
    },
  },
  {
    day: 4,
    title: "At the Hotel",
    titleRu: "В отеле",
    level: "A2",
    words: [
      {
        id: "checkin",
        en: "check in",
        ru: "заселиться",
        ipa: "/tʃek ɪn/",
        example: "I'd like to check in, please.",
        exampleRu: "Я бы хотел заселиться.",
        phrases: [
          { en: "What time is check-in?", ru: "Во сколько заселение?" },
          { en: "Can I check in early?", ru: "Можно заселиться пораньше?" },
        ],
      },
      {
        id: "reservation",
        en: "reservation",
        ru: "бронь",
        ipa: "/ˌrez.əˈveɪ.ʃən/",
        example: "I have a reservation under Smith.",
        exampleRu: "У меня бронь на имя Смит.",
        phrases: [
          { en: "Do you have a reservation?", ru: "У вас есть бронь?" },
          { en: "I'd like to cancel my reservation.", ru: "Я хочу отменить бронь." },
        ],
      },
      {
        id: "included",
        en: "included",
        ru: "включён",
        ipa: "/ɪnˈkluː.dɪd/",
        example: "Is breakfast included?",
        exampleRu: "Завтрак включён?",
        phrases: [
          { en: "Wi-Fi is included.", ru: "Wi-Fi включён." },
          { en: "Is tax included?", ru: "Налог включён?" },
        ],
      },
      {
        id: "wrong",
        en: "something's wrong with",
        ru: "что-то не так с",
        ipa: "/rɒŋ/",
        example: "Something's wrong with the AC.",
        exampleRu: "Что-то не так с кондиционером.",
        phrases: [
          { en: "Something's wrong with the shower.", ru: "Что-то с душем." },
          { en: "Is something wrong?", ru: "Что-то не так?" },
        ],
      },
      {
        id: "checkout",
        en: "check out",
        ru: "выселиться",
        ipa: "/tʃek aʊt/",
        example: "What time do we need to check out?",
        exampleRu: "Во сколько нужно выселиться?",
        phrases: [
          { en: "Can we have a late checkout?", ru: "Можно поздний выезд?" },
          { en: "I'm checking out today.", ru: "Я сегодня выезжаю." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Hi, I have a reservation under Ivanov.",
        ru: "Здравствуйте, у меня бронь на Иванова.",
      },
      {
        who: "B",
        en: "Welcome! Three nights, right? Here's your key.",
        ru: "Добро пожаловать! Три ночи, верно? Вот ключ.",
      },
      { who: "A", en: "Thanks. Is breakfast included?", ru: "Спасибо. Завтрак включён?" },
      {
        who: "B",
        en: "Yes, from 7 to 10 on the first floor.",
        ru: "Да, с 7 до 10 на первом этаже.",
      },
      { who: "A", en: "And what time do I need to check out?", ru: "А во сколько выезд?" },
      {
        who: "B",
        en: "By noon. Let us know if something's wrong with the room.",
        ru: "До полудня. Сообщите, если что-то не так с номером.",
      },
    ],
    speaking: [
      { prompt: "Скажите, что у вас бронь", target: "I have a reservation" },
      { prompt: "Спросите, включён ли завтрак", target: "Is breakfast included" },
    ],
    grammar: {
      title: "Need to",
      rule: "need to + глагол = нужно что-то сделать: I need to check out.",
      examples: [
        "Do I need to pay now?",
        "You need to show your passport.",
        "I don't need to hurry.",
      ],
    },
  },
  {
    day: 5,
    title: "Shopping",
    titleRu: "Покупки",
    level: "A2",
    words: [
      {
        id: "lookingfor",
        en: "looking for",
        ru: "ищу",
        ipa: "/ˈlʊk.ɪŋ fɔːr/",
        example: "I'm looking for a jacket.",
        exampleRu: "Я ищу куртку.",
        phrases: [
          { en: "Can I help you? — I'm just looking.", ru: "Помочь? — Я просто смотрю." },
          { en: "What are you looking for?", ru: "Что вы ищете?" },
        ],
      },
      {
        id: "tryon",
        en: "try on",
        ru: "примерить",
        ipa: "/traɪ ɒn/",
        example: "Can I try this on?",
        exampleRu: "Можно примерить?",
        phrases: [
          { en: "Where can I try it on?", ru: "Где примерочная?" },
          { en: "Try on a bigger size.", ru: "Примерьте размер побольше." },
        ],
      },
      {
        id: "size",
        en: "size",
        ru: "размер",
        ipa: "/saɪz/",
        example: "Do you have this in a medium size?",
        exampleRu: "Есть такой в размере M?",
        phrases: [
          { en: "It's the wrong size.", ru: "Не тот размер." },
          { en: "What size are you?", ru: "Какой у вас размер?" },
        ],
      },
      {
        id: "cost",
        en: "how much",
        ru: "сколько стоит",
        ipa: "/haʊ mʌtʃ/",
        example: "How much is this?",
        exampleRu: "Сколько это стоит?",
        phrases: [
          { en: "How much are these shoes?", ru: "Сколько стоят эти туфли?" },
          { en: "That's too much.", ru: "Это слишком дорого." },
        ],
      },
      {
        id: "discount",
        en: "discount",
        ru: "скидка",
        ipa: "/ˈdɪs.kaʊnt/",
        example: "Is there a discount?",
        exampleRu: "Есть скидка?",
        phrases: [
          { en: "Can I get a discount?", ru: "Можно скидку?" },
          { en: "It's 20% off.", ru: "Скидка 20%." },
        ],
      },
    ],
    dialogue: [
      { who: "B", en: "Hi, can I help you?", ru: "Здравствуйте, помочь?" },
      { who: "A", en: "Yes, I'm looking for a jacket.", ru: "Да, я ищу куртку." },
      { who: "B", en: "These are new. What size are you?", ru: "Вот новые. Какой у вас размер?" },
      { who: "A", en: "Medium. Can I try this one on?", ru: "M. Можно примерить эту?" },
      { who: "B", en: "Sure, the fitting room is over there.", ru: "Конечно, примерочная там." },
      {
        who: "A",
        en: "It fits! How much is it? Is there a discount?",
        ru: "Подошла! Сколько стоит? Есть скидка?",
      },
      {
        who: "B",
        en: "It's 80 dollars, but it's 20% off today.",
        ru: "80 долларов, но сегодня скидка 20%.",
      },
    ],
    speaking: [
      { prompt: "Скажите, что ищете куртку", target: "I'm looking for a jacket" },
      { prompt: "Спросите, можно ли примерить", target: "Can I try this on" },
      { prompt: "Спросите цену", target: "How much is this" },
    ],
    grammar: {
      title: "This / these",
      rule: "this — одна вещь, these — несколько: How much is this? / How much are these?",
      examples: ["I like this one.", "These shoes are nice.", "Is this on sale?"],
    },
  },
];

export const placementQuestions: { q: string; options: string[]; answer: number; level: Level }[] =
  [
    { q: "What ___ your name?", options: ["is", "are", "am", "be"], answer: 0, level: "A1" },
    {
      q: "She ___ to work every day.",
      options: ["go", "goes", "going", "gone"],
      answer: 1,
      level: "A1",
    },
    {
      q: "I ___ to Paris last year.",
      options: ["go", "have gone", "went", "was go"],
      answer: 2,
      level: "A2",
    },
    {
      q: "«Are you available tomorrow?» означает:",
      options: [
        "Ты занят завтра?",
        "Ты свободен завтра?",
        "Ты придёшь завтра?",
        "Ты доступен онлайн?",
      ],
      answer: 1,
      level: "A2",
    },
    {
      q: "I've lived here ___ 2019.",
      options: ["for", "since", "from", "at"],
      answer: 1,
      level: "B1",
    },
    {
      q: "If I ___ more time, I'd travel.",
      options: ["have", "had", "will have", "having"],
      answer: 1,
      level: "B1",
    },
    {
      q: "Most natural: «I'm ___ forward to it.»",
      options: ["looking", "waiting", "seeing", "watching"],
      answer: 0,
      level: "B2",
    },
    {
      q: "By next year, she ___ her degree.",
      options: ["finishes", "will have finished", "has finished", "finished"],
      answer: 1,
      level: "B2",
    },
    {
      q: "«It's not my cup of tea» means:",
      options: ["I don't like it much", "I'm thirsty", "It's not mine", "It's too hot"],
      answer: 0,
      level: "C1",
    },
  ];

export const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];
