const readline = require("node:readline");
const fs = require("node:fs");
const path = require("node:path");

const notesDirectory = path.join(__dirname, "notes");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askForNextAction() {
  rl.question("\nDeseja realizar outra ação? (s/n): ", (answer) => {
    if (answer.toLowerCase() === "s") {
      showMenu();
    } else {
      console.log("Encerrando...");
      rl.close();
      process.exit(0);
    }
  });
}

function showMenu() {
  console.clear();
  console.log("Escolha uma opção:");
  console.log("1-Criar anotações");
  console.log("2-Ver anotações salvas");
  console.log("3-Verificar uma anotação");
  console.log("4-Excluir uma anotação");
  console.log("5-Sair");

  rl.question("Digite o número da opção desejada: ", (opcao) => {
    switch (opcao) {
      case "1":
        createAnnotation();
        break;
      case "2":
        listsNotes();
        askForNextAction();
        break;
      case "3":
        analyzeAnnotation();

        break;
      case "4":
        deleteAnnotation();

        break;
      case "5":
        console.log("Encerrando.");
        rl.close();
        break;
      default:
        console.log(`Opção inválida!`);
        showMenu();
    }
  });
}

function createAnnotation() {
  rl.question("Nome da anotação:", (name) => {
    rl.question("Conteúdo da anotação:\n", (content) => {
      const filePath = path.join(__dirname, "notes", name);
      fs.writeFile(filePath, content, (error) => {
        if (error) {
          console.error("Erro ao escrever anotação: " + error.message);
        } else {
          console.log("Anotação criada com sucesso!");
          askForNextAction();
        }
      });
    });
  });
}

function listsNotes() {
  const notes = fs.readdirSync(notesDirectory);
  if (notes.length === 0) {
    return console.log("Nenhuma nota encontrada.");
  } else {
    console.log("Notas salvas:"),
      notes.forEach((note, index) => {
        console.log(`${index + 1}. ${note}`);
      });
  }
}

function analyzeAnnotation() {
  const notes = fs.readdirSync(notesDirectory);
  if (notes.length === 0) {
    console.log("Nenhuma nota encontrada.");
    return askForNextAction();
  }
  listsNotes();
  rl.question("Digite o número da anotação que desejar ler:", (index) => {
    const noteIndex = parseInt(index) - 1;
    const notes = fs.readdirSync(notesDirectory);

    if (noteIndex < 0 || noteIndex >= notes.length) {
      console.log("Número inválido! Tente novamente.");
      return analyzeAnnotation();
    }
    const filePath = path.join(notesDirectory, notes[noteIndex]);
    fs.readFile(filePath, "utf-8", (err, text) => {
      if (err) {
        console.error("Error ao ler anotação: " + err.message);
      } else {
        console.log(`Conteúdo da anotação "${notes[noteIndex]}":\n${text}`);
      }
      askForNextAction();
    });
  });
}
function deleteAnnotation() {
  const notes = fs.readdirSync(notesDirectory);
  if (notes.length === 0) {
    console.log("Nenhuma nota encontrada.");
    return askForNextAction();
  }
  listsNotes();
  rl.question("Digite o número da anotação que deseja excluir:", (index) => {
    const noteIndex = parseInt(index) - 1;
    const notes = fs.readdirSync(notesDirectory);
    if (noteIndex < 0 || noteIndex >= notes.length) {
      console.log("Número inválido! Tente novamente.");
      return deleteAnnotation();
    }
    const filePath = path.join(notesDirectory, notes[noteIndex]);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Erro ao excluir a anotação: " + err.message);
      } else {
        console.log("Anotação excluida com sucesso!");
      }
      askForNextAction();
    });
  });
}

showMenu();
