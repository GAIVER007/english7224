import type { ExamQuestion } from "./exam-types";

type PassageQuestion = readonly [
  id: string,
  unitId: string,
  prompt: string,
  options: readonly string[],
  answer: string,
  explanation: string,
];

function passageQuestions(
  skill: "reading" | "listening",
  passage: string,
  questions: readonly PassageQuestion[],
): ExamQuestion[] {
  return questions.map(([id, unitId, prompt, options, answer, explanation]) => ({
    id,
    unitId,
    skill,
    passage,
    prompt,
    options: [...options],
    answer,
    explanation,
  }));
}

const a2ReadingLibrary =
  "The Westbridge Library used to close at five o'clock, which made it difficult for people who worked during the day to visit. In March, the library began opening until eight on Tuesdays and Thursdays. It also moved its language classes from the afternoon to the early evening. Attendance has grown, especially among adults who are learning English. The library has not hired extra staff, so each employee now works one late shift a week and starts later that morning. Visitors can return books through a machine outside when the building is closed. Next month, the library is going to test a Saturday conversation club. Places will be free, but visitors will need to book because the meeting room is quite small.";

const a2ReadingNeighbour =
  "Last month, Marta noticed that the shared garden behind her apartment building looked untidy. There were broken chairs near the entrance, and nobody was using the flower beds. She posted a message in the residents' group and suggested a garden morning. Twelve neighbours came on Sunday. Some repaired the chairs while others removed weeds and planted herbs. A local café gave them sandwiches, but the residents bought the plants themselves. They finished earlier than expected because everyone brought tools. Since then, two neighbours have watered the herbs every evening. Marta wants to add a small table next, although the building manager must approve it first.";

const a2ListeningWorkshop =
  "Hello, this is a reminder about your bicycle repair workshop on Wednesday. The class begins at six thirty, not six as stated in the first email. Please arrive ten minutes early so we can check your booking. You do not need to bring a bicycle because we have practice bikes, but you should wear clothes that can get dirty. Tools and safety glasses are provided. The workshop usually finishes at eight thirty. If you cannot attend, please cancel before midday on Tuesday. We can then offer your place to someone on the waiting list. To cancel, reply to this message or call the reception desk.";

const a2ListeningFlat =
  "Hi, Alex. I visited the flat on King Street this morning. It is brighter than the one we saw on Monday, and the kitchen is much bigger. There are two bedrooms, but the smaller one would be better as an office. The bus stop is only three minutes away, although the nearest supermarket is about fifteen minutes on foot. The rent is nine hundred pounds a month and includes water, but not electricity. The owner wants an answer by tomorrow evening. I have sent you some photos. Call me after work, and we can decide whether to apply.";

const b1ReadingRepairCafe =
  "Every second Saturday, people bring broken household items to a hall in Millford. The event is called a repair café, although nobody goes there mainly for coffee. Volunteer electricians, cyclists and sewing enthusiasts examine lamps, bicycles and clothes while their owners watch. The organisers do not promise that every object can be saved. Instead, they aim to show people why something stopped working and how similar problems might be prevented. During its first year, the café recorded the weight of everything repaired and estimated that it had kept nearly two tonnes of waste out of landfill. This figure helped the group persuade the council to provide a larger room. Some local repair businesses initially worried that the event would take customers away. In practice, volunteers often identify jobs that require professional equipment and recommend nearby specialists. Several businesses now donate spare parts. The café's greatest effect may be less measurable: visitors who once replaced an item immediately are beginning to ask whether it deserves a second life.";

const b1ReadingFourDayWeek =
  "A small publishing company recently tested a four-day working week for three months. Employees received the same salary and were expected to complete the same work, but the office closed on Fridays. To create enough time, teams shortened meetings, replaced weekly reports with a shared dashboard and set two periods each day when messages did not require an immediate reply. Most books stayed on schedule, and staff reported feeling less exhausted. Yet the experiment exposed differences between departments. Editors could often plan quiet work in advance, while customer-support staff still had to answer urgent questions on Fridays. The company solved this by giving the support team different days off, but some employees felt the arrangement was less simple and less social. Managers have extended the trial rather than making it permanent. They want to see whether the system continues to work during the autumn, when the company publishes most of its new titles. The experiment suggests that reducing working days depends less on speed than on redesigning how work is organised.";

