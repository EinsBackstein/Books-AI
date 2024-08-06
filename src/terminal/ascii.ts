// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import gradient from 'gradient-string';
import figlet from 'figlet';

const renderAscii = async () => {
  console.log(
    gradient('#FF0000', '#0000FF').multiline(await generateAsciiArt())
  );
};

async function generateAsciiArt() {
  return new Promise((resolve, reject) => {
    figlet.text(
      'Books AI',
      {
        font: 'kban',
      },
      function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

export default renderAscii;
