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
      { id: "menu", en: "menu", ru: "меню", ipa: "/ˈmen.juː/", example: "Can I see the menu, please?", exampleRu: "Можно мне меню, пожалуйста?", phrases: [{ en: "Could we have the menu?", ru: "Можно нам меню?" }, { en: "Is there a kids' menu?", ru: "Есть детское меню?" }] },
      { id: "order", en: "order", ru: "заказывать / заказ", ipa: "/ˈɔː.dər/", example: "I'd like to order now.", exampleRu: "Я хотел бы сделать заказ.", phrases: [{ en: "Are you ready to order?", ru: "Вы готовы заказать?" }, { en: "This isn't what I ordered.", ru: "Это не то, что я заказывал." }] },
      { id: "bill", en: "bill", ru: "счёт", ipa: "/bɪl/", example: "Can we get the bill?", exampleRu: "Можно счёт?", phrases: [{ en: "Let's split the bill.", ru: "Давай разделим счёт." }, { en: "The bill is on me.", ru: "Я плачу." }] },
      { id: "recommend", en: "recommend", ru: "рекомендовать", ipa: "/ˌrek.əˈmend/", example: "What do you recommend?", exampleRu: "Что вы посоветуете?", phrases: [{ en: "I'd recommend the fish.", ru: "Я бы посоветовал рыбу." }, { en: "Can you recommend a dessert?", ru: "Посоветуете десерт?" }] },
      { id: "available", en: "available", ru: "свободный / доступный", ipa: "/əˈveɪ.lə.bəl/", example: "Is this table available?", exampleRu: "Этот стол свободен?", phrases: [{ en: "Are you available tomorrow?", ru: "Ты свободен завтра?" }, { en: "I'm available after 6 PM.", ru: "Я свободен после 6 вечера." }] },
      { id: "spicy", en: "spicy", ru: "острый", ipa: "/ˈspaɪ.si/", example: "Is this dish spicy?", exampleRu: "Это блюдо острое?", phrases: [{ en: "Not too spicy, please.", ru: "Не слишком остро, пожалуйста." }, { en: "I love spicy food.", ru: "Я люблю острую еду." }] },
    ],
    dialogue: [
      { who: "A", en: "Hi! Do you have a table for two?", ru: "Здравствуйте! У вас есть столик на двоих?" },
      { who: "B", en: "Sure, this one is available. Here's the menu.", ru: "Конечно, этот свободен. Вот меню." },
      { who: "A", en: "Thanks. What do you recommend?", ru: "Спасибо. Что посоветуете?" },
      { who: "B", en: "The chicken curry is great, but it's a bit spicy.", ru: "Карри с курицей отличное, но немного острое." },
      { who: "A", en: "Perfect, I'd like to order that.", ru: "Отлично, я бы хотел его заказать." },
      { who: "B", en: "Anything to drink?", ru: "Что-нибудь выпить?" },
      { who: "A", en: "Just water, please. And can we get the bill later?", ru: "Просто воду. И можно потом счёт?" },
    ],
    speaking: [
      { prompt: "Попросите меню", target: "Can I see the menu, please" },
      { prompt: "Спросите, что посоветуют", target: "What do you recommend" },
      { prompt: "Попросите счёт", target: "Can we get the bill" },
    ],
    grammar: { title: "Would like", rule: "I'd like = I would like — вежливое «я бы хотел». Звучит мягче, чем I want.", examples: ["I'd like a coffee.", "I'd like to order.", "Would you like some water?"] },
  },
  {
    day: 2,
    title: "At the Airport",
    titleRu: "В аэропорту",
    level: "A2",
    words: [
      { id: "boarding", en: "boarding pass", ru: "посадочный талон", ipa: "/ˈbɔː.dɪŋ pɑːs/", example: "Here's my boarding pass.", exampleRu: "Вот мой посадочный.", phrases: [{ en: "Can I see your boarding pass?", ru: "Можно ваш посадочный?" }, { en: "I lost my boarding pass.", ru: "Я потерял посадочный." }] },
      { id: "delayed", en: "delayed", ru: "задержан", ipa: "/dɪˈleɪd/", example: "My flight is delayed.", exampleRu: "Мой рейс задерживается.", phrases: [{ en: "How long is it delayed?", ru: "На сколько задержка?" }, { en: "Sorry, I got delayed.", ru: "Извини, я задержался." }] },
      { id: "luggage", en: "luggage", ru: "багаж", ipa: "/ˈlʌɡ.ɪdʒ/", example: "Where can I pick up my luggage?", exampleRu: "Где забрать багаж?", phrases: [{ en: "My luggage is missing.", ru: "Мой багаж пропал." }, { en: "Is this carry-on luggage?", ru: "Это ручная кладь?" }] },
      { id: "gate", en: "gate", ru: "выход на посадку", ipa: "/ɡeɪt/", example: "Which gate is it?", exampleRu: "Какой выход?", phrases: [{ en: "The gate has changed.", ru: "Выход изменился." }, { en: "Go to gate 12.", ru: "Идите к выходу 12." }] },
      { id: "actually", en: "actually", ru: "вообще-то / на самом деле", ipa: "/ˈæk.tʃu.ə.li/", example: "Actually, I don't know.", exampleRu: "Вообще-то, я не знаю.", phrases: [{ en: "Actually, it's my first time here.", ru: "Вообще-то, я здесь впервые." }, { en: "I actually like it.", ru: "Мне на самом деле нравится." }] },
    ],
    dialogue: [
      { who: "A", en: "Excuse me, is flight 204 delayed?", ru: "Извините, рейс 204 задерживается?" },
      { who: "B", en: "Yes, about forty minutes. Can I see your boarding pass?", ru: "Да, минут на сорок. Можно посадочный?" },
      { who: "A", en: "Here you go. Which gate is it?", ru: "Вот. Какой выход?" },
      { who: "B", en: "Actually, the gate has changed. It's gate 12 now.", ru: "Вообще-то, выход изменился. Теперь 12." },
      { who: "A", en: "Great, thanks a lot!", ru: "Отлично, большое спасибо!" },
    ],
    speaking: [
      { prompt: "Скажите, что рейс задерживается", target: "My flight is delayed" },
      { prompt: "Спросите, какой выход", target: "Which gate is it" },
    ],
    grammar: { title: "Present Continuous для планов", rule: "I'm flying to London tomorrow — Present Continuous для договорённостей на будущее.", examples: ["I'm leaving at 6.", "We're meeting at the gate.", "Are you flying tonight?"] },
  },
];

