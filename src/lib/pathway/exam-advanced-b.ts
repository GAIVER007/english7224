import type { ExamQuestion } from "./exam-types";

const b2ReadingA =
  "A regional hospital replaced printed appointment letters with text-message reminders. Missed appointments fell during the first three months, and the project was quickly described as a success. A later review, however, found that the improvement was concentrated among younger patients. Some older patients shared a phone with a relative, while others had changed numbers without telling the hospital. Patients receiving sensitive treatment also disliked messages that revealed the name of a clinic on a locked screen. The hospital did not abandon texting. Instead, receptionists now ask each patient which channel is safe and reliable: text, email, letter, or a phone call. The booking system records that preference, and staff confirm it after a change of address or a long gap between visits. This requires more work when details are first collected, but fewer appointments are lost through failed communication. The review team warns against measuring success only through the overall attendance rate. A reminder system can improve the average while making access less dependable for a smaller group. The hospital will therefore publish attendance figures by communication preference and age group, while avoiding categories so narrow that individual patients could be identified.";

const b2ReadingB =
  "A software company introduced two afternoons a week without internal meetings. Managers hoped that uninterrupted time would help employees complete demanding work. An initial survey was enthusiastic, and the number of calendar invitations dropped sharply. Yet project delays did not immediately improve. Interviews revealed that teams had moved many discussions into long message threads, where decisions were slower and easier to misunderstand. New employees were particularly affected because they could not tell which questions deserved a quick call. The company kept the protected afternoons but added two rules. A written discussion must name the person responsible for the final decision, and anyone may request a fifteen-minute call when a thread has produced no agreement after six messages. Team leaders also hold short optional office hours for newcomers. Three months later, employees reported fewer interruptions and faster decisions, although the effect varied between departments. The experiment suggests that removing meetings is not the same as removing coordination. Focus improves when organisations reduce unnecessary contact while preserving a clear route for questions that genuinely require conversation.";

const b2ListeningA =
  "Before tomorrow's supplier meeting, let me clarify our position. The recycled packaging sample meets our strength requirements, but its colour varies slightly between batches. Marketing would prefer a perfectly consistent shade, while the supplier says achieving that would require additional processing and weaken the environmental benefit. I don't want us to present this as a simple choice between appearance and responsibility. Customers may accept natural variation if we explain it clearly, but we do not yet have evidence. I propose a limited launch in two stores, with a short note on the package and a customer survey. We should agree in advance what level of negative feedback would cause us to revise the design. Price is another issue: the new material costs six percent more, although that could fall if volumes increase. Our aim tomorrow is not to demand an immediate discount. We need a written schedule showing when lower prices become possible and what order size triggers each reduction. If the supplier can provide that, I think a trial is justified. If not, we should compare another producer rather than make a promise based on an informal estimate.";

const b2ListeningB =
  "I'd like to update you on the neighbourhood history exhibition. We have received plenty of photographs, but most come from the same two families and mainly show public celebrations. They are valuable, yet they cannot represent everyday life across the whole district. The original opening date was the first of May. I recommend moving it back by three weeks so we can hold two collection days at the community centre and record short interviews with residents. This is not an attempt to create a perfectly complete archive; no exhibition can do that. It is a way to make the gaps visible and invite different memories. We must also be careful with captions. If a date or name is uncertain, we should say so instead of presenting a guess as fact. The school has offered student volunteers, but they will need training before handling original photographs or asking personal questions. I have included that training in the revised schedule. The delay may disappoint our sponsor, so I will show them how the extra time improves the exhibition rather than simply making it larger.";

