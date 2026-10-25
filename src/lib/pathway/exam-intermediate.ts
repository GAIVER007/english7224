import type { ExamQuestion } from "./exam-types";

const a2ReadingTrip =
  "Olga wanted a quiet weekend, so she booked a small guesthouse near a lake. The bus was cheaper than the train, but the journey took two hours longer. When she arrived, the owner showed her a bright room with a view of the water. On Saturday morning, Olga rented a bicycle and followed a forest path. It started raining while she was having lunch, so she returned early. She has visited the area twice now, and she already plans to come back in autumn. Next time, she is going to travel by train because it is faster and more comfortable.";

const a2ReadingReturn =
  "Denis ordered a blue jacket online because his size was not available in the local shop. The parcel arrived three days later, but the jacket was too tight around the shoulders. He checked the return instructions and put the jacket, receipt and return form into the original box. The company offered an exchange or a refund. Denis chose a larger size because he liked the colour and the material. He did not have to pay for delivery again. A week later, the new jacket arrived. It fitted well, although the sleeves were slightly longer than he expected.";

const a2ListeningPlans =
  "Hi, Marina. I am calling about Saturday. The weather forecast says it may rain in the afternoon, so our picnic in the park is not a good idea. We could meet at the science museum instead. Tickets are twelve pounds, but students pay only eight. I have not bought them yet because I wanted to ask you first. If you agree, I will book them online tonight. The museum opens at ten, and the guided tour starts at eleven thirty. Let us meet outside the underground station at ten fifteen. Please message me before six if you cannot come.";

const a2ListeningHealth =
  "Good morning. I have had a sore throat since Monday, and I started coughing last night. I do not have a high temperature, but I feel more tired than usual. I have already tried hot tea and honey, but they have not helped much. I need to give a presentation at work on Friday. Should I stay at home today? The receptionist said the doctor could call me at two thirty. Until then, I am going to rest and drink plenty of water. If I feel worse or have trouble breathing, I will contact the emergency service immediately.";

const b1ReadingVolunteer =
  "When Amir moved to a new city, he found it difficult to meet people outside work. A colleague suggested volunteering at a community kitchen that prepared meals for older residents. At first, Amir only packed food, but after a few weeks he began coordinating the Saturday team. The kitchen, which is run mostly by local volunteers, now delivers nearly two hundred meals every weekend. Amir has been working there for eighteen months and says the experience has made him more confident. Last winter, a delivery van broke down during a snowstorm. While the team was trying to arrange another vehicle, Amir contacted a nearby taxi company. Its manager offered two cars for free, so every meal arrived on time. Amir believes businesses would support more local projects if organisers explained their needs clearly and gave them practical ways to help.";

const b1ReadingRemote =
  "A design company introduced a one-day-a-week remote-work trial after several employees complained about long journeys to the office. Staff were allowed to work from home on Wednesdays, provided that they attended all client meetings online. After three months, managers reported that projects were still being completed on time and sick leave had fallen slightly. However, some new employees said they felt isolated because informal conversations were harder to arrange. In response, the company created short online coffee meetings and asked experienced staff to mentor newcomers. The trial has now been extended for another six months. Management will make a final decision after comparing productivity, staff satisfaction and client feedback. One team leader said remote work was neither a perfect solution nor a problem in itself; its success depended on clear communication, suitable tasks and fair expectations.";

const b1ListeningDelay =
  "Hello, this is Rachel Morgan calling about order 6842. I was told that the office chairs would be delivered by Tuesday, but nothing has arrived and I have not received an update. We are opening a new training room on Friday, so the delay is causing a serious problem. When I spoke to your sales assistant last week, he said all twelve chairs were in stock. Could you check what has happened and confirm a new delivery time today? If the full order cannot arrive before Friday morning, we would accept eight chairs now and the remaining four next week. However, we should not be charged for two deliveries because the original delay was not ours. Please call me before four o'clock. I would prefer to solve this directly, but I will need to request a refund if you cannot guarantee the first delivery.";