export const placementQuestions: { q: string; options: string[]; answer: number; level: Level }[] = [
  { q: "What ___ your name?", options: ["is", "are", "am", "be"], answer: 0, level: "A1" },
  { q: "She ___ to work every day.", options: ["go", "goes", "going", "gone"], answer: 1, level: "A1" },
  { q: "I ___ to Paris last year.", options: ["go", "have gone", "went", "was go"], answer: 2, level: "A2" },
  { q: "«Are you available tomorrow?» означает:", options: ["Ты занят завтра?", "Ты свободен завтра?", "Ты придёшь завтра?", "Ты доступен онлайн?"], answer: 1, level: "A2" },
  { q: "I've lived here ___ 2019.", options: ["for", "since", "from", "at"], answer: 1, level: "B1" },
  { q: "If I ___ more time, I'd travel.", options: ["have", "had", "will have", "having"], answer: 1, level: "B1" },
  { q: "Most natural: «I'm ___ forward to it.»", options: ["looking", "waiting", "seeing", "watching"], answer: 0, level: "B2" },
  { q: "By next year, she ___ her degree.", options: ["finishes", "will have finished", "has finished", "finished"], answer: 1, level: "B2" },
  { q: "«It's not my cup of tea» means:", options: ["I don't like it much", "I'm thirsty", "It's not mine", "It's too hot"], answer: 0, level: "C1" },
];

export const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];