const b1ListeningCommunityHall =
  "Before we vote on the community hall proposal, I want to clarify what changed after last month's consultation. Residents supported renovating the main room, but many objected to removing the small kitchen. The architects have therefore produced a new plan that keeps the kitchen and reduces the storage area instead. This adds about six thousand pounds to the budget because some water pipes must be moved. A local sports club has offered two thousand pounds, provided that it can use the hall on Wednesday evenings. We still need to decide where the remaining money will come from. Delaying the work until next year might reduce pressure on this year's budget, but construction costs may rise. Tonight we are choosing between applying for an additional grant now and postponing the project. We are not approving a building contractor yet.";

const b1ListeningJobShare =
  "Thanks for meeting me, Daniel. I have reviewed your suggestion that you and Priya share the project-manager role after you return from parental leave. Your proposal explains how you would divide client accounts, but I am less certain about decisions that affect the whole team. If an urgent issue appeared on Priya's day off, staff would need to know whether you had authority to act without consulting her. I would also like one of you to attend Monday's senior meeting every week, even during holidays. These concerns do not mean I am rejecting the arrangement. A six-month trial could work if you add a clear handover process and a single contact calendar. Please revise the proposal together by Friday. I will then discuss it with Human Resources, who must confirm that the working pattern meets company policy.";

