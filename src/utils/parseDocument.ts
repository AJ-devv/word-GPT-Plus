// ✅ Word Clause Extraction Utility

// 🔹 Get the full document text from the Word body
export const getFullDocumentText = async (): Promise<string> => {
  return await Word.run(async context => {
    const body = context.document.body;
    body.load("text");
    await context.sync();
    return body.text;
  });
};

// 🔹 Split the full text into clauses using common patterns
export const splitIntoClauses = (text: string): string[] => {
  return text
    .split(/\n\s*\n|(?<=;)\s*\n|(?=\d+\.\s)/g) // double newlines, semicolon+newline, numbered sections
    .map(clause => clause.trim())
    .filter(clause => clause.length > 30); // remove short/empty lines
};

// 🔹 Combine both steps to extract clauses from Word
export const extractClausesFromWord = async (): Promise<string[]> => {
  const fullText = await getFullDocumentText();
  return splitIntoClauses(fullText);
};
