const { Command } = require("commander");
const fs = require("fs");

const program = new Command();

program
  .option("-i, --input <path>", "Input JSON file")
  .option("-o, --output <path>", "Output file")
  .option("-d, --display", "Display result in console")
  .option("-m, --mfo", "Show MFO code before bank name")
  .option("-n, --normal", "Show only banks with COD_STATE = 1");

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// JSON не читається 
let data;
try {
  data = JSON.parse(fs.readFileSync(options.input, "utf-8"));
} catch (err) {
  console.error("Error reading JSON file:", err.message);
  process.exit(1);
}

if (options.normal) {
  data = data.filter(bank => bank.COD_STATE === "1" || bank.COD_STATE === 1);
}

let result = data.map(bank => {
  const name = bank.FULLNAME || bank.SHORTNAME || "Unknown bank";
  return options.mfo ? `${bank.MFO} ${name}` : name;
});

if (options.display) {
  console.log(result.join("\n"));
}

if (options.output) {   // обробка помилки запису файлу
  try {
    //evvjdyj  папка з тією самою назвою
    fs.writeFileSync(options.output, result.join("\n"), "utf-8");
    console.log(`Result successfully saved to: ${options.output}`);
  } catch (err) {
    
    console.error("Error writing to file  :", err.message);
    process.exit(1);
  }
}