const a2: ExamQuestion[] = [
  {
    id: "exam-b-a2-01",
    unitId: "a2-01",
    skill: "grammar",
    prompt: "Вставь формы двух действий: While Ben ___ dinner, the lights ___ out.",
    options: ["was cooking / went", "cooked / were going", "has cooked / go"],
    answer: "was cooking / went",
    explanation:
      "Длительный фон выражается Past Continuous, а короткое завершённое событие — Past Simple.",
  },
  {
    id: "exam-b-a2-02",
    unitId: "a2-02",
    skill: "grammar",
    prompt: "Точное прошлое время указано: I ___ this laptop two years ago.",
    options: ["bought", "have bought", "have been buying"],
    answer: "bought",
    explanation: "С законченным периодом two years ago используется Past Simple.",
  },
  {
    id: "exam-b-a2-03",
    unitId: "a2-03",
    skill: "grammar",
    prompt: "The city centre is ___ at weekends than on weekdays.",
    options: ["far busier", "far busiest", "the busiest"],
    answer: "far busier",
    explanation:
      "Busy образует сравнительную форму busier; far усиливает степень различия перед сравнительной формой.",
  },
  {
    id: "exam-b-a2-04",
    unitId: "a2-04",
    skill: "grammar",
    prompt: "There is ___ milk left, so we can make one cup of coffee.",
    options: ["a little", "a few", "many"],
    answer: "a little",
    explanation:
      "Milk — неисчисляемое существительное; a little означает небольшое, но достаточное количество.",
  },
  {
    id: "exam-b-a2-05",
    unitId: "a2-05",
    skill: "grammar",
    prompt: "Решение принято прямо сейчас: The phone is ringing — I ___ it.",
    options: ["will answer", "answered", "have answered"],
    answer: "will answer",
    explanation: "Will подходит для спонтанного решения, принятого в момент речи.",
  },
  {
    id: "exam-b-a2-06",
    unitId: "a2-06",
    skill: "grammar",
    prompt: "You ___ bring food to the party; we have already ordered enough.",
    options: ["do not have to", "must not", "should to"],
    answer: "do not have to",
    explanation:
      "Do not have to означает отсутствие необходимости; запрета приносить еду здесь нет.",
  },
  {
    id: "exam-b-a2-07",
    unitId: "a2-07",
    skill: "grammar",
    prompt: "If the shop is still open, we ___ some batteries.",
    options: ["will buy", "would have bought", "had bought"],
    answer: "will buy",
    explanation:
      "В первом условном предложении результат выражается will + начальная форма глагола.",
  },
  {
    id: "exam-b-a2-08",
    unitId: "a2-11",
    skill: "grammar",
    prompt: "I have arranged everything: We ___ the dentist at nine tomorrow.",
    options: ["are seeing", "saw", "have seen"],
    answer: "are seeing",
    explanation:
      "Present Continuous используется для конкретной договорённости на будущее с назначенным временем.",
  },
  ...passageQuestions("reading", a2ReadingLibrary, [
    [
      "exam-b-a2-09",
      "a2-11",
      "Зачем библиотека стала работать дольше два дня в неделю?",
      [
        "Чтобы её могли посещать работающие днём люди",
        "Чтобы проводить утренние занятия",
        "Чтобы закрыть уличный автомат",
      ],
      "Чтобы её могли посещать работающие днём люди",
      "Прежнее закрытие в пять мешало людям, которые работают днём.",
    ],
    [
      "exam-b-a2-10",
      "a2-04",
      "Как библиотека справилась без найма новых сотрудников?",
      [
        "Каждый сотрудник работает одну позднюю смену и позже начинает утром",
        "Все сотрудники работают каждый вечер",
        "Языковые занятия ведут посетители",
      ],
      "Каждый сотрудник работает одну позднюю смену и позже начинает утром",
      "Расписание сотрудников изменили: одна поздняя смена компенсируется более поздним началом дня.",
    ],
    [
      "exam-b-a2-11",
      "a2-08",
      "Как вернуть книгу, когда здание закрыто?",
      ["Через автомат снаружи", "Оставить её у входа", "Отправить её по почте"],
      "Через автомат снаружи",
      "В тексте указан внешний автомат для возврата книг в нерабочее время.",
    ],
    [
      "exam-b-a2-12",
      "a2-05",
      "Почему на разговорный клуб понадобится запись?",
      ["В комнате мало мест", "Клуб будет платным", "Нужно нанять преподавателя"],
      "В комнате мало мест",
      "Участие бесплатное, но помещение небольшое, поэтому место нужно бронировать.",
    ],
  ]),
  ...passageQuestions("reading", a2ReadingNeighbour, [
    [
      "exam-b-a2-13",
      "a2-11",
      "Как Марта пригласила соседей?",
      [
        "Написала в группе жильцов",
        "Попросила управляющего позвонить всем",
        "Развесила объявления в кафе",
      ],
      "Написала в группе жильцов",
      "Она разместила сообщение в общей группе жителей дома.",
    ],
    [
      "exam-b-a2-14",
      "a2-01",
      "Что происходило одновременно во время работы?",
      [
        "Одни чинили стулья, а другие убирали сорняки и сажали травы",
        "Все сначала ремонтировали стулья, а потом ушли",
        "Кафе высаживало растения, пока соседи готовили еду",
      ],
      "Одни чинили стулья, а другие убирали сорняки и сажали травы",
      "Текст противопоставляет две параллельные группы работ через while.",
    ],
    [
      "exam-b-a2-15",
      "a2-04",
      "Что предоставило местное кафе?",
      ["Сэндвичи", "Растения", "Инструменты"],
      "Сэндвичи",
      "Растения купили жители, а кафе принесло еду.",
    ],
    [
      "exam-b-a2-16",
      "a2-06",
      "Что должно произойти до установки столика?",
      [
        "Управляющий должен дать разрешение",
        "Соседи должны продать травы",
        "Кафе должно оплатить мебель",
      ],
      "Управляющий должен дать разрешение",
      "Марта хочет поставить столик, но сначала требуется согласие управляющего зданием.",
    ],
  ]),
  ...passageQuestions("listening", a2ListeningWorkshop, [
    [
      "exam-b-a2-17",
      "a2-11",
      "Во сколько на самом деле начинается занятие?",
      ["В 18:30", "В 18:00", "В 18:20"],
      "В 18:30",
      "Сообщение исправляет время из первого письма: начало в половине седьмого.",
    ],
    [
      "exam-b-a2-18",
      "a2-08",
      "Что прямо сказано о велосипеде участника?",
      [
        "Приносить его не нужно",
        "Его нужно принести за десять минут до начала",
        "Он должен быть новым",
      ],
      "Приносить его не нужно",
      "Учебные велосипеды уже есть на месте; подходящая одежда всё же нужна.",
    ],
    [
      "exam-b-a2-19",
      "a2-06",
      "Что организаторы предоставят на занятии?",
      ["Инструменты и защитные очки", "Новую одежду", "Еду и напитки"],
      "Инструменты и защитные очки",
      "В сообщении прямо перечислены инструменты и средства защиты.",
    ],
    [
      "exam-b-a2-20",
      "a2-07",
      "Что произойдёт, если место отменить вовремя?",
      [
        "Его предложат человеку из списка ожидания",
        "Занятие перенесут на четверг",
        "Участник получит бесплатный велосипед",
      ],
      "Его предложат человеку из списка ожидания",
      "Ранняя отмена позволяет передать свободное место следующему желающему.",
    ],
  ]),
  ...passageQuestions("listening", a2ListeningFlat, [
    [
      "exam-b-a2-21",
      "a2-03",
      "Чем квартира лучше той, которую смотрели в понедельник?",
      ["Она светлее, а кухня больше", "Она дешевле и ближе к магазину", "В ней три спальни"],
      "Она светлее, а кухня больше",
      "Говорящий сравнивает квартиры именно по освещению и размеру кухни.",
    ],
    [
      "exam-b-a2-22",
      "a2-08",
      "Что находится в трёх минутах от квартиры?",
      ["Автобусная остановка", "Супермаркет", "Офис Алекса"],
      "Автобусная остановка",
      "До остановки три минуты, а до супермаркета около пятнадцати минут пешком.",
    ],
    [
      "exam-b-a2-23",
      "a2-04",
      "Какой расход входит в арендную плату?",
      ["Вода", "Электричество", "Все коммунальные услуги"],
      "Вода",
      "В девятьсот фунтов включена вода, но электричество оплачивается отдельно.",
    ],
    [
      "exam-b-a2-24",
      "a2-05",
      "Что собеседники собираются сделать после работы?",
      [
        "Обсудить, подавать ли заявку",
        "Сразу подписать договор",
        "Попросить владельца снизить цену",
      ],
      "Обсудить, подавать ли заявку",
      "Говорящий предлагает созвониться и вместе решить, стоит ли подавать заявку.",
    ],
  ]),
];

