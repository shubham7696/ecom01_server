

const printConsoleLogs = (message?: any, ...optionalParams: any[]): void => {
  //if (process.env.NODE_MODE === 'dev') {
    console.log(message, optionalParams);
  //}
};

export { printConsoleLogs};