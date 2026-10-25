import type { PathQuestion, PathUnit } from "./types";

type QuestionSeed = [PathQuestion["skill"], string, string[], string, string];
type UnitSeed = Omit<PathUnit, "questions"> & { questions: QuestionSeed[] };

const unit = (seed: UnitSeed): PathUnit => ({
  ...seed,
  questions: seed.questions.map(([skill, prompt, options, answer, explanation]) => ({
    skill,
    prompt,
    options,
    answer,
    explanation,
  })),
});

const a2Units: PathUnit[] = [
  unit({
    id: "a2-01",
    level: "A2",
    title: "Что происходило в тот момент",
    goal: "Описывать длительное действие в прошлом и короткое событие, которое его прервало.",
    theory:
      "Past Continuous показывает процесс в конкретный момент прошлого: was/were + глагол с -ing. Короткое завершённое событие обычно ставим в Past Simple. While часто вводит длительный фон, when — событие: I was walking when it started to rain.",
    examples: [
      "At eight, I was waiting for the bus.",
      "While we were cooking, Anna was setting the table.",
      "I was crossing the street when my phone rang.",
    ],
    vocabulary: [
      { en: "suddenly", ru: "внезапно" },
      { en: "while", ru: "пока, в то время как" },
      { en: "wait", ru: "ждать" },
      { en: "cross", ru: "переходить" },
      { en: "notice", ru: "замечать" },
      { en: "happen", ru: "случаться" },
    ],
    reading:
      "Yesterday evening, Lena was walking home from work. The streets were quiet, and a light rain was falling. As she was passing a small café, she noticed a dog near the door. It was shaking, so Lena called the number on its collar. Ten minutes later, its owner arrived and thanked her.",
    listening:
      "Last Saturday, I was cleaning my flat when my cousin called. She was standing at the railway station because her train arrived early. I stopped cleaning and went to meet her. While I was driving there, the traffic was moving very slowly. She waited in a warm café and drank tea. When I finally arrived, she was talking to a traveller from Spain. We laughed about the delay and then went home together.",
    questions: [
      [
        "grammar",
        "Действие шло в девять часов: At nine, we ___ dinner.",
        ["were having", "had", "are having"],
        "were having",
        "Процесс в конкретный момент прошлого требует Past Continuous.",
      ],
      [
        "grammar",
        "I was reading when the lights ___.",
        ["went out", "were going out", "go out"],
        "went out",
        "Короткое событие, которое прервало процесс, ставим в Past Simple.",
      ],
      [
        "reading",
        "Почему Лена позвонила по номеру на ошейнике?",
        ["Она увидела дрожащую собаку", "Она потеряла телефон", "Кафе было закрыто"],
        "Она увидела дрожащую собаку",
        "Собака дрожала у двери, поэтому Лена решила найти владельца.",
      ],
      [
        "reading",
        "Какая была погода?",
        ["Шёл лёгкий дождь", "Было жарко", "Шёл снег"],
        "Шёл лёгкий дождь",
        "В тексте сказано: a light rain was falling.",
      ],
      [
        "listening",
        "Где ждала двоюродная сестра?",
        ["В тёплом кафе", "В поезде", "У дома"],
        "В тёплом кафе",
        "Из-за медленного движения она ждала в кафе.",
      ],
      [
        "listening",
        "Что она делала, когда рассказчик приехал?",
        ["Разговаривала с путешественником", "Убирала квартиру", "Покупала билет"],
        "Разговаривала с путешественником",
        "В конце рассказа она беседовала с путешественником из Испании.",
      ],
    ],
    writing: {
      prompt: "Опиши неожиданное событие: что ты делал до него и что случилось.",
      minWords: 40,
      model:
        "I was walking through the park after work. People were cycling and children were playing. Suddenly, I heard a loud sound. A branch fell near the path, but nobody was hurt. I called the park office and waited until a worker arrived.",
      checklist: [
        "Используй минимум две формы was/were + -ing",
        "Добавь одно короткое действие в Past Simple",
        "Свяжи события словами when или while",
      ],
    },
    speaking: {
      prompt: "Расскажи о моменте, когда тебе неожиданно позвонили или написали.",
      model:
        "I was making breakfast when my manager called. I was surprised because it was Sunday. She wanted to change Monday's meeting. We spoke for two minutes, and then I finished breakfast.",
      checklist: ["Назови время и место", "Опиши фоновое действие", "Заверши рассказ результатом"],
    },
  }),
  unit({
    id: "a2-02",
    level: "A2",
    title: "Опыт и завершённое прошлое",
    goal: "Различать жизненный опыт и событие с указанным временем.",
    theory:
      "Present Perfect связывает прошлое с настоящим: have/has + V3. Его используем для опыта без точного времени, а также с just, already, yet, ever, never. Past Simple нужен, если время закончено или названо: I visited Rome in 2023. Have you ever visited Rome?",
    examples: [
      "I have never tried surfing.",
      "She has already booked the tickets.",
      "We went to Prague last May.",
    ],
    vocabulary: [
      { en: "experience", ru: "опыт" },
      { en: "ever", ru: "когда-либо" },
      { en: "already", ru: "уже" },
      { en: "yet", ru: "ещё, уже" },
      { en: "book", ru: "бронировать" },
      { en: "abroad", ru: "за границей" },
    ],
    reading:
      "Maksim loves short trips. He has visited five countries, but he has never travelled alone. Last year, he went to Georgia with two friends. They stayed in a family hotel and learned to cook khinkali. Maksim has already planned his next trip, but he has not bought the tickets yet.",
    listening:
      "Have you ever slept in a tent? I have done it many times, but my first trip was difficult. I went camping with my brother three years ago. We forgot a warm blanket, and it rained during the night. Since then, I have bought better equipment and learned to check the weather. Last weekend, we camped beside a lake. The night was cold, but our tent stayed dry, and we made breakfast outside in the morning.",
    questions: [
      [
        "grammar",
        "I ___ that film twice.",
        ["have seen", "saw yesterday", "see"],
        "have seen",
        "Опыт без указанного времени выражаем Present Perfect.",
      ],
      [
        "grammar",
        "We ___ the museum last Saturday.",
        ["visited", "have visited", "have visit"],
        "visited",
        "Last Saturday — законченное время, поэтому нужен Past Simple.",
      ],
      [
        "reading",
        "С кем Максим ездил в Грузию?",
        ["С двумя друзьями", "Один", "С семьёй"],
        "С двумя друзьями",
        "В тексте прямо названы two friends.",
      ],
      [
        "reading",
        "Что Максим ещё не сделал?",
        ["Не купил билеты", "Не выбрал поездку", "Не посетил ни одной страны"],
        "Не купил билеты",
        "План уже есть, но билеты ещё не куплены.",
      ],
      [
        "listening",
        "Что забыли в первой поездке?",
        ["Тёплое одеяло", "Палатку", "Завтрак"],
        "Тёплое одеяло",
        "Рассказчик говорит: We forgot a warm blanket.",
      ],
      [
        "listening",
        "Почему последняя поездка была комфортнее?",
        ["Было лучшее снаряжение", "Они ночевали в отеле", "Было очень жарко"],
        "Было лучшее снаряжение",
        "После первой поездки рассказчик купил лучшее снаряжение.",
      ],
    ],
    writing: {
      prompt: "Напиши о новом опыте и укажи, когда он произошёл впервые.",
      minWords: 45,
      model:
        "I have tried several outdoor activities, but kayaking is my favourite. I first tried it last summer near Kazan. The instructor showed me how to turn safely. Since then, I have gone kayaking three more times, and I have already planned another trip for June.",
      checklist: [
        "Добавь Present Perfect для опыта",
        "Укажи точное прошлое время с Past Simple",
        "Используй already, yet, ever или never",
      ],
    },
    speaking: {
      prompt: "Обсуди с партнёром три вещи, которые вы когда-либо пробовали.",
      model:
        "Have you ever cooked food from another country? I have made Thai soup once. I made it for my friends last month, but it was too spicy. What new dish have you tried?",
      checklist: [
        "Задай вопрос Have you ever...?",
        "Дай короткую деталь в Past Simple",
        "Задай уточняющий вопрос",
      ],
    },
  }),
  unit({
    id: "a2-03",
    level: "A2",
    title: "Сравниваем варианты",
    goal: "Сравнивать людей, места и предметы, усиливать сравнение.",
    theory:
      "К коротким прилагательным добавляем -er/-est: cheaper, the cheapest. С длинными используем more/the most. После сравнительной степени ставим than. Конструкции as ... as и not as ... as показывают равенство или различие. Much и a bit уточняют силу разницы.",
    examples: [
      "The train is faster than the bus.",
      "This is the most comfortable chair here.",
      "My room is not as bright as yours.",
    ],
    vocabulary: [
      { en: "comfortable", ru: "удобный" },
      { en: "crowded", ru: "переполненный" },
      { en: "reliable", ru: "надёжный" },
      { en: "slightly", ru: "немного" },
      { en: "choice", ru: "выбор" },
      { en: "value", ru: "выгодность, ценность" },
    ],
    reading:
      "Nina compared two gyms near her home. FitClub is cheaper and closer, but it gets crowded after work. ActiveSpace is more expensive, yet its equipment is newer and the trainers are more helpful. Nina chose FitClub because location is more important to her than modern equipment. She plans to exercise early, when it is quieter.",
    listening:
      "I tested two laptops for my studies. The silver one was lighter and its battery lasted longer. The black one had a larger screen and was slightly faster, but it cost much more. I travel to college every day, so weight is important to me. In the end, I bought the silver laptop. It is not as powerful as the black one, but it is easier to carry and offers better value for my needs.",
    questions: [
      [
        "grammar",
        "This route is ___ than the old one.",
        ["more reliable", "reliabler", "most reliable"],
        "more reliable",
        "С длинным прилагательным comparative образуется через more.",
      ],
      [
        "grammar",
        "My bike is not ___ yours.",
        ["as fast as", "faster as", "the fastest than"],
        "as fast as",
        "Равенство или неравенство выражает конструкция as ... as.",
      ],
      [
        "reading",
        "Почему Нина выбрала FitClub?",
        ["Он ближе к дому", "Там новее оборудование", "Там всегда пусто"],
        "Он ближе к дому",
        "Для Нины расположение важнее современного оборудования.",
      ],
      [
        "reading",
        "Когда Нина хочет тренироваться?",
        ["Рано утром", "После работы", "Только по выходным"],
        "Рано утром",
        "Она хочет приходить раньше, когда в зале тише.",
      ],
      [
        "listening",
        "Какое преимущество было у чёрного ноутбука?",
        ["Больший экран", "Меньший вес", "Более долгая батарея"],
        "Больший экран",
        "У чёрного ноутбука был larger screen.",
      ],
      [
        "listening",
        "Почему рассказчик купил серебряную модель?",
        ["Её легче носить", "Она мощнее", "Она имела самый большой экран"],
        "Её легче носить",
        "Рассказчик ежедневно ездит в колледж, поэтому важен вес.",
      ],
    ],
    writing: {
      prompt: "Сравни два места, сервиса или предмета и выбери один вариант.",
      minWords: 45,
      model:
        "I compared two cafés near my office. Green Cup is quieter and its coffee is cheaper. City Bean has a larger menu, but it is much more crowded. Green Cup is not as stylish as City Bean, yet it is better for work. I choose Green Cup because I can concentrate there.",
      checklist: [
        "Используй две сравнительные формы",
        "Добавь as ... as или not as ... as",
        "Объясни свой выбор",
      ],
    },
    speaking: {
      prompt: "Помоги другу выбрать между двумя вариантами транспорта.",
      model:
        "The bus is cheaper than the train, but the train is much faster. The bus is not as comfortable during rush hour. I think the train is the better choice if you need to arrive before nine.",
      checklist: [
        "Сравни цену и удобство",
        "Усиль одно сравнение much или a bit",
        "Дай ясную рекомендацию",
      ],
    },
  }),
  unit({
    id: "a2-04",
    level: "A2",
    title: "Сколько нам нужно",
    goal: "Правильно говорить о количестве и покупках.",
    theory:
      "Countable nouns сочетаются с many, a few, few; uncountable — с much, a little, little. Some обычно встречается в утверждениях и в вежливых предложениях, any — в вопросах и отрицаниях. A lot of подходит для обоих типов. Enough означает достаточное количество.",
    examples: [
      "We have a few tomatoes.",
      "There isn't much rice left.",
      "Could I have some water, please?",
    ],
    vocabulary: [
      { en: "amount", ru: "количество" },
      { en: "enough", ru: "достаточно" },
      { en: "receipt", ru: "чек" },
      { en: "change", ru: "сдача" },
      { en: "fresh", ru: "свежий" },
      { en: "packet", ru: "пачка" },
    ],
    reading:
      "Oleg is preparing lunch for six people. He has plenty of pasta but only a little cheese. There are a few onions in the cupboard, and there is no garlic. He makes a shopping list and checks it twice. At the market, he buys some fresh vegetables and two packets of cheese.",
    listening:
      "Good morning. I'd like to make vegetable soup tonight, but I don't have many ingredients. I need some carrots, a few potatoes and a small cabbage. Do you have any fresh beans? Great, I'll take half a kilo. I don't need much oil because there is enough at home. Please add a loaf of bread as well. Can I pay by card? Thank you. Oh, could I have the receipt, please? I need it for our shared household budget.",
    questions: [
      [
        "grammar",
        "There are ___ apples left, so we can make a pie.",
        ["a few", "a little", "much"],
        "a few",
        "Apples — исчисляемое существительное во множественном числе.",
      ],
      [
        "grammar",
        "We don't have ___ milk.",
        ["much", "many", "a few"],
        "much",
        "Milk — неисчисляемое существительное.",
      ],
      [
        "reading",
        "Чего у Олега мало?",
        ["Сыра", "Пасты", "Лука"],
        "Сыра",
        "В тексте сказано only a little cheese.",
      ],
      [
        "reading",
        "Сколько пачек сыра он купил?",
        ["Две", "Одну", "Шесть"],
        "Две",
        "На рынке он покупает two packets of cheese.",
      ],
      [
        "listening",
        "Какой продукт покупатель не просит?",
        ["Рис", "Морковь", "Хлеб"],
        "Рис",
        "В списке есть овощи, фасоль и хлеб, но нет риса.",
      ],
      [
        "listening",
        "Зачем нужен чек?",
        ["Для общего бюджета", "Для возврата хлеба", "Для рецепта"],
        "Для общего бюджета",
        "Покупатель ведёт shared household budget.",
      ],
    ],
    writing: {
      prompt: "Составь сообщение соседу со списком продуктов и количеством.",
      minWords: 40,
      model:
        "Hi! We have enough pasta, but there isn't much tomato sauce. Could you buy some sauce, a few mushrooms and two onions? We also need a little cheese. There is no need to buy bread because I got a fresh loaf this morning. Please keep the receipt.",
      checklist: [
        "Различай many/much или a few/a little",
        "Используй some или any",
        "Укажи минимум три продукта",
      ],
    },
    speaking: {
      prompt: "Разыграй разговор покупателя и продавца на рынке.",
      model:
        "I'd like some fresh tomatoes, please. — How many would you like? — Six, please. Do you have any green peppers? — Yes. — Great, I'll take a few. That's enough, thank you.",
      checklist: ["Вежливо попроси товар", "Уточни количество", "Заверши покупку"],
    },
  }),
  unit({
    id: "a2-05",
    level: "A2",
    title: "Планы и прогнозы",
    goal: "Говорить о решениях, планах и договорённостях в будущем.",
    theory:
      "Will подходит для решения в момент речи, обещания и прогноза-мнения. Be going to выражает намерение или прогноз по видимым признакам. Present Continuous описывает уже организованную договорённость с временем или местом.",
    examples: [
      "I'll answer the phone.",
      "We are going to repaint the kitchen.",
      "I'm meeting the guide at ten tomorrow.",
    ],
    vocabulary: [
      { en: "arrangement", ru: "договорённость" },
      { en: "intend", ru: "намереваться" },
      { en: "probably", ru: "вероятно" },
      { en: "schedule", ru: "расписание" },
      { en: "cancel", ru: "отменять" },
      { en: "confirm", ru: "подтверждать" },
    ],
    reading:
      "Sofia is organising her weekend. On Saturday morning, she is meeting a designer to discuss her kitchen. She is going to choose new colours, but she has not decided which ones yet. In the afternoon, she thinks she will visit her parents. If they are busy, she will stay home and plan the work.",
    listening:
      "Hi, Anton. Our Saturday plan has changed. The weather report says it is going to rain heavily, so we aren't cycling to the lake. I have booked two places at the science museum instead. We are meeting outside the main entrance at eleven. I think the new space exhibition will be interesting. After that, we'll probably have lunch nearby. Please text me tonight to confirm. If you cannot come, I'll invite my cousin because the tickets cannot be returned.",
    questions: [
      [
        "grammar",
        "Look at those clouds! It ___ rain.",
        ["is going to", "will to", "is raining tomorrow"],
        "is going to",
        "Видимый признак служит основанием для be going to.",
      ],
      [
        "grammar",
        "I ___ the dentist at three; the appointment is booked.",
        ["am seeing", "will see perhaps", "see yesterday"],
        "am seeing",
        "Организованную договорённость выражаем Present Continuous.",
      ],
      [
        "reading",
        "Что София точно делает утром в субботу?",
        ["Встречается с дизайнером", "Едет к родителям", "Красит кухню"],
        "Встречается с дизайнером",
        "У неё назначена встреча с дизайнером.",
      ],
      [
        "reading",
        "Что она ещё не решила?",
        ["Цвета кухни", "День встречи", "Нужен ли дизайнер"],
        "Цвета кухни",
        "Она собирается выбрать цвета, но ещё не решила какие.",
      ],
      [
        "listening",
        "Почему отменили поездку на велосипедах?",
        ["Ожидается сильный дождь", "Озеро закрыто", "Антон занят"],
        "Ожидается сильный дождь",
        "Прогноз сообщает о сильном дожде.",
      ],
      [
        "listening",
        "Что произойдёт, если Антон не сможет прийти?",
        ["Позовут двоюродного брата", "Вернут билеты", "Пойдут к озеру"],
        "Позовут двоюродного брата",
        "Билеты невозвратные, поэтому пригласят родственника.",
      ],
    ],
    writing: {
      prompt: "Напиши другу о планах на выходные: договорённость, намерение и возможное решение.",
      minWords: 50,
      model:
        "I'm meeting my sister at the station on Saturday morning. We are going to explore the old town and try a new café. The forecast looks good, so I think we'll walk most of the day. If we get tired, I'll call a taxi. Are you free on Sunday afternoon?",
      checklist: [
        "Используй Present Continuous для договорённости",
        "Добавь be going to для намерения",
        "Добавь will для решения или прогноза",
      ],
    },
    speaking: {
      prompt: "Согласуй с партнёром общий план на свободный вечер.",
      model:
        "I'm finishing work at six. Shall we meet at half past six? We could try the new café. It is going to be warm, so we can sit outside. I'll book a table if you agree.",
      checklist: ["Предложи время и место", "Отреагируй на предложение", "Подтверди итоговый план"],
    },
  }),
  unit({
    id: "a2-06",
    level: "A2",
    title: "Нужно, можно, стоит",
    goal: "Выражать обязанность, запрет, отсутствие необходимости и совет.",
    theory:
      "Must и have to выражают необходимость; have to часто связано с внешним правилом. Mustn't означает запрет, а don't have to — отсутствие необходимости. Should/shouldn't дают совет. После модального глагола идёт базовая форма без to.",
    examples: [
      "You must wear a seat belt.",
      "We don't have to bring towels.",
      "You should rest today.",
    ],
    vocabulary: [
      { en: "rule", ru: "правило" },
      { en: "required", ru: "обязательный" },
      { en: "allowed", ru: "разрешённый" },
      { en: "advice", ru: "совет" },
      { en: "avoid", ru: "избегать" },
      { en: "permission", ru: "разрешение" },
    ],
    reading:
      "The community workshop has simple rules. Visitors must wear closed shoes and safety glasses. They mustn't use a machine without training. Members don't have to bring tools because everything is provided. Beginners should ask a supervisor before starting a project, and everyone should clean the table after work.",
    listening:
      "Welcome to the mountain hostel. You have to leave outdoor shoes by the entrance, but you don't have to bring your own slippers. Guests mustn't cook in the bedrooms because it is dangerous. You can use the shared kitchen until ten in the evening. If you plan to hike tomorrow, you should take enough water and check the weather board. You shouldn't walk alone after dark. For help, call reception by pressing zero on the phone in your room.",
    questions: [
      [
        "grammar",
        "You ___ touch that wire; it is dangerous.",
        ["mustn't", "don't have to", "should"],
        "mustn't",
        "Mustn't выражает строгий запрет.",
      ],
      [
        "grammar",
        "Breakfast is included, so you ___ pay extra.",
        ["don't have to", "mustn't", "have to"],
        "don't have to",
        "Оплата не нужна, но не запрещена грамматически.",
      ],
      [
        "reading",
        "Что выдают в мастерской?",
        ["Инструменты", "Закрытую обувь", "Готовые проекты"],
        "Инструменты",
        "Посетителям не нужно приносить инструменты: всё предоставлено.",
      ],
      [
        "reading",
        "К кому должен обратиться новичок?",
        ["К руководителю", "К другому новичку", "К кассиру"],
        "К руководителю",
        "Beginners should ask a supervisor.",
      ],
      [
        "listening",
        "Где нельзя готовить?",
        ["В спальнях", "На общей кухне", "До десяти вечера"],
        "В спальнях",
        "Готовить в спальнях запрещено из-за опасности.",
      ],
      [
        "listening",
        "Как связаться с рецепцией?",
        ["Нажать ноль на телефоне", "Позвонить по мобильному номеру", "Подойти только утром"],
        "Нажать ноль на телефоне",
        "Инструкция прямо говорит press zero.",
      ],
    ],
    writing: {
      prompt: "Напиши правила и советы для гостя в твоём доме или городе.",
      minWords: 40,
      model:
        "You have to use the key card to enter the building. You mustn't make loud noise after eleven. You don't have to remove your shoes, but you should keep the hall clean. If you travel by bus, you should buy a transport card because it is cheaper.",
      checklist: [
        "Добавь обязанность",
        "Различи запрет и отсутствие необходимости",
        "Дай минимум один совет",
      ],
    },
    speaking: {
      prompt: "Друг плохо себя чувствует. Дай совет и уточни симптомы.",
      model:
        "You should stay home and drink water. You shouldn't exercise today. Do you have a high temperature? If you do, you should call a doctor. You don't have to answer work messages now; rest is more important.",
      checklist: ["Задай вопрос о состоянии", "Дай два совета", "Не ставь диагноз"],
    },
  }),
  unit({
    id: "a2-07",
    level: "A2",
    title: "Условия и последствия",
    goal: "Говорить об общих правилах и реальных будущих условиях.",
    theory:
      "Zero Conditional описывает факт или постоянный результат: if + Present Simple, Present Simple. First Conditional выражает реальную будущую возможность: if + Present Simple, will + verb. После if в этих моделях не ставим will. Части предложения можно менять местами.",
    examples: [
      "If you heat ice, it melts.",
      "If the shop is open, I'll buy the charger.",
      "We will take a taxi if we miss the bus.",
    ],
    vocabulary: [
      { en: "condition", ru: "условие" },
      { en: "result", ru: "результат" },
      { en: "unless", ru: "если не" },
      { en: "charge", ru: "заряжать" },
      { en: "waste", ru: "тратить впустую" },
      { en: "save", ru: "экономить" },
    ],
    reading:
      "Dana is trying to waste less energy. If she leaves a room, she turns off the light. If the weather is cold, she closes the curtains in the evening. This weekend, she will buy smart plugs if the electronics shop has a discount. If they are too expensive, she will order simple timers online.",
    listening:
      "Here is our plan for the beach clean-up. If the weather is dry, we will meet beside the west car park at nine. If it rains heavily, the event will move to Sunday. Please bring gloves if you have them. We will provide bags and drinking water. When a bag is full, leave it beside the blue sign. If you find glass, don't touch it with bare hands; call a team leader. We usually finish by noon if everyone arrives on time.",
    questions: [
      [
        "grammar",
        "If water reaches zero degrees, it ___.",
        ["freezes", "will freeze always", "freeze"],
        "freezes",
        "Общий факт выражается Zero Conditional: Present + Present.",
      ],
      [
        "grammar",
        "If I finish early, I ___ you.",
        ["will call", "call yesterday", "will called"],
        "will call",
        "Реальное будущее условие требует will в главной части.",
      ],
      [
        "reading",
        "Что Дана делает, выходя из комнаты?",
        ["Выключает свет", "Закрывает шторы", "Покупает таймер"],
        "Выключает свет",
        "Это её постоянная привычка для экономии энергии.",
      ],
      [
        "reading",
        "Когда она купит умные розетки?",
        ["Если будет скидка", "Если магазин закрыт", "Если они будут дороже"],
        "Если будет скидка",
        "Покупка зависит от скидки в магазине.",
      ],
      [
        "listening",
        "Что будет при сильном дожде?",
        ["Уборку перенесут на воскресенье", "Встреча начнётся позже", "Все встретятся в помещении"],
        "Уборку перенесут на воскресенье",
        "Heavy rain переносит событие на Sunday.",
      ],
      [
        "listening",
        "Что делать с найденным стеклом?",
        ["Позвать руководителя", "Взять голыми руками", "Положить в карман"],
        "Позвать руководителя",
        "Инструкция запрещает трогать стекло без защиты.",
      ],
    ],
    writing: {
      prompt: "Составь пять правил «если — результат» для полезной привычки или мероприятия.",
      minWords: 45,
      model:
        "If I plan my meals, I waste less food. If vegetables get old, I make soup. Tomorrow, if I have time, I will prepare lunch for two days. If my friend visits, we will cook together. If we cook too much, I will freeze the extra food.",
      checklist: [
        "Добавь два Zero Conditional",
        "Добавь два First Conditional",
        "После if используй Present Simple",
      ],
    },
    speaking: {
      prompt: "Обсуди план прогулки при разных погодных условиях.",
      model:
        "If it is sunny, we'll walk by the river. If it rains, we'll visit the local museum. The museum closes early if it is a public holiday, so we should check its website. What will we do if both places are busy?",
      checklist: [
        "Предложи два условия",
        "Спроси партнёра об альтернативе",
        "Согласуйте итоговый вариант",
      ],
    },
  }),
  unit({
    id: "a2-08",
    level: "A2",
    title: "Путешествие без стресса",
    goal: "Решать типичные задачи в дороге и уточнять информацию.",
    theory:
      "Вежливые вопросы часто начинаются с Could you tell me...? и Do you know...? После вводной части сохраняется прямой порядок слов: Could you tell me where platform six is? Для просьб используем Could I...? или Can I...?",
    examples: [
      "Could you tell me where the bus stop is?",
      "Do you know what time the gate closes?",
      "Could I change my seat?",
    ],
    vocabulary: [
      { en: "platform", ru: "платформа" },
      { en: "departure", ru: "отправление" },
      { en: "delay", ru: "задержка" },
      { en: "luggage", ru: "багаж" },
      { en: "single ticket", ru: "билет в одну сторону" },
      { en: "connection", ru: "пересадка" },
    ],
    reading:
      "Ilya's train to Oxford was delayed by thirty minutes. He had a connection in Reading, so he asked an employee for help. The employee checked the schedule and found a later local train. Ilya did not need a new ticket. He reached Oxford one hour late, but his luggage and reservation were fine.",
    listening:
      "Attention, passengers travelling to Brighton. The twelve fifteen service will now leave from platform nine, not platform six. Departure is delayed by twenty minutes because of a technical check. Passengers for Gatwick Airport can remain on this train. If you need step-free access or help with luggage, please speak to staff beside the ticket office. The café on platform nine is closed today, but drinks and snacks are available from the machine near the lift. We apologise for the change.",
    questions: [
      [
        "grammar",
        "Could you tell me where the ticket office ___?",
        ["is", "is it", "does be"],
        "is",
        "В косвенном вопросе используется прямой порядок слов.",
      ],
      [
        "grammar",
        "___ I leave my luggage here for an hour?",
        ["Could", "Must", "Should to"],
        "Could",
        "Could I...? — вежливая просьба о разрешении.",
      ],
      [
        "reading",
        "Почему Илья беспокоился?",
        ["У него была пересадка", "Он потерял билет", "У него не было багажа"],
        "У него была пересадка",
        "Задержка могла повлиять на connection в Reading.",
      ],
      [
        "reading",
        "Понадобился ли ему новый билет?",
        ["Нет", "Да", "Текст не сообщает"],
        "Нет",
        "Сотрудник нашёл другой поезд без замены билета.",
      ],
      [
        "listening",
        "С какой платформы отправится поезд?",
        ["С девятой", "С шестой", "С двенадцатой"],
        "С девятой",
        "Объявление меняет platform six на platform nine.",
      ],
      [
        "listening",
        "Где можно купить напиток?",
        ["В автомате возле лифта", "В закрытом кафе", "В билетной кассе"],
        "В автомате возле лифта",
        "Кафе закрыто, но рядом с лифтом работает автомат.",
      ],
    ],
    writing: {
      prompt: "Напиши сообщение хозяину жилья: сообщи о задержке и задай два вежливых вопроса.",
      minWords: 50,
      model:
        "Hello Maria, my train has been delayed, so I will arrive at about nine. I'm sorry for the change. Could you tell me where I can collect the key? Do you know whether the airport bus stops near the flat? I have one small suitcase and can call you when I arrive.",
      checklist: [
        "Объясни причину задержки",
        "Задай два косвенных вопроса",
        "Сообщи новое время прибытия",
      ],
    },
    speaking: {
      prompt: "Разыграй разговор на вокзале после изменения платформы.",
      model:
        "Excuse me, could you tell me where platform nine is? — Go through the hall and take the lift. — Thank you. Do you know if the train still stops at the airport? — Yes, it does.",
      checklist: [
        "Вежливо привлеки внимание",
        "Уточни место и маршрут",
        "Переспроси важную деталь",
      ],
    },
  }),
  unit({
    id: "a2-09",
    level: "A2",
    title: "Здоровье и самочувствие",
    goal: "Описывать симптомы, длительность проблемы и понимать безопасные рекомендации.",
    theory:
      "Для симптомов используем have/feel: I have a headache; I feel dizzy. Present Perfect с for/since показывает, как долго состояние продолжается: I've had this cough for three days. Следует отличать совет should от необходимости have to.",
    examples: [
      "I've had a sore throat since Monday.",
      "I feel tired and a little dizzy.",
      "You should rest, but you have to call if it gets worse.",
    ],
    vocabulary: [
      { en: "symptom", ru: "симптом" },
      { en: "sore throat", ru: "больное горло" },
      { en: "dizzy", ru: "испытывающий головокружение" },
      { en: "appointment", ru: "приём" },
      { en: "improve", ru: "улучшаться" },
      { en: "medicine", ru: "лекарство" },
    ],
    reading:
      "Katya has felt tired since Tuesday and has had a sore throat for two days. She called the clinic instead of going to work. The nurse asked about her temperature and breathing. Katya did not have serious symptoms, so the nurse arranged an appointment for the afternoon and advised her to rest and drink water.",
    listening:
      "Hello, this is a message for Mr Reed from Park Clinic. Your appointment is at two forty-five tomorrow, not two fifteen. Please arrive ten minutes early and bring a list of any medicine you take. You can eat normally before the appointment. If your breathing becomes difficult before tomorrow, do not wait for the appointment; contact emergency services. To confirm the new time, press one. To choose another day, press two and our receptionist will call you back this afternoon.",
    questions: [
      [
        "grammar",
        "I've had this pain ___ three days.",
        ["for", "since", "from"],
        "for",
        "For используется с периодом времени.",
      ],
      [
        "grammar",
        "She has felt ill ___ Monday.",
        ["since", "for", "during three days"],
        "since",
        "Since вводит начальную точку периода.",
      ],
      [
        "reading",
        "Почему Катя позвонила в клинику?",
        ["Она устала и у неё болело горло", "Она потеряла лекарство", "Ей было трудно дышать"],
        "Она устала и у неё болело горло",
        "Именно эти два симптома названы в начале текста.",
      ],
      [
        "reading",
        "Когда назначили приём?",
        ["Во второй половине дня", "На следующую неделю", "Ночью"],
        "Во второй половине дня",
        "Nurse arranged an appointment for the afternoon.",
      ],
      [
        "listening",
        "Какое новое время приёма?",
        ["2:45", "2:15", "1:45"],
        "2:45",
        "Сообщение исправляет время с 2:15 на 2:45.",
      ],
      [
        "listening",
        "Что сделать при затруднённом дыхании?",
        ["Обратиться в экстренную службу", "Ждать приёма", "Нажать два"],
        "Обратиться в экстренную службу",
        "Сообщение просит не ждать приёма при таком симптоме.",
      ],
    ],
    writing: {
      prompt: "Напиши в клинику короткое описание проблемы и попроси записать тебя на приём.",
      minWords: 45,
      model:
        "Hello. I've had a bad cough for four days, and I have felt tired since yesterday. I don't have a high temperature, but the cough is not improving. Could I make an appointment for tomorrow afternoon? Please let me know what time is available tomorrow.",
      checklist: [
        "Назови два симптома",
        "Укажи длительность через for или since",
        "Вежливо попроси о приёме",
      ],
    },
    speaking: {
      prompt:
        "Разыграй звонок в клинику: один человек описывает состояние, другой уточняет детали.",
      model:
        "I've had a headache since this morning. — Do you feel dizzy? — A little, but I can walk normally. — You should rest and drink water. If it gets worse, call us again.",
      checklist: [
        "Опиши длительность",
        "Задай два уточняющих вопроса",
        "Дай осторожную рекомендацию",
      ],
    },
  }),
  unit({
    id: "a2-10",
    level: "A2",
    title: "Покупка, обмен и возврат",
    goal: "Объяснять проблему с товаром и договариваться о решении.",
    theory:
      "Для недавнего результата используем Present Perfect: The screen has stopped working. Для деталей покупки — Past Simple: I bought it on Friday. Вежливое требование можно смягчить: I'd like to exchange it. Could I get a refund?",
    examples: [
      "The zip has broken.",
      "I bought this jacket two days ago.",
      "Could I exchange it for a smaller size?",
    ],
    vocabulary: [
      { en: "refund", ru: "возврат денег" },
      { en: "exchange", ru: "обмен" },
      { en: "faulty", ru: "неисправный" },
      { en: "size", ru: "размер" },
      { en: "warranty", ru: "гарантия" },
      { en: "proof of purchase", ru: "подтверждение покупки" },
    ],
    reading:
      "Artem ordered headphones online. They arrived on Monday, but the left side had no sound. He charged them and tested them with another phone, but the problem continued. Artem contacted support and attached his order number. The company offered a free replacement and sent a return label.",
    listening:
      "Customer: Hi, I bought this lamp here on Saturday, but it has stopped working. Assistant: I'm sorry about that. Have you changed the bulb? Customer: Yes, and I tested the plug too. Assistant: Do you have proof of purchase? Customer: The receipt is in my banking app. I'd like an exchange, please. Assistant: That's fine. We have the same model in blue, but the white one is out of stock. Customer: Blue is fine. Assistant: Great. The new lamp keeps the original two-year warranty.",
    questions: [
      [
        "grammar",
        "The handle ___, so I can't use the bag.",
        ["has broken", "broke last year", "has break"],
        "has broken",
        "Важен нынешний результат недавней поломки.",
      ],
      [
        "grammar",
        "I ___ it online last Tuesday.",
        ["ordered", "have ordered", "order"],
        "ordered",
        "Указанное законченное время требует Past Simple.",
      ],
      [
        "reading",
        "Какая часть наушников не работала?",
        ["Левая", "Правая", "Зарядное устройство"],
        "Левая",
        "В тексте сказано the left side had no sound.",
      ],
      [
        "reading",
        "Какое решение предложила компания?",
        ["Бесплатную замену", "Только скидку", "Ремонт за деньги"],
        "Бесплатную замену",
        "Support offered a free replacement.",
      ],
      [
        "listening",
        "Где находится чек покупателя?",
        ["В банковском приложении", "В коробке", "В магазине"],
        "В банковском приложении",
        "Покупатель показывает цифровое подтверждение покупки.",
      ],
      [
        "listening",
        "Какого цвета будет новая лампа?",
        ["Синяя", "Белая", "Чёрная"],
        "Синяя",
        "Белой нет в наличии, покупатель соглашается на синюю.",
      ],
    ],
    writing: {
      prompt: "Напиши в поддержку о неисправном товаре и предложи желаемое решение.",
      minWords: 50,
      model:
        "Hello. I ordered a travel bag from your website last week. It arrived yesterday, but the zip has already broken. I have tested it carefully and cannot close the bag. My order number is 4182. Could I exchange it for the same model, or receive a refund if it is unavailable?",
      checklist: [
        "Укажи, когда купил товар",
        "Опиши нынешнюю проблему",
        "Попроси обмен или возврат",
      ],
    },
    speaking: {
      prompt: "Разыграй разговор в магазине о неподходящем товаре.",
      model:
        "I'd like to exchange these shoes. I bought them yesterday, but they are too small. — Do you have the receipt? — Yes. Could I try the next size? — Certainly. We have it in black.",
      checklist: [
        "Чётко назови проблему",
        "Покажи подтверждение покупки",
        "Договорись о конкретном решении",
      ],
    },
  }),
  unit({
    id: "a2-11",
    level: "A2",
    title: "Сообщения и договорённости",
    goal: "Передавать просьбы, изменения и важные детали в коротких сообщениях.",
    theory:
      "В сообщении важно сначала назвать цель, затем детали и нужное действие. Can/Could you...? выражает просьбу. Для передачи информации используем say + сообщение или tell + человек: Anna said the meeting was online; Anna told me the meeting was online.",
    examples: [
      "Could you send me the address?",
      "Mila said the shop was closed.",
      "He told us to wait outside.",
    ],
    vocabulary: [
      { en: "remind", ru: "напоминать" },
      { en: "forward", ru: "пересылать" },
      { en: "available", ru: "доступный, свободный" },
      { en: "update", ru: "обновление" },
      { en: "attachment", ru: "вложение" },
      { en: "reply", ru: "отвечать" },
    ],
    reading:
      "Hi team, tomorrow's training has moved from Room 4 to Room 12 because the projector is broken. The start time is still 10:30. Please bring the worksheet I sent yesterday; you do not need to print the slides. Reply before 6 p.m. if you cannot attend, so I can send you the recording later.",
    listening:
      "Hi Vera, it's Denis. I'm calling about our dinner tonight. The restaurant phoned and said our table would only be ready at eight, not seven thirty. Could you tell Alex about the change? I don't have his new number. I'll meet you both beside the main entrance at ten to eight. Please don't wait inside because the booking is under my name. If Alex cannot come, send me a message before seven so I can change the reservation.",
    questions: [
      [
        "grammar",
        "Nina ___ me the class was cancelled.",
        ["told", "said", "told to"],
        "told",
        "Tell употребляется с дополнением: told me.",
      ],
      [
        "grammar",
        "Could you ___ this email to Pavel?",
        ["forward", "to forward", "forwarded"],
        "forward",
        "После could используется базовая форма глагола.",
      ],
      [
        "reading",
        "Почему изменили аудиторию?",
        ["Сломался проектор", "Занят преподаватель", "Нет рабочих листов"],
        "Сломался проектор",
        "Причина прямо указана в первом предложении.",
      ],
      [
        "reading",
        "Что нужно сделать, если не можешь прийти?",
        ["Ответить до шести", "Позвонить после занятия", "Распечатать слайды"],
        "Ответить до шести",
        "Так организатор успеет прислать запись.",
      ],
      [
        "listening",
        "Во сколько теперь готов столик?",
        ["В восемь", "В семь тридцать", "Без десяти восемь"],
        "В восемь",
        "Ресторан перенёс готовность столика на eight.",
      ],
      [
        "listening",
        "Почему Вера должна сообщить Алексу?",
        ["У Дениса нет его нового номера", "Алекс сделал бронь", "Вера работает в ресторане"],
        "У Дениса нет его нового номера",
        "Денис прямо объясняет отсутствие нового номера.",
      ],
    ],
    writing: {
      prompt: "Напиши группе об изменении встречи: причина, новые детали и нужное действие.",
      minWords: 45,
      model:
        "Hi everyone. Our study meeting has moved to Thursday because the library closes early on Wednesday. We are meeting in the café opposite the station at 6:30. Could you bring your vocabulary notes? Please reply by tomorrow if you are not available, and I will send another time option.",
      checklist: [
        "Сразу назови изменение",
        "Укажи причину и новые детали",
        "Попроси подтвердить участие",
      ],
    },
    speaking: {
      prompt: "Передай партнёру телефонное сообщение для третьего человека.",
      model:
        "Olga called about tomorrow. She said the bus would leave at nine instead of nine thirty. She asked us to meet outside the hotel fifteen minutes early. Could you tell Mark? I don't have his number.",
      checklist: ["Назови отправителя", "Передай время и место", "Сформулируй просьбу получателю"],
    },
  }),
  unit({
    id: "a2-12",
    level: "A2",
    title: "Практическая миссия A2",
    goal: "Объединить прошлое, планы, условия, сравнения и вежливые просьбы в бытовой задаче.",
    theory:
      "Перед реальной задачей выбери временную линию: что уже произошло, что происходит и что планируется. Затем уточни условие и нужное действие. Для ясности используй короткие абзацы и связки first, then, because, if, finally.",
    examples: [
      "Our original train was cancelled, so we booked a later one.",
      "If we arrive before six, we'll collect the keys today.",
      "Could you tell us which entrance is easier to find?",
    ],
    vocabulary: [
      { en: "alternative", ru: "альтернатива" },
      { en: "solution", ru: "решение" },
      { en: "confirm", ru: "подтверждать" },
      { en: "available", ru: "доступный" },
      { en: "entrance", ru: "вход" },
      { en: "arrange", ru: "организовывать" },
    ],
    reading:
      "Maya and Kirill planned a weekend in York. Their first train was cancelled, so they booked a later service. The new train is cheaper but much slower. They have told the host about the change. If they arrive before reception closes, they will collect the key there; otherwise, the host will leave it in a secure box.",
    listening:
      "Hello Maya, this is Tom from River Guesthouse. I've received your message about the cancelled train. Don't worry: you don't have to arrive before reception closes. If you get here after nine, use the side entrance beside the bakery. I will send the key-box code at eight this evening. Your room is on the second floor, but there is a lift for your luggage. Breakfast starts at seven thirty. If you need a late breakfast, tell us tonight and we will prepare a takeaway bag.",
    questions: [
      [
        "grammar",
        "If they arrive late, the host ___ the key in a box.",
        ["will leave", "leaves yesterday", "will left"],
        "will leave",
        "Реальное будущее условие строится через First Conditional.",
      ],
      [
        "grammar",
        "The new train is ___ than the first one.",
        ["slower", "more slow", "slowest"],
        "slower",
        "Короткое прилагательное slow образует comparative с -er.",
      ],
      [
        "reading",
        "Что случилось с первым поездом?",
        ["Его отменили", "Он был быстрее", "Он приехал раньше"],
        "Его отменили",
        "Путешественники забронировали другой поезд после отмены.",
      ],
      [
        "reading",
        "Где будет ключ при позднем приезде?",
        ["В защищённом боксе", "В пекарне", "В поезде"],
        "В защищённом боксе",
        "Это запасной вариант после закрытия рецепции.",
      ],
      [
        "listening",
        "Когда Том отправит код?",
        ["В восемь вечера", "После девяти", "В семь тридцать утра"],
        "В восемь вечера",
        "Он обещает send the key-box code at eight.",
      ],
      [
        "listening",
        "Что можно заказать при позднем завтраке?",
        ["Пакет еды с собой", "Ужин в номер", "Новую комнату"],
        "Пакет еды с собой",
        "Гостевой дом подготовит takeaway bag.",
      ],
    ],
    writing: {
      prompt:
        "Напиши хозяину жилья после изменения дороги: объясни ситуацию, сообщи план и задай вопросы.",
      minWords: 55,
      model:
        "Hello Tom. Our first train was cancelled, so we have booked the 6:20 service. It is slower, and we will probably arrive at about 9:15. If the train is delayed again, I will text you. Could you confirm where the side entrance is? We have two suitcases, so could you also tell me whether the lift works at night?",
      checklist: [
        "Свяжи прошлое и будущий план",
        "Добавь условие с if",
        "Задай два вежливых вопроса",
      ],
    },
    speaking: {
      prompt:
        "Реши с партнёром проблему поездки: транспорт отменили, бюджет ограничен, прибытие позднее.",
      model:
        "The train has been cancelled. The coach is cheaper, but it is much slower. If we take it, we'll arrive after reception closes. Let's message the host first and ask about late check-in. If that is possible, the coach is our best option.",
      checklist: [
        "Сравни два решения",
        "Обсуди условие и последствие",
        "Согласуй конкретное следующее действие",
      ],
    },
  }),
];