const b1: ExamQuestion[] = [
  {
    id: "exam-b-b1-01",
    unitId: "b1-01",
    skill: "grammar",
    prompt: "By the time the guide found us, we ___ in the wrong direction for an hour.",
    options: ["had been walking", "were walked", "have walked"],
    answer: "had been walking",
    explanation:
      "Past Perfect Continuous показывает длительный процесс, который шёл до другого события в прошлом.",
  },
  {
    id: "exam-b-b1-02",
    unitId: "b1-02",
    skill: "grammar",
    prompt: "I ___ this online course for six weeks, and I am only halfway through.",
    options: ["have been taking", "take since", "am taking yesterday"],
    answer: "have been taking",
    explanation:
      "Действие началось раньше, длится до сих пор и подчёркивается его продолжительность.",
  },
  {
    id: "exam-b-b1-03",
    unitId: "b1-03",
    skill: "grammar",
    prompt: "If the venue were closer, more people ___ the evening events.",
    options: ["would attend", "will attend", "attended yesterday"],
    answer: "would attend",
    explanation:
      "Во втором условном предложении воображаемый результат оформляется would + глагол.",
  },
  {
    id: "exam-b-b1-04",
    unitId: "b1-04",
    skill: "grammar",
    prompt: "All applications must ___ before the deadline.",
    options: ["be submitted", "submit", "be submitting by"],
    answer: "be submitted",
    explanation: "После модального глагола пассив строится как be + третья форма глагола.",
  },
  {
    id: "exam-b-b1-05",
    unitId: "b1-05",
    skill: "grammar",
    prompt:
      "Leo said, “I finished the draft yesterday.” → Leo said that he ___ the draft the day before.",
    options: ["had finished", "has finished", "will finish"],
    answer: "had finished",
    explanation:
      "В косвенной речи Past Simple обычно сдвигается в Past Perfect, а yesterday меняется на the day before.",
  },
  {
    id: "exam-b-b1-06",
    unitId: "b1-06",
    skill: "grammar",
    prompt: "The neighbour ___ dog found my keys brought them back this morning.",
    options: ["whose", "which", "where"],
    answer: "whose",
    explanation: "Whose выражает принадлежность: речь идёт о собаке этого соседа.",
  },
  {
    id: "exam-b-b1-07",
    unitId: "b1-07",
    skill: "grammar",
    prompt: "After discussing the risks, the team decided ___ the launch for a week.",
    options: ["to delay", "delaying to", "delay"],
    answer: "to delay",
    explanation: "После decide используется инфинитив с to.",
  },
  {
    id: "exam-b-b1-08",
    unitId: "b1-08",
    skill: "grammar",
    prompt: "I cannot ___ how to connect the printer to this network.",
    options: ["work out", "take after", "bring up with"],
    answer: "work out",
    explanation: "Work out в этом контексте означает понять или найти решение.",
  },
  ...passageQuestions("reading", b1ReadingRepairCafe, [
    [
      "exam-b-b1-09",
      "b1-09",
      "Какова основная цель текста?",
      [
        "Показать, как ремонтное кафе меняет отношение к сломанным вещам",
        "Доказать, что любая вещь подлежит ремонту",
        "Объяснить, почему обычные кафе теряют посетителей",
      ],
      "Показать, как ремонтное кафе меняет отношение к сломанным вещам",
      "Текст описывает практический и культурный эффект инициативы, особенно изменение привычки сразу выбрасывать вещи.",
    ],
    [
      "exam-b-b1-10",
      "b1-04",
      "Зачем организаторы записывали вес отремонтированных предметов?",
      [
        "Чтобы получить доказательство пользы проекта для переговоров с советом",
        "Чтобы назначить цену каждому ремонту",
        "Чтобы выбрать самых продуктивных волонтёров",
      ],
      "Чтобы получить доказательство пользы проекта для переговоров с советом",
      "Измеримый результат помог убедить городской совет предоставить помещение большего размера.",
    ],
    [
      "exam-b-b1-11",
      "b1-03",
      "Почему опасения местных ремонтных компаний не подтвердились?",
      [
        "Кафе направляет сложные работы профессионалам",
        "Кафе ремонтирует только одежду",
        "Компании запретили бесплатный ремонт",
      ],
      "Кафе направляет сложные работы профессионалам",
      "Волонтёры распознают случаи, где нужно профессиональное оборудование, и рекомендуют специалистов.",
    ],
    [
      "exam-b-b1-12",
      "b1-11",
      "Что автор подразумевает под greatest effect may be less measurable?",
      [
        "Главное изменение проявляется в привычках людей, а не только в цифрах",
        "Организаторы перестали взвешивать предметы",
        "Посетители скрывают стоимость ремонта",
      ],
      "Главное изменение проявляется в привычках людей, а не только в цифрах",
      "Финальная мысль противопоставляет измеренный вес отходов более глубокому изменению поведения.",
    ],
  ]),
  ...passageQuestions("reading", b1ReadingFourDayWeek, [
    [
      "exam-b-b1-13",
      "b1-09",
      "Какой вывод лучше всего передаёт позицию автора?",
      [
        "Короткая неделя требует изменить организацию работы",
        "Пятницу можно убрать в любой компании без подготовки",
        "Эксперимент провалился из-за отдела поддержки",
      ],
      "Короткая неделя требует изменить организацию работы",
      "Последнее предложение связывает успех прежде всего с перестройкой процессов.",
    ],
    [
      "exam-b-b1-14",
      "b1-04",
      "Как команды высвободили время?",
      [
        "Сократили встречи и изменили обмен информацией",
        "Наняли дополнительных редакторов",
        "Перенесли всю работу на пятницу",
      ],
      "Сократили встречи и изменили обмен информацией",
      "Они сделали встречи короче, ввели общую панель и периоды без срочных ответов.",
    ],
    [
      "exam-b-b1-15",
      "b1-06",
      "Почему отделу поддержки понадобилась другая схема?",
      [
        "Срочные обращения клиентов продолжали поступать по пятницам",
        "Сотрудники поддержки не умели пользоваться общей панелью",
        "Редакторы отказались делиться выходным днём",
      ],
      "Срочные обращения клиентов продолжали поступать по пятницам",
      "Их работа зависела от внешних срочных запросов, поэтому общий закрытый день не подходил.",
    ],
    [
      "exam-b-b1-16",
      "b1-02",
      "Почему руководство пока не сделало режим постоянным?",
      [
        "Нужно проверить его в самый загруженный сезон",
        "Компания хочет уменьшить зарплаты",
        "Большинство книг уже вышло с опозданием",
      ],
      "Нужно проверить его в самый загруженный сезон",
      "Осенью выходит больше всего новинок, и руководство хочет увидеть результат при высокой нагрузке.",
    ],
  ]),
  ...passageQuestions("listening", b1ListeningCommunityHall, [
    [
      "exam-b-b1-17",
      "b1-05",
      "Какое мнение жителей повлияло на новый план?",
      [
        "Они хотели сохранить маленькую кухню",
        "Они просили убрать главный зал",
        "Они были против спортивного клуба",
      ],
      "Они хотели сохранить маленькую кухню",
      "После возражений жителей архитекторы оставили кухню и уменьшили склад.",
    ],
    [
      "exam-b-b1-18",
      "b1-03",
      "Какое условие выдвинул спортивный клуб?",
      [
        "Пользоваться залом по средам вечером",
        "Самостоятельно выбрать подрядчика",
        "Получить всю кухню под склад",
      ],
      "Пользоваться залом по средам вечером",
      "Две тысячи фунтов предложены при условии еженедельного доступа клуба в среду.",
    ],
    [
      "exam-b-b1-19",
      "b1-09",
      "Какой риск связан с переносом проекта на следующий год?",
      ["Строительство может подорожать", "Грант придётся вернуть сегодня", "Кухню уже демонтируют"],
      "Строительство может подорожать",
      "Отсрочка облегчает текущий бюджет, но будущие строительные расходы могут вырасти.",
    ],
    [
      "exam-b-b1-20",
      "b1-11",
      "Какое решение участники должны принять сегодня?",
      [
        "Запрашивать дополнительный грант сейчас или отложить проект",
        "Какую строительную компанию нанять",
        "Закрывать ли общественный зал навсегда",
      ],
      "Запрашивать дополнительный грант сейчас или отложить проект",
      "Говорящий специально уточняет предмет голосования и исключает выбор подрядчика.",
    ],
  ]),
  ...passageQuestions("listening", b1ListeningJobShare, [
    [
      "exam-b-b1-21",
      "b1-09",
      "Как руководитель в целом относится к предложению?",
      [
        "Готов рассмотреть пробный период после доработки",
        "Уже окончательно его отклонил",
        "Согласен без каких-либо условий",
      ],
      "Готов рассмотреть пробный период после доработки",
      "Он обозначает вопросы, но прямо говорит, что не отвергает идею, и предлагает шестимесячный тест.",
    ],
    [
      "exam-b-b1-22",
      "b1-06",
      "Какая часть ответственности пока описана недостаточно ясно?",
      [
        "Решения, которые влияют на всю команду",
        "Распределение клиентских счетов",
        "Дата возвращения Дэниела из отпуска",
      ],
      "Решения, которые влияют на всю команду",
      "Разделение клиентов уже описано, а полномочия по общекомандным срочным вопросам требуют уточнения.",
    ],
    [
      "exam-b-b1-23",
      "b1-07",
      "Что пара должна добавить в предложение?",
      [
        "Чёткую передачу дел и единый календарь контактов",
        "Список новых клиентов и план продаж",
        "Обещание никогда не брать отпуск",
      ],
      "Чёткую передачу дел и единый календарь контактов",
      "Эти два условия названы как основа возможного шестимесячного испытания.",
    ],
    [
      "exam-b-b1-24",
      "b1-04",
      "Что произойдёт после доработки предложения?",
      [
        "Руководитель обсудит его с отделом кадров",
        "Роль автоматически разделят на две",
        "Команда проголосует на встрече в понедельник",
      ],
      "Руководитель обсудит его с отделом кадров",
      "HR должен подтвердить соответствие рабочего режима правилам компании.",
    ],
  ]),
];

export const intermediateExamQuestionsB: Record<"A2" | "B1", ExamQuestion[]> = {
  A2: a2,
  B1: b1,
};
