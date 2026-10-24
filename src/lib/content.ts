import { extendedLessons } from "./extended-content";

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
  grammarQuiz: {
    prompt: string;
    options: string[];
    answer: string;
    explanation: string;
  };
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
    grammarQuiz: {
      prompt: "Как вежливо попросить кофе?",
      options: ["I want coffee.", "I'd like a coffee, please.", "I liking coffee."],
      answer: "I'd like a coffee, please.",
      explanation: "I'd like — вежливая форма просьбы; после like можно поставить существительное.",
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
    grammarQuiz: {
      prompt: "Выберите договорённость на завтра в Present Continuous.",
      options: ["I meet Anna tomorrow.", "I'm meeting Anna tomorrow.", "I met Anna tomorrow."],
      answer: "I'm meeting Anna tomorrow.",
      explanation: "Present Continuous описывает уже организованную будущую встречу.",
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
    grammarQuiz: {
      prompt: "Как сказать «Я много работал в последнее время»?",
      options: ["I've been working a lot lately.", "I working a lot lately.", "I was work lately."],
      answer: "I've been working a lot lately.",
      explanation: "Have been + глагол с -ing подчёркивает длительность до настоящего момента.",
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
    grammarQuiz: {
      prompt: "Выберите правильную форму: «Мне нужно выехать до полудня».",
      options: [
        "I need check out by noon.",
        "I need to check out by noon.",
        "I need checking out by noon.",
      ],
      answer: "I need to check out by noon.",
      explanation: "После need используется to + начальная форма глагола.",
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
    grammarQuiz: {
      prompt: "Как спросить цену этих ботинок?",
      options: ["How much is these?", "How much are these?", "How many is this?"],
      answer: "How much are these?",
      explanation: "These — множественное число, поэтому нужен глагол are.",
    },
  },
  {
    day: 6,
    title: "Directions and Transport",
    titleRu: "Дорога и транспорт",
    level: "A2",
    words: [
      {
        id: "directions-turn-left",
        en: "turn left",
        ru: "повернуть налево",
        ipa: "/tɜːn left/",
        example: "Turn left at the traffic lights.",
        exampleRu: "Поверните налево на светофоре.",
        phrases: [
          { en: "Turn left after the bank.", ru: "Поверните налево после банка." },
          { en: "Should I turn left here?", ru: "Мне здесь повернуть налево?" },
        ],
      },
      {
        id: "directions-go-straight",
        en: "go straight",
        ru: "идти прямо",
        ipa: "/ɡəʊ streɪt/",
        example: "Go straight for two blocks.",
        exampleRu: "Идите прямо два квартала.",
        phrases: [
          { en: "Go straight ahead.", ru: "Идите прямо." },
          { en: "Keep going straight.", ru: "Продолжайте идти прямо." },
        ],
      },
      {
        id: "directions-across-from",
        en: "across from",
        ru: "напротив",
        ipa: "/əˈkrɒs frəm/",
        example: "The station is across from the park.",
        exampleRu: "Станция находится напротив парка.",
        phrases: [
          { en: "It's across from the supermarket.", ru: "Это напротив супермаркета." },
          { en: "I live across from the school.", ru: "Я живу напротив школы." },
        ],
      },
      {
        id: "transport-bus-stop",
        en: "bus stop",
        ru: "автобусная остановка",
        ipa: "/ˈbʌs stɒp/",
        example: "Where is the nearest bus stop?",
        exampleRu: "Где ближайшая автобусная остановка?",
        phrases: [
          { en: "Wait for me at the bus stop.", ru: "Подожди меня на остановке." },
          { en: "The bus stop is around the corner.", ru: "Остановка находится за углом." },
        ],
      },
      {
        id: "transport-get-off",
        en: "get off",
        ru: "выходить из транспорта",
        ipa: "/ɡet ɒf/",
        example: "Get off at the next stop.",
        exampleRu: "Выходите на следующей остановке.",
        phrases: [
          { en: "Where should I get off?", ru: "Где мне выходить?" },
          { en: "We get off here.", ru: "Мы выходим здесь." },
        ],
      },
      {
        id: "transport-change-trains",
        en: "change trains",
        ru: "делать пересадку на другой поезд",
        ipa: "/tʃeɪndʒ treɪnz/",
        example: "You need to change trains at Central Station.",
        exampleRu: "Вам нужно пересесть на Центральной станции.",
        phrases: [
          { en: "Do I need to change trains?", ru: "Мне нужно делать пересадку?" },
          { en: "Change trains on platform four.", ru: "Пересядьте на четвёртой платформе." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Excuse me, how do I get to the city centre?",
        ru: "Извините, как добраться до центра города?",
      },
      {
        who: "B",
        en: "Take bus 24 from the stop across from the bank.",
        ru: "Сядьте на автобус 24 на остановке напротив банка.",
      },
      { who: "A", en: "Where should I get off?", ru: "Где мне выходить?" },
      {
        who: "B",
        en: "Get off at Market Street, then go straight for one block.",
        ru: "Выйдите на Маркет-стрит, затем пройдите один квартал прямо.",
      },
      { who: "A", en: "Do I turn left after that?", ru: "После этого мне повернуть налево?" },
      {
        who: "B",
        en: "Yes. The square will be on your right.",
        ru: "Да. Площадь будет справа от вас.",
      },
    ],
    speaking: [
      { prompt: "Спросите, где ближайшая остановка", target: "Where is the nearest bus stop" },
      { prompt: "Спросите, где вам выходить", target: "Where should I get off" },
      { prompt: "Скажите, чтобы собеседник шёл прямо", target: "Go straight" },
    ],
    grammar: {
      title: "Повелительное наклонение",
      rule: "Для короткой инструкции начинайте с глагола: Turn left. Go straight. Отрицание строится с don't.",
      examples: [
        "Turn right at the corner.",
        "Take the second exit.",
        "Don't cross the road here.",
      ],
    },
    grammarQuiz: {
      prompt: "Как дать отрицательную инструкцию?",
      options: ["Not cross here.", "Don't cross here.", "Doesn't cross here."],
      answer: "Don't cross here.",
      explanation: "Отрицательная команда строится как don't + начальная форма глагола.",
    },
  },
  {
    day: 7,
    title: "Daily Routine",
    titleRu: "Повседневные дела",
    level: "A2",
    words: [
      {
        id: "routine-wake-up",
        en: "wake up",
        ru: "просыпаться",
        ipa: "/weɪk ʌp/",
        example: "I usually wake up at seven.",
        exampleRu: "Обычно я просыпаюсь в семь.",
        phrases: [
          { en: "What time do you wake up?", ru: "Во сколько ты просыпаешься?" },
          { en: "I woke up late today.", ru: "Сегодня я поздно проснулся." },
        ],
      },
      {
        id: "routine-get-ready",
        en: "get ready",
        ru: "собираться",
        ipa: "/ɡet ˈred.i/",
        example: "It takes me twenty minutes to get ready.",
        exampleRu: "Мне нужно двадцать минут, чтобы собраться.",
        phrases: [
          { en: "I need to get ready for work.", ru: "Мне нужно собраться на работу." },
          { en: "Are you ready to go?", ru: "Ты готов выходить?" },
        ],
      },
      {
        id: "routine-commute",
        en: "commute",
        ru: "добираться на работу",
        ipa: "/kəˈmjuːt/",
        example: "I commute by train.",
        exampleRu: "Я добираюсь на работу на поезде.",
        phrases: [
          { en: "My commute takes an hour.", ru: "Дорога на работу занимает час." },
          { en: "How do you commute to work?", ru: "Как ты добираешься на работу?" },
        ],
      },
      {
        id: "routine-take-a-break",
        en: "take a break",
        ru: "сделать перерыв",
        ipa: "/teɪk ə breɪk/",
        example: "Let's take a short break.",
        exampleRu: "Давай сделаем короткий перерыв.",
        phrases: [
          { en: "I take a break at lunchtime.", ru: "Я делаю перерыв в обед." },
          { en: "You should take a break.", ru: "Тебе стоит сделать перерыв." },
        ],
      },
      {
        id: "routine-usually",
        en: "usually",
        ru: "обычно",
        ipa: "/ˈjuː.ʒu.ə.li/",
        example: "I usually cook dinner at home.",
        exampleRu: "Обычно я готовлю ужин дома.",
        phrases: [
          { en: "What do you usually do after work?", ru: "Что ты обычно делаешь после работы?" },
          { en: "I'm usually home by seven.", ru: "Обычно я дома к семи." },
        ],
      },
      {
        id: "routine-on-time",
        en: "on time",
        ru: "вовремя",
        ipa: "/ɒn taɪm/",
        example: "I try to leave home on time.",
        exampleRu: "Я стараюсь выходить из дома вовремя.",
        phrases: [
          { en: "The bus arrived on time.", ru: "Автобус приехал вовремя." },
          { en: "Please be on time.", ru: "Пожалуйста, приходи вовремя." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "What time do you usually wake up?",
        ru: "Во сколько ты обычно просыпаешься?",
      },
      {
        who: "B",
        en: "At seven. I get ready quickly and leave home by eight.",
        ru: "В семь. Я быстро собираюсь и выхожу из дома к восьми.",
      },
      { who: "A", en: "How do you commute to work?", ru: "Как ты добираешься на работу?" },
      {
        who: "B",
        en: "By train. The commute takes about forty minutes.",
        ru: "На поезде. Дорога занимает около сорока минут.",
      },
      {
        who: "A",
        en: "Do you get a break during the day?",
        ru: "У тебя есть перерыв в течение дня?",
      },
      {
        who: "B",
        en: "Yes, I usually take a break at one.",
        ru: "Да, обычно я делаю перерыв в час.",
      },
    ],
    speaking: [
      { prompt: "Скажите, что обычно просыпаетесь в семь", target: "I usually wake up at seven" },
      {
        prompt: "Спросите, как человек добирается на работу",
        target: "How do you commute to work",
      },
      { prompt: "Предложите сделать короткий перерыв", target: "Let's take a short break" },
    ],
    grammar: {
      title: "Наречия частоты",
      rule: "Usually, often и sometimes ставятся перед обычным глаголом, но после be: I usually walk. I'm usually tired.",
      examples: [
        "I often work from home.",
        "She sometimes takes the bus.",
        "We're usually on time.",
      ],
    },
    grammarQuiz: {
      prompt: "Где usually стоит правильно?",
      options: ["I go usually by bus.", "I usually go by bus.", "Usually I am go by bus."],
      answer: "I usually go by bus.",
      explanation: "Наречие частоты ставится перед обычным смысловым глаголом.",
    },
  },
  {
    day: 8,
    title: "Arranging Plans",
    titleRu: "Договариваемся о встрече",
    level: "A2",
    words: [
      {
        id: "plans-make-plans",
        en: "make plans",
        ru: "строить планы / договариваться",
        ipa: "/meɪk plænz/",
        example: "Let's make plans for the weekend.",
        exampleRu: "Давай договоримся на выходные.",
        phrases: [
          { en: "Have you made any plans?", ru: "Ты уже что-нибудь запланировал?" },
          {
            en: "I don't like making plans too early.",
            ru: "Я не люблю планировать слишком заранее.",
          },
        ],
      },
      {
        id: "plans-how-about",
        en: "how about",
        ru: "как насчёт",
        ipa: "/haʊ əˈbaʊt/",
        example: "How about meeting on Saturday?",
        exampleRu: "Как насчёт встречи в субботу?",
        phrases: [
          { en: "How about six o'clock?", ru: "Как насчёт шести часов?" },
          { en: "How about a walk?", ru: "Как насчёт прогулки?" },
        ],
      },
      {
        id: "plans-works-for-me",
        en: "works for me",
        ru: "мне подходит",
        ipa: "/wɜːks fə miː/",
        example: "Friday evening works for me.",
        exampleRu: "Вечер пятницы мне подходит.",
        phrases: [
          { en: "Does three o'clock work for you?", ru: "Тебе подходит три часа?" },
          { en: "That time doesn't work for me.", ru: "Это время мне не подходит." },
        ],
      },
      {
        id: "plans-meet-up",
        en: "meet up",
        ru: "встретиться",
        ipa: "/miːt ʌp/",
        example: "Do you want to meet up after work?",
        exampleRu: "Хочешь встретиться после работы?",
        phrases: [
          { en: "Let's meet up for coffee.", ru: "Давай встретимся за кофе." },
          { en: "Where should we meet up?", ru: "Где нам встретиться?" },
        ],
      },
      {
        id: "plans-reschedule",
        en: "reschedule",
        ru: "перенести на другое время",
        ipa: "/ˌriːˈʃed.juːl/",
        example: "Can we reschedule our meeting?",
        exampleRu: "Можем перенести нашу встречу?",
        phrases: [
          { en: "I need to reschedule.", ru: "Мне нужно перенести встречу." },
          { en: "Let's reschedule for Monday.", ru: "Давай перенесём на понедельник." },
        ],
      },
      {
        id: "plans-look-forward-to",
        en: "look forward to",
        ru: "ждать с нетерпением",
        ipa: "/lʊk ˈfɔː.wəd tuː/",
        example: "I'm looking forward to seeing you.",
        exampleRu: "С нетерпением жду нашей встречи.",
        phrases: [
          { en: "I look forward to the weekend.", ru: "Я с нетерпением жду выходных." },
          { en: "We're looking forward to the trip.", ru: "Мы с нетерпением ждём поездки." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Do you want to meet up this weekend?",
        ru: "Хочешь встретиться на выходных?",
      },
      {
        who: "B",
        en: "Sure. How about Saturday afternoon?",
        ru: "Конечно. Как насчёт субботы после обеда?",
      },
      {
        who: "A",
        en: "Saturday works for me. Let's meet at the new café.",
        ru: "Суббота мне подходит. Давай встретимся в новом кафе.",
      },
      { who: "B", en: "Can we make it four o'clock?", ru: "Можем встретиться в четыре?" },
      {
        who: "A",
        en: "Perfect. I'm looking forward to it.",
        ru: "Отлично. Буду ждать с нетерпением.",
      },
      { who: "B", en: "Me too. See you then!", ru: "Я тоже. До встречи!" },
    ],
    speaking: [
      {
        prompt: "Предложите встретиться после работы",
        target: "Do you want to meet up after work",
      },
      { prompt: "Скажите, что пятница вам подходит", target: "Friday works for me" },
      { prompt: "Попросите перенести встречу", target: "Can we reschedule our meeting" },
    ],
    grammar: {
      title: "Предложения с how about и let's",
      rule: "После how about используйте существительное или глагол с -ing. После let's нужен глагол без to.",
      examples: ["How about Friday?", "How about meeting at six?", "Let's meet near the station."],
    },
    grammarQuiz: {
      prompt: "Как предложить встретиться в шесть?",
      options: ["How about meet at six?", "How about meeting at six?", "How about to meet at six?"],
      answer: "How about meeting at six?",
      explanation: "После how about глагол получает окончание -ing.",
    },
  },
  {
    day: 9,
    title: "Asking for Help",
    titleRu: "Просим о помощи",
    level: "A2",
    words: [
      {
        id: "help-could-you-help",
        en: "could you help me",
        ru: "не могли бы вы мне помочь",
        ipa: "/kʊd juː help miː/",
        example: "Could you help me with this form?",
        exampleRu: "Не могли бы вы помочь мне с этой формой?",
        phrases: [
          { en: "Could you help me for a minute?", ru: "Не могли бы вы помочь мне минутку?" },
          { en: "Of course, I can help.", ru: "Конечно, я могу помочь." },
        ],
      },
      {
        id: "help-figure-out",
        en: "figure out",
        ru: "разобраться / понять",
        ipa: "/ˈfɪɡ.ər aʊt/",
        example: "I can't figure out how this works.",
        exampleRu: "Я не могу понять, как это работает.",
        phrases: [
          { en: "We'll figure it out.", ru: "Мы разберёмся." },
          { en: "Did you figure out the problem?", ru: "Ты разобрался с проблемой?" },
        ],
      },
      {
        id: "help-show-me-how",
        en: "show me how",
        ru: "покажите мне, как",
        ipa: "/ʃəʊ miː haʊ/",
        example: "Can you show me how to use this?",
        exampleRu: "Можете показать, как этим пользоваться?",
        phrases: [
          { en: "Show me how you did it.", ru: "Покажи, как ты это сделал." },
          { en: "Could you show me how to pay?", ru: "Не могли бы вы показать, как оплатить?" },
        ],
      },
      {
        id: "help-lend",
        en: "lend",
        ru: "одолжить кому-то",
        ipa: "/lend/",
        example: "Could you lend me a pen?",
        exampleRu: "Не мог бы ты одолжить мне ручку?",
        phrases: [
          { en: "Can you lend me your charger?", ru: "Можешь одолжить мне зарядку?" },
          { en: "I lent him my umbrella.", ru: "Я одолжил ему свой зонт." },
        ],
      },
      {
        id: "help-explain",
        en: "explain",
        ru: "объяснять",
        ipa: "/ɪkˈspleɪn/",
        example: "Could you explain that again?",
        exampleRu: "Не могли бы вы объяснить это ещё раз?",
        phrases: [
          { en: "Let me explain.", ru: "Позвольте мне объяснить." },
          { en: "It's difficult to explain.", ru: "Это трудно объяснить." },
        ],
      },
      {
        id: "help-appreciate",
        en: "appreciate",
        ru: "быть благодарным / ценить",
        ipa: "/əˈpriː.ʃi.eɪt/",
        example: "I really appreciate your help.",
        exampleRu: "Я очень благодарен за вашу помощь.",
        phrases: [
          { en: "I'd appreciate that.", ru: "Я был бы благодарен." },
          { en: "We appreciate your time.", ru: "Мы ценим ваше время." },
        ],
      },
    ],
    dialogue: [
      {
        who: "A",
        en: "Excuse me, could you help me with this machine?",
        ru: "Извините, не могли бы вы помочь мне с этим автоматом?",
      },
      {
        who: "B",
        en: "Sure. What are you trying to do?",
        ru: "Конечно. Что вы пытаетесь сделать?",
      },
      {
        who: "A",
        en: "I can't figure out how to buy a ticket.",
        ru: "Я не могу разобраться, как купить билет.",
      },
      {
        who: "B",
        en: "First, choose your destination here. Then tap your card.",
        ru: "Сначала выберите здесь пункт назначения. Затем приложите карту.",
      },
      { who: "A", en: "Could you show me how?", ru: "Не могли бы вы показать, как?" },
      {
        who: "B",
        en: "Of course. It's easy once you see it.",
        ru: "Конечно. Когда увидите, всё станет просто.",
      },
      {
        who: "A",
        en: "Thanks, I really appreciate your help.",
        ru: "Спасибо, я очень благодарен за помощь.",
      },
    ],
    speaking: [
      { prompt: "Вежливо попросите о помощи", target: "Could you help me" },
      {
        prompt: "Попросите показать, как этим пользоваться",
        target: "Can you show me how to use this",
      },
      { prompt: "Поблагодарите за помощь", target: "I really appreciate your help" },
    ],
    grammar: {
      title: "Вежливые просьбы с could",
      rule: "Could you + глагол звучит мягче, чем can you. После could и can используйте глагол без to.",
      examples: ["Could you open the door?", "Could you explain this?", "Can you wait a moment?"],
    },
    grammarQuiz: {
      prompt: "Выберите вежливую просьбу.",
      options: ["Could you explain this?", "Could you to explain this?", "You explain this."],
      answer: "Could you explain this?",
      explanation: "После could используется начальная форма глагола без to.",
    },
  },
  {
    day: 10,
    title: "Talking About Work",
    titleRu: "Разговор о работе",
    level: "A2",
    words: [
      {
        id: "work-colleague",
        en: "colleague",
        ru: "коллега",
        ipa: "/ˈkɒl.iːɡ/",
        example: "I work with friendly colleagues.",
        exampleRu: "Я работаю с дружелюбными коллегами.",
        phrases: [
          { en: "She's a colleague of mine.", ru: "Она моя коллега." },
          { en: "I had lunch with my colleagues.", ru: "Я обедал с коллегами." },
        ],
      },
      {
        id: "work-shift",
        en: "shift",
        ru: "рабочая смена",
        ipa: "/ʃɪft/",
        example: "My shift starts at nine.",
        exampleRu: "Моя смена начинается в девять.",
        phrases: [
          { en: "I'm working the morning shift.", ru: "Я работаю в утреннюю смену." },
          { en: "What time does your shift end?", ru: "Во сколько заканчивается твоя смена?" },
        ],
      },
      {
        id: "work-task",
        en: "task",
        ru: "задача",
        ipa: "/tɑːsk/",
        example: "I have one more task to finish.",
        exampleRu: "Мне нужно закончить ещё одну задачу.",
        phrases: [
          { en: "This task is almost done.", ru: "Эта задача почти готова." },
          { en: "What's your main task today?", ru: "Какая у тебя главная задача сегодня?" },
        ],
      },
      {
        id: "work-deadline",
        en: "deadline",
        ru: "крайний срок",
        ipa: "/ˈded.laɪn/",
        example: "The deadline is Friday.",
        exampleRu: "Крайний срок — пятница.",
        phrases: [
          { en: "Can we meet the deadline?", ru: "Мы успеем к сроку?" },
          { en: "I have a tight deadline.", ru: "У меня очень сжатый срок." },
        ],
      },
      {
        id: "work-meeting",
        en: "meeting",
        ru: "рабочая встреча",
        ipa: "/ˈmiː.tɪŋ/",
        example: "I have a meeting at ten.",
        exampleRu: "У меня встреча в десять.",
        phrases: [
          { en: "The meeting was useful.", ru: "Встреча была полезной." },
          { en: "Can we move the meeting?", ru: "Можем перенести встречу?" },
        ],
      },
      {
        id: "work-from-home",
        en: "work from home",
        ru: "работать из дома",
        ipa: "/wɜːk frəm həʊm/",
        example: "I work from home twice a week.",
        exampleRu: "Я работаю из дома два раза в неделю.",
        phrases: [
          { en: "Do you ever work from home?", ru: "Ты иногда работаешь из дома?" },
          { en: "I'm working from home today.", ru: "Сегодня я работаю из дома." },
        ],
      },
    ],
    dialogue: [
      { who: "A", en: "How's work going?", ru: "Как дела на работе?" },
      {
        who: "B",
        en: "Pretty well. I have a good team and helpful colleagues.",
        ru: "Довольно хорошо. У меня хорошая команда и отзывчивые коллеги.",
      },
      { who: "A", en: "What are you working on today?", ru: "Над чем ты сегодня работаешь?" },
      {
        who: "B",
        en: "I need to finish a task before Friday's deadline.",
        ru: "Мне нужно закончить задачу до крайнего срока в пятницу.",
      },
      { who: "A", en: "Are you in the office every day?", ru: "Ты каждый день в офисе?" },
      {
        who: "B",
        en: "No, I work from home twice a week.",
        ru: "Нет, два раза в неделю я работаю из дома.",
      },
    ],
    speaking: [
      { prompt: "Скажите, во сколько начинается ваша смена", target: "My shift starts at nine" },
      { prompt: "Скажите, что у вас встреча в десять", target: "I have a meeting at ten" },
      { prompt: "Скажите, что сегодня работаете из дома", target: "I'm working from home today" },
    ],
    grammar: {
      title: "Have to и don't have to",
      rule: "Have to означает необходимость. Don't have to означает, что действие необязательно.",
      examples: [
        "I have to finish this task.",
        "She has to join the meeting.",
        "We don't have to work late.",
      ],
    },
    grammarQuiz: {
      prompt: "Как сказать, что задерживаться необязательно?",
      options: ["We mustn't work late.", "We don't have to work late.", "We haven't work late."],
      answer: "We don't have to work late.",
      explanation: "Don't have to означает отсутствие необходимости, а mustn't — запрет.",
    },
  },
  ...extendedLessons,
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