const b1Units: PathUnit[] = [
  unit({
    id: "b1-01",
    level: "B1",
    title: "История с фоном и поворотом",
    goal: "Строить связный рассказ с фоном, последовательностью событий и более ранним прошлым.",
    theory:
      "Past Continuous создаёт фон, Past Simple двигает сюжет, а Past Perfect (had + V3) показывает действие, завершившееся раньше другого прошлого события. Past Perfect нужен там, где порядок не очевиден; последовательные события обычно остаются в Past Simple.",
    examples: [
      "The wind was blowing when we left the cabin.",
      "I realised that I had left the map inside.",
      "We turned back, found the map and continued our walk.",
    ],
    vocabulary: [
      { en: "set off", ru: "отправляться" },
      { en: "realise", ru: "осознавать" },
      { en: "eventually", ru: "в конце концов" },
      { en: "shelter", ru: "укрытие" },
      { en: "track", ru: "тропа" },
      { en: "turn back", ru: "повернуть назад" },
    ],
    reading:
      "Leah was cycling through the countryside when the sky suddenly became dark. She had checked the forecast before leaving, but the storm had developed quickly. As rain began to fall, she noticed an empty bus shelter beside the road. She stopped there and called her brother. By the time he arrived, the rain had ended, and a bright rainbow had appeared over the fields.",
    listening:
      "Last autumn, three friends set off for a hill walk. The sun was shining, although it had rained heavily the night before. After an hour, they reached a stream that was much wider than usual. One friend wanted to cross, but Marta noticed that the wooden bridge had been damaged. While they were discussing another route, an experienced walker came along. He explained that a safe path went around the hill. They followed his advice and eventually reached the top. The longer route added two hours, but it prevented a dangerous crossing. Later, they learned that park workers had closed the broken bridge that same afternoon for urgent safety repairs.",
    questions: [
      [
        "grammar",
        "When I reached the station, the train ___.",
        ["had left", "was leaving every day", "has left"],
        "had left",
        "Поезд ушёл раньше другого прошлого события.",
      ],
      [
        "grammar",
        "While we ___ the route, a ranger arrived.",
        ["were discussing", "had discussed tomorrow", "discuss"],
        "were discussing",
        "Длительный фон выражается Past Continuous.",
      ],
      [
        "reading",
        "Почему Лия удивилась буре?",
        ["Она проверила прогноз", "Она потеряла велосипед", "Брат предупредил её"],
        "Она проверила прогноз",
        "До выезда прогноз был проверен, но погода быстро изменилась.",
      ],
      [
        "reading",
        "Где она укрылась?",
        ["На автобусной остановке", "В магазине", "Под мостом"],
        "На автобусной остановке",
        "Она заметила empty bus shelter.",
      ],
      [
        "listening",
        "Почему друзья не воспользовались мостом?",
        ["Он был повреждён", "Он был слишком далеко", "За него требовали плату"],
        "Он был повреждён",
        "Марта заметила повреждение моста.",
      ],
      [
        "listening",
        "Что изменил совет прохожего?",
        ["Они выбрали безопасный длинный путь", "Они вернулись домой", "Они перешли реку вплавь"],
        "Они выбрали безопасный длинный путь",
        "Опытный турист указал обходной маршрут.",
      ],
    ],
    writing: {
      prompt: "Напиши историю о плане, который пришлось изменить.",
      minWords: 80,
      model:
        "We were driving to the coast when the car began to make a strange noise. I had checked it before the trip, so I was surprised. We stopped safely and called a local garage. While the mechanic was examining the engine, we found a café nearby. He eventually fixed a loose part, and we continued. We arrived late, but the delay taught us to keep an emergency number in the car. We also began checking unusual sounds before long journeys.",
      checklist: [
        "Создай фон через Past Continuous",
        "Покажи более раннее действие через Past Perfect",
        "Добавь поворот и ясный результат",
      ],
    },
    speaking: {
      prompt:
        "Расскажи партнёру о неожиданном происшествии; партнёр задаёт два уточняющих вопроса.",
      model:
        "I was travelling home when the bus stopped. The driver had noticed smoke near the engine, so everyone got off. We waited for another bus. Nobody was hurt, but I arrived an hour late.",
      checklist: [
        "Соблюдай временной порядок",
        "Используй три формы прошлого",
        "Ответь на уточняющие вопросы",
      ],
    },
  }),
  unit({
    id: "b1-02",
    level: "B1",
    title: "Как долго это продолжается",
    goal: "Различать результат и длительный процесс, начавшийся в прошлом.",
    theory:
      "Present Perfect Simple подчёркивает результат или количество: I have written three pages. Present Perfect Continuous (have/has been + -ing) показывает длительность или повторяющийся процесс: I have been writing for two hours. Глаголы состояния know, believe, own обычно не используются в Continuous.",
    examples: [
      "I've completed four lessons today.",
      "She's been practising pronunciation since breakfast.",
      "We've known each other for ten years.",
    ],
    vocabulary: [
      { en: "progress", ru: "прогресс" },
      { en: "concentrate", ru: "сосредоточиваться" },
      { en: "recently", ru: "в последнее время" },
      { en: "achievement", ru: "достижение" },
      { en: "routine", ru: "режим" },
      { en: "consistent", ru: "регулярный" },
    ],
    reading:
      "Pavel has been learning to draw for six months. He has completed two online courses and filled three sketchbooks. Recently, he has been practising faces because they are still difficult for him. His lines have become more confident, but he has not developed a personal style yet. He keeps a weekly record so he can see both effort and results.",
    listening:
      "I've been working from home since January, and my routine has changed several times. At first, I worked at the kitchen table and felt tired by midday. I have now created a small workspace beside the window and bought a proper chair. For the last month, I've been starting each day with a short plan. I've completed my tasks earlier on most days, and I have taken regular breaks instead of checking messages constantly. The biggest improvement is concentration: I have been using a timer for focused work, and interruptions have become less frequent. I still miss informal conversations, so I have arranged a weekly lunch with two colleagues nearby.",
    questions: [
      [
        "grammar",
        "She ___ all morning, and she needs a break.",
        ["has been studying", "has studied yesterday", "studies since"],
        "has been studying",
        "Важна длительность незавершённого процесса.",
      ],
      [
        "grammar",
        "We ___ five reports this week.",
        ["have finished", "have been finish", "finished since Monday"],
        "have finished",
        "Количество завершённых результатов требует Simple.",
      ],
      [
        "reading",
        "Как Павел отслеживает развитие?",
        ["Ведёт еженедельную запись", "Покупает новый курс", "Рисует только лица"],
        "Ведёт еженедельную запись",
        "Запись позволяет видеть усилия и результаты.",
      ],
      [
        "reading",
        "Чего он пока не выработал?",
        ["Личного стиля", "Уверенных линий", "Привычки рисовать"],
        "Личного стиля",
        "В тексте сказано has not developed a personal style yet.",
      ],
      [
        "listening",
        "Что помогло сосредоточиться?",
        ["Таймер для фокусной работы", "Работа на кухне", "Постоянная проверка сообщений"],
        "Таймер для фокусной работы",
        "Таймер связан с уменьшением отвлечений.",
      ],
      [
        "listening",
        "Как рассказчик поддерживает общение?",
        ["Еженедельно обедает с коллегами", "Каждый день ездит в офис", "Пишет пять отчётов"],
        "Еженедельно обедает с коллегами",
        "Организован weekly lunch.",
      ],
    ],
    writing: {
      prompt: "Опиши навык или привычку: длительность, действия и измеримый результат.",
      minWords: 80,
      model:
        "I have been improving my cooking for the last four months. I have tried twenty new recipes and learned five basic sauces. Recently, I have been planning meals before shopping, so I waste less food. I haven't mastered bread yet, but my soups have become much better. Keeping photos of each meal has helped me notice progress and choose what to practise next. I have also shared several meals with friends, and their specific comments have helped me adjust the seasoning.",
      checklist: [
        "Сравни процесс и результат",
        "Добавь for или since",
        "Назови измеримое достижение",
      ],
    },
    speaking: {
      prompt: "Проведи короткое интервью о долгом проекте.",
      model:
        "How long have you been working on it? — For three months. I've completed the research, but I've been rewriting the introduction this week. — What has improved most? — My structure is clearer now.",
      checklist: ["Задай how long", "Уточни результат", "Подведи итог прогрессу"],
    },
  }),
  unit({
    id: "b1-03",
    level: "B1",
    title: "Воображаемые решения",
    goal: "Обсуждать маловероятные ситуации и давать мягкие советы.",
    theory:
      "Second Conditional описывает воображаемую или маловероятную ситуацию: if + Past Simple, would + verb. Were допустимо со всеми лицами в более нейтральной форме: If I were you... Could и might выражают возможный результат.",
    examples: [
      "If I had more space, I would grow vegetables.",
      "If I were you, I'd speak to the manager.",
      "We might move if rent became too expensive.",
    ],
    vocabulary: [
      { en: "afford", ru: "позволить себе" },
      { en: "opportunity", ru: "возможность" },
      { en: "instead", ru: "вместо этого" },
      { en: "risk", ru: "риск" },
      { en: "consider", ru: "рассматривать" },
      { en: "priority", ru: "приоритет" },
    ],
    reading:
      "Ira has been offered a six-month project in another city. The work would be interesting, but she would need to leave her flat and live away from friends. If the company paid for accommodation, she would accept quickly. Without that support, she might spend most of the extra salary on rent. She is preparing questions before making a decision.",
    listening:
      "Imagine that your town gave every resident a small budget to improve the neighbourhood. What would you choose? I would create a shaded seating area near the bus station. Older people often wait there, but there are only two benches and no protection from rain. If we added a roof and better lighting, the space would feel safer in the evening. My neighbour would prefer a community garden. That could bring people together, although it would require regular volunteers. If we had enough money, we might combine both ideas by placing planters around the seating area. Before spending anything, I would ask local residents which problem affects them most today.",
    questions: [
      [
        "grammar",
        "If I ___ more time, I would volunteer.",
        ["had", "will have", "would have"],
        "had",
        "В if-части Second Conditional нужен Past Simple.",
      ],
      [
        "grammar",
        "If I were you, I ___ the offer carefully.",
        ["would consider", "considered yesterday", "will considered"],
        "would consider",
        "Воображаемый совет строится с would + base verb.",
      ],
      [
        "reading",
        "Что сильнее всего влияет на решение Иры?",
        ["Оплата жилья", "Длина проекта", "Количество друзей"],
        "Оплата жилья",
        "Без поддержки аренда съест дополнительный доход.",
      ],
      [
        "reading",
        "Что Ира делает до решения?",
        ["Готовит вопросы", "Уже переезжает", "Отказывается от проекта"],
        "Готовит вопросы",
        "Она собирает информацию перед выбором.",
      ],
      [
        "listening",
        "Какую проблему решает навес?",
        ["Ожидание транспорта в плохую погоду", "Недостаток магазинов", "Высокую аренду"],
        "Ожидание транспорта в плохую погоду",
        "У остановки нет защиты от дождя.",
      ],
      [
        "listening",
        "Что рассказчик сделал бы первым?",
        ["Спросил жителей", "Сразу построил сад", "Отменил бюджет"],
        "Спросил жителей",
        "Сначала нужно определить главную местную проблему.",
      ],
    ],
    writing: {
      prompt: "Выбери улучшение для района и объясни, что изменилось бы.",
      minWords: 80,
      model:
        "If I could change one place in my neighbourhood, I would improve the small park near the school. I would add lights and repair the paths because they become unsafe after rain. If there were more benches, parents and older residents could use the park comfortably. I might also create a separate cycling area. Before making a final plan, I would ask nearby residents about their priorities. If the budget were limited, I would repair the paths first because safety should be the main priority.",
      checklist: [
        "Используй три Second Conditional",
        "Объясни пользу и возможный риск",
        "Предложи способ узнать мнение людей",
      ],
    },
    speaking: {
      prompt: "Обсуди с партнёром, как потратить воображаемый общественный бюджет.",
      model:
        "I would improve the bus stops. — I might choose the library instead. — If the stops had shelters, more people would use public transport. — That's true. Could we divide the budget?",
      checklist: ["Предложи вариант", "Отреагируй на другую идею", "Найдите компромисс"],
    },
  }),
  unit({
    id: "b1-04",
    level: "B1",
    title: "Процессы и результаты",
    goal: "Использовать пассивный залог, когда важнее действие или результат.",
    theory:
      "Passive строится be + V3; время показывает форма be: is delivered, was built, has been repaired, will be announced. Исполнителя добавляем с by, только если он важен. Пассив удобен в инструкциях, новостях и описании процессов.",
    examples: [
      "The parcels are sorted every morning.",
      "The bridge was repaired last year.",
      "The results will be published on Friday.",
    ],
    vocabulary: [
      { en: "manufacture", ru: "производить" },
      { en: "deliver", ru: "доставлять" },
      { en: "process", ru: "обрабатывать" },
      { en: "inspect", ru: "проверять" },
      { en: "package", ru: "упаковывать" },
      { en: "recycle", ru: "перерабатывать" },
    ],
    reading:
      "At the local repair café, broken household items are examined by volunteers. Simple faults are fixed during the session, while difficult devices are sent to specialist workshops. No fee is charged, but donations are accepted. Last year, more than eight hundred items were repaired, and several tonnes of waste were kept out of landfill.",
    listening:
      "Coffee beans for this small company are grown by farming groups in three regions. After the beans are picked, they are dried naturally in the sun and checked for damage. They are then transported to a factory, where each batch is roasted separately. The temperature is monitored by computer, but the final quality is tested by trained staff. Once the beans have been approved, they are packed in recyclable bags. Orders received before noon are usually sent the same day. Customer comments are recorded and reviewed by the production team every month. Next year, a new electric delivery van will be introduced to reduce emissions within the city and nearby districts.",
    questions: [
      [
        "grammar",
        "The final decision ___ tomorrow.",
        ["will be announced", "will announce itself", "was announce"],
        "will be announced",
        "Будущий пассив: will be + V3.",
      ],
      [
        "grammar",
        "The old hall ___ into a library last year.",
        ["was converted", "has convert", "is converting by itself"],
        "was converted",
        "Завершённое прошлое пассивное действие: was + V3.",
      ],
      [
        "reading",
        "Кто проверяет вещи?",
        ["Волонтёры", "Покупатели", "Водители"],
        "Волонтёры",
        "Items are examined by volunteers.",
      ],
      [
        "reading",
        "Как финансируется сервис?",
        ["Добровольными пожертвованиями", "Обязательной платой", "Продажей новых устройств"],
        "Добровольными пожертвованиями",
        "Платы нет, но принимаются donations.",
      ],
      [
        "listening",
        "Где сушат зёрна?",
        ["На солнце", "В магазине", "В фургоне"],
        "На солнце",
        "После сбора beans are dried naturally in the sun.",
      ],
      [
        "listening",
        "Как планируют сократить городские выбросы?",
        ["Ввести электрический фургон", "Отказаться от доставки", "Использовать больше упаковки"],
        "Ввести электрический фургон",
        "Новый electric delivery van назван будущим изменением.",
      ],
    ],
    writing: {
      prompt: "Опиши процесс изготовления, ремонта или доставки предмета.",
      minWords: 80,
      model:
        "Used bicycles are collected from donation points across the city. First, each bike is inspected and unsafe parts are removed. The frames are cleaned, and damaged brakes are replaced by trained volunteers. After the bicycles have been tested, they are offered at a low price to local residents. Each buyer is also given a short safety guide and free basic fitting advice. Any metal that cannot be reused is sent for recycling, while usable spare parts are stored for future repairs.",
      checklist: [
        "Используй минимум четыре пассивные формы",
        "Покажи порядок этапов",
        "Укажи, что происходит с отходами или результатом",
      ],
    },
    speaking: {
      prompt: "Объясни посетителю, как обрабатывается его заказ или заявка.",
      model:
        "Your form is checked first. If information is missing, you will be contacted by email. Complete applications are reviewed within five days, and the result is then sent to your account.",
      checklist: ["Используй пассив", "Назови сроки", "Объясни условие при проблеме"],
    },
  }),
  unit({
    id: "b1-05",
    level: "B1",
    title: "Передаём чужие слова",
    goal: "Точно пересказывать сообщения, просьбы и вопросы.",
    theory:
      "В reported speech время часто сдвигается назад: am→was, have done→had done, will→would. Местоимения и слова времени меняются по ситуации. Просьбы передаются ask/tell + object + (not) to; вопросы — ask + if/where с прямым порядком слов.",
    examples: [
      "Mia said she was working from home.",
      "He asked me to send the file.",
      "They asked whether I could attend.",
    ],
    vocabulary: [
      { en: "mention", ru: "упоминать" },
      { en: "clarify", ru: "уточнять" },
      { en: "inform", ru: "информировать" },
      { en: "request", ru: "просьба" },
      { en: "according to", ru: "согласно" },
      { en: "deadline", ru: "срок" },
    ],
    reading:
      "During the team call, Sara said that the client had changed the deadline. She explained that the first draft was now needed on Thursday. Leo asked whether the design files were ready, and Sara told him to contact Maya. After the call, Leo wrote a summary so that absent colleagues would receive the same information.",
    listening:
      "This is a message for everyone joining Saturday's photography walk. The guide said that the meeting point had changed because the park entrance was being repaired. She asked us to meet outside the central library at nine fifteen. She also reminded us to charge our phones or cameras and said that tripods would not be necessary. One participant asked whether the walk would continue in light rain. The guide replied that it would, but she advised everyone to bring a waterproof jacket. If the weather becomes dangerous, she will send a cancellation message by seven thirty that morning. Please pass this information to anyone who missed the planning call today.",
    questions: [
      [
        "grammar",
        "‘I can't come today.’ He said he ___ that day.",
        ["couldn't come", "can't came", "wouldn't coming"],
        "couldn't come",
        "Can обычно сдвигается в could, today меняется по контексту.",
      ],
      [
        "grammar",
        "‘Please wait outside.’ She asked us ___.",
        ["to wait outside", "waited outside", "if wait outside"],
        "to wait outside",
        "Просьба передаётся ask + object + to-infinitive.",
      ],
      [
        "reading",
        "Почему изменился срок?",
        ["Так решил клиент", "Файлы потерялись", "Лео отсутствовал"],
        "Так решил клиент",
        "Sara сообщила о решении клиента.",
      ],
      [
        "reading",
        "Зачем Лео написал итог?",
        [
          "Чтобы все получили одинаковую информацию",
          "Чтобы отменить проект",
          "Чтобы изменить дизайн",
        ],
        "Чтобы все получили одинаковую информацию",
        "Итог предназначен отсутствующим коллегам.",
      ],
      [
        "listening",
        "Где новая точка встречи?",
        ["У центральной библиотеки", "У входа в парк", "На вокзале"],
        "У центральной библиотеки",
        "Ремонт входа заставил перенести сбор.",
      ],
      [
        "listening",
        "Когда придёт отмена при опасной погоде?",
        ["До 7:30 утра", "После 9:15", "В пятницу вечером"],
        "До 7:30 утра",
        "Гид отправит сообщение к 7:30 в день прогулки.",
      ],
    ],
    writing: {
      prompt: "Напиши отсутствующему коллеге итог разговора из трёх решений и одной просьбы.",
      minWords: 80,
      model:
        "Hi Dan. In today's call, Marta said that the launch had moved to Monday. She explained that the supplier needed one extra day. Tom asked whether the images were ready, and Marta said they would be uploaded tonight. She asked us to check all links before Friday afternoon. Leo also said that he had finished the mobile layout and would share it tomorrow. Please tell me if you cannot complete your section by then, so Marta can adjust the final schedule.",
      checklist: [
        "Передай утверждение со сдвигом времени",
        "Передай вопрос",
        "Передай просьбу через ask/tell + to",
      ],
    },
    speaking: {
      prompt: "Послушай условное сообщение партнёра и передай его третьему человеку.",
      model:
        "Nadia said that the room had changed. She asked us to meet upstairs and told me not to bring printed copies. She also asked whether you could arrive ten minutes early.",
      checklist: [
        "Сохрани ключевые факты",
        "Измени местоимения и время",
        "Попроси подтвердить понимание",
      ],
    },
  }),
  unit({
    id: "b1-06",
    level: "B1",
    title: "Уточняем, о ком и о чём речь",
    goal: "Соединять идеи определительными придаточными и добавлять пояснения.",
    theory:
      "Who относится к людям, which — к вещам, that возможно в ограничительных придаточных, where — к местам, whose — к принадлежности. Определяющая информация не отделяется запятыми. Дополнительная, без которой объект уже понятен, выделяется запятыми и не использует that.",
    examples: [
      "The neighbour who found my keys called me.",
      "This is the app that tracks my expenses.",
      "Our library, which opened in 1920, has been renovated.",
    ],
    vocabulary: [
      { en: "feature", ru: "функция, особенность" },
      { en: "resident", ru: "житель" },
      { en: "device", ru: "устройство" },
      { en: "accessible", ru: "доступный" },
      { en: "volunteer", ru: "волонтёр" },
      { en: "recommend", ru: "рекомендовать" },
    ],
    reading:
      "The Tool Library is a service where residents can borrow equipment for home projects. Members who join pay a small yearly fee. The collection includes drills, ladders and gardening tools that many people need only occasionally. Eva, whose flat has very little storage, uses the service regularly and recommends it to new neighbours.",
    listening:
      "Last month I visited North House, which is a community centre near the river. The building was once a factory where local furniture was made. Today it contains workshops, a café and a quiet room that students can use for free. I met Amir, who coordinates the volunteer programme. He explained that people whose first language is not English can join weekly conversation groups. There is also a repair team that helps residents fix small electrical devices. The centre's website, which was recently redesigned, lists all events and shows which rooms are accessible. I was especially impressed by the rooftop garden, where volunteers grow fresh herbs for the busy café.",
    questions: [
      [
        "grammar",
        "The woman ___ runs the workshop is an engineer.",
        ["who", "which", "where"],
        "who",
        "Who относится к человеку.",
      ],
      [
        "grammar",
        "My camera, ___ I bought in 2020, still works well.",
        ["which", "that is required", "where"],
        "which",
        "Дополнительная информация выделена запятыми; that здесь не используется.",
      ],
      [
        "reading",
        "Зачем людям библиотека инструментов?",
        ["Брать редко нужное оборудование", "Хранить мебель", "Учиться только садоводству"],
        "Брать редко нужное оборудование",
        "Сервис даёт доступ без покупки и хранения.",
      ],
      [
        "reading",
        "Почему Еве удобен сервис?",
        ["В квартире мало места", "Она владеет магазином", "Членство бесплатное"],
        "В квартире мало места",
        "Whose flat has very little storage объясняет причину.",
      ],
      [
        "listening",
        "Кем раньше было здание?",
        ["Фабрикой", "Школой", "Больницей"],
        "Фабрикой",
        "В нём производили мебель.",
      ],
      [
        "listening",
        "Какая помощь доступна изучающим английский?",
        ["Разговорные группы", "Бесплатные устройства", "Уроки садоводства"],
        "Разговорные группы",
        "Amir упоминает weekly conversation groups.",
      ],
    ],
    writing: {
      prompt: "Опиши полезное место или сервис, используя уточняющие придаточные.",
      minWords: 80,
      model:
        "The Green Room is a local centre where residents can learn practical skills. The volunteers who teach there have experience in cooking, repairs and budgeting. Its shared kitchen, which was renovated last year, is available for community events. There is also a quiet study area that anyone can book online. Mina, whose family recently moved here, attends the weekly conversation group. I recommend the centre to anyone whose home does not have enough space for group activities or who wants to meet neighbours.",
      checklist: [
        "Используй who/that/where",
        "Добавь одно придаточное с запятыми",
        "Используй whose для принадлежности",
      ],
    },
    speaking: {
      prompt: "Порекомендуй место новому жителю и уточни его потребности.",
      model:
        "There's a centre near the station that offers evening classes. The tutor who leads the language group is excellent. What kind of activity are you looking for?",
      checklist: [
        "Опиши место двумя relative clauses",
        "Задай уточняющий вопрос",
        "Свяжи рекомендацию с потребностью",
      ],
    },
  }),
  unit({
    id: "b1-07",
    level: "B1",
    title: "Действие как идея или цель",
    goal: "Выбирать gerund или infinitive после распространённых глаголов.",
    theory:
      "После enjoy, avoid, finish, suggest обычно идёт -ing. После want, decide, hope, agree — to + verb. Stop doing означает прекратить действие, stop to do — остановиться ради другого действия. Remember doing — помнить прошлое, remember to do — не забыть задачу.",
    examples: [
      "I enjoy learning through stories.",
      "We decided to take an earlier train.",
      "She stopped to answer an important call.",
    ],
    vocabulary: [
      { en: "avoid", ru: "избегать" },
      { en: "manage", ru: "суметь" },
      { en: "suggest", ru: "предлагать" },
      { en: "admit", ru: "признавать" },
      { en: "intend", ru: "намереваться" },
      { en: "postpone", ru: "откладывать" },
    ],
    reading:
      "Nikolai wanted to become more active, but he disliked exercising in crowded gyms. A friend suggested joining a weekend walking group. He agreed to try one session and soon began enjoying the conversations as much as the walks. He has stopped taking the bus for short journeys and hopes to complete a twenty-kilometre route in spring.",
    listening:
      "When I started university, I tried to study for hours without a break. I often forgot to eat lunch and ended up feeling exhausted. A tutor suggested using shorter study periods and planning specific goals. I decided to follow her advice. Now I work for forty minutes, then stop to stretch or make tea. I avoid checking social media during a study period, but I allow myself to reply to messages during breaks. This method has helped me concentrate, and I have managed to finish assignments earlier. I still remember feeling stressed before every deadline, so I intend to continue this healthier routine throughout this academic year and in future courses.",
    questions: [
      [
        "grammar",
        "We decided ___ the meeting until Friday.",
        ["to postpone", "postponing after decide", "postpone to"],
        "to postpone",
        "После decide употребляется to-infinitive.",
      ],
      [
        "grammar",
        "He avoids ___ his phone while driving.",
        ["using", "to use after avoid", "used"],
        "using",
        "После avoid нужен gerund.",
      ],
      [
        "reading",
        "Почему Николай не любил спортзал?",
        ["Там было многолюдно", "Он не любил ходить", "Абонемент был бесплатным"],
        "Там было многолюдно",
        "Он disliked exercising in crowded gyms.",
      ],
      [
        "reading",
        "Как изменилась его короткая дорога?",
        ["Он перестал ездить на автобусе", "Он купил машину", "Он ходит только весной"],
        "Он перестал ездить на автобусе",
        "Теперь короткие расстояния он проходит пешком.",
      ],
      [
        "listening",
        "Что предложил преподаватель?",
        ["Короткие периоды с целями", "Учиться без обеда", "Отвечать постоянно"],
        "Короткие периоды с целями",
        "Совет состоял из shorter study periods и specific goals.",
      ],
      [
        "listening",
        "Когда рассказчик отвечает на сообщения?",
        ["Во время перерывов", "Во время каждого задания", "Только ночью"],
        "Во время перерывов",
        "Messages разрешены during breaks.",
      ],
    ],
    writing: {
      prompt: "Опиши изменение привычки: чего избегал, что решил делать и какой получил результат.",
      minWords: 80,
      model:
        "I used to postpone difficult tasks because I was afraid of making mistakes. Last month, I decided to start each morning with one small challenge. I avoid opening email until I finish it, and I stop to take a short break afterwards. This routine has helped me work calmly. I have also started recording completed tasks instead of focusing on unfinished work. I hope to keep using the system and plan to review my progress each Friday, then choose one improvement for the following week.",
      checklist: [
        "Используй три разных глагола с -ing",
        "Используй три конструкции с to-infinitive",
        "Покажи результат изменения",
      ],
    },
    speaking: {
      prompt: "Помоги партнёру улучшить учебную привычку.",
      model:
        "I keep forgetting new words. — Try using them in short messages. I suggest choosing five words a day. — Good idea. I'll remember to review them in the evening.",
      checklist: ["Выясни проблему", "Предложи два действия", "Попроси партнёра выбрать одно"],
    },
  }),
  unit({
    id: "b1-08",
    level: "B1",
    title: "Фразовые глаголы в деле",
    goal: "Понимать и использовать частотные phrasal verbs в бытовых и рабочих ситуациях.",
    theory:
      "Phrasal verb состоит из глагола и частицы. У разделяемых конструкций объект можно поставить между частями, а местоимение — обязательно: turn the light off / turn it off. Неразделяемые сохраняют порядок: look after a child. Значение лучше учить в контексте.",
    examples: [
      "Please fill in this form.",
      "The meeting was put off until Monday.",
      "I ran into an old friend near the station.",
    ],
    vocabulary: [
      { en: "find out", ru: "выяснить" },
      { en: "set up", ru: "организовать, настроить" },
      { en: "carry on", ru: "продолжать" },
      { en: "sort out", ru: "решить проблему" },
      { en: "look after", ru: "присматривать" },
      { en: "run out of", ru: "исчерпать запас" },
    ],
    reading:
      "A neighbourhood group set up a shared food cupboard last winter. Volunteers look after it and check supplies daily. When they run out of basic items, they post a list online. At first, some labels were unclear, but the team sorted the problem out by adding pictures and dates. The project has carried on because residents both give and take responsibly.",
    listening:
      "On Tuesday our office internet suddenly went off during a video meeting. I first checked the router and turned it off for a minute, but that did not solve the problem. I called the provider to find out whether there was a local fault. They asked me to fill in an online report, which was difficult without a connection. A colleague used her phone to set up a temporary hotspot, so the team could carry on working. The provider eventually found a damaged cable and sorted it out that afternoon. We have now written a backup guide so that anyone can set the hotspot up quickly if the same problem comes up again.",
    questions: [
      [
        "grammar",
        "Turn the computer off" + " can become: Turn ___.",
        ["it off", "off it", "it of"],
        "it off",
        "Местоимение ставится между частями разделяемого phrasal verb.",
      ],
      [
        "grammar",
        "We have ___ printer paper.",
        ["run out of", "run it out", "run of out"],
        "run out of",
        "Run out of — неразделяемая конструкция со значением «закончиться».",
      ],
      [
        "reading",
        "Как исправили неясные этикетки?",
        ["Добавили картинки и даты", "Закрыли шкаф", "Убрали волонтёров"],
        "Добавили картинки и даты",
        "Это сделало маркировку понятнее.",
      ],
      [
        "reading",
        "Почему проект продолжается?",
        [
          "Жители ответственно участвуют",
          "Запасы никогда не заканчиваются",
          "Им управляет магазин",
        ],
        "Жители ответственно участвуют",
        "Люди и приносят, и берут продукты ответственно.",
      ],
      [
        "listening",
        "Как команда временно вернула связь?",
        ["Настроила точку доступа с телефона", "Купила новый офис", "Отменила работу"],
        "Настроила точку доступа с телефона",
        "Коллега set up a temporary hotspot.",
      ],
      [
        "listening",
        "Что сделали после ремонта?",
        ["Написали резервную инструкцию", "Выключили телефоны", "Сменили провайдера"],
        "Написали резервную инструкцию",
        "Guide поможет повторно настроить hotspot.",
      ],
    ],
    writing: {
      prompt: "Опиши бытовую или техническую проблему и её решение, используя phrasal verbs.",
      minWords: 80,
      model:
        "We ran out of hot water on Sunday, so I tried to find out what had happened. I turned the boiler off and checked the instruction page. The display showed an error I could not sort out. I called the service company, and an engineer came the next morning. She replaced a small part and set the system up again. She also showed me how to look after it and wrote the steps down. We can now carry on using it normally if the warning comes up again.",
      checklist: [
        "Используй минимум четыре phrasal verbs",
        "Сохрани правильное место местоимения",
        "Покажи проблему, действия и итог",
      ],
    },
    speaking: {
      prompt: "Объясни коллеге, как справиться с простой неполадкой.",
      model:
        "First, turn the printer off and wait. Then turn it back on. If the error comes up again, fill in the support form. I'll find out who can look at it today.",
      checklist: [
        "Дай последовательные шаги",
        "Используй три phrasal verbs",
        "Добавь запасной вариант",
      ],
    },
  }),
  unit({
    id: "b1-09",
    level: "B1",
    title: "Мнение с аргументами",
    goal: "Выражать позицию, соглашаться, возражать и подкреплять мнение примерами.",
    theory:
      "Чёткая позиция строится как claim + reason + example. In my view и I would argue that вводят мнение; because/since дают причину; for example — пример. Для уважительного несогласия: I see your point, but... / That may be true; however...",
    examples: [
      "In my view, flexible hours improve concentration.",
      "I see your point, but the cost is still too high.",
      "For example, later buses would help evening workers.",
    ],
    vocabulary: [
      { en: "benefit", ru: "преимущество" },
      { en: "drawback", ru: "недостаток" },
      { en: "evidence", ru: "доказательство" },
      { en: "however", ru: "однако" },
      { en: "reasonable", ru: "разумный" },
      { en: "perspective", ru: "точка зрения" },
    ],
    reading:
      "The town is considering one car-free Sunday each month. Supporters say quieter streets would help cafés, cyclists and families. Some shop owners worry that customers would go elsewhere. A local trial found that visitor numbers increased, but deliveries became harder. The council plans to keep morning access for delivery vehicles if the idea is approved.",
    listening:
      "Our college is discussing whether recorded lectures should be available for every course. I support the idea because recordings help students review difficult explanations and catch up after illness. For example, I replayed one statistics lesson before an exam and finally understood the main formula. However, recordings should not replace attendance completely. Classroom questions and group discussions are valuable, and some students might postpone all their study if videos were always available. A reasonable policy would release each recording after the live class and keep attendance requirements for practical sessions. This solution would offer flexibility while protecting interaction. I understand concerns about privacy, so lecturers and students should also know when recording is taking place.",
    questions: [
      [
        "grammar",
        "Choose the best respectful disagreement.",
        ["I see your point, but the trial was too short.", "You are completely wrong.", "But no."],
        "I see your point, but the trial was too short.",
        "Фраза признаёт позицию собеседника и спокойно возражает.",
      ],
      [
        "grammar",
        "Which connector introduces a contrasting point?",
        ["however", "for example", "because"],
        "however",
        "However вводит контраст или ограничение.",
      ],
      [
        "reading",
        "Что показал пробный день без машин?",
        ["Посетителей стало больше", "Все магазины закрылись", "Доставки стали проще"],
        "Посетителей стало больше",
        "Рост посетителей сочетался с трудностями доставки.",
      ],
      [
        "reading",
        "Как предлагают помочь доставкам?",
        ["Оставить утренний доступ", "Запретить их весь день", "Перенести магазины"],
        "Оставить утренний доступ",
        "Council планирует morning access.",
      ],
      [
        "listening",
        "Почему рассказчик поддерживает записи?",
        ["Они помогают повторять сложное", "Они отменяют экзамены", "Они заменяют обсуждения"],
        "Они помогают повторять сложное",
        "Главный довод — review и catch up.",
      ],
      [
        "listening",
        "Какой компромисс предложен?",
        [
          "Публиковать запись после живого занятия",
          "Отменить посещение",
          "Записывать без предупреждения",
        ],
        "Публиковать запись после живого занятия",
        "Так сохраняются и гибкость, и участие.",
      ],
    ],
    writing: {
      prompt: "Выскажи мнение о записи занятий или дне без машин.",
      minWords: 80,
      model:
        "In my view, a monthly car-free day is worth testing. Quieter streets could make the centre safer and attract more visitors. For example, families might spend longer in local cafés and parks. I understand that deliveries are necessary; however, they could be allowed early in the morning. Some residents may also need car access because of limited mobility, so permits should remain available. The council should collect traffic, sales and visitor data during a three-month trial before making a permanent decision.",
      checklist: [
        "Сформулируй позицию и две причины",
        "Добавь конкретный пример",
        "Признай возражение и предложи компромисс",
      ],
    },
    speaking: {
      prompt: "Обсуди спорное правило и приди с партнёром к общему решению.",
      model:
        "I think recordings should be available. — I see your point, but attendance might fall. — Then we could publish them after class and keep practical sessions compulsory. — That sounds reasonable.",
      checklist: ["Вырази позицию", "Уважительно возрази", "Сформулируй компромисс"],
    },
  }),
  unit({
    id: "b1-10",
    level: "B1",
    title: "Жалоба, которая решает проблему",
    goal: "Спокойно описывать проблему, последствия и желаемое решение.",
    theory:
      "Эффективная жалоба содержит контекст, проверяемые факты, влияние и конкретный запрос. Смягчители Unfortunately, it appears that, I would appreciate... сохраняют деловой тон. Неясные обвинения лучше заменить датами, номерами заказа и наблюдаемыми деталями.",
    examples: [
      "Unfortunately, the parcel arrived damaged.",
      "It appears that I was charged twice.",
      "I would appreciate a replacement or a full refund.",
    ],
    vocabulary: [
      { en: "resolve", ru: "урегулировать" },
      { en: "inconvenience", ru: "неудобство" },
      { en: "replacement", ru: "замена" },
      { en: "charge", ru: "списывать оплату" },
      { en: "evidence", ru: "подтверждение" },
      { en: "compensation", ru: "компенсация" },
    ],
    reading:
      "Elena booked a quiet room for a work trip, but construction began outside at seven each morning. The hotel website had not mentioned the work. She spoke to reception after the first night and showed her booking details. Staff moved her to a room at the back and refunded one breakfast. Elena accepted because the new room solved the main problem.",
    listening:
      "Hello, I'm calling about order 7318, delivered this morning. The package itself looked fine, but two glass containers inside were broken. Liquid has also damaged the instruction booklet. I took photographs before removing anything and can email them now. I need the containers for an event this Friday, so a standard replacement next week would be too late. Could you send two replacements by express delivery, or refund those items today so I can buy them locally? The remaining four containers are undamaged and do not need to be returned. Please confirm the quickest available option by email, as I will be in important scheduled client meetings throughout this afternoon.",
    questions: [
      [
        "grammar",
        "Choose the most professional request.",
        [
          "I would appreciate a prompt replacement.",
          "Send it now!",
          "This is terrible and useless.",
        ],
        "I would appreciate a prompt replacement.",
        "Фраза конкретна и сохраняет деловой тон.",
      ],
      [
        "grammar",
        "It appears that I ___ twice for the same booking.",
        ["was charged", "charged myself", "have charge"],
        "was charged",
        "Пассив показывает, что списание применили к клиенту.",
      ],
      [
        "reading",
        "Как отель решил главную проблему?",
        ["Переселил Елену в тихую комнату", "Остановил стройку", "Отменил поездку"],
        "Переселил Елену в тихую комнату",
        "Новая комната находилась с задней стороны.",
      ],
      [
        "reading",
        "Почему жалоба была обоснованной?",
        ["Сайт не предупреждал о стройке", "Елена не читала описание", "Завтрак был дорогим"],
        "Сайт не предупреждал о стройке",
        "Существенная информация отсутствовала при бронировании.",
      ],
      [
        "listening",
        "Почему обычная замена не подходит?",
        ["Товар нужен к пятнице", "Вся посылка потеряна", "Клиент уезжает сегодня"],
        "Товар нужен к пятнице",
        "Доставка на следующей неделе опоздает к событию.",
      ],
      [
        "listening",
        "Как клиент просит подтвердить решение?",
        ["По электронной почте", "Лично в магазине", "Письмом по почте"],
        "По электронной почте",
        "Днём клиент будет на встречах.",
      ],
    ],
    writing: {
      prompt: "Напиши формальную жалобу о жилье, услуге или заказе.",
      minWords: 80,
      model:
        "Hello. I am writing about booking 2041 for 12–14 June. Unfortunately, the room was not available when I arrived, although payment had already been taken. I waited for ninety minutes and missed an online meeting. Staff offered another room, but it did not have the desk shown in my booking. I would appreciate a refund for the first night. I have attached the confirmation, payment receipt and a photograph of the room. Please reply within five working days and confirm how the refund will be processed.",
      checklist: [
        "Добавь номер, дату или другое подтверждение",
        "Опиши влияние проблемы",
        "Запроси конкретное и реалистичное решение",
      ],
    },
    speaking: {
      prompt: "Разыграй звонок в поддержку и договорись о решении.",
      model:
        "I'm calling about a damaged delivery. — I'm sorry. Can you send photos? — Yes. I need the item by Friday, so could you arrange express replacement? — We can send it today. — Please confirm that by email.",
      checklist: [
        "Сообщи проверяемые факты",
        "Объясни срочность",
        "Подтверди согласованное решение",
      ],
    },
  }),
  unit({
    id: "b1-11",
    level: "B1",
    title: "Связный текст без скачков",
    goal: "Организовывать абзацы и связывать причины, контрасты и результаты.",
    theory:
      "Каждый абзац раскрывает одну основную мысль. Firstly/another point организуют порядок; because/since дают причину; therefore/as a result — следствие; although/however — контраст. Местоимения и this/these помогают не повторять существительные, если ссылка однозначна.",
    examples: [
      "Although the route is longer, it is safer.",
      "The fee was reduced; as a result, more people joined.",
      "This change also saved staff time.",
    ],
    vocabulary: [
      { en: "therefore", ru: "поэтому" },
      { en: "whereas", ru: "тогда как" },
      { en: "in addition", ru: "кроме того" },
      { en: "consequence", ru: "последствие" },
      { en: "approach", ru: "подход" },
      { en: "overall", ru: "в целом" },
    ],
    reading:
      "Our office replaced individual bins with shared recycling points. At first, employees complained because the new stations were farther from their desks. However, clearer labels reduced sorting mistakes. In addition, teams began using fewer disposable cups. As a result, general waste fell by a third within two months. Overall, the inconvenience was small compared with the environmental benefit.",
    listening:
      "The library recently extended its opening hours during exam season. Previously, it closed at eight, whereas many students studied until late. The new schedule keeps two floors open until midnight. At first, managers worried that staffing costs would rise sharply. However, they adjusted daytime shifts and recruited student assistants for the final four hours. This approach controlled costs and gave assistants paid experience. In addition, a night bus stop was moved closer to the entrance, so students could travel home more safely. Visitor numbers after eight doubled in the first month. Noise complaints also increased slightly; therefore, the library created a silent floor and a separate group area. Overall, feedback has been positive, although managers will review the service after the exam period.",
    questions: [
      [
        "grammar",
        "Choose the connector for a result.",
        ["as a result", "although", "whereas"],
        "as a result",
        "As a result вводит следствие предыдущего факта.",
      ],
      [
        "grammar",
        "___ the room was small, it worked well for the meeting.",
        ["Although", "Therefore", "In addition"],
        "Although",
        "Although вводит контраст с последующей положительной оценкой.",
      ],
      [
        "reading",
        "Что уменьшило ошибки сортировки?",
        ["Понятные этикетки", "Возврат личных корзин", "Новые стаканы"],
        "Понятные этикетки",
        "Clearer labels reduced mistakes.",
      ],
      [
        "reading",
        "Каков общий вывод автора?",
        ["Польза превысила неудобство", "Проект провалился", "Отходов стало больше"],
        "Польза превысила неудобство",
        "Финальное предложение прямо сравнивает эффект.",
      ],
      [
        "listening",
        "Как библиотека ограничила расходы?",
        ["Изменила смены и наняла студентов", "Закрыла два этажа", "Отменила ночной транспорт"],
        "Изменила смены и наняла студентов",
        "Два действия позволили контролировать costs.",
      ],
      [
        "listening",
        "Как отреагировали на шум?",
        ["Создали тихий этаж и групповую зону", "Сократили часы", "Запретили студентов"],
        "Создали тихий этаж и групповую зону",
        "Пространства разделили по типу работы.",
      ],
    ],
    writing: {
      prompt: "Напиши связный обзор изменения в школе, работе или районе.",
      minWords: 80,
      model:
        "Our building introduced a shared delivery shelf last month. Previously, drivers left parcels near different doors, so residents often missed them. The shelf is beside reception and has clearly numbered sections. As a result, collection is faster. However, large boxes do not fit there. The manager has therefore created a separate storage area. In addition, residents receive a message when a parcel arrives. This change has reduced lost deliveries and saved reception staff time. Overall, the system is more reliable, although the notification service still needs improvement.",
      checklist: [
        "Раздели текст на логические части",
        "Используй причину, результат и контраст",
        "Заверши общей оценкой",
      ],
    },
    speaking: {
      prompt: "Устно представь изменение: ситуация раньше, решение, плюс, минус и вывод.",
      model:
        "Previously, our group shared files by email, so versions were often confused. We now use one folder. As a result, updates are clearer. However, access sometimes fails. Overall, the new system saves time.",
      checklist: [
        "Соблюдай структуру из пяти частей",
        "Используй три связки",
        "Не повторяй одну мысль",
      ],
    },
  }),
  unit({
    id: "b1-12",
    level: "B1",
    title: "Практическая миссия: объяснить и договориться",
    goal: "Посредничать между людьми, кратко передавать сложную информацию и согласовывать решение.",
    theory:
      "Mediation — не дословный перевод, а передача нужного смысла для конкретного человека. Сначала определи его задачу, выбери только релевантные факты, объясни простыми словами и проверь понимание. Полезны The main point is..., In practical terms..., What this means for you is...",
    examples: [
      "The main point is that registration closes on Friday.",
      "In practical terms, you need to bring two documents.",
      "What this means for you is that the morning session is optional.",
    ],
    vocabulary: [
      { en: "summarise", ru: "кратко излагать" },
      { en: "relevant", ru: "относящийся к делу" },
      { en: "requirement", ru: "требование" },
      { en: "option", ru: "вариант" },
      { en: "confirm", ru: "подтверждать" },
      { en: "on behalf of", ru: "от имени" },
    ],
    reading:
      "A community course offers free digital training to residents. Registration closes on 4 September. Learners attend one core workshop and choose either online safety or photo editing. Laptops are provided, but participants may bring their own. Anyone needing step-free access should mention it on the form. Missed workshops can be replaced once if notice is given twenty-four hours in advance.",
    listening:
      "Hi, could you explain the volunteering notice to Lena? She understands everyday English but found the details confusing. Volunteers will welcome visitors at the autumn book festival on Saturday 18 October. There are two shifts: nine until one, or twelve thirty until five. Everyone must join a forty-minute online briefing during the previous week. The organiser provides lunch only to people working the full overlap from twelve thirty to one, so most volunteers should bring food. Travel within the city can be refunded if receipts are submitted within seven days. Lena prefers quiet tasks and cannot stand for long periods. Tell her that the information desk has seats and would probably suit her, but she should mention her needs on the application. Applications close this Monday.",
    questions: [
      [
        "grammar",
        "Choose the clearest mediation phrase.",
        [
          "What this means for you is that you must apply by Monday.",
          "The aforementioned closure is impending.",
          "Everything is obvious.",
        ],
        "What this means for you is that you must apply by Monday.",
        "Фраза связывает исходную информацию с действием слушателя.",
      ],
      [
        "grammar",
        "The notice says receipts ___ within seven days.",
        ["must be submitted", "must submit themselves", "have submitting"],
        "must be submitted",
        "Требование к документам естественно передаётся пассивом.",
      ],
      [
        "reading",
        "Что обязан пройти каждый участник?",
        ["Один основной семинар", "Оба дополнительных курса", "Собеседование"],
        "Один основной семинар",
        "Core workshop обязателен, дополнительный выбирается один.",
      ],
      [
        "reading",
        "Когда можно заменить пропущенное занятие?",
        ["Если предупредить за сутки", "Всегда без предупреждения", "Только со своим ноутбуком"],
        "Если предупредить за сутки",
        "Нужно notice twenty-four hours in advance.",
      ],
      [
        "listening",
        "Какая роль лучше подходит Лене?",
        ["Информационная стойка", "Перенос коробок", "Работа стоя у входа"],
        "Информационная стойка",
        "Там есть сиденья и спокойнее.",
      ],
      [
        "listening",
        "Что нужно для возврата транспортных расходов?",
        ["Чеки в течение семи дней", "Полная дневная смена", "Собственный обед"],
        "Чеки в течение семи дней",
        "Refund зависит от receipts submitted within seven days.",
      ],
    ],
    writing: {
      prompt: "Напиши Лене простое сообщение с главными условиями волонтёрства и рекомендацией.",
      minWords: 80,
      model:
        "Hi Lena. The festival needs volunteers on Saturday 18 October, and you can choose a morning or afternoon shift. You also need to attend a short online briefing the week before. The information desk would probably suit you because it has seats and is quieter than the entrance. Mention that you cannot stand for long on the form. Bring food unless you work during the lunch overlap. Keep your travel receipts because the cost can be refunded. Most importantly, apply by Monday.",
      checklist: [
        "Отбери только нужные Лене факты",
        "Объясни рекомендацию",
        "Выдели срок и необходимое действие",
      ],
    },
    speaking: {
      prompt: "Посредничай: объясни партнёру объявление и помоги выбрать подходящий вариант.",
      model:
        "The main point is that there are two shifts. Since you prefer quiet work, the information desk is probably best. You must also join an online briefing. Does the morning or afternoon suit you better?",
      checklist: [
        "Суммируй без дословного перевода",
        "Свяжи вариант с потребностью",
        "Проверь понимание и выбор",
      ],
    },
  }),
];

export const intermediateUnits: PathUnit[] = [...a2Units, ...b1Units];
