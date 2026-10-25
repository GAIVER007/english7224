import type { ExamQuestion } from "./exam-types";

const b2ReadingA =
  "When Northbridge Library introduced self-service kiosks, managers expected queues to disappear. Waiting times did fall during quiet hours, yet complaints rose at weekends. A review found that the machines were not the main problem: visitors often needed advice about research databases, accessibility tools, or damaged books, and the reduced front desk had too few specialists. The library therefore moved one kiosk aside and created a visible help point staffed by an experienced librarian. It also trained volunteers to solve simple account problems. Six months later, average waiting time was slightly higher than immediately after automation, but satisfaction had improved considerably. The director argues that the original project was not a failure because it revealed which interactions could be automated and which required judgement. Critics accept the new arrangement, although they question why staff expertise was treated as a cost before visitor needs had been studied. Staff surveys now form part of the same evaluation. The library tests service changes with a small user group before applying them across every branch.";

const b2ReadingB =
  "A coastal town offered residents a discount on water bills if they replaced traditional lawns with plants suited to dry weather. Participation was initially modest, despite an expensive advertising campaign. Interviews showed that many residents supported saving water but worried that alternative gardens would look untidy or reduce the value of their homes. The council then opened three demonstration gardens designed by local landscapers and published their maintenance costs. Applications doubled within four months. However, most came from wealthier neighbourhoods, where owners could pay the initial cost and wait for the discount. In response, the council created an advance grant for lower-income households and arranged group purchases of plants. Community organisations also began offering free design advice in several languages. Early data suggests that these changes have widened participation, though it is too soon to know whether the gardens will survive several unusually hot summers. The scheme illustrates that financial incentives may fail when people also face practical uncertainty, social expectations, and unequal access to upfront resources.";

const b2ListeningA =
  "Thanks for joining this project update. The mobile booking feature was supposed to enter public testing on Monday, but we have moved that date to the following Thursday. The payment system itself is stable; the delay comes from the confirmation screen, which does not clearly explain when a reservation is only being held and when it has been paid for. In our internal test, several colleagues assumed they had completed a purchase when they had not. We could release on schedule and correct the wording later, but that would risk real customers losing their bookings. Design will provide two revised versions tomorrow, and support staff will test them with people who have not seen the feature before. Their sessions will be recorded with permission for analysis. If both versions remain unclear, we will simplify the process rather than add more instructions. Marketing has already adjusted the campaign. Please describe the change as a usability decision, not a technical breakdown, because payments and data security have passed their checks.";

const b2ListeningB =
  "Before we choose a new office, I want to correct one impression from last week's discussion. The city-centre building is not necessarily the most expensive option. Its rent is higher, but it includes meeting rooms, security, and bicycle storage, while the cheaper site charges separately for those services. Even so, I am not recommending that we sign immediately. Around a third of the team works remotely most days, so we may be comparing spaces that are both larger than we need. I suggest asking each department how often people genuinely need a desk, then negotiating a six-month trial with the city-centre landlord. We should include seasonal peaks rather than rely on this month's attendance. The location could help recruitment and reduce travel time for clients, but those benefits are difficult to price. If the landlord refuses a shorter agreement, the suburban site may be safer. My main point is that the decision should reflect how we will work next year, rather than the office habits we had before remote work became normal.";

const c1ReadingA =
  "Calls for public access to publicly funded research often assume that removing subscription fees will make knowledge equally available. The assumption is attractive but incomplete. A paper may be free to download while remaining inaccessible to readers who lack specialist vocabulary, reliable internet access, or the time required to evaluate its methods. Moreover, when journals replace reader subscriptions with publication charges, the financial barrier can simply move from audiences to researchers. Well-funded institutions absorb those costs; independent scholars and universities in poorer regions may not. None of this constitutes an argument for restoring paywalls. It suggests, rather, that access should be treated as an ecosystem involving price, language, technical design, and institutional support. Some publishers now offer fee waivers and require plain-language summaries, but these measures vary widely and are rarely audited. Libraries can also provide guidance, although expecting them to repair every weakness merely transfers responsibility again. A more credible policy would publish waiver criteria, fund translation and accessible formats, and measure who reads and cites the work after release. Such data would not capture every benefit, but it would expose whose participation remains largely theoretical. The success of open research should therefore be judged not by the number of unlocked articles alone, but by whether a broader range of people can meaningfully use them.";

