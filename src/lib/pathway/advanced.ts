import { advancedWritingModels } from "./advanced-writing";
import type { PathQuestion, PathUnit } from "./types";

const q = (
  skill: PathQuestion["skill"],
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
): PathQuestion => ({ skill, prompt, options, answer, explanation });

const b2Reading = (text: string, focus: string) => `${text} ${focus}`;

const b2Listening = (text: string, focus: string) => `${text} ${focus}`;

const c1Reading = (text: string, focus: string) => `${text} ${focus}`;

const c1Listening = (text: string, focus: string) => `${text} ${focus}`;

export const advancedUnits: PathUnit[] = [
  {
    id: "b2-01",
    level: "B2",
    title: "Смешанные условные конструкции",
    goal: "Связывать прошлые решения с настоящими последствиями и обсуждать альтернативы.",
    theory:
      "Mixed conditionals соединяют разные временные планы. If + Past Perfect описывает нереальное прошлое, а would + infinitive — его нынешний результат: If I had accepted the offer, I would live abroad now. Обратная модель связывает нынешнее состояние с прошлым результатом: If I were more organised, I would have finished yesterday. В формальной речи if можно опустить с инверсией: Had I known... В этих стандартных контрфактических моделях не ставь would в if-clause; редкие случаи с would для воли или вежливой просьбы устроены иначе.",
    examples: [
      "If we had checked the figures, we would not be correcting the report now.",
      "If Marta were less cautious, she would have applied for the role.",
      "Had they listened earlier, the conflict might have been avoided.",
    ],
    vocabulary: [
      { en: "turning point", ru: "поворотный момент" },
      { en: "consequence", ru: "последствие" },
      { en: "in hindsight", ru: "оглядываясь назад" },
      { en: "miss an opportunity", ru: "упустить возможность" },
      { en: "reconsider", ru: "пересмотреть" },
      { en: "alternative outcome", ru: "альтернативный исход" },
    ],
    reading: b2Reading(
      "Three years ago, Lena declined a position at a small renewable-energy company because the salary seemed risky. The company has since expanded across Europe, while her current department is being reduced. Lena does not regret choosing stability, but she now recognises that she evaluated only the immediate salary. If she had asked about the founders' long-term contracts, she might view the decision differently. At the same time, she admits that if she enjoyed uncertainty more, she would probably have accepted the offer even without that information.",
      "The present problem results from both a past choice and Lena's continuing attitude to risk. Her experience also shows why hindsight must be used carefully: later success does not prove that the earlier decision was foolish, but it can reveal which questions she failed to ask.",
    ),
    listening: b2Listening(
      "I used to think our delayed launch was entirely the supplier's fault. Yesterday I found an email showing that we had approved the final design two weeks late. Had we replied on time, the supplier could have delivered before the holiday period. Still, if their process were more transparent, we would have noticed the delay much sooner. I am not trying to avoid responsibility; I want us to learn from both failures. Next time, one person will track every approval and the supplier will send a progress update each Friday.",
      "The manager divides responsibility between an earlier internal delay and a continuing weakness in the supplier's process. By assigning a named owner and regular update, the proposed remedy addresses information flow rather than relying on people to remember an informal promise.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the correct sentence.",
        [
          "If I had trained more, I would feel confident now.",
          "If I would train more, I had felt confident now.",
          "If I trained more, I would have feel confident now.",
        ],
        "If I had trained more, I would feel confident now.",
        "Past Perfect marks the unreal past cause; would feel gives the present result.",
      ),
      q(
        "grammar",
        "Complete: If she ___ more flexible, she would have accepted yesterday.",
        ["were", "had been", "would be"],
        "were",
        "A present characteristic is linked to a past unreal result.",
      ),
      q(
        "reading",
        "Why might Lena now assess the offer differently?",
        [
          "She learned the company had secure long-term work.",
          "Her current salary increased.",
          "She no longer values stability.",
        ],
        "She learned the company had secure long-term work.",
        "The contracts were relevant evidence she did not investigate.",
      ),
      q(
        "reading",
        "What can be inferred about Lena?",
        [
          "Her attitude to risk still affects her decisions.",
          "She certainly wishes she had left.",
          "She knew the company would expand.",
        ],
        "Her attitude to risk still affects her decisions.",
        "The second conditional clause describes her continuing caution.",
      ),
      q(
        "listening",
        "What changed the manager's view?",
        [
          "An email revealed an internal delay.",
          "The supplier apologised.",
          "The holiday period was cancelled.",
        ],
        "An email revealed an internal delay.",
        "The email showed the team approved the design late.",
      ),
      q(
        "listening",
        "What is the implied purpose of the new process?",
        [
          "To make shared delays visible earlier.",
          "To replace the supplier immediately.",
          "To remove all manager responsibility.",
        ],
        "To make shared delays visible earlier.",
        "Tracking approvals and weekly updates address both causes.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 120–160 слов о решении, которое могло привести к другому результату. Используй две разные mixed conditional конструкции.",
      minWords: 120,
      model: advancedWritingModels["b2-01"]!,
      checklist: [
        "Две модели mixed conditional",
        "Ясная связь причины и результата",
        "Один вывод без самокритики ради самокритики",
      ],
    },
    speaking: {
      prompt: "Расскажи партнёру о прошлом выборе и вместе найдите лучший альтернативный сценарий.",
      model:
        "If I had taken that internship, I might work in design now. Still, if I were less interested in research, I would probably have left it. What would you have checked before deciding?",
      checklist: [
        "Опиши реальный контекст",
        "Задай уточняющий вопрос",
        "Сравни минимум две альтернативы",
      ],
    },
  },
  {
    id: "b2-02",
    level: "B2",
    title: "Модальные глаголы предположения",
    goal: "Точно выражать уверенность о настоящем и прошлом.",
    theory:
      "Для уверенного вывода используй must, для невозможности — can't/couldn't, для вероятности — may, might, could. О прошлом: modal + have + V3: She must have forgotten; they can't have seen it. Should have обычно означает ожидаемый, но ещё не подтверждённый результат или критику. Степень уверенности зависит от доказательств, поэтому добавляй probably, apparently, judging by.",
    examples: [
      "The lights are off, so they must have left.",
      "He can't be the author; he joined after publication.",
      "The parcel should have arrived by now, but I cannot confirm it.",
    ],
    vocabulary: [
      { en: "clue", ru: "улика, подсказка" },
      { en: "apparently", ru: "по-видимому" },
      { en: "rule out", ru: "исключить" },
      { en: "plausible", ru: "правдоподобный" },
      { en: "account for", ru: "объяснять" },
      { en: "uncertainty", ru: "неопределённость" },
    ],
    reading: b2Reading(
      "A museum discovered that a small landscape had been placed in the wrong collection for decades. The label named a minor local painter, but the paper and pigments matched materials used by a better-known artist. The picture cannot have been a modern copy because tests dated it to the correct period. It might have received the wrong label during a move in 1958, when several records were damaged. Experts say the work could be genuine, although a signature has not been found. They will compare the brushwork with confirmed paintings before making a public claim.",
      "The experts use several clues, but none is strong enough to justify complete certainty. Material dating rules out one explanation, while the damaged archive makes another plausible. Brushwork comparison may strengthen attribution, yet responsible experts will still describe degrees of confidence.",
    ),
    listening: b2Listening(
      "The office door was unlocked when I arrived, but nothing appears to be missing. Kim must have come in early because her bicycle is outside, although she might be in the archive downstairs. The cleaner cannot have left the door open; his access card shows that he finished at nine last night. It could have been the delivery driver, but drivers are supposed to use the side entrance. I will check the camera before we report a security problem.",
      "The speaker ranks explanations instead of choosing one before checking the camera. Access-card evidence weakens the cleaner theory, the bicycle supports Kim's presence, and the delivery routine leaves another possibility open. The final check can distinguish among them. Until then, the unlocked door is a security concern but not evidence that any named person acted carelessly.",
    ),
    questions: [
      q(
        "grammar",
        "The dates do not match, so the document ___ authentic.",
        ["can't be", "must be", "should have"],
        "can't be",
        "Can't be expresses a conclusion that present evidence makes impossible.",
      ),
      q(
        "grammar",
        "Her coat is gone. She ___ already.",
        ["must have left", "must left", "can't have left"],
        "must have left",
        "Past deduction uses modal + have + past participle.",
      ),
      q(
        "reading",
        "Why is a modern copy ruled out?",
        [
          "Scientific tests date the materials to the period.",
          "A signature was discovered.",
          "The museum has a complete label record.",
        ],
        "Scientific tests date the materials to the period.",
        "The material tests provide evidence against a modern copy.",
      ),
      q(
        "reading",
        "Why are experts not announcing the artist yet?",
        [
          "Attribution still needs comparison with confirmed work.",
          "They dislike the landscape.",
          "The work has already been sold.",
        ],
        "Attribution still needs comparison with confirmed work.",
        "The clues are plausible but not conclusive.",
      ),
      q(
        "listening",
        "Who is least likely to have left the door open?",
        ["The cleaner", "Kim", "The delivery driver"],
        "The cleaner",
        "Access data shows he left the previous night.",
      ),
      q(
        "listening",
        "What will determine the next action?",
        ["Camera evidence", "The location of Kim's bicycle", "The delivery schedule alone"],
        "Camera evidence",
        "The speaker postpones the report until checking it.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 120–160 слов: объясни загадочную ситуацию, ранжируя минимум четыре версии по вероятности.",
      minWords: 120,
      model: advancedWritingModels["b2-02"]!,
      checklist: [
        "Минимум четыре modal deductions",
        "Разные степени уверенности",
        "Финальный способ проверки",
      ],
    },
    speaking: {
      prompt:
        "По косвенным признакам объясни, почему коллега не пришёл, а партнёр пусть оспорит версии.",
      model:
        "He might have missed the train, but he can't have forgotten the meeting because he confirmed it this morning. Could his previous appointment have run late?",
      checklist: [
        "Сошлись на наблюдаемые признаки",
        "Разделяй факт и догадку",
        "Отреагируй на альтернативную версию",
      ],
    },
  },
  {
    id: "b2-03",
    level: "B2",
    title: "Пассивные сообщения",
    goal: "Передавать сообщения, мнения и слухи нейтрально.",
    theory:
      "Reporting passive помогает не называть источник или сосредоточиться на сообщении: It is believed that...; The company is expected to... Для одновременного действия: subject + is said + to infinitive. Для более раннего: is said + to have + V3. Выбирай reporting verb по смыслу: report — сообщают, allege — утверждают без доказательства, expect — ожидают, consider — считают.",
    examples: [
      "The bridge is expected to reopen in May.",
      "The director is believed to have resigned.",
      "It has been alleged that the figures were altered.",
    ],
    vocabulary: [
      { en: "allege", ru: "утверждать без доказательств" },
      { en: "be expected to", ru: "ожидается, что" },
      { en: "source", ru: "источник" },
      { en: "verify", ru: "проверять" },
      { en: "anonymous", ru: "анонимный" },
      { en: "official statement", ru: "официальное заявление" },
    ],
    reading: b2Reading(
      "A regional newspaper reported that the central station would close for six months. The project is believed to include new lifts and a wider platform, but the transport authority has not published final dates. One contractor is said to have withdrawn after costs increased. Local businesses are expected to request temporary bus stops near the shopping street. The authority confirmed that some work is planned, yet it warned residents that several details circulating online came from an early proposal. A full statement is due next Tuesday.",
      "The grammar keeps uncertain reports separate from the authority's limited confirmation. Readers can therefore see that renovation is real while closure length, contractor withdrawal and replacement bus arrangements remain unverified. Tuesday's statement may confirm, revise or reject those details. Until then, businesses can prepare questions without reorganising around a provisional timetable.",
    ),
    listening: b2Listening(
      "It is widely expected that the old library will become a community workspace. The council is reported to be considering a café and evening classes. However, the building is also said to require expensive roof repairs. One online post claimed that private developers had already bought it, but that story is believed to have started from a misunderstood planning document. Councillors will vote after an engineering report is published.",
      "Passive reporting allows the speaker to present public claims without treating them as verified facts. The planning document explains how the purchase rumour could have begun, whereas the engineering report and council vote are identifiable future checks with clearer authority. Separating those stages protects the public from confusing consultation, technical assessment and final approval. It also gives councillors a chance to correct the record before a reversible proposal hardens into public certainty.",
    ),
    questions: [
      q(
        "grammar",
        "Rewrite: People believe the pilot landed safely.",
        [
          "The pilot is believed to have landed safely.",
          "The pilot believes to land safely.",
          "It believes the pilot landed safely.",
        ],
        "The pilot is believed to have landed safely.",
        "The landing happened before the present belief, so use to have landed.",
      ),
      q(
        "grammar",
        "Choose the most neutral unconfirmed report.",
        [
          "It is alleged that records were removed.",
          "Records definitely disappeared.",
          "They removed records, obviously.",
        ],
        "It is alleged that records were removed.",
        "Allege marks an unproven claim and the passive avoids inventing a source.",
      ),
      q(
        "reading",
        "What has the authority actually confirmed?",
        [
          "Some work is planned.",
          "The station will close for exactly six months.",
          "A contractor has officially withdrawn.",
        ],
        "Some work is planned.",
        "Other details remain reports or early proposals.",
      ),
      q(
        "reading",
        "Why should readers wait until Tuesday?",
        [
          "A fuller official statement is expected.",
          "Businesses will close then.",
          "Construction ends then.",
        ],
        "A fuller official statement is expected.",
        "It may verify or correct circulating claims.",
      ),
      q(
        "listening",
        "Which claim probably resulted from misinterpretation?",
        [
          "Private developers had bought the library.",
          "The roof needs assessment.",
          "Councillors will vote.",
        ],
        "Private developers had bought the library.",
        "The speaker traces it to a misunderstood document.",
      ),
      q(
        "listening",
        "What must happen before the vote?",
        [
          "An engineering report must be published.",
          "A café must open.",
          "Evening classes must begin.",
        ],
        "An engineering report must be published.",
        "The vote follows the report.",
      ),
    ],
    writing: {
      prompt:
        "Напиши нейтральную новостную заметку 120–160 слов, отделяя подтверждённое от сообщений и ожиданий.",
      minWords: 120,
      model: advancedWritingModels["b2-03"]!,
      checklist: [
        "Три reporting passive конструкции",
        "Ясная маркировка подтверждённого",
        "Без безличных слухов как фактов",
      ],
    },
    speaking: {
      prompt: "Передай партнёру три новости, указав надёжность источника и степень подтверждения.",
      model:
        "The route is expected to change, but it is only reported to be under review. The operator has confirmed a public meeting, so I would wait for that.",
      checklist: [
        "Используй разные reporting verbs",
        "Назови подтверждённый факт",
        "Предложи способ проверки",
      ],
    },
  },
  {
    id: "b2-04",
    level: "B2",
    title: "Относительные и причастные обороты",
    goal: "Сжимать информацию и строить плавные сложные предложения.",
    theory:
      "Defining relative clause определяет объект без запятых; non-defining добавляет комментарий и отделяется запятыми. Причастный оборот сокращает relative clause: people who live nearby → people living nearby; documents that were submitted → documents submitted. Perfect participle having + V3 подчёркивает более раннее действие. Сокращай только когда субъект оборота понятен и совпадает с субъектом главной части.",
    examples: [
      "Residents living near the airport received a survey.",
      "The proposal, which was revised twice, passed narrowly.",
      "Having reviewed the evidence, the panel delayed its decision.",
    ],
    vocabulary: [
      { en: "whereas", ru: "тогда как" },
      { en: "submitted", ru: "поданный" },
      { en: "adjacent", ru: "прилегающий" },
      { en: "eligible", ru: "имеющий право" },
      { en: "revised", ru: "пересмотренный" },
      { en: "stakeholder", ru: "заинтересованная сторона" },
    ],
    reading: b2Reading(
      "Residents living beside North Park have proposed a shared garden on land currently used for storage. The plan, which includes accessible paths and a small greenhouse, attracted support from two schools. Materials donated by local firms would reduce the initial cost. However, shop owners using the storage area want an alternative site before construction begins. Having reviewed both requests, the council offered a smaller piece of land nearby. The residents who designed the original plan say the new site receives too little sunlight, whereas supporters of the compromise believe it could still work.",
      "The clauses identify affected groups while participle phrases keep the account compact. The distinction matters because residents, schools and shop owners do not have identical interests. The compromise solves the storage dispute but creates a new question about whether plants can thrive.",
    ),
    listening: b2Listening(
      "Students completing the evening course can apply for mentoring. The mentors, who all finished the programme in previous years, meet participants twice a month. Anyone needing technical support can also attend a Friday clinic. Having tested the scheme with one class, the college is now opening it to all departments. Applications received after Monday will be considered only if places remain.",
      "Some clauses define exactly who is eligible, while the clause about mentors adds background information. The final condition also limits late applications rather than banning them outright. Together, these details explain access, support and the consequence of missing the deadline. The college can still fill unused places, but timely applicants receive predictable priority and administrators avoid promising capacity they do not have. Mentors can plan their workload accordingly.  Capacity stays visible.",
    ),
    questions: [
      q(
        "grammar",
        "Which punctuation is correct?",
        [
          "My tutor, who works remotely, visits monthly.",
          "My tutor who works remotely, visits monthly.",
          "My tutor, who works remotely visits monthly.",
        ],
        "My tutor, who works remotely, visits monthly.",
        "A non-defining clause needs commas on both sides.",
      ),
      q(
        "grammar",
        "Reduce: Files that were received before noon were processed.",
        [
          "Files received before noon were processed.",
          "Files receiving before noon were processed.",
          "Receiving files before noon processed.",
        ],
        "Files received before noon were processed.",
        "A passive relative clause reduces to a past participle.",
      ),
      q(
        "reading",
        "Why do shop owners oppose immediate construction?",
        [
          "They still need replacement storage.",
          "They dislike school involvement.",
          "The firms withdrew materials.",
        ],
        "They still need replacement storage.",
        "Their objection concerns the current use of the land.",
      ),
      q(
        "reading",
        "What weakness does the alternative site have?",
        ["Insufficient sunlight", "No accessible path", "Excessive rent"],
        "Insufficient sunlight",
        "The original designers identify this practical problem.",
      ),
      q(
        "listening",
        "Who can apply for mentoring?",
        [
          "Students completing the evening course",
          "Only technical staff",
          "Anyone who visits on Friday",
        ],
        "Students completing the evening course",
        "The opening reduced clause defines the eligible group.",
      ),
      q(
        "listening",
        "What does the Friday clinic provide?",
        ["Technical support", "Mentor applications", "Final examinations"],
        "Technical support",
        "It is a separate support option.",
      ),
    ],
    writing: {
      prompt:
        "Опиши общественный проект в 120–160 слов, используя defining, non-defining и минимум два причастных оборота.",
      minWords: 120,
      model: advancedWritingModels["b2-04"]!,
      checklist: [
        "Defining и non-defining clause",
        "Два корректных participle clauses",
        "Нет висячего причастного оборота",
      ],
    },
    speaking: {
      prompt:
        "Опиши место или инициативу так, чтобы партнёр мог точно определить людей, объекты и преимущества.",
      model:
        "The centre, which reopened last year, offers rooms designed for quiet work. People needing advice can book a volunteer. Having used it myself, I would recommend the evening sessions.",
      checklist: [
        "Добавь один комментарий в запятых",
        "Сократи одну относительную конструкцию",
        "Проверь понятность субъекта",
      ],
    },
  },
  {
    id: "b2-05",
    level: "B2",
    title: "Осторожные утверждения",
    goal: "Выражать позицию убедительно, не преувеличивая доказательства.",
    theory:
      "Hedging ограничивает силу утверждения: tends to, appears to, is likely to, may, to some extent, in many cases. Boosters усиливают обоснованную позицию: clearly, strongly suggests, is highly likely. Выбор зависит от качества данных. Вместо People hate remote work скажи Some employees appear to find fully remote work isolating. Это не слабость, а точность.",
    examples: [
      "The results appear to support a shorter working week.",
      "This may be partly explained by self-selection.",
      "The evidence strongly suggests that regular feedback matters.",
    ],
    vocabulary: [
      { en: "to some extent", ru: "до некоторой степени" },
      { en: "indicate", ru: "указывать" },
      { en: "limitation", ru: "ограничение" },
      { en: "representative", ru: "репрезентативный" },
      { en: "tentative", ru: "предварительный" },
      { en: "overstate", ru: "преувеличивать" },
    ],
    reading: b2Reading(
      "A six-month trial allowed staff at one design company to finish early on Fridays. Productivity appears to have remained stable, while reported stress fell by twelve percent. These findings may indicate that shorter weeks can benefit some creative teams. However, the sample was small and employees knew their performance was being monitored. The improvement could therefore be partly connected to extra attention rather than the schedule alone. The trial does not prove that every organisation should adopt the policy, but it strongly suggests that managers should test working patterns instead of assuming longer hours produce better results.",
      "The writer calibrates each conclusion to the limited evidence. Stable output and lower reported stress justify further investigation, but observation effects and a small creative workforce prevent broad generalisation. A cautious trial elsewhere would test transferability more reliably. It should preserve output measures while adding staff turnover and client quality, since a stable quantity can conceal decline elsewhere.",
    ),
    listening: b2Listening(
      "Our survey suggests that customers generally prefer a shorter menu, but the result should be treated cautiously. Most responses came from regular lunchtime visitors, who may value speed more than evening guests do. Sales figures also indicate that three rarely ordered dishes create considerable waste. I would recommend removing those dishes for one month. That small trial is likely to provide more reliable evidence than the survey alone.",
      "The recommendation is firm enough to act on but limited to a reversible trial. It combines attitudinal evidence with actual waste and sales data, then protects against sampling bias by making the menu change temporary and measurable. Evening feedback during the trial would reveal whether the lunchtime preference transfers to a different customer group. That comparison is essential before permanent removal.  Decisions remain reversible.",
    ),
    questions: [
      q(
        "grammar",
        "Which claim is appropriately cautious?",
        [
          "The pattern may reflect seasonal demand.",
          "The pattern proves all customers agree.",
          "The pattern absolutely never changes.",
        ],
        "The pattern may reflect seasonal demand.",
        "May marks a plausible explanation without presenting it as certain.",
      ),
      q(
        "grammar",
        "Choose the strongest justified phrase for consistent evidence.",
        ["strongly suggests", "possibly whispers", "proves forever"],
        "strongly suggests",
        "It signals substantial support without claiming impossible certainty.",
      ),
      q(
        "reading",
        "Why could monitoring affect the result?",
        [
          "People may behave differently when observed.",
          "The company stopped measuring productivity.",
          "All employees changed jobs.",
        ],
        "People may behave differently when observed.",
        "Extra attention is identified as an alternative explanation.",
      ),
      q(
        "reading",
        "What does the writer ultimately support?",
        [
          "Testing working patterns in context",
          "A universal four-day law",
          "Returning to longer hours",
        ],
        "Testing working patterns in context",
        "The conclusion remains practical but proportionate.",
      ),
      q(
        "listening",
        "Why may the survey be unrepresentative?",
        [
          "It mainly reflects lunchtime regulars.",
          "No customer answered it.",
          "It measured food waste only.",
        ],
        "It mainly reflects lunchtime regulars.",
        "That group may prioritise speed differently.",
      ),
      q(
        "listening",
        "Why is a one-month change proposed?",
        [
          "It can generate better evidence with limited risk.",
          "It guarantees permanent success.",
          "It avoids using sales figures.",
        ],
        "It can generate better evidence with limited risk.",
        "A temporary trial tests the inference.",
      ),
    ],
    writing: {
      prompt: "Напиши 120–160 слов с осторожной рекомендацией на основе ограниченных данных.",
      minWords: 120,
      model: advancedWritingModels["b2-05"]!,
      checklist: [
        "Минимум четыре hedge/booster выражения",
        "Названо ограничение данных",
        "Рекомендация соответствует силе доказательств",
      ],
    },
    speaking: {
      prompt: "Обсуди спорный вывод из небольшого опроса и договорись о безопасном следующем шаге.",
      model:
        "The survey seems encouraging, but it may overrepresent current users. A limited pilot would probably tell us more. Would that address your concern?",
      checklist: [
        "Не выдавай корреляцию за доказательство",
        "Смягчи несогласие",
        "Предложи проверяемый шаг",
      ],
    },
  },
  {
    id: "b2-06",
    level: "B2",
    title: "Коллокации и естественная речь",
    goal: "Сочетать слова естественно и выбирать точный глагол.",
    theory:
      "Коллокация — привычное сочетание слов. Английский предпочитает make a decision, take responsibility, raise awareness, meet a deadline, draw a conclusion. Смысл может быть понятен и с другим глаголом, но речь звучит неестественно. Запоминай сочетание целиком, включая предлог и типичный контекст, а не отдельное слово.",
    examples: [
      "We need to reach an agreement before Friday.",
      "The campaign raised awareness of food waste.",
      "She took full responsibility for missing the deadline.",
    ],
    vocabulary: [
      { en: "reach a compromise", ru: "достичь компромисса" },
      { en: "pose a risk", ru: "создавать риск" },
      { en: "address an issue", ru: "заняться проблемой" },
      { en: "gain insight", ru: "получить понимание" },
      { en: "meet expectations", ru: "оправдать ожидания" },
      { en: "draw attention to", ru: "привлечь внимание к" },
    ],
    reading: b2Reading(
      "When a neighbourhood bakery received poor reviews about slow service, its owner resisted the temptation to make an immediate judgement. She gathered feedback from staff and customers, then identified a bottleneck at the payment counter. The team reached an agreement to simplify the lunch menu and introduced advance ordering. These measures eased pressure without lowering quality. After six weeks, waiting times had fallen and sales had risen. The owner concluded that addressing a specific issue was more effective than placing blame on individual employees.",
      "The key verbs show how the team moved from evidence to action. Gathering feedback prevented a rushed judgement; reaching agreement created shared ownership; addressing the bottleneck produced a measurable result. The sequence makes the collocations part of the reasoning. Each phrase describes a recognised stage of problem solving.",
    ),
    listening: b2Listening(
      "We failed to meet the deadline, and I take responsibility for underestimating the testing stage. The delay poses a risk to the campaign, but cancelling it would cause greater damage. I suggest that we set a realistic launch date, keep the client informed and draw attention to the features that are already stable. If we reach agreement today, the team can make steady progress instead of rushing another promise.",
      "The speaker uses conventional word partnerships to make responsibility and action sound direct. Accepting the estimation error builds credibility, while a revised date, transparent client contact and stable-feature focus turn responsibility into a recovery plan. Agreement today matters because another unsupported promise would deepen the same problem the plan is meant to solve. A written schedule should record dependencies, owners and approval points.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the natural collocation.",
        ["draw a conclusion", "paint a conclusion", "do a conclusion"],
        "draw a conclusion",
        "English conventionally uses draw with conclusion.",
      ),
      q(
        "grammar",
        "Complete: The fault may ___ a serious risk.",
        ["pose", "make", "perform"],
        "pose",
        "Pose a risk is the established combination.",
      ),
      q(
        "reading",
        "What did the owner do before changing the service?",
        ["Gathered feedback", "Dismissed an employee", "Reduced product quality"],
        "Gathered feedback",
        "She investigated the bottleneck first.",
      ),
      q(
        "reading",
        "What broader lesson does the case suggest?",
        [
          "Define the issue before assigning blame.",
          "Reviews should always be ignored.",
          "Faster service requires fewer staff.",
        ],
        "Define the issue before assigning blame.",
        "Targeted action solved the actual constraint.",
      ),
      q(
        "listening",
        "What responsibility does the speaker accept?",
        ["Underestimating testing", "Cancelling the campaign", "Hiding stable features"],
        "Underestimating testing",
        "The speaker explicitly owns that error.",
      ),
      q(
        "listening",
        "What is needed before steady progress can begin?",
        [
          "Agreement on the revised plan",
          "A promise of the original date",
          "Immediate cancellation",
        ],
        "Agreement on the revised plan",
        "The conditional sentence makes agreement the trigger.",
      ),
    ],
    writing: {
      prompt: "Напиши 120–160 слов о проблеме команды, употребив минимум шесть целевых коллокаций.",
      minWords: 120,
      model: advancedWritingModels["b2-06"]!,
      checklist: [
        "Шесть естественных коллокаций",
        "Глаголы соответствуют существительным",
        "Есть причина, действие и результат",
      ],
    },
    speaking: {
      prompt:
        "Предложи решение рабочей проблемы, используя коллокации как готовые смысловые блоки.",
      model:
        "The delay poses a risk, so we should address it openly. I can take responsibility for updates if you set a realistic deadline. Can we reach an agreement on Friday?",
      checklist: [
        "Используй четыре коллокации",
        "Распредели ответственность",
        "Заверши конкретным вопросом",
      ],
    },
  },
  {
    id: "b2-07",
    level: "B2",
    title: "Аргумент и контраргумент",
    goal: "Строить сбалансированную позицию с доказательствами и ответом на возражение.",
    theory:
      "Сильный аргумент включает claim, reason, evidence/example и link к выводу. Контраргумент представь честно: Admittedly..., It is true that... Затем ответь: However, this overlooks...; Even so... Не подменяй чужую позицию слабой версией. Concession показывает, что ты видишь сложность вопроса.",
    examples: [
      "Admittedly, the scheme costs more initially; however, maintenance costs are lower.",
      "Critics argue that the rule limits choice, yet this overlooks its safety purpose.",
      "While the sample is small, the pattern is consistent with earlier data.",
    ],
    vocabulary: [
      { en: "counterargument", ru: "контраргумент" },
      { en: "overlook", ru: "упускать из виду" },
      { en: "valid concern", ru: "обоснованное опасение" },
      { en: "on balance", ru: "в итоге, взвесив всё" },
      { en: "undermine", ru: "подрывать" },
      { en: "concede", ru: "признавать довод" },
    ],
    reading: b2Reading(
      "A city proposal would charge private cars to enter the centre at peak times. Supporters argue that the charge would reduce congestion and fund public transport. Critics reasonably point out that some shift workers cannot use existing bus services. That concern does not necessarily undermine the whole policy; it suggests that exemptions and earlier routes are needed. Another objection is that shoppers may avoid the centre. However, evidence from the recent pedestrian weekend showed higher foot traffic for local stores. On balance, the proposal deserves a trial, provided the city measures its effect on lower-paid workers.",
      "The writer concedes real problems and uses them to improve the proposal rather than dismiss it. Exemptions answer the equity concern, improved routes reduce dependence on cars, and trial data can test the uncertain effect on retail activity.",
    ),
    listening: b2Listening(
      "I support recording our lectures, although I understand why some tutors worry about attendance. It is true that a few students may watch recordings instead of coming to class. Even so, recordings help learners who are ill, working or reviewing difficult material. Attendance can be protected by keeping discussions and practical tasks live. A trial in two modules would let us compare participation before applying the policy everywhere.",
      "The speaker acknowledges the opposing prediction and proposes a design that addresses it. Recordings preserve access, while live discussion retains a reason to attend. Restricting the first trial to two modules makes participation changes observable before wider adoption. Tutors can then compare attendance, viewing and contribution instead of debating assumptions alone. Student interviews should test whether recordings support review, replace attendance or serve different purposes.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the best concession link.",
        [
          "Admittedly, the plan is costly; however, it may save money later.",
          "The plan is costly because however it saves.",
          "Admittedly therefore no contrast.",
        ],
        "Admittedly, the plan is costly; however, it may save money later.",
        "Admittedly concedes a point; however introduces the response.",
      ),
      q(
        "grammar",
        "Which response treats the objection fairly?",
        [
          "That is a valid concern, so the policy needs exemptions.",
          "Only foolish people think that.",
          "The objection proves nothing and can be ignored.",
        ],
        "That is a valid concern, so the policy needs exemptions.",
        "It acknowledges the issue and adjusts the proposal.",
      ),
      q(
        "reading",
        "How does the writer answer the shift-worker objection?",
        [
          "With exemptions and improved early routes",
          "By denying shift work exists",
          "By closing city stores",
        ],
        "With exemptions and improved early routes",
        "The concern becomes a condition for fair implementation.",
      ),
      q(
        "reading",
        "What condition supports a trial?",
        [
          "Measuring effects on lower-paid workers",
          "Guaranteeing all shoppers drive",
          "Removing public transport funding",
        ],
        "Measuring effects on lower-paid workers",
        "The conclusion is conditional on equity evidence.",
      ),
      q(
        "listening",
        "What is the tutors' concern?",
        [
          "Recordings may reduce attendance.",
          "Recordings are impossible to review.",
          "Students never become ill.",
        ],
        "Recordings may reduce attendance.",
        "The speaker states this objection directly.",
      ),
      q(
        "listening",
        "How would live participation remain valuable?",
        [
          "Through discussions and practical tasks",
          "By deleting all recordings",
          "By recording only attendance",
        ],
        "Through discussions and practical tasks",
        "Those activities cannot be replaced by passive viewing.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 120–170 слов за или против городского/учебного правила: честно представь возражение и ответь на него.",
      minWords: 120,
      model: advancedWritingModels["b2-07"]!,
      checklist: [
        "Claim-reason-example-link",
        "Честный контраргумент",
        "Ответ или условие, а не простое отрицание",
      ],
    },
    speaking: {
      prompt:
        "Проведи короткие дебаты: изложи позицию, перефразируй возражение партнёра и найди условный компромисс.",
      model:
        "You are right that the change could cost more. My point is that a limited trial would show whether the benefit justifies it. Would you support it if spending were capped?",
      checklist: [
        "Сначала точно перефразируй возражение",
        "Приведи один пример",
        "Предложи условие компромисса",
      ],
    },
  },
  {
    id: "b2-08",
    level: "B2",
    title: "Артикли в сложном контексте",
    goal: "Управлять определённостью, обобщением и ссылками в тексте.",
    theory:
      "A/an вводит один неспецифичный исчисляемый объект; the отсылает к уже известному, уникальному или уточнённому объекту; zero article используется с множественным/неисчисляемым значением в общем смысле. Institutions меняют значение: go to school как учащийся, go to the school как к зданию. Географические названия и устойчивые выражения требуют отдельного запоминания.",
    examples: [
      "Education can change a region, but the education offered must match local needs.",
      "She went to hospital as a patient; I went to the hospital to visit her.",
      "The research described in the report concerns Ø urban transport.",
    ],
    vocabulary: [
      { en: "in general", ru: "в целом" },
      { en: "specific", ru: "конкретный" },
      { en: "previously mentioned", ru: "ранее упомянутый" },
      { en: "institution", ru: "учреждение как функция" },
      { en: "the public", ru: "общественность" },
      { en: "access to", ru: "доступ к" },
    ],
    reading: b2Reading(
      "A coastal town opened a marine centre in a former warehouse. The centre offers visitors an introduction to the wildlife of the northern bay. Education is central to its purpose, but the education provided is practical rather than academic. Children can examine water samples, while researchers explain the effect of plastic on local species. The town hopes the project will attract tourism outside the summer season. Local fishers initially questioned the cost, yet several now contribute observations gathered at sea. Their knowledge gives the research a connection to everyday life in the bay.",
      "Articles guide the reader from a new centre to the specific work and community already introduced. The shift from education in general to the education provided marks a narrower programme, while the bay identifies the particular ecosystem shared by researchers and fishers.",
    ),
    listening: b2Listening(
      "We need a venue for the exhibition. The town hall has a large room, but access to the building is limited after six. A gallery near the station is available, although the gallery charges for security. Public transport is important because many visitors will come from the university. Students can enter free, while the public will pay a small fee. I suggest we visit both places before making a decision.",
      "The speaker introduces alternatives with a and then refers back to each with the. Zero article in access and public transport treats them as general considerations, whereas the public names a social group that will pay the fee. A site visit will convert these linguistic comparisons into a practical decision about evening access and total cost. Organisers can time the walk and ask both venues to state security conditions in writing.",
    ),
    questions: [
      q(
        "grammar",
        "Complete: ___ research in this report examines Ø workplace trust.",
        ["The", "A", "An"],
        "The",
        "The following phrase identifies specific research; workplace trust is a general uncountable concept.",
      ),
      q(
        "grammar",
        "Why is there no article in 'go to school' for a pupil?",
        [
          "School describes its institutional function.",
          "School is always uncountable.",
          "The building does not exist.",
        ],
        "School describes its institutional function.",
        "The expression focuses on participating in education, not a particular building.",
      ),
      q(
        "reading",
        "What makes the centre's education practical?",
        [
          "Hands-on samples and local observations",
          "Only academic lectures",
          "A ban on researchers",
        ],
        "Hands-on samples and local observations",
        "The activities connect science with direct experience.",
      ),
      q(
        "reading",
        "What changed some fishers' relationship to the project?",
        [
          "They began contributing knowledge.",
          "The centre stopped studying the bay.",
          "Summer tourism disappeared.",
        ],
        "They began contributing knowledge.",
        "Participation gave their experience a role.",
      ),
      q(
        "listening",
        "What disadvantage does the town hall have?",
        ["Limited evening access", "No large room", "Distance from the town"],
        "Limited evening access",
        "Access becomes restricted after six.",
      ),
      q(
        "listening",
        "Who pays the small fee?",
        ["The public", "Students", "Security staff"],
        "The public",
        "Students are explicitly exempt.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 120–160 слов о новом общественном месте, внимательно используя a/an, the и zero article.",
      minWords: 120,
      model: advancedWritingModels["b2-08"]!,
      checklist: [
        "Новый объект введён через a/an",
        "Повторная ссылка через the",
        "Обобщения с zero article",
      ],
    },
    speaking: {
      prompt: "Опиши два возможных места для события, вводя объекты и затем точно ссылаясь на них.",
      model:
        "There is a hall near the station and a café by the park. The hall is larger, but the café has better transport. Access is the main issue for our guests.",
      checklist: [
        "Введи два новых объекта",
        "Используй the при повторе",
        "Добавь обобщение без артикля",
      ],
    },
  },
  {
    id: "b2-09",
    level: "B2",
    title: "Убедительный обзор",
    goal: "Оценивать продукт или опыт по ясным критериям и давать полезную рекомендацию.",
    theory:
      "Review сочетает описание и оценку. В начале назови объект и ожидания, затем оцени конкретные аспекты с примерами. Используй contrast и degree: particularly effective, slightly disappointing, far more useful than. Рекомендация должна назвать подходящую аудиторию и ограничения, а не просто сказать good/bad.",
    examples: [
      "The course is particularly useful for learners who need structure.",
      "What impressed me most was the quality of the feedback.",
      "Despite a slow opening, the final section is genuinely engaging.",
    ],
    vocabulary: [
      { en: "live up to expectations", ru: "оправдать ожидания" },
      { en: "standout feature", ru: "выдающаяся особенность" },
      { en: "minor drawback", ru: "небольшой недостаток" },
      { en: "well-paced", ru: "с хорошим темпом" },
      { en: "target audience", ru: "целевая аудитория" },
      { en: "worthwhile", ru: "стоящий внимания" },
    ],
    reading: b2Reading(
      "The Clear Focus app promises to help users work without constant interruption. Its standout feature is a flexible timer that divides large tasks into realistic sessions. The weekly report is clear and avoids unnecessary statistics. However, the free version allows only three projects, which may frustrate students managing several subjects. Notifications are helpful at first but become repetitive unless settings are adjusted. Despite these minor drawbacks, the app largely lives up to its promise. It is most worthwhile for people who want gentle structure, although experienced project managers may find it too simple.",
      "The recommendation follows explicit criteria rather than a vague personal reaction. Timer flexibility, report clarity, project limits and notification quality are separately assessed. The final audience judgement follows from that evidence: structure-seeking users benefit, advanced planners may not.",
    ),
    listening: b2Listening(
      "I expected the exhibition to be highly technical, but it was surprisingly accessible. The opening room explains the science through short experiments, and the audio guide is exceptionally well-paced. What disappointed me was the final interactive screen, which froze twice and created a queue. Even so, the staff handled the problem calmly. I would recommend the exhibition to families with teenagers, though very young children might lose interest in the longer videos.",
      "The reviewer identifies both a standout quality and a specific audience limitation. Accessibility and pacing support the family recommendation, while the frozen screen is treated as a concrete defect rather than a judgement of the entire exhibition. Staff response reduces the impact of the fault, but does not erase the need for a technical fix. The review should also mention queue length and whether visitors had another route.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the natural review phrase.",
        [
          "It largely lives up to its promise.",
          "It lives largely its promise up.",
          "It performs a promise very.",
        ],
        "It largely lives up to its promise.",
        "Live up to is a fixed phrasal verb and largely modifies the evaluation.",
      ),
      q(
        "grammar",
        "Which sentence gives a qualified recommendation?",
        [
          "It suits beginners, though experts may find it basic.",
          "Everyone must love it.",
          "It is good because good.",
        ],
        "It suits beginners, though experts may find it basic.",
        "It identifies audience and limitation.",
      ),
      q(
        "reading",
        "What is the app's strongest feature?",
        ["A flexible task timer", "Unlimited free projects", "Complex statistics"],
        "A flexible task timer",
        "The writer calls it the standout feature.",
      ),
      q(
        "reading",
        "Who may find the app insufficient?",
        [
          "Experienced project managers",
          "People wanting gentle structure",
          "Users who adjust notifications",
        ],
        "Experienced project managers",
        "Its simplicity may limit advanced users.",
      ),
      q(
        "listening",
        "What caused a queue?",
        ["A freezing interactive screen", "The audio guide", "A scientific experiment"],
        "A freezing interactive screen",
        "The technical failure delayed visitors.",
      ),
      q(
        "listening",
        "Why is the recommendation limited for young children?",
        ["Some videos may be too long.", "Families are not allowed.", "The staff are unhelpful."],
        "Some videos may be too long.",
        "The reviewer anticipates an attention issue.",
      ),
    ],
    writing: {
      prompt:
        "Напиши обзор приложения, курса, книги или места в 120–170 слов с критериями и рекомендацией конкретной аудитории.",
      minWords: 120,
      model: advancedWritingModels["b2-09"]!,
      checklist: [
        "Минимум два критерия",
        "Конкретный плюс и минус",
        "Рекомендация с целевой аудиторией",
      ],
    },
    speaking: {
      prompt:
        "Дай устный обзор недавнего опыта и ответь на вопрос партнёра о том, стоит ли тратить время или деньги.",
      model:
        "The workshop was well-paced, and the feedback was the standout feature. The room was cramped, but that was a minor drawback. I would recommend it if you already have a project to practise on.",
      checklist: [
        "Назови ожидания",
        "Подкрепи оценку примером",
        "Ограничь рекомендацию по аудитории",
      ],
    },
  },
  {
    id: "b2-10",
    level: "B2",
    title: "Отчёт и рекомендации",
    goal: "Организовывать факты, выводы и практические предложения в формальном отчёте.",
    theory:
      "Report использует заголовки, нейтральный тон и ясное разделение findings/recommendations. Описывай тенденции: a majority, a significant minority, responses were divided. Не выдумывай причин из корреляции. Рекомендации связывай с выводами: Given these findings..., It is recommended that...; This would address....",
    examples: [
      "A majority of respondents valued flexible booking.",
      "Given these findings, it is recommended that opening hours be extended.",
      "This measure would address the main source of dissatisfaction.",
    ],
    vocabulary: [
      { en: "finding", ru: "вывод исследования" },
      { en: "respondent", ru: "респондент" },
      { en: "significant minority", ru: "значительное меньшинство" },
      { en: "implementation", ru: "внедрение" },
      { en: "feasible", ru: "осуществимый" },
      { en: "priority", ru: "приоритет" },
    ],
    reading: b2Reading(
      "A college surveyed 240 students about its study spaces. Sixty-eight percent said quiet rooms were usually full after four o'clock, while forty-one percent struggled to find power sockets. A significant minority requested more group rooms, but interviews showed that existing rooms were often occupied by individuals. The evidence does not establish whether overall space is insufficient or poorly allocated. The report recommends testing a booking system for group rooms, adding sockets to two quiet areas and measuring occupancy for six weeks before considering expensive building work.",
      "Each recommendation responds to a finding while acknowledging what the survey cannot establish. Booking tests allocation, added sockets answer an observed facility gap, and occupancy monitoring determines whether construction is justified. The staged sequence protects the budget from an unsupported conclusion. It also creates a baseline for judging any later construction.",
    ),
    listening: b2Listening(
      "Here are the main findings from the staff travel survey. Most respondents support secure bicycle storage, and nearly half would cycle more often if showers were available. Only twelve percent favour charging for parking immediately. Several comments suggest that employees with caring responsibilities have fewer transport alternatives. I recommend improving cycling facilities first, then reviewing travel patterns after three months. Any parking charge should include exemptions and a separate consultation.",
      "The speaker prioritises a feasible popular measure and postpones a divisive one pending fairer design. Cycling facilities have broad support and a stated behavioural link. Parking charges require consultation because employees do not have equal transport alternatives. The three-month review creates time to observe change before attaching penalties to travel choices. Data should be separated by shift and caring pattern to reveal unequal impact.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the formal recommendation.",
        [
          "It is recommended that access be extended.",
          "I reckon keep it open.",
          "Access recommends extending itself.",
        ],
        "It is recommended that access be extended.",
        "The mandative structure uses the base form be.",
      ),
      q(
        "grammar",
        "Which phrase accurately describes 35%?",
        ["a significant minority", "every respondent", "an absolute majority"],
        "a significant minority",
        "It recognises a substantial group without calling it most people.",
      ),
      q(
        "reading",
        "What remains uncertain?",
        [
          "Whether the problem is total space or allocation",
          "Whether students need electricity",
          "How many students answered",
        ],
        "Whether the problem is total space or allocation",
        "The evidence supports both possible explanations.",
      ),
      q(
        "reading",
        "Why measure occupancy before building?",
        [
          "To test whether cheaper allocation changes work",
          "To avoid collecting any evidence",
          "To remove all group rooms",
        ],
        "To test whether cheaper allocation changes work",
        "The recommendation follows a staged evidence-based approach.",
      ),
      q(
        "listening",
        "Which improvement has strongest immediate support?",
        ["Cycling facilities", "Parking charges", "Fewer transport options"],
        "Cycling facilities",
        "Most support storage and many would use showers.",
      ),
      q(
        "listening",
        "Why are parking exemptions mentioned?",
        [
          "Some staff have limited alternatives.",
          "Everyone wants an immediate charge.",
          "Bicycle storage is unpopular.",
        ],
        "Some staff have limited alternatives.",
        "Caring responsibilities affect transport choice.",
      ),
    ],
    writing: {
      prompt:
        "Напиши отчёт 120–180 слов по воображаемому опросу об учебном пространстве: findings и три связанные рекомендации.",
      minWords: 120,
      model: advancedWritingModels["b2-10"]!,
      checklist: [
        "Заголовки findings/recommendations",
        "Количественные формулировки без преувеличения",
        "Каждая рекомендация связана с выводом",
      ],
    },
    speaking: {
      prompt:
        "Устно представь три результата опроса и согласуй с партнёром приоритетную рекомендацию.",
      model:
        "The strongest finding is demand for quiet space. Group rooms matter to a significant minority, but expansion is expensive. I suggest testing zoning first. Which result would you prioritise?",
      checklist: [
        "Отдели данные от интерпретации",
        "Сравни реализуемость",
        "Согласуй один первый шаг",
      ],
    },
  },
  {
    id: "b2-11",
    level: "B2",
    title: "Переговоры и условия",
    goal: "Уточнять интересы, делать условные предложения и фиксировать договорённость.",
    theory:
      "Позиция — что сторона просит; интерес — зачем это нужно. Сначала уточни интересы: What would make this workable? Затем предложи trade-off: We could..., provided that...; If you were able to..., we could... Избегай раннего yes/no. В конце проверь понимание: So, what we have agreed is... и назови следующий шаг.",
    examples: [
      "We could extend the deadline, provided that you send a draft on Monday.",
      "If you reduced the quantity, we would be able to improve the quality.",
      "So, we have agreed on a two-week trial, subject to a review.",
    ],
    vocabulary: [
      { en: "trade-off", ru: "компромисс между выгодами" },
      { en: "workable", ru: "работоспособный" },
      { en: "provided that", ru: "при условии что" },
      { en: "concession", ru: "уступка" },
      { en: "common ground", ru: "общая позиция" },
      { en: "subject to", ru: "при условии, с последующим" },
    ],
    reading: b2Reading(
      "A community theatre wanted to rent a school hall every Friday, but the school needed the space for occasional events. At first, both sides defended fixed positions. The theatre demanded certainty; the school refused a permanent commitment. Once they discussed interests, they found common ground. The theatre mainly needed six weeks' notice, while the school needed priority on four dates each year. They agreed to a twelve-month booking provided that the school identified blocked dates before each term. The theatre also accepted responsibility for additional cleaning. The arrangement will be reviewed after six months.",
      "The agreement becomes possible when certainty and flexibility are treated as interests rather than incompatible demands. Advance notice protects theatre planning, priority dates preserve school control, and additional cleaning compensates for shared use. The review keeps the arrangement adjustable.",
    ),
    listening: b2Listening(
      "We can offer the lower price if the order increases to five hundred units. I understand that storage is your concern, so we could deliver in three batches. In return, we would need payment for each batch within ten days. Would that make the larger order workable? If so, I will send a revised quotation today. To confirm, the price depends on total volume, while delivery and payment are divided into three stages.",
      "The speaker links each concession to a condition and checks that the summary matches both sides' interests. Higher volume earns a lower price, staged delivery protects storage capacity, and staged payment limits the supplier's financial exposure. Sending a revised quotation turns the oral outline into a document both parties can verify before accepting. It should list dates, quantities and consequences of delay.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the conditional offer.",
        [
          "We can delay delivery, provided that the deposit is paid.",
          "We delay because perhaps deposit.",
          "Provided the delivery paid us.",
        ],
        "We can delay delivery, provided that the deposit is paid.",
        "Provided that states the condition attached to the concession.",
      ),
      q(
        "grammar",
        "Which phrase confirms agreement?",
        [
          "So, we have agreed on a two-stage trial.",
          "Whatever, probably fine.",
          "You know what I mean.",
        ],
        "So, we have agreed on a two-stage trial.",
        "It explicitly checks the shared outcome.",
      ),
      q(
        "reading",
        "What was the theatre's underlying interest?",
        ["Reliable notice", "Exclusive ownership", "Free cleaning"],
        "Reliable notice",
        "Six weeks' notice mattered more than every Friday being guaranteed.",
      ),
      q(
        "reading",
        "What concession did the theatre make?",
        [
          "It accepted extra cleaning.",
          "It cancelled all performances.",
          "It blocked four school events.",
        ],
        "It accepted extra cleaning.",
        "This balances the school's concession on booking.",
      ),
      q(
        "listening",
        "How is the storage problem addressed?",
        ["Delivery in three batches", "A smaller discount", "Immediate full payment"],
        "Delivery in three batches",
        "Staging reduces the buyer's storage burden.",
      ),
      q(
        "listening",
        "What determines the lower price?",
        ["Total order volume", "The number of deliveries alone", "A ten-day delay"],
        "Total order volume",
        "The final summary states the condition clearly.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 120–160 слов с предложением сделки: интересы сторон, две уступки, условия и итог.",
      minWords: 120,
      model: advancedWritingModels["b2-11"]!,
      checklist: [
        "Отделены позиции от интересов",
        "Уступки связаны с условиями",
        "В конце точное резюме сделки",
      ],
    },
    speaking: {
      prompt:
        "Разыграйте переговоры об аренде, сроках или распределении ресурсов и достигните условного соглашения.",
      model:
        "Our concern is reliable access, not exclusive use. We could share the room, provided that our three dates are protected. What would make that workable for you?",
      checklist: [
        "Задай вопрос об интересе",
        "Предложи обмен уступками",
        "Подтверди итог и следующий шаг",
      ],
    },
  },
  {
    id: "b2-12",
    level: "B2",
    title: "Медиация и прояснение",
    goal: "Передавать смысл между людьми, упрощать сложную информацию и снижать напряжение.",
    theory:
      "Mediation — не дословный перевод, а точная передача нужного смысла для конкретной аудитории. Выдели цель, перефразируй термин, проверь понимание и нейтрально передай позиции: What Alex means is...; The main point for us is...; In practical terms... При конфликте отделяй наблюдение от обвинения и находи общий интерес.",
    examples: [
      "In practical terms, the rule means that visitors must book one day ahead.",
      "What Mei is concerned about is the lack of notice, not the change itself.",
      "Let me check that I have represented both views accurately.",
    ],
    vocabulary: [
      { en: "clarify", ru: "прояснять" },
      { en: "in practical terms", ru: "на практике" },
      { en: "misunderstanding", ru: "недопонимание" },
      { en: "shared concern", ru: "общее опасение" },
      { en: "rephrase", ru: "переформулировать" },
      { en: "represent accurately", ru: "точно передавать позицию" },
    ],
    reading: b2Reading(
      "A housing association sent residents a technical notice about a new heating system. Several older residents believed they would lose control of their radiators, while the engineers thought the notice was clear. A volunteer mediator rewrote the key points in practical language. The system would adjust the building's basic temperature, but each flat could still make smaller changes. Installation required two short visits, arranged by appointment. At a meeting, the mediator explained that residents' main concern was control, not opposition to saving energy. The engineers then demonstrated the controls and added a telephone booking option.",
      "Successful mediation identifies the fear behind a reaction and translates technical detail into consequences people can use. Once individual control and appointment access became explicit, engineers could respond with a demonstration and a telephone option rather than repeating the original notice.",
    ),
    listening: b2Listening(
      "Let me make sure I have both positions right. The events team needs final numbers by Tuesday because catering orders close then. Sam is not refusing to confirm; he is concerned that two speakers may cancel on Wednesday. In practical terms, we need a number that can change slightly. Could we confirm eighty guests on Tuesday, with permission to adjust by five before Thursday noon? That would give catering a reliable base and keep limited flexibility for the programme team.",
      "The mediator removes personal blame, names the practical constraints and converts them into a precise compromise. The base figure lets catering act on time, while the limited adjustment recognises programme uncertainty without transferring unlimited risk to the supplier. Asking both teams to confirm the summary would complete the mediation loop.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the clearest mediation phrase.",
        [
          "In practical terms, you need to submit one form.",
          "Technically operationalisation remains obligatory.",
          "You obviously failed to understand.",
        ],
        "In practical terms, you need to submit one form.",
        "It translates the rule into an actionable consequence.",
      ),
      q(
        "grammar",
        "Which sentence neutrally represents concern?",
        [
          "What Sam is concerned about is late cancellation.",
          "Sam wants to ruin the order.",
          "Sam refuses everything.",
        ],
        "What Sam is concerned about is late cancellation.",
        "It identifies an interest without attributing hostile intent.",
      ),
      q(
        "reading",
        "What did residents fear losing?",
        ["Control of their heating", "All appointments", "Telephone access"],
        "Control of their heating",
        "The mediator identifies control as the central concern.",
      ),
      q(
        "reading",
        "What changed after mediation?",
        [
          "Engineers demonstrated controls and added phone booking.",
          "The heating project was abandoned.",
          "Residents wrote a more technical notice.",
        ],
        "Engineers demonstrated controls and added phone booking.",
        "The response addressed both understanding and access.",
      ),
      q(
        "listening",
        "Why does the events team need Tuesday's number?",
        ["Catering orders close then.", "All speakers arrive then.", "The venue closes Thursday."],
        "Catering orders close then.",
        "The deadline comes from an external practical constraint.",
      ),
      q(
        "listening",
        "What compromise is proposed?",
        [
          "A base of eighty with a limited later adjustment",
          "No number until Thursday",
          "Unlimited changes after catering closes",
        ],
        "A base of eighty with a limited later adjustment",
        "It balances reliability and flexibility.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 120–170 слов: объясни сложное правило неспециалисту и нейтрально сведи две разные позиции.",
      minWords: 120,
      model: advancedWritingModels["b2-12"]!,
      checklist: [
        "Термин объяснён простыми последствиями",
        "Обе позиции переданы нейтрально",
        "Есть проверка понимания или компромисс",
      ],
    },
    speaking: {
      prompt:
        "Выступи посредником между двумя людьми с разными приоритетами и помоги им сформулировать общий следующий шаг.",
      model:
        "What Nina needs is predictable timing. Omar's concern is that the data may change. Could we send a preliminary figure today and label it clearly, then confirm it tomorrow?",
      checklist: [
        "Не добавляй мотивов от себя",
        "Перефразируй обе позиции",
        "Получи явное согласие на следующий шаг",
      ],
    },
  },
  {
    id: "c1-01",
    level: "C1",
    title: "Инверсия для акцента",
    goal: "Использовать отрицательную и условную инверсию точно, без искусственной формальности.",
    theory:
      "После отрицательных или ограничительных выражений в начале предложения ставь вспомогательный глагол перед субъектом: Never have I seen..., Only after the audit did we realise..., Under no circumstances should.... С hardly/scarcely действие часто продолжается через when; с no sooner — через than. В условной инверсии if опускается: Had we known; Were the plan to fail; Should you require help. Инверсия усиливает акцент, поэтому не перегружай ею нейтральный текст.",
    examples: [
      "Only after the second trial did the pattern become clear.",
      "Rarely do short-term savings justify permanent damage.",
      "Should the evidence change, the panel will reconsider its decision.",
    ],
    vocabulary: [
      { en: "under no circumstances", ru: "ни при каких обстоятельствах" },
      { en: "only after", ru: "только после" },
      { en: "scarcely", ru: "едва" },
      { en: "by no means", ru: "ни в коем случае не" },
      { en: "reconsider", ru: "пересмотреть" },
      { en: "contingency", ru: "непредвиденное обстоятельство" },
    ],
    reading: c1Reading(
      "Only after a coastal town had completed an expensive sea wall did engineers identify a less visible threat: groundwater was rising behind it. Never had the council modelled both sources of flooding together. The wall remained useful, but by no means offered the complete protection described during the funding campaign. Had the earlier assessment included local well data, the drainage problem might have been anticipated. The council has now commissioned an integrated model and published the assumptions behind it. Rarely does one intervention eliminate a complex environmental risk; more often, it changes where that risk appears. Should the new model confirm the engineers' concern, the next budget will prioritise drainage channels and household grants rather than a higher wall.",
      "The marked word order foregrounds late discovery, limits and contingency rather than merely making the prose sound formal. The revised response also changes the unit of intervention: instead of repeatedly enlarging one barrier, the council will model interacting systems and direct grants towards households whose risk cannot be solved by a single public structure. Publication of assumptions makes later revision possible.",
    ),
    listening: c1Listening(
      "Scarcely had our team announced the new appointment system when complaints began arriving. Only then did we realise that the confirmation email displayed the office time zone, not the user's local one. Under no circumstances should clients be blamed for missing appointments generated by our own interface. We have corrected future messages, but that alone is insufficient. Had we tested the service with users abroad, the flaw would probably have appeared before launch. I propose that we waive the missed-appointment fee, contact everyone affected and add cross-region testing to the release checklist. Should legal wording prevent an automatic refund, support staff must be authorised to review cases individually.",
      "The speaker uses inversion to emphasise sequence and responsibility, then moves to practical remedies. Waiving fees repairs immediate harm; direct contact prevents affected clients from discovering the mistake alone; cross-region testing changes the development process. The legal caveat is treated as a routing problem for human review, not an excuse to abandon restitution. Affected cases should also be counted, allowing the team to verify that remediation reaches every client rather than only those who complain twice.",
    ),
    questions: [
      q(
        "grammar",
        "Complete: Only after the data was cleaned ___ the error.",
        ["did we notice", "we noticed", "had we noticed"],
        "did we notice",
        "Fronted Only after triggers auxiliary-subject inversion in the main clause.",
      ),
      q(
        "grammar",
        "Choose the formal conditional equivalent of 'If you need assistance'.",
        [
          "Should you require assistance",
          "Should you required assistance",
          "Had you required assistance",
        ],
        "Should you require assistance",
        "Should + subject + infinitive forms a tentative future condition.",
      ),
      q(
        "reading",
        "What did the sea wall change rather than solve?",
        [
          "The location and form of flood risk",
          "The council's access to well data",
          "The existence of the coastline",
        ],
        "The location and form of flood risk",
        "Groundwater became the less visible remaining threat.",
      ),
      q(
        "reading",
        "Why is the original campaign implicitly criticised?",
        [
          "It presented partial protection as complete.",
          "It refused to build any barrier.",
          "It published too many assumptions.",
        ],
        "It presented partial protection as complete.",
        "The phrase by no means contrasts reality with the campaign description.",
      ),
      q(
        "listening",
        "What is the speaker's main ethical conclusion?",
        [
          "Users should not pay for an interface error.",
          "International users should calculate time zones alone.",
          "All appointments should be cancelled.",
        ],
        "Users should not pay for an interface error.",
        "Responsibility is assigned to the service design.",
      ),
      q(
        "listening",
        "What does the legal caveat imply?",
        [
          "Refunds may need human review rather than being impossible.",
          "The legal wording prevents any refund before system retesting.",
          "Cross-region testing can replace individual case review.",
        ],
        "Refunds may need human review rather than being impossible.",
        "The contingency changes the mechanism, not the remedy.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 180–230 слов о запоздало обнаруженной системной проблеме. Уместно используй три вида инверсии.",
      minWords: 180,
      model: advancedWritingModels["c1-01"]!,
      checklist: [
        "Три корректные инверсии разных типов",
        "Инверсия служит смысловому акценту",
        "Есть системное объяснение и пропорциональное решение",
      ],
    },
    speaking: {
      prompt:
        "Представь критический разбор провала и ответь на возражение, используя инверсию только в ключевых точках.",
      model:
        "Only after users complained did we examine the time-zone display. Had we tested internationally, we would have caught it. Should resources be limited, refunds must still take priority because the error was ours.",
      checklist: [
        "Не больше трёх инверсий",
        "Свяжи акцент с ответственностью",
        "Ответь на одно возражение",
      ],
    },
  },
  {
    id: "c1-02",
    level: "C1",
    title: "Cleft-конструкции и фокус",
    goal: "Переносить смысловой фокус и исправлять неверные предположения.",
    theory:
      "Cleft sentences выделяют нужную часть сообщения. It-cleft: It was the timing that caused concern. Wh-cleft: What the team needs is clearer ownership. Reversed wh-cleft: Clear ownership is what the team needs. All-cleft ограничивает запрос: All I asked for was an update. Используй их для контраста, коррекции и резюме, но не в каждом предложении.",
    examples: [
      "It was the lack of consultation that damaged trust.",
      "What the evidence shows is a change in behaviour, not motivation.",
      "A workable transition is what residents are asking for.",
    ],
    vocabulary: [
      { en: "foreground", ru: "выдвигать на первый план" },
      { en: "misconception", ru: "ошибочное представление" },
      { en: "underlying issue", ru: "глубинная проблема" },
      { en: "distinction", ru: "различие" },
      { en: "emphasis", ru: "акцент" },
      { en: "frame", ru: "формулировать рамку" },
    ],
    reading: c1Reading(
      "When a research institute introduced desk sharing, managers assumed employees objected to losing personal space. What interviews revealed, however, was anxiety about finding specialist equipment at short notice. It was not ownership of a particular desk that mattered most; it was predictability. All the technicians wanted was a reliable booking view and guaranteed access to calibrated monitors. Once the institute reframed the dispute, resistance fell. A pilot zone displayed equipment status in real time and reserved several workstations for urgent tasks. What this episode illustrates is that apparently emotional resistance may contain precise operational knowledge. Listening became useful only when managers stopped defending their original explanation and asked what practical condition would make the change workable.",
      "Cleft structures repeatedly correct the initial misconception and isolate the true source of concern. The pilot succeeds because it operationalises predictability: equipment status becomes visible and urgent capacity is protected. More importantly, the institute treats interviews as diagnostic evidence rather than as a public-relations exercise. The resulting change answers what technicians actually said. Future evaluation should examine search time and urgent-task delays, not merely count how many employees accept shared desks.",
    ),
    listening: c1Listening(
      "It was not the price increase itself that led us to change suppliers. What concerned us was the absence of any explanation for it. We accept that material costs fluctuate; all we asked for was evidence and reasonable notice. The account manager eventually sent a detailed breakdown, but by then production planning had already been disrupted. A transparent adjustment process is what could restore the relationship. If future changes were linked to a published index and announced thirty days ahead, we would consider a shorter contract rather than ending cooperation entirely.",
      "The speaker distinguishes an acceptable commercial reality from the communication failure that damaged trust. An indexed formula would make the basis of future changes inspectable, while advance notice would protect production planning. Offering a shorter contract shows that the relationship is recoverable, but only through a process that converts explanation from a favour into a predictable obligation. The supplier would still retain room to respond to genuine cost movement, but could no longer change terms without a traceable basis. Both parties could distinguish a justified adjustment from a planning surprise.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the cleft that corrects the assumed cause.",
        [
          "It was uncertainty that caused resistance.",
          "Uncertainty caused the resistance.",
          "The resistance was caused by uncertainty.",
        ],
        "It was uncertainty that caused resistance.",
        "The it-cleft places contrastive focus on uncertainty.",
      ),
      q(
        "grammar",
        "Complete: What we need ___ a clear decision rule.",
        ["is", "are", "be"],
        "is",
        "The wh-clause functions as a singular subject whose complement is a clear decision rule.",
      ),
      q(
        "reading",
        "What did managers initially misdiagnose?",
        [
          "A need for predictable equipment access as attachment to desks",
          "A shortage of employees as excess equipment",
          "An urgent-task system as personal ownership",
        ],
        "A need for predictable equipment access as attachment to desks",
        "Interviews revealed an operational rather than symbolic concern.",
      ),
      q(
        "reading",
        "What broader inference does the writer make?",
        [
          "Resistance can encode practical expertise.",
          "Resistance mainly reflects attachment to personal desks.",
          "The pilot proves that equipment availability was the only concern.",
        ],
        "Resistance can encode practical expertise.",
        "The episode reframes opposition as potentially informative.",
      ),
      q(
        "listening",
        "What actually triggered the supplier change?",
        [
          "Unexplained and poorly timed communication",
          "Any increase in material prices",
          "A published price index",
        ],
        "Unexplained and poorly timed communication",
        "The speaker explicitly contrasts price with process.",
      ),
      q(
        "listening",
        "What could preserve cooperation?",
        [
          "A transparent indexed notice process",
          "A verbal assurance before each increase",
          "A longer contract without a notice clause",
        ],
        "A transparent indexed notice process",
        "Predictability could support a shorter renewed contract.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 180–230 слов, исправляя распространённое неверное объяснение проблемы с помощью cleft-конструкций.",
      minWords: 180,
      model: advancedWritingModels["c1-02"]!,
      checklist: [
        "Три естественные cleft-конструкции",
        "Явно исправлено неверное предположение",
        "Решение следует из нового объяснения",
      ],
    },
    speaking: {
      prompt: "Исправь неверное понимание своей позиции и уточни, что именно для тебя важно.",
      model:
        "It isn't the deadline that I oppose; it's the lack of review time. What I need is one day for checking. A staged submission is what would make the deadline realistic.",
      checklist: [
        "Сделай контраст причины",
        "Сформулируй реальную потребность",
        "Предложи рабочее условие",
      ],
    },
  },
  {
    id: "c1-03",
    level: "C1",
    title: "Эллипсис и связность диалога",
    goal: "Избегать ненужных повторов и понимать пропущенную информацию в быстрой речи.",
    theory:
      "Ellipsis опускает восстановимые элементы: I can attend, but Jo can't [attend]. После auxiliary возможна substitution: I hope so / I suppose not; do so; if necessary; when possible. В сравнении часто сохраняй auxiliary для ясности: Maya works faster than I do. Эллипсис естественен в диалоге и компактном письме, но опасен, если возможны два толкования.",
    examples: [
      "Some participants approved the plan; others did not.",
      "I expect the first phase to work, and I hope the second will too.",
      "We can revise the schedule if necessary, though I doubt it will be.",
    ],
    vocabulary: [
      { en: "recoverable", ru: "восстанавливаемый из контекста" },
      { en: "substitution", ru: "замещение" },
      { en: "ambiguity", ru: "двусмысленность" },
      { en: "if necessary", ru: "если необходимо" },
      { en: "do so", ru: "сделать это" },
      { en: "cohesion", ru: "связность" },
    ],
    reading: c1Reading(
      "Two departments agreed to share a laboratory, although neither expected the arrangement to be simple. The chemistry team needed morning access; the ecology team did too, but only during sampling weeks. Managers assumed a fixed timetable would solve the conflict. It did not. Researchers swapped sessions informally when they could and recorded changes when they remembered to. Some wanted a stricter system; others did not, fearing that urgent work would become impossible. The eventual protocol required teams to confirm priority periods monthly and to release unused slots whenever possible. If an emergency arose, the laboratory coordinator could override the schedule, but was expected to explain why. The protocol did not remove competing demands, nor was it intended to. It made exceptions visible enough for both teams to judge whether they were fair.",
      "Ellipsis keeps recurring actions compact while the explicit final clauses prevent ambiguity about the protocol's limited purpose. Monthly priority periods recognise foreseeable demand; coordinator overrides handle exceptional demand; explanations make those overrides reviewable. Fairness therefore comes from a visible process rather than an impossible promise that both teams will always receive their preferred time.",
    ),
    listening: c1Listening(
      "Can we publish the preliminary figures today? We could, but I would rather not. The regional totals are stable; the age breakdown isn't. Do you expect it to change substantially? I hope not, though two centres still have to validate their records. The director wants a headline number, and we can provide one if necessary. If we do, however, the note must state what has and has not been checked. Some journalists will read the caveat carefully; others won't. That does not mean we should omit it. It means the headline and the caveat must tell the same story.",
      "The speakers omit repeated predicates fluently, but restore detail where omission could misrepresent the evidence. A regional total and an age breakdown have different validation status, so a single label such as preliminary would be too vague. The proposed note must identify the open records, and the headline must avoid implying that every subgroup has been checked. If journalists quote only the headline, it should remain accurate without depending on a caveat buried below it. A release log should record which tables were validated.",
    ),
    questions: [
      q(
        "grammar",
        "Complete naturally: Lee can join the morning call, but Ana ___.",
        ["can't", "doesn't", "won't be able"],
        "can't",
        "The repeated predicate join the morning call is recoverable.",
      ),
      q(
        "grammar",
        "Choose the clearest substitution.",
        [
          "We may revise the protocol and will do so if needed.",
          "We may revise it and will make so if needed.",
          "We may revise and will so if needed.",
        ],
        "We may revise the protocol and will do so if needed.",
        "Do so substitutes for the stated action without ambiguity.",
      ),
      q(
        "reading",
        "Why did a fixed timetable fail?",
        [
          "Demand changed during sampling periods and emergencies.",
          "Neither team needed mornings.",
          "The coordinator refused to explain decisions.",
        ],
        "Demand changed during sampling periods and emergencies.",
        "A rigid schedule could not represent variable priorities.",
      ),
      q(
        "reading",
        "What is the protocol's real achievement?",
        [
          "It makes exceptions accountable.",
          "It removes all competing demands.",
          "It eliminates informal cooperation.",
        ],
        "It makes exceptions accountable.",
        "Visibility allows teams to assess fairness.",
      ),
      q(
        "listening",
        "Which data remain unstable?",
        ["The age breakdown", "The regional totals", "The headline number already published"],
        "The age breakdown",
        "The short answer 'isn't' recovers stable from context.",
      ),
      q(
        "listening",
        "What principle guides publication?",
        [
          "The headline must not contradict the caveat.",
          "Caveats should be hidden because some ignore them.",
          "Only fully final data may ever be mentioned.",
        ],
        "The headline must not contradict the caveat.",
        "The final sentence states this alignment requirement.",
      ),
    ],
    writing: {
      prompt:
        "Напиши диалог или служебную записку 180–220 слов, используя эллипсис для связности, но сохраняя ясность в ключевых условиях.",
      minWords: 180,
      model: advancedWritingModels["c1-03"]!,
      checklist: [
        "Три естественных случая эллипсиса",
        "Нет двусмысленности в условиях",
        "Ключевые ограничения названы полностью",
      ],
    },
    speaking: {
      prompt:
        "Проведи быстрый рабочий диалог: соглашайся, сомневайся и уточняй без повторения длинных фраз.",
      model:
        "Can we release the total? We can, but I'd rather not. Is the breakdown stable? I don't think so. If necessary, we can publish the verified part and label it clearly.",
      checklist: [
        "Используй auxiliary ellipsis",
        "Добавь hope so/not или do so",
        "Разверни фразу там, где цена ошибки высока",
      ],
    },
  },
  {
    id: "c1-04",
    level: "C1",
    title: "Номинализация и плотный стиль",
    goal: "Переключаться между ясным глагольным и формальным номинальным стилем.",
    theory:
      "Nominalisation превращает действие/качество в существительное: decide → decision, fail → failure, available → availability. Она помогает упаковать аргумент и связать идеи: The committee rejected the plan → The rejection prompted.... Но цепочки абстрактных существительных скрывают исполнителя. В отчёте сочетай плотность с ясностью: называй действующее лицо, когда ответственность важна.",
    examples: [
      "The rejection of the proposal prompted a review.",
      "A reduction in processing time led to greater availability.",
      '"Managers delayed publication" is clearer than "A delay in publication occurred" when responsibility matters.',
    ],
    vocabulary: [
      { en: "implementation", ru: "внедрение" },
      { en: "allocation", ru: "распределение" },
      { en: "compliance", ru: "соблюдение требований" },
      { en: "feasibility", ru: "осуществимость" },
      { en: "accountability", ru: "подотчётность" },
      { en: "assessment", ru: "оценка" },
    ],
    reading: c1Reading(
      "The rapid expansion of a regional health helpline produced an unexpected decline in response quality. Initial recruitment increased staffing, but inadequate supervision meant that new advisers received inconsistent guidance. Management's first response referred vaguely to 'challenges in implementation'. That phrase compressed the problem while concealing who could act. A later review was more precise: supervisors had postponed weekly calibration sessions, and senior managers had allocated no protected time for mentoring. The restoration of those sessions improved consistency within two months. Nominalisation remained useful when the report described trends, such as the reduction in waiting time and the improvement in referral accuracy. Active clauses were more appropriate when it assigned responsibility. The final document was formal not because every verb became a noun, but because its grammatical choices matched its analytical purpose.",
      "Dense noun phrases summarise processes, whereas active verbs reveal the decisions that produced them. This alternation also improves remedy design. Once supervisors and senior managers reappear as grammatical actors, the organisation can protect mentoring time and assign monitoring responsibility. The report remains concise, yet no longer presents preventable management choices as an impersonal decline that merely happened.",
    ),
    listening: c1Listening(
      "Our assessment identified a deterioration in response times following the introduction of the new form. That sentence is accurate, but it is not sufficiently useful. Staff did not suddenly become slower: the software required them to enter the same address three times. The duplication caused the delay. Removal of the extra fields should produce an immediate improvement, while a broader redesign will require consultation. I suggest that the report retain the trend data but state plainly that we approved the form without observing a complete transaction. That decision, rather than 'implementation difficulty', is the lesson we can act on.",
      "The speaker alternates nominal summary with active responsibility to prevent formal language from obscuring cause. Immediate field removal is separated from the slower consultation needed for redesign, so urgency does not erase participation. Admitting that the team approved the form without observing a full transaction creates a concrete test requirement for future releases. It also gives managers a specific control they can audit instead of asking staff to work faster around a defective workflow. Later consultation can test whether remaining fields serve a real purpose.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the clearest accountable sentence.",
        [
          "Managers cancelled the review.",
          "The review was cancelled.",
          "There was a cancellation of the review.",
        ],
        "Managers cancelled the review.",
        "The active clause names the responsible actor directly.",
      ),
      q(
        "grammar",
        "Which nominalisation creates cohesion?",
        [
          "The team expanded. This expansion increased costs.",
          "The team expanded. This expanding increased costs.",
          "The expansion team increased its costs.",
        ],
        "The team expanded. This expansion increased costs.",
        "The noun refers back compactly to the previous proposition.",
      ),
      q(
        "reading",
        "Why was 'challenges in implementation' inadequate?",
        [
          "It concealed actionable responsibility.",
          "It was too informal for a report.",
          "It named supervisors too directly.",
        ],
        "It concealed actionable responsibility.",
        "The abstract phrase did not show which decisions caused inconsistency.",
      ),
      q(
        "reading",
        "What principle shaped the final report?",
        [
          "Grammar followed analytical purpose.",
          "Every verb became a noun.",
          "Responsibility was removed from the text.",
        ],
        "Grammar followed analytical purpose.",
        "The report used different structures for trends and accountability.",
      ),
      q(
        "listening",
        "What actually slowed staff?",
        ["Repeated address entry", "Lower motivation", "Consultation about redesign"],
        "Repeated address entry",
        "The form duplicated the same task three times.",
      ),
      q(
        "listening",
        "What lesson does the speaker want recorded?",
        [
          "The form was approved without observing a full transaction.",
          "All implementation is difficult.",
          "Trend data should be deleted.",
        ],
        "The form was approved without observing a full transaction.",
        "That active decision is more actionable than the vague label.",
      ),
    ],
    writing: {
      prompt:
        "Напиши формальный анализ 180–240 слов: используй номинализацию для тенденций и активный залог для ответственности.",
      minWords: 180,
      model: advancedWritingModels["c1-04"]!,
      checklist: [
        "Номинализации суммируют процессы",
        "Активные фразы называют ответственных",
        "Нет длинной цепочки абстрактных существительных",
      ],
    },
    speaking: {
      prompt:
        "Объясни формальный отчёт простым языком, раскрыв скрытого исполнителя и причинную связь.",
      model:
        "The report says there was a deterioration after implementation. In plain terms, we added duplicate fields, so staff became slower. Removing them should improve response time.",
      checklist: [
        "Расшифруй две номинализации",
        "Назови деятеля",
        "Сохрани точность исходного вывода",
      ],
    },
  },
  {
    id: "c1-05",
    level: "C1",
    title: "Регистр и профессиональная дипломатия",
    goal: "Адаптировать прямоту, дистанцию и вежливость к отношениям и риску.",
    theory:
      "Регистр — это выбор слов, грамматики и прямоты под ситуацию. Дипломатия не означает туманность: вместо Your plan is wrong — I am not yet convinced that the current plan addresses.... Используй acknowledge + concern + request: I appreciate..., however..., could you.... Для срочного риска формулируй требование ясно. Чрезмерные apologies и пассивы могут скрыть ответственность.",
    examples: [
      "I appreciate the work completed so far; however, the current evidence does not support rollout.",
      "Could you clarify how the estimate accounts for seasonal demand?",
      "Given the safety risk, testing must stop until the fault is identified.",
    ],
    vocabulary: [
      { en: "raise a concern", ru: "обозначить опасение" },
      { en: "not yet convinced", ru: "пока не убеждён" },
      { en: "constructive", ru: "конструктивный" },
      { en: "unambiguous", ru: "недвусмысленный" },
      { en: "escalate", ru: "передать на более высокий уровень" },
      { en: "acknowledge", ru: "признать, отметить" },
    ],
    reading: c1Reading(
      "A project reviewer rejected a proposal with the sentence, 'This model is unrealistic and the team has ignored obvious risks.' Although the underlying concern was legitimate, the wording encouraged defence rather than revision. A senior reviewer reframed the message: she acknowledged the detailed cost work, identified two assumptions that lacked evidence and requested a sensitivity analysis before approval. Her version was less aggressive but more operationally precise. Diplomacy did not require her to pretend that the proposal was ready. On the contrary, she stated unambiguously that funding could not proceed under the current model. The difference lay in separating the quality of the work from the adequacy of the evidence, and in converting judgement into a testable request. When stakes are high, respectful specificity often produces firmer accountability than blunt criticism.",
      "Professional tone protects collaboration while preserving a clear decision boundary. The revised review specifies missing evidence, the analysis required and the consequence for funding. Because the team can respond to observable criteria, accountability becomes stronger. The message rejects the current proposal without implying that its authors are incapable of producing a viable revision.",
    ),
    listening: c1Listening(
      "Thank you for sending the revised schedule. I can see that the team has reduced the testing period to protect the launch date. I am concerned, however, that no time remains for accessibility checks. Could you clarify whether those checks have been moved or removed? If they have been removed, I cannot approve the schedule. This is not a request for a general delay: I would support moving two lower-risk features to the next release so that accessibility testing remains complete. Please send the updated scope by noon, as the compliance review begins tomorrow.",
      "The speaker acknowledges effort, asks for clarification, states a non-negotiable boundary and offers a focused alternative. The noon deadline is justified by tomorrow's compliance review, so urgency is informative rather than theatrical. Moving lower-risk features preserves the launch objective while refusing to treat accessibility as optional quality work. The recipient knows exactly what information is required, what outcome depends on it and which scope adjustment could produce approval. Courtesy cannot then be mistaken for consent. Nor can urgency be used to bypass the stated boundary.  Accountability remains explicit.",
    ),
    questions: [
      q(
        "grammar",
        "Which version is diplomatic and precise?",
        [
          "I am not yet convinced the estimate covers seasonal demand.",
          "You have clearly ignored seasonal demand.",
          "There may perhaps be some issues with the estimate.",
        ],
        "I am not yet convinced the estimate covers seasonal demand.",
        "It marks a current evidence gap without personal attack or vagueness.",
      ),
      q(
        "grammar",
        "When is direct language most appropriate?",
        [
          "When an immediate safety boundary must be clear",
          "When a low-risk preference needs informal discussion",
          "When the speaker wants to avoid documenting a concern",
        ],
        "When an immediate safety boundary must be clear",
        "Politeness must not blur urgent risk controls.",
      ),
      q(
        "reading",
        "What improved in the senior reviewer's version?",
        [
          "Criticism became testable action without weakening the decision.",
          "The reviewer made the decision less definite.",
          "The reviewer replaced evidence with a polite tone.",
        ],
        "Criticism became testable action without weakening the decision.",
        "The request for sensitivity analysis made revision concrete.",
      ),
      q(
        "reading",
        "What distinction protected collaboration?",
        [
          "Work quality versus evidence adequacy",
          "Senior versus junior job titles",
          "Cost versus schedule alone",
        ],
        "Work quality versus evidence adequacy",
        "The reviewer criticised support for the conclusion, not the team's worth.",
      ),
      q(
        "listening",
        "What is non-negotiable?",
        [
          "Complete accessibility testing",
          "Keeping every lower-risk feature",
          "A general launch delay",
        ],
        "Complete accessibility testing",
        "The speaker refuses approval if checks were removed.",
      ),
      q(
        "listening",
        "What alternative is offered?",
        [
          "Move lower-risk features to a later release.",
          "Cancel compliance review.",
          "Approve without clarification.",
        ],
        "Move lower-risk features to a later release.",
        "Scope changes preserve the essential test.",
      ),
    ],
    writing: {
      prompt:
        "Напиши дипломатичное, но ясное письмо 180–230 слов, отклоняя предложение и предлагая путь к пересмотру.",
      minWords: 180,
      model: advancedWritingModels["c1-05"]!,
      checklist: [
        "Признан вклад без ложной похвалы",
        "Решение сформулировано недвусмысленно",
        "Есть конкретные условия пересмотра",
      ],
    },
    speaking: {
      prompt: "Сообщи неприятное решение коллеге, сохранив отношения и ясные границы.",
      model:
        "I appreciate the speed of the revision. I am concerned that the safety evidence is still incomplete, so I cannot approve launch today. If we postpone the optional feature, could the full test finish by Friday?",
      checklist: [
        "Acknowledge-concern-request",
        "Не размывай решение",
        "Предложи реалистичный путь вперёд",
      ],
    },
  },
  {
    id: "c1-06",
    level: "C1",
    title: "Позиция, оттенок и идиоматика",
    goal: "Выражать тонкие оценки естественно и понимать прагматический эффект идиом.",
    theory:
      "Stance включает уверенность, отношение и дистанцию: arguably, admittedly, from my perspective, I remain sceptical. Идиомы усиливают общность, но зависят от регистра: move the goalposts уместно в обсуждении, hit the nail on the head — в менее формальной оценке. Не смешивай метафоры и не используй редкую идиому ради эффекта. Точная обычная фраза лучше неправильной образной.",
    examples: [
      "The proposal is arguably efficient, though not especially fair.",
      "The committee appears to have moved the goalposts.",
      "Her explanation gets to the heart of the issue without oversimplifying it.",
    ],
    vocabulary: [
      { en: "arguably", ru: "возможно, можно утверждать" },
      { en: "remain sceptical", ru: "оставаться скептичным" },
      { en: "move the goalposts", ru: "менять критерии по ходу" },
      { en: "get to the heart of", ru: "дойти до сути" },
      { en: "a grey area", ru: "неоднозначная область" },
      { en: "take at face value", ru: "принимать за чистую монету" },
    ],
    reading: c1Reading(
      "A technology company invited staff to propose efficiency projects, promising to fund ideas that saved at least one hundred hours annually. One team documented a likely saving of one hundred and twenty hours, but the panel then requested proof of direct financial return. The panel may have had legitimate budget concerns; nevertheless, employees felt it had moved the goalposts. Management argued that the original threshold had always been a starting point, not a guarantee. That defence gets to part of the issue but overlooks the communicative effect of a public promise. The dispute sits in a grey area: the panel retained formal discretion, yet the wording created a reasonable expectation. Arguably, the best remedy is not automatic funding but a published second-stage criterion applied to all shortlisted projects.",
      "Stance markers allow the writer to evaluate both procedural authority and perceived fairness without collapsing either side. The panel's discretion remains real, but wording also creates expectations with practical consequences. A published second stage would preserve expert judgement while preventing criteria from appearing only after a team has invested effort in satisfying the first threshold.",
    ),
    listening: c1Listening(
      "I would not take the impressive retention figure at face value. It covers employees who remained for six months, but excludes contractors and anyone whose department was outsourced. That does not make the figure false; it makes its scope narrower than the headline implies. Priya's question about the denominator really hit the nail on the head. Before celebrating, we should compare like with like and publish the exclusions. I remain cautiously optimistic because voluntary resignations did fall, but the evidence does not yet justify the claim that the new policy transformed retention.",
      "The speaker uses idiomatic emphasis around a precise methodological point and calibrates optimism to the evidence. Publishing exclusions would let readers reconstruct the denominator rather than accept a broad headline. A fall in voluntary resignations is still worth investigating, but outsourcing and contractor turnover must be analysed separately before policy impact can be estimated. Comparison with a stable pre-policy cohort would also show whether the apparent improvement reflects a changed workforce rather than improved retention. Engaging wording need not sacrifice that distinction. Methodological accuracy is part of persuasive communication.",
    ),
    questions: [
      q(
        "grammar",
        "Which stance marker presents a defensible but debatable view?",
        ["arguably", "presumably certain", "possibly factual"],
        "arguably",
        "Arguably signals that a reasoned case exists without claiming consensus.",
      ),
      q(
        "grammar",
        "Choose the correct idiom.",
        [
          "They moved the goalposts after we qualified.",
          "They moved the finishing line after we qualified.",
          "They changed the goalposts into a grey area.",
        ],
        "They moved the goalposts after we qualified.",
        "The idiom means changing success criteria during the process.",
      ),
      q(
        "reading",
        "Why did staff perceive unfairness?",
        [
          "A new financial criterion appeared after the initial threshold.",
          "Their project saved no time.",
          "Funding had been guaranteed in a contract.",
        ],
        "A new financial criterion appeared after the initial threshold.",
        "The public wording shaped a reasonable expectation.",
      ),
      q(
        "reading",
        "What remedy balances both positions?",
        [
          "A transparent common second-stage criterion",
          "A separate financial test applied only to this team",
          "Keeping the original threshold without explaining discretion",
        ],
        "A transparent common second-stage criterion",
        "It preserves discretion while improving procedural fairness.",
      ),
      q(
        "listening",
        "Why is the retention headline too broad?",
        [
          "The calculation excludes relevant groups and events.",
          "The six-month figure is invented.",
          "Voluntary resignations rose.",
        ],
        "The calculation excludes relevant groups and events.",
        "The denominator limits what the number represents.",
      ),
      q(
        "listening",
        "What is the speaker's final stance?",
        [
          "Cautious optimism with a narrower claim",
          "Complete rejection of all evidence",
          "Certainty that the policy transformed retention",
        ],
        "Cautious optimism with a narrower claim",
        "One indicator improved, but the stronger headline remains unsupported.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 180–230 слов с нюансированной оценкой спорного результата. Используй stance markers и максимум две уместные идиомы.",
      minWords: 180,
      model: advancedWritingModels["c1-06"]!,
      checklist: [
        "Позиция имеет оттенок, а не бинарную оценку",
        "Не больше двух естественных идиом",
        "Сильный вывод ограничен данными",
      ],
    },
    speaking: {
      prompt:
        "Обсуди громкий результат: вырази осторожную позицию и поясни одну идиому партнёру через контекст.",
      model:
        "I wouldn't take the headline at face value. The improvement is real, but the sample changed. The report gets to the heart of motivation, though it overstates the size of the effect.",
      checklist: [
        "Используй два stance markers",
        "Идиома понятна из контекста",
        "Назови, что именно остаётся неопределённым",
      ],
    },
  },
  {
    id: "c1-07",
    level: "C1",
    title: "Скрытый смысл и импликация",
    goal: "Распознавать пресуппозиции, намёки, иронию и стратегическую неопределённость.",
    theory:
      "Implicit meaning возникает из контекста, общей информации и выбора формулировки. Even, still, again, finally несут presupposition; apparently и I understand that могут дистанцировать говорящего от сообщения. Understatement и ирония часто противоречат очевидной ситуации. Проверяй вывод вопросом: какие слова его запускают и существует ли альтернативное толкование? Не приписывай намерение без достаточных сигналов.",
    examples: [
      "The team finally submitted the data implies that submission was delayed or expected earlier.",
      "That was an ambitious deadline may politely imply that it was unrealistic.",
      "I understand that the figures are provisional distances the speaker from the claim.",
    ],
    vocabulary: [
      { en: "imply", ru: "подразумевать" },
      { en: "presuppose", ru: "предполагать как уже известное" },
      { en: "understatement", ru: "намеренное преуменьшение" },
      { en: "distance oneself", ru: "дистанцироваться от утверждения" },
      { en: "read between the lines", ru: "читать между строк" },
      { en: "plausible interpretation", ru: "правдоподобное толкование" },
    ],
    reading: c1Reading(
      "A university announced that its long-delayed laboratory would 'finally welcome researchers this autumn'. The word finally acknowledged the delay without naming its cause. The statement praised the contractor's 'ambitious programme' and noted that several specialised rooms would open 'in a later phase'. Readers familiar with the original plan understood that the autumn opening was partial. Yet the announcement was not literally false: core facilities would operate, and no new completion date had been promised. Staff reactions divided. Some valued the attempt to communicate progress; others saw strategic vagueness designed to generate a positive headline. The text illustrates a common institutional technique: inconvenient information is not denied but moved into subordinate phrases, while achievement occupies the grammatical foreground.",
      "The interpretation depends on lexical cues and information structure, although the writer avoids claiming access to the institution's private intention. A more transparent announcement would distinguish the core opening from later specialist access, identify the revised completion milestones and explain which constraint caused the sequence. That would preserve a legitimate progress message while allowing researchers to plan around what remains unavailable. It would also create a public basis for judging the next update.",
    ),
    listening: c1Listening(
      "So the supplier has delivered the revised prototype, which is encouraging. It is slightly heavier than the specification suggested, and the battery lasted almost three hours in yesterday's test. Our target was eight. I am told that performance will improve after a software update. That may well be true, but I would prefer the next meeting to include measured results rather than reassurance. The deadline remains, shall we say, ambitious. If procurement asks whether production can begin, my answer is that testing is continuing. They can infer the rest.",
      "Understatement, distancing and a deliberately incomplete final instruction communicate serious doubt without an explicit accusation of failure. The speaker's preference for measured results also redirects the next meeting from optimism to verification. Procurement receives a technically accurate status, yet the team will need a clearer decision record if production authority or contractual responsibility depends on the answer. That record should define the battery threshold, test conditions and the person authorised to accept residual risk. Otherwise, continuing may postpone a decision indefinitely. An explicit threshold converts doubt into an actionable test.  Responsibility stays visible.",
    ),
    questions: [
      q(
        "grammar",
        "What does 'She finally replied' presuppose?",
        [
          "A reply had been awaited or delayed.",
          "The reply was certainly correct.",
          "The reply arrived sooner than expected.",
        ],
        "A reply had been awaited or delayed.",
        "Finally places the event against an expectation of earlier completion.",
      ),
      q(
        "grammar",
        "Which phrase distances the speaker from a claim?",
        [
          "I am told that the fault is fixed.",
          "I personally verified the repair.",
          "The repair definitely works.",
        ],
        "I am told that the fault is fixed.",
        "The speaker reports the claim without fully endorsing it.",
      ),
      q(
        "reading",
        "How does the announcement reduce attention to incomplete work?",
        [
          "It places it in subordinate, vague language.",
          "It places incomplete work in the opening sentence.",
          "It denies that specialised rooms exist.",
        ],
        "It places it in subordinate, vague language.",
        "Positive progress receives foreground position.",
      ),
      q(
        "reading",
        "Why does the writer avoid calling the announcement a lie?",
        [
          "Its literal claims can still be true.",
          "The core opening and full completion mean the same thing.",
          "The statement reports staff criticism directly.",
        ],
        "Its literal claims can still be true.",
        "Selective framing differs from direct factual falsehood.",
      ),
      q(
        "listening",
        "What does 'almost three hours' imply in context?",
        [
          "Performance is far below the eight-hour target.",
          "The target has been exceeded.",
          "Battery testing is complete.",
        ],
        "Performance is far below the eight-hour target.",
        "The following target reveals the understatement.",
      ),
      q(
        "listening",
        "What should procurement infer?",
        [
          "Production approval would be premature.",
          "Testing has proved complete success.",
          "The speaker wants immediate mass production.",
        ],
        "Production approval would be premature.",
        "The speaker deliberately leaves the negative conclusion unstated.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 180–230 слов, анализируя публичное сообщение: отдели буквальный смысл от правдоподобной импликации.",
      minWords: 180,
      model: advancedWritingModels["c1-07"]!,
      checklist: [
        "Разделены literal meaning и inference",
        "Названы конкретные языковые триггеры",
        "Намерение не приписано без доказательств",
      ],
    },
    speaking: {
      prompt:
        "Прослушай двусмысленное рабочее сообщение, объясни возможный подтекст и предложи нейтральный уточняющий вопрос.",
      model:
        "When she called the deadline ambitious, she may have meant unrealistic. The word may matters because it is an inference. I would ask, 'Which deliverables do you believe can be completed by Friday?'",
      checklist: [
        "Сошлись на сигнале",
        "Предложи альтернативное толкование",
        "Уточни без обвинения",
      ],
    },
  },
  {
    id: "c1-08",
    level: "C1",
    title: "Критическая оценка источника",
    goal: "Оценивать происхождение, метод, ограничения и применимость утверждения.",
    theory:
      "Источник оценивают не по одному ярлыку надёжности. Спроси: кто автор и какова цель, как собраны данные, что измерялось, кто исключён, согласуется ли вывод с результатом, можно ли перенести его в другой контекст? Конфликт интересов требует прозрачности, но сам по себе не опровергает данные. Различай credibility источника, validity метода и relevance для твоего вопроса.",
    examples: [
      "The survey is recent, but its self-selected sample limits generalisation.",
      "Funding creates a potential conflict that should be disclosed, not an automatic refutation.",
      "The study measures intention rather than observed behaviour.",
    ],
    vocabulary: [
      { en: "self-selected sample", ru: "самоотобранная выборка" },
      { en: "conflict of interest", ru: "конфликт интересов" },
      { en: "generalisability", ru: "обобщаемость" },
      { en: "methodological limitation", ru: "методологическое ограничение" },
      { en: "corroborate", ru: "подтверждать независимыми данными" },
      { en: "applicability", ru: "применимость" },
    ],
    reading: c1Reading(
      "A consultancy reported that ninety percent of senior managers considered hybrid work more productive. The figure circulated widely, often as evidence that hybrid arrangements increase output. The original report, however, measured managers' perceptions rather than completed work, and participants were clients who had downloaded the consultancy's remote-work guide. This self-selected group may have been unusually interested in the topic. The consultancy also sold hybrid-work training, a commercial relationship disclosed in a footnote. None of these features proves the responses were dishonest. They do, however, narrow the conclusion: the survey shows that a particular group of engaged managers viewed hybrid work positively. To assess productivity itself, an organisation would need behavioural measures, a comparison over time and attention to role differences. The report is useful for understanding attitudes, but insufficient as a causal verdict.",
      "The evaluation preserves the source's legitimate contribution while matching every claim to what the method actually measured. Perception data can shape questions about managerial confidence and implementation barriers. It cannot substitute for output measures. A stronger design would define productivity by role, compare comparable periods and record whether respondents' organisations had already chosen hybrid policies before the survey.",
    ),
    listening: c1Listening(
      "Before we cite the neighbourhood poll, note how it was conducted. The link appeared in a residents' campaign newsletter, and respondents chose whether to participate. That makes the result valuable for identifying committed concerns, but not for estimating the opinion of the whole district. The question also asked whether people supported 'protecting our peaceful streets', wording that may have encouraged agreement. We should not discard the poll; its comments reveal specific worries about noise and parking. We should corroborate prevalence through a randomly sampled survey and use the existing comments to design better response options.",
      "The speaker separates exploratory usefulness from population-level representativeness and proposes a method that combines both. Campaign comments identify vocabulary and issues that a detached researcher might miss. Random selection then estimates how widely those concerns are shared. Neutral wording is essential because the original phrase invited respondents to endorse a valued identity, not simply evaluate a traffic proposal. Reporting response rates and district coverage would further show whose views remain absent. Follow-up interviews could explore underrepresented streets. They may reveal access barriers rather than indifference.",
    ),
    questions: [
      q(
        "grammar",
        "Which sentence distinguishes measurement from conclusion?",
        [
          "The study measures reported confidence, not actual performance.",
          "The study reports performance as well as confidence.",
          "The study treats reported confidence as observed performance.",
        ],
        "The study measures reported confidence, not actual performance.",
        "The contrast identifies the construct actually observed.",
      ),
      q(
        "grammar",
        "Choose the appropriately limited conclusion.",
        [
          "These respondents viewed the policy positively.",
          "The participating managers reported higher measured output.",
          "The policy is associated with higher measured output.",
        ],
        "These respondents viewed the policy positively.",
        "It stays within the sample and measured attitude.",
      ),
      q(
        "reading",
        "Why might the sample differ from managers generally?",
        [
          "Participants had already engaged with the consultancy's topic.",
          "Participants had been required to use hybrid work.",
          "The survey measured output directly.",
        ],
        "Participants had already engaged with the consultancy's topic.",
        "Downloaders were a self-selected interested group.",
      ),
      q(
        "reading",
        "What does the funding relationship require?",
        [
          "Disclosure and closer scrutiny",
          "Automatic rejection regardless of method",
          "Removing the source before examining its method",
        ],
        "Disclosure and closer scrutiny",
        "A conflict is relevant context, not decisive refutation.",
      ),
      q(
        "listening",
        "What can the poll reasonably reveal?",
        [
          "Specific concerns among engaged residents",
          "The exact opinion of the entire district",
          "A causal effect of traffic policy",
        ],
        "Specific concerns among engaged residents",
        "Comments have exploratory value despite sampling limits.",
      ),
      q(
        "listening",
        "Why use comments in the new survey?",
        [
          "They can inform more relevant response options.",
          "They can replace neutral survey wording.",
          "They predict how frequently each concern occurs.",
        ],
        "They can inform more relevant response options.",
        "Qualitative concerns improve later measurement design.",
      ),
    ],
    writing: {
      prompt:
        "Оцени источник в 180–240 слов: цель, выборка/метод, измеряемая величина, ограничения и допустимое использование.",
      minWords: 180,
      model: advancedWritingModels["c1-08"]!,
      checklist: [
        "Отдельно оценены автор, метод и применимость",
        "Вывод ограничен измеряемой величиной",
        "Предложен способ corroboration",
      ],
    },
    speaking: {
      prompt: "Объясни коллеге, почему источник одновременно полезен и недостаточен для решения.",
      model:
        "The poll reveals which concerns motivate active residents, so I would not discard it. Because the sample is self-selected, it cannot estimate district-wide support. We need a random sample to answer that question.",
      checklist: [
        "Не используй только reliable/unreliable",
        "Назови конкретное допустимое использование",
        "Запроси недостающее доказательство",
      ],
    },
  },
  {
    id: "c1-09",
    level: "C1",
    title: "Синтез нескольких источников",
    goal: "Объединять совпадения, противоречия и различия в методах без списка пересказов.",
    theory:
      "Synthesis организует текст по идеям, а не по источникам. Сначала сформулируй общий вопрос, затем сгруппируй: both sources indicate..., whereas..., this discrepancy may reflect.... Сравни определения, периоды, выборки и тип доказательств. Не создавай ложного согласия: источники могут измерять разные стороны явления. Финальный вывод должен показывать, что известно совместно и что остаётся открытым.",
    examples: [
      "Both reports identify access as a barrier, although they define access differently.",
      "The apparent contradiction may reflect the periods studied.",
      "Taken together, the sources support a local trial but not a universal rule.",
    ],
    vocabulary: [
      { en: "converge", ru: "сходиться в выводах" },
      { en: "diverge", ru: "расходиться" },
      { en: "apparent contradiction", ru: "кажущееся противоречие" },
      { en: "taken together", ru: "в совокупности" },
      { en: "account for the discrepancy", ru: "объяснять расхождение" },
      { en: "body of evidence", ru: "совокупность доказательств" },
    ],
    reading: c1Reading(
      "Three sources assess whether later school start times improve learning. A controlled regional study reports modest gains in attendance and morning test scores. A national survey finds that students feel more alert but records no change in self-reported homework completion. Meanwhile, interviews with rural headteachers describe transport costs that reduced after-school activities. The findings are not straightforwardly contradictory. The study measured observable outcomes over one year; the survey captured perception at one point; the interviews examined implementation in a setting where buses serve wide areas. Taken together, the sources suggest that later starts can improve morning readiness, but their broader value depends on transport and timetable design. None establishes a universal optimal time. A sensible policy would therefore define target outcomes, pilot locally and monitor both academic and logistical effects.",
      "The synthesis explains divergence through method and context, then draws a conclusion no single source could justify alone. Attendance gains do not guarantee homework completion, and urban test results do not resolve rural transport trade-offs. A local pilot should therefore specify academic, wellbeing and logistical outcomes before implementation, enabling policymakers to learn which benefits survive under their own constraints.",
    ),
    listening: c1Listening(
      "The finance report says remote onboarding costs less because travel has disappeared. The staff interviews, however, describe longer periods before new employees feel confident. Usage data add a third perspective: completion of required modules is faster online, but requests for informal help remain high for twelve weeks. These findings converge on efficiency in delivering standard information and diverge on social integration. The cost saving is therefore real but incomplete if delayed confidence increases managers' support time. I recommend retaining online modules while adding structured peer meetings during the first month, then measuring both direct cost and time to independent work.",
      "The speaker does not average unlike measures; the recommendation preserves the strength identified by one source and addresses the weakness revealed by the others. Direct cost, module completion, support requests and time to independent work remain separate indicators. Their combined pattern supports a blended onboarding design whose success can be judged against both financial and developmental criteria. Peer meetings should therefore have a stated purpose and attendance window, allowing their contribution to confidence to be evaluated rather than assumed. The meetings should also be reviewed with participants.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the synthesis connector that signals qualified agreement.",
        [
          "Both sources identify delay, although they explain it differently.",
          "The first source reports delay, while the second reports another result.",
          "Both sources identify delay and explain it identically.",
        ],
        "Both sources identify delay, although they explain it differently.",
        "It groups shared finding and difference in one relation.",
      ),
      q(
        "grammar",
        "Which phrase introduces a combined inference?",
        [
          "Taken together, the findings support a pilot.",
          "Taken individually, every finding supports the same policy.",
          "Together with one report, the pilot is proven.",
        ],
        "Taken together, the findings support a pilot.",
        "The phrase marks a conclusion based on the body of evidence.",
      ),
      q(
        "reading",
        "Why are the sources not directly contradictory?",
        [
          "They measure different outcomes and contexts.",
          "They examine the same outcome using different samples.",
          "The national survey used rural bus records.",
        ],
        "They measure different outcomes and contexts.",
        "Methodological differences account for apparent divergence.",
      ),
      q(
        "reading",
        "What conclusion is jointly supported?",
        [
          "Local piloting should track readiness and logistics.",
          "Later starts should be adopted nationally before local testing.",
          "Transport effects outweigh all evidence on readiness.",
        ],
        "Local piloting should track readiness and logistics.",
        "The evidence supports conditional implementation, not a universal rule.",
      ),
      q(
        "listening",
        "Where do the sources converge?",
        [
          "Online delivery of standard information is efficient.",
          "Social integration is immediately complete.",
          "Online completion removes the need to measure confidence.",
        ],
        "Online delivery of standard information is efficient.",
        "Cost and module-completion evidence support that point.",
      ),
      q(
        "listening",
        "Why add peer meetings?",
        [
          "To address prolonged informal support and confidence needs",
          "To restore travel costs",
          "To make peer attendance the main completion measure",
        ],
        "To address prolonged informal support and confidence needs",
        "The hybrid recommendation integrates all evidence.",
      ),
    ],
    writing: {
      prompt:
        "Синтезируй три кратких воображаемых источника в 180–250 слов, группируя текст по выводам, расхождениям и причинам.",
      minWords: 180,
      model: advancedWritingModels["c1-09"]!,
      checklist: [
        "Организация по идеям, не по источникам",
        "Расхождение объяснено методом/контекстом",
        "Совместный вывод не сильнее совокупных данных",
      ],
    },
    speaking: {
      prompt:
        "За две минуты синтезируй три позиции для руководителя и предложи решение, учитывающее разные типы данных.",
      model:
        "The sources agree that online modules deliver standard content efficiently. They differ on confidence because one measures completion and the others social adjustment. I would keep the modules and add peer contact, then measure time to independent work.",
      checklist: [
        "Назови convergence и divergence",
        "Объясни хотя бы одно расхождение",
        "Дай интегрированную рекомендацию",
      ],
    },
  },
  {
    id: "c1-10",
    level: "C1",
    title: "Сильный контраргумент",
    goal: "Строить и опровергать лучшую версию противоположной позиции.",
    theory:
      "Steelman — максимально разумная версия возражения. Сначала назови общий принцип, затем точку разногласия: The strongest objection is...; This concern is justified insofar as..., but it assumes.... Ответ может ограничить свой claim, добавить условие или показать скрытую цену альтернативы. Избегай straw man, перехода на мотивы и ложной дилеммы.",
    examples: [
      "The strongest objection is not cost alone but the irreversible commitment it creates.",
      "That concern is justified, yet it assumes demand will remain constant.",
      "A narrower claim survives the objection: the policy merits a reversible trial.",
    ],
    vocabulary: [
      { en: "steelman", ru: "усиленная честная версия аргумента" },
      { en: "straw man", ru: "искажённо слабая версия аргумента" },
      { en: "underlying assumption", ru: "скрытая предпосылка" },
      { en: "insofar as", ru: "постольку поскольку" },
      { en: "scope of the claim", ru: "объём утверждения" },
      { en: "opportunity cost", ru: "цена упущенной возможности" },
    ],
    reading: c1Reading(
      "A city is considering replacing several parking spaces with rain gardens. Supporters emphasise flood protection and biodiversity. The strongest objection is not simply inconvenience to drivers: nearby shops rely on short visits, and removing spaces could shift customers to out-of-town centres. That concern deserves serious treatment because small retailers have limited margins. Yet it assumes that access is equivalent to parking directly outside each shop. The city could preserve loading bays, improve signs to a half-empty car park and compare sales during a reversible six-month trial. Opponents might reply that even a trial creates disruption. True, but maintaining the current layout also has an opportunity cost: repeated surface flooding closes the same street several times a year. The defensible claim is therefore limited. Rain gardens are not automatically superior, but a measured trial is justified when both commercial access and flood disruption are tracked.",
      "The writer strengthens the commercial objection before challenging its assumption and narrowing the policy claim. Loading access and car-park signs become mitigations rather than rhetorical promises because the trial will track shop sales alongside flood closures. A pre-agreed stopping rule could protect retailers if disruption exceeds the expected public benefit, making the experiment genuinely reversible.",
    ),
    listening: c1Listening(
      "The best argument against a compressed working week is that service coverage may suffer, not that employees cannot manage their time. Customers reasonably expect support on Fridays. However, the objection assumes every employee must take the same day off. A staggered schedule could preserve five-day coverage while testing whether longer days create fatigue. Critics may say staggered teams complicate coordination, and they are right to demand a clear handover process. That is a design constraint, not yet a reason to reject the trial. We should compare response time, error rates and staff wellbeing before deciding.",
      "The proposal survives by changing its design and limiting the claim to a test, rather than dismissing a legitimate service concern. Staggering creates handover complexity, so error rates matter alongside response time and wellbeing. If coordination deteriorates, the evidence may support modification or rejection; the trial is not structured to produce only a favourable answer. Customer feedback should be sampled across every weekday so that Friday coverage is assessed directly rather than hidden inside a weekly average. Handover failures should also be logged by cause. This would support redesign instead of blame. Learning remains possible.",
    ),
    questions: [
      q(
        "grammar",
        "Which phrase introduces a steelman?",
        [
          "The strongest objection concerns irreversible cost.",
          "The weakest objection concerns temporary inconvenience.",
          "Opponents reject the proposal without relevant reasons.",
        ],
        "The strongest objection concerns irreversible cost.",
        "It identifies the most serious principle at stake without attacking people.",
      ),
      q(
        "grammar",
        "Complete: The concern is valid ___ it protects vulnerable users.",
        ["insofar as", "despite of", "whereas because"],
        "insofar as",
        "Insofar as limits the extent to which the concession holds.",
      ),
      q(
        "reading",
        "What assumption in the retail objection is challenged?",
        [
          "Access requires parking immediately outside shops.",
          "Flooding affects trade.",
          "Retailers have narrow margins.",
        ],
        "Access requires parking immediately outside shops.",
        "Alternative parking and loading arrangements weaken that equivalence.",
      ),
      q(
        "reading",
        "Why mention current flooding?",
        [
          "Doing nothing also imposes costs.",
          "Flood prevention has no opportunity cost.",
          "Retail sales are already measured.",
        ],
        "Doing nothing also imposes costs.",
        "It exposes the opportunity cost of the status quo.",
      ),
      q(
        "listening",
        "How could Friday coverage be preserved?",
        [
          "Stagger different days off.",
          "Close customer support.",
          "Reduce service hours equally across the week.",
        ],
        "Stagger different days off.",
        "The design addresses the strongest objection.",
      ),
      q(
        "listening",
        "How is the coordination objection classified?",
        [
          "A constraint requiring handovers",
          "A fixed objection that applies regardless of design",
          "A personal attack on staff",
        ],
        "A constraint requiring handovers",
        "It changes implementation rather than defeating evaluation.",
      ),
    ],
    writing: {
      prompt:
        "Напиши 180–250 слов: представь сильнейший контраргумент к своей позиции, ответь на предпосылку и сузь вывод.",
      minWords: 180,
      model: advancedWritingModels["c1-10"]!,
      checklist: [
        "Контраргумент представлен в сильной форме",
        "Найдена конкретная предпосылка",
        "Итоговый claim сужен или получил условия",
      ],
    },
    speaking: {
      prompt: "Защити предложение после того, как сам сформулируешь лучшее возражение партнёра.",
      model:
        "Your strongest point is service coverage, and that is valid. It assumes everyone takes Friday off, though. If days were staggered and response times monitored, would you support a trial?",
      checklist: [
        "Steelman до ответа",
        "Признай реальную цену",
        "Проверь условный компромисс вопросом",
      ],
    },
  },
  {
    id: "c1-11",
    level: "C1",
    title: "Академический абзац",
    goal: "Строить связный аналитический абзац с тезисом, доказательством, интерпретацией и ограничением.",
    theory:
      "Академический абзац развивает одну контролируемую мысль. Topic sentence задаёт claim; evidence иллюстрирует; analysis объясняет, почему данные важны; qualification ограничивает; link возвращает к вопросу. Ссылка на источник не заменяет анализа. Осторожно используй this: this pattern / this limitation вместо неясного this. Не начинай каждую фразу одинаковым connector.",
    examples: [
      "Flexible access may improve participation, particularly for employed students.",
      "This pattern suggests that scheduling, rather than motivation, explains part of the gap.",
      "The finding remains provisional because the study covered one semester.",
    ],
    vocabulary: [
      { en: "substantiate", ru: "подкреплять доказательствами" },
      { en: "interpretation", ru: "интерпретация" },
      { en: "qualification", ru: "ограничивающая оговорка" },
      { en: "analytical link", ru: "аналитическая связь" },
      { en: "scope", ru: "объём применимости" },
      { en: "provisional", ru: "предварительный" },
    ],
    reading: c1Reading(
      "Urban tree planting can reduce heat exposure, but canopy targets alone may reproduce existing inequality. A municipal study found that districts with the lowest summer shade also had the fewest viable planting sites on public land. This pattern suggests that a uniform numerical target would reward areas where implementation is easiest rather than where cooling is most needed. The evidence does not imply that dense districts cannot gain trees; it indicates that standard roadside planting may be insufficient. Courtyard agreements, roof structures and the purchase of small private plots could extend the available space, although each option raises different maintenance questions. Because the study examined land availability rather than actual temperature change, its conclusion is necessarily limited. Nevertheless, it substantiates a procedural claim: equitable cooling policy must allocate resources according to implementation difficulty as well as final tree counts.",
      "Each sentence advances the central argument from evidence through interpretation and qualification to a policy link. The paragraph neither abandons tree targets nor mistakes them for equity. By connecting spatial constraints to resource allocation, it turns descriptive mapping into a testable policy principle: harder locations may require more varied instruments and greater spending per successful unit of shade.",
    ),
    listening: c1Listening(
      "A strong paragraph does more than place a quotation after a claim. Suppose your source reports that commuters used bicycles more often after secure storage was installed. You still need to explain the relationship. Storage may have removed fear of theft, but the increase could also coincide with better weather. Your analysis should identify the likely mechanism and acknowledge the alternative. Then return to the essay question: the evidence supports targeted infrastructure, though it does not show that storage alone changes travel behaviour. That final qualification makes the argument more credible, not less confident.",
      "The lecturer models how evidence becomes reasoning only when mechanism, alternative explanation and scope are made explicit. Fear of theft is a plausible pathway, while weather is a rival cause. Comparing seasons, sites without new storage and reported theft concerns would strengthen attribution. Until then, targeted infrastructure is a defensible proposal, but storage alone is not an established universal solution. The paragraph earns confidence by showing exactly which inference is supported and which remains provisional. That discipline prevents unsupported generalisation. It also shows readers how further research could change the conclusion.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the clearest reference.",
        [
          "This limitation narrows the claim.",
          "This narrows it.",
          "This result affects the previous point.",
        ],
        "This limitation narrows the claim.",
        "A noun after this makes the reference explicit.",
      ),
      q(
        "grammar",
        "Which sentence analyses rather than repeats evidence?",
        [
          "The pattern suggests that scheduling contributes to the gap.",
          "The report says there is a gap, and there is a gap.",
          "According to the report: 'a gap'.",
        ],
        "The pattern suggests that scheduling contributes to the gap.",
        "It explains the significance of the observation.",
      ),
      q(
        "reading",
        "Why might a uniform target be inequitable?",
        [
          "It favours places where planting is easier.",
          "It guarantees more cooling in dense districts.",
          "It measures actual temperatures only.",
        ],
        "It favours places where planting is easier.",
        "Equal numerical targets ignore unequal implementation constraints.",
      ),
      q(
        "reading",
        "What claim does the evidence substantiate despite its limitation?",
        [
          "Resources should reflect implementation difficulty.",
          "Tree counts alone establish equitable cooling.",
          "Public land is the only possible site.",
        ],
        "Resources should reflect implementation difficulty.",
        "The procedural inference matches what land-availability data can support.",
      ),
      q(
        "listening",
        "What alternative explanation is offered for cycling growth?",
        ["Better weather", "Less secure storage", "A quotation in an essay"],
        "Better weather",
        "It could coincide with the intervention.",
      ),
      q(
        "listening",
        "Why is qualification valuable?",
        [
          "It aligns confidence with evidence scope.",
          "It removes the writer's position.",
          "It makes the claim broader than the evidence.",
        ],
        "It aligns confidence with evidence scope.",
        "Credibility increases when limits are explicit.",
      ),
    ],
    writing: {
      prompt:
        "Напиши один академический абзац 180–220 слов: claim, evidence, analysis, alternative explanation, qualification и link.",
      minWords: 180,
      model: advancedWritingModels["c1-11"]!,
      checklist: [
        "Один ясный topic claim",
        "Evidence сопровождается analysis",
        "Есть alternative, qualification и link к вопросу",
      ],
    },
    speaking: {
      prompt:
        "Устно построй академический абзац по одному факту, явно проговаривая переход от данных к выводу.",
      model:
        "Attendance rose after evening sessions were added. This suggests timing had been a barrier, although advertising changed too. The evidence supports testing flexible schedules, not claiming that timing was the only cause.",
      checklist: ["Назови механизм", "Укажи альтернативу", "Ограничь итоговый вывод"],
    },
  },
  {
    id: "c1-12",
    level: "C1",
    title: "Формальная рекомендация и решение",
    goal: "Интегрировать доказательства, риски, альтернативы и план проверки в профессиональный документ.",
    theory:
      "Decision paper начинается с решения, которое требуется, затем задаёт критерии, сравнивает варианты и формулирует recommendation. Указывай assumptions, risks, mitigations и review point. Отличай reversible от irreversible decisions. Хорошая рекомендация не скрывает неопределённость, а проектирует способ её уменьшить: approve a pilot subject to..., defer pending..., reject because....",
    examples: [
      "Approval is recommended subject to a three-month review.",
      "The principal uncertainty concerns demand rather than technical feasibility.",
      "A reversible pilot would generate evidence while limiting financial exposure.",
    ],
    vocabulary: [
      { en: "subject to review", ru: "с последующим пересмотром" },
      { en: "mitigation", ru: "снижение риска" },
      { en: "financial exposure", ru: "финансовый риск" },
      { en: "reversible decision", ru: "обратимое решение" },
      { en: "decision criterion", ru: "критерий решения" },
      { en: "defer pending evidence", ru: "отложить до получения данных" },
    ],
    reading: c1Reading(
      "A public archive must decide whether to digitise its most requested maps internally or contract the work to a specialist. Internal scanning would build staff expertise and provide direct control, but the archive lacks colour-calibration equipment and estimates an eighteen-month schedule. The contractor can finish within six months and has relevant conservation certification, though its price is higher and files would temporarily leave the site. Demand data show that researchers regularly request only a quarter of the collection. Full outsourcing would therefore commit funds before the archive knows whether wider access generates value. The recommended option is a staged contract for the high-demand maps, subject to a quality audit and usage review after six months. This approach does not resolve the long-term capability question. It limits handling risk through certified transport, tests public value and preserves the option of investing internally if demand justifies it.",
      "The recommendation is grounded in explicit criteria, identifies residual uncertainty and chooses a reversible stage that creates decision-relevant evidence. A quality audit protects conservation standards; usage review tests public value; limited scope contains cost and transport exposure. The archive also gains real files and workflow evidence with which to judge whether external speed outweighs the strategic value of internal expertise.",
    ),
    listening: c1Listening(
      "We need a decision today on the translation platform, but not necessarily a permanent one. Option A is cheaper and integrates with our current system; however, its audit logs do not meet the compliance team's stated requirement. Option B meets that requirement and offers a monthly contract, though staff would need two days of training. I recommend a three-month contract with B, limited to the regulated team. The principal risk is disruption during training, which we can mitigate with staggered sessions and parallel access for one week. At the review point, we should compare error rates, staff time and actual use of the audit function. If the logs prove unnecessary, we can reconsider the cheaper platform without a long-term penalty.",
      "The speaker refuses a false choice between immediate action and permanent commitment, then defines evidence that will govern reconsideration. Restricting the pilot to the regulated team matches the feature to the risk. Parallel access mitigates training disruption, while monthly contracting preserves exit. Error, time and audit-use data make the review a decision mechanism rather than a ceremonial meeting. The team can act today without pretending that current compliance assumptions should determine every later procurement choice.",
    ),
    questions: [
      q(
        "grammar",
        "Choose the formal conditional recommendation.",
        [
          "Approval is recommended subject to a six-month review.",
          "Approval is recommended despite any future evidence.",
          "A six-month review recommends conditional approval.",
        ],
        "Approval is recommended subject to a six-month review.",
        "Subject to attaches a clear review condition to approval.",
      ),
      q(
        "grammar",
        "Which phrase identifies remaining uncertainty precisely?",
        [
          "The principal uncertainty concerns future demand.",
          "Future demand creates several possible concerns.",
          "The project remains broadly uncertain.",
        ],
        "The principal uncertainty concerns future demand.",
        "It names the variable that additional evidence must address.",
      ),
      q(
        "reading",
        "Why is full outsourcing not recommended immediately?",
        [
          "Most of the collection's demand is still untested.",
          "The contractor lacks certification.",
          "Internal scanning is already faster.",
        ],
        "Most of the collection's demand is still untested.",
        "Only a quarter is regularly requested, so full commitment may be premature.",
      ),
      q(
        "reading",
        "What option remains open after the staged contract?",
        [
          "Building internal capability if demand supports it",
          "Outsourcing the entire collection immediately",
          "Building internal capability regardless of demand",
        ],
        "Building internal capability if demand supports it",
        "The reversible stage preserves this later choice.",
      ),
      q(
        "listening",
        "Why is option A currently unsuitable for the regulated team?",
        [
          "Its audit logs fail a stated requirement.",
          "It requires two days of training.",
          "It is too expensive.",
        ],
        "Its audit logs fail a stated requirement.",
        "Compliance is treated as a decision criterion.",
      ),
      q(
        "listening",
        "What evidence could justify reconsidering A?",
        [
          "Finding that the audit function adds little value",
          "A permanent contract with B",
          "Refusing to measure error rates",
        ],
        "Finding that the audit function adds little value",
        "The review tests whether the costly requirement matters in practice.",
      ),
    ],
    writing: {
      prompt:
        "Напиши decision paper 200–260 слов: решение, критерии, варианты, риск, mitigation, рекомендация и review point.",
      minWords: 200,
      model: advancedWritingModels["c1-12"]!,
      checklist: [
        "Решение и критерии названы в начале",
        "Риск связан с конкретной mitigation",
        "Review point содержит измеряемые условия",
      ],
    },
    speaking: {
      prompt:
        "Представь руководителю рекомендацию за две минуты и ответь на вопрос, почему нельзя выбрать самый дешёвый вариант сразу.",
      model:
        "I recommend a limited contract with B because compliance is currently a hard criterion. The main risk is training disruption, which staggered sessions reduce. After three months we can test whether audit logs justify the cost and reconsider without penalty.",
      checklist: ["Начни с решения", "Сравни варианты по критериям", "Закончи условием пересмотра"],
    },
  },
];
