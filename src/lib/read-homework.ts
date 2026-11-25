import { createClientOnlyFn } from "@tanstack/react-start";

export const homeworkFileLimitMb = 10;
const maxDocumentChars = 200_000;

class ImportError extends Error {}

function checkDocumentLength(length: number) {
  if (length > maxDocumentChars) {
    throw new ImportError("Документ слишком длинный. Загрузите страницы с нужным упражнением.");
  }
}

async function readPdf(file: File) {
  const [{ getDocument, GlobalWorkerOptions }, { default: workerUrl }] = await Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ]);
  GlobalWorkerOptions.workerSrc = workerUrl;
  const task = getDocument({
    data: await file.arrayBuffer(),
    useWorkerFetch: false,
    useWasm: false,
  });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > 100)
      throw new ImportError("Выберите до 100 страниц с заданиями и сохраните их в отдельный PDF.");
    const pages = [];
    const emptyPages = [];
    let total = 0;
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const { items } = await page.getTextContent();
      const text = items
        .map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : " ") : ""))
        .join("")
        .trim();
      total += text.length;
      checkDocumentLength(total);
      if (!text) emptyPages.push(n);
      pages.push(text);
      page.cleanup();
    }
    return {
      text: pages.filter(Boolean).join("\n\n"),
      notice: emptyPages.length
        ? "Страницы без текстового слоя: " +
          emptyPages.join(", ") +
          ". При необходимости добавьте упражнения с них вручную."
        : "",
    };
  } finally {
    await task.destroy();
  }
}

async function readDocx(file: File) {
  const { BlobReader, ZipReader, Uint8ArrayWriter } = await import("@zip.js/zip.js");
  const reader = new ZipReader(new BlobReader(file), { useWebWorkers: false });
  try {
    for await (const entry of reader.getEntriesGenerator()) {
      if (entry.directory || entry.filename !== "word/document.xml") continue;
      if (entry.uncompressedSize > 8 * 1024 * 1024)
        throw new ImportError("Документ слишком большой. Сохраните упражнение в отдельный файл.");
      const bytes = await entry.getData(new Uint8ArrayWriter());
      const xml = new DOMParser().parseFromString(
        new TextDecoder().decode(bytes),
        "application/xml",
      );
      const ns = xml.documentElement.namespaceURI;
      if (xml.documentElement.localName !== "document" || !ns) break;
      const paragraphs = Array.from(xml.getElementsByTagNameNS(ns, "p"), (paragraph) =>
        Array.from(paragraph.getElementsByTagNameNS(ns, "*"), (node) => {
          if (node.localName === "t") return node.textContent;
          if (node.localName === "tab") return "\t";
          if (node.localName === "br" || node.localName === "cr") return "\n";
          return "";
        }).join(""),
      );
      const text = paragraphs.join("\n").trim();
      checkDocumentLength(text.length);
      return { text, notice: "" };
    }
    throw new ImportError("В файле Word не удалось найти текст документа.");
  } finally {
    await reader.close();
  }
}

export const readHomeworkFile = createClientOnlyFn(
  async (file: File): Promise<{ text: string; notice: string }> => {
    if (file.size > homeworkFileLimitMb * 1024 * 1024)
      throw new Error("Файл больше 10 МБ. Выберите страницы с заданием.");
    const format = file.name.split(".").pop()?.toLowerCase();
    try {
      let result;
      if (format === "pdf") result = await readPdf(file);
      else if (format === "docx") result = await readDocx(file);
      else if (format === "txt") result = { text: (await file.text()).trim(), notice: "" };
      else
        throw new ImportError(
          "Выберите PDF, DOCX или TXT. Старый файл DOC можно пересохранить в Word как DOCX.",
        );
      if (!result.text)
        throw new ImportError(
          "Не удалось извлечь текст. Если это скан, распознайте текст и вставьте его в поле задания.",
        );
      checkDocumentLength(result.text.length);
      return result;
    } catch (error) {
      if (error instanceof ImportError) throw error;
      if (error instanceof Error && error.name === "PasswordException")
        throw new Error(
          "PDF защищён паролем. Загрузите открытую копию или вставьте текст упражнения.",
        );
      throw new Error(
        "Не удалось прочитать документ. Попробуйте другую копию или вставьте текст упражнения.",
      );
    }
  },
);