const c1ReadingB =
  "City authorities increasingly describe temporary street experiments as a way to make planning more responsive. Instead of debating a permanent cycle lane for years, they install removable barriers, observe traffic, and revise the design. The approach can expose problems that computer models overlook. Yet its apparent flexibility may conceal a political asymmetry. Residents who already possess time, confidence, and organised networks are more likely to attend meetings and frame early inconvenience as evidence of failure. People who would benefit later, including children or future residents, are harder to hear. Officials sometimes answer this criticism by collecting traffic counts and online surveys, but neither is neutral: counts show movement rather than experience, while online responses can be dominated by highly motivated groups. Nor does a trial begin from a neutral baseline; existing street design already distributes convenience and danger unevenly. Temporary trials remain valuable, provided they are not treated as automatic referendums. Their evidence should be combined with safety data, representative interviews, and explicit public goals established before the trial begins. Officials should state in advance which problems justify revision and which short-term disruptions are expected. Otherwise, the promise of learning by doing can become a way of allowing the loudest immediate reaction to define the public interest.";

const c1ListeningA =
  "I understand why the committee wants a single score for each funding proposal. A score appears transparent, and it enables us to rank fifty applications without reopening every discussion. My concern is not with measurement itself but with the confidence we place in the result. Reviewers interpret criteria such as innovation and community value differently, so a difference of two points may reflect judgement rather than quality. Last year we tried to solve that problem by adding more detailed categories. The forms became longer, but the final rankings were no more consistent. Several reviewers also admitted adjusting one category to compensate for another, which made apparently identical totals mean different things. I propose a different process: use scores to identify a broad group of strong proposals, then discuss the trade-offs within that group. We should also record why a lower-scoring project is selected, especially when it serves a community missing from the data. Publishing those reasons would allow future committees to examine patterns rather than defend isolated choices. This will be slower than accepting the spreadsheet order. However, it will make our discretion visible instead of pretending that the numbers have removed it. Transparency requires an account of judgement, not merely a calculation everyone can inspect.";

const c1ListeningB =
  "The museum's plan to return several ceremonial objects has been presented as though it forces us to choose between preserving a world collection and correcting a historical injustice. That framing is too narrow. Some objects were acquired through documented purchase; others left their communities under conditions that would not now be considered meaningful consent. Treating every case identically would obscure those differences. Equally, returning an object need not end scholarly or public access. The partner museum has proposed rotating loans, shared digital records, and joint conservation training. These arrangements will require money and trust, and neither should be underestimated. They may also change who produces knowledge about the collection, not merely where the objects stand. Yet the current location carries costs that are easy for us to ignore because another community bears them. I recommend that we publish the evidence for each decision, acknowledge gaps in the archive, and invite claims without promising a predetermined outcome. Claimants should be able to challenge our account, while curators explain any conservation constraints openly. A defensible policy will disappoint people who want one rule to settle every case. Its consistency should lie in the questions we ask and the openness of the process, rather than in producing the same answer regardless of history.";