const c1ReadingA =
  "Organisations often respond to declining trust by publishing more data. The impulse is understandable: secrecy invites suspicion, whereas a spreadsheet appears to expose decisions to scrutiny. Yet disclosure can create the performance of openness without its substance. A procurement office may release thousands of transactions in a format that only specialists can interpret, then cite the volume of publication as evidence of accountability. Conversely, a carefully selected dashboard may be accessible while quietly excluding the categories most likely to provoke difficult questions. The problem is not solved by choosing either maximum detail or elegant simplicity. Useful transparency requires an account of what the data can establish, what remains absent, and who selected the measures. It also requires a route by which outsiders can challenge those choices. This is especially important when institutions use predictive systems: publishing the code may reveal little if the training data, operating thresholds, and consequences of error remain obscure. None of this diminishes the value of disclosure. It changes the standard by which disclosure should be judged. Information is transparent when affected people can use it to understand and contest a decision, not merely when an institution can demonstrate that a file was made public.";

const c1ReadingB =
  "The language of resilience has become common in discussions of public services. Schools, hospitals, and transport networks are praised for continuing to operate during disruption. The term can identify a real capability: systems need spare capacity, adaptable staff, and plans for unexpected conditions. But resilience can also become an instruction to absorb avoidable pressure without questioning its source. When nurses repeatedly cover vacant posts through personal sacrifice, describing the hospital as resilient risks converting an emergency response into an operating model. The same ambiguity affects communities asked to recover from recurrent flooding while development policy leaves the underlying exposure unchanged. A serious resilience strategy must therefore distinguish between shocks that cannot reasonably be prevented and harms produced by ordinary decisions. It should ask not only how rapidly activity resumes, but which costs are transferred to workers, residents, or future budgets. Redundancy may look inefficient in a calm year, yet prove essential during a crisis; constant improvisation may look efficient, while silently exhausting the people on whom recovery depends. Resilience is most useful as a question about system design and distribution of risk. Used merely as praise for endurance, it can conceal the conditions that make endurance necessary.";

const c1ListeningA =
  "The proposal before us treats public consultation as a final check on a design that is already substantially complete. That may satisfy the formal requirement, but it limits what consultation can achieve. Residents can comment on the colour of a bridge or the location of a bench, yet the decision to build the route through the park is effectively closed. I am not suggesting that every technical choice be decided by a public vote. Engineers must assess safety, cost, and environmental constraints. My concern is the sequence. If communities are invited earlier, they can identify uses of the space that our traffic model does not record, and engineers can explain which alternatives are genuinely feasible. Early participation may reveal conflict rather than produce agreement, but discovering that conflict before contracts are signed is valuable. We should also avoid measuring legitimacy by the number of responses alone. A thousand identical online submissions may represent less considered engagement than twenty interviews with groups directly affected but rarely present at meetings. I recommend publishing a decision map: which questions remain open, who has authority over each one, what evidence will be considered, and how the final reasons will be reported. Consultation cannot promise that every preference wins. It can promise that participation occurs while choices can still change.";

const c1ListeningB =
  "I support the principle of recognising researchers who share data, software, and replication work. Our current promotion system rewards the final article while treating the infrastructure behind it as invisible. The proposed points table, however, may reproduce the very problem it aims to solve. If one dataset is worth three points and one article ten, committees will still be tempted to count outputs without examining their value. A widely reused dataset may transform a field; another may technically be public but lack the documentation needed for anyone to use it. I suggest that candidates submit a short account of their contribution and its evidence: reuse by other teams, improvements to research quality, or creation of access for a community previously excluded. Reviewers should then assess the contribution within the candidate's discipline, since practices differ substantially. This introduces judgement, but judgement already exists in article assessment; the difference is whether we acknowledge and structure it. We should monitor the policy for unintended effects, particularly whether junior researchers are pressured to perform unpaid maintenance work. Recognition is worthwhile only if institutions provide time and resources for the work they claim to value.";

