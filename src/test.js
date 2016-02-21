import on3 from './app.js';

console.log('on3 ', on3);

on3.increment({flag: '',gitmsg: "This is a test."}, () => {return;});
on3.publish({gitmsg: "This is also a test."}, () => {return;});
