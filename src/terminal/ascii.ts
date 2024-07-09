// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import gradient from 'gradient-string';
import figlet from 'figlet';

const renderAscii = async () =>{
  console.log(
    gradient('#FF0000', '#0000FF').multiline(await generateAsciiArt())
  );
};

async function generateAsciiArt() {
  return new Promise((resolve, reject) => {
    // figlet docs: https://www.npmjs.com/package/figlet
    figlet.text(
      'FileSeach CLI',
      {
        font: 'slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      },
      function (err, data) {
        if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
}


export default renderAscii;