const b2: ExamQuestion[] = [
  {
    id: "exam-b-b2-01",
    unitId: "b2-01",
    skill: "grammar",
    prompt:
      "If Maya were less experienced, she ___ the warning signs during yesterday's inspection.",
    options: ["might have missed", "would miss", "had missed"],
    answer: "might have missed",
    explanation:
      "Текущее качество Maya влияет на возможный результат в прошлом: were + might have missed.",
  },
  {
    id: "exam-b-b2-02",
    unitId: "b2-02",
    skill: "grammar",
    prompt:
      "The lights are off and nobody is answering. They ___ for the day, but I am not certain.",
    options: ["must leave", "may have left", "can't have left"],
    answer: "may have left",
    explanation:
      "Есть признаки, но нет уверенности: may have left выражает осторожное предположение о прошлом.",
  },
  {
    id: "exam-b-b2-03",
    unitId: "b2-03",
    skill: "grammar",
    prompt: "Rewrite formally: Experts expect the new standard to reduce reporting errors.",
    options: [
      "The new standard is expected to reduce reporting errors.",
      "The new standard expects reducing reporting errors.",
      "Reporting errors are expected the new standard to reduce.",
    ],
    answer: "The new standard is expected to reduce reporting errors.",
    explanation:
      "В пассивной конструкции сообщения используется subject + is expected + to-infinitive.",
  },
  {
    id: "exam-b-b2-04",
    unitId: "b2-04",
    skill: "grammar",
    prompt:
      "Choose the correctly reduced clause: Employees who work across time zones may prefer written updates.",
    options: [
      "Employees worked across time zones may prefer written updates.",
      "Employees working across time zones may prefer written updates.",
      "Employees having work across time zones may prefer written updates.",
    ],
    answer: "Employees working across time zones may prefer written updates.",
    explanation:
      "Активное относительное придаточное who work сокращается до present participle working.",
  },
  {
    id: "exam-b-b2-05",
    unitId: "b2-05",
    skill: "grammar",
    prompt: "Which conclusion stays within the limits of the evidence?",
    options: [
      "The interviews suggest that cost was one factor in the decision.",
      "The interviews prove the single cause of every decision.",
      "Cost unquestionably determined all participants' choices.",
    ],
    answer: "The interviews suggest that cost was one factor in the decision.",
    explanation:
      "Suggest и one factor передают вероятный, ограниченный вывод без чрезмерного обобщения.",
  },
  {
    id: "exam-b-b2-06",
    unitId: "b2-06",
    skill: "grammar",
    prompt:
      "Complete the natural collocation: The chair asked both sides to ___ their concerns before the vote.",
    options: ["raise", "lift", "grow"],
    answer: "raise",
    explanation: "Устойчивое сочетание — raise concerns: озвучить опасения.",
  },
  {
    id: "exam-b-b2-07",
    unitId: "b2-07",
    skill: "grammar",
    prompt: "Choose the sentence that acknowledges a limitation while defending the proposal.",
    options: [
      "Despite requiring initial training, the system should reduce repeated errors.",
      "The system requires training, because it can never reduce errors.",
      "Although the system reduces errors, so training is unnecessary.",
    ],
    answer: "Despite requiring initial training, the system should reduce repeated errors.",
    explanation:
      "Despite признаёт реальный минус, после чего основная часть сохраняет аргумент в пользу системы.",
  },
  {
    id: "exam-b-b2-08",
    unitId: "b2-08",
    skill: "grammar",
    prompt:
      "Complete: We travelled by ___ train and met the architect at ___ station nearest the site.",
    options: ["the / a", "— / the", "a / —"],
    answer: "— / the",
    explanation:
      "В выражении by train артикль не нужен; перед station nearest the site используется the: речь о ближайшей к площадке станции.",
  },
  ...[
    {
      id: "exam-b-b2-09",
      unitId: "b2-10",
      prompt: "Why was the first positive result potentially misleading?",
      options: [
        "It hid differences between groups of patients.",
        "It was based entirely on invented attendance figures.",
        "It showed that printed letters were always more effective.",
      ],
      answer: "It hid differences between groups of patients.",
      explanation:
        "Общий показатель улучшился, но эффект был сосредоточен среди молодых пациентов.",
    },
    {
      id: "exam-b-b2-10",
      unitId: "b2-12",
      prompt: "What concern did some patients have about text messages?",
      options: [
        "They could expose sensitive clinic information on a screen.",
        "They always arrived after the appointment.",
        "They contained too many medical instructions.",
      ],
      answer: "They could expose sensitive clinic information on a screen.",
      explanation: "Название клиники на заблокированном экране могло раскрыть личную информацию.",
    },
    {
      id: "exam-b-b2-11",
      unitId: "b2-10",
      prompt: "Why does the hospital record each patient's preferred channel?",
      options: [
        "To replace all receptionists with automated systems",
        "To use a method that is both dependable and acceptable for that person",
        "To send the same reminder through every available channel",
      ],
      answer: "To use a method that is both dependable and acceptable for that person",
      explanation:
        "Новая система учитывает и доступность канала, и безопасность для конкретного пациента.",
    },
    {
      id: "exam-b-b2-12",
      unitId: "b2-05",
      prompt: "Why will the hospital publish results by group?",
      options: [
        "To see whether an improved average conceals unequal access",
        "To identify individual patients who miss appointments",
        "To prove that age is the only cause of non-attendance",
      ],
      answer: "To see whether an improved average conceals unequal access",
      explanation:
        "Разбивка помогает проверить распределение эффекта, сохраняя защиту от идентификации людей.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: b2ReadingA })),
  ...[
    {
      id: "exam-b-b2-13",
      unitId: "b2-09",
      prompt: "Why did fewer calendar invitations not immediately end project delays?",
      options: [
        "Coordination problems moved into inefficient written discussions.",
        "Employees ignored the protected afternoons and scheduled more meetings.",
        "The company stopped making project decisions entirely.",
      ],
      answer: "Coordination problems moved into inefficient written discussions.",
      explanation:
        "Часть коммуникации превратилась в длинные цепочки сообщений с медленными решениями.",
    },
    {
      id: "exam-b-b2-14",
      unitId: "b2-12",
      prompt: "Why were new employees affected more strongly?",
      options: [
        "They were forbidden to write messages.",
        "They lacked judgement about when a conversation was necessary.",
        "They had no tasks requiring concentration.",
      ],
      answer: "They lacked judgement about when a conversation was necessary.",
      explanation: "Новичкам было трудно понять, какой вопрос уже требует короткого звонка.",
    },
    {
      id: "exam-b-b2-15",
      unitId: "b2-10",
      prompt: "What is the purpose of naming a final decision-maker in a thread?",
      options: [
        "To make responsibility and the route to a decision clear",
        "To prevent anyone else from contributing information",
        "To increase the number of written messages",
      ],
      answer: "To make responsibility and the route to a decision clear",
      explanation: "Правило устраняет неопределённость о том, кто завершает обсуждение решением.",
    },
    {
      id: "exam-b-b2-16",
      unitId: "b2-07",
      prompt: "Which statement best expresses the writer's conclusion?",
      options: [
        "All meetings reduce productive work.",
        "Written communication is always clearer than conversation.",
        "Focused work needs fewer interruptions and an explicit way to resolve complex questions.",
      ],
      answer:
        "Focused work needs fewer interruptions and an explicit way to resolve complex questions.",
      explanation:
        "Автор поддерживает баланс: защитить фокус и сохранить понятный канал для необходимого разговора.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: b2ReadingB })),
  ...[
    {
      id: "exam-b-b2-17",
      unitId: "b2-11",
      prompt: "What disagreement exists about the packaging sample?",
      options: [
        "Whether colour consistency is worth extra processing",
        "Whether the material is strong enough to be tested",
        "Whether customers should be allowed into the stores",
      ],
      answer: "Whether colour consistency is worth extra processing",
      explanation:
        "Материал прочный; спор касается оттенка и экологической цены дополнительной обработки.",
    },
    {
      id: "exam-b-b2-18",
      unitId: "b2-05",
      prompt: "Why does the speaker recommend a limited launch?",
      options: [
        "To collect evidence about customer reactions before a wider decision",
        "To avoid explaining the colour variation",
        "To guarantee that no customer gives negative feedback",
      ],
      answer: "To collect evidence about customer reactions before a wider decision",
      explanation:
        "Пилот проверит предположение о готовности покупателей принять естественную вариативность.",
    },
    {
      id: "exam-b-b2-19",
      unitId: "b2-10",
      prompt: "What should be decided before the trial begins?",
      options: [
        "The feedback threshold that would trigger a redesign",
        "The exact colour every future batch will have",
        "The name of a permanent exclusive supplier",
      ],
      answer: "The feedback threshold that would trigger a redesign",
      explanation:
        "Заранее заданный критерий не позволит произвольно трактовать результаты пилота.",
    },
    {
      id: "exam-b-b2-20",
      unitId: "b2-11",
      prompt: "What does the speaker want from the supplier about price?",
      options: [
        "An immediate promise that every order will be cheaper",
        "A documented link between order volume and future reductions",
        "A refund for the samples already produced",
      ],
      answer: "A documented link between order volume and future reductions",
      explanation:
        "Нужен письменный график порогов объёма, а не неформальная оценка будущей скидки.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: b2ListeningA })),
  ...[
    {
      id: "exam-b-b2-21",
      unitId: "b2-09",
      prompt: "What limitation does the speaker identify in the current collection?",
      options: [
        "It represents a narrow set of families and occasions.",
        "It contains no photographs at all.",
        "Every photograph was taken outside the district.",
      ],
      answer: "It represents a narrow set of families and occasions.",
      explanation:
        "Большинство материалов пришло от двух семей и показывает главным образом праздники.",
    },
    {
      id: "exam-b-b2-22",
      unitId: "b2-10",
      prompt: "Why does the speaker propose delaying the opening?",
      options: [
        "To gather a broader range of memories and interviews",
        "To wait until a perfectly complete archive exists",
        "To remove uncertain items from public discussion",
      ],
      answer: "To gather a broader range of memories and interviews",
      explanation:
        "Дополнительные дни сбора расширят представленность, хотя абсолютная полнота не обещается.",
    },
    {
      id: "exam-b-b2-23",
      unitId: "b2-05",
      prompt: "How should uncertain information be handled in captions?",
      options: [
        "Presented confidently to keep the text simple",
        "Marked openly as uncertain",
        "Replaced with an unrelated confirmed date",
      ],
      answer: "Marked openly as uncertain",
      explanation: "Спикер требует отличать установленный факт от предположения.",
    },
    {
      id: "exam-b-b2-24",
      unitId: "b2-07",
      prompt: "How will the speaker justify the delay to the sponsor?",
      options: [
        "By showing that it improves representativeness and reliability",
        "By claiming that the original deadline never existed",
        "By promising the exhibition will contain every local memory",
      ],
      answer: "By showing that it improves representativeness and reliability",
      explanation:
        "Дополнительное время меняет качество рассказа, а не просто увеличивает количество экспонатов.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: b2ListeningB })),
];

const c1: ExamQuestion[] = [
  {
    id: "exam-b-c1-01",
    unitId: "c1-01",
    skill: "grammar",
    prompt: "Choose the correct inversion after a restrictive expression.",
    options: [
      "Under no circumstances confidential records should be copied locally.",
      "Under no circumstances should confidential records be copied locally.",
      "Under no circumstances should copy confidential records locally.",
    ],
    answer: "Under no circumstances should confidential records be copied locally.",
    explanation:
      "После начального Under no circumstances требуется инверсия auxiliary + subject; пассив сохраняется.",
  },
  {
    id: "exam-b-c1-02",
    unitId: "c1-02",
    skill: "grammar",
    prompt: "Choose the cleft sentence that focuses on the timing, not the person.",
    options: [
      "It was after the second review that the error became apparent.",
      "What became apparent was the reviewer.",
      "The error was after the second review who became apparent.",
    ],
    answer: "It was after the second review that the error became apparent.",
    explanation: "It-cleft выделяет обстоятельство after the second review как контрастный фокус.",
  },
  {
    id: "exam-b-c1-03",
    unitId: "c1-03",
    skill: "grammar",
    prompt:
      "Complete the formal ellipsis: The first model predicts growth, whereas the second ___.",
    options: ["does not", "not predicts", "isn't predict"],
    answer: "does not",
    explanation: "Вспомогательный does заменяет повторяемое predicts growth и сохраняет контраст.",
  },
  {
    id: "exam-b-c1-04",
    unitId: "c1-04",
    skill: "grammar",
    prompt:
      "Which sentence uses nominalisation clearly rather than merely making the prose heavier?",
    options: [
      "The committee's delayed approval prevented the team from starting recruitment.",
      "There was a making of a delay in the approval by the committee for recruitment starting.",
      "The committee delayed, and this was approval, and recruitment did not start.",
    ],
    answer: "The committee's delayed approval prevented the team from starting recruitment.",
    explanation:
      "Delayed approval уплотняет известную информацию, а глагол prevented ясно выражает следствие.",
  },
  {
    id: "exam-b-c1-05",
    unitId: "c1-05",
    skill: "grammar",
    prompt: "Which reply appropriately challenges a senior colleague in a formal meeting?",
    options: [
      "That claim is ridiculous and your figures are wrong.",
      "I wonder whether the conclusion follows from the figures currently available.",
      "You clearly did not understand your own figures.",
    ],
    answer: "I wonder whether the conclusion follows from the figures currently available.",
    explanation:
      "Формулировка прямо проверяет связь вывода с данными, сохраняя профессиональный регистр.",
  },
  {
    id: "exam-b-c1-06",
    unitId: "c1-06",
    skill: "grammar",
    prompt:
      "Complete the idiom: Her comment was intended to ___ the record straight about who approved the change.",
    options: ["put", "set", "make"],
    answer: "set",
    explanation:
      "Устойчивое выражение set the record straight означает исправить неверное представление.",
  },
  {
    id: "exam-b-c1-07",
    unitId: "c1-10",
    skill: "grammar",
    prompt: "Which sentence acknowledges a limitation while preserving a defensible conclusion?",
    options: [
      "The critics are biased, so their evidence can be ignored.",
      "Although the estimate excludes maintenance costs, its short-term comparison remains useful if that limitation is made explicit.",
      "The estimate is useful because maintenance costs never matter.",
    ],
    answer:
      "Although the estimate excludes maintenance costs, its short-term comparison remains useful if that limitation is made explicit.",
    explanation:
      "Ответ признаёт конкретный недостаток, ограничивает область вывода и сохраняет обоснованную ценность данных.",
  },
  {
    id: "exam-b-c1-08",
    unitId: "c1-12",
    skill: "grammar",
    prompt:
      "Complete the formal condition: Were the pilot to reveal systematic bias, the model ___ withdrawn pending review.",
    options: ["would be", "will have", "had been"],
    answer: "would be",
    explanation:
      "Were ... to — инвертированное условие о гипотетическом будущем; результат оформляется would be.",
  },
  ...[
    {
      id: "exam-b-c1-09",
      unitId: "c1-08",
      prompt: "What central distinction does the writer make?",
      options: [
        "Between publishing information and enabling meaningful scrutiny",
        "Between public and private organisations only",
        "Between spreadsheets and every other file format",
      ],
      answer: "Between publishing information and enabling meaningful scrutiny",
      explanation:
        "Автор отделяет формальный факт раскрытия от возможности понять и оспорить решение.",
    },
    {
      id: "exam-b-c1-10",
      unitId: "c1-07",
      prompt: "What does ‘the performance of openness’ imply?",
      options: [
        "An appearance of accountability without enabling meaningful scrutiny",
        "A theatrical presentation required by procurement law",
        "A measurable improvement in every public decision",
      ],
      answer: "An appearance of accountability without enabling meaningful scrutiny",
      explanation:
        "Большой объём публикации может служить символом открытости, оставаясь непригодным для проверки.",
    },
    {
      id: "exam-b-c1-11",
      unitId: "c1-09",
      prompt: "Why does the writer discuss predictive systems?",
      options: [
        "To show that code disclosure alone may omit decisive context",
        "To argue that all algorithms must remain secret",
        "To claim that training data is identical to source code",
      ],
      answer: "To show that code disclosure alone may omit decisive context",
      explanation:
        "Без данных, порогов и последствий ошибки открытый код не объясняет, как реально принимается решение.",
    },
    {
      id: "exam-b-c1-12",
      unitId: "c1-12",
      prompt: "Which policy best follows from the passage?",
      options: [
        "Publish material with its limits and a mechanism for challenge",
        "Release the largest possible file and treat the task as complete",
        "Replace detailed evidence with a dashboard selected internally",
      ],
      answer: "Publish material with its limits and a mechanism for challenge",
      explanation:
        "Именно понятные границы знания и возможность оспаривания превращают раскрытие в подотчётность.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: c1ReadingA })),
  ...[
    {
      id: "exam-b-c1-13",
      unitId: "c1-06",
      prompt: "What ambiguity in the word ‘resilience’ concerns the writer?",
      options: [
        "It can describe sound preparation or excuse preventable strain.",
        "It applies only to transport and never to hospitals.",
        "It always refers to rapid financial growth.",
      ],
      answer: "It can describe sound preparation or excuse preventable strain.",
      explanation:
        "Термин обозначает полезную способность, но также может нормализовать давление, созданное решениями системы.",
    },
    {
      id: "exam-b-c1-14",
      unitId: "c1-07",
      prompt: "What is implied by calling repeated sacrifice an ‘operating model’?",
      options: [
        "Exceptional effort has been normalised instead of solving the vacancy problem.",
        "Nurses have formally designed the hospital budget.",
        "Emergency work has become unnecessary.",
      ],
      answer: "Exceptional effort has been normalised instead of solving the vacancy problem.",
      explanation:
        "Временная компенсация системного дефицита начинает восприниматься как обычный способ работы.",
    },
    {
      id: "exam-b-c1-15",
      unitId: "c1-10",
      prompt: "Why does the writer contrast redundancy with improvisation?",
      options: [
        "To challenge narrow efficiency measures that ignore crisis capacity and human cost",
        "To prove that unused resources are always wasteful",
        "To recommend improvisation as the only reliable policy",
      ],
      answer: "To challenge narrow efficiency measures that ignore crisis capacity and human cost",
      explanation:
        "Запас выглядит неэффективным до кризиса, а постоянная импровизация скрывает истощение людей.",
    },
    {
      id: "exam-b-c1-16",
      unitId: "c1-12",
      prompt: "Which evaluation question best reflects the author's position?",
      options: [
        "How quickly did service resume, and who absorbed the cost of doing so?",
        "Did the organisation publicly praise its staff after the crisis?",
        "Was every possible shock prevented in advance?",
      ],
      answer: "How quickly did service resume, and who absorbed the cost of doing so?",
      explanation:
        "Автор требует оценивать и восстановление, и распределение нагрузки, а не только скорость возвращения.",
    },
  ].map((question) => ({ ...question, skill: "reading" as const, passage: c1ReadingB })),
  ...[
    {
      id: "exam-b-c1-17",
      unitId: "c1-08",
      prompt: "What is the speaker's objection to consultation at the final stage?",
      options: [
        "Participants can influence details but not the central choice.",
        "Engineers will be unable to discuss safety constraints.",
        "Residents will necessarily reject every proposed design.",
      ],
      answer: "Participants can influence details but not the central choice.",
      explanation:
        "Когда основной маршрут уже закрыт для изменения, участие становится слишком узким.",
    },
    {
      id: "exam-b-c1-18",
      unitId: "c1-10",
      prompt: "Why does the speaker welcome the early discovery of conflict?",
      options: [
        "It allows disagreements to shape options before commitments become costly.",
        "It guarantees that all groups will reach consensus.",
        "It removes the need for technical expertise.",
      ],
      answer: "It allows disagreements to shape options before commitments become costly.",
      explanation:
        "Ценность раннего конфликта — в возможности изменить проект до подписания контрактов.",
    },
    {
      id: "exam-b-c1-19",
      unitId: "c1-09",
      prompt: "What does the comparison between submissions and interviews demonstrate?",
      options: [
        "Participation counts alone say little about the quality or representativeness of engagement.",
        "Online responses are legally invalid in every consultation.",
        "Twenty interviews always represent more people than a thousand submissions.",
      ],
      answer:
        "Participation counts alone say little about the quality or representativeness of engagement.",
      explanation:
        "Спикер оспаривает простую числовую метрику, не объявляя один метод всегда лучшим.",
    },
    {
      id: "exam-b-c1-20",
      unitId: "c1-12",
      prompt: "What accountability would the proposed decision map create?",
      options: [
        "It would make the scope, authority, evidence, and final reasoning visible.",
        "It would transfer every engineering decision to an online vote.",
        "It would promise that each preference becomes policy.",
      ],
      answer: "It would make the scope, authority, evidence, and final reasoning visible.",
      explanation: "Карта заранее показывает, что меняется, кто решает и как будет объяснён итог.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: c1ListeningA })),
  ...[
    {
      id: "exam-b-c1-21",
      unitId: "c1-10",
      prompt: "Why is the speaker dissatisfied with the proposed points table?",
      options: [
        "It may replace one simplistic output count with another.",
        "It gives software more points than every article.",
        "It prevents committees from seeing any research products.",
      ],
      answer: "It may replace one simplistic output count with another.",
      explanation:
        "Фиксированные баллы сохраняют соблазн считать объекты без оценки их реальной ценности.",
    },
    {
      id: "exam-b-c1-22",
      unitId: "c1-08",
      prompt: "What distinction does the dataset example establish?",
      options: [
        "Formal availability is not equivalent to useful contribution.",
        "Only articles can influence an academic field.",
        "Documentation makes every dataset equally valuable.",
      ],
      answer: "Formal availability is not equivalent to useful contribution.",
      explanation:
        "Публичный набор без документации может выполнить формальное требование, оставаясь непригодным.",
    },
    {
      id: "exam-b-c1-23",
      unitId: "c1-05",
      prompt: "How does the speaker defend the use of reviewer judgement?",
      options: [
        "Judgement already exists and can be made explicit and structured.",
        "Reviewers should rely entirely on personal preference.",
        "Every discipline values identical forms of contribution.",
      ],
      answer: "Judgement already exists and can be made explicit and structured.",
      explanation:
        "Спикер не отрицает субъективность, а предлагает признать её и ограничить доказательствами и контекстом.",
    },
    {
      id: "exam-b-c1-24",
      unitId: "c1-12",
      prompt: "What unintended effect should the policy review specifically examine?",
      options: [
        "Whether junior researchers are given extra invisible labour without support",
        "Whether senior researchers stop publishing articles altogether",
        "Whether every dataset is reused by the same number of teams",
      ],
      answer: "Whether junior researchers are given extra invisible labour without support",
      explanation:
        "Признание без времени и ресурсов может превратить полезную реформу в новую нагрузку на менее защищённых сотрудников.",
    },
  ].map((question) => ({ ...question, skill: "listening" as const, passage: c1ListeningB })),
];

export const advancedExamQuestionsB: Record<"B2" | "C1", ExamQuestion[]> = {
  B2: b2,
  C1: c1,
};