const b1ListeningCourse =
  "Thanks for joining the planning meeting. The evening photography course has attracted more interest than we expected: forty-six people have applied for twenty places. I suggest that we add a second group rather than reject half the applicants. If we hired another tutor, we could run one class on Tuesdays and another on Thursdays. The main difficulty is equipment. We currently have only fourteen cameras, although several students have said they can bring their own. Before we make a decision, Priya will contact everyone to find out exactly how many cameras are needed. I will ask the finance team whether we can afford another tutor for eight weeks. We also need to check that the computer room is available on both evenings. Let us collect the information by Wednesday and make the final decision on Thursday morning. If the second group is impossible, we will create a waiting list in application order.";

const a2: ExamQuestion[] = [
  {
    id: "exam-a2-01",
    unitId: "a2-01",
    skill: "grammar",
    prompt: "В тот момент шёл процесс: When I opened the door, Leo ___ on the phone.",
    options: ["was talking", "talked", "has talked"],
    answer: "was talking",
    explanation:
      "Past Continuous показывает действие, которое уже происходило в момент другого события в прошлом.",
  },
  {
    id: "exam-a2-02",
    unitId: "a2-02",
    skill: "grammar",
    prompt: "Выбери форму для опыта без точного времени: My parents ___ to Scotland three times.",
    options: ["have been", "went", "were going"],
    answer: "have been",
    explanation: "Количество поездок как жизненный опыт без даты выражается Present Perfect.",
  },
  {
    id: "exam-a2-03",
    unitId: "a2-03",
    skill: "grammar",
    prompt: "This suitcase is ___ the other one, but it is also more expensive.",
    options: ["much lighter than", "more light than", "the lightest as"],
    answer: "much lighter than",
    explanation:
      "У короткого прилагательного light сравнительная форма lighter; much усиливает различие, после неё ставится than.",
  },
  {
    id: "exam-a2-04",
    unitId: "a2-04",
    skill: "grammar",
    prompt: "We have ___ chairs for everyone, but we do not have ___ tables.",
    options: ["enough / enough", "much / many", "a little / a few"],
    answer: "enough / enough",
    explanation:
      "Enough ставится перед исчисляемыми существительными во множественном числе и означает достаточное количество.",
  },
  {
    id: "exam-a2-05",
    unitId: "a2-05",
    skill: "grammar",
    prompt: "Посмотри на эти тёмные облака! It ___ rain.",
    options: ["is going to", "will to", "is raining every day"],
    answer: "is going to",
    explanation: "Be going to используется для прогноза, основанного на видимых признаках сейчас.",
  },
  {
    id: "exam-a2-06",
    unitId: "a2-06",
    skill: "grammar",
    prompt: "You ___ show your passport at the border; it is a rule.",
    options: ["have to", "might", "should not"],
    answer: "have to",
    explanation: "Have to выражает внешнее обязательное правило.",
  },
  {
    id: "exam-a2-07",
    unitId: "a2-07",
    skill: "grammar",
    prompt: "If Rosa ___ before eight, we will have dinner together.",
    options: ["arrives", "will arrive", "arrived"],
    answer: "arrives",
    explanation:
      "В реальном условии после if используется Present Simple, а результат ставится с will.",
  },
  {
    id: "exam-a2-08",
    unitId: "a2-11",
    skill: "grammar",
    prompt: "I ___ Sam at the library at six; we arranged it yesterday.",
    options: ["am meeting", "meet usually", "have met yet"],
    answer: "am meeting",
    explanation:
      "Present Continuous может обозначать уже организованную личную договорённость на будущее.",
  },
  ...([
    [
      "exam-a2-09",
      "a2-08",
      "Почему Ольга выбрала автобус для первой поездки?",
      ["Он был дешевле поезда", "Он был быстрее поезда", "Он ехал прямо до леса"],
      "Он был дешевле поезда",
      "В тексте прямо сказано, что автобус был дешевле, хотя ехал дольше.",
    ],
    [
      "exam-a2-10",
      "a2-01",
      "Что произошло, пока Ольга обедала?",
      ["Начался дождь", "Она потеряла велосипед", "Приехал владелец гостиницы"],
      "Начался дождь",
      "Дождь начался во время её обеда, поэтому она вернулась раньше.",
    ],
    [
      "exam-a2-11",
      "a2-02",
      "Сколько раз Ольга уже была в этом районе?",
      ["Два раза", "Один раз", "Три раза"],
      "Два раза",
      "Фраза has visited the area twice означает, что это была её вторая поездка.",
    ],
    [
      "exam-a2-12",
      "a2-05",
      "Как Ольга собирается ехать в следующий раз?",
      ["На поезде", "На автобусе", "На велосипеде"],
      "На поезде",
      "Она планирует выбрать поезд, потому что он быстрее и удобнее.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "reading" as const,
    passage: a2ReadingTrip,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
  ...([
    [
      "exam-a2-13",
      "a2-10",
      "Почему Денис заказал куртку через интернет?",
      [
        "В магазине не было его размера",
        "В магазине не было синего цвета",
        "Он хотел бесплатную доставку",
      ],
      "В магазине не было его размера",
      "Нужного размера не оказалось в местном магазине.",
    ],
    [
      "exam-a2-14",
      "a2-10",
      "Что было не так с первой курткой?",
      ["Она была тесной в плечах", "У неё были короткие рукава", "Она была другого цвета"],
      "Она была тесной в плечах",
      "Первая куртка оказалась слишком тесной вокруг плеч.",
    ],
    [
      "exam-a2-15",
      "a2-10",
      "Почему Денис выбрал обмен, а не возврат денег?",
      ["Ему нравились цвет и материал", "Компания отказалась вернуть деньги", "Он потерял чек"],
      "Ему нравились цвет и материал",
      "Он хотел ту же куртку большего размера, потому что цвет и материал ему подходили.",
    ],
    [
      "exam-a2-16",
      "a2-03",
      "Каким оказался новый размер?",
      [
        "Он хорошо сидел, но рукава были чуть длиннее ожидаемого",
        "Он снова был тесным в плечах",
        "Он был короче и дешевле",
      ],
      "Он хорошо сидел, но рукава были чуть длиннее ожидаемого",
      "Новая куртка подошла, единственным отличием были немного длинные рукава.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "reading" as const,
    passage: a2ReadingReturn,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
  ...([
    [
      "exam-a2-17",
      "a2-05",
      "Почему говорящий предлагает изменить планы?",
      ["Днём возможен дождь", "Парк закрывается утром", "Марина не любит пикники"],
      "Днём возможен дождь",
      "Прогноз обещает возможный дождь, поэтому вместо пикника предложен музей.",
    ],
    [
      "exam-a2-18",
      "a2-04",
      "Сколько стоит билет для студента?",
      ["Восемь фунтов", "Двенадцать фунтов", "Десять фунтов"],
      "Восемь фунтов",
      "Обычный билет стоит двенадцать фунтов, а студенческий — восемь.",
    ],
    [
      "exam-a2-19",
      "a2-07",
      "Что сделает говорящий, если Марина согласится?",
      ["Забронирует билеты вечером", "Купит билеты у входа утром", "Отменит экскурсию"],
      "Забронирует билеты вечером",
      "Он прямо говорит: If you agree, I will book them online tonight.",
    ],
    [
      "exam-a2-20",
      "a2-11",
      "Где и когда они должны встретиться?",
      ["У станции метро в 10:15", "У музея в 11:30", "В парке в 10:00"],
      "У станции метро в 10:15",
      "Назначена встреча снаружи станции метро в десять пятнадцать.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "listening" as const,
    passage: a2ListeningPlans,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
  ...([
    [
      "exam-a2-21",
      "a2-09",
      "Какой симптом начался прошлой ночью?",
      ["Кашель", "Высокая температура", "Проблемы с дыханием"],
      "Кашель",
      "Боль в горле продолжается с понедельника, а кашель начался прошлой ночью.",
    ],
    [
      "exam-a2-22",
      "a2-02",
      "Что человек уже пробовал?",
      ["Горячий чай с мёдом", "Новое лекарство", "Дыхательные упражнения"],
      "Горячий чай с мёдом",
      "Он уже пробовал чай и мёд, но заметного эффекта не было.",
    ],
    [
      "exam-a2-23",
      "a2-11",
      "Когда врач может позвонить?",
      ["В 14:30", "До полудня", "В пятницу"],
      "В 14:30",
      "Регистратор сообщил, что врач может позвонить в половине третьего.",
    ],
    [
      "exam-a2-24",
      "a2-06",
      "При каком изменении человек обратится за срочной помощью?",
      ["Если станет трудно дышать", "Если чай не поможет", "Если придётся выступать на работе"],
      "Если станет трудно дышать",
      "Трудности с дыханием названы поводом немедленно связаться с экстренной службой.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "listening" as const,
    passage: a2ListeningHealth,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
];

const b1: ExamQuestion[] = [
  {
    id: "exam-b1-01",
    unitId: "b1-01",
    skill: "grammar",
    prompt: "By the time the taxi arrived, we ___ for forty minutes.",
    options: ["had been waiting", "were waited", "have waited"],
    answer: "had been waiting",
    explanation:
      "Past Perfect Continuous подчёркивает длительность действия до другого момента в прошлом.",
  },
  {
    id: "exam-b1-02",
    unitId: "b1-02",
    skill: "grammar",
    prompt: "Nora ___ at this company since she graduated.",
    options: ["has been working", "is working yesterday", "worked since"],
    answer: "has been working",
    explanation:
      "Действие началось в прошлом и продолжается сейчас, поэтому нужен Present Perfect Continuous.",
  },
  {
    id: "exam-b1-03",
    unitId: "b1-03",
    skill: "grammar",
    prompt: "If I ___ closer to the office, I would cycle to work.",
    options: ["lived", "will live", "had lived yesterday"],
    answer: "lived",
    explanation:
      "Во втором условном предложении после if ставится Past Simple, а результат оформляется через would.",
  },
  {
    id: "exam-b1-04",
    unitId: "b1-04",
    skill: "grammar",
    prompt: "The final report ___ by the research team next Monday.",
    options: ["will be published", "will publish", "is publishing by"],
    answer: "will be published",
    explanation:
      "В будущем пассиве используется will be + третья форма глагола: важен результат, а не исполнитель.",
  },
  {
    id: "exam-b1-05",
    unitId: "b1-05",
    skill: "grammar",
    prompt: "Mia said, “I cannot attend today.” → Mia said that she ___ attend that day.",
    options: ["could not", "cannot", "will not"],
    answer: "could not",
    explanation: "В косвенной речи can обычно меняется на could, а today — на that day.",
  },
  {
    id: "exam-b1-06",
    unitId: "b1-06",
    skill: "grammar",
    prompt: "The café ___ we first met has closed.",
    options: ["where", "who", "whose"],
    answer: "where",
    explanation: "Where вводит определительное придаточное, которое уточняет место.",
  },
  {
    id: "exam-b1-07",
    unitId: "b1-07",
    skill: "grammar",
    prompt: "Сообщение делается сейчас: I regret ___ you that your application was unsuccessful.",
    options: ["to inform", "having informed", "being informed"],
    answer: "to inform",
    explanation:
      "Regret to do употребляется, когда говорящий с сожалением сообщает неприятную новость сейчас.",
  },
  {
    id: "exam-b1-08",
    unitId: "b1-08",
    skill: "grammar",
    prompt: "We had to ___ the meeting because two speakers were ill.",
    options: ["put off", "look after", "turn up"],
    answer: "put off",
    explanation: "Put off означает перенести событие на более позднее время.",
  },
  ...([
    [
      "exam-b1-09",
      "b1-02",
      "Почему Амир сначала пришёл в общественную кухню?",
      [
        "Он хотел познакомиться с людьми вне работы",
        "Ему поручили это на работе",
        "Он искал бесплатную еду",
      ],
      "Он хотел познакомиться с людьми вне работы",
      "После переезда ему было трудно заводить знакомства, и коллега посоветовал волонтёрство.",
    ],
    [
      "exam-b1-10",
      "b1-06",
      "Какова роль придаточной части which is run mostly by local volunteers?",
      [
        "Она добавляет информацию о кухне",
        "Она объясняет, кому доставляют еду",
        "Она указывает время работы кухни",
      ],
      "Она добавляет информацию о кухне",
      "Неограничительное придаточное даёт дополнительный факт о том, кем управляется кухня.",
    ],
    [
      "exam-b1-11",
      "b1-01",
      "Как команда решила проблему со сломанным фургоном?",
      [
        "Таксомоторная компания бесплатно предоставила две машины",
        "Амир сам отвёз все блюда",
        "Доставку перенесли на следующий день",
      ],
      "Таксомоторная компания бесплатно предоставила две машины",
      "Амир связался с местной компанией, и её руководитель предложил две машины бесплатно.",
    ],
    [
      "exam-b1-12",
      "b1-09",
      "Какое общее мнение выражает Амир?",
      [
        "Компании чаще помогали бы при ясной и практичной просьбе",
        "Компании в первую очередь поддерживают проекты, которые приносят им финансовую выгоду",
        "Организаторам лучше обращаться к компаниям с готовыми благотворительными программами",
      ],
      "Компании чаще помогали бы при ясной и практичной просьбе",
      "Он связывает готовность бизнеса помочь с ясным объяснением потребностей и конкретным способом участия.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "reading" as const,
    passage: b1ReadingVolunteer,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
  ...([
    [
      "exam-b1-13",
      "b1-04",
      "Какое условие было связано с работой из дома по средам?",
      [
        "Нужно было участвовать во всех встречах с клиентами онлайн",
        "Нужно было закончить все проекты во вторник",
        "Нужно было работать дольше в четверг",
      ],
      "Нужно было участвовать во всех встречах с клиентами онлайн",
      "Удалённый день разрешался при условии участия во всех клиентских встречах.",
    ],
    [
      "exam-b1-14",
      "b1-02",
      "Какой результат обнаружили через три месяца?",
      [
        "Проекты завершались вовремя, а больничных стало немного меньше",
        "Производительность резко упала",
        "Клиенты отказались от онлайн-встреч",
      ],
      "Проекты завершались вовремя, а больничных стало немного меньше",
      "Отчёт менеджеров отметил соблюдение сроков и небольшое снижение больничных.",
    ],
    [
      "exam-b1-15",
      "b1-03",
      "Зачем компания ввела онлайн-встречи за кофе и наставничество?",
      [
        "Чтобы уменьшить чувство изоляции у новых сотрудников",
        "Чтобы оценивать клиентов",
        "Чтобы заменить все рабочие совещания",
      ],
      "Чтобы уменьшить чувство изоляции у новых сотрудников",
      "Эти меры стали ответом на жалобы новичков о нехватке неформального общения.",
    ],
    [
      "exam-b1-16",
      "b1-09",
      "От чего, по мнению руководителя, зависит успех удалённой работы?",
      [
        "От ясного общения, подходящих задач и справедливых ожиданий",
        "Только от скорости интернета",
        "Только от количества дней дома",
      ],
      "От ясного общения, подходящих задач и справедливых ожиданий",
      "Руководитель называет три условия и не считает удалённую работу автоматически хорошей или плохой.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "reading" as const,
    passage: b1ReadingRemote,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
  ...([
    [
      "exam-b1-17",
      "b1-10",
      "В чём основная причина звонка Рэйчел?",
      [
        "Заказ стульев задержан без объяснения",
        "Компания доставила неправильный цвет",
        "Она хочет заказать ещё двенадцать стульев",
      ],
      "Заказ стульев задержан без объяснения",
      "Обещанный срок прошёл, доставка не состоялась и обновления не было.",
    ],
    [
      "exam-b1-18",
      "b1-05",
      "Что продавец сообщил Рэйчел на прошлой неделе?",
      [
        "Все двенадцать стульев были в наличии",
        "Заказ уже отправили двумя машинами",
        "Тренинговая комната откроется во вторник",
      ],
      "Все двенадцать стульев были в наличии",
      "Рэйчел передаёт слова сотрудника о наличии всех двенадцати стульев.",
    ],
    [
      "exam-b1-19",
      "b1-03",
      "На какой компромисс согласна Рэйчел?",
      [
        "Получить восемь стульев сейчас, а четыре на следующей неделе",
        "Получить только четыре стула со скидкой",
        "Перенести открытие комнаты на неделю",
      ],
      "Получить восемь стульев сейчас, а четыре на следующей неделе",
      "Она предлагает разделить заказ, если полная поставка до пятницы невозможна.",
    ],
    [
      "exam-b1-20",
      "b1-10",
      "При каком условии Рэйчел потребует возврат денег?",
      [
        "Если поставщик не гарантирует первую доставку",
        "Если ей позвонят после четырёх",
        "Если доставку разделят на две части",
      ],
      "Если поставщик не гарантирует первую доставку",
      "Возврат назван следующим шагом, если компания не сможет гарантировать первую часть доставки.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "listening" as const,
    passage: b1ListeningDelay,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
  ...([
    [
      "exam-b1-21",
      "b1-03",
      "Что предлагает говорящий из-за большого числа заявок?",
      [
        "Открыть вторую группу",
        "Сократить курс до четырёх недель",
        "Принять только владельцев камер",
      ],
      "Открыть вторую группу",
      "Вторая группа позволила бы не отказывать более чем половине желающих.",
    ],
    [
      "exam-b1-22",
      "b1-04",
      "Какая главная практическая трудность уже известна?",
      [
        "Для всех студентов не хватает камер",
        "На курс подали меньше заявок, чем ожидалось",
        "Ни один студент не может принести собственную камеру",
      ],
      "Для всех студентов не хватает камер",
      "На двадцать мест имеется только четырнадцать камер, хотя часть студентов принесёт свои.",
    ],
    [
      "exam-b1-23",
      "b1-05",
      "Какую информацию должна собрать Прия?",
      [
        "Точное количество необходимых камер",
        "Отзывы клиентов о преподавателе",
        "Стоимость курса у конкурентов",
      ],
      "Точное количество необходимых камер",
      "Она свяжется с заявителями и уточнит, скольким людям действительно нужна камера.",
    ],
    [
      "exam-b1-24",
      "b1-11",
      "Что произойдёт, если открыть вторую группу не получится?",
      [
        "Создадут список ожидания в порядке подачи заявок",
        "Курс полностью отменят",
        "Все занятия перенесут на среду",
      ],
      "Создадут список ожидания в порядке подачи заявок",
      "Запасной план — упорядоченный по времени подачи заявки список ожидания.",
    ],
  ].map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill: "listening" as const,
    passage: b1ListeningCourse,
    prompt,
    options,
    answer,
    explanation,
  })) as ExamQuestion[]),
];

export const intermediateExamQuestions: Record<"A2" | "B1", ExamQuestion[]> = {
  A2: a2,
  B1: b1,
};
