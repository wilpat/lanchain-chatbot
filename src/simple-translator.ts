require('dotenv').config()
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import * as readline from 'readline';
import inquirer from 'inquirer';

const model = new ChatOpenAI({ model: "gpt-4" });

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
const defaultLanguage = "Italian";

const system = "Translate the following from English into {destinationLanguage}";
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", system],
    ["user", "{textToTranslate}"],
]);

const languages = [
    "Italian",
    "Spanish",
    "French",
    "German",
    "Dutch",
    "Swedish",
    "Russian",
    "Polish",
    "Czech"
  ];

const runTranlator = async () => {
    rl.question("Enter text to translate: ", async (textToTranslate) => {
        if (!textToTranslate) {
            console.log("You need to enter a text to translate. Please try again.");
            runTranlator();
            return
        }
        const { destinationLanguage } = await inquirer.prompt([
            {
              type: 'list',
              name: 'destinationLanguage',
              message: 'Select the destination language:',
              choices: languages,
              loop: false,
            }
          ]);
        const prompt = await promptTemplate.invoke({ textToTranslate, destinationLanguage: defaultLanguage ?? destinationLanguage });

        const res = await model.invoke(prompt);
        console.log({ translation: res.content });
        rl.question("Do you want to translate another text? Y/n: ", async (answer) => {
            if (!answer ||answer.toLowerCase() === "y") {
                runTranlator();
                return
            } else {
                rl.close();
                return
            }
        });
    });
}
runTranlator();
