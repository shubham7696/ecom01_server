const printConsoleLog = (message: string): void => {
  if (process.env.NODE_MODE === 'dev') {
    console.log(message);
  }
};

const printConsoleLogs = (message?: any, ...optionalParams: any[]): void => {
  if (process.env.NODE_MODE === 'dev') {
    console.log(message, optionalParams);
  }
};

export { printConsoleLog, printConsoleLogs};