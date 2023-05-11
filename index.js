/**
 * The simple documentation language syntax used in the comments is as follows:
 * #title - Indicates the title of the help section. The content after #title represents the title string.
 * 
 * #opt - Represents an option description. The content after #opt represents the option text.
 * 
 * #examples - Marks the start of the examples section.
 * 
 * [code for example] - Represents the start of a new example. The content within [...] represents the example code. Text after the [...] is the description for the example.
 * 
 * Regular text comments provide additional explanations and clarify the purpose of specific sections.
 */

 /**
 * Displays the help information read from a text file with specified formatting.
 *
 * @param {string} helpFilePath - The path to the help text file.
 * @returns {string} The formatted help information as a string.
 */
function showHelp(helpFilePath) {
  // Read the help text from the file
  const helpText = fs.readFileSync(helpFilePath, 'utf8');

  // Split the text into individual lines
  const lines = helpText.split('\n');

  // Variable to store the formatted help information
  let helpString = '';

  // Flag to indicate if we are in the examples section
  let inExamplesSection = false;

  // Process each line of the help text
  lines.forEach(line => {
    if (line.startsWith('#title')) {
      // Extract the title and format it with bold style
      const title = line.substring('#title'.length).trim();
      helpString += chalk.bold(title) + '\n\n';
    } else if (line.startsWith('#opt')) {
      // Extract the option and description
      const opt = line.substring('#opt'.length).trim();
      const [option, description] = opt.split(/\s+/, 2); // Split on first space or tab

      // Format the option and description with yellow color
      helpString += chalk.yellow(option) + ' - ' + (description||'') + '\n';
    } else if (line.startsWith('#examples')) {
      // Start of the examples section
      inExamplesSection = true;
      helpString += '\n' + chalk.bold('Examples:') + '\n';
    } else if (inExamplesSection) {
      const exampleLine = line.trim();
      if (exampleLine.startsWith('[')) {
        const [exampleCode, exampleDescription] = extractExampleCode(exampleLine);

        helpString += chalk.cyan(exampleCode) + ' ' + exampleDescription + '\n';
      } else {
        helpString += exampleLine + '\n';
      }
    } else {
      // Regular text outside of examples section
      helpString += line + '\n';
    }
  });

  // Return the formatted help information
  return helpString;
}

/**
 * Extracts the example code from a line starting with '['.
 *
 * @param {string} line - The line containing the example code.
 * @returns {string} The extracted example code.
 */
function extractExampleCode(line) {
  let code = '';
  let nestedBracketCount = 0;
  let i = 1;

  while (i < line.length) {
    if (line[i] === '[') {
      nestedBracketCount++;
    } else if (line[i] === ']') {
      if (nestedBracketCount === 0) {
        break;
      }
      nestedBracketCount--;
    }

    code += line[i];
    i++;
  }

  return [code.trim(), line.substr(i+1).trim()];
}

/**


module.exports = showHelp;
