console.log('Waiting for 3s');
const sendInterval = setTimeout(() => {
  console.log('done waiting, exiting')
  process.exit();
}, 3000);