const b2: ExamQuestion[] = [
  {
    id: "exam-b2-01",
    unitId: "b2-01",
    skill: "grammar",
    prompt: "If the team had tested the form earlier, users ___ fewer problems now.",
    options: ["would be having", "would have had", "had"],
    answer: "would be having",
    explanation:
      "Причина относится к нереальному прошлому, а результат — к текущей ситуации: had tested + would be having.",
  },
  {
    id: "exam-b2-02",
    unitId: "b2-02",
    skill: "grammar",
    prompt:
      "These files contain changes first made this morning, so they ___ the versions sent yesterday.",
    options: ["must have been", "can't have been", "should be"],
    answer: "can't have been",
    explanation:
      "Изменения впервые внесены сегодня: эти версии не могли быть отправлены вчера. Нужен отрицательный вывод о прошлом.",
  },
  {
    id: "exam-b2-03",
    unitId: "b2-03",
    skill: "grammar",
    prompt: "Rewrite neutrally: People believe the painting left the country in 1948.",
    options: [
      "The painting believes to leave the country in 1948.",
      "The painting is believed to leave the country in 1948.",
      "The painting is believed to have left the country in 1948.",
    ],
    answer: "The painting is believed to have left the country in 1948.",
    explanation:
      "Действие произошло раньше сообщения, поэтому после is believed используется to have + V3.",
  },
  {
    id: "exam-b2-04",
    unitId: "b2-04",
    skill: "grammar",
    prompt:
      "Choose the best reduced relative clause: The proposals that were submitted after Friday will be reviewed next month.",
    options: [
      "The proposals submitted after Friday will be reviewed next month.",
      "The proposals submitting after Friday will be reviewed next month.",
      "The proposals having submit after Friday will be reviewed next month.",
    ],
    answer: "The proposals submitted after Friday will be reviewed next month.",
    explanation:
      "Пассивное значение сокращается до причастия прошедшего времени: proposals submitted.",
  },
  {
    id: "exam-b2-05",
    unitId: "b2-05",
    skill: "grammar",
    prompt: "Which sentence makes an appropriately cautious academic claim?",
    options: [
      "The survey proves that remote work always improves productivity.",
      "The survey appears to indicate a link between remote work and productivity.",
      "The survey obviously settles the remote-work debate.",
    ],
    answer: "The survey appears to indicate a link between remote work and productivity.",
    explanation:
      "Appears to indicate и a link отражают ограниченность данных без необоснованной уверенности.",
  },
  {
    id: "exam-b2-06",
    unitId: "b2-06",
    skill: "grammar",
    prompt:
      "Complete the natural collocation: The revised policy could ___ a significant impact on small suppliers.",
    options: ["do", "make", "have"],
    answer: "have",
    explanation: "Устойчивое сочетание — have an impact on.",
  },
  {
    id: "exam-b2-07",
    unitId: "b2-07",
    skill: "grammar",
    prompt:
      "Choose the connector that introduces a concession: ___ the plan is affordable, it may be difficult to implement quickly.",
    options: ["Because", "Although", "Therefore"],
    answer: "Although",
    explanation:
      "Although признаёт сильную сторону плана перед противопоставлением практического ограничения.",
  },
  {
    id: "exam-b2-08",
    unitId: "b2-08",
    skill: "grammar",
    prompt:
      "Complete: After ___ lunch, delegates visited ___ National Gallery named in the programme.",
    options: ["the / a", "— / the", "a / —"],
    answer: "— / the",
    explanation: "Названия приёмов пищи обычно без артикля; конкретная галерея требует the.",
  },
  ...[
    {
      id: "exam-b2-09",
      unitId: "b2-09",
      prompt: "Why did satisfaction improve even though average waiting time rose slightly?",
      options: [
        "Visitors could get expert help for problems machines could not solve.",
        "Every kiosk was removed from every branch.",
        "The library stopped measuring waiting times.",
      ],
      answer: "Visitors could get expert help for problems machines could not solve.",
      explanation:
        "Текст связывает рост удовлетворённости с заметной точкой помощи и доступом к специалисту.",
    },
    {
      id: "exam-b2-10",
      unitId: "b2-10",
      prompt: "What is the director's main interpretation of the original project?",
      options: [
        "Automation should never be used in public services.",
        "It produced useful evidence about where human judgement was needed.",
        "Weekend visitors caused the implementation problems.",
      ],
      answer: "It produced useful evidence about where human judgement was needed.",
      explanation:
        "Директор считает проект полезным диагностическим этапом, а не полностью неудачной реформой.",
    },
    {
      id: "exam-b2-11",
      unitId: "b2-07",
      prompt: "Which criticism do the project's critics make?",
      options: [
        "Volunteers should have replaced all librarians.",
        "The kiosks were too expensive to maintain.",
        "Managers reduced expertise before properly studying users' needs.",
      ],
      answer: "Managers reduced expertise before properly studying users' needs.",
      explanation:
        "Критики оспаривают исходное допущение, что профессиональные сотрудники были прежде всего расходом.",
    },
    {
      id: "exam-b2-12",
      unitId: "b2-10",
      prompt: "What broader lesson is best supported by the final sentence?",
      options: [
        "Service changes should be tested with users before full expansion.",
        "Public organisations should avoid changing successful routines.",
        "Small branches need more kiosks than large branches.",
      ],
      answer: "Service changes should be tested with users before full expansion.",
      explanation:
        "Новая практика малых испытаний прямо отвечает на ошибку масштабного запуска без проверки потребностей.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: b2ReadingA })),
  ...[
    {
      id: "exam-b2-13",
      unitId: "b2-10",
      prompt: "Why did the original advertising campaign have limited effect?",
      options: [
        "Residents had concerns that a bill discount alone did not resolve.",
        "The council had prohibited alternative gardens.",
        "Most residents did not believe water should be saved.",
      ],
      answer: "Residents had concerns that a bill discount alone did not resolve.",
      explanation:
        "Помимо цены людей беспокоили внешний вид, стоимость дома и практическая сторона изменений.",
    },
    {
      id: "exam-b2-14",
      unitId: "b2-09",
      prompt: "What was the likely function of the demonstration gardens?",
      options: [
        "To replace private gardens with public parks",
        "To make the proposed alternative visible and less uncertain",
        "To prove that landscaping required no maintenance",
      ],
      answer: "To make the proposed alternative visible and less uncertain",
      explanation:
        "Примеры и опубликованные расходы сняли сомнения, которые одна реклама не устранила.",
    },
    {
      id: "exam-b2-15",
      unitId: "b2-07",
      prompt: "Why did participation initially remain unequal?",
      options: [
        "The discount was available only in wealthy neighbourhoods.",
        "Lower-income households used more water by law.",
        "Some households could not easily cover the upfront cost.",
      ],
      answer: "Some households could not easily cover the upfront cost.",
      explanation:
        "Скидка приходила позже, поэтому первоначальные расходы создавали барьер для части жителей.",
    },
    {
      id: "exam-b2-16",
      unitId: "b2-05",
      prompt: "Why does the writer avoid declaring the revised scheme a complete success?",
      options: [
        "Application numbers have fallen since the grant was introduced.",
        "Long-term survival under extreme weather has not yet been shown.",
        "The council has stopped collecting participation data.",
      ],
      answer: "Long-term survival under extreme weather has not yet been shown.",
      explanation:
        "Автор осторожно отделяет ранний рост участия от ещё не проверенной долгосрочной устойчивости.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: b2ReadingB })),
  ...[
    {
      id: "exam-b2-17",
      unitId: "b2-12",
      prompt: "What is the immediate reason for delaying public testing?",
      options: [
        "A security weakness in the payment system",
        "Confusing information about reservation and payment status",
        "A disagreement with the marketing department",
      ],
      answer: "Confusing information about reservation and payment status",
      explanation:
        "Проблема находится в подтверждающем экране: пользователи неверно понимают статус покупки.",
    },
    {
      id: "exam-b2-18",
      unitId: "b2-07",
      prompt: "Why does the speaker reject releasing first and changing the wording later?",
      options: [
        "The campaign cannot be moved to another date.",
        "Internal colleagues refused to repeat the test.",
        "Real customers could lose bookings because of the ambiguity.",
      ],
      answer: "Real customers could lose bookings because of the ambiguity.",
      explanation:
        "Риск касается реального результата для клиента, поэтому своевременность уступает ясности.",
    },
    {
      id: "exam-b2-19",
      unitId: "b2-10",
      prompt: "What will the team do if revised wording is still unclear?",
      options: [
        "Simplify the process itself",
        "Add a longer instruction page",
        "Cancel the mobile feature permanently",
      ],
      answer: "Simplify the process itself",
      explanation:
        "Спикер прямо предпочитает упростить процесс, если новая формулировка не решит проблему.",
    },
    {
      id: "exam-b2-20",
      unitId: "b2-12",
      prompt: "Why does the speaker specify how the delay should be described?",
      options: [
        "To conceal a confirmed data breach",
        "To distinguish a usability issue from a technical failure",
        "To suggest that no testing has taken place",
      ],
      answer: "To distinguish a usability issue from a technical failure",
      explanation:
        "Платежи и безопасность прошли проверку; точная формулировка предотвращает неверный вывод.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: b2ListeningA })),
  ...[
    {
      id: "exam-b2-21",
      unitId: "b2-11",
      prompt: "Why might the city-centre office cost less than it first appears?",
      options: [
        "Its rent will automatically fall next year.",
        "Several services are included in its rent.",
        "Remote workers will pay part of the rent.",
      ],
      answer: "Several services are included in its rent.",
      explanation:
        "Сравнение одной арендной ставки скрывает дополнительные расходы более дешёвого помещения.",
    },
    {
      id: "exam-b2-22",
      unitId: "b2-10",
      prompt: "What information does the speaker want before selecting a space?",
      options: [
        "How often departments genuinely require desks",
        "How much the previous office originally cost",
        "Which employees own bicycles",
      ],
      answer: "How often departments genuinely require desks",
      explanation:
        "Сначала нужно определить реальную потребность в рабочих местах при гибридной работе.",
    },
    {
      id: "exam-b2-23",
      unitId: "b2-11",
      prompt: "What condition would make the suburban site the safer option?",
      options: [
        "Clients request longer journeys.",
        "More departments return to daily office work.",
        "The city-centre landlord rejects a short trial agreement.",
      ],
      answer: "The city-centre landlord rejects a short trial agreement.",
      explanation:
        "Короткий договор ограничивает риск; без него более дешёвая площадка становится безопаснее.",
    },
    {
      id: "exam-b2-24",
      unitId: "b2-05",
      prompt: "What assumption is the speaker mainly challenging?",
      options: [
        "Past office habits are a reliable guide to future space needs.",
        "A central location can help recruitment.",
        "Some benefits are difficult to express as a price.",
      ],
      answer: "Past office habits are a reliable guide to future space needs.",
      explanation:
        "Главный вывод требует оценивать будущую модель работы, а не автоматически повторять старую.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: b2ListeningB })),
];

const c1: ExamQuestion[] = [
  {
    id: "exam-c1-01",
    unitId: "c1-01",
    skill: "grammar",
    prompt: "Choose the correct emphatic inversion.",
    options: [
      "Only after the audit the board acknowledged the risk.",
      "Only after the audit did the board acknowledge the risk.",
      "Only did the board after the audit acknowledge the risk.",
    ],
    answer: "Only after the audit did the board acknowledge the risk.",
    explanation: "После вынесенного в начало ограничительного оборота требуется инверсия с did.",
  },
  {
    id: "exam-c1-02",
    unitId: "c1-02",
    skill: "grammar",
    prompt:
      "Complete the cleft sentence: What the report fails to explain ___ why the regional figures differ.",
    options: ["are", "being", "is"],
    answer: "is",
    explanation:
      "В pseudo-cleft придаточная часть What ... функционирует как единое подлежащее: What ... is why.",
  },
  {
    id: "exam-c1-03",
    unitId: "c1-03",
    skill: "grammar",
    prompt: "A: I assumed the licence covered commercial use. B: So ___.",
    options: ["did I", "I did assume", "assumed me"],
    answer: "did I",
    explanation:
      "So + auxiliary + subject выражает совпадающий опыт без повторения всей конструкции.",
  },
  {
    id: "exam-c1-04",
    unitId: "c1-04",
    skill: "grammar",
    prompt: "Which version uses concise formal nominalisation without changing the meaning?",
    options: [
      "Because the regulator rejected the proposal, investors became uncertain.",
      "The regulator was rejecting, which made an uncertainty of investors.",
      "The regulator's rejection of the proposal increased investor uncertainty.",
    ],
    answer: "The regulator's rejection of the proposal increased investor uncertainty.",
    explanation:
      "Rejection и uncertainty уплотняют причинную связь в естественной формальной конструкции.",
  },
  {
    id: "exam-c1-05",
    unitId: "c1-05",
    skill: "grammar",
    prompt: "Which response is most diplomatically appropriate in a formal review?",
    options: [
      "You have completely misunderstood the evidence.",
      "This interpretation may overlook evidence from the later interviews.",
      "Obviously, nobody could accept this interpretation.",
    ],
    answer: "This interpretation may overlook evidence from the later interviews.",
    explanation:
      "Формулировка критикует интерпретацию, указывает на основание и избегает личной атаки.",
  },
  {
    id: "exam-c1-06",
    unitId: "c1-06",
    skill: "grammar",
    prompt:
      "Complete the idiomatic phrase: The minister stopped short ___ promising additional funding.",
    options: ["from", "of", "to"],
    answer: "of",
    explanation:
      "Устойчивое выражение stop short of doing означает не дойти до конкретного действия.",
  },
  {
    id: "exam-c1-07",
    unitId: "c1-10",
    skill: "grammar",
    prompt: "Choose the sentence that fairly concedes a point before rebutting it.",
    options: [
      "Admittedly, the reform reduces paperwork; nevertheless, it leaves the underlying access problem unresolved.",
      "The reform reduces paperwork because the access problem is unresolved.",
      "Nevertheless the reform, admittedly it resolves every access problem.",
    ],
    answer:
      "Admittedly, the reform reduces paperwork; nevertheless, it leaves the underlying access problem unresolved.",
    explanation:
      "Admittedly признаёт достоинство позиции, а nevertheless вводит содержательное ограничение.",
  },
  {
    id: "exam-c1-08",
    unitId: "c1-12",
    skill: "grammar",
    prompt:
      "Complete the formal recommendation: It is essential that every conflict of interest ___ before deliberations begin.",
    options: ["is declared", "be declared", "will be declared"],
    answer: "be declared",
    explanation:
      "После It is essential that в формальной рекомендации используется mandative subjunctive: be declared.",
  },
  ...[
    {
      id: "exam-c1-09",
      unitId: "c1-08",
      prompt: "Which assumption does the writer challenge at the beginning?",
      options: [
        "Public funding should influence publication policy.",
        "Removing subscription fees by itself creates equal access to knowledge.",
        "Specialist research should include methodological detail.",
      ],
      answer: "Removing subscription fees by itself creates equal access to knowledge.",
      explanation:
        "Автор называет это допущение привлекательным, но неполным, и затем показывает другие барьеры.",
    },
    {
      id: "exam-c1-10",
      unitId: "c1-07",
      prompt: "What is implied by the phrase ‘the financial barrier can simply move’?",
      options: [
        "Open access may redistribute exclusion rather than eliminate it.",
        "Readers will eventually be charged twice for every article.",
        "Publication charges always cost less than subscriptions.",
      ],
      answer: "Open access may redistribute exclusion rather than eliminate it.",
      explanation:
        "Платить перестаёт читатель, но барьер возникает у авторов с меньшими ресурсами.",
    },
    {
      id: "exam-c1-11",
      unitId: "c1-10",
      prompt: "Why does the writer say the argument does not support restoring paywalls?",
      options: [
        "To prevent the identified limitations from being used against open access itself",
        "To claim that all existing open-access policies are sufficient",
        "To show that subscription journals have no production costs",
      ],
      answer: "To prevent the identified limitations from being used against open access itself",
      explanation:
        "Это уступка и уточнение позиции: критика узкой метрики служит улучшению открытого доступа.",
    },
    {
      id: "exam-c1-12",
      unitId: "c1-12",
      prompt: "Which measure best matches the writer's proposed definition of success?",
      options: [
        "Counting only how many articles no longer require payment",
        "Comparing journal logos and website traffic",
        "Assessing whether diverse audiences can understand and use released research",
      ],
      answer: "Assessing whether diverse audiences can understand and use released research",
      explanation:
        "Финальный критерий — осмысленное использование более широким кругом людей, а не только открытый файл.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: c1ReadingA })),
  ...[
    {
      id: "exam-c1-13",
      unitId: "c1-08",
      prompt: "What does the writer regard as the main strength of temporary trials?",
      options: [
        "They eliminate political disagreement before permanent construction.",
        "They reveal practical effects that models may miss.",
        "They guarantee equal participation by all future users.",
      ],
      answer: "They reveal practical effects that models may miss.",
      explanation:
        "Автор признаёт ценность практического эксперимента именно как источника незапланированных наблюдений.",
    },
    {
      id: "exam-c1-14",
      unitId: "c1-07",
      prompt: "What ‘political asymmetry’ is implied?",
      options: [
        "Temporary materials benefit drivers more than cyclists.",
        "Officials can hear only comments submitted on paper.",
        "Those able to organise now may outweigh less visible beneficiaries.",
      ],
      answer: "Those able to organise now may outweigh less visible beneficiaries.",
      explanation:
        "Текущие организованные группы легче влияют на оценку, чем дети, будущие жители и менее уверенные участники.",
    },
    {
      id: "exam-c1-15",
      unitId: "c1-09",
      prompt: "Why are traffic counts and online surveys insufficient when used alone?",
      options: [
        "Each captures a partial and potentially distorted form of evidence.",
        "Neither can be collected during a temporary experiment.",
        "Both measure only the opinions of future residents.",
      ],
      answer: "Each captures a partial and potentially distorted form of evidence.",
      explanation:
        "Счётчики не передают опыт, а онлайн-опросы могут быть захвачены наиболее мотивированными группами.",
    },
    {
      id: "exam-c1-16",
      unitId: "c1-12",
      prompt: "What safeguard does the writer consider especially important before a trial starts?",
      options: [
        "A promise that the project will become permanent",
        "Public goals against which later evidence can be interpreted",
        "A ban on comments from directly affected residents",
      ],
      answer: "Public goals against which later evidence can be interpreted",
      explanation:
        "Заранее заданные цели не позволяют свести общественный интерес к самой громкой немедленной реакции.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: c1ReadingB })),
  ...[
    {
      id: "exam-c1-17",
      unitId: "c1-06",
      prompt: "What is the speaker's central reservation about a single score?",
      options: [
        "It makes applications impossible to rank at all.",
        "It can disguise subjective judgement as precise measurement.",
        "It prevents reviewers from reading the proposals.",
      ],
      answer: "It can disguise subjective judgement as precise measurement.",
      explanation:
        "Разница в баллах может отражать разные толкования критериев, хотя выглядит объективной.",
    },
    {
      id: "exam-c1-18",
      unitId: "c1-08",
      prompt: "What evidence weakened confidence in adding more scoring categories?",
      options: [
        "Longer forms did not make final rankings more consistent.",
        "Reviewers refused to use any written criteria.",
        "Communities requested shorter applications.",
      ],
      answer: "Longer forms did not make final rankings more consistent.",
      explanation:
        "Прошлогодний опыт показал больше деталей без улучшения согласованности результатов.",
    },
    {
      id: "exam-c1-19",
      unitId: "c1-12",
      prompt: "What role would scores play in the proposed process?",
      options: [
        "They would automatically determine the final winners.",
        "They would be discarded before any comparison.",
        "They would identify a strong group for further deliberation.",
      ],
      answer: "They would identify a strong group for further deliberation.",
      explanation: "Спикер сохраняет баллы как фильтр, но не как замену обсуждению компромиссов.",
    },
    {
      id: "exam-c1-20",
      unitId: "c1-07",
      prompt: "What does the final sentence imply about genuine transparency?",
      options: [
        "Visible arithmetic is insufficient unless decision-makers explain their judgement.",
        "Every proposal must receive exactly the same score from every reviewer.",
        "Spreadsheets should be kept confidential until funding is distributed.",
      ],
      answer: "Visible arithmetic is insufficient unless decision-makers explain their judgement.",
      explanation:
        "Прозрачность требует сделать явными основания решения, а не только показать вычисление.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: c1ListeningA })),
  ...[
    {
      id: "exam-c1-21",
      unitId: "c1-10",
      prompt: "Which framing does the speaker reject?",
      options: [
        "That every object has a different documented history",
        "That preservation and historical redress must be mutually exclusive",
        "That joint conservation requires sustained resources",
      ],
      answer: "That preservation and historical redress must be mutually exclusive",
      explanation:
        "Спикер отвергает бинарный выбор и предлагает совместные формы доступа и сохранения.",
    },
    {
      id: "exam-c1-22",
      unitId: "c1-09",
      prompt:
        "Why does the speaker distinguish purchase from acquisition without meaningful consent?",
      options: [
        "To argue that archival evidence should be ignored",
        "To ensure all objects are returned through one rule",
        "To show that superficially similar cases may justify different outcomes",
      ],
      answer: "To show that superficially similar cases may justify different outcomes",
      explanation:
        "Различия в происхождении делают единый автоматический ответ исторически неточным.",
    },
    {
      id: "exam-c1-23",
      unitId: "c1-07",
      prompt: "What is implied by the claim that current location also carries costs?",
      options: [
        "Some harms remain less visible because they are experienced elsewhere.",
        "Conservation expenses disappear when objects are returned.",
        "The partner museum has agreed to pay every future cost.",
      ],
      answer: "Some harms remain less visible because they are experienced elsewhere.",
      explanation: "Институции легко недооценить цену статус-кво, когда её несёт другая община.",
    },
    {
      id: "exam-c1-24",
      unitId: "c1-12",
      prompt: "Where should consistency lie, according to the speaker?",
      options: [
        "In reaching the same result for every claim",
        "In applying transparent questions and process to differing histories",
        "In refusing decisions whenever the archive has gaps",
      ],
      answer: "In applying transparent questions and process to differing histories",
      explanation:
        "Последовательность определяется методом и открытостью, а не одинаковым исходом для разных случаев.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: c1ListeningB })),
];

export const advancedExamQuestions: Record<"B2" | "C1", ExamQuestion[]> = {
  B2: b2,
  C1: c1,
};